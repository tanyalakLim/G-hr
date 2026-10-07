<template>
  <div class="p-4 sm:p-6 flex-1 space-y-4">
    <!-- หมวดหมู่เอกสาร + ปุ่มดาวน์โหลด -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <UiToggleGroup v-model="docCategory" :items="categoryItems" size="md" />
      <div class="flex items-center gap-2">
        <UiButton id="btn-download-pdf" variant="outline" size="sm" class="font-semibold shadow-2xs" @click="download('pdf')">
          <template #icon>
            <FileDown class="w-3.5 h-3.5 text-slate-500" />
          </template>
          ดาวน์โหลดไฟล์ PDF
        </UiButton>
        <UiButton id="btn-download-docx" variant="outline" size="sm" class="font-semibold shadow-2xs" @click="download('docx')">
          <template #icon>
            <FileDown class="w-3.5 h-3.5 text-slate-500" />
          </template>
          ดาวน์โหลดไฟล์ DOCX
        </UiButton>
      </div>
    </div>

    <!-- Document Viewer -->
    <div class="border border-slate-200 rounded-xl bg-slate-100/70 overflow-hidden flex flex-col">
      <!-- แถบนำทางหน้าเอกสาร -->
      <div class="px-4 py-2.5 border-b border-slate-200 bg-white flex items-center justify-between">
        <button
          type="button"
          class="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="หน้าก่อนหน้า"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <ChevronLeft class="w-3.5 h-3.5" />
        </button>
        <span class="text-xs font-medium text-slate-600">
          หน้าที่ {{ currentPage }} จาก {{ totalPages }}
        </span>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="หน้าถัดไป"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            <ChevronRight class="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            class="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg bg-white text-slate-500 hover:text-blue-900 hover:bg-slate-50 cursor-pointer transition-colors"
            title="ขยายเอกสารเต็มหน้าจอ"
            @click="isExpandModalOpen = true"
          >
            <Maximize2 class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- พื้นที่แสดงตัวอย่างเอกสาร -->
      <div class="p-4 sm:p-8 flex justify-center overflow-auto max-h-[70vh]">
        <OrderDocumentPage :category="docCategory" class="max-w-[640px]" />
      </div>
    </div>

    <!-- Modal ขยายเอกสารเต็มหน้าจอ -->
    <UiModal
      :is-open="isExpandModalOpen"
      max-width="max-w-[95vw]"
      @close="isExpandModalOpen = false"
    >
      <template #header>
        <div class="flex items-center justify-between flex-1 min-w-0 gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <Maximize2 class="w-4 h-4 text-blue-900 flex-shrink-0" />
            <h3 class="font-bold text-sm text-slate-900">
              พรีวิว{{ docCategory === 'order' ? 'คำสั่ง' : 'เอกสารแนบท้าย' }}
            </h3>
          </div>
        </div>
      </template>

      <div class="p-4 sm:p-6 bg-slate-100/70 rounded-xl flex justify-center overflow-auto max-h-[75vh]">
        <OrderDocumentPage :category="docCategory" class="max-w-[640px]" />
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ChevronLeft, ChevronRight, FileDown, Maximize2 } from 'lucide-vue-next';
import { UiButton, UiModal, UiToggleGroup } from '../ui';
import OrderDocumentPage from './OrderDocumentPage.vue';
import { useToast } from '../../composables/useToast';

const { show } = useToast();

// --- Modal ขยายเอกสาร
const isExpandModalOpen = ref(false);

// --- หมวดหมู่เอกสาร
const docCategory = ref('order');
const categoryItems = [
  { value: 'order', label: 'คำสั่ง' },
  { value: 'attachment', label: 'เอกสารแนบท้าย' },
];

// --- การนำทางหน้าเอกสาร
const currentPage = ref(1);
const totalPages = ref(1);

// --- ดาวน์โหลด
const download = (format: 'pdf' | 'docx') => {
  const label = format === 'pdf' ? 'PDF' : 'DOCX';
  show(`กำลังดาวน์โหลดเอกสารคำสั่งรูปแบบ ${label}...`);
};
</script>
