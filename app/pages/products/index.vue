<template>
  <UDashboardPanel id="products">
    <template #header>
      <UDashboardNavbar title="Products">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButtonGroup orientation="horizontal">
            <MyCategoryInsert type="product" />
            <MyProductInsert />
          </UButtonGroup>
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
import {MyProductUpdate} from '#components';
import type {TableColumn} from '@nuxt/ui';
// @ts-ignore
import {getPaginationRowModel, type Row} from '@tanstack/table-core';
import {type ItemSelect} from '~~/server/database/schema';

const UButton = resolveComponent('UButton');
const UBadge = resolveComponent('UBadge');
const UDropdownMenu = resolveComponent('UDropdownMenu');

const toast = useToast();
const table = useTemplateRef('table');

const {data, status} = await useFetch<ItemSelect[]>('/api/items', {
  key: 'products',
  method: 'get',
  query: {type: 'product'},
  lazy: true,
});

const getRowItems = (row: Row<ItemSelect>) => {
  return [
    {
      type: 'label',
      label: 'Actions',
    },
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
          await $fetch(`/api/items`, {
            method: 'DELETE',
            body: {id: row.original.id},
          });

          data.value = data.value?.filter(
            (item) => item.id !== row.original.id
          );

          toast.add({
            title: 'Product deleted',
            description: 'The product has been deleted.',
            color: 'success',
          });
        } catch (error) {
          toast.add({
            title: 'Error',
            description: 'Failed to delete the product.',
            color: 'error',
          });
        }
      },
    },
  ];
};

const columns: TableColumn<ItemSelect>[] = [
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
    accessorKey: 'category',
    header: 'Category',
    cell: ({row}) => row.original.category.name,
  },
  {
    accessorKey: 'productDetail.supplier.name',
    header: 'Supplier',
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
