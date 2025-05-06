<template>
  <UModal
    :open="props.open"
    title="Provide a quotation"
    description="this is fine description"
    @update:open="emit('update:open', $event)">
    <template #body>
      {{ state }}
      <UForm :state="state" @submit="onSubmit">
        <h3 class="text-lg font-medium mt-4 mb-2">General info</h3>
        <UInputNumber v-model="state.totalPrice" />
        <UInput v-model="state.internalNote" />
        <h3 class="text-lg font-medium mt-4 mb-2">Services</h3>

        <div
          v-for="(service, index) in state.inquiryService"
          :key="`service-${service.serviceId}`">
          <UForm :state="service" attach>
            <div class="p-4 border rounded-md mb-4">
              <UFormField
                :label="`Service Name ${index + 1}`"
                name="serviceName">
                <UInput v-model="service.serviceName" disabled />
              </UFormField>

              <UFormField
                :label="`Service Quantity ${index + 1}`"
                name="serviceQuantity">
                <UInput
                  v-model="service.serviceQuantity"
                  type="number"
                  disabled />
              </UFormField>

              <UFormField
                :label="`Service Date ${index + 1}`"
                name="serviceDate">
                <UInput v-model="service.serviceDate" type="date" disabled />
              </UFormField>

              <UFormField :label="`Unit Price ${index + 1}`" name="unitPrice">
                <UInput v-model="service.unitPrice" type="number" />
              </UFormField>
            </div>
          </UForm>
        </div>

        <h3 class="text-lg font-medium mt-4 mb-2">Products</h3>

        <div
          v-for="(product, index) in state.inquiryProduct"
          :key="`product-${product.productId}`">
          <UForm :state="product" attach>
            <div class="p-4 border rounded-md mb-4">
              <UFormField
                :label="`Product Name ${index + 1}`"
                name="productName">
                <UInput v-model="product.productName" disabled />
              </UFormField>

              <UFormField
                :label="`Product Quantity ${index + 1}`"
                name="productQuantity">
                <UInput
                  v-model="product.productQuantity"
                  type="number"
                  disabled />
              </UFormField>

              <UFormField
                :label="`Product Date ${index + 1}`"
                name="productDate">
                <UInput v-model="product.productDate" type="date" disabled />
              </UFormField>

              <UFormField :label="`Unit Price ${index + 1}`" name="unitPrice">
                <UInput v-model="product.unitPrice" type="number" />
              </UFormField>
            </div>
          </UForm>
        </div>
        <UButton type="submit" color="primary"> Submit Quotation </UButton>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const emit = defineEmits(['update:open']);

const props = defineProps<{
  open: boolean;
  inquiryData?: any;
}>();

const state = reactive({
  inquiryId: null,
  totalPrice: 0,
  internalNote: '',
  inquiryService: [],
  inquiryProduct: [],
});

watch(
  () => props.inquiryData,
  (newData) => {
    if (newData) {
      state.inquiryId = newData.inquiryId;

      // Update services with the unitPrice field
      if (newData.inquiryService) {
        state.inquiryService = newData.inquiryService.map((service) => ({
          ...service, // Keep all original properties
          unitPrice: service.unitPrice || 0,
        }));
      }

      // Update products with the unitPrice field
      if (newData.inquiryProduct) {
        state.inquiryProduct = newData.inquiryProduct.map((product) => ({
          ...product, // Keep all original properties
          unitPrice: product.unitPrice || 0,
        }));
      }
    }
  },
  {immediate: true, deep: true}
);

const onSubmit = async () => {
  // Create a copy of the state to modify before submission
  const submissionData = JSON.parse(JSON.stringify(state));

  // Rename inquiryService to quotationService and map properties
  const quotationService = submissionData.inquiryService.map((service) => {
    const {serviceName, serviceQuantity, serviceDate, ...rest} = service;
    return {
      ...rest,
      quantity: serviceQuantity, // Map serviceQuantity to quantity
      date: serviceDate, // Map serviceDate to date
    };
  });

  // Rename inquiryProduct to quotationProduct and map properties
  const quotationProduct = submissionData.inquiryProduct.map((product) => {
    const {productName, productQuantity, productDate, ...rest} = product;
    return {
      ...rest,
      quantity: productQuantity, // Map productQuantity to quantity
      date: productDate, // Map productDate to date
    };
  });

  // Remove the original arrays and add the renamed ones
  delete submissionData.inquiryService;
  delete submissionData.inquiryProduct;

  // Add the renamed arrays to the submission data
  submissionData.quotationService = quotationService;
  submissionData.quotationProduct = quotationProduct;

  await $fetch('/api/quotations', {
    method: 'post',
    body: submissionData,
  });
};
</script>
