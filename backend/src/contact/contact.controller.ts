import { Controller, Get, Post, Body } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactMessage } from '../database/database.service';

@Controller('api/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  async getAll() {
    return this.contactService.findAll();
  }

  @Post()
  async create(@Body() body: Omit<ContactMessage, 'id' | 'created_at'>) {
    return this.contactService.create(body);
  }
}
