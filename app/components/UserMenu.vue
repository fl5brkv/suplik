<template>
  <UDropdownMenu
    :items="items"
    :content="{align: 'center', collisionPadding: 12}"
    :ui="{
      content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)',
    }">
    <UButton
      v-bind="{
        ...user,
        label: collapsed ? undefined : user?.email,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down',
      }"
      color="neutral"
      variant="ghost"
      block
      icon="lucide:user"
      :square="collapsed"
      class="data-[state=open]:bg-(--ui-bg-elevated)"
      :ui="{
        trailingIcon: 'text-(--ui-text-dimmed)',
      }" />

    <template #chip-leading="{item}">
      <span
        :style="{ '--chip': `var(--color-${(item as any).chip}-400)` }"
        class="ms-0.5 size-2 rounded-full bg-(--chip)" />
    </template>
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type {DropdownMenuItem} from '@nuxt/ui';
const {user, clear} = useUserSession();
const toast = useToast();

defineProps<{
  collapsed?: boolean;
}>();

const colorMode = useColorMode();

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      type: 'label',
      label: user.value?.email,
      icon: 'lucide:user',
    },
  ],
  [
    {
      label: 'Appearance',
      icon: 'i-lucide-sun-moon',
      children: [
        {
          label: 'Light',
          icon: 'i-lucide-sun',
          type: 'checkbox',
          checked: colorMode.value === 'light',
          onSelect(e: Event) {
            e.preventDefault();

            colorMode.preference = 'light';
          },
        },
        {
          label: 'Dark',
          icon: 'i-lucide-moon',
          type: 'checkbox',
          checked: colorMode.value === 'dark',
          onUpdateChecked(checked: boolean) {
            if (checked) {
              colorMode.preference = 'dark';
            }
          },
          onSelect(e: Event) {
            e.preventDefault();
          },
        },
      ],
    },
  ],
  [
    {
      label: 'Log out',
      icon: 'lucide:log-out',
      async onSelect() {
        await clear();
        await navigateTo('/login');
        toast.add({
          title: 'Success',
          description: 'Succesfully logged out!',
        });
      },
    },
  ],
]);
</script>
