<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
  >
    <div
      class="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
      :class="[maxWidth, panelClass]"
    >
      <div
        v-if="$slots.header || title || subtitle || $slots.icon"
        class="p-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50 flex-shrink-0"
      >
        <!-- Header แบบมาตรฐาน: icon box + ชื่อ + คำอธิบาย (ใช้เมื่อกำหนด title/subtitle หรือ #icon) -->
        <div v-if="title || subtitle || $slots.icon" class="flex items-center gap-4 min-w-0">
          <div
            v-if="$slots.icon"
            class="w-10 h-10 rounded-xl bg-blue-50 text-bma-700 flex items-center justify-center flex-shrink-0"
            :class="iconClass"
          >
            <slot name="icon" />
          </div>
          <div v-if="title || subtitle" class="min-w-0">
            <h3 v-if="title" class="font-semibold text-lg text-slate-900">{{ title }}</h3>
            <p v-if="subtitle" class="text-[11px] text-slate-500" :class="title ? 'mt-0.5' : ''">{{ subtitle }}</p>
          </div>
        </div>
        <!-- Header แบบกำหนดเองทั้งหมด -->
        <div v-else class="flex items-center gap-4 min-w-0">
          <slot name="header" />
        </div>
        <button
          v-if="closable"
          type="button"
          class="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer flex-shrink-0"
          @click="emit('close')"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <div v-if="$slots.default" class="p-5 overflow-y-auto">
        <slot />
      </div>

      <div
        v-if="$slots.footer"
        class="px-4 sm:px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex-shrink-0"
      >
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';

withDefaults(
  defineProps<{
    isOpen: boolean;
    /** ชื่อหัวข้อ — ใช้ร่วมกับ #icon เพื่อได้ header แบบมาตรฐาน (icon + ชื่อ + คำอธิบาย) */
    title?: string;
    /** คำอธิบายใต้ชื่อหัวข้อ (ใช้ได้เฉพาะเมื่อมี title) */
    subtitle?: string;
    /** class เพิ่มเติมของกล่องไอคอน เช่น "bg-blue-900 text-white" */
    iconClass?: string;
    maxWidth?: string;
    panelClass?: string;
    closable?: boolean;
  }>(),
  {
    title: '',
    subtitle: '',
    iconClass: '',
    maxWidth: 'max-w-lg',
    panelClass: '',
    closable: true,
  }
);

const emit = defineEmits<{
  (e: 'close'): void;
}>();
</script>
