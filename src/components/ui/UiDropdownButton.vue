<template>
  <div ref="triggerRef" class="relative inline-block">
    <UiButton :variant="variant" :size="size" :class="triggerClass" @click="toggle">
      <template #icon>
        <slot name="icon" />
      </template>
      <template v-if="label">{{ label }}</template>
      <ChevronDown
        v-if="label"
        class="w-3 h-3 text-slate-400 transition-transform duration-150"
        :class="{ 'rotate-180': open }"
      />
    </UiButton>

    <!-- เมนูวาดที่ body เพื่อไม่ให้ถูก clip ด้วย overflow ของตาราง/คอนเทนเนอร์ -->
    <Teleport to="body">
      <div v-if="open" class="fixed inset-0 z-20" @click="open = false" />

      <div
        v-if="open"
        class="fixed w-52 bg-white border border-slate-200/90 rounded-2xl shadow-xl py-1 z-30 text-slate-800 text-[13px] animate-in fade-in zoom-in-95 duration-100"
        :style="menuStyle"
      >
        <div v-if="menuTitle" class="px-4 py-2.5 text-xs font-semibold text-slate-400 border-b border-slate-100">
          {{ menuTitle }}
        </div>
        <div class="py-1">
          <button
            v-for="item in items"
            :key="item.value"
            type="button"
            class="w-full text-left px-4 py-2 text-xs text-slate-800 hover:text-blue-900 hover:bg-slate-50 font-medium cursor-pointer transition-colors inline-flex items-center gap-2"
            @click="choose(item)"
          >
            <component :is="item.icon" v-if="item.icon" class="w-3.5 h-3.5 text-slate-400" />
            {{ item.label }}
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from 'vue';
import type { Component } from 'vue';
import { ChevronDown } from 'lucide-vue-next';
import UiButton from './UiButton.vue';

const props = withDefaults(
  defineProps<{
    /** ข้อความบนปุ่ม — ไม่ส่ง (ค่าว่าง) = ปุ่มไอคอนเดียว */
    label?: string;
    items: { value: string; label: string; icon?: Component }[];
    menuTitle?: string;
    variant?: 'primary' | 'success' | 'accent' | 'outline' | 'ghost';
    size?: 'xs' | 'sm' | 'md';
    /** โหมดปุ่มไอคอนล้วนสำหรับวางในตาราง — ลุคเดียวกับ UiIconButton (outline) */
    iconOnly?: boolean;
    /** เปิดเมนูไปทางซ้าย (ค่าเริ่มต้น: ชิดขวาของปุ่ม) */
    align?: 'left' | 'right';
  }>(),
  {
    label: '',
    menuTitle: undefined,
    variant: 'outline',
    size: 'sm',
    iconOnly: false,
    align: 'right',
  }
);

const emit = defineEmits<{
  (e: 'select', item: { value: string; label: string }): void;
}>();

const open = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const menuTop = ref(0);
const menuLeft = ref(0);

// โหมด iconOnly: ปุ่มไอคอนล้วน — ลุคตาม variant (outline = เหมือน UiIconButton, ghost = จุดจางในตาราง)
const triggerClass = computed(() => {
  if (props.iconOnly || !props.label) {
    if (props.variant === 'ghost') {
      return '!p-2 !gap-0 !border-0 !bg-transparent !text-slate-400 hover:!text-blue-900 hover:!bg-slate-100';
    }
    return '!p-2 !gap-0 !bg-slate-50 !text-slate-600 hover:!bg-white hover:!text-blue-900';
  }
  return '';
});

const MENU_WIDTH = 208; // w-52

const updatePosition = () => {
  const rect = triggerRef.value?.getBoundingClientRect();
  if (!rect) return;
  menuTop.value = rect.bottom + 6;
  menuLeft.value = props.align === 'right' ? rect.right - MENU_WIDTH : rect.left;
};

const menuStyle = computed(() => ({
  top: `${menuTop.value}px`,
  left: `${Math.max(8, Math.min(menuLeft.value, window.innerWidth - MENU_WIDTH - 8))}px`,
}));

const toggle = () => {
  open.value = !open.value;
  if (open.value) {
    updatePosition();
    window.addEventListener('scroll', closeOnScroll, true);
    window.addEventListener('resize', closeOnScroll);
  }
};

const closeOnScroll = () => {
  open.value = false;
};

const close = () => {
  open.value = false;
  window.removeEventListener('scroll', closeOnScroll, true);
  window.removeEventListener('resize', closeOnScroll);
};

onBeforeUnmount(close);

const choose = (item: { value: string; label: string }) => {
  close();
  nextTick(() => emit('select', item));
};

defineExpose({ close });
</script>
