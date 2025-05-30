<template>
  <UModal
    title="New order"
    :ui="{footer: 'justify-end'}"
    description="Submit order details to email the supplier.">
    <template #body>
      <div class="mb-4">
        <div>
          <span class="font-semibold">Name:</span> {{ props.product.name }}
        </div>
        <div>
          <span class="font-semibold">Stock:</span> {{ props.product.stock }}
        </div>
        <div>
          <span class="font-semibold">Reserved:</span>
          {{ props.product.reserved }}
        </div>
      </div>
      <UForm
        id="form"
        :state="state"
        class="flex flex-col gap-4"
        @submit="submit">
        <UFormField label="Quantity" name="quantity" required>
          <UInputNumber v-model="state.quantity" />
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
        color="neutral"
        type="submit"
        form="form"
        class="ml-2" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type {NuxtError} from '#app';
import type {FormSubmitEvent} from '@nuxt/ui';
import {type ProductSelect, type OrderInsert} from '~~/server/database/schema';

const toast = useToast();

const props = defineProps<{
  product: ProductSelect;
}>();

const emit = defineEmits<{close: [boolean]}>();

const state = reactive({
  productId: props.product.id,
  quantity: 0,
});

const submit = async (payload: FormSubmitEvent<OrderInsert>) => {
  try {
    await $fetch('/api/orders', {
      method: 'POST',
      body: payload.data,
    });

    await refreshNuxtData('orders');

    emit('close', true);

    toast.add({
      title: 'Success',
      description: 'The order was sent to suppliers email!',
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
