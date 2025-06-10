<template>
  <UDashboardPanel id="products">
    <template #header>
      <UDashboardNavbar title="Products">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <MyCategoryInsert />
          <MyProductInsert />
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
        }" />

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
import {MyOrderInsert, MyProductUpdate} from '#components';
import type {TableColumn} from '@nuxt/ui';
import {getPaginationRowModel, type Row} from '@tanstack/table-core';
import {type ProductSelect} from '~~/server/database/schema';

const UButton = resolveComponent('UButton');
const UBadge = resolveComponent('UBadge');
const UDropdownMenu = resolveComponent('UDropdownMenu');

const toast = useToast();
const table = useTemplateRef('table');

const {data, status, refresh} = await useFetch<ProductSelect[]>(
  '/api/products',
  {
    key: 'products',
    method: 'get',
    lazy: true,
  }
);

const getRowItems = (row: Row<ProductSelect>) => {
  return [
    {
      type: 'label',
      label: 'Actions',
    },
    {
      label: 'Make an order',
      icon: 'lucide:ship',
      onSelect() {
        const overlay = useOverlay();

        overlay.create(MyOrderInsert, {
          props: {
            product: row.original,
          },
          defaultOpen: true,
        });
      },
    },
    {type: 'separator'},
    {
      label: 'Update product',
      icon: 'lucide:file-pen',
      onSelect() {
        const overlay = useOverlay();

        overlay.create(MyProductUpdate, {
          props: {
            product: row.original,
          },
          defaultOpen: true,
        });
      },
    },
    {
      label: 'Delete product',
      icon: 'i-lucide-trash',
      color: 'error',
      async onSelect() {
        try {
          await $fetch(`/api/products/${row.original.id}`, {
            method: 'DELETE',
          });
          toast.add({
            title: 'Supplier deleted',
            description: 'The product has been deleted.',
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

const columns: TableColumn<ProductSelect>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({row}) => {
      const id = row.original.id;
      return h('div', {class: 'flex items-center gap-2'}, [
        h(UButton, {
          icon: 'i-lucide-copy',
          color: 'neutral',
          variant: 'ghost',
          label: id,
          size: 'xs',
          'aria-label': 'Copy case code',
          onClick: () => {
            navigator.clipboard.writeText(id.toString());
            toast.add({
              title: 'Product ID copied to clipboard!',
              color: 'success',
              icon: 'i-lucide-circle-check',
            });
          },
        }),
      ]);
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({row}) => row.original.category.name,
  },
  {
    accessorKey: 'supplier.name',
    header: 'Supplier',
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
  },
  {
    accessorKey: 'reserved',
    header: 'Reserved',
  },
  {
    accessorKey: 'isPublic',
    header: 'Public',
    cell: ({row}) => {
      const isPublic = row.original.isPublic;
      return h(
        UBadge,
        {
          icon: isPublic ? 'i-lucide-arrow-right' : 'i-lucide-x',
          color: isPublic ? 'success' : 'error',
          variant: 'subtle',
          class: 'capitalize',
        },
        () => (isPublic ? 'Yes' : 'No')
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
