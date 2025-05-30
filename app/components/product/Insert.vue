<template>
  <UModal
    v-model:open="open"
    title="New product"
    :ui="{footer: 'justify-end'}"
    description="Fill in the product details below.">
    <UButton label="New product" />

    <template #body>
      <UForm
        id="form"
        :state="state"
        class="flex flex-col gap-4"
        @submit="submit">
        <UFormField label="Category" name="categoryId" required>
          <USelect
            v-model="state.categoryId"
            :items="categoriesData"
            :loading="categoriesStatus === 'pending'"
            placeholder="Select category"
            class="w-48" />
        </UFormField>

        <UFormField label="Name" name="name" required>
          <UInput v-model="state.name" placeholder="Product name" />
        </UFormField>

        <UFormField label="Supplier" name="supplierId" required>
          <USelect
            v-model="state.supplierId"
            :items="suppliersData"
            :loading="suppliersStatus === 'pending'"
            placeholder="Select supplier"
            class="w-48" />
        </UFormField>

        <UFormField label="Stock" name="stock" required>
          <UInputNumber v-model="state.stock" placeholder="Stock quantity" />
        </UFormField>

        <UFormField label="Reserved" name="reserved">
          <UInputNumber
            v-model="state.reserved"
            placeholder="Reserved quantity" />
        </UFormField>

        <UFormField name="isPublic">
          <UCheckbox v-model="state.isPublic" label="Is public" />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <UButton
        label="Cancel"
        color="neutral"
        variant="outline"
        @click="open = false" />
      <UButton
        label="Submit"
        color="neutral"
        type="submit"
        form="form"
        class="ml-2" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type {NuxtError} from '#app';
import type {FormSubmitEvent} from '@nuxt/ui';
import {
  type CategorySelect,
  type ProductInsert,
  type SupplierSelect,
} from '~~/server/database/schema';

const toast = useToast();

const open = ref(false);

const {data: categoriesData, status: categoriesStatus} = await useFetch(
  '/api/categories',
  {
    key: 'categories',
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
  supplierId: 0,
  stock: 0,
  reserved: 0,
  isPublic: false,
});

const submit = async (payload: FormSubmitEvent<ProductInsert>) => {
  try {
    await $fetch('/api/products', {
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
