<template>
  <div class="bg-white/90 backdrop-blur border-b border-slate-200/80 sticky top-0 z-20">
    <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-20 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <!-- ซ้าย: ปุ่มย้อนกลับ + ชื่อหน้า -->
      <div class="flex items-center gap-3 min-w-0">
        <button
          v-if="backLabel"
          type="button"
          class="inline-flex items-center gap-1.5 pl-2.5 pr-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-500 hover:text-blue-900 hover:bg-blue-50 transition-colors cursor-pointer shrink-0"
          :title="backTitle"
          @click="$emit('back')"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          {{ backLabel }}
        </button>

        <div v-if="backLabel && (badge || subtitle || $slots.default)" class="h-4 w-px bg-slate-200 hidden sm:block" />

        <div class="min-w-0 leading-tight">
          <p v-if="badge" class="text-sm font-bold text-slate-900 truncate">{{ badge }}</p>
          <p v-if="subtitle" class="text-[11px] text-slate-500 truncate">{{ subtitle }}</p>
        </div>

        <slot />
      </div>

      <!-- ขวา: action buttons -->
      <div class="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';

withDefaults(
  defineProps<{
    /** ข้อความปุ่มย้อนกลับ — ไม่ส่ง = ไม่แสดงปุ่ม */
    backLabel?: string;
    /** title ของปุ่มย้อนกลับ */
    backTitle?: string;
    /** ชื่อหน้า */
    badge?: string;
    /** คำอธิบายรองใต้ชื่อหน้า */
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
