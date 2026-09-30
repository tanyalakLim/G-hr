<template>
  <!-- Top Action / Navigation Bar (Full Width & Flush with Top) -->
  <div class="w-full bg-white border-b border-slate-200 sticky top-0 z-20 shadow-2xs">
    <div class="w-full px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <!-- Left side: Back button + badge + subtitle -->
      <div class="flex flex-wrap items-center gap-3 text-xs">
        <UiButton
          v-if="backLabel"
          variant="outline"
          size="xs"
          class="font-semibold shadow-2xs"
          :title="backTitle"
          @click="$emit('back')"
        >
          <template #icon>
            <ArrowLeft class="w-3.5 h-3.5" />
          </template>
          {{ backLabel }}
        </UiButton>

        <div v-if="backLabel && ($slots['left-extra'] || badge)" class="h-4 w-px bg-slate-200 hidden sm:block" />

        <slot name="left-extra" />

        <div v-if="badge || subtitle" class="flex items-center gap-2">
          <span
            v-if="badge"
            class="px-2 py-0.5 text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-200 rounded-md"
          >
            {{ badge }}
          </span>
          <span v-if="subtitle" class="text-slate-500 font-medium text-[11px] sm:text-xs">
            {{ subtitle }}
          </span>
        </div>
      </div>

      <!-- Right side: action buttons (slot) -->
      <div class="flex items-center gap-2 self-end sm:self-auto">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import { UiButton } from './index';

withDefaults(
  defineProps<{
    /** ข้อความปุ่มย้อนกลับ — ไม่ส่ง = ไม่แสดงปุ่ม */
    backLabel?: string;
    /** คำอธิบายของปุ่มย้อนกลับ (title) */
    backTitle?: string;
    /** ป้ายชิปน้ำเงินด้านขวาของปุ่มย้อนกลับ เช่น ชื่อหมวด/บุคคล */
    badge?: string;
    /** ข้อความรองถัดจากป้าย เช่น เลขที่ประจำตัว */
    subtitle?: string;
  }>(),
  {
    backLabel: '',
    backTitle: undefined,
    badge: '',
    subtitle: '',
  }
);

defineEmits<{
  (e: 'back'): void;
}>();
</script>
