<template>
  <UDropdownMenu
    :items="items"
    :content="{align: 'center', collisionPadding: 12}"
    :ui="{
      content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)',
    }">
    <UButton
      v-bind="{
        label: collapsed ? undefined : 'Stodo',
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down',
      }"
      color="neutral"
      variant="ghost"
      block
      icon="lucide:ice-cream-cone"
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
    label: 'Stodo',
    icon: 'lucide:ice-cream-cone',
    to: '/clients'
  },
  {
    label: 'Okná Stuchlik',
    icon: 'lucide:door-closed',
    to: 'https://www.oknastuchlik.sk/'
  },
]);
</script>
