import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { Reservation } from '../database/database.service';

@Controller('api/reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  async getAll() {
    return this.reservationsService.findAll();
  }

  @Post()
  async create(@Body() body: Omit<Reservation, 'id' | 'booking_code' | 'status' | 'created_at'>) {
    return this.reservationsService.create(body);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'Pending' | 'Confirmed' | 'Cancelled'
  ) {
    return this.reservationsService.updateStatus(Number(id), status);
  }
}
