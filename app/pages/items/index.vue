<template>
    {{data}}
</template>

<script setup lang="ts">
import type {ItemSelect} from '~~/server/database/schema';

const {data, status} = await useFetch<ItemSelect[]>('/api/items', {
  method: 'get',
});
</script>
