<template>
  <UModal title="Add Technician" v-model:open="open">
    <UButton label="New technician" />

    <template #body>
      <UForm
        :schema="technicianInsertSchema"
        :state="state"
        @submit="submit"
        class="space-y-4">
        <UFormField label="Email" name="user.email">
          <UInput v-model="state.user.email" type="email" />
        </UFormField>
        <UFormField label="Password" name="user.password">
          <UInput v-model="state.user.password" type="password" />
        </UFormField>
        <UFormField label="First Name" name="firstName">
          <UInput v-model="state.firstName" />
        </UFormField>
        <UFormField label="Last Name" name="lastName">
          <UInput v-model="state.lastName" />
        </UFormField>
        <UButton type="submit">Submit</UButton>
      </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import {technicianInsertSchema, type TechnicianInsert} from '~~/server/database/schema'; // Adjust path as needed
import type {FormSubmitEvent} from '@nuxt/ui';
import type {NuxtError} from '#app';

const open = ref(false);

const state = reactive({
  user: {
    email: '',
    password: '',
  },
  firstName: '',
  lastName: '',
});

const toast = useToast();

const submit = async (payload: FormSubmitEvent<TechnicianInsert>) => {
  try {
    await $fetch('/api/users/technicians', {
      method: 'POST',
      body: payload.data,
    });

    open.value = false;
  } catch (err) {
    const error = err as NuxtError;

    toast.add({
      title: 'Error',
      description:
        error.statusMessage ||
        'Oops! Something went wrong. Please try again later.',
      color: 'error',
    });
  }
};
</script>
