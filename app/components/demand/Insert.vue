<template>
  <UModal
    title="Modal with footer"
    description="This is a description"
    :ui="{footer: 'justify-end'}">
    <UButton label="New demand" color="neutral" variant="subtle" />

    <template #body>
      <div>form for inserting demand comin' soon</div>
    </template>

    <template #footer>
      <UButton label="Submit" color="neutral" />
    </template>
  </UModal>
</template>
