<template>
  <UModal
    title="Provide a Quote"
    description="This is a description."
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

        <div
          v-for="(quoteItem, idx) in state.quoteItems"
          :key="idx"
          class="flex gap-2 items-end">
          <USelect
            v-model="quoteItem.itemId"
            :items="data"
            placeholder="Select item"
            :loading="status === 'pending'"
            class="w-48" />

          <UFormField label="Quantity" :name="`quoteItems.${idx}.quantity`">
            <UInputNumber v-model="quoteItem.quantity" />
          </UFormField>
          <UButton
            v-if="state.quoteItems.length > 1"
            icon="i-lucide-x"
            color="error"
            variant="ghost"
            size="sm"
            @click="removeItem(idx)" />
        </div>
        <UButton
          color="primary"
          variant="subtle"
          size="sm"
          class="self-start"
          @click.prevent="addItem">
          Add Item
        </UButton>
        <UButton label="Submit" color="neutral" type="submit" class="mt-2" />
      </UForm>
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
      productDetail: item.productDetail,
    }));
  },
  lazy: true,
});

const state = reactive({
  demandId: props.demand.id,
  additionalInfo: '',
  client: {
    email: props.demand.client.email,
  },
  quoteItems: props.demand.demandItems.map((item) => ({
    itemId: item.itemId,
    quantity: item.quantity,
  })),
});

const addItem = () => {
  state.quoteItems.push({itemId: 0, quantity: 1});
};

const removeItem = (idx: number) => {
  state.quoteItems.splice(idx, 1);
};

watch(
  () => props.demand,
  (newDemand) => {
    Object.assign(state, newDemand);
  }
);

const submit = async (payload: FormSubmitEvent<QuoteInsert>) => {
  for (const quoteItem of state.quoteItems) {
    const item = data.value?.find((i) => i.value === quoteItem.itemId);

    if (item && item.productDetail) {
      const availableStock =
        item.productDetail.stock - item.productDetail.reserved;

      if (quoteItem.quantity > availableStock) {
        toast.add({
          title: 'Insufficient Stock',
          description: `Requested quantity (${quoteItem.quantity}) exceeds available stock (${availableStock}) for item "${item.label}".`,
          color: 'error',
          actions: [
            {
              label: 'View Items',
              icon: 'i-lucide-box',
              onClick: () => {
                emit('close', true);
                navigateTo('/items');
              },
            },
          ],
        });
        return;
      }
    }
  }

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
