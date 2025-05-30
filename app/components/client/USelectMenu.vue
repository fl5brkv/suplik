<template>
  <UFormField label="Client" required class="mb-6">
    <USelectMenu
      v-model="selectedClient"
      :items="data"
      :loading="status === 'pending'"
      placeholder="Select client"
      size="md"
      class="w-full">
      <template #item-label="{item}">
        <div>
          <div class="font-medium">{{ item.label }}</div>
          <div v-if="item.company" class="text-xs text-gray-500">
            {{ item.company }}
          </div>
        </div>
      </template>
    </USelectMenu>
  </UFormField>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: any; 
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();

const selectedClient = ref(props.modelValue);

watch(selectedClient, (val) => {
  emit('update:modelValue', val);
});

const {data, status} = await useFetch('/api/clients', {
  key: 'clients',
  method: 'get',
  lazy: true,
  transform: (data) =>
    data?.map((client) => ({
      label: `${client.firstName} ${client.lastName}`,
      value: client.id, 
      ...client, 
    })),
});
</script>
