<template>
  <MyQuotationsInsert
    v-model:open="showQuotationsInsert"
    :inquiry="selectedInquiry" />

  <UDashboardPanel id="inquiries">
    <template #header>
      <UDashboardNavbar title="Inquiries">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <!-- add new -->
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
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-(--ui-bg-elevated)/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-1 first:rounded-l-[calc(var(--ui-radius)*2)] last:rounded-r-[calc(var(--ui-radius)*2)] border-y border-(--ui-border) first:border-l last:border-r',
          td: 'border-b border-(--ui-border)',
        }">
        <template #expanded="{row}">
          <pre>{{ row.original }}</pre>
        </template></UTable
      >

      <div
        class="flex items-center justify-between gap-3 border-t border-(--ui-border) pt-4 mt-auto">
        <div class="text-sm text-(--ui-text-muted)">
          {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }}
          of
          {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s)
          selected.
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
import {UBadge} from '#components';
import type {TableColumn} from '@nuxt/ui';
// @ts-ignore
import {getPaginationRowModel, type Row} from '@tanstack/table-core';
import type {InquirySelect} from '~~/server/database/schema/tables/inquiries';

const UButton = resolveComponent('UButton');
const UDropdownMenu = resolveComponent('UDropdownMenu');
const UCheckbox = resolveComponent('UCheckbox');

const toast = useToast();
const table = useTemplateRef('table');

const showQuotationsInsert = ref(false);
const selectedInquiry = ref<InquirySelect>({} as InquirySelect);

const {data, status} = await useFetch<InquirySelect[]>('/api/inquiries', {
  method: 'get',
  lazy: true,
});

function getRowItems(row: Row<InquirySelect>) {
  return [
    {
      type: 'label',
      label: 'Actions',
    },
    {
      label: 'Copy customer ID',
      icon: 'i-lucide-copy',
      onSelect() {
        navigator.clipboard.writeText(row.original.id.toString());
        toast.add({
          title: 'Copied to clipboard',
          description: 'Customer ID copied to clipboard',
        });
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Provide a quote',
      icon: 'lucide:file-pen',
      onSelect() {
        selectedInquiry.value = row.original;
        showQuotationsInsert.value = true;
      },
    },
    {
      label: 'Delete inquiry',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect() {
        toast.add({
          title: 'Inquiry deleted',
          description: 'The inquiry has been deleted.',
        });
      },
    },
  ];
}

const columns: TableColumn<InquirySelect>[] = [
  {
    id: 'select',
    header: ({table}) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        ariaLabel: 'Select all',
      }),
    cell: ({row}) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          row.toggleSelected(!!value),
        ariaLabel: 'Select row',
      }),
  },
  {
    accessorKey: 'inquiryId',
    header: 'ID',
    cell: ({row}) => `Inquiry #${row.original.id}`,
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
    header: 'Services',
    cell: ({row}) => {
      const UTooltip = resolveComponent('UTooltip');
      const UButton = resolveComponent('UButton');

      const services = row.original.inquiryServices || [];
      if (!services.length) return h('span', {class: 'text-sm'}, '-');
      const first = services[0];
      const rest = services.slice(1);

      const tooltipText = rest
        .map(
          (s) =>
            `${s.name?.toLowerCase() || ''}\n${s.quantity ?? 1}x • ${
              s.date || ''
            }`
        )
        .join('\n\n');

      return h('div', {class: 'flex items-center gap-1'}, [
        first &&
          h('div', {class: 'text-sm leading-tight'}, [
            h('p', {class: 'lowercase'}, first.name || '-'),
            h(
              'p',
              {class: 'text-xs text-gray-500'},
              `${first.quantity ?? 1}x • ${first.date || ''}`
            ),
          ]),
        rest.length &&
          h(UTooltip, {text: tooltipText}, () =>
            h(UButton, {
              icon: 'i-lucide-plus',
              size: '2xs',
              variant: 'ghost',
              color: 'neutral',
              class: 'cursor-default',
            })
          ),
      ]);
    },
  },
  {
    header: 'Products',
    cell: ({row}) => {
      const UTooltip = resolveComponent('UTooltip');
      const UButton = resolveComponent('UButton');

      const products = row.original.inquiryProducts || [];
      if (!products.length) return h('span', {class: 'text-sm'}, '-');
      const first = products[0];
      const rest = products.slice(1);

      const tooltipText = rest
        .map(
          (p) =>
            `${p.name?.toLowerCase() || ''}\n${p.quantity ?? 1}x • ${
              p.date || ''
            }`
        )
        .join('\n\n');

      return h('div', {class: 'flex items-center gap-1'}, [
        first &&
          h('div', {class: 'text-sm leading-tight'}, [
            h('p', {class: 'lowercase'}, first.name || '-'),
            h(
              'p',
              {class: 'text-xs text-gray-500'},
              `${first.quantity ?? 1}x • ${first.date || ''}`
            ),
          ]),
        rest.length &&
          h(UTooltip, {text: tooltipText}, () =>
            h(UButton, {
              icon: 'i-lucide-plus',
              size: '2xs',
              variant: 'ghost',
              color: 'neutral',
              class: 'cursor-default',
            })
          ),
      ]);
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({row}) => {
      const color = {
        new: 'success' as const,
        quoted: 'info' as const,
        rejected: 'error' as const,
      }[row.original.status];
      return h(
        UBadge,
        {class: 'capitalize', variant: 'subtle', color},
        () => row.original.status
      );
    },
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
