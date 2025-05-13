<template>
  <UModal
    v-model:open="open"
    :title="`New product`"
    :ui="{footer: 'justify-end'}">
    <UButton label="New product" color="neutral" variant="subtle" />

    <template #body>
      <UForm :state="state" class="flex flex-col gap-4" @submit="submit">
        <USelect
          :items="categoriesData"
          :loading="categoriesStatus === 'pending'"
          placeholder="Select category"
          class="w-48"
          v-model="state.categoryId" />

        <UFormField label="Name" name="name">
          <UInput v-model="state.name" />
        </UFormField>

        <USelect
          :items="suppliersData"
          :loading="suppliersStatus === 'pending'"
          placeholder="Select supplier"
          class="w-48"
          v-model="state.productDetail.supplierId" />

        <UFormField label="Stock" name="productDetail.stock">
          <UInputNumber v-model="state.productDetail.stock" />
        </UFormField>

        <UFormField label="Reserved" name="productDetail.reserved">
          <UInputNumber v-model="state.productDetail.reserved" />
        </UFormField>

        <UCheckbox required label="Is public" v-model="state.isPublic" />

        <UButton label="Submit" color="neutral" type="submit" class="mt-2" />
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type {NuxtError} from '#app';
import type {FormSubmitEvent} from '@nuxt/ui';
import {
  type CategorySelect,
  type ItemInsert,
  type SupplierSelect,
} from '~~/server/database/schema';

const toast = useToast();

const open = ref(false);

const {data: categoriesData, status: categoriesStatus} = await useFetch(
  '/api/categories',
  {
    key: 'productCategories',
    query: {type: 'product'},
    transform: (data: CategorySelect[]) => {
      return data?.map((category) => ({
        label: category.name,
        value: category.id,
      }));
    },
    lazy: true,
  }
);

const {data: suppliersData, status: suppliersStatus} = await useFetch(
  '/api/suppliers',
  {
    transform: (data: SupplierSelect[]) => {
      return data?.map((supplier) => ({
        label: supplier.name,
        value: supplier.id,
      }));
    },
    lazy: true,
  }
);

const state = reactive({
  name: '',
  categoryId: 0,
  isPublic: false,
  productDetail: {
    supplierId: 0,
    stock: 0,
    reserved: 0,
  },
});

const submit = async (payload: FormSubmitEvent<ItemInsert>) => {
  try {
    await $fetch('/api/items', {
      method: 'POST',
      body: payload.data,
      query: {type: 'product'},
    });

    await refreshNuxtData('products');

    open.value = false;

    toast.add({
      title: 'Success',
      description: 'The product was inserted succesfully!',
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
