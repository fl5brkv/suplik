<template>
  <UModal :title="`New product`" :ui="{footer: 'justify-end'}">
    <UButton label="New product" color="neutral" variant="subtle" />

    <template #body>
      name:
      <p>{{ props.product.name }}</p>
      stock:
      <p>{{ props.product.productDetail?.stock }}</p>
      reserved:
      <p>{{ props.product.productDetail?.reserved }}</p>

      <UForm :state="state" class="flex flex-col gap-4" @submit="submit">
        <UFormField label="Quantity" name="quantity">
          <UInputNumber v-model="state.quantity" />
        </UFormField>

        <UButton label="Submit" color="neutral" type="submit" class="mt-2" />
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type {NuxtError} from '#app';
import type {FormSubmitEvent} from '@nuxt/ui';
import {type ItemSelect, type OrderInsert} from '~~/server/database/schema';

const toast = useToast();

const props = defineProps<{
  product: ItemSelect;
}>();

const emit = defineEmits<{close: [boolean]}>();

const state = reactive({
  itemId: props.product.id,
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
