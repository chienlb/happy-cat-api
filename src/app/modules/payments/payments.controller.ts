import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import type { Request } from 'express';
import mongoose, { ClientSession } from 'mongoose';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/role.decorator';
import { UserRole } from '../users/schema/user.schema';
import { UseGuards } from '@nestjs/common';
import { ok } from '../../common/response/api-response';


@Controller('payments')
@ApiTags('Payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post('create')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiBody({
    description: 'Create a new payment',
    type: CreatePaymentDto,
  })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(@Body() dto: CreatePaymentDto, @Req() req: Request) {
    try {
      const result = await this.paymentsService.createPayment((req as any).user.userId, dto, req);
      return ok(result, 'Payment created successfully');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('return')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Handle return payment' })
  @ApiQuery({ name: 'query', type: Object })
  @ApiResponse({ status: 200, description: 'Payment returned successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async handleReturn(@Query() query: any, @Req() req: Request) {
    try {
      const result = await this.paymentsService.handleReturn(query);
      return ok(result, 'Payment returned successfully');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('ipn')
  @ApiOperation({ summary: 'VNPay IPN (GET) – URL đăng ký với VNPay' })
  @ApiQuery({ name: 'query', type: Object })
  async handleIpnGet(@Query() query: any) {
    return this.paymentsService.handleWebhook(query);
  }

  @Post('ipn')
  @ApiOperation({ summary: 'VNPay IPN (POST) – URL đăng ký với VNPay' })
  @ApiQuery({ name: 'query', type: Object })
  async handleIpn(@Query() query: any) {
    return this.paymentsService.handleWebhook(query);
  }

  @Get('webhook')
  @ApiOperation({ summary: 'VNPay IPN (GET) – alias của /ipn' })
  @ApiQuery({ name: 'query', type: Object })
  async handleWebhookGet(@Query() query: any) {
    return this.paymentsService.handleWebhook(query);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'VNPay IPN (POST) – alias của /ipn' })
  @ApiQuery({ name: 'query', type: Object })
  @ApiResponse({ status: 200, description: 'IPN xử lý thành công (VNPay cần RspCode + Message)' })
  async handleWebhook(@Query() query: any, @Req() req: Request) {
    return this.paymentsService.handleWebhook(query);
  }
}
