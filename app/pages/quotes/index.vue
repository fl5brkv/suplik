<template>
  <UDashboardPanel id="quotes">
    <template #header>
      <UDashboardNavbar title="Quotes">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <!-- <MyQuoteInsert /> -->
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
          base: 'table-fixed bquote-separate bquote-spacing-0',
          thead: '[&>tr]:bg-(--ui-bg-elevated)/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:bquote-b-0',
          th: 'py-1 first:rounded-l-[calc(var(--ui-radius)*2)] last:rounded-r-[calc(var(--ui-radius)*2)] bquote-y bquote-(--ui-bquote) first:bquote-l last:bquote-r',
          td: 'bquote-b bquote-(--ui-bquote)',
        }">
        <template #expanded="{row}">
          <pre>{{ row.original }}</pre>
        </template>
      </UTable>

      <div
        class="flex items-center justify-between gap-3 bquote-t bquote-(--ui-bquote) pt-4 mt-auto">
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
import {type QuoteSelect} from '~~/server/database/schema';

const UButton = resolveComponent('UButton');
const UBadge = resolveComponent('UBadge');
const UDropdownMenu = resolveComponent('UDropdownMenu');

const toast = useToast();
const table = useTemplateRef('table');

const {data, status} = await useFetch<QuoteSelect[]>('/api/quotes', {
  method: 'get',
  lazy: true,
});

const getRowItems = (row: Row<QuoteSelect>) => {
  return [
    {
      type: 'label',
      label: 'Actions',
    },
    {
      label: 'Copy demand ID',
      icon: 'i-lucide-copy',
      onSelect() {
        navigator.clipboard.writeText(row.original.id);
        toast.add({
          title: 'Copied to clipboard',
          description: 'Demand ID copied to clipboard',
        });
      },
    },
    {
      type: 'separator',
    },
    // {
    //   label: 'Provide a quote',
    //   icon: 'lucide:file-pen',
    //   onSelect() {
    //     const overlay = useOverlay();

    //     overlay.create(MyQuoteInsert, {
    //       props: {
    //         quote: row.original,
    //       },
    //       defaultOpen: true,
    //     });
    //   },
    // },
    {
      label: 'Delete quote',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect() {
        toast.add({
          title: 'Quote deleted',
          description: 'The quote has been deleted.',
        });
      },
    },
  ];
};

const columns: TableColumn<QuoteSelect>[] = [
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
    accessorKey: 'demandId',
    header: 'Demand ID',
    cell: ({row}) => `Demand #${row.original.id}`,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({row}) => {
      const color = {
        accepted: 'warning' as const,
        declined: 'error' as const,
        sent: 'info' as const,
        commented: 'success' as const,
      }[row.original.status];
      return h(
        UBadge,
        {class: 'capitalize', variant: 'subtle', color},
        () => row.original.status
      );
    },
  },
  {
    accessorKey: 'expiresAt',
    header: 'Expires at',
  },
  {
    id: 'items',
    header: 'Items',
    cell: ({row}) => {
      const items = row.original.quoteItems ?? [];

      if (items.length === 0) return '—';

      const first = items[0]?.item.name ?? '';
      const second = items[1]?.item.name.slice(0, 5) ?? '';
      const preview = second ? `${first}, ${second}...` : first;

      return h(
        'span',
        {
          title: items.map((i) => i.item.name).join(', '),
        },
        preview
      );
    },
  },
  {
    accessorKey: 'version',
    header: 'Version',
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
