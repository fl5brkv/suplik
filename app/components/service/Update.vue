<template>
  <UModal title="Update service" :ui="{footer: 'justify-end'}"
  description="Edit the service details below."">
    <template #body>
      <UForm id="form" :state="state" class="flex flex-col gap-4" @submit="submit">
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
import {
  type CategorySelect,
  type ServiceSelect,
  type ServiceUpdate,
} from '~~/server/database/schema';

const toast = useToast();

const props = defineProps<{
  service: ServiceSelect;
}>();

const emit = defineEmits<{close: [boolean]}>();

const {data, status} = await useFetch('/api/categories', {
  transform: (data: CategorySelect[]) => {
    return data?.map((category) => ({
      label: category.name,
      value: category.id,
    }));
  },
  lazy: true,
});

const state = reactive<ServiceUpdate>({
  categoryId: props.service.categoryId,
  name: props.service.name,
  isPublic: props.service.isPublic,
});

const submit = async (payload: FormSubmitEvent<ServiceUpdate>) => {
  try {
    await $fetch(`/api/services/${props.service.id}`, {
      method: 'PATCH',
      body: payload.data,
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
