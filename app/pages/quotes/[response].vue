<template>
  <div v-if="data">
    <h1>Quote info:</h1>
    <p v-if="data.additionalInfo">
      <strong>Additional Info:</strong> {{ data.additionalInfo }}
    </p>
    <ul>
      <li v-for="(quoteItem, idx) in data.quoteItems" :key="idx">
        <strong>Item:</strong> {{ quoteItem.item.name }},
        <strong>Quantity:</strong> {{ quoteItem.quantity }}
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
import {type QuoteResponseUpdate} from '~~/server/database/schema';

definePageMeta({
  layout: false,
});

const route = useRoute();

const toast = useToast();

const {data} = await useFetch(`/api/quotes/${route.params.response}`);

const state = reactive({
  status: '' as 'accepted' | 'declined' | 'commented',
  additionalInfo: '' as string | null,
});

const formRef = ref();

const buttonStatus = (status: 'accepted' | 'declined') => {
  if (status === 'accepted') {
    state.status = 'accepted';
  } else if (status === 'declined') {
    state.status = state.additionalInfo ? 'commented' : 'declined';
  }
  formRef.value.submit();
};

const submit = async (payload: FormSubmitEvent<QuoteResponseUpdate>) => {
  try {
    await $fetch(`/api/quotes/${route.params.response}`, {
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
