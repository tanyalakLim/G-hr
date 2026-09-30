<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    :class="[variantClasses[variant], sizeClasses[size]]"
  >
    <slot name="icon" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'success' | 'accent' | 'outline' | 'ghost';
    size?: 'xs' | 'sm' | 'md';
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
  }>(),
  {
    variant: 'primary',
    size: 'sm',
    type: 'button',
    disabled: false,
  }
);

const variantClasses = computed(() => ({
  primary: 'text-white bg-blue-900 hover:bg-blue-800 shadow-xs',
  success: 'text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs',
  accent: 'text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 shadow-sm',
  outline:
    'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-blue-700 shadow-xs',
  ghost: 'text-slate-600 bg-transparent hover:bg-slate-100 hover:text-slate-900',
}));

const sizeClasses = computed(() => ({
  xs: 'px-3 py-1.5 text-xs',
  sm: 'px-3.5 py-2 text-xs',
  md: 'px-4 py-2 text-sm',
}));
</script>
