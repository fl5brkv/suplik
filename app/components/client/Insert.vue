<template>
  <UModal
    v-model:open="open"
    title="New client"
    :ui="{footer: 'justify-end'}"
    description="Provide new client details below.">
    <UButton label="New client" />

    <template #body>
      <UForm
        id="form"
        :schema="clientInsertSchema"
        :state="state"
        class="flex flex-col gap-4"
        @submit="submit">
        <UFormField label="First Name" name="firstName" required>
          <UInput v-model="state.firstName" required />
        </UFormField>
        <UFormField label="Last Name" name="lastName" required>
          <UInput v-model="state.lastName" required />
        </UFormField>
        <UFormField label="Email" name="email" required>
          <UInput v-model="state.email" type="email" required />
        </UFormField>
        <UFormField label="Phone Number" name="phoneNumber" required>
          <UInput v-model="state.phoneNumber" required />
        </UFormField>
        <UFormField label="Company" name="company">
          <UInput v-model="state.company" />
        </UFormField>
        <UFormField label="Company Number" name="companyNumber">
          <UInput v-model="state.companyNumber" />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <UButton
        label="Cancel"
        color="neutral"
        variant="outline"
        @click="open = false" />
      <UButton
        label="Submit"
        color="primary"
        type="submit"
        form="form"
        class="ml-2" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type {NuxtError} from '#app';
import type {FormSubmitEvent} from '@nuxt/ui';
import {clientInsertSchema, type ClientInsert} from '~~/server/database/schema';

const toast = useToast();

const open = ref(false);

const state = reactive<ClientInsert>({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  company: '',
  companyNumber: '',
});

const submit = async (payload: FormSubmitEvent<ClientInsert>) => {
  try {
    await $fetch('/api/clients', {
      method: 'POST',
      body: payload.data,
    });

    await refreshNuxtData('clients');

    open.value = false;

    toast.add({
      title: 'Success',
      description: 'The client was inserted succesfully!',
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
