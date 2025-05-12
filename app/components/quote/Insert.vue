<template>
  <UModal
    title="Provide a Quote"
    description="This is useful when you want a form in a Modal."
    :ui="{footer: 'justify-end'}">
    <template #body>
      <UForm :state="state" class="flex flex-col gap-4" @submit="submit">
        <UFormField
          label="Additional Info"
          name="additionalInfo"
          :help="props.demand.additionalInfo ?? undefined">
          <UInput v-model="state.additionalInfo" />
        </UFormField>
        <UFormField
          label="Client"
          name="client"
          :help="`${props.demand.client.firstName} ${props.demand.client.lastName} `">
          <UInput v-model="state.client.email" />
        </UFormField>
        <div v-for="(quoteItem, idx) in state.quoteItems" :key="idx">
          <!-- <UFormField
            :label="`Item: ${quoteItem.item.name}`"
            :name="`demandItems.${idx}.name`">
            <UInput v-model="quoteItem.item.name" disabled />
          </UFormField> -->

          <USelect
            v-model="quoteItem.itemId"
            :items="data"
            placeholder="Select item"
            :loading="status === 'pending'"
            class="w-48" />

          <UFormField label="Quantity" :name="`demandItems.${idx}.quantity`">
            <UInputNumber v-model="quoteItem.quantity" />
          </UFormField>
        </div>
        <UButton label="Submit" color="neutral" type="submit" />
      </UForm>

      <!-- <div
        v-for="(item, idx) in state.items"
        :key="idx"
        class="flex gap-2 items-center">
        <USelect
          v-model="item.description"
          :items="items"
          placeholder="Select item"
          :loading="status === 'pending'"
          class="w-48" />
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          @click="removeItem(idx)">
          Remove
        </UButton>
      </div>
      <UButton color="neutral" variant="subtle" size="sm" @click="addItem">
        Add Item
      </UButton> -->

      {{ state }}
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type {NuxtError} from '#app';
import type {FormSubmitEvent} from '@nuxt/ui';
import {
  type ItemSelect,
  type DemandSelect,
  type QuoteInsert,
} from '~~/server/database/schema';

const toast = useToast();

const props = defineProps<{
  demand: DemandSelect;
}>();

const emit = defineEmits<{close: [boolean]}>();

const {data, status} = await useFetch('/api/items', {
  transform: (data: ItemSelect[]) => {
    return data?.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  },
  lazy: true,
});

const state = reactive({
  demandId: props.demand.id,
  expiresAt: 0,
  additionalInfo: '',
  client: {
    email: props.demand.client.email,
  },
  quoteItems: props.demand.demandItems.map((item) => ({
    itemId: item.itemId,
    quantity: item.quantity,
  })),
});

watch(
  () => props.demand,
  (newDemand) => {
    Object.assign(state, newDemand);
  }
);

const submit = async (payload: FormSubmitEvent<QuoteInsert>) => {
  try {
    await $fetch('/api/quotes', {
      method: 'POST',
      body: payload.data,
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
