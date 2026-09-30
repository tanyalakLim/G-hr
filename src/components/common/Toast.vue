<template>
  <div
    v-if="message"
    id="global-toast"
    class="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-4 duration-300"
  >
    <div class="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white flex-shrink-0">
      <Check class="w-3.5 h-3.5" />
    </div>
    <span>{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
import { Check } from 'lucide-vue-next';

defineProps<{
  message: string | null;
}>();
</script>
