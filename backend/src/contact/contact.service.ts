import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService, ContactMessage } from '../database/database.service';

@Injectable()
export class ContactService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll(): Promise<ContactMessage[]> {
    return this.dbService.getContactMessages();
  }

  async create(data: Omit<ContactMessage, 'id' | 'created_at'>): Promise<ContactMessage> {
    if (!data.name || !data.email || !data.message) {
      throw new BadRequestException('Name, email, and message are required.');
    }
    return this.dbService.createContactMessage(data);
  }
}
