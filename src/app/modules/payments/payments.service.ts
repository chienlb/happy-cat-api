import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model } from 'mongoose';
import {
  Payment,
  PaymentDocument,
  PaymentStatus,
} from './schema/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Request } from 'express';
import { envSchema } from 'src/app/configs/env/env.config';
import {
  Subscription,
  SubscriptionDocument,
  SubscriptionStatus,
} from '../subscriptions/schema/subscription.schema';
import {
  Purchase,
  PurchaseDocument,
  PurchaseStatus,
} from '../purchases/schema/purchase.schema';
import { User, UserDocument } from '../users/schema/user.schema';
import { Package, PackageDocument } from '../packages/schema/package.schema';
import {
  Client,
  OrdersController,
  OrderRequest,
  AmountWithBreakdown,
  CheckoutPaymentIntent,
  OrderApplicationContextLandingPage,
  OrderApplicationContextUserAction,
  Environment,
} from '@paypal/paypal-server-sdk';
import * as crypto from 'crypto';
import * as qs from 'qs';
import { getClientIp } from 'request-ip';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private paypalClient: Client;
  private ordersController: OrdersController;

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Purchase.name) private purchaseModel: Model<PurchaseDocument>,
    @InjectModel(Package.name) private packageModel: Model<PackageDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {
    const env = envSchema.parse(process.env);

    // Initialize PayPal client
    this.paypalClient = new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: env.PAYPAL_CLIENT_ID ?? '',
        oAuthClientSecret: env.PAYPAL_CLIENT_SECRET ?? '',
      },
      environment: env.PAYPAL_MODE === 'live' ? Environment.Production : Environment.Sandbox,
    });

    this.ordersController = new OrdersController(this.paypalClient);
  }

  // VNPay helper methods
  private sortObject(obj: Record<string, any>) {
    const sorted: Record<string, string> = {};
    const keys = Object.keys(obj).sort();

    for (const key of keys) {
      // VNPAY demo: encodeURIComponent và đổi %20 thành '+'
      sorted[key] = encodeURIComponent(String(obj[key])).replace(/%20/g, '+');
    }
    return sorted;
  }

  private buildSignDataNoEncode(params: Record<string, string | number>) {
    const sorted = this.sortObject(params);
    return qs.stringify(sorted, { encode: false });
  }

  private signVNPay(secretKey: string, vnpParamsEncoded: Record<string, string>) {
    const signData = qs.stringify(vnpParamsEncoded, { encode: false });
    this.logger.log(`[DEBUG] VNPay signData: ${signData}`);

    return crypto
      .createHmac('sha512', secretKey)
      .update(Buffer.from(signData, 'utf-8'))
      .digest('hex');
  }

  private formatDate(date: Date) {
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    return (
      date.getFullYear().toString() +
      pad(date.getMonth() + 1) +
      pad(date.getDate()) +
      pad(date.getHours()) +
      pad(date.getMinutes()) +
      pad(date.getSeconds())
    );
  }

  private verifyChecksum(query: any, env: any) {
    const secureHash = query.vnp_SecureHash;

    // Create a copy to avoid mutating original query
    const vnpParams = { ...query };
    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;

    const sorted = this.sortObject(vnpParams);
    const signed = this.signVNPay(env.VNPAY_HASH_SECRET, sorted);

    this.logger.log(`[DEBUG] VNPay verification - Expected hash: ${secureHash}`);
    this.logger.log(`[DEBUG] VNPay verification - Calculated hash: ${signed}`);
    this.logger.log(`[DEBUG] VNPay params: ${JSON.stringify(sorted)}`);

    return secureHash === signed;
  }

  async createPayment(userId: string, dto: CreatePaymentDto, req: Request) {
    const env = envSchema.parse(process.env);

    // Route to appropriate payment method
    if (dto.method === 'vnpay') {
      return this.createVNPayPayment(userId, dto, req);
    } else if (dto.method === 'paypal') {
      return this.createPayPalPayment(userId, dto, req);
    } else {
      throw new BadRequestException(`Payment method ${dto.method} not supported`);
    }
  }

  private verifyVNPayReturn(query: any, hashSecret: string) {
    const receivedHash = String(query?.vnp_SecureHash ?? '').toLowerCase();
    if (!receivedHash) return false;

    const vnpParams: Record<string, any> = { ...query };
    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;

    // Ensure scalar values (Express can parse arrays)
    for (const k of Object.keys(vnpParams)) {
      const v = vnpParams[k];
      if (Array.isArray(v)) vnpParams[k] = v[0];
      // normalize undefined/null to empty? generally not needed; better to delete
      if (vnpParams[k] === undefined || vnpParams[k] === null) delete vnpParams[k];
    }

    const calculated = this.signVNPay(hashSecret, vnpParams).toLowerCase();

    this.logger.log(`[DEBUG] VNPay verify - received:   ${receivedHash}`);
    this.logger.log(`[DEBUG] VNPay verify - calculated: ${calculated}`);
    this.logger.log(`[DEBUG] VNPay verify params: ${JSON.stringify(this.sortObject(vnpParams))}`);

    return receivedHash === calculated;
  }

  // =========================
  // CREATE VNPAY PAYMENT (FULL)
  // =========================

  /**
   * Creates VNPay payment URL
   * - Uses encode:false for both signing and URL building (like VNPAY sample)
   * - Amount is integer = amount*100
   */
  public async createVNPayPayment(userId: string, dto: any, req: Request) {
    const env = envSchema.parse(process.env);

    const clientIp = getClientIp(req) || req.ip || '127.0.0.1';
    const now = new Date();
    const orderId = now.getTime().toString();
    const expireDate = new Date(now.getTime() + 15 * 60 * 1000);

    // Sanitize OrderInfo similar to your approach
    const orderInfoRaw = dto.description ?? `Thanh toan don hang ${orderId}`;
    const orderInfo = String(orderInfoRaw).replace(/[^\w\s\-.,]/g, '');

    const params: Record<string, string | number> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: env.VNPAY_TMN_CODE ?? '',
      vnp_Amount: Math.round(Number(dto.amount) * 100), // IMPORTANT: integer
      vnp_CurrCode: 'VND',
      vnp_IpAddr: String(clientIp),
      vnp_Locale: 'vn',
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other',
      vnp_ReturnUrl: env.VNPAY_RETURN_URL ?? '',
      vnp_CreateDate: this.formatDate(now),
      vnp_ExpireDate: this.formatDate(expireDate),
      vnp_TxnRef: orderId,
      // Optional:
      // vnp_BankCode: dto.bankCode ?? ''
    };

    // Remove optional empty fields (important to avoid signing empty keys)
    Object.keys(params).forEach((k) => {
      const v = params[k];
      if (v === '' || v === undefined || v === null) delete params[k];
    });

    const sorted = this.sortObject(params);

    const secureHash = this.signVNPay(env.VNPAY_HASH_SECRET ?? '', sorted);

    // Build payment URL EXACTLY like sample: encode:false
    const paymentUrl =
      `${env.VNPAY_API_URL}?` +
      qs.stringify({ ...sorted, vnp_SecureHash: secureHash }, { encode: false });

    this.logger.log(`[DEBUG] VNPay paymentUrl: ${paymentUrl}`);

    // Save payment (keep your schema logic)
    await this.paymentModel.create({
      userId,
      amount: dto.amount,
      currency: 'VND',
      method: 'vnpay',
      description: dto.description,
      transactionId: orderId,
      status: PaymentStatus.PENDING,
      subscriptionId: dto.subscriptionId,
    });

    return { paymentUrl, orderId };
  }

  // =========================
  // HANDLE VNPAY RETURN (FULL)
  // =========================

  public async handleVNPayReturn(query: any, session?: any) {
    if (this.connection.readyState !== 1) {
      throw new BadRequestException('Database not ready.');
    }

    const mongooseSession = session ?? (await this.connection.startSession());
    const isNewSession = !session;

    if (isNewSession) mongooseSession.startTransaction();

    try {
      const env = envSchema.parse(process.env);

      const txnRef = query?.vnp_TxnRef;
      if (!txnRef) throw new BadRequestException('Missing vnp_TxnRef');

      this.logger.log(`[DEBUG] VNPay return txnRef: ${txnRef}`);
      this.logger.log(`[DEBUG] VNPay return query: ${JSON.stringify(query)}`);

      const ok = this.verifyVNPayReturn(query, env.VNPAY_HASH_SECRET ?? '');
      if (!ok) {
        throw new BadRequestException('Invalid VNPay checksum');
      }

      // VNPAY success: ResponseCode=00 and TransactionStatus=00 (recommended)
      const success =
        String(query.vnp_ResponseCode) === '00' &&
        String(query.vnp_TransactionStatus ?? '00') === '00';

      // Update payment status
      const payment = await this.paymentModel.findOneAndUpdate(
        { transactionId: txnRef },
        {
          status: success ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
          paidAt: new Date(),
        },
        { new: true, session: mongooseSession },
      );

      if (!payment) {
        throw new NotFoundException(`Payment not found for transaction: ${txnRef}`);
      }

      // Activate services if successful
      if (success) {
        await this.activateServices(txnRef, mongooseSession);
      }

      if (isNewSession) await mongooseSession.commitTransaction();
      return { success, data: payment };
    } catch (err: any) {
      if (isNewSession) await mongooseSession.abortTransaction();
      this.logger.error(`[ERROR] handleVNPayReturn: ${err.message}`, err.stack);
      throw err;
    } finally {
      if (isNewSession) await mongooseSession.endSession();
    }
  }

  private async createPayPalPayment(userId: string, dto: CreatePaymentDto, req: Request) {
    const env = envSchema.parse(process.env);
    const now = new Date();
    const orderId = now.getTime().toString();

    try {
      // Create PayPal order
      const orderRequest: OrderRequest = {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            amount: {
              currencyCode: dto.currency,
              value: dto.amount.toFixed(2),
            } as AmountWithBreakdown,
            description: dto.description ?? `Order ${orderId}`,
            referenceId: orderId,
          },
        ],
        applicationContext: {
          returnUrl: env.PAYPAL_RETURN_URL ?? 'http://localhost:5173/payment/callback',
          cancelUrl: env.PAYPAL_CANCEL_URL ?? 'http://localhost:5173/payment/cancel',
          brandName: 'English Learning Platform',
          landingPage: OrderApplicationContextLandingPage.Billing,
          userAction: OrderApplicationContextUserAction.PayNow,
        },
      };

      const { result, ...httpResponse } = await this.ordersController.createOrder({
        body: orderRequest,
      });

      if (!result.id) {
        throw new BadRequestException('Failed to create PayPal order');
      }

      // Find approval URL
      const approvalUrl = result.links?.find((link) => link.rel === 'approve')?.href;

      if (!approvalUrl) {
        throw new BadRequestException('No approval URL found in PayPal response');
      }

      // Save payment to database
      await this.paymentModel.create({
        userId: userId,
        amount: dto.amount,
        currency: dto.currency,
        method: dto.method,
        description: dto.description,
        transactionId: result.id,
        status: PaymentStatus.PENDING,
        subscriptionId: dto.subscriptionId, // Store packageId in subscriptionId field
      });

      this.logger.log(
        `[DEBUG] PayPal order created successfully with ID: ${result.id}`,
      );

      return { paymentUrl: approvalUrl, orderId: result.id };
    } catch (error) {
      this.logger.error(`[ERROR] Failed to create PayPal order: ${error.message}`, error.stack);
      if (error.result) {
        this.logger.error(`[ERROR] PayPal API Response: ${JSON.stringify(error.result)}`);
      }
      throw new BadRequestException(`Failed to create payment: ${error.message}`);
    }
  }

  private async activateServices(
    transactionId: string,
    session: ClientSession,
  ) {
    if (this.connection.readyState !== 1) {
      throw new BadRequestException('Database not ready.');
    }

    const mongooseSession = session ?? (await this.connection.startSession());
    const isNewSession = !session;

    if (isNewSession) {
      mongooseSession.startTransaction();
    }
    try {
      // Find payment
      const payment = await this.paymentModel
        .findOne({ transactionId })
        .session(mongooseSession);
      if (!payment) throw new NotFoundException('Payment not found');

      // Find or create purchase
      let purchase = await this.purchaseModel
        .findOne({ transactionId })
        .session(mongooseSession);

      let subscriptionActive = await this.subscriptionModel
        .findOne({ _id: payment.subscriptionId })
        .session(mongooseSession);

      let packageId = subscriptionActive?.packageId;

      if (!purchase && payment.subscriptionId) {
        // Create purchase if it doesn't exist (subscriptionId contains packageId)
        purchase = await this.purchaseModel.create(
          [
            {
              userId: payment.userId,
              packageId: packageId!,
              transactionId: transactionId,
              amount: payment.amount,
              currency: payment.currency,
              status: PurchaseStatus.SUCCESS,
            },
          ],
          { session: mongooseSession },
        ).then((docs) => docs[0]);

        this.logger.log(
          `[DEBUG] Purchase created for transaction ID: ${transactionId}, packageId: ${payment.subscriptionId}`,
        );

        if (subscriptionActive) {
          subscriptionActive.status = SubscriptionStatus.ACTIVE;
          await subscriptionActive.save({ session: mongooseSession });
        }

      } else if (purchase) {
        // Update existing purchase
        purchase.status = PurchaseStatus.SUCCESS;
        await purchase.save({ session: mongooseSession });

        this.logger.log(
          `[DEBUG] Purchase updated status to SUCCESS for transaction ID: ${transactionId}`,
        );
      }

      if (!purchase) {
        this.logger.warn(
          `[WARNING] No purchase found and subscriptionId is missing for transaction: ${transactionId}`,
        );
        if (isNewSession) {
          await mongooseSession.commitTransaction();
        }
        return { payment };
      }

      // Find user
      const user = await this.userModel
        .findById(purchase.userId)
        .session(mongooseSession);
      if (!user) throw new NotFoundException('User not found');

      const packagedId = purchase.packageId.toString();
      if (!packagedId) throw new NotFoundException('Package not found');

      const packageResult = await this.packageModel
        .findById(packagedId)
        .session(mongooseSession);
      if (!packageResult) throw new NotFoundException('Package not found');

      // Set user package
      user.accountPackage = packageResult.type;
      await user.save({ session: mongooseSession });

      this.logger.log(
        `[DEBUG] User updated package to ${packageResult.type} for transaction ID: ${transactionId}`,
      );

      // Subscription was already updated above if it existed
      // Check if subscription exists by subscriptionId or paymentId
      if (subscriptionActive) {
        // Already updated subscription status above
        this.logger.log(
          `[DEBUG] Subscription already updated for transaction ID: ${transactionId}`,
        );
      } else {
        // Only create new subscription if it doesn't exist at all
        const existingSubscription = await this.subscriptionModel
          .findOne({
            userId: payment.userId,
            packageId: purchase.packageId,
            status: SubscriptionStatus.PENDING
          })
          .session(mongooseSession);

        if (existingSubscription) {
          // Update existing pending subscription
          existingSubscription.status = SubscriptionStatus.ACTIVE;
          existingSubscription.startDate = new Date();
          existingSubscription.endDate = new Date(
            new Date().setDate(
              new Date().getDate() + packageResult.durationInDays,
            ),
          );
          await existingSubscription.save({ session: mongooseSession });

          this.logger.log(
            `[DEBUG] Existing subscription updated to ACTIVE for transaction ID: ${transactionId}`,
          );
        } else {
          // Create new subscription only if no subscription exists
          this.logger.log(
            `[DEBUG] No subscription found, skipping creation (subscription should be created when user selects package)`,
          );
        }
      }

      if (isNewSession) {
        await mongooseSession.commitTransaction();
      }
      return { purchase, user, subscription: subscriptionActive };
    } catch (error) {
      if (isNewSession) {
        await mongooseSession.abortTransaction();
      }
      throw new Error('Failed to activate services: ' + error.message);
    } finally {
      if (isNewSession) {
        await mongooseSession.endSession();
      }
    }
  }

  async handleReturn(query: any, session?: ClientSession) {
    // Check if it's VNPay or PayPal based on query parameters
    if (query.vnp_TxnRef) {
      return this.handleVNPayReturn(query, session);
    } else if (query.token) {
      return this.handlePayPalReturn(query, session);
    } else {
      throw new BadRequestException('Invalid payment return parameters');
    }
  }

  private async handlePayPalReturn(query: any, session?: ClientSession) {
    if (this.connection.readyState !== 1) {
      throw new BadRequestException('Database not ready.');
    }

    const mongooseSession = session ?? (await this.connection.startSession());
    const isNewSession = !session;

    if (isNewSession) {
      mongooseSession.startTransaction();
    }
    try {
      const { token, PayerID } = query;

      if (!token) {
        throw new BadRequestException('Missing PayPal token');
      }

      this.logger.log(`[DEBUG] Processing PayPal return for token: ${token}`);

      // Capture the order
      const { result, ...httpResponse } = await this.ordersController.captureOrder({
        id: token,
      });

      this.logger.log(`[DEBUG] PayPal capture response status: ${result.status}`);

      const success = result.status === 'COMPLETED';

      // Update payment status FIRST
      const payment = await this.paymentModel.findOneAndUpdate(
        { transactionId: token },
        {
          status: success ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
          paidAt: new Date(),
        },
        { new: true, session: mongooseSession },
      );

      if (!payment) {
        throw new NotFoundException(`Payment not found for token: ${token}`);
      }

      const subscription = await this.subscriptionModel
        .findById(payment.subscriptionId)
        .session(mongooseSession);

      if (!subscription){
        throw new NotFoundException(`Subscription not found for ID: ${payment.subscriptionId}`);
      }

      subscription.status = success ? SubscriptionStatus.ACTIVE : SubscriptionStatus.CANCELLED;
      await subscription.save({ session: mongooseSession });

      this.logger.log(`[DEBUG] Payment status updated to ${payment.status}`);

      // Then activate services if successful
      if (success) {
        await this.activateServices(token, mongooseSession);
        this.logger.log(
          `[DEBUG] Services activated successfully for PayPal order: ${token}`,
        );
      }

      if (isNewSession) {
        await mongooseSession.commitTransaction();
        this.logger.log(`[DEBUG] Transaction committed for token: ${token}`);
      }

      return { success, data: payment };
    } catch (error) {
      if (isNewSession) {
        await mongooseSession.abortTransaction();
        this.logger.error(`[ERROR] Transaction aborted for handleReturn: ${error.message}`);
      }
      this.logger.error(`[ERROR] Failed to handle return: ${error.message}`, error.stack);
      throw new Error('Failed to handle return: ' + error.message);
    } finally {
      if (isNewSession) {
        await mongooseSession.endSession();
      }
    }
  }

  async handleWebhook(body: any, session?: ClientSession) {
    if (this.connection.readyState !== 1) {
      throw new BadRequestException('Database not ready.');
    }

    const mongooseSession = session ?? (await this.connection.startSession());
    const isNewSession = !session;

    if (isNewSession) {
      mongooseSession.startTransaction();
    }
    try {
      // PayPal webhook event
      const { event_type, resource } = body;

      this.logger.log(`[DEBUG] PayPal webhook event: ${event_type}`);

      if (event_type === 'PAYMENT.CAPTURE.COMPLETED') {
        const orderId = resource.id;
        const success = resource.status === 'COMPLETED';

        this.logger.log(`[DEBUG] Processing capture for order: ${orderId}, status: ${resource.status}`);

        // Update payment status FIRST
        const payment = await this.paymentModel.findOneAndUpdate(
          { transactionId: orderId },
          {
            status: success ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
            paidAt: new Date(),
          },
          { new: true, session: mongooseSession },
        );

        if (!payment) {
          this.logger.warn(`[WARNING] Payment not found for order: ${orderId}`);
        } else {
          this.logger.log(`[DEBUG] Payment status updated to ${payment.status} for order: ${orderId}`);
        }

        // Then activate services if successful
        if (success && payment) {
          await this.activateServices(orderId, mongooseSession);
          this.logger.log(
            `[DEBUG] Services activated successfully for PayPal order: ${orderId}`,
          );
        }
      }

      if (isNewSession) {
        await mongooseSession.commitTransaction();
        this.logger.log(`[DEBUG] Webhook transaction committed`);
      }

      return { success: true, message: 'Webhook processed' };
    } catch (error) {
      if (isNewSession) {
        await mongooseSession.abortTransaction();
        this.logger.error(`[ERROR] Webhook transaction aborted: ${error.message}`);
      }
      this.logger.error(`[ERROR] Failed to handle webhook: ${error.message}`, error.stack);
      throw new Error('Failed to handle webhook: ' + error.message);
    } finally {
      if (isNewSession) {
        await mongooseSession.endSession();
      }
    }
  }

  async handleVNPayIPN(body: any) {
    if (this.connection.readyState !== 1) {
      throw new BadRequestException('Database not ready.');
    }

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const env = envSchema.parse(process.env);

      this.logger.log(`[DEBUG] VNPay IPN received - vnp_TxnRef: ${body.vnp_TxnRef}`);

      // Verify checksum
      if (!this.verifyChecksum(body, env)) {
        this.logger.error(`[ERROR] VNPay IPN - Invalid checksum for transaction: ${body.vnp_TxnRef}`);
        await session.abortTransaction();
        await session.endSession();
        return { RspCode: '97', Message: 'Invalid checksum' };
      }

      const orderId = body.vnp_TxnRef;
      const responseCode = body.vnp_ResponseCode;
      const transactionStatus = body.vnp_TransactionStatus;

      // Find payment
      const payment = await this.paymentModel.findOne(
        { transactionId: orderId }
      ).session(session);

      if (!payment) {
        this.logger.warn(`[WARNING] VNPay IPN - Payment not found for transaction: ${orderId}`);
        await session.abortTransaction();
        await session.endSession();
        return { RspCode: '01', Message: 'Order not found' };
      }

      // Check if already processed
      if (payment.status === PaymentStatus.SUCCESS) {
        this.logger.log(`[DEBUG] VNPay IPN - Transaction already processed: ${orderId}`);
        await session.abortTransaction();
        await session.endSession();
        return { RspCode: '00', Message: 'Success' };
      }

      // Process based on transaction status
      if (responseCode === '00' && transactionStatus === '00') {
        // Payment successful
        payment.status = PaymentStatus.SUCCESS;
        payment.paidAt = new Date();
        await payment.save({ session });

        this.logger.log(`[DEBUG] VNPay IPN - Payment marked SUCCESS for transaction: ${orderId}`);

        // Activate services
        await this.activateServices(orderId, session);

        this.logger.log(`[DEBUG] VNPay IPN - Services activated for transaction: ${orderId}`);

        await session.commitTransaction();
        await session.endSession();

        return { RspCode: '00', Message: 'Success' };
      } else {
        // Payment failed
        payment.status = PaymentStatus.FAILED;
        payment.paidAt = new Date();
        await payment.save({ session });

        this.logger.log(
          `[DEBUG] VNPay IPN - Payment marked FAILED for transaction: ${orderId}, responseCode: ${responseCode}`,
        );

        await session.commitTransaction();
        await session.endSession();

        return { RspCode: '00', Message: 'Success' };
      }
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();

      this.logger.error(`[ERROR] VNPay IPN exception: ${error.message}`, error.stack);
      return { RspCode: '99', Message: 'System error' };
    }
  }
}
