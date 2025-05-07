<template>
  <UModal
    title="Provide a Quote"
    description="This is useful when you want a form in a Modal."
    :ui="{footer: 'justify-end'}">
    <template #body>
      <UForm :state="state" class="flex flex-col gap-4" @submit="submit">
        <UFormField label="Internal Note" name="internalNote">
          <UInput v-model="state.internalNote" />
        </UFormField>
        <UFormField label="External Note" name="externalNote">
          <UInput v-model="state.externalNote" />
        </UFormField>
        <UFormField label="Client Name" name="clientName">
          <UInput
            :model-value="`${state.client.firstName} ${state.client.lastName}`"
            disabled />
        </UFormField>
        <UFormField label="Client Email" name="clientEmail">
          <UInput :model-value="state.client.email" disabled />
        </UFormField>
        <div
          v-for="(item, idx) in state.orderItems"
          :key="idx"
          class="border p-2 rounded">
          <UFormField
            :label="`Item: ${item.name}`"
            :name="`orderItems.${idx}.name`">
            <UInput v-model="item.name" disabled />
          </UFormField>
          <UFormField label="Quantity" :name="`orderItems.${idx}.quantity`">
            <UInputNumber v-model="item.quantity" />
          </UFormField>
          <UButton label="Submit" color="neutral" type="submit" />
        </div>
      </UForm>

      {{ state }}
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type {NuxtError} from '#app';
import type {FormSubmitEvent} from '@nuxt/ui';
import type {OrderSelect, OrderUpdate} from '~~/server/database/schema';

const toast = useToast();

const props = defineProps<{
  order: OrderSelect;
}>();

const emit = defineEmits<{close: [boolean]}>();

const state = reactive({...props.order});

watch(
  () => props.order,
  (newOrder) => {
    Object.assign(state, newOrder);
  }
);

const submit = async (payload: FormSubmitEvent<OrderUpdate>) => {
  try {
    const {
      internalNote,
      externalNote,
      client: {email},
      orderItems,
    } = payload.data;

    console.log({internalNote, externalNote, client: {email}, orderItems});
    await $fetch('/api/orders', {
      method: 'PATCH',
      body: {internalNote, externalNote, client: {email}, orderItems},
    });

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
