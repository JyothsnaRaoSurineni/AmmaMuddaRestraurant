import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService, Order } from '../database/database.service';

@Injectable()
export class OrdersService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll(): Promise<Order[]> {
    return this.dbService.getOrders();
  }

  async create(data: Omit<Order, 'id' | 'order_code' | 'status' | 'created_at'>): Promise<Order> {
    if (!data.customer_name || !data.customer_phone || !data.table_or_address || !data.items_json) {
      throw new BadRequestException('Customer name, phone, table/address, and ordered items are required.');
    }
    return this.dbService.createOrder(data);
  }

  async updateStatus(
    id: number,
    status: 'Order Received' | 'Preparing in Kitchen' | 'Out for Delivery' | 'Completed' | 'Cancelled'
  ): Promise<Order> {
    const updated = await this.dbService.updateOrderStatus(id, status);
    if (!updated) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return updated;
  }
}
