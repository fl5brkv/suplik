<template>
  <UForm
    :schema="demandInsertSchema"
    :state="state"
    class="space-y-6 max-w-2xl mx-auto"
    @submit="onSubmit">
    <UFormField label="First Name" name="client.firstName" required>
      <UInput v-model="state.client.firstName" />
    </UFormField>
    <UFormField label="Last Name" name="client.lastName" required>
      <UInput v-model="state.client.lastName" />
    </UFormField>
    <UFormField label="Email" name="client.email" required>
      <UInput v-model="state.client.email" />
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
    <UFormField label="Additional Info" name="additionalInfo">
      <UTextarea v-model="state.additionalInfo" />
    </UFormField>

    <div>
      <div class="flex items-center justify-between">
        <span class="font-medium">Products</span>
        <UButton size="xs" @click="addProduct" color="primary" variant="subtle"
          >Add Product</UButton
        >
      </div>
      <div
        v-for="(product, idx) in state.demandProducts"
        :key="idx"
        class="flex gap-2 items-end mt-2">
        <UFormField
          :label="idx === 0 ? 'Product' : undefined"
          :name="`demandProducts.${idx}.productId`"
          required>
          <USelect
            v-model="product.productId"
            :items="productData"
            :loading="productStatus === 'pending'"
            placeholder="Select product" />
        </UFormField>
        <UFormField
          :label="idx === 0 ? 'Quantity' : undefined"
          :name="`demandProducts.${idx}.quantity`"
          required>
          <UInputNumber v-model="product.quantity" :min="1" />
        </UFormField>
        <UButton
          size="xs"
          color="error"
          variant="ghost"
          @click="removeProduct(idx)"
          >Remove</UButton
        >
      </div>
    </div>

    <div>
      <div class="flex items-center justify-between">
        <span class="font-medium">Services</span>
        <UButton size="xs" @click="addService" color="primary" variant="subtle"
          >Add Service</UButton
        >
      </div>
      <div
        v-for="(service, idx) in state.demandServices"
        :key="idx"
        class="flex gap-2 items-end mt-2">
        <UFormField
          :label="idx === 0 ? 'Service' : undefined"
          :name="`demandServices.${idx}.serviceId`"
          required>
          <USelect
            v-model="service.serviceId"
            :items="serviceData"
            :loading="serviceStatus === 'pending'"
            placeholder="Select service" />
        </UFormField>
        <UFormField
          :label="idx === 0 ? 'Quantity' : undefined"
          :name="`demandServices.${idx}.quantity`"
          required>
          <UInputNumber v-model="service.quantity" :min="1" />
        </UFormField>
        <UButton
          size="xs"
          color="error"
          variant="ghost"
          @click="removeService(idx)"
          >Remove</UButton
        >
      </div>
    </div>

    <UButton type="submit" class="mt-4" loading-auto>Submit</UButton>
  </UForm>
</template>

<script setup lang="ts">
import type {FormSubmitEvent} from '@nuxt/ui';
import {useToast} from '#imports';
import {demandInsertSchema, type DemandInsert} from '~~/server/database/schema';
import type {NuxtError} from '#app';

definePageMeta({
  layout: false,
});

const {data: productData, status: productStatus} = useFetch('/api/products', {
  key: 'products',
  method: 'get',
  lazy: true,
  transform: (data) =>
    data?.map((product) => ({
      label: product.name,
      value: product.id,
    })),
});

const {data: serviceData, status: serviceStatus} = useFetch('/api/services', {
  key: 'services',
  method: 'get',
  lazy: true,
  transform: (data) =>
    data?.map((service) => ({
      label: service.name,
      value: service.id,
    })),
});

const state = reactive<DemandInsert>({
  client: {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    company: '',
    companyNumber: '',
  },
  additionalInfo: '',
  demandProducts: [],
  demandServices: [],
});

const toast = useToast();

function addProduct() {
  state.demandProducts?.push({
    productId: 0,
    quantity: 1,
  });
}

function removeProduct(idx: number) {
  state.demandProducts?.splice(idx, 1);
}

function addService() {
  state.demandServices?.push({
    serviceId: 0, 
    quantity: 1,
  });
}

function removeService(idx: number) {
  state.demandServices?.splice(idx, 1);
}

async function onSubmit(payload: FormSubmitEvent<DemandInsert>) {
  try {
    await $fetch('/api/demands', {
      method: 'POST',
      body: payload.data,
    });
    toast.add({
      title: 'Success',
      description: 'Demand created successfully',
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
}
</script>
