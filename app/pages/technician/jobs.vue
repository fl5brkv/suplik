<template>
  <UDashboardPanel id="jobs">
    <template #header>
      <UDashboardNavbar title="Jobs">
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
        :pagination-options="{getPaginationRowModel: getPaginationRowModel()}"
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
        <template #expanded="{row}">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <UCard
              v-for="(jobService, index) in row.original.jobServices"
              :key="index"
              class="h-full">
              <template #header>
                <div class="flex items-center justify-between gap-4">
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="font-semibold text-default truncate"
                      >Service:</span
                    >
                    <span class="truncate">
                      {{ jobService.service.name }} (x{{ jobService.quantity }})
                    </span>
                    <UBadge variant="subtle" class="ml-2 shrink-0 capitalize">
                      {{ jobService.status }}
                    </UBadge>
                  </div>
                </div>
              </template>

              <div
                v-if="jobService.jobProducts && jobService.jobProducts.length">
                <div class="mt-4 font-medium">Products:</div>
                <ul class="list-disc list-inside">
                  <li v-for="(jp, j) in jobService.jobProducts" :key="j">
                    {{ jp.product.name }}
                    <UBadge color="primary" variant="subtle"
                      >x{{ jp.quantity }}</UBadge
                    >
                  </li>
                </ul>
              </div>
            </UCard>
          </div>
        </template>
      </UTable>

      <div
        class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto">
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
import {getPaginationRowModel, type Row} from '@tanstack/table-core';
import {type JobSelect} from '~~/server/database/schema';

definePageMeta({
  layout: 'technician',
});

const UButton = resolveComponent('UButton');
const UBadge = resolveComponent('UBadge');
const UDropdownMenu = resolveComponent('UDropdownMenu');
const UTooltip = resolveComponent('UTooltip');

const toast = useToast();
const table = useTemplateRef('table');

const {data, status} = await useFetch<JobSelect[]>('/api/jobs', {
  method: 'get',
  lazy: true,
});

const columns: TableColumn<JobSelect>[] = [
  {
    id: 'expand',
    meta: {
      class: {
        td: 'w-1 p-0',
      },
    },
    cell: ({row}) =>
      h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        icon: 'i-lucide-chevron-down',
        square: true,
        size: 'xs',
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
    header: 'Services',
    cell: ({row}) => {
      const services = row.original.jobServices ?? [];
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

const getRowItems = (row: Row<JobSelect>): DropdownMenuItem[] => {
  return [
    {
      label: 'Call client',
      icon: 'i-lucide-phone',
      onSelect: () => {
        window.location.href = `tel:${row.original.case.client.phoneNumber}`;
      },
    },
    {
      label: 'Send SMS',
      icon: 'i-lucide-message-square',
      onSelect: () => {
        const message =
          "Hello, I'm expected to arrive in approximately 5 minutes.";
        window.location.href = `sms:${
          row.original.case.client.phoneNumber
        }?body=${encodeURIComponent(message)}`;
      },
    },
    {
      label: 'Navigate (soon)',
      icon: 'i-lucide-navigation',
      // onSelect: () => navigate(jobService),
    },
  ];
};

const globalFilter = ref('');

const pagination = ref({
  pageIndex: 0,
  pageSize: 10,
});
</script>
