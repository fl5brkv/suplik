<template>
  <UDashboardPanel id="demands">
    <template #header>
      <UDashboardNavbar title="Demands">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
        <UInput
          v-model="globalFilter"
          class="max-w-sm"
          placeholder="Filter..." />
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
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
          td: 'border-b border-default',
        }">
      </UTable>

      <div
        class="flex justify-end gap-1.5 border-t border-default pt-4 mt-auto">
        <UPagination
          :default-page="
            (table?.tableApi?.getState().pagination.pageIndex || 0) + 1
          "
          :items-per-page="table?.tableApi?.getState().pagination.pageSize"
          :total="table?.tableApi?.getFilteredRowModel().rows.length"
          @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)" />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type {NuxtError} from '#app';
import type {TableColumn} from '@nuxt/ui';
import {getPaginationRowModel, type Row} from '@tanstack/table-core';
import {type DemandSelect} from '~~/server/database/schema';

const UButton = resolveComponent('UButton');
const UBadge = resolveComponent('UBadge');
const UDropdownMenu = resolveComponent('UDropdownMenu');
const UTooltip = resolveComponent('UTooltip');

const toast = useToast();
const table = useTemplateRef('table');

const {data, status, refresh} = await useFetch<DemandSelect[]>('/api/demands', {
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
      label: 'Delete demand',
      icon: 'i-lucide-trash',
      color: 'error',
      async onSelect() {
        try {
          await $fetch(`/api/demands/${row.original.id}`, {
            method: 'DELETE',
          });
          toast.add({
            title: 'Demand deleted',
            description: 'The demand has been deleted.',
            color: 'success',
          });

          await refresh();
        } catch (err) {
          const error = err as NuxtError;

          toast.add({
            title: 'Error',
            description:
              error.statusMessage ||
              'Oops! Something went wrong. Please try again later.',
            color: 'error',
          });
        }
      },
    },
  ];
};

const columns: TableColumn<DemandSelect>[] = [
  {
    accessorKey: 'case.code',
    header: 'ID',
    cell: ({row}) => {
      const code = row.original.case.code;
      return h('div', {class: 'flex items-center gap-2'}, [
        h(UButton, {
          icon: 'i-lucide-copy',
          color: 'neutral',
          variant: 'ghost',
          label: code,
          size: 'xs',
          'aria-label': 'Copy case code',
          onClick: () => {
            navigator.clipboard.writeText(code);
            toast.add({
              title: 'Case code copied to clipboard!',
              color: 'success',
              icon: 'i-lucide-circle-check',
            });
          },
        }),
      ]);
    },
  },
  {
    accessorKey: 'client',
    header: 'Client',
    cell: ({row}) => {
      return [
        h(
          'p',
          {class: 'font-medium text-(--ui-text-highlighted)'},
          `${row.original.case.client.firstName} ${row.original.case.client.lastName}`
        ),
        row.original.case.client.company &&
          h(
            'p',
            {class: 'text-sm text-gray-500'},
            row.original.case.client.company
          ),
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

      const previewCount = 2; // Show first 2, rest in tooltip
      const preview = products
        .slice(0, previewCount)
        .map((item) => `${item.product.name} (x${item.quantity})`)
        .join(', ');
      const rest = products
        .slice(previewCount)
        .map((item) => `${item.product.name} (x${item.quantity})`)
        .join(', ');

      if (products.length > previewCount) {
        return h(
          UTooltip,
          {
            text: products
              .map((item) => `${item.product.name} (x${item.quantity})`)
              .join(', '),
          },
          {
            default: () => h('span', {}, `${preview}, ...`),
          }
        );
      } else {
        return h('span', {}, preview);
      }
    },
  },
  {
    header: 'Services',
    cell: ({row}) => {
      const services = row.original.demandServices ?? [];
      if (services.length === 0) return '—';

      const previewCount = 2;
      const preview = services
        .slice(0, previewCount)
        .map((item) => `${item.service.name} (x${item.quantity})`)
        .join(', ');
      const rest = services
        .slice(previewCount)
        .map((item) => `${item.service.name} (x${item.quantity})`)
        .join(', ');

      if (services.length > previewCount) {
        return h(
          UTooltip,
          {
            text: services
              .map((item) => `${item.service.name} (x${item.quantity})`)
              .join(', '),
          },
          {
            default: () => h('span', {}, `${preview}, ...`),
          }
        );
      } else {
        return h('span', {}, preview);
      }
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
