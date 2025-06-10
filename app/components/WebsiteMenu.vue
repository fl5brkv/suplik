<template>
  <UDropdownMenu
    :items="items"
    :content="{align: 'center', collisionPadding: 12}"
    :ui="{
      content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)',
    }">
    <UButton
      v-bind="{
        label: collapsed ? undefined : 'Šuplík',
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down',
      }"
      color="neutral"
      variant="ghost"
      block
      icon="fluent-emoji-flat:card-file-box"
      :square="collapsed"
      class="data-[state=open]:bg-(--ui-bg-elevated)"
      :class="[!collapsed && 'py-2']"
      :ui="{
        trailingIcon: 'text-(--ui-text-dimmed)',
      }" />
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type {DropdownMenuItem} from '@nuxt/ui';

defineProps<{
  collapsed?: boolean;
}>();

const items = ref<DropdownMenuItem[]>([
  {
    label: 'Šuplík',
    icon: 'fluent-emoji-flat:card-file-box',
    to: '/'
  },
  {
    label: 'Royal Fox',
    icon: 'fluent-emoji-flat:fox',
    to: 'https://www.royal-fox.cz/'
  },
]);
</script>
