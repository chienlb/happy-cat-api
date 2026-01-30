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

  async createPayment(userId: string, dto: CreatePaymentDto, req: Request) {
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
}
