<template>
  <div>
    <label v-if="label" class="block text-[11px] font-medium text-slate-500 mb-1" :for="id">
      {{ label }}
    </label>
    <input
      :id="id"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      class="w-full text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
      :class="[sizeClasses[size], inputClass]"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

withDefaults(
  defineProps<{
    label?: string;
    type?: string;
    placeholder?: string;
    id?: string;
    size?: 'md' | 'lg';
    disabled?: boolean;
    inputClass?: string;
  }>(),
  {
    label: undefined,
    type: 'text',
    placeholder: undefined,
    id: undefined,
    size: 'md',
    disabled: false,
    inputClass: '',
  }
);

const model = defineModel<string>({ default: '' });

const sizeClasses = computed(() => ({
  md: 'h-9 px-2.5',
  lg: 'h-10 px-3',
}));
</script>
