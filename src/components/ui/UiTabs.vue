<template>
  <div class="border-b border-slate-200">
    <nav class="flex gap-1 -mb-px overflow-x-auto">
      <button
        v-for="item in items"
        :key="item.value"
        type="button"
        class="px-3.5 py-2 text-xs font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5"
        :class="
          model === item.value
            ? 'border-blue-900 text-blue-900'
            : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
        "
        @click="model = item.value"
      >
        <component :is="item.icon" v-if="item.icon" class="w-3.5 h-3.5" />
        <span>{{ item.label }}</span>
        <span
          v-if="item.count !== undefined"
          class="px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
          :class="model === item.value ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'"
        >
          {{ item.count }}
        </span>
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  items: { value: string; label: string; icon?: Component; count?: number }[];
}>();

const model = defineModel<string>({ required: true });
</script>
