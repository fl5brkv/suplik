<template>
  <UModal
    title="Provide a Offer"
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
          v-for="(offerService, sIdx) in state.offerServices"
          :key="sIdx"
          class="flex flex-col gap-2 mb-4">
          <div class="flex gap-2 items-end">
            <UFormField
              :label="sIdx === 0 ? 'Service' : undefined"
              :name="`demandServices.${sIdx}.serviceId`"
              required>
              <USelect
                v-model="offerService.serviceId"
                :items="serviceData"
                :loading="serviceStatus === 'pending'"
                placeholder="Select service" />
            </UFormField>
            <UFormField
              :label="sIdx === 0 ? 'Quantity' : undefined"
              :name="`demandServices.${sIdx}.quantity`"
              required>
              <UInputNumber v-model="offerService.quantity" :min="1" />
            </UFormField>
            <UButton
              label="Remove"
              size="xs"
              color="error"
              variant="ghost"
              @click="removeService(sIdx)" />
          </div>

          <!-- Products for this service -->
          <div class="flex items-center justify-between">
            <span class="font-medium">Products</span>
            <UButton
              size="xs"
              @click="addProductToService(sIdx)"
              color="primary"
              variant="subtle"
              >Add Product</UButton
            >
          </div>
          <div
            v-for="(product, pIdx) in offerService.products"
            :key="pIdx"
            class="flex gap-2 items-end mt-2">
            <UFormField
              :label="pIdx === 0 ? 'Product' : undefined"
              :name="`demandServices.${sIdx}.products.${pIdx}.productId`"
              required>
              <USelect
                v-model="product.productId"
                :items="productOptions"
                :loading="productStatus === 'pending'"
                placeholder="Select product" />
            </UFormField>
            <UFormField
              :label="pIdx === 0 ? 'Quantity' : undefined"
              :name="`demandServices.${sIdx}.products.${pIdx}.quantity`"
              required>
              <UInputNumber v-model="product.quantity" :min="1" />
            </UFormField>
            <UButton
              label="Remove"
              size="xs"
              color="error"
              variant="ghost"
              @click="removeProductFromService(sIdx, pIdx)" />
          </div>
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
  type OfferInsert,
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

const state = reactive<OfferInsert>({
  demandId: props.demand.id,
  additionalInfo: '',
  client: {
    email: props.demand.client.email,
  },
  offerServices: props.demand.demandServices.map((demandService) => ({
    serviceId: demandService.serviceId,
    quantity: demandService.quantity,
    products: [], 
  })),
});

const submit = async (payload: FormSubmitEvent<OfferInsert>) => {
  for (const offerProduct of state.offerProducts) {
    const product = productData.value?.find(
      (p) => p.id === offerProduct.productId
    );

    if (product) {
      const availableStock = product.stock - product.reserved;

      if (offerProduct.quantity > availableStock) {
        toast.add({
          title: 'Insufficient Stock',
          description: `Requested quantity (${offerProduct.quantity}) exceeds available stock (${availableStock}) for product "${product.name}".`,
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
    await $fetch('/api/offers', {
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
