<template>
  <UModal
    title="Update order"
    :ui="{footer: 'justify-end'}"
    description="Edit the order details below.">
    <template #body>
      <div class="mb-4">
        <div>
          <span class="font-semibold">Name:</span>
          {{ props.order.product.name }}
        </div>
        <div>
          <span class="font-semibold">Quantity:</span>
          {{ props.order.quantity }}
        </div>
      </div>

      <UForm
        id="form"
        :state="state"
        class="flex flex-col gap-4"
        @submit="submit">
        <UFormField label="Status" name="status">
          <USelect
            v-model="state.status"
            :items="statusOptions"
            class="w-48"
            placeholder="Select status" />
        </UFormField>

        <UFormField label="Delivery" name="delivery">
          <UInput v-model="state.delivery" />
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
        label="Submit"
        form="form"
        color="neutral"
        type="submit"
        class="ml-2" />
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

const state = reactive<OrderUpdate>({
  productId: props.order.productId,
  status: props.order.status,
  quantity: props.order.quantity,
  delivery: props.order.delivery,
});

const submit = async (payload: FormSubmitEvent<OrderUpdate>) => {
  try {
    await $fetch(`/api/orders/${props.order.id}`, {
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
