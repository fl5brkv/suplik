<template>
  <UModal
    :open="props.open"
    title="Provide a quotation"
    description="this is fine description"
    @update:open="emit('update:open', $event)">
    <template #body>
      {{props.inquiry}}
      <UInput v-model="props.inquiry.client.firstName" disabled></UInput>
      <!-- <UForm :state="state" class="flex flex-col gap-4">
        <UFormField label="Internal Note" name="internalNote">
          <UInput
            v-model="state.internalNote"
            placeholder="Add internal note..." />
        </UFormField>

        <div v-if="state.quotationServices.length">
          <h3>Services</h3>
          <UForm
            v-for="(service, idx) in state.quotationServices"
            :key="idx"
            :state="service"
            attach
            class="flex gap-2">
            <UFormField label="Name" name="name">
              <UInput v-model="service.name" disabled />
            </UFormField>
            <UFormField label="Quantity" name="quantity">
              <UInput v-model="service.quantity" type="number" disabled />
            </UFormField>
            <UFormField label="Date" name="date">
              <UInput v-model="service.date" type="date" disabled />
            </UFormField>
            <UFormField label="Unit Price" name="unitPrice">
              <UInput v-model="service.unitPrice" type="number" />
            </UFormField>
          </UForm>
        </div>

        <div v-if="state.quotationProducts.length">
          <h3>Products</h3>
          <UForm
            v-for="(product, idx) in state.quotationProducts"
            :key="idx"
            :state="product"
            attach
            class="flex gap-2">
            <UFormField label="Name" name="name">
              <UInput v-model="product.name" disabled />
            </UFormField>
            <UFormField label="Quantity" name="quantity">
              <UInput v-model="product.quantity" type="number" disabled />
            </UFormField>
            <UFormField label="Date" name="date">
              <UInput v-model="product.date" type="date" disabled />
            </UFormField>
            <UFormField label="Unit Price" name="unitPrice">
              <UInput v-model="product.unitPrice" type="number" />
            </UFormField>
          </UForm>
        </div>

        <UButton type="submit">Submit Quotation</UButton>
      </UForm> -->
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type {InquirySelect} from '~~/server/database/schema/tables/inquiries';

const props = defineProps<{inquiry: InquirySelect; open: boolean}>();

const emit = defineEmits(['update:open']);

const state = reactive({
  inquiryId: props.inquiry.id,
  internalNote: '',
  quotationServices:
    props.inquiry.inquiryServices?.map((s) => ({
      ...s,
      unitPrice: 0,
    })) ?? [],
  quotationProducts:
    props.inquiry.inquiryProducts?.map((p) => ({
      ...p,
      unitPrice: 0,
    })) ?? [],
});
</script>

<!-- okay this is the type of data im getting through props from my parent component:
{ "id": 3, "clientId": 2, "status": "new", "additionalInfo": "Eu qui aut
deserunt ", "client": { "firstName": "Ignatius", "lastName": "Cabrera", "email":
"xofeve@mailinator.com" }, "inquiryServices": [ { "serviceId": 3, "quantity":
88, "date": "2025-04-28", "name": "Nastavenie drevených vchodových dverí" }, {
"serviceId": 3, "quantity": 88, "date": "2025-04-28", "name": "Nastavenie
drevených vchodových dverí" }, { "serviceId": 3, "quantity": 4, "date":
"2025-04-28", "name": "Nastavenie interiérových dverí" }, { "serviceId": 3,
"quantity": 4, "date": "2025-04-28", "name": "Nastavenie interiérových dverí" },
{ "serviceId": 3, "quantity": 9, "date": "2025-04-28", "name": "Odborné
poradenstvo na mieste" }, { "serviceId": 3, "quantity": 9, "date": "2025-04-28",
"name": "Odborné poradenstvo na mieste" } ], "inquiryProducts": [ { "productId":
1, "quantity": 871, "date": "2025-04-28", "name": "Window" }, { "productId": 3,
"quantity": 3, "date": null, "name": "Drill" }, { "productId": 1, "quantity":
871, "date": "2025-04-28", "name": "Window" }, { "productId": 3, "quantity": 3,
"date": null, "name": "Drill" }, { "productId": 1, "quantity": 871, "date":
"2025-04-28", "name": "Window" }, { "productId": 3, "quantity": 3, "date": null,
"name": "Drill" } ] }, now, i need to pass this data to the inputs. not all of
them, but most of them. they should be editable all of them. and to the
inquiryproduct and inquiryservice i also need to add the unitPrice what is
number. help me with that and build also form with nuxt ui for it. this is the
type of InquirySelect: (alias) type InquirySelect = { id: number; clientId:
number; status: "new" | "quoted" | "rejected"; additionalInfo: string | null;
client: { firstName: string; lastName: string; email: string; };
inquiryServices?: { date: string; id: number; name: string; quantity: number;
}[] | undefined; inquiryProducts?: { ...; }[] | undefined; } import
InquirySelect -->
