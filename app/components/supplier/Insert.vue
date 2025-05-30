<template>
  <UModal
    v-model:open="open"
    title="New supplier"
    :ui="{footer: 'justify-end'}"
    description="Fill in the details to add a new supplier.">
    <UButton label="New supplier" />

    <template #body>
      <UForm
        id="form"
        :state="state"
        class="flex flex-col gap-4"
        @submit="submit">
        <UFormField label="Name" name="name" required>
          <UInput v-model="state.name" />
        </UFormField>
        <UFormField label="Email" name="email" required>
          <UInput v-model="state.email" type="email" />
        </UFormField>
        <UFormField label="Phone Number" name="phoneNumber">
          <UInput v-model="state.phoneNumber" />
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
import type {NuxtError} from '#app';
import type {FormSubmitEvent} from '@nuxt/ui';
import type {SupplierInsert} from '~~/server/database/schema';

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
