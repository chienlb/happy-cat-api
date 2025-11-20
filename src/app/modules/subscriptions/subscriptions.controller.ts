import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a subscription' })
  @ApiBody({
    type: CreateSubscriptionDto,
    description: 'The subscription data',
    examples: {
      normal: {
        summary: 'Example of a normal subscription',
        value: {
          userId: '1234567890',
          packageId: '1234567890',
          startDate: '2021-01-01',
          endDate: '2021-01-01',
          status: 'active',
          autoRenew: true,
          paymentId: '1234567890',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The subscription has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.createSubscription(createSubscriptionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all subscriptions' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'sort', type: String, required: false })
  @ApiQuery({ name: 'order', type: String, required: false })
  @ApiResponse({
    status: 200,
    description: 'The subscriptions have been successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  findAll(
    @Query()
    query: {
      page: number;
      limit: number;
      sort: string;
      order: 'asc' | 'desc';
    },
  ) {
    return this.subscriptionsService.findAllSubscriptions(
      query.page,
      query.limit,
      query.sort,
      query.order,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a subscription by id' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The id of the subscription',
    example: '1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'The subscription has been successfully retrieved.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  findOne(@Param('id') id: string) {
    return this.subscriptionsService.findSubscriptionById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a subscription' })
  @ApiBody({
    type: UpdateSubscriptionDto,
    description: 'The subscription data',
    examples: {
      normal: {
        summary: 'Example of a normal subscription',
        value: {
          userId: '1234567890',
          packageId: '1234567890',
          startDate: '2021-01-01',
          endDate: '2021-01-01',
          status: 'active',
          autoRenew: true,
          paymentId: '1234567890',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The subscription has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.updateSubscription(
      id,
      updateSubscriptionDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a subscription' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The id of the subscription',
    example: '1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'The subscription has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  delete(@Param('id') id: string) {
    return this.subscriptionsService.deleteSubscription(id);
  }
}
