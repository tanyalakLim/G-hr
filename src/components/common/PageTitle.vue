<template>
  <div>
    <div class="flex items-center gap-2.5">
      <h1 class="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
        {{ title }}
      </h1>
      <slot name="badge" />
    </div>
    <p v-if="subtitle" class="text-xs text-slate-500 mt-0.5">
      {{ subtitle }}
    </p>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>
