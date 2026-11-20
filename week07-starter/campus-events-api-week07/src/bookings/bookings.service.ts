import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { Booking } from '../generated/prisma/client.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Booking[]> {
    return this.prisma.booking.findMany({ orderBy: { createdAt: 'desc' } });
  }

  // C1: everything happens in ONE transaction, so a failure rolls back every step.
  // The check "do the seats fit?" is part of the UPDATE statement itself
  // (UPDATE ... WHERE id = X AND booked <= capacity - seats), so two students
  // booking the last seat at the same moment cannot both succeed.
  create(eventId: number, dto: CreateBookingDto): Promise<Booking> {
    return this.prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({ where: { id: eventId } });
      if (!event) throw new NotFoundException(`Event ${eventId} not found`);

      const updated = await tx.event.updateMany({
        where: { id: eventId, booked: { lte: event.capacity - dto.seats } },
        data: { booked: { increment: dto.seats } },
      });

      if (updated.count === 0) {
        const left = event.capacity - event.booked;
        throw new ConflictException(`Only ${left} seat(s) left`);
      }

      return tx.booking.create({ data: { ...dto, eventId } });
    });
  }

  // C2: delete the booking AND give its seats back, both in one transaction
  // (array form: both statements succeed together or fail together).
  async remove(id: number): Promise<void> {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException(`Booking ${id} not found`);

    await this.prisma.$transaction([
      this.prisma.booking.delete({ where: { id } }),
      this.prisma.event.update({
        where: { id: booking.eventId },
        data: { booked: { decrement: booking.seats } },
      }),
    ]);
  }
}
