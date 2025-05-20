<template>
  <UDashboardPanel id="demands">
    <template #header>
      <UDashboardNavbar title="Demands">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <MyDemandInsert />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
        <UInput
          v-model="globalFilter"
          class="max-w-sm"
          placeholder="Filter..." />

        <div class="flex flex-wrap items-center gap-1.5">
          <!-- delete -->
        </div>
      </div>

      <UTable
        ref="table"
        v-model:global-filter="globalFilter"
        v-model:pagination="pagination"
        :pagination-options="{
          getPaginationRowModel: getPaginationRowModel(),
        }"
        class="shrink-0"
        :data="data"
        :columns="columns"
        :loading="status === 'pending'"
        :ui="{
          base: 'table-fixed bdemand-separate bdemand-spacing-0',
          thead: '[&>tr]:bg-(--ui-bg-elevated)/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:bdemand-b-0',
          th: 'py-1 first:rounded-l-[calc(var(--ui-radius)*2)] last:rounded-r-[calc(var(--ui-radius)*2)] bdemand-y bdemand-(--ui-bdemand) first:bdemand-l last:bdemand-r',
          td: 'bdemand-b bdemand-(--ui-bdemand)',
        }">
        <template #expanded="{row}">
          <pre>{{ row.original }}</pre>
        </template>
      </UTable>

      <div
        class="flex items-center justify-between gap-3 bdemand-t bdemand-(--ui-bdemand) pt-4 mt-auto">
        <div class="text-sm text-(--ui-text-muted)">
          {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s)
          returned.
        </div>

        <div class="flex items-center gap-1.5">
          <UPagination
            :default-page="
              (table?.tableApi?.getState().pagination.pageIndex || 0) + 1
            "
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)" />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import {MyQuoteInsert} from '#components';
import type {TableColumn} from '@nuxt/ui';
// @ts-ignore
import {getPaginationRowModel, type Row} from '@tanstack/table-core';
import {type DemandSelect} from '~~/server/database/schema';

const UButton = resolveComponent('UButton');
const UBadge = resolveComponent('UBadge');
const UDropdownMenu = resolveComponent('UDropdownMenu');

const toast = useToast();
const table = useTemplateRef('table');

const {data, status} = await useFetch<DemandSelect[]>('/api/demands', {
  method: 'get',
  lazy: true,
});

const getRowItems = (row: Row<DemandSelect>) => {
  return [
    {
      type: 'label',
      label: 'Actions',
    },
    {
      label: 'Provide a quote',
      icon: 'lucide:file-pen',
      onSelect() {
        const overlay = useOverlay();

        overlay.create(MyQuoteInsert, {
          props: {
            demand: row.original,
          },
          defaultOpen: true,
        });
      },
    },
    {
      label: 'Delete demand',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect() {
        toast.add({
          title: 'Demand deleted',
          description: 'The demand has been deleted.',
        });
      },
    },
  ];
};

const columns: TableColumn<DemandSelect>[] = [
  {
    id: 'expand',
    header: 'More',
    cell: ({row}) =>
      h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        icon: 'i-lucide-chevron-down',
        square: true,
        'aria-label': 'Expand',
        ui: {
          leadingIcon: [
            'transition-transform',
            row.getIsExpanded() ? 'duration-200 rotate-180' : '',
          ],
        },
        onClick: () => row.toggleExpanded(),
      }),
  },
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({row}) => `#${row.original.id}`,
  },
  {
    accessorKey: 'client',
    header: 'Client',
    cell: ({row}) => {
      return [
        h(
          'p',
          {class: 'font-medium text-(--ui-text-highlighted)'},
          `${row.original.client.firstName} ${row.original.client.lastName}`
        ),
        row.original.client.email &&
          h('p', {class: 'text-sm text-gray-500'}, row.original.client.email),
      ];
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({row}) => {
      const color = {
        new: 'warning' as const,
        declined: 'error' as const,
        quoted: 'info' as const,
      }[row.original.status];
      return h(
        UBadge,
        {class: 'capitalize', variant: 'subtle', color},
        () => row.original.status
      );
    },
  },
  {
    header: 'Products',
    cell: ({row}) => {
      const products = row.original.demandProducts ?? [];

      if (products.length === 0) return '—';

      const first = products[0]?.product.name ?? '';
      const second = products[1]?.product.name.slice(0, 5) ?? '';
      const preview = second ? `${first}, ${second}...` : first;

      return h(
        'span',
        {
          title: products.map((i) => i.product.name).join(', '),
        },
        preview
      );
    },
  },
  {
    header: 'Services',
    cell: ({row}) => {
      const services = row.original.demandServices ?? [];

      if (services.length === 0) return '—';

      const first = services[0]?.service.name ?? '';
      const second = services[1]?.service.name.slice(0, 5) ?? '';
      const preview = second ? `${first}, ${second}...` : first;

      return h(
        'span',
        {
          title: services.map((i) => i.service.name).join(', '),
        },
        preview
      );
    },
  },
  {
    accessorKey: 'additionalInfo',
    header: 'Additional Info',
  },
  {
    id: 'actions',
    cell: ({row}) => {
      return h(
        'div',
        {class: 'text-right'},
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end',
            },
            items: getRowItems(row),
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto',
            })
        )
      );
    },
  },
];

const globalFilter = ref('');

const pagination = ref({
  pageIndex: 0,
  pageSize: 10,
});
</script>
