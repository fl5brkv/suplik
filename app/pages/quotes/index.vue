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
        :pagination-options="{getPaginationRowModel: getPaginationRowModel()}"
        class="shrink-0"
        :data="data"
        :columns="columns"
        :loading="status === 'pending'"
        :grouping="['demandId']"
        :grouping-options="groupingOptions"
        :ui="{
          base: 'table-fixed bdemand-separate bdemand-spacing-0',
          thead: '[&>tr]:bg-(--ui-bg-elevated)/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:bdemand-b-0',
          th: 'py-1 first:rounded-l-[calc(var(--ui-radius)*2)] last:rounded-r-[calc(var(--ui-radius)*2)] bdemand-y bdemand-(--ui-bdemand) first:bdemand-l last:bdemand-r',
          td: 'empty:p-0',
          root: 'min-w-full',
        }">
        <template #expandable-cell="{row}">
          <div v-if="row.getIsGrouped()" class="flex items-center">
            <UButton
              variant="outline"
              color="neutral"
              class="mr-2"
              size="xs"
              :icon="row.getIsExpanded() ? 'i-lucide-minus' : 'i-lucide-plus'"
              @click="row.toggleExpanded()" /></div></template
      ></UTable>

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
import type {DropdownMenuItem, TableColumn} from '@nuxt/ui';
import {
  getPaginationRowModel,
  type Row,
  getGroupedRowModel,
  type GroupingOptions,
} from '@tanstack/table-core';
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

const getRowItems = (row: Row<QuoteSelect>): DropdownMenuItem[] => {
  const items: DropdownMenuItem[] = [
    {
      type: 'label',
      label: 'Actions',
    },
  ];

  if (row.original.status === 'accepted') {
    items.push({
      label: 'Provide a job',
      icon: 'lucide:file-pen',
      onSelect() {
        const overlay = useOverlay();

        overlay.create(MyQuoteInsert, {
          props: {
            quote: row.original,
          },
          defaultOpen: true,
        });
      },
    });
  }

  items.push({
    label: 'Delete quote',
    icon: 'i-lucide-trash',
    color: 'error',
    onSelect() {
      toast.add({
        title: 'Quote deleted',
        description: 'The quote has been deleted.',
      });
    },
  });

  return items;
};

const columns: TableColumn<QuoteSelect>[] = [
  {
    id: 'expandable',
  },
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({row}) => `#${row.original.id}`,
  },
  {
    accessorKey: 'demandId',
    header: 'Demand ID',
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
    aggregationFn: 'max',
  },
  {
    accessorKey: 'additionalInfo',
    header: 'Additional Info',
    aggregationFn: 'max',
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

const groupingOptions = ref<GroupingOptions>({
  groupedColumnMode: 'remove',
  getGroupedRowModel: getGroupedRowModel(),
});
</script>
