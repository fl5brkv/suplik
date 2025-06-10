<template>
  <UModal
    title="Add Technician"
    v-model:open="open"
    description="Fill in the details to add a new technician.">
    <UButton label="New technician" />

    <template #body>
      <UForm
        id="form"
        :schema="technicianInsertSchema"
        :state="state"
        @submit="submit"
        class="space-y-4">
        <UFormField label="Email" name="user.email" required>
          <UInput v-model="state.user.email" type="email" />
        </UFormField>
        <UFormField label="Password" name="user.password" required>
          <UInput v-model="state.user.password" type="password" />
        </UFormField>
        <UFormField label="First Name" name="firstName" required>
          <UInput v-model="state.firstName" />
        </UFormField>
        <UFormField label="Last Name" name="lastName" required>
          <UInput v-model="state.lastName" />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <UButton
        label="Cancel"
        color="neutral"
        variant="outline"
        @click="open = false" />
      <UButton label="Submit" form="form" color="primary" type="submit" />
    </template>
  </UModal>
</template>
<script setup lang="ts">
import {
  technicianInsertSchema,
  type TechnicianInsert,
} from '~~/server/database/schema';
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

    await refreshNuxtData('technicians');

    open.value = false;

    toast.add({
      title: 'Success',
      description: 'The technician was inserted succesfully!',
      color: 'success',
    });
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
