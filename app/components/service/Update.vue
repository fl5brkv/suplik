<template>
  <UModal :title="`New service`" :ui="{footer: 'justify-end'}">
    <UButton label="New service" color="neutral" variant="subtle" />

    <template #body>
      <UForm :state="state" class="flex flex-col gap-4" @submit="submit">
        <USelect
          :items="data"
          :loading="status === 'pending'"
          placeholder="Select category"
          class="w-48"
          v-model="state.categoryId" />

        <UFormField label="Name" name="name">
          <UInput v-model="state.name" />
        </UFormField>

        <UCheckbox required label="Is public" v-model="state.isPublic" />

        <UButton label="Submit" color="neutral" type="submit" class="mt-2" />
      </UForm>
      {{ state }}
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type {NuxtError} from '#app';
import type {FormSubmitEvent} from '@nuxt/ui';
import {
  type CategorySelect,
  type ItemSelect,
  type ItemUpdate,
} from '~~/server/database/schema';

const toast = useToast();

const props = defineProps<{
  service: ItemSelect;
}>();

const emit = defineEmits<{close: [boolean]}>();

const {data, status} = await useFetch('/api/categories', {
  query: {type: 'service'},
  transform: (data: CategorySelect[]) => {
    return data?.map((category) => ({
      label: category.name,
      value: category.id,
    }));
  },
  lazy: true,
});

const state = reactive({
  ...props.service,
});

const submit = async (payload: FormSubmitEvent<ItemUpdate>) => {
  try {
    await $fetch('/api/items', {
      method: 'PATCH',
      body: (({productDetail, ...rest}) => rest)(payload.data),
      query: {type: 'service'},
    });

    await refreshNuxtData('services');

    emit('close', true);

    toast.add({
      title: 'Success',
      description: 'The service was updated succesfully!',
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
