import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { bookingsApi } from "../api/bookings";
import { eventsApi } from "../api/events";
import { useEventsStore } from "./events";
import { ApiError } from "../api/http";
import type { CampusEvent, BookingInput, Booking } from "../types";

export const useBookingsStore = defineStore("bookings", () => {
  const bookings = ref<Booking[]>([]);

  const totalSeats = computed(() => bookings.value.reduce((sum, b) => sum + b.seats, 0));

  async function fetchAll() {
    bookings.value = await bookingsApi.list();
  }

  async function cancel(booking: Booking) {
    // Fix: Bypass the missing bookingsApi.delete and use native fetch
    await fetch(`http://localhost:3000/bookings/${booking.id}`, { method: 'DELETE' });
    
    bookings.value = bookings.value.filter(b => b.id !== booking.id);
    const event = useEventsStore().byId(booking.eventId);
    if (event) {
      const updatedEvent = await eventsApi.setBooked(event.id, event.booked - booking.seats);
      useEventsStore().replace(updatedEvent);
    }
  }

  async function book(event: CampusEvent, input: BookingInput) {
    const seatsLeft = event.capacity - event.booked;
    if (input.seats > seatsLeft) {
      throw new ApiError(409, "Not enough seats left.");
    }

    const newBooking = await bookingsApi.create({
      eventId: event.id,
      name: input.name,
      email: input.email,
      seats: input.seats,
      createdAt: new Date().toISOString()
    });

    const updatedEvent = await eventsApi.setBooked(event.id, event.booked + input.seats);
    useEventsStore().replace(updatedEvent);
    bookings.value.unshift(newBooking);
    
    return newBooking;
  }

  return { bookings, totalSeats, fetchAll, cancel, book };
});