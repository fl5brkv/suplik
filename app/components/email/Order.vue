<template>
  <Html lang="en">
    <div
      style="
        padding: 24px;
        background-color: #ffffff;
        color: #1f2937;
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 1.5;
      ">
      <Text style="font-size: 24px; font-weight: bold; margin-bottom: 16px">
        New Order Request
      </Text>

      <Text style="margin-bottom: 8px">
        You have received a new order request for the following item:
      </Text>

      <ul style="margin-bottom: 24px; padding-left: 0; list-style: none">
        <li
          style="
            padding: 12px;
            background-color: #f9fafb;
            border-left: 4px solid #3b82f6;
            margin-bottom: 12px;
            border-radius: 4px;
          ">
          <Text style="font-size: 14px; font-weight: 500">
            Item: {{ product.name }}
          </Text>
          <Text style="font-size: 14px">Quantity: {{ order.quantity }}</Text>
        </li>
      </ul>

      <Hr style="margin: 16px 0; border-color: #e5e7eb" />

      <Text style="margin-bottom: 16px">
        Please confirm whether you can fulfill this order.
      </Text>

      <div style="display: flex; gap: 16px">
        <Button
          :href="response"
          style="
            background-color: #16a34a;
            color: #ffffff;
            padding: 10px 20px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            text-decoration: none;
            display: inline-block;
          ">
          Accept
        </Button>

        <Button
          :href="response"
          style="
            background-color: #dc2626;
            color: #ffffff;
            padding: 10px 20px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            text-decoration: none;
            display: inline-block;
          ">
          Decline
        </Button>
      </div>
    </div>
  </Html>
</template>

<script setup lang="ts">
import {Html, Text, Hr, Button} from '@vue-email/components';

defineProps<{
  order: {
    quantity: number;
  };
  product: {
    name: string;
  };
  response: string;
}>();
</script>
