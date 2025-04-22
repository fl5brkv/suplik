<template>
  <div class="space-y-6 p-4 max-w-xl mx-auto">
    <h2 class="text-xl font-bold">Client Info</h2>
    <UInput v-model="inquiry.client.firstName" placeholder="First Name" />
    <UInput v-model="inquiry.client.lastName" placeholder="Last Name" />
    <UInput v-model="inquiry.client.email" placeholder="Email" type="email" />
    <UInput v-model="inquiry.client.phoneNumber" placeholder="Phone Number" />
    <UInput v-model="inquiry.client.company" placeholder="Company (optional)" />
    <UInput
      v-model="inquiry.client.company_number"
      placeholder="Company Number (optional)" />
    <UTextarea
      v-model="inquiry.additionalInfo"
      placeholder="Additional Info (optional)" />

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
    <button @click="addService">Add Service</button>

    <div v-if="inquiry.inquiryService.length > 0">
      <h3 class="font-semibold">Selected Services</h3>
      <ul class="list-disc pl-5">
        <li v-for="(s, i) in inquiry.inquiryService" :key="i">
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
    <button @click="addProduct">Add Product</button>

    <div v-if="inquiry.inquiryProduct.length > 0">
      <h3 class="font-semibold">Selected Products</h3>
      <ul class="list-disc pl-5">
        <li v-for="(p, i) in inquiry.inquiryProduct" :key="i">
          Product ID: {{ p.productId }}, Quantity: {{ p.quantity }}
        </li>
      </ul>
    </div>

    <button @click="onSubmit">Submit Inquiry</button>
  </div>
</template>

<script setup lang="ts">
const {data: serviceData, status: serviceStatus} = await useFetch<any[]>(
  '/api/services'
);
const {data: productData, status: productStatus} = await useFetch<any[]>(
  '/api/products'
);

const inquiry = reactive({
  client: {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    company: null,
    company_number: null,
  },
  additionalInfo: '',
  inquiryService: [] as {
    date: string;
    serviceId: number;
    quantity: number;
  }[],
  inquiryProduct: [] as {
    productId: number;
    quantity: number;
  }[],
});

const selectedService = ref<number | null>(null);
const serviceQuantity = ref<number>(1);
const serviceDate = ref<string>(new Date().toISOString().substring(0, 10));

const selectedProduct = ref<number | null>(null);
const productQuantity = ref<number>(1);

function addService() {
  if (selectedService.value !== null && serviceQuantity.value > 0) {
    inquiry.inquiryService.push({
      serviceId: selectedService.value,
      quantity: serviceQuantity.value,
      date: serviceDate.value,
    });
    selectedService.value = null;
    serviceQuantity.value = 1;
  }
}

function addProduct() {
  if (selectedProduct.value !== null && productQuantity.value > 0) {
    inquiry.inquiryProduct.push({
      productId: selectedProduct.value,
      quantity: productQuantity.value,
    });
    selectedProduct.value = null;
    productQuantity.value = 1;
  }
}

const onSubmit = async () =>  {
  await $fetch('/api/inquiries', {
    method: 'post'
    body: inquiry,
  });
  alert('Inquiry submitted!');
}
</script>
