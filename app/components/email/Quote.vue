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
        Order Update
      </Text>

      <Text style="margin-bottom: 8px">
        <span style="font-weight: 500">Case Code:</span> {{ quote.case.code }}
      </Text>

      <Text style="margin-bottom: 8px">
        <span style="font-weight: 500">Client Email:</span>
        {{ quote.case.client.email }}
      </Text>

      <Hr style="margin: 16px 0; border-color: #e5e7eb" />

      <Text style="font-size: 18px; font-weight: 600; margin-bottom: 12px">
        Quote Items
      </Text>

      <ul style="margin-bottom: 24px; padding-left: 0; list-style: none">
        <p>Products</p>
        <li
          v-for="(product, idx) in quote.quoteProducts"
          :key="idx"
          style="
            padding: 12px;
            background-color: #f9fafb;
            border-left: 4px solid #3b82f6;
            margin-bottom: 12px;
            border-radius: 4px;
          ">
          <Text style="font-size: 14px; font-weight: 500">
            Product: {{ product.product.name }}
          </Text>
          <Text style="font-size: 14px">Quantity: {{ product.quantity }}</Text>
        </li>
      </ul>

      <ul style="margin-bottom: 24px; padding-left: 0; list-style: none">
        <p>Services</p>
        <li
          v-for="(service, idx) in quote.quoteServices"
          :key="idx"
          style="
            padding: 12px;
            background-color: #f9fafb;
            border-left: 4px solid #3b82f6;
            margin-bottom: 12px;
            border-radius: 4px;
          ">
          <Text style="font-size: 14px; font-weight: 500">
            Service: {{ service.service.name }}
          </Text>
          <Text style="font-size: 14px">Quantity: {{ service.quantity }}</Text>
        </li>
      </ul>

      <Hr style="margin: 16px 0; border-color: #e5e7eb" />

      <Text style="font-style: italic; margin-bottom: 24px">
        Message from us:
        <span style="font-style: normal; font-weight: normal">
          {{ quote.additionalInfo || '—' }}
        </span>
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

        <Button
          :href="response"
          style="
            background-color: #2563eb;
            color: #ffffff;
            padding: 10px 20px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            text-decoration: none;
            display: inline-block;
          ">
          Comment
        </Button>
      </div>
    </div>
  </Html>
</template>

<script setup lang="ts">
import {Html, Text, Hr, Button} from '@vue-email/components';
import type {QuoteEmailSelect} from '~~/server/database/schema';

defineProps<{
  quote: QuoteEmailSelect;
  response: string;
}>();
</script>
