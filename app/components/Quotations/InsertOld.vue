<template>
  <UModal
    :open="props.open"
    title="Provide a quotation"
    description="this is fine description"
    @update:open="emit('update:open', $event)">
    <template #body>
      <h2 class="text-xl font-bold">Client Info</h2>
      <UInputNumber v-model="quotation.totalPrice" placeholder="Total price" />
      <UInput v-model="quotation.internalNote" placeholder="Internal note" />

      <h2 class="text-xl font-bold">Add Services</h2>
      <USelectMenu
        v-if="serviceData"
        v-model="selectedService"
        :items="serviceData"
        value-key="id"
        :loading="serviceStatus === 'pending'"
        placeholder="Select a service"
        class="w-full" />
      <UInputNumber v-model="serviceQuantity" />
      <input v-model="serviceDate" type="date" />
      <UInputNumber v-model="serviceUnitPrice" />

      <div v-if="quotation.quotationService.length > 0">
        <h3 class="font-semibold">Selected Services</h3>
        <ul class="list-disc pl-5">
          <li v-for="(s, i) in quotation.quotationService" :key="i">
            Service ID: {{ s.serviceId }}, Quantity: {{ s.quantity }}, Date:
            {{ s.date }}
          </li>
        </ul>
      </div>

      <h2 class="text-xl font-bold">Add Products</h2>
      <USelectMenu
        v-if="productData"
        v-model="selectedProduct"
        :items="productData"
        value-key="id"
        :loading="productStatus === 'pending'"
        placeholder="Select a product"
        class="w-full" />
      <UInputNumber v-model="productQuantity" />
      <UInputNumber v-model="productQuantity" />
      <UInputNumber v-model="productUnitPrice" />

      <div v-if="quotation.quotationProduct.length > 0">
        <h3 class="font-semibold">Selected Products</h3>
        <ul class="list-disc pl-5">
          <li v-for="(p, i) in quotation.quotationProduct" :key="i">
            Product ID: {{ p.productId }}, Quantity: {{ p.quantity }}
          </li>
        </ul>
      </div>

      <button @click="onSubmit">Submit Inquiry</button>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type {z} from 'zod';
import type {inquirySelectSchema} from '~~/server/database/schema/tables/inquiries';

const {data: serviceData, status: serviceStatus} = await useFetch<any[]>(
  '/api/services'
);
const {data: productData, status: productStatus} = await useFetch<any[]>(
  '/api/products'
);

type Inquiry = z.infer<typeof inquirySelectSchema> & {
  client: {
    firstName: string;
    lastName: string;
  };
  inquiryService: {
    serviceId: number;
    serviceQuantity: number;
    serviceDate: string;
    serviceName: string;
  }[];
  inquiryProduct: {
    productId: number;
    productQuantity: number;
    productDate: string;
    productName: string;
  }[];
};


const emit = defineEmits(['update:open']);

const props = defineProps<{
  open: boolean;
  inquiry?: Partial<Inquiry>;
}>();

const quotation = reactive({
  inquiryId: props.inquiry?.inquiryId ?? (null as number | null),
  totalPrice: 0,
  internalNote: '',
  quotationService: [] as {
    serviceId: number;
    quantity: number;
    unitPrice: number;
    serviceDate: string;
  }[],
  quotationProduct: [] as {
    productId: number;
    quantity: number;
    unitPrice: number;
    productDate: string;
  }[],
});

const selectedService = ref<number | null>(null);
const serviceQuantity = ref<number>(1);
const serviceDate = ref<string>(new Date().toISOString().substring(0, 10));
const serviceUnitPrice = ref<number>(1);

const selectedProduct = ref<number | null>(null);
const productQuantity = ref<number>(1);
const productUnitPrice = ref<number>(1);

watch(
  () => props.inquiry,
  (inquiry) => {
    if (!inquiry) return;

    quotation.inquiryId = inquiry.inquiryId ?? null;

    quotation.quotationService = (inquiry.inquiryService || []).map(
      (service) => ({
        serviceId: service.serviceId,
        quantity: service.serviceQuantity,
        serviceDate: service.serviceDate,
        unitPrice: 1,
      })
    );

    quotation.quotationProduct = (inquiry.inquiryProduct || []).map(
      (product) => ({
        productId: product.productId,
        quantity: product.productQuantity,
        productDate: product.productDate,
        unitPrice: 1, 
      })
    );
  },
  {immediate: true, deep: true}
);

const onSubmit = async () => {
  await $fetch('/api/quotations', {
    method: 'post',
    body: quotation,
  });
  alert('Quotation submitted!');
};
</script>
