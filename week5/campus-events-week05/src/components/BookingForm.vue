<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { validateBooking } from '../validation';
import type { BookingInput } from '../types';

const props = defineProps<{
  seatsLeft: number;
  pending?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', form: BookingInput): void;
}>();

const form = reactive<BookingInput>({ name: "", email: "", seats: 1 });
const submitted = ref(false);
const errors = computed(() => validateBooking(form, props.seatsLeft));

function onSubmit() {
  submitted.value = true;
  if (Object.keys(errors.value).length === 0) {
    emit('submit', { 
      name: form.name.trim(), 
      email: form.email.trim(), 
      seats: form.seats 
    });
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div>
      <label>Name</label>
      <input name="name" v-model="form.name" type="text" />
      <p class="error" v-if="submitted && errors.name">{{ errors.name }}</p>
    </div>

    <div>
      <label>Email</label>
      <input name="email" v-model="form.email" type="email" />
      <p class="error" v-if="submitted && errors.email">{{ errors.email }}</p>
    </div>

    <div>
      <label>Seats</label>
      <input name="seats" v-model.number="form.seats" type="number" />
      <p class="error" v-if="submitted && errors.seats">{{ errors.seats }}</p>
    </div>

    <button :disabled="pending" type="submit">
      {{ pending ? 'Booking...' : 'Book' }}
    </button>
  </form>
</template>