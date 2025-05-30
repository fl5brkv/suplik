<template>
  <UForm :schema="technicianUpdateSchema" :state="state" @submit="submit">
    <UPageCard
      title="Profile"
      variant="naked"
      orientation="horizontal"
      class="mb-4">
      <UButton
        label="Save changes"
        color="neutral"
        type="submit"
        class="w-fit lg:ms-auto" />
    </UPageCard>

    <UPageCard variant="subtle">
      <UFormField
        name="firstName"
        label="First Name"
        required
        :loading="status === 'pending'"
        class="flex max-sm:flex-col justify-between items-start gap-4">
        <UInput v-model="state.firstName" />
      </UFormField>
      <USeparator />
      <UFormField
        name="lastName"
        label="Last Name"
        required
        :loading="status === 'pending'"
        class="flex max-sm:flex-col justify-between items-start gap-4">
        <UInput v-model="state.lastName" />
      </UFormField>
      <USeparator />
      <UFormField
        name="email"
        label="Email"
        required
        :loading="status === 'pending'"
        class="flex max-sm:flex-col justify-between items-start gap-4">
        <UInput v-model="state.user.email" type="email" autocomplete="off" />
      </UFormField>
    </UPageCard>
  </UForm>
</template>

<script setup lang="ts">
import type {NuxtError} from '#app';
import type {FormSubmitEvent} from '@nuxt/ui';
import {
  technicianUpdateSchema,
  type TechnicianSecSelect,
  type TechnicianUpdate,
} from '~~/server/database/schema';

definePageMeta({
  layout: 'technician',
});
const toast = useToast();

const {user} = useUserSession();

const {data, status} = await useFetch<TechnicianSecSelect>(
  `/api/users/${user.value?.id}`,
  {
    method: 'get',
    lazy: true,
  }
);

const state = reactive<TechnicianUpdate>({
  firstName: '',
  lastName: '',
  user: {
    email: '',
  },
});

watch(
  () => data.value,
  (newData) => {
    if (newData?.technician) {
      state.firstName = newData.technician.firstName;
      state.lastName = newData.technician.lastName;
      state.user.email = newData.email;
    }
  },
  {immediate: true}
);

const submit = async (payload: FormSubmitEvent<TechnicianUpdate>) => {
  try {
    await $fetch(`/api/users/technicians/${data.value?.technician.id}`, {
      method: 'PATCH',
      body: payload.data,
    });

    toast.add({
      title: 'Success',
      description: 'Updated succesfully!',
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
