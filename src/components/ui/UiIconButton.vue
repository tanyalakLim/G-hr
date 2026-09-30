<template>
  <button
    :type="type"
    :title="title"
    :disabled="disabled"
    class="inline-flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
    :class="[toneClasses[tone]]"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    tone?: 'outline' | 'ghost';
    title?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
  }>(),
  {
    tone: 'outline',
    title: undefined,
    type: 'button',
    disabled: false,
  }
);

const toneClasses = computed(() => ({
  outline:
    'p-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-600 hover:bg-white hover:text-blue-900',
  ghost: 'p-2 rounded-lg bg-transparent text-slate-400 hover:text-blue-900 hover:bg-slate-100',
}));
</script>
