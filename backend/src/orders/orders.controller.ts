import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from '../database/database.service';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getAll() {
    return this.ordersService.findAll();
  }

  @Post()
  async create(@Body() body: Omit<Order, 'id' | 'order_code' | 'status' | 'created_at'>) {
    return this.ordersService.create(body);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'Order Received' | 'Preparing in Kitchen' | 'Out for Delivery' | 'Completed' | 'Cancelled'
  ) {
    return this.ordersService.updateStatus(Number(id), status);
  }
}
