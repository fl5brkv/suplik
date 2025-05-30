<template>
  <UModal
    v-model:open="open"
    title="New service"
    :ui="{footer: 'justify-end'}"
    description="Fill in the product details below.">
    <UButton label="New service" />

    <template #body>
      <UForm
        id="form"
        :state="state"
        class="flex flex-col gap-4"
        @submit="submit">
        <UFormField label="Category" name="categoryId" required>
          <USelect
            v-model="state.categoryId"
            :items="data"
            :loading="status === 'pending'"
            placeholder="Select category"
            class="w-48" />
        </UFormField>

        <UFormField label="Name" name="name" required>
          <UInput v-model="state.name" />
        </UFormField>

        <UFormField name="isPublic">
          <UCheckbox label="Is public" v-model="state.isPublic" />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <UButton
        label="Cancel"
        color="neutral"
        variant="outline"
        @click="open = false" />
      <UButton
        label="Submit"
        color="neutral"
        type="submit"
        form="form"
        class="ml-2"
        loading-auto />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type {NuxtError} from '#app';
import type {FormSubmitEvent} from '@nuxt/ui';
import {
  type CategorySelect,
  type ServiceInsert,
} from '~~/server/database/schema';

const toast = useToast();

const open = ref(false);

const {data, status} = await useFetch('/api/categories', {
  key: 'categories',
  transform: (data: CategorySelect[]) => {
    return data?.map((category) => ({
      label: category.name,
      value: category.id,
    }));
  },
  lazy: true,
});

const state = reactive({
  name: '',
  categoryId: 0,
  isPublic: false,
});

const submit = async (payload: FormSubmitEvent<ServiceInsert>) => {
  try {
    await $fetch('/api/services', {
      method: 'POST',
      body: payload.data,
    });

    await refreshNuxtData('services');

    open.value = false;

    toast.add({
      title: 'Success',
      description: 'The service was inserted succesfully!',
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
