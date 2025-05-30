<template>
  <UDashboardPanel id="clients">
    <template #header>
      <UDashboardNavbar title="Clients">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <MyClientInsert />
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
        class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto">
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
import type {NuxtError} from '#app';
import {MyClientUpdate} from '#components';
import type {TableColumn} from '@nuxt/ui';
import {getPaginationRowModel, type Row} from '@tanstack/table-core';
import type {z} from 'zod';
import type {clientSelectSchema} from '~~/server/database/schema';

const UButton = resolveComponent('UButton');
const UDropdownMenu = resolveComponent('UDropdownMenu');

const toast = useToast();
const table = useTemplateRef('table');

type Client = z.infer<typeof clientSelectSchema>;

const {data, status, refresh} = await useFetch<Client[]>('/api/clients', {
  key: 'clients',
  method: 'get',
  lazy: true,
});

function getRowItems(row: Row<Client>) {
  return [
    {
      type: 'label',
      label: 'Actions',
    },
    {
      label: 'Update client',
      icon: 'lucide:file-pen',
      onSelect() {
        const overlay = useOverlay();

        overlay.create(MyClientUpdate, {
          props: {
            client: row.original,
          },
          defaultOpen: true,
        });
      },
    },
    {
      label: 'Delete client',
      icon: 'i-lucide-trash',
      color: 'error',
      async onSelect() {
        try {
          await $fetch(`/api/clients/${row.original.id}`, {
            method: 'DELETE',
          });
          toast.add({
            title: 'Client deleted',
            description: 'The client has been deleted.',
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
}

const columns: TableColumn<Client>[] = [
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
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'email',
    header: ({column}) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Email',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5 font-semibold text-gray-900', // Add font-semibold for weight 600
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      });
    },
    cell: ({row}) => row.original.email,
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
  },
  {
    accessorKey: 'company',
    header: 'Company',
    cell: ({row}) => row.original.company ?? '—',
  },
  {
    accessorKey: 'companyNumber',
    header: 'Company Number',
    cell: ({row}) => row.original.companyNumber ?? '—',
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
