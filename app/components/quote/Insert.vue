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

        <div class="flex items-center justify-between">
          <span class="font-medium">Products</span>
          <UButton
            size="xs"
            @click="addProduct"
            color="primary"
            variant="subtle"
            >Add Product</UButton
          >
        </div>

        <div
          v-for="(quoteProduct, idx) in state.quoteProducts"
          :key="idx"
          class="flex gap-2 items-end mt-2">
          <UFormField
            :label="idx === 0 ? 'Product' : undefined"
            :name="`demandProducts.${idx}.productId`"
            required>
            <USelect
              v-model="quoteProduct.productId"
              :items="productOptions"
              :loading="productStatus === 'pending'"
              placeholder="Select product" />
          </UFormField>
          <UFormField
            :label="idx === 0 ? 'Quantity' : undefined"
            :name="`demandProducts.${idx}.quantity`"
            required>
            <UInputNumber v-model="quoteProduct.quantity" :min="1" />
          </UFormField>

          <UButton
            label="Remove"
            size="xs"
            color="error"
            variant="ghost"
            @click="removeProduct(idx)" />
        </div>

        <div class="flex items-center justify-between mt-6">
          <span class="font-medium">Services</span>
          <UButton
            size="xs"
            @click="addService"
            color="primary"
            variant="subtle"
            >Add Service</UButton
          >
        </div>

        <div
          v-for="(quoteService, idx) in state.quoteServices"
          :key="idx"
          class="flex gap-2 items-end">
          <UFormField
            :label="idx === 0 ? 'Service' : undefined"
            :name="`demandServices.${idx}.serviceId`"
            required>
            <USelect
              v-model="quoteService.serviceId"
              :items="serviceData"
              :loading="serviceStatus === 'pending'"
              placeholder="Select service" />
          </UFormField>
          <UFormField
            :label="idx === 0 ? 'Quantity' : undefined"
            :name="`demandServices.${idx}.quantity`"
            required>
            <UInputNumber v-model="quoteService.quantity" :min="1" />
          </UFormField>

          <UButton
            label="Remove"
            size="xs"
            color="error"
            variant="ghost"
            @click="removeService(idx)" />
        </div>

        <UButton label="Submit" color="neutral" type="submit" class="mt-2" />
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type {NuxtError} from '#app';
import type {FormSubmitEvent} from '@nuxt/ui';
import {
  type DemandSelect,
  type ProductSelect,
  type QuoteInsert,
} from '~~/server/database/schema';

const toast = useToast();

const props = defineProps<{
  demand: DemandSelect;
}>();

const emit = defineEmits<{close: [boolean]}>();

const {data: productData, status: productStatus} = await useFetch<
  ProductSelect[]
>('/api/products', {
  key: 'products',
  method: 'get',
  lazy: true,
});

const productOptions = computed(() =>
  productData.value?.map((product) => ({
    label: product.name,
    value: product.id,
  }))
);
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

const state = reactive({
  demandId: props.demand.id,
  additionalInfo: '',
  client: {
    email: props.demand.client.email,
  },
  quoteProducts: props.demand.demandProducts.map((demandProduct) => ({
    productId: demandProduct.productId,
    quantity: demandProduct.quantity,
  })),
  quoteServices: props.demand.demandServices.map((demandService) => ({
    serviceId: demandService.serviceId,
    quantity: demandService.quantity,
  })),
});

function addProduct() {
  state.quoteProducts?.push({
    // @ts-ignore
    productId: null,
    quantity: 1,
  });
}

function removeProduct(idx: number) {
  state.quoteProducts?.splice(idx, 1);
}

function addService() {
  state.quoteServices?.push({
    // @ts-ignore
    serviceId: null, //
    quantity: 1,
  });
}

function removeService(idx: number) {
  state.quoteServices?.splice(idx, 1);
}

const submit = async (payload: FormSubmitEvent<QuoteInsert>) => {
  for (const quoteProduct of state.quoteProducts) {
    const product = productData.value?.find(
      (p) => p.id === quoteProduct.productId
    );

    if (product) {
      const availableStock = product.stock - product.reserved;

      if (quoteProduct.quantity > availableStock) {
        toast.add({
          title: 'Insufficient Stock',
          description: `Requested quantity (${quoteProduct.quantity}) exceeds available stock (${availableStock}) for product "${product.name}".`,
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
