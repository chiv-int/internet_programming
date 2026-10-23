<script setup lang="ts">
import { computed } from 'vue'
import type { CampusEvent } from '../types'
import { formatDate } from '../format'

const props = defineProps<{
  event: CampusEvent
}>()

const emit = defineEmits<{
  (e: 'book', id: number): void
}>()

const left = computed(() => props.event.capacity - props.event.booked)
const isFull = computed(() => left.value <= 0)
const almostFull = computed(() => left.value >= 1 && left.value <= 5)
</script>

<template>
  <!-- Must be <article> for App.test.ts -->
  <article class="event-card" :class="{ full: isFull }">
    <span class="category">{{ event.category }}</span>
    <h2>{{ event.title }}</h2>
    <p class="date">{{ formatDate(event.startsAt) }}</p>
    <p class="location">{{ event.location }}</p>

    <div class="seats">
      <span v-if="isFull" class="badge badge-full">Full</span>
      <span v-else :class="{ warn: almostFull }">
        {{ left === 1 ? '1 seat left' : `${left} seats left` }}
      </span>
    </div>

    <button 
      :disabled="isFull" 
      @click="emit('book', event.id)"
    >
      Book a seat
    </button>
  </article>
</template>