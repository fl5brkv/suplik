<template>
  <UPageCard
    title="Password"
    description="Confirm your current password before setting a new one."
    variant="subtle">
    <UForm
      :schema="passwordSchema"
      :state="state"
      @submit="submit"
      class="flex flex-col gap-4 max-w-xs">
      <UFormField name="current">
        <UInput
          v-model="state.password"
          :type="showCurrent ? 'text' : 'password'"
          placeholder="Current password"
          class="w-full"
          :ui="{trailing: 'pe-1'}">
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="showCurrent ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="showCurrent ? 'Hide password' : 'Show password'"
              :aria-pressed="showCurrent"
              aria-controls="current-password"
              @click="showCurrent = !showCurrent" />
          </template>
        </UInput>
      </UFormField>

      <UFormField name="new">
        <UInput
          v-model="state.newPassword"
          :type="showNew ? 'text' : 'password'"
          placeholder="New password"
          class="w-full"
          :ui="{trailing: 'pe-1'}">
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="showNew ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              :aria-label="showNew ? 'Hide password' : 'Show password'"
              :aria-pressed="showNew"
              aria-controls="new-password"
              @click="showNew = !showNew" />
          </template>
        </UInput>
      </UFormField>
      <UButton label="Update" class="w-fit" type="submit" />
    </UForm>
  </UPageCard>
</template>

<script setup lang="ts">
import type {NuxtError} from '#app';
import type {FormSubmitEvent} from '@nuxt/ui';
import {passwordSchema, type Password} from '~~/server/database/schema';

const toast = useToast();

const showCurrent = ref(false);
const showNew = ref(false);

definePageMeta({
  layout: 'technician',
});

const state = reactive<Password>({
  password: '',
  newPassword: '',
});

const submit = async (payload: FormSubmitEvent<Password>) => {
  try {
    await $fetch('/api/users/password', {
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
