<template>
  <UModal
    v-model:open="open"
    :title="`Create a ${props.type} category`"
    :ui="{footer: 'justify-end'}">
    <UButton label="New category" color="neutral" variant="subtle" />

    <template #body>
      <UForm :state="state" class="flex flex-col gap-4" @submit="submit">
        <UFormField label="Name" name="name">
          <UInput v-model="state.name" />
        </UFormField>
        <UButton label="Submit" color="neutral" type="submit" class="mt-2" />
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type {NuxtError} from '#app';
import type {FormSubmitEvent} from '@nuxt/ui';
import {type CategoryInsert} from '~~/server/database/schema';

const props = defineProps<{
  type: 'product' | 'service';
}>();

const toast = useToast();

const open = ref(false);

const state = reactive({
  name: '',
});

const submit = async (payload: FormSubmitEvent<CategoryInsert>) => {
  try {
    await $fetch('/api/categories', {
      method: 'POST',
      body: payload.data,
      query: {type: props.type},
    });

    open.value = false;

    toast.add({
      title: 'Success',
      description: 'The category was inserted succesfully!',
      color: 'success',
    });

    await refreshNuxtData(`${props.type}Categories`);
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
