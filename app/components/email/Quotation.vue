<template>
  <Html lang="en">
    <Text class="text-xl font-semibold mb-2">Order Update</Text>

    <Text class="mb-1">Client: {{ client.email }}</Text>

    <Hr class="my-3" />

    <Text class="font-semibold mb-2">Quotation Items:</Text>
    <ul class="mb-4">
      <li
        v-for="(item, index) in quotationItems"
        :key="index"
        class="mb-2 pl-2 border-l-4 border-blue-400">
        <Text>Quantity: {{ item.quantity }}</Text>
      </li>
    </ul>

    <Hr class="my-3" />

    <Text class="italic mb-4"
      >Message from us: {{ additionalInfo || '—' }}</Text
    >

    <div class="flex gap-4">
      <Button
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        :href="`https://yourdomain.com/orders/${id}/accept`">
        Accept
      </Button>
      <Button
        class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        :href="`https://yourdomain.com/orders/${id}/decline`">
        Decline
      </Button>
    </div>
  </Html>
</template>

<script setup lang="ts">
import {Html, Text, Hr, Button} from '@vue-email/components';

defineProps<{
  id: number;
  expiresAt: number;
  additionalInfo: string | null;
  client: {
    email: string;
  };
  quotationItems: {
    item: {
      name: string
    },
    quantity: number;
  }[];
}>();
</script>
