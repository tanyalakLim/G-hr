<template>
  <div class="relative">
    <div class="absolute inset-y-0 left-0 flex items-center pointer-events-none text-slate-400" :class="size === 'lg' ? 'pl-3' : 'pl-2.5'">
      <Search class="w-3.5 h-3.5" />
    </div>
    <input
      :id="id"
      v-model="model"
      type="text"
      :placeholder="placeholder"
      class="w-full text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
      :class="size === 'lg' ? 'h-10 pl-9 pr-8' : 'h-9 pl-8 pr-8'"
    />
    <button
      v-if="model"
      type="button"
      class="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
      title="ล้างข้อความ"
      @click="model = ''"
    >
      <X class="w-3.5 h-3.5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Search, X } from 'lucide-vue-next';

withDefaults(
  defineProps<{
    placeholder?: string;
    id?: string;
    size?: 'md' | 'lg';
  }>(),
  {
    placeholder: 'ค้นหา...',
    id: undefined,
    size: 'md',
  }
);

const model = defineModel<string>({ default: '' });
</script>
