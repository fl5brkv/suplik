<template>
  <UDashboardPanel id="jobs">
    <template #header>
      <UDashboardNavbar title="Jobs">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <!-- <MyJobInsert /> -->
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
                <div class="flex items-center gap-2">
                  <span class="font-semibold">Service:</span>
                  <span>{{ jobService.service.name }}</span>
                  <UBadge color="primary" variant="subtle">
                    x{{ jobService.quantity }}
                  </UBadge>
                  {{ jobService.status }}
                </div>
              </template>
              <div>
                <div class="font-medium">Technician:</div>

                <UUser
                  :name="`${jobService.technician.firstName} ${jobService.technician.lastName}`" />
              </div>

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

const getRowItems = (row: Row<JobSelect>): DropdownMenuItem[] => {
  const items: DropdownMenuItem[] = [
    {
      type: 'label',
      label: 'Actions',
    },
  ];

  // if (row.original.status === 'accepted') {
  //   items.push({
  //     label: 'Provide an job',
  //     icon: 'lucide:file-pen',
  //     onSelect() {
  //       const overlay = useOverlay();
  //       // overlay.create(MyJobInsert, {
  //       //   props: {
  //       //     job: row.original,
  //       //   },
  //       //   defaultOpen: true,
  //       // });
  //     },
  //   });
  // }

  items.push({
    label: 'Delete job',
    icon: 'i-lucide-trash',
    color: 'error',
    onSelect() {
      toast.add({
        title: 'Job deleted',
        description: 'The job has been deleted.',
      });
    },
  });

  return items;
};

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
    accessorKey: 'technician',
    header: 'Technician',
    cell: ({row}) => {
      const jobServices = row.original.jobServices || [];
      const technicians = jobServices
        .map((js) => js.technician)
        .filter(Boolean)
        .map((t) => `${t.firstName} ${t.lastName}`);

      if (technicians.length === 0) {
        return '';
      }

      // Show first two, then "..." if more
      const displayNames = technicians.slice(0, 2).join(', ');
      const hasMore = technicians.length > 2;

      if (!hasMore) {
        return h('span', {class: 'font-semibold text-gray-800'}, displayNames);
      }

      // Tooltip with all names
      return h(
        UTooltip,
        {text: technicians.join(', ')},
        {
          default: () =>
            h(
              'span',
              {class: 'font-semibold text-gray-800 cursor-pointer'},
              `${displayNames}, ...`
            ),
        }
      );
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
</script>
