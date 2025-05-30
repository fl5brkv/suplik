<template>
  <UModal title="Provide a Offer" v-model:open="open">
    <UButton label="New offer" />

    <template #body>
      <UStepper disabled ref="stepper" :items="items" class="w-full">
        <template #case>
          <div class="flex flex-col items-center gap-4 mt-8">
            <UButton
              label="Paste ID"
              @click="pasteCode"
              color="primary"
              block
              size="lg" />
            <USeparator label="or" />
            <UButton
              label="New case (coming soon)"
              @click="stepper?.next()"
              color="neutral"
              variant="outline"
              block
              disabled
              size="lg" />
          </div>
        </template>

        <template #client>
          <div class="mt-8">
            <div v-if="data" class="grid grid-cols-2 gap-4">
              <UFormField label="First Name">
                <UInput :model-value="data.client.firstName" disabled />
              </UFormField>
              <UFormField label="Last Name">
                <UInput :model-value="data.client.lastName" disabled />
              </UFormField>

              <UFormField label="Email">
                <UInput :model-value="data.client.email" disabled />
              </UFormField>
              <UFormField label="Company">
                <UInput :model-value="data.client.company" disabled />
              </UFormField>
            </div>

            <div class="flex justify-between mt-6">
              <UButton
                label="Cancel"
                color="error"
                variant="outline"
                icon="lucide:x"
                @click="open = false" />

              <UButton
                label="Confirm"
                trailing-icon="i-lucide-arrow-right"
                @click="stepper?.next()" />
            </div>
          </div>
        </template>

        <template #offer>
          <div class="mt-8">
            <UForm :state="state" class="flex flex-col gap-5" @submit="submit">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="font-semibold text-lg text-gray-800"
                    >Services</span
                  >
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
                        v-for="(
                          offerProduct, pIdx
                        ) in offerService.offerProducts"
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

              <UFormField
                label="Additional Info"
                name="additionalInfo"
                class="mt-2">
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
                  label="Send offer"
                  trailing-icon="i-lucide-arrow-right"
                  type="submit" />
              </div>
            </UForm>
          </div>
        </template>
      </UStepper>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type {NuxtError} from '#app';
import type {FormSubmitEvent, StepperItem} from '@nuxt/ui';
import type {OfferInsert} from '~~/server/database/schema';

const stepper = useTemplateRef('stepper');

const open = ref(false);

const toast = useToast();

const items = [
  {
    slot: 'case' as const,
    title: 'Case',
    description: 'Create a new case or paste ID',
  },
  {
    slot: 'client' as const,
    title: 'Client',
    description: 'Select or confirm client information',
  },
  {
    slot: 'offer' as const,
    title: 'Offer',
    description: 'Fill in the offer details',
  },
] satisfies StepperItem[];

const clipboardText = ref('');

const {data, execute} = await useFetch(
  () => `/api/cases/${clipboardText.value}/client`,
  {
    method: 'get',
    immediate: false,
    lazy: true,
  }
);

const pasteCode = async () => {
  const text = await navigator.clipboard.readText();
  if (text.length === 8) {
    clipboardText.value = text;
    await execute();
    stepper.value?.next();
  } else {
    toast.add({
      title: 'Invalid Code',
      description: 'Clipboard does not contain a valid 8-character code.',
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
  }
};

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

const state = reactive<OfferInsert>({
  additionalInfo: '',
  offerServices: [],
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

const submit = async (payload: FormSubmitEvent<OfferInsert>) => {
  try {
    await $fetch(`/api/offers/${data.value?.id}`, {
      method: 'POST',
      body: payload.data,
    });

    open.value = false;

    toast.add({
      title: 'Success',
      description: 'The offer was inserted succesfully!',
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
