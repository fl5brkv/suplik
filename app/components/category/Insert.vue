<template>
  <UModal
    v-model:open="open"
    title="Create a category"
    :ui="{footer: 'justify-end'}"
    description="Enter the name for the new category.">
    <UButton label="New category" />

    <template #body>
      <UForm
        id="form"
        :state="state"
        class="flex flex-col gap-4"
        @submit="submit">
        <UFormField label="Name" name="name" required>
          <UInput v-model="state.name" />
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
import {type CategoryInsert} from '~~/server/database/schema';

const toast = useToast();

const open = ref(false);

const state = reactive<CategoryInsert>({
  name: '',
});

const submit = async (payload: FormSubmitEvent<CategoryInsert>) => {
  try {
    await $fetch('/api/categories', {
      method: 'POST',
      body: payload.data,
    });

    open.value = false;

    toast.add({
      title: 'Success',
      description: 'The category was inserted succesfully!',
      color: 'success',
    });

    await refreshNuxtData('categories');
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
