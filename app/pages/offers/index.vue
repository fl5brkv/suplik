<template>
  <UDashboardPanel id="offers">
    <template #header>
      <UDashboardNavbar title="Offers">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <!-- <MyOfferInsert /> -->
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
import {type OfferSelect} from '~~/server/database/schema';

const UButton = resolveComponent('UButton');
const UBadge = resolveComponent('UBadge');
const UDropdownMenu = resolveComponent('UDropdownMenu');

const toast = useToast();
const table = useTemplateRef('table');

const {data, status} = await useFetch<OfferSelect[]>('/api/offers', {
  method: 'get',
  lazy: true,
});

const getRowItems = (row: Row<OfferSelect>): DropdownMenuItem[] => {
  const items: DropdownMenuItem[] = [
    {
      type: 'label',
      label: 'Actions',
    },
  ];

  if (row.original.status === 'accepted') {
    items.push({
      label: 'Provide an offer',
      icon: 'lucide:file-pen',
      onSelect() {
        const overlay = useOverlay();
        // overlay.create(MyJobInsert, {
        //   props: {
        //     offer: row.original,
        //   },
        //   defaultOpen: true,
        // });
      },
    });
  }

  items.push({
    label: 'Delete offer',
    icon: 'i-lucide-trash',
    color: 'error',
    onSelect() {
      toast.add({
        title: 'Offer deleted',
        description: 'The offer has been deleted.',
      });
    },
  });

  return items;
};

const columns: TableColumn<OfferSelect>[] = [
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
    header: 'Products',
    cell: ({row}) => {
      const offerServices = row.original.offerServices ?? [];

      const products = offerServices
        .flatMap((service) => service.offerProducts ?? [])
        .map((p) => p.product?.name)
        .filter(Boolean);

      if (products.length === 0) return '—';

      const first = products[0] ?? '';
      const second = products[1]?.slice(0, 5) ?? '';
      const preview = second ? `${first}, ${second}...` : first;

      return h(
        'span',
        {
          title: products.join(', '),
        },
        preview
      );
    },
  },
  {
    header: 'Services',
    cell: ({row}) => {
      const offerServices = row.original.offerServices ?? [];

      const services = offerServices
        .map((s) => s.service?.name)
        .filter(Boolean);

      if (services.length === 0) return '—';

      const first = services[0] ?? '';
      const second = services[1]?.slice(0, 5) ?? '';
      const preview = second ? `${first}, ${second}...` : first;

      return h(
        'span',
        {
          title: services.join(', '),
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
    cell: ({row}) => row.getValue('additionalInfo') || '—',
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
