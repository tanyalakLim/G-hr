<template>
  <div
    ref="containerRef"
    class="flex w-full min-h-0 select-none"
    :class="isStacked ? 'flex-col gap-4' : 'flex-row'"
  >
    <!-- Pane แรก (ซ้าย) -->
    <div
      class="min-w-0 min-h-0 overflow-hidden"
      :style="isStacked ? undefined : { flex: `0 0 ${clampedValue}%` }"
    >
      <slot name="first" />
    </div>

    <!-- แถบแบ่งที่ลากได้ (ซ่อนเมื่อจอเล็กแล้ววางซ้อนแนวตั้ง) -->
    <div
      v-if="!isStacked"
      role="separator"
      aria-orientation="vertical"
      :aria-valuenow="Math.round(clampedValue)"
      :aria-valuetext="`ซ้าย ${Math.round(clampedValue)}%`"
      aria-label="ลากเพื่อปรับความกว้างของสองฝั่ง"
      tabindex="0"
      class="group relative w-2 flex-shrink-0 cursor-col-resize outline-none"
      :class="isDragging ? 'pointer-events-auto' : ''"
      @pointerdown="startDrag"
      @dblclick="reset"
      @keydown="onKeydown"
    >
      <span
        class="absolute left-1/2 -translate-x-1/2 top-3 bottom-3 w-1 rounded-full transition-colors"
        :class="isDragging ? 'bg-blue-500' : 'bg-slate-200 group-hover:bg-blue-400 group-focus-visible:bg-blue-500'"
      />
      <span
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-[3px] p-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-slate-400 group-hover:text-blue-600 group-hover:border-blue-300 transition-colors"
      >
        <GripVertical class="w-2.5 h-2.5" />
      </span>
    </div>

    <!-- Pane ที่สอง (ขวา) -->
    <div class="flex-1 min-w-0 min-h-0 overflow-hidden">
      <slot name="second" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { GripVertical } from 'lucide-vue-next';

const props = withDefaults(
  defineProps<{
    /** สัดส่วนความกว้างฝั่งซ้าย (0-100) */
    modelValue?: number;
    /** สัดส่วนซ้ายต่ำสุด (%) */
    min?: number;
    /** สัดส่วนซ้ายสูงสุด (%) */
    max?: number;
    /** ขนาดจอที่ต่ำกว่าจะวางซ้อนแนวตั้งและปิดแถบลาก */
    stackedBelow?: 'lg' | 'xl' | 'none';
  }>(),
  {
    modelValue: 50,
    min: 25,
    max: 75,
    stackedBelow: 'xl',
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const BREAKPOINT_PX: Record<string, number> = { lg: 1024, xl: 1280 };

const containerRef = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const isStacked = ref(false);

const clampedValue = computed(() =>
  Math.min(Math.max(props.modelValue, props.min), Math.max(props.min, props.max - 1))
);

const setValue = (value: number) => {
  emit('update:modelValue', Math.round(Math.min(Math.max(value, props.min), props.max) * 10) / 10);
};

const reset = () => setValue(50);

// --- ลากแถบแบ่ง (Pointer Events รองรับทั้งเมาส์และทัช)
let pointerId: number | null = null;

const startDrag = (event: PointerEvent) => {
  pointerId = event.pointerId;
  isDragging.value = true;
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
};

const onDragMove = (event: PointerEvent) => {
  if (!isDragging.value || pointerId !== event.pointerId) return;
  const rect = containerRef.value?.getBoundingClientRect();
  if (!rect || rect.width === 0) return;
  setValue(((event.clientX - rect.left) / rect.width) * 100);
};

const endDrag = (event: PointerEvent) => {
  if (pointerId !== event.pointerId) return;
  isDragging.value = false;
  pointerId = null;
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
};

// --- คีย์บอร์ด: ←/→ ปรับทีละ 2%
const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') setValue(clampedValue.value - 2);
  else if (event.key === 'ArrowRight') setValue(clampedValue.value + 2);
  else if (event.key === 'Home') setValue(props.min);
  else if (event.key === 'End') setValue(props.max);
  else return;
  event.preventDefault();
};

// --- จอเล็กกว่า breakpoint -> วางซ้อนแนวตั้ง ไม่มีแถบลาก
let mql: MediaQueryList | null = null;
const updateStacked = () => {
  isStacked.value = mql ? !mql.matches : false;
};

onMounted(() => {
  const bp = BREAKPOINT_PX[props.stackedBelow];
  if (!bp) return;
  mql = window.matchMedia(`(min-width: ${bp}px)`);
  updateStacked();
  mql.addEventListener('change', updateStacked);
  window.addEventListener('pointermove', onDragMove);
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
});

onBeforeUnmount(() => {
  mql?.removeEventListener('change', updateStacked);
  window.removeEventListener('pointermove', onDragMove);
  window.removeEventListener('pointerup', endDrag);
  window.removeEventListener('pointercancel', endDrag);
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
});
</script>
