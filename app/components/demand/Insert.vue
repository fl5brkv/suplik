<template>
  <UModal
    title="Modal with footer"
    description="This is useful when you want a form in a Modal."
    :ui="{footer: 'justify-end'}">
    <UButton label="Open" color="neutral" variant="subtle" />

    <template #body>
      <div>form for inserting demand</div>
    </template>

    <template #footer>
      <UButton label="Submit" color="neutral" />
    </template>
  </UModal>
</template>
