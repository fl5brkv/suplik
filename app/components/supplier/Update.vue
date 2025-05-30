<template>
  <UModal title="Update supplier" :ui="{footer: 'justify-end'}">
    <template #body>
      <UForm :state="state" class="flex flex-col gap-4" @submit="submit">
        <UFormField label="Name" name="name">
          <UInput v-model="state.name" />
        </UFormField>
        <UFormField label="Email" name="email">
          <UInput v-model="state.email" type="email" />
        </UFormField>
        <UFormField label="Phone Number" name="phoneNumber">
          <UInput v-model="state.phoneNumber" />
        </UFormField>
        <UButton label="Submit" color="neutral" type="submit" class="mt-2" />
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type {NuxtError} from '#app';
import type {FormSubmitEvent} from '@nuxt/ui';
import type {SupplierSelect, SupplierUpdate} from '~~/server/database/schema';

const toast = useToast();

const props = defineProps<{
  supplier: SupplierSelect;
}>();

const emit = defineEmits<{close: [boolean]}>();

const state = reactive<SupplierUpdate>({
  name: props.supplier.name,
  email: props.supplier.email,
  phoneNumber: props.supplier.phoneNumber,
});

const submit = async (payload: FormSubmitEvent<SupplierUpdate>) => {
  try {
    await $fetch(`/api/suppliers/${props.supplier.id}`, {
      method: 'PATCH',
      body: payload.data,
    });

    toast.add({
      title: 'Success',
      description: 'The supplier was updated succesfully!',
      color: 'success',
    });

    await refreshNuxtData('suppliers');

    emit('close', true);
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
