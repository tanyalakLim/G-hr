<template>
  <nav
    class="w-full lg:w-fit bg-white border-b lg:border-b-0 lg:border-r border-slate-200 p-3 sm:p-4 space-y-1"
  >
    <button
      v-for="item in items"
      :key="item.id"
      type="button"
      class="w-48 max-w-full h-11 px-3.5 overflow-hidden rounded-xl flex items-center justify-between text-xs transition-all cursor-pointer select-none"
      :class="
        modelValue === item.id
          ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200/60 shadow-2xs'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium border border-transparent'
      "
      @click="$emit('update:modelValue', item.id)"
    >
      <div class="flex items-center gap-2.5 min-w-0 flex-1">
        <component
          :is="item.icon"
          class="w-4 h-4 shrink-0"
          :class="modelValue === item.id ? 'text-blue-900' : 'text-slate-400'"
        />
        <span class="whitespace-nowrap overflow-hidden text-ellipsis text-left min-w-0">{{ item.label }}</span>
      </div>

      <div v-if="modelValue === item.id" class="w-2 h-2 rounded-full bg-blue-900" />
      <ChevronRight v-else class="w-3.5 h-3.5 text-slate-300" />
    </button>
  </nav>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next';
import type { Component } from 'vue';

export interface UiSideNavItem {
  id: string;
  label: string;
  icon?: Component;
}

defineProps<{
  items: UiSideNavItem[];
  modelValue: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>
