<template>
  <UDashboardPanel id="suppliers">
    <template #header>
      <UDashboardNavbar title="Suppliers">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <MySupplierInsert />
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
import {MySupplierUpdate} from '#components';
import type {TableColumn} from '@nuxt/ui';
// @ts-ignore
import {getPaginationRowModel, type Row} from '@tanstack/table-core';
import {type SupplierSelect} from '~~/server/database/schema';

const UButton = resolveComponent('UButton');
const UDropdownMenu = resolveComponent('UDropdownMenu');

const toast = useToast();
const table = useTemplateRef('table');

const {data, status} = await useFetch<SupplierSelect[]>('/api/suppliers', {
  key: 'suppliers',
  method: 'get',
  lazy: true,
});

const getRowSuppliers = (row: Row<SupplierSelect>) => {
  return [
    {
      type: 'label',
      label: 'Actions',
    },
    {
      label: 'Update supplier',
      icon: 'lucide:file-pen',
      onSelect() {
        const overlay = useOverlay();

        overlay.create(MySupplierUpdate, {
          props: {
            supplier: row.original,
          },
          defaultOpen: true,
        });
      },
    },
    {
      label: 'Delete supplier',
      icon: 'i-lucide-trash',
      color: 'error',
      async onSelect() {
        try {
          await $fetch(`/api/suppliers`, {
            method: 'DELETE',
            body: {id: row.original.id},
          });

          data.value = data.value?.filter(
            (item) => item.id !== row.original.id
          );

          toast.add({
            title: 'Supplier deleted',
            description: 'The supplier has been deleted.',
            color: 'success',
          });
        } catch (error) {
          toast.add({
            title: 'Error',
            description: 'Failed to delete the supplier.',
            color: 'error',
          });
        }
      },
    },
  ];
};

const columns: TableColumn<SupplierSelect>[] = [
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
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
    cell: ({row}) =>
      h('div', {class: 'flex items-center gap-2'}, [
        h('i', {class: 'i-lucide-phone'}), // Use your preferred icon class
        row.original.phoneNumber,
      ]),
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
            items: getRowSuppliers(row),
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
