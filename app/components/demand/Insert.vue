<template>
  <UModal
    v-model:open="open"
    title="Modal with footer"
    description="This is useful when you want a form in a Modal."
    :ui="{footer: 'justify-end'}">
    <UButton label="Open" color="neutral" variant="subtle" />

    <template #body>
      <div>form for inserting demand</div>
    </template>

    <template #footer>
      <UButton
        label="Cancel"
        color="neutral"
        variant="outline"
        @click="open = false" />
      <UButton label="Submit" color="neutral" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
const open = ref(false);
</script>
