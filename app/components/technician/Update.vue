<template>
  <UModal
    title="Update Technician"
    :ui="{footer: 'justify-end'}"
    description="Edit the technician details below.">
    <template #body>
      <UForm
        id="form"
        :schema="technicianUpdateSchema"
        :state="state"
        @submit="submit"
        class="space-y-4">
        <UFormField label="Email" name="user.email" required>
          <UInput v-model="state.user.email" type="email" />
        </UFormField>
        <UFormField label="First Name" name="firstName" required>
          <UInput v-model="state.firstName" />
        </UFormField>
        <UFormField label="Last Name" name="lastName" required>
          <UInput v-model="state.lastName" />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <UButton
        label="Cancel"
        color="neutral"
        variant="outline"
        @click="emit('close', false)" />
      <UButton label="Save" form="form" color="primary" type="submit" />
    </template>
  </UModal>
</template>
<script setup lang="ts">
import {
  technicianUpdateSchema,
  type TechnicianSelect,
  type TechnicianUpdate,
} from '~~/server/database/schema';
import type {FormSubmitEvent} from '@nuxt/ui';
import type {NuxtError} from '#app';

const emit = defineEmits<{close: [boolean]}>();

const props = defineProps<{
  technician: TechnicianSelect;
}>();

const state = reactive({
  user: {
    email: props.technician.user.email,
  },
  firstName: props.technician.firstName,
  lastName: props.technician.lastName,
});

const toast = useToast();

const submit = async (payload: FormSubmitEvent<TechnicianUpdate>) => {
  try {
    await $fetch(`/api/users/technicians/${props.technician.id}`, {
      method: 'PATCH',
      body: payload.data,
    });

    await refreshNuxtData('technicians');

    emit('close', true);

    toast.add({
      title: 'Success',
      description: 'The technician was updated succesfully!',
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
