<template>
  <div class="bg-white rounded-xl border border-slate-200/90 shadow-sm" :class="paddingClasses[padding]">
    <div
      v-if="$slots.header"
      class="px-4 py-3 border-b border-slate-200/90 "
    >
      <slot name="header" />
    </div>

    <slot />

    <div v-if="$slots.footer" class="px-4 py-3.5 border-t border-slate-200/90">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    padding?: 'none' | 'sm' | 'md';
  }>(),
  {
    padding: 'none',
  }
);

const paddingClasses = computed(() => ({
  none: '',
  sm: 'p-3',
  md: 'p-4 sm:p-5',
}));
</script>
