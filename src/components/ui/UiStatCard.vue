<template>
  <!-- แนวตั้ง: stat tile — หัวข้อเล็ก, ตัวเลขใหญ่สี tone, ไอคอนชิปสี tone มุมขวาบน -->
  <div
    v-if="layout === 'vertical'"
    class="rounded-xl border border-slate-200/90 bg-white p-4 flex flex-col gap-2 transition-colors hover:border-slate-300"
  >
    <div class="flex items-start justify-between gap-2">
      <div class="text-[11px] font-semibold text-slate-500 leading-snug min-w-0 truncate pt-2">{{ title }}</div>
      <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" :class="toneClasses[tone]">
        <component :is="icon" class="w-4 h-4" />
      </div>
    </div>
    <div class="flex items-baseline gap-1.5">
      <span class="text-2xl font-bold leading-none">{{ value }}</span>
      <span v-if="unit" class="text-[10px] text-slate-400">{{ unit }}</span>
    </div>
    <div v-if="$slots.hint || hint" class="text-[11px] truncate" :class="hintAccent ? 'text-emerald-600 font-semibold' : 'text-slate-400'">
      <slot name="hint">{{ hint }}</slot>
    </div>
  </div>

  <!-- แนวนอน (ค่าเริ่มต้น): ไอคอน+หัวข้อซ้าย ค่าตัวเลขขวา -->
  <div v-else class="rounded-xl border border-slate-200/90 bg-white p-4 flex items-center justify-between gap-3">
    <div class="flex items-center gap-3 min-w-0">
      <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" :class="toneClasses[tone]">
        <component :is="icon" class="w-5 h-5" />
      </div>
      <div class="min-w-0">
        <div class="text-xs font-bold text-slate-800 leading-snug">{{ title }}</div>
        <div class="text-[11px] mt-0.5" :class="hintAccent ? 'text-emerald-600 font-semibold' : 'text-slate-400'">
          <slot name="hint">{{ hint }}</slot>
        </div>
      </div>
    </div>
    <div class="text-right flex-shrink-0">
      <div class="text-2xl font-bold text-slate-900 leading-none">{{ value }}</div>
      <div v-if="unit" class="text-[10px] text-slate-400 mt-1">{{ unit }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';

withDefaults(
  defineProps<{
    title: string;
    hint?: string;
    hintAccent?: boolean;
    value: number | string;
    unit?: string;
    tone?: 'blue' | 'emerald' | 'teal' | 'amber';
    icon: Component;
    /** แนวนอน (ค่าเริ่มต้น) หรือแนวตั้งสำหรับพื้นที่แคบหลายการ์ด */
    layout?: 'horizontal' | 'vertical';
  }>(),
  {
    hint: '',
    hintAccent: false,
    unit: '',
    tone: 'blue',
    layout: 'horizontal',
  }
);

const toneClasses = computed(() => ({
  blue: 'bg-blue-50 text-blue-700',
  emerald: 'bg-emerald-50 text-emerald-600',
  teal: 'bg-teal-50 text-teal-600',
  amber: 'bg-amber-50 text-amber-600',
}));

// สีตัวเลข/ไอคอนตาม tone (โหมด vertical)
const toneTextClasses: Record<string, string> = {
  blue: 'text-blue-700',
  emerald: 'text-emerald-600',
  teal: 'text-teal-600',
  amber: 'text-amber-600',
};
</script>
