<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      lyvyzex@mailinator.com
      <hr />
      Pa$$w0rd!
      <UAuthForm
        :schema="signupSchema"
        title="Login"
        description="Enter your credentials to access your account."
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
import type {NuxtError} from '#app';
const {fetch} = useUserSession();

const toast = useToast();

const fields = ref([
  {
    name: 'email',
    type: 'text' as const,
    label: 'Email',
    placeholder: 'me@matate.sk',
  },
  {
    name: 'password',
    type: 'password' as const,
    label: 'Password',
    placeholder: 'password123',
  },
]);

type Schema = z.output<typeof signupSchema>;

const onSubmit = async (payload: FormSubmitEvent<Schema>) => {
  try {
    await $fetch('/api/users/login', {
      method: 'POST',
      body: payload.data,
    });

    await fetch();
    await navigateTo('/clients');
  } catch (err: any) {
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
