import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { EventsService } from '../events/events.service.js';
import type { Booking } from './booking.entity.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';

@Injectable()
export class BookingsService {
  private bookings: Booking[] = [];
  private nextId = 1;

  constructor(private readonly events: EventsService) {}

  findAll(): Booking[] {
    return [...this.bookings].reverse();
  }

  create(eventId: number, dto: CreateBookingDto): Booking {
    const event = this.events.findOne(eventId);
    const left = event.capacity - event.booked;

    if (dto.seats > left) {
      throw new ConflictException(`Only ${left} seat(s) left`);
    }

    event.booked += dto.seats;
    const newBooking: Booking = {
      id: this.nextId++,
      eventId,
      createdAt: new Date().toISOString(),
      ...dto,
    };
    this.bookings.push(newBooking);
    return newBooking;
  }

  remove(id: number): void {
    const index = this.bookings.findIndex((b) => b.id === id);
    if (index === -1) throw new NotFoundException(`Booking #${id} not found`);

    const booking = this.bookings[index];
    const event = this.events.findOne(booking.eventId);
    event.booked -= booking.seats;
    this.bookings.splice(index, 1);
  }
}