<template>
  <UModal
    title="Update product"
    :ui="{footer: 'justify-end'}"
    description="Edit the product details below.">
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
        @click="emit('close', false)" />
      <UButton
        label="Update"
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
