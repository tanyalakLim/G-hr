<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 pt-1">
    <span>{{ rangeText }}</span>

    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2">
        <span>แสดงต่อหน้า:</span>
        <select
          :value="pageSize"
          class="h-8 px-2.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 font-medium focus:outline-none focus:border-blue-600 cursor-pointer"
          @change="onPageSizeChange"
        >
          <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>

      <div class="flex items-center gap-1">
        <button
          type="button"
          :disabled="currentPage === 1"
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          title="หน้าแรก"
          @click="go(1)"
        >
          <ChevronsLeft class="w-4 h-4" />
        </button>

        <button
          type="button"
          :disabled="currentPage === 1"
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          title="หน้าก่อนหน้า"
          @click="go(currentPage - 1)"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>

        <template v-for="(page, index) in pageButtons" :key="page">
          <span v-if="index > 0 && page - pageButtons[index - 1] > 1" class="px-0.5 text-slate-400">…</span>
          <button
            type="button"
            class="w-8 h-8 flex items-center justify-center rounded-lg font-semibold cursor-pointer transition-colors"
            :class="currentPage === page
              ? 'bg-blue-900 text-white'
              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'"
            @click="go(page)"
          >
            {{ page }}
          </button>
        </template>

        <button
          type="button"
          :disabled="currentPage === totalPages"
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          title="หน้าถัดไป"
          @click="go(currentPage + 1)"
        >
          <ChevronRight class="w-4 h-4" />
        </button>

        <button
          type="button"
          :disabled="currentPage === totalPages"
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          title="หน้าสุดท้าย"
          @click="go(totalPages)"
        >
          <ChevronsRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-vue-next';

const props = withDefaults(
  defineProps<{
    total: number;
    pageSize: number;
    currentPage: number;
    pageSizeOptions?: number[];
  }>(),
  {
    pageSizeOptions: () => [10, 20, 50],
  }
);

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void;
  (e: 'update:pageSize', size: number): void;
}>();

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)));

const rangeText = computed(() => {
  if (!props.total) return 'แสดง 0 รายการ';
  const start = (props.currentPage - 1) * props.pageSize + 1;
  const end = Math.min(props.currentPage * props.pageSize, props.total);
  return `แสดง ${start} - ${end} จากทั้งหมด ${props.total} รายการ`;
});

const pageButtons = computed(() => {
  const total = totalPages.value;
  const cur = props.currentPage;
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  return [...new Set([1, total, cur - 1, cur, cur + 1])]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
});

const go = (page: number) => {
  const target = Math.min(Math.max(1, page), totalPages.value);
  if (target !== props.currentPage) {
    emit('update:currentPage', target);
  }
};

const onPageSizeChange = (event: Event) => {
  const size = Number((event.target as HTMLSelectElement).value);
  if (size !== props.pageSize) {
    emit('update:pageSize', size);
  }
};
</script>
