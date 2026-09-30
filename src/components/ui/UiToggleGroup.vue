<template>
  <div class="inline-flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/80 gap-0.5">
    <button
      v-for="item in items"
      :key="item.value"
      type="button"
      :title="item.title"
      class="rounded-md transition-all inline-flex items-center cursor-pointer"
      :class="[
        model === item.value
          ? 'text-blue-900 bg-white shadow-xs font-medium'
          : 'text-slate-500 hover:text-slate-800 hover:bg-white/60',
        itemClasses[size]
      ]"
      @click="model = item.value"
    >
      <span
        v-if="item.dotTone && model === item.value"
        class="w-1.5 h-1.5 rounded-full flex-shrink-0 mr-1"
        :class="item.dotTone"
      />
      <component :is="item.icon" v-if="item.icon" class="w-4 h-4" />
      <span v-if="item.label && size === 'md'" class="text-xs">{{ item.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';

withDefaults(
  defineProps<{
    items: { value: string; label?: string; title?: string; icon?: Component; dotTone?: string }[];
    size?: 'sm' | 'md';
  }>(),
  {
    size: 'sm',
  }
);

const model = defineModel<string>({ required: true });

const itemClasses = computed(() => ({
  sm: 'p-1.5',
  md: 'px-3 py-1.5 text-xs',
}));
</script>
