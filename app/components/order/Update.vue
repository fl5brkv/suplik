<template>
  <UModal :title="`Update order`" :ui="{footer: 'justify-end'}">
    <template #body>
      name:
      <p>{{ props.order.item.name }}</p>
      quantity:
      <p>{{ props.order.quantity }}</p>

      <UForm :state="state" class="flex flex-col gap-4" @submit="submit">
        <USelect
          v-model="state.status"
          :items="statusOptions"
          class="w-48"
          placeholder="Select status" />

        <UFormField label="Delivery" name="delivery">
          <UInput v-model="state.delivery" />
        </UFormField>

        <UButton label="Submit" color="neutral" type="submit" class="mt-2" />
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type {NuxtError} from '#app';
import type {FormSubmitEvent} from '@nuxt/ui';
import {type OrderSelect, type OrderUpdate} from '~~/server/database/schema';

const toast = useToast();

const props = defineProps<{
  order: OrderSelect;
}>();

const emit = defineEmits<{close: [boolean]}>();

const statusOptions = ['sent', 'accepted', 'delivered', 'declined'];

const state = reactive({
  id: props.order.id,
  status: props.order.status,
  delivery: props.order.delivery,
});

const submit = async (payload: FormSubmitEvent<OrderUpdate>) => {
  try {
    await $fetch('/api/orders', {
      method: 'PATCH',
      body: payload.data,
    });

    await refreshNuxtData('orders');

    emit('close', true);

    toast.add({
      title: 'Success',
      description: 'The order was updated succesfully!',
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
