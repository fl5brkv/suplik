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
      label: 'Demands',
      icon: 'lucide:hand-helping',
      to: '/admin/demands',
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: 'Quotes',
      icon: 'lucide:file-digit',
      to: '/admin/quotes',
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: 'Offers',
      icon: 'lucide:file-code-2',
      to: '/admin/offers',
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: 'Jobs',
      icon: 'lucide:hammer',
      to: '/admin/jobs',
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: 'Items',
      icon: 'lucide:archive',
      children: [
        {
          label: 'Products',
          to: '/admin/products',
          icon: 'lucide:boxes',
          onSelect: () => {
            open.value = false;
          },
        },
        {
          label: 'Suppliers',
          to: '/admin/suppliers',
          icon: 'lucide:file-user',
          onSelect: () => {
            open.value = false;
          },
        },
        {
          label: 'Orders',
          to: '/admin/orders',
          icon: 'lucide:ship',
          onSelect: () => {
            open.value = false;
          },
        },
        {
          label: 'Complaints',
          to: '/admin/complaints',
          icon: 'lucide:package-x',
          onSelect: () => {
            open.value = false;
          },
        },
        {
          label: 'Services',
          to: '/admin/services',
          icon: 'lucide:life-buoy',
          onSelect: () => {
            open.value = false;
          },
        },
      ],
    },
    {
      label: 'Clients',
      icon: 'lucide:user',
      to: '/admin/clients',
      onSelect: () => {
        open.value = false;
      },
    },
    {
      label: 'Technicians',
      icon: 'lucide:user-cog',
      to: '/admin/technicians',
      onSelect: () => {
        open.value = false;
      },
    },
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
