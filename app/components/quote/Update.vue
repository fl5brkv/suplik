<template>
  <UModal title="Create a quote" :ui="{footer: 'justify-end'}">
    <UButton label="New quote" color="neutral" variant="subtle" />

    <template #body>
      <UForm :state="state" class="flex flex-col gap-4" @submit="submit">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="font-semibold text-lg text-gray-800">Products</span>
            <UButton
              label="Add Product"
              icon="i-lucide-plus"
              color="primary"
              @click="addProduct"
              size="sm" />
          </div>
          <div class="space-y-4">
            <div
              v-for="(quoteProduct, idx) in state.quoteProducts"
              :key="idx"
              class="flex gap-4 p-4 bg-gray-50 rounded-lg shadow border border-gray-200 w-full mt-3">
              <UFormField
                :label="idx === 0 ? 'Product' : undefined"
                :name="`demandProducts.${idx}.productId`"
                required
                class="flex-1">
                <USelectMenu
                  v-model="quoteProduct.productId"
                  :items="productData"
                  :loading="productStatus === 'pending'"
                  placeholder="Select product"
                  value-key="value"
                  class="w-full" />
              </UFormField>
              <UFormField
                :label="idx === 0 ? 'Quantity' : undefined"
                :name="`demandProducts.${idx}.quantity`"
                required
                class="w-32">
                <UInputNumber
                  v-model="quoteProduct.quantity"
                  :min="1"
                  class="w-full" />
              </UFormField>
              <UButton
                icon="i-lucide-trash"
                size="xs"
                color="error"
                variant="ghost"
                @click="removeProduct(idx)"
                class="ml-2 self-center"
                aria-label="Remove product" />
            </div>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="font-semibold text-lg text-gray-800">Services</span>
            <UButton
              label="Add Service"
              icon="i-lucide-plus"
              color="primary"
              @click="addService"
              size="sm" />
          </div>
          <div class="space-y-4">
            <div
              v-for="(quoteService, idx) in state.quoteServices"
              :key="idx"
              class="flex gap-4 p-4 bg-gray-50 rounded-lg shadow border border-gray-200 w-full mt-3">
              <UFormField
                :label="idx === 0 ? 'Service' : undefined"
                :name="`demandServices.${idx}.productId`"
                required
                class="flex-1">
                <USelectMenu
                  v-model="quoteService.serviceId"
                  :items="serviceData"
                  :loading="serviceStatus === 'pending'"
                  placeholder="Select service"
                  value-key="value"
                  class="w-full" />
              </UFormField>
              <UFormField
                :label="idx === 0 ? 'Quantity' : undefined"
                :name="`demandServices.${idx}.quantity`"
                required
                class="w-32">
                <UInputNumber
                  v-model="quoteService.quantity"
                  :min="1"
                  class="w-full" />
              </UFormField>
              <UButton
                icon="i-lucide-trash"
                size="xs"
                color="error"
                variant="ghost"
                @click="removeService(idx)"
                class="ml-2 self-center"
                aria-label="Remove service" />
            </div>
          </div>
        </div>

        <UFormField label="Additional Info" name="additionalInfo" class="mt-2">
          <UInput v-model="state.additionalInfo" />
        </UFormField>
        <div class="flex justify-between mt-8">
          <UButton
            label="Cancel"
            color="error"
            variant="outline"
            icon="lucide:x"
            @click="open = false" />
          <UButton
            label="Update quote"
            trailing-icon="i-lucide-arrow-right"
            type="submit" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type {NuxtError} from '#app';
import type {FormSubmitEvent} from '@nuxt/ui';
import type {QuoteSelect, QuoteUpdate} from '~~/server/database/schema';

const toast = useToast();

const open = ref(false);

const props = defineProps<{
  quote: QuoteSelect;
}>();

const emit = defineEmits<{close: [boolean]}>();

const state = reactive<QuoteUpdate>({
  additionalInfo: props.quote.additionalInfo,
  quoteProducts: props.quote.quoteProducts?.map(({productId, quantity}) => ({
    productId,
    quantity,
  })),
  quoteServices: props.quote.quoteServices?.map(({serviceId, quantity}) => ({
    serviceId,
    quantity,
  })),
});

const {data: productData, status: productStatus} = await useFetch(
  '/api/products',
  {
    key: 'products',
    method: 'get',
    lazy: true,
    transform: (data) =>
      data?.map((product) => ({
        label: product.name,
        value: product.id,
        available: product.stock - product.reserved,
      })),
  }
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

const addProduct = () => {
  if (!state.quoteProducts) state.quoteProducts = [];
  state.quoteProducts.push({productId: 0, quantity: 1});
};

const removeProduct = (idx: number) => {
  if (!state.quoteProducts) state.quoteProducts = [];
  state.quoteProducts.splice(idx, 1);
};

const addService = () => {
  if (!state.quoteServices) state.quoteServices = [];
  state.quoteServices.push({serviceId: 0, quantity: 1});
};

const removeService = (idx: number) => {
  if (!state.quoteServices) state.quoteServices = [];
  state.quoteServices.splice(idx, 1);
};

const submit = async (payload: FormSubmitEvent<QuoteUpdate>) => {
  if (state.quoteProducts && productData.value) {
    for (const quoteProduct of state.quoteProducts) {
      const product = productData.value.find(
        (p) => p.value === quoteProduct.productId
      );

      if (!product || quoteProduct.quantity > product?.available) {
        toast.add({
          title: 'Insufficient Stock',
          description: `Requested quantity (${
            quoteProduct.quantity
          }) exceeds available stock (${product?.available}) for product "${
            product?.label ?? 'Unknown'
          }".`,
          color: 'error',
          actions: [
            {
              label: 'View Items',
              icon: 'i-lucide-box',
              onClick: () => {
                open.value = false;
                navigateTo('/admin/products');
              },
            },
          ],
        });
        return;
      }
    }
  }

  try {
    await $fetch(`/api/quotes/update/${props.quote.id}`, {
      method: 'PATCH',
      body: payload.data,
    });

    toast.add({
      title: 'Success',
      description: 'The quote was updated succesfully!',
      color: 'success',
    });

    await refreshNuxtData('quotes');

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
