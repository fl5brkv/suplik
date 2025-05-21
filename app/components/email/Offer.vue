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
        Offer Update
      </Text>

      <Text style="margin-bottom: 8px">
        <span style="font-weight: 500">Client Email:</span> {{ client.email }}
      </Text>

      <Hr style="margin: 16px 0; border-color: #e5e7eb" />

      <Text style="font-size: 18px; font-weight: 600; margin-bottom: 12px">
        Offer Details
      </Text>

      <ul style="margin-bottom: 24px; padding-left: 0; list-style: none">
        <li
          v-for="(serviceItem, idx) in offer.offerServices"
          :key="idx"
          style="
            margin-bottom: 20px;
            padding: 12px;
            background-color: #f9fafb;
            border-left: 4px solid #3b82f6;
            border-radius: 4px;
          ">
          <Text style="font-size: 16px; font-weight: 600">
            Service: {{ serviceItem.service.name }}
          </Text>
          <Text style="font-size: 14px; margin-bottom: 8px">
            Quantity: {{ serviceItem.quantity }}
          </Text>

          <ul
            v-if="serviceItem.offerProducts?.length"
            style="padding-left: 0; list-style: none; margin-top: 12px">
            <li
              v-for="(productItem, pidx) in serviceItem.offerProducts"
              :key="pidx"
              style="
                padding: 10px;
                background-color: #f3f4f6;
                border-left: 3px solid #10b981;
                margin-bottom: 8px;
                border-radius: 4px;
              ">
              <Text style="font-size: 14px; font-weight: 500">
                Product: {{ productItem.product.name }}
              </Text>
              <Text style="font-size: 14px">
                Quantity: {{ productItem.quantity }}
              </Text>
            </li>
          </ul>
        </li>
      </ul>

      <Hr style="margin: 16px 0; border-color: #e5e7eb" />

      <Text
        v-if="offer.additionalInfo"
        style="font-style: italic; margin-bottom: 24px">
        Message from us:
        <span style="font-style: normal; font-weight: normal">
          {{ offer.additionalInfo }}
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
import type {OfferEmailSelect} from '~~/server/database/schema';

defineProps<{
  client: {
    email: string;
  };
  offer: OfferEmailSelect;
  response: string;
}>();
</script>
