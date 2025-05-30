<template>
  <UModal title="Provide a Quote" v-model:open="open">
    <UButton label="New quote" />

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

        <template #quote>
          <div class="mt-8">
            <UForm :state="state" class="flex flex-col gap-5" @submit="submit">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="font-semibold text-lg text-gray-800"
                    >Products</span
                  >
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
                  label="Send quote"
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
import type {QuoteInsert} from '~~/server/database/schema';

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
    slot: 'quote' as const,
    title: 'Quote',
    description: 'Fill in the quote details',
  },
] satisfies StepperItem[];

const clipboardText = ref('');

const {data, execute} = await useFetch(
  () => `/api/cases/${clipboardText.value}/client`,
  {
    key: 'cases',
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

const state = reactive<QuoteInsert>({
  additionalInfo: '',
  quoteProducts: [],
  quoteServices: [],
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

const submit = async (payload: FormSubmitEvent<QuoteInsert>) => {
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
    await $fetch(`/api/quotes/${data.value?.id}`, {
      method: 'POST',
      body: payload.data,
    });

    open.value = false;
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
