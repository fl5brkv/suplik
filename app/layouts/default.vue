<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-(--ui-bg-elevated)/25"
      :ui="{footer: 'lg:border-t lg:border-(--ui-border)'}">
      <template #header="{collapsed}">
        <MyWebsiteMenu :collapsed="collapsed" />
      </template>

      <template #default="{collapsed}">
        <UDashboardSearchButton
          :collapsed="collapsed"
          class="bg-transparent ring-(--ui-border)" />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical" />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          class="mt-auto" />
      </template>

      <template #footer="{collapsed}">
        <MyUserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />

    <slot />
  </UDashboardGroup>
</template>

<script setup lang="ts">
const open = ref(false);

const links = [
  [
    {
      label: 'Clients',
      icon: 'lucide:users',
      to: '/clients',
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: 'Inquiries',
      icon: 'lucide:hand-helping',
      to: '/inquiries',
      badge: '4',
      onSelect: () => {
        open.value = false;
      },
    },
    // {
    //   label: 'Settings',
    //   to: '/settings',
    //   icon: 'i-lucide-settings',
    //   defaultOpen: true,
    //   children: [
    //     {
    //       label: 'General',
    //       to: '/settings',
    //       exact: true,
    //       onSelect: () => {
    //         open.value = false;
    //       },
    //     },
    //     {
    //       label: 'Members',
    //       to: '/settings/members',
    //       onSelect: () => {
    //         open.value = false;
    //       },
    //     },
    //     {
    //       label: 'Notifications',
    //       to: '/settings/notifications',
    //       onSelect: () => {
    //         open.value = false;
    //       },
    //     },
    //     {
    //       label: 'Security',
    //       to: '/settings/security',
    //       onSelect: () => {
    //         open.value = false;
    //       },
    //     },
    //   ],
    // },
  ],
  [
    {
      label: 'Nahlásiť chybu',
      icon: 'lucide:message-circle-warning',
      to: 'https://github.com/nuxt/ui-pro',
      target: '_blank',
    },
  ],
];

const groups = computed(() => [
  {
    id: 'links',
    label: 'Go to',
    items: links.flat(),
  },
]);
</script>
