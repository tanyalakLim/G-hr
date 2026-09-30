<template>
  <div class="py-10 text-center text-xs text-slate-400">
    <component :is="icon" v-if="icon" class="w-8 h-8 text-slate-300 mx-auto mb-2" />
    {{ message }}
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

withDefaults(
  defineProps<{
    message: string;
    icon?: Component;
  }>(),
  {
    icon: undefined,
  }
);
</script>
