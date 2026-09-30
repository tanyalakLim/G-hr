<template>
  <span
    class="inline-flex items-center border"
    :class="[shapeClasses[shape], sizeClasses[size], toneClasses[tone], mono ? 'font-mono' : '']"
  >
    <span v-if="dot" class="w-1.5 h-1.5 rounded-full flex-shrink-0" :class="dotClasses[tone]" />
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    tone?: 'slate' | 'blue' | 'emerald' | 'amber' | 'red' | 'teal' | 'outline';
    size?: 'xs' | 'sm';
    shape?: 'pill' | 'chip';
    dot?: boolean;
    mono?: boolean;
  }>(),
  {
    tone: 'slate',
    size: 'xs',
    shape: 'pill',
    dot: false,
    mono: false,
  }
);

const shapeClasses = computed(() => ({
  pill: 'rounded-full',
  chip: 'rounded-md',
}));

const sizeClasses = computed(() => ({
  xs: 'px-2 py-0.5 text-[11px] font-medium gap-1.5',
  sm: 'px-2.5 py-1 text-xs font-semibold gap-2',
}));

const toneClasses = computed(() => ({
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  teal: 'bg-teal-50 text-teal-600 border-teal-200',
  outline: 'bg-slate-50 text-slate-800 border-slate-300',
}));

const dotClasses = computed(() => ({
  slate: 'bg-slate-400',
  blue: 'bg-blue-600',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  teal: 'bg-teal-500',
  outline: 'bg-slate-400',
}));
</script>
