<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="signupSchema"
        title="Create user"
        description="Enter credentials of new admin / technician"
        icon="i-lucide-user"
        :fields="fields"
        @submit="onSubmit" />
    </UPageCard>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod';
import type {FormSubmitEvent} from '@nuxt/ui';
import {signupSchema} from '~~/server/database/schema/tables/users';

const toast = useToast();

const fields = ref([
  {
    name: 'email',
    type: 'text' as const,
    label: 'Email',
    placeholder: 'me@matate.sk'
  },
  {
    name: 'password',
    type: 'password' as const,
    label: 'Password',
    placeholder: 'password123'
  },
]);

type Schema = z.output<typeof signupSchema>;

const onSubmit = async (payload: FormSubmitEvent<Schema>) => {
  try {
    await $fetch('/api/users/signup', {
      method: 'POST',
      body: payload.data,
    });
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description:
        err.data?.message ||
        err.statusMessage ||
        'Oops! Something went wrong. Please try again later.',
      color: 'error',
    });
  }
};
</script>
