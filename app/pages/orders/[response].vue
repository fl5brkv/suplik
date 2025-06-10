<template>
  <div v-if="data">
    <h1>Order info:</h1>
    <p v-if="data.product.name">
      <strong>Product name:</strong> {{ data.product.name }}
    </p>

    <p v-if="data.quantity"><strong>Product quantity:</strong> {{ data.quantity }}</p>

    <UForm
      ref="formRef"
      :state="state"
      class="flex flex-col gap-4"
      @submit="submit">
      <UFormField label="Delivery" name="delivery">
        <UInput v-model="state.delivery" />
      </UFormField>

      <UButtonGroup>
        <UButton
          label="Accept"
          color="success"
          type="button"
          @click="buttonStatus('accepted')" />
        <UButton
          label="Decline"
          color="error"
          type="button"
          @click="buttonStatus('declined')" />
      </UButtonGroup>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type {NuxtError} from '#app';
import type {FormSubmitEvent} from '@nuxt/ui';
import {
  type OrderResponseUpdate,
} from '~~/server/database/schema';

definePageMeta({
  layout: false,
});

const route = useRoute();

const toast = useToast();

const {data} = await useFetch(`/api/orders/response/${route.params.response}`);

const state = reactive({
  status: '' as 'accepted' | 'declined',
  delivery: '',
});

const formRef = ref();

const buttonStatus = async (status: 'accepted' | 'declined') => {
  state.status = status;

  await formRef.value.submit();
};

const submit = async (payload: FormSubmitEvent<OrderResponseUpdate>) => {
  try {
    await $fetch(`/api/orders/response/${route.params.response}`, {
      method: 'PATCH',
      body: payload.data,
    });

    toast.add({
      title: 'Success',
      description: 'The updated order was sent to us!',
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
