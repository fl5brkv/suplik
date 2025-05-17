<template>
  <div class="p-6 space-y-6">
    <div
      v-for="job in data"
      :key="job.id"
      class="bg-white shadow-md rounded-xl p-4 space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">Job #{{ job.id }}</h2>
        <span class="text-sm text-gray-500">{{ job.status }}</span>
      </div>
      <p class="text-gray-600">{{ job.additionalInfo }}</p>

      <div v-if="job.demands" class="space-y-4 border-t pt-4">
        <!-- Demand Items -->
        <div>
          <h3 class="font-medium text-gray-800 mb-2">Demand Items</h3>
          <ul class="space-y-1">
            <li
              v-for="item in job.demands.demandItems"
              :key="item.itemId"
              class="text-sm text-gray-700">
              {{ item.item.name }} — Quantity: {{ item.quantity }}
              <span
                v-if="item.item.productDetail"
                class="text-xs text-gray-500">
                (Stock: {{ item.item.productDetail.stock }}, Reserved:
                {{ item.item.productDetail.reserved }})
              </span>
              <span v-else class="text-xs text-gray-400"
                >(No product details)</span
              >
            </li>
          </ul>
        </div>

        <!-- Quotes -->
        <div v-if="job.demands.quotes.length" class="border-t pt-4">
          <h3 class="font-medium text-gray-800 mb-2">Quotes</h3>
          <div
            v-for="quote in job.demands.quotes"
            :key="quote.id"
            class="bg-gray-50 rounded p-3 space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium"
                >Quote #{{ quote.id }} (v{{ quote.version }})</span
              >
              <span class="text-sm text-green-600">{{ quote.status }}</span>
            </div>
            <p class="text-sm text-gray-600">{{ quote.additionalInfo }}</p>

            <!-- Quote Items -->
            <ul class="ml-4 list-disc text-sm text-gray-700">
              <li v-for="qi in quote.quoteItems" :key="qi.id">
                Item ID: {{ qi.itemId }}, Quantity: {{ qi.quantity }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const {data, status} = await useFetch('/api/jobs', {
  method: 'get',
  lazy: true,
});
</script>
