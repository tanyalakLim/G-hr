<template>
  <nav class="flex items-center gap-1.5 text-xs flex-wrap">
    <template v-for="(item, index) in items" :key="index">
      <ChevronRight v-if="index > 0" class="w-3 h-3 text-slate-300 flex-shrink-0" />
      <button
        v-if="index < items.length - 1"
        type="button"
        class="text-slate-500 hover:text-blue-900 font-medium transition-colors cursor-pointer"
        @click="emit('select', item)"
      >
        {{ item.label }}
      </button>
      <span v-else class="text-slate-800 font-semibold">{{ item.label }}</span>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next';

withDefaults(
  defineProps<{
    items: { label: string; value?: string }[];
  }>(),
  {
    items: () => [],
  }
);

const emit = defineEmits<{
  (e: 'select', item: { label: string; value?: string }): void;
}>();
</script>
