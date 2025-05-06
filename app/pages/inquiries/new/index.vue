<template>
  <div class="space-y-6 p-4 max-w-xl mx-auto">
    <UForm :schema="inquiryInsertSchema" :state="state" @submit="onSubmit">
      <h2 class="text-xl font-bold">Client Info</h2>
      <UFormField label="First Name" name="client.firstName">
        <UInput v-model="state.client.firstName" placeholder="First Name" />
      </UFormField>
      <UFormField label="Last Name" name="client.lastName">
        <UInput v-model="state.client.lastName" placeholder="Last Name" />
      </UFormField>
      <UFormField label="Email" name="client.email">
        <UInput v-model="state.client.email" placeholder="Email" type="email" />
      </UFormField>
      <UFormField label="Phone Number" name="client.phoneNumber">
        <UInput v-model="state.client.phoneNumber" placeholder="Phone Number" />
      </UFormField>
      <UFormField label="Company (optional)" name="client.company">
        <UInput
          v-model="state.client.company"
          placeholder="Company (optional)" />
      </UFormField>
      <UFormField label="Company Number (optional)" name="client.companyNumber">
        <UInput
          v-model="state.client.companyNumber"
          placeholder="Company Number (optional)" />
      </UFormField>
      <UFormField label="Additional Info (optional)" name="additionalInfo">
        <UTextarea
          v-model="state.additionalInfo"
          placeholder="Additional Info (optional)" />
      </UFormField>

      <h2 class="text-xl font-bold">Add Services</h2>
      <UFormField label="Service" name="service">
        <USelectMenu
          v-if="serviceData"
          v-model="selectedService"
          :items="serviceData"
          value-key="id"
          :loading="serviceStatus === 'pending'"
          placeholder="Select a service"
          class="w-full" />
      </UFormField>
      <UFormField label="Quantity" name="serviceQuantity">
        <UInputNumber v-model="serviceQuantity" :min="1" />
      </UFormField>
      <UPopover>
        <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
          {{
            serviceDate
              ? df.format(serviceDate.toDate(getLocalTimeZone()))
              : 'Select a date'
          }}
        </UButton>

        <template #content>
          <UCalendar v-model="serviceDate" class="p-2" />
        </template>
      </UPopover>
      <UButton @click.prevent="addService" label="Add Service" />

      <div v-if="state.inquiryServices.length > 0" class="space-y-2 mt-4">
        <h3 class="font-semibold">Selected Services</h3>
        <ul class="list-disc pl-5 space-y-2">
          <li
            v-for="(s, i) in state.inquiryServices"
            :key="i"
            class="flex items-center justify-between">
            <span>Quantity: {{ s.quantity }}, Date: {{ s.date }}</span>
            <UButton
              color="error"
              size="xs"
              variant="soft"
              @click="removeService(i)">
              Remove
            </UButton>
          </li>
        </ul>
      </div>

      <h2 class="text-xl font-bold mt-6">Add Products</h2>
      <UFormField label="Product" name="product">
        <USelectMenu
          v-if="productData"
          v-model="selectedProduct"
          :items="productData"
          value-key="id"
          :loading="productStatus === 'pending'"
          placeholder="Select a product"
          class="w-full" />
      </UFormField>
      <UFormField label="Quantity" name="productQuantity">
        <UInputNumber v-model="productQuantity" :min="1" />
      </UFormField>
      <UFormField label="Installment" name="wantsProductInstallement">
        <UCheckbox
          label="I also want installment"
          v-model="wantsProductInstallement" />
      </UFormField>

      <UPopover v-if="wantsProductInstallement">
        <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
          {{
            productDate
              ? df.format(productDate.toDate(getLocalTimeZone()))
              : 'Select a date'
          }}
        </UButton>

        <template #content>
          <UCalendar v-model="productDate" class="p-2" />
        </template>
      </UPopover>

      <UButton @click.prevent="addProduct" label="Add Product" />

      <div v-if="state.inquiryProducts.length > 0" class="space-y-2 mt-4">
        <h3 class="font-semibold">Selected Products</h3>
        <ul class="list-disc pl-5 space-y-2">
          <li
            v-for="(p, i) in state.inquiryProducts"
            :key="i"
            class="flex items-center justify-between">
            <span>Quantity: {{ p.quantity }}, Date: {{ p.date }}</span>
            <UButton
              color="error"
              size="xs"
              variant="soft"
              @click="removeProduct(i)">
              Remove
            </UButton>
          </li>
        </ul>
      </div>

      <UButton type="submit" label="Submit Inquiry" class="mt-6" />
    </UForm>
    {{state}}
  </div>
</template>

<script setup lang="ts">
import type {FormSubmitEvent} from '@nuxt/ui';
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from '@internationalized/date';
import {
  inquiryInsertSchema,
  type InquiryInsert,
} from '~~/server/database/schema/tables/inquiries';
import type {InquiryProductInsert} from '~~/server/database/schema/tables/inquiryProducts';
import type {InquiryServiceInsert} from '~~/server/database/schema/tables/inquiryServices';

definePageMeta({
  layout: false,
});

const {data: serviceData, status: serviceStatus} = await useFetch<any[]>(
  '/api/services',
  {method: 'get'}
);
const {data: productData, status: productStatus} = await useFetch<any[]>(
  '/api/products',
  {method: 'get'}
);

const wantsProductInstallement = ref(false);

const state = reactive<
  InquiryInsert & {
    inquiryServices: InquiryServiceInsert[];
    inquiryProducts: InquiryProductInsert[];
  }
>({
  client: {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    company: '',
    companyNumber: '',
  },
  additionalInfo: '',
  inquiryServices: [],
  inquiryProducts: [],
});

const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
});

const today = new Date();

const selectedService = ref<number | null>(null);
const serviceQuantity = ref<number>(1);
const serviceDate = shallowRef(
  new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate())
);

const selectedProduct = ref<number | null>(null);
const productQuantity = ref<number>(1);
const productDate = shallowRef(
  new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate())
);

const addService = () => {
  if (selectedService.value !== null && serviceQuantity.value > 0) {
    state.inquiryServices.push({
      serviceId: selectedService.value,
      quantity: serviceQuantity.value,
      date: serviceDate.value.toString(),
    });
    selectedService.value = null;
    serviceQuantity.value = 1;
    serviceDate.value = new CalendarDate(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    );
  }
};

const removeService = (index: number) => {
  state.inquiryServices.splice(index, 1);
};

const addProduct = () => {
  if (selectedProduct.value !== null && productQuantity.value > 0) {
    state.inquiryProducts.push({
      productId: selectedProduct.value,
      quantity: productQuantity.value,
      date: wantsProductInstallement.value
        ? productDate.value.toString()
        : undefined,
    });
    selectedProduct.value = null;
    productQuantity.value = 1;
    productDate.value = new CalendarDate(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    );
    wantsProductInstallement.value = false;
  }
};

const removeProduct = (index: number) => {
  state.inquiryProducts.splice(index, 1);
};

const onSubmit = async (event: FormSubmitEvent<InquiryInsert>) => {
  await $fetch('/api/inquiries', {
    method: 'post',
    body: event.data,
  });
};
</script>
