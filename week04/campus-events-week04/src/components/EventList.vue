<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CampusEvent, Category } from '../types'
import EventCard from './EventCard.vue'

const props = defineProps<{
  events: CampusEvent[]
}>()

const emit = defineEmits<{
  (e: 'book', id: number): void
}>()

const search = ref('')
const category = ref<Category | 'all'>('all')

const visible = computed(() => {
  if (!props.events) return [] // Prevents undefined crashes
  const query = search.value.trim().toLowerCase()
  return props.events.filter((event) => {
    const matchesCategory = category.value === 'all' || event.category === category.value
    const matchesSearch = 
      event.title.toLowerCase().includes(query) || 
      event.location.toLowerCase().includes(query)
    return matchesCategory && matchesSearch
  })
})
</script>

<template>
  <div class="event-list-container">
    <div class="controls">
      <input 
        v-model="search" 
        type="text" 
        placeholder="Search events..." 
      />
      <select v-model="category">
        <option value="all">All</option>
        <option value="talk">Talk</option>
        <option value="workshop">Workshop</option>
        <option value="social">Social</option>
        <option value="sport">Sport</option>
      </select>
    </div>

    <p class="counter">{{ visible.length }} of {{ events?.length ?? 0 }} events</p>

    <div v-if="visible.length > 0" class="cards-grid">
      <EventCard 
        v-for="e in visible" 
        :key="e.id" 
        :event="e" 
        @book="emit('book', $event)" 
      />
    </div>
    <p v-else class="empty">No events match</p>
  </div>
</template>