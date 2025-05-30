<template>
  <UModal title="Create a offer" :ui="{footer: 'justify-end'}">
    <UButton label="New offer" color="neutral" variant="subtle" />

    <template #body>
      <UForm :state="state" class="flex flex-col gap-4" @submit="submit">
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
              v-for="(offerService, sIdx) in state.offerServices"
              :key="sIdx"
              class="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg shadow border border-gray-200 w-full mt-3">
              <div class="flex gap-4">
                <UFormField
                  :label="sIdx === 0 ? 'Service' : undefined"
                  :name="`demandServices.${sIdx}.productId`"
                  required
                  class="flex-1">
                  <USelectMenu
                    v-model="offerService.serviceId"
                    :items="serviceData"
                    :loading="serviceStatus === 'pending'"
                    placeholder="Select service"
                    value-key="value"
                    class="w-full" />
                </UFormField>
                <UFormField
                  :label="sIdx === 0 ? 'Quantity' : undefined"
                  :name="`demandServices.${sIdx}.quantity`"
                  required
                  class="w-32">
                  <UInputNumber
                    v-model="offerService.quantity"
                    :min="1"
                    class="w-full" />
                </UFormField>
                <UButton
                  icon="i-lucide-trash"
                  size="xs"
                  color="error"
                  variant="ghost"
                  @click="removeService(sIdx)"
                  class="ml-2 self-center"
                  aria-label="Remove service" />
              </div>

              <div class="flex items-center justify-between mt-2">
                <span class="font-semibold text-lg text-gray-800"
                  >Products</span
                >
                <UButton
                  label="Add Product"
                  icon="i-lucide-plus"
                  color="primary"
                  @click="addProduct(sIdx)"
                  size="sm" />
              </div>

              <div class="space-y-4">
                <div
                  v-for="(offerProduct, pIdx) in offerService.offerProducts"
                  :key="pIdx"
                  class="flex gap-4 p-4 bg-gray-100 rounded-lg border border-gray-300 w-full">
                  <UFormField
                    :label="pIdx === 0 ? 'Product' : undefined"
                    :name="`demandServices.${sIdx}.products.${pIdx}.productId`"
                    required
                    class="flex-1">
                    <USelectMenu
                      v-model="offerProduct.productId"
                      :items="productData"
                      :loading="productStatus === 'pending'"
                      placeholder="Select product"
                      value-key="value"
                      class="w-full" />
                  </UFormField>
                  <UFormField
                    :label="pIdx === 0 ? 'Quantity' : undefined"
                    :name="`demandServices.${sIdx}.products.${pIdx}.quantity`"
                    required
                    class="w-32">
                    <UInputNumber
                      v-model="offerProduct.quantity"
                      :min="1"
                      class="w-full" />
                  </UFormField>
                  <UButton
                    icon="i-lucide-trash"
                    size="xs"
                    color="error"
                    variant="ghost"
                    @click="removeProduct(sIdx, pIdx)"
                    class="ml-2 self-center"
                    aria-label="Remove product" />
                </div>
              </div>
              <UFormField
                :label="sIdx === 0 ? 'Technician' : undefined"
                :name="`offerServices.${sIdx}.technicianId`"
                required
                class="flex-1">
                <USelectMenu
                  v-model="offerService.technicianId"
                  :items="technicianData"
                  :loading="technicianStatus === 'pending'"
                  placeholder="Select technician"
                  value-key="value"
                  class="w-full" />
              </UFormField>
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
            label="Update offer"
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
import type {OfferSelect, OfferUpdate} from '~~/server/database/schema';

const toast = useToast();

const open = ref(false);

const props = defineProps<{
  offer: OfferSelect;
}>();

const emit = defineEmits<{close: [boolean]}>();

const {data: productData, status: productStatus} = await useFetch(
  '/api/products',
  {
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
  method: 'get',
  lazy: true,
  transform: (data) =>
    data?.map((service) => ({
      label: service.name,
      value: service.id,
    })),
});

const {data: technicianData, status: technicianStatus} = await useFetch(
  '/api/users/technicians',
  {
    method: 'get',
    lazy: true,
    transform: (data) =>
      data?.map((technician) => ({
        label: `${technician.firstName} ${technician.lastName}`,
        value: technician.id,
      })),
  }
);

const state = reactive<OfferUpdate>({
  additionalInfo: props.offer.additionalInfo,
  offerServices: props.offer.offerServices?.map((service) => ({
    serviceId: service.serviceId,
    technicianId: service.technicianId,
    quantity: service.quantity,
    offerProducts: service.offerProducts
      ? service.offerProducts.map((product) => ({
          productId: product.productId,
          quantity: product.quantity,
        }))
      : [], 
  })),
});

const addProduct = (serviceIdx: number) => {
  const service = state.offerServices[serviceIdx];
  if (!service) return;

  if (!service.offerProducts) {
    service.offerProducts = [];
  }

  service.offerProducts.push({productId: 0, quantity: 1});
};

const removeProduct = (serviceIdx: number, productIdx: number) => {
  const service = state.offerServices[serviceIdx];
  if (!service || !service.offerProducts) return;

  service.offerProducts.splice(productIdx, 1);
};

const addService = () => {
  if (!state.offerServices) state.offerServices = [];

  state.offerServices.push({
    serviceId: 0,
    quantity: 1,
    technicianId: 0,
    offerProducts: [],
  });
};

const removeService = (idx: number) => {
  if (!state.offerServices) state.offerServices = [];
  state.offerServices.splice(idx, 1);
};

const submit = async (payload: FormSubmitEvent<OfferUpdate>) => {
  try {
    await $fetch(`/api/offers/update/${props.offer.id}`, {
      method: 'PATCH',
      body: payload.data,
    });

    toast.add({
      title: 'Success',
      description: 'The offer was updated succesfully!',
      color: 'success',
    });

    await refreshNuxtData('offers');

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
