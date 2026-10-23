<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { initialEvents } from './data/events'
import type { CampusEvent } from './types'
import EventList from './components/EventList.vue'

// Import directly from initialEvents
const events = ref<CampusEvent[]>(structuredClone(initialEvents))
const myBookings = ref<number[]>([])

// Bonus: Read saved bookings from localStorage on startup
try {
  const saved = localStorage.getItem('myBookings')
  if (saved) {
    const ids = JSON.parse(saved) as number[]
    myBookings.value = ids
    ids.forEach((id) => {
      const match = events.value.find((e) => e.id === id)
      if (match) match.booked++
    })
  }
} catch (e) {
  console.error('Failed to parse myBookings from localStorage', e)
}

// Bonus: Watch myBookings and save to localStorage
watch(
  myBookings,
  (newVal) => {
    localStorage.setItem('myBookings', JSON.stringify(newVal))
  },
  { deep: true }
)

// Computed booking count and text matching App.test.ts
const bookingCount = computed(() => myBookings.value.length)
const bookingText = computed(() => {
  return bookingCount.value === 1
    ? 'You have booked 1 seat.'
    : `You have booked ${bookingCount.value} seats.`
})

// Booking handler
function onBook(id: number) {
  const event = events.value.find((e) => e.id === id)
  if (event && event.booked < event.capacity) {
    event.booked++
    myBookings.value.push(id)
  }
}
</script>

<template>
  <header>
    <div class="container">
      <h1>Campus Events</h1>
      <p>{{ bookingText }}</p>
    </div>
  </header>
  <main>
    <EventList :events="events" @book="onBook" />
  </main>
</template>