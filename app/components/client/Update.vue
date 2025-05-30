<template>
  <UModal
    title="Update client"
    :ui="{footer: 'justify-end'}"
    description="Edit the client details below.">
    <template #body>
      <UForm
        id="form"
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
        @click="emit('close', false)" />
      <UButton
        label="Save"
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
import {type ClientSelect, type ClientUpdate} from '~~/server/database/schema';

const toast = useToast();

const props = defineProps<{
  client: ClientSelect;
}>();

const emit = defineEmits<{close: [boolean]}>();

const state = reactive<ClientUpdate>({
  firstName: props.client.firstName,
  lastName: props.client.lastName,
  email: props.client.email,
  phoneNumber: props.client.phoneNumber,
  company: props.client.company,
  companyNumber: props.client.companyNumber,
});

const submit = async (payload: FormSubmitEvent<ClientUpdate>) => {
  try {
    await $fetch(`/api/clients/${props.client.id}`, {
      method: 'PATCH',
      body: payload.data,
    });

    await refreshNuxtData('clients');

    emit('close', true);

    toast.add({
      title: 'Success',
      description: 'The client was updated succesfully!',
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
