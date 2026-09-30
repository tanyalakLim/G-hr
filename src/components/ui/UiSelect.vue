<template>
  <div>
    <label v-if="label" class="block text-[11px] font-medium text-slate-500 mb-1">
      {{ label }}
    </label>
    <div class="relative">
      <select
        :id="id"
        v-model="model"
        class="appearance-none rounded-lg border border-slate-300 bg-white text-slate-700 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
        :class="[sizeClasses[size], fit ? 'w-auto min-w-[60px]' : 'w-full', selectClass, !model && placeholder ? 'text-slate-400 font-normal' : '']"
      >
        <option v-if="placeholder" value="" disabled hidden>{{ placeholder }}</option>
        <option v-for="option in options" :key="String(option.value)" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <svg
        class="pointer-events-none absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
        :style="{ right: arrowSpacing }"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M6 8l4 4 4-4" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

withDefaults(
  defineProps<{
    options: { value: string | number; label: string }[];
    label?: string;
    placeholder?: string;
    id?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    fit?: boolean;
    selectClass?: string;
    arrowSpacing?: string;
  }>(),
  {
    label: undefined,
    placeholder: undefined,
    id: undefined,
    size: 'md',
    fit: false,
    selectClass: '',
    arrowSpacing: '0.625rem',
  }
);

const model = defineModel<string | number>({ default: '' });

const sizeClasses = computed(() => ({
  xs: 'h-6 pl-2 pr-5',
  sm: 'h-8 pl-2.5 pr-6',
  md: 'h-9 pl-2.5 pr-6',
  lg: 'h-10 pl-3 pr-7',
}));
</script>
