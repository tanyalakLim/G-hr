<template>
  <label class="inline-flex items-center gap-1.5 text-xs text-slate-600 select-none cursor-pointer">
    <input
      v-model="model"
      type="checkbox"
      class="rounded border-slate-300 text-blue-700 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
    />
    <slot />
  </label>
</template>

<script setup lang="ts">
const model = defineModel<boolean>({ default: false });
</script>
