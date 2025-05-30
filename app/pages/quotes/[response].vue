<template>
  <div v-if="data">
    <h1>Quote info:</h1>

    <p v-if="data.additionalInfo">
      <strong>Additional Info:</strong> {{ data.additionalInfo }}
    </p>

    <h2>Products</h2>
    <ul v-if="data.quoteProducts && data.quoteProducts.length">
      <li
        v-for="(productItem, idx) in data.quoteProducts"
        :key="'product-' + idx">
        <strong>Product:</strong> {{ productItem.product.name }},
        <strong>Quantity:</strong> {{ productItem.quantity }}
      </li>
    </ul>

    <h2>Services</h2>
    <ul v-if="data.quoteServices && data.quoteServices.length">
      <li
        v-for="(serviceItem, idx) in data.quoteServices"
        :key="'service-' + idx">
        <strong>Service:</strong> {{ serviceItem.service.name }},
        <strong>Quantity:</strong> {{ serviceItem.quantity }}
      </li>
    </ul>

    <UForm
      ref="formRef"
      :state="state"
      class="flex flex-col gap-4"
      @submit="submit">
      <UFormField label="Additional Info From You" name="additionalInfo">
        <UTextarea v-model="state.additionalInfo" />
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
  type QuoteResponseSelect,
  type QuoteResponseInsert,
} from '~~/server/database/schema';

definePageMeta({
  layout: false,
});

const route = useRoute();

const toast = useToast();

const {data, error, status} = await useLazyFetch<QuoteResponseSelect>(
  `/api/quotes/response/${route.params.response}`,
  {
    method: 'get',
  }
);

const state = reactive({
  status: '' as 'accepted' | 'declined' | 'commented',
  additionalInfo: '' as string | null,
});

const formRef = ref();

const buttonStatus = async (status: 'accepted' | 'declined') => {
  if (status === 'accepted') {
    state.status = 'accepted';
  } else if (status === 'declined') {
    state.status = state.additionalInfo ? 'commented' : 'declined';
  }
  await formRef.value.submit();
};

const submit = async (payload: FormSubmitEvent<QuoteResponseInsert>) => {
  try {
    await $fetch(`/api/quotes/response/${route.params.response}`, {
      method: 'POST',
      body: payload.data,
    });

    toast.add({
      title: 'Success',
      description: 'The updated quote was sent to us!',
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
