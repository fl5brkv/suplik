<template>
  <UForm :state="state" class="space-y-6" @submit="onSubmit">
    <h2 class="font-bold text-lg">Client Information</h2>
    <UFormField label="First Name" name="client.firstName" required>
      <UInput v-model="state.client.firstName" />
    </UFormField>
    <UFormField label="Last Name" name="client.lastName" required>
      <UInput v-model="state.client.lastName" />
    </UFormField>
    <UFormField label="Email" name="client.email" required>
      <UInput v-model="state.client.email" type="email" />
    </UFormField>
    <UFormField label="Phone Number" name="client.phoneNumber" required>
      <UInput v-model="state.client.phoneNumber" />
    </UFormField>
    <UFormField label="Company" name="client.company">
      <UInput v-model="state.client.company" />
    </UFormField>
    <UFormField label="Company Number" name="client.companyNumber">
      <UInput v-model="state.client.companyNumber" />
    </UFormField>

    <h2 class="font-bold text-lg mt-6">Order Items</h2>
    <div
      v-for="(item, idx) in state.orderItems"
      :key="idx"
      class="flex gap-2 items-end mb-4">
      <UFormField label="Item ID" :name="`orderItems.${idx}.itemId`" required>
        <UInput v-model="item.itemId" type="number" />
      </UFormField>
      <UFormField
        label="Quantity"
        :name="`orderItems.${idx}.quantity`"
        required>
        <UInput v-model="item.quantity" type="number" min="1" />
      </UFormField>

      <UButton
        color="error"
        variant="ghost"
        size="sm"
        @click="removeItem"
        v-if="state.orderItems.length > 1">
        Remove
      </UButton>
    </div>
    <UButton color="primary" variant="subtle" size="sm" @click="addItem">
      Add Item
    </UButton>

    <UFormField label="External Note" name="externalNote">
      <UTextarea v-model="state.externalNote" />
    </UFormField>

    <UButton type="submit" color="primary"> Submit Order </UButton>
  </UForm>
</template>

<script setup lang="ts">
import type {FormSubmitEvent} from '@nuxt/ui';
import {type OrderInsert} from '~~/server/database/schema';

const toast = useToast();

definePageMeta({
  layout: false,
});

const state = reactive<OrderInsert>({
  client: {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    company: '',
    companyNumber: '',
  },
  orderItems: [
    {
      itemId: 0,
      quantity: 0,
    },
  ],
  externalNote: '',
});

function addItem() {
  state.orderItems.push({
    itemId: 0,
    quantity: 0,
  });
}

function removeItem() {
  if (state.orderItems.length > 1) {
    state.orderItems.pop();
  }
}

async function onSubmit(event: FormSubmitEvent<OrderInsert>) {
  toast.add({
    title: 'Success',
    description: 'Order submitted.',
    color: 'success',
  });
  console.log(event.data);
}
</script>
