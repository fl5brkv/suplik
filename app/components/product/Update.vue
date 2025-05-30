<template>
  <UModal title="Update product" :ui="{footer: 'justify-end'}">
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
          v-model="state.supplierId" />

        <UFormField label="Stock" name="stock">
          <UInputNumber v-model="state.stock" />
        </UFormField>

        <UFormField label="Reserved" name="reserved">
          <UInputNumber v-model="state.reserved" />
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
  type ProductSelect,
  type ProductUpdate,
  type SupplierSelect,
} from '~~/server/database/schema';

const toast = useToast();

const props = defineProps<{
  product: ProductSelect;
}>();

const emit = defineEmits<{close: [boolean]}>();

const {data: categoriesData, status: categoriesStatus} = await useFetch(
  '/api/categories',
  {
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

const state = reactive<ProductUpdate>({
  categoryId: props.product.categoryId,
  supplierId: props.product.supplierId,
  name: props.product.name,
  stock: props.product.stock,
  reserved: props.product.reserved,
  isPublic: props.product.isPublic,
});

const submit = async (payload: FormSubmitEvent<ProductUpdate>) => {
  try {
    await $fetch(`/api/products/${props.product.id}`, {
      method: 'PATCH',
      body: payload.data,
    });

    await refreshNuxtData('products');

    emit('close', true);

    toast.add({
      title: 'Success',
      description: 'The product was updated succesfully!',
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
