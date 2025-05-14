<template>
  <UModal
    v-model:open="open"
    title="Create a supplier"
    :ui="{footer: 'justify-end'}">
    <UButton label="New supplier" color="neutral" variant="subtle" />

    <template #body>
      <UForm :state="state" class="flex flex-col gap-4" @submit="submit">
        <UFormField label="Name" name="name">
          <UInput v-model="state.name" />
        </UFormField>
        <UFormField label="Email" name="email">
          <UInput v-model="state.email" type="email" />
        </UFormField>
        <UFormField label="Phone Number" name="phoneNumber">
          <UInput v-model="state.phoneNumber" />
        </UFormField>
        <UButton label="Submit" color="neutral" type="submit" class="mt-2" />
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type {NuxtError} from '#app';
import type {FormSubmitEvent} from '@nuxt/ui';
import type { SupplierInsert } from '~~/server/database/schema';

const toast = useToast();
const open = ref(false);

const state = reactive({
  name: '',
  email: '',
  phoneNumber: '',
});

const submit = async (payload: FormSubmitEvent<SupplierInsert>) => {
  try {
    await $fetch('/api/suppliers', {
      method: 'POST',
      body: payload.data,
    });

    open.value = false;

    toast.add({
      title: 'Success',
      description: 'The supplier was inserted succesfully!',
      color: 'success',
    });

    await refreshNuxtData('suppliers');
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
