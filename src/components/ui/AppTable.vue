<template>
  <div class="app-table-wrapper space-y-3.5" data-purpose="app-standard-table">
    <!-- Top Toolbar (Optional) -->
    <div
      v-if="$slots.toolbar || showToolbar || searchable || showColumnButton"
      class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
    >
      <!-- Left Action (e.g. + เพิ่มรายการใหม่) -->
      <div class="flex items-center gap-2 flex-wrap">
        <slot name="toolbar-left">
          <slot name="toolbar" />
        </slot>
      </div>

      <!-- Right Action (Search & Column options) -->
      <div class="flex items-center gap-2.5 self-end sm:self-auto flex-wrap">
        <slot name="toolbar-right">
          <!-- Search input -->
          <div v-if="searchable" class="relative w-56 sm:w-64">
            <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              :value="searchQuery"
              type="text"
              :placeholder="searchPlaceholder || 'ค้นหา...'"
              class="w-full h-9 pl-9 pr-3 text-xs bg-white border border-slate-200 hover:border-slate-300 rounded-lg focus:border-blue-700 focus:ring-1 focus:ring-blue-700 text-slate-800 placeholder-slate-400 transition-colors"
              @input="onSearchInput"
            />
          </div>

          <!-- Column configuration button -->
          <button
            v-if="showColumnButton"
            type="button"
            class="h-9 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            @click="$emit('column-click')"
          >
            <SlidersHorizontal class="w-3.5 h-3.5 text-slate-500" />
            <span>{{ columnButtonText || 'คอลัมน์' }}</span>
          </button>
        </slot>
      </div>
    </div>

    <!-- Main Table Card Container (Standard Design) -->
    <div
      class="overflow-hidden bg-white"
      :class="[bordered ? 'border border-slate-200 rounded-xl' : '', containerClass]"
    >
      <div class="overflow-x-auto scrollbar-thin">
        <table class="w-full text-xs text-left border-collapse" :class="tableClass">
          <!-- Header slot OR columns prop -->
          <slot name="header">
            <thead v-if="columns && columns.length > 0" :class="headerClass">
              <tr class="border-b border-slate-200/90">
                <th
                  v-for="col in visibleColumns"
                  :key="col.key"
                  scope="col"
                  class="py-3.5 px-4 whitespace-nowrap select-none"
                  :class="[
                    col.align === 'center'
                      ? 'text-center'
                      : col.align === 'right'
                      ? 'text-right'
                      : 'text-left',
                    col.sortable ? 'cursor-pointer hover:text-blue-900 group' : '',
                    col.headerClass || '',
                  ]"
                  :style="col.width ? { width: col.width, minWidth: col.width } : {}"
                  @click="col.sortable ? handleSort(col.key) : null"
                >
                  <div
                    class="inline-flex items-center gap-1.5"
                    :class="[
                      col.align === 'center'
                        ? 'justify-center'
                        : col.align === 'right'
                        ? 'justify-end'
                        : 'justify-start',
                    ]"
                  >
                    <span>{{ col.label }}</span>
                    <span v-if="col.sortable" class="text-slate-400 group-hover:text-blue-900 transition-colors">
                      <ChevronUp
                        v-if="sortKey === col.key && sortOrder === 'asc'"
                        class="w-3.5 h-3.5 text-blue-900"
                      />
                      <ChevronDown
                        v-else-if="sortKey === col.key && sortOrder === 'desc'"
                        class="w-3.5 h-3.5 text-blue-900"
                      />
                      <ChevronsUpDown
                        v-else
                        class="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-900"
                      />
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
          </slot>

          <!-- Body slot OR data prop -->
          <slot>
            <slot name="body">
              <tbody v-if="data && data.length > 0" class="divide-y divide-slate-100" :class="bodyClass">
                <tr
                  v-for="(row, rowIndex) in data"
                  :key="getRowKey(row, rowIndex)"
                  class="hover:bg-slate-50/70 transition-colors"
                  :class="[
                    rowClickable ? 'cursor-pointer' : '',
                    typeof rowClass === 'function' ? rowClass(row, rowIndex) : rowClass,
                  ]"
                  @click="rowClickable ? $emit('row-click', row, rowIndex) : null"
                >
                  <td
                    v-for="col in visibleColumns"
                    :key="col.key"
                    class="py-3.5 px-4"
                    :class="[
                      col.align === 'center'
                        ? 'text-center'
                        : col.align === 'right'
                        ? 'text-right'
                        : 'text-left',
                      col.cellClass || '',
                    ]"
                  >
                    <!-- Custom cell slot: #[col.key] or #cell-{key} -->
                    <slot
                      :name="`cell-${col.key}`"
                      :row="row"
                      :value="row[col.key]"
                      :index="rowIndex"
                    >
                      <slot
                        :name="col.key"
                        :row="row"
                        :value="row[col.key]"
                        :index="rowIndex"
                      >
                        {{ row[col.key] !== undefined && row[col.key] !== null ? row[col.key] : '-' }}
                      </slot>
                    </slot>
                  </td>
                </tr>
              </tbody>

              <!-- Empty state fallback -->
              <tbody v-else>
                <tr>
                  <td
                    :colspan="visibleColumns.length || 1"
                    class="py-12 px-4 text-center text-slate-400 text-xs"
                  >
                    <slot name="empty">
                      <div class="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                        <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                          <Inbox class="w-5 h-5" />
                        </div>
                        <div class="font-medium text-slate-600">
                          {{ emptyText || 'ไม่พบข้อมูล' }}
                        </div>
                        <p v-if="emptyDescription" class="text-slate-400 text-[11px]">
                          {{ emptyDescription }}
                        </p>
                      </div>
                    </slot>
                  </td>
                </tr>
              </tbody>
            </slot>
          </slot>
        </table>
      </div>

      <!-- Pagination / Footer Bar (Standard Design) -->
      <slot name="footer">
        <div
          v-if="pagination && totalItems > 0"
          class="p-3.5 sm:p-4 border-t border-slate-200/90 bg-white"
        >
          <UiPagination
            :current-page="currentPage"
            :page-size="pageSize"
            :total="totalItems"
            :page-size-options="pageSizeOptions"
            @update:current-page="onPageUpdate"
            @update:page-size="onPageSizeUpdate"
          />
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Search,
  SlidersHorizontal,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  Inbox,
} from 'lucide-vue-next';
import UiPagination from './UiPagination.vue';
import type { AppTableColumn } from '../../types';

const props = withDefaults(
  defineProps<{
    columns?: AppTableColumn[];
    data?: any[];
    rowKey?: string | ((row: any, index: number) => string | number);
    rowClickable?: boolean;
    rowClass?: string | ((row: any, index: number) => string);
    // Visual styling
    bordered?: boolean;
    containerClass?: string;
    tableClass?: string;
    headerClass?: string;
    bodyClass?: string;
    // Toolbar
    showToolbar?: boolean;
    searchable?: boolean;
    searchQuery?: string;
    searchPlaceholder?: string;
    showColumnButton?: boolean;
    columnButtonText?: string;
    // Sorting
    sortKey?: string;
    sortOrder?: 'asc' | 'desc' | null;
    // Empty state
    emptyText?: string;
    emptyDescription?: string;
    // Pagination
    pagination?: boolean;
    currentPage?: number;
    pageSize?: number;
    totalItems?: number;
    pageSizeOptions?: number[];
    showPageSize?: boolean;
  }>(),
  {
    columns: () => [],
    data: () => [],
    rowKey: 'id',
    rowClickable: false,
    rowClass: '',
    bordered: true,
    containerClass: '',
    tableClass: '',
    headerClass: 'bg-slate-50/80 border-b border-slate-200/90 text-[12px] font-semibold text-slate-600 tracking-tight select-none',
    bodyClass: 'text-xs text-slate-700',
    showToolbar: false,
    searchable: false,
    searchQuery: '',
    searchPlaceholder: 'ค้นหา...',
    showColumnButton: false,
    columnButtonText: 'คอลัมน์',
    sortKey: '',
    sortOrder: null,
    emptyText: 'ไม่พบข้อมูล',
    emptyDescription: '',
    pagination: false,
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    pageSizeOptions: () => [10, 20, 50, 100],
    showPageSize: true,
  }
);

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void;
  (e: 'update:currentPage', page: number): void;
  (e: 'update:pageSize', size: number): void;
  (e: 'sort', key: string, order: 'asc' | 'desc'): void;
  (e: 'row-click', row: any, index: number): void;
  (e: 'column-click'): void;
}>();

const visibleColumns = computed(() => {
  return props.columns.filter((col) => !col.hidden);
});

const getRowKey = (row: any, index: number) => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row, index);
  }
  return row[props.rowKey] ?? index;
};

const onSearchInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit('update:searchQuery', target.value);
};

const handleSort = (key: string) => {
  let nextOrder: 'asc' | 'desc' = 'asc';
  if (props.sortKey === key && props.sortOrder === 'asc') {
    nextOrder = 'desc';
  }
  emit('sort', key, nextOrder);
};

// Pagination calculations
const totalPages = computed(() => {
  if (!props.pageSize || props.pageSize <= 0) return 1;
  return Math.ceil(props.totalItems / props.pageSize) || 1;
});

const paginationFrom = computed(() => {
  if (props.totalItems === 0) return 0;
  return (props.currentPage - 1) * props.pageSize + 1;
});

const paginationTo = computed(() => {
  return Math.min(props.currentPage * props.pageSize, props.totalItems);
});

const onPageSizeChange = (e: Event) => {
  const target = e.target as HTMLSelectElement;
  const newSize = Number(target.value);
  emit('update:pageSize', newSize);
  emit('update:currentPage', 1);
};

const changePage = (p: number) => {
  if (p < 1 || p > totalPages.value || p === props.currentPage) return;
  emit('update:currentPage', p);
};

const onPageUpdate = (p: number) => emit('update:currentPage', p);

const onPageSizeUpdate = (s: number) => {
  emit('update:pageSize', s);
  emit('update:currentPage', 1);
};

const displayedPages = computed(() => {
  const current = props.currentPage;
  const total = totalPages.value;
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 3) {
    return [1, 2, 3, 4, '...', total];
  }
  if (current >= total - 2) {
    return [1, '...', total - 3, total - 2, total - 1, total];
  }
  return [1, '...', current - 1, current, current + 1, '...', total];
});
</script>
