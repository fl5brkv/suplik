<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="loginSchema"
        title="Login"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :fields="fields"
        @submit="submit" />
    </UPageCard>
  </div>
</template>

<script setup lang="ts">
import type {FormSubmitEvent} from '@nuxt/ui';
import {loginSchema, type Login} from '~~/server/database/schema';
import type {NuxtError} from '#app';
const {fetch} = useUserSession();

definePageMeta({
  layout: false,
});

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

const submit = async (payload: FormSubmitEvent<Login>) => {
  try {
    await $fetch('/api/users/login', {
      method: 'POST',
      body: payload.data,
    });

    await fetch();

    const {user} = useUserSession();

    if (user.value && user.value.technician) {
      await navigateTo('/technician/jobs');
    } else {
      await navigateTo('/admin/demands');
    }
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
