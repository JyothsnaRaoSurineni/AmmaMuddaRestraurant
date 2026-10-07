import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService, Reservation } from '../database/database.service';

@Injectable()
export class ReservationsService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll(): Promise<Reservation[]> {
    return this.dbService.getReservations();
  }

  async create(data: Omit<Reservation, 'id' | 'booking_code' | 'status' | 'created_at'>): Promise<Reservation> {
    if (!data.name || !data.email || !data.phone || !data.reservation_date || !data.reservation_time) {
      throw new BadRequestException('All mandatory reservation fields must be provided.');
    }
    return this.dbService.createReservation(data);
  }

  async updateStatus(id: number, status: 'Pending' | 'Confirmed' | 'Cancelled'): Promise<Reservation> {
    const res = await this.dbService.updateReservationStatus(id, status);
    if (!res) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }
    return res;
  }
}
