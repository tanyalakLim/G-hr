<template>
  <UiModal
    :is-open="isOpen"
    max-width="max-w-2xl"
    title="จัดลำดับตำแหน่งในหน่วยงาน"
    :subtitle="`${unitName} - สามารถลากหรือกดปุ่มลูกศรเพื่อจัดลำดับการแสดงผลในตาราง`"
    @close="emit('close')"
  >
    <template #icon>
      <ArrowUpDown class="w-5 h-5 text-bma-700" />
    </template>

    <div class="space-y-4">
      <!-- คำแนะนำ -->
      <p class="rounded-xl bg-blue-50/80 border border-blue-100 px-4 py-3 text-xs text-bma-700 flex items-start gap-2">
        <Lightbulb class="w-4 h-4 flex-shrink-0 mt-0.5" />
        สามารถลากปุ่มเมนู/ลูกศร เพื่อเปลี่ยนลำดับตำแหน่งในรายการ จากนั้นกดบันทึกที่กำหนดตำแหน่งเลขที่
      </p>

      <!-- รายการตำแหน่ง (ลากจัดลำดับได้) -->
      <ul class="space-y-3">
        <li
          v-for="(pos, index) in localPositions"
          :key="pos.id"
          class="rounded-xl border bg-white flex items-center gap-3 px-4 py-3 select-none transition-shadow"
          :class="dragIndex === index ? 'border-bma-500 shadow-lg' : 'border-slate-200/90 shadow-xs'"
          :draggable="true"
          @dragstart="onDragStart(index)"
          @dragover.prevent
          @drop="onDrop(index)"
          @dragend="dragIndex = null"
        >
          <GripVertical class="w-4 h-4 text-slate-300 flex-shrink-0 cursor-grab active:cursor-grabbing" />

          <span class="w-8 h-8 rounded-lg bg-blue-50 text-bma-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
            {{ index + 1 }}
          </span>

          <span class="inline-flex items-center flex-shrink-0">
            <UiBadge tone="outline" shape="chip" mono>{{ pos.positionNumber }}</UiBadge>
            <Star v-if="pos.isKeyPosition" class="w-3 h-3 ml-0.5 fill-amber-400 text-amber-400" />
          </span>

          <span class="min-w-0 flex-1 flex items-center gap-2">
            <span class="text-xs font-semibold text-blue-950 truncate">{{ pos.jobTitle }}</span>
            <UiBadge tone="slate" shape="chip" class="flex-shrink-0">{{ pos.positionType ?? '-' }} / {{ levelShort(pos) }}</UiBadge>
            <span class="flex-1" />
            <span class="text-xs font-medium text-slate-800 truncate text-right flex-shrink-0 max-w-[160px]">
              {{ holderOf(pos)?.name ?? '-' }}
            </span>
          </span>

          <span class="flex items-center gap-1 flex-shrink-0 pl-2 border-l border-slate-100">
            <UiIconButton tone="ghost" title="เลื่อนขึ้น" :disabled="index === 0" @click="move(index, -1)">
              <ArrowUp class="w-4 h-4" :class="index === 0 ? 'text-slate-200' : 'text-slate-500'" />
            </UiIconButton>
            <UiIconButton tone="ghost" title="เลื่อนลง" :disabled="index === localPositions.length - 1" @click="move(index, 1)">
              <ArrowDown class="w-4 h-4" :class="index === localPositions.length - 1 ? 'text-slate-200' : 'text-slate-500'" />
            </UiIconButton>
          </span>
        </li>
      </ul>
    </div>

    <template #footer>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p class="text-xs text-slate-500">ทั้งหมด {{ localPositions.length }} รายการตำแหน่ง</p>
        <div class="flex items-center justify-end gap-2 flex-shrink-0">
          <UiButton variant="ghost" @click="resetOrder">รีเซ็ตค่าเริ่มต้น</UiButton>
          <UiButton variant="outline" @click="emit('close')">ยกเลิก</UiButton>
          <UiButton @click="handleSave">
            <template #icon>
              <Save class="w-4 h-4" />
            </template>
            บันทึกลำดับตำแหน่ง
          </UiButton>
        </div>
      </div>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ArrowDown, ArrowUp, ArrowUpDown, GripVertical, Lightbulb, Save, Star } from 'lucide-vue-next';
import { UiBadge, UiButton, UiIconButton, UiModal } from '../../ui';
import { holderOf, levelBadge, type SharedPosition } from '../orgHelpers';

const props = defineProps<{
  isOpen: boolean;
  /** รายการตำแหน่งในหน่วยงาน — รับ SharedPosition ได้ทุกชุดข้อมูล (org / ลูกจ้างประจำ) */
  positions: SharedPosition[];
  unitName: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', orderedIds: string[]): void;
}>();

// สำเนารายการสำหรับจัดลำดับใน modal (จะไปอัปเดตจริงตอนกดบันทึก)
const localPositions = ref<SharedPosition[]>([]);
const initialOrder = ref<string[]>([]);

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      localPositions.value = [...props.positions].sort((a, b) => a.orderNumber - b.orderNumber);
      initialOrder.value = localPositions.value.map((p) => p.id);
    }
  }
);

const levelShort = (pos: SharedPosition) => levelBadge(pos);

// --- ลำดับ: ลาก + ปุ่มลูกศร
const dragIndex = ref<number | null>(null);

const onDragStart = (index: number) => {
  dragIndex.value = index;
};

const onDrop = (targetIndex: number) => {
  const from = dragIndex.value;
  if (from === null || from === targetIndex) return;
  const list = localPositions.value;
  const [moved] = list.splice(from, 1);
  list.splice(targetIndex, 0, moved);
  dragIndex.value = null;
};

const move = (index: number, direction: -1 | 1) => {
  const target = index + direction;
  if (target < 0 || target >= localPositions.value.length) return;
  const list = localPositions.value;
  [list[index], list[target]] = [list[target], list[index]];
};

const resetOrder = () => {
  const order = initialOrder.value;
  localPositions.value.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
};

const handleSave = () => {
  emit('save', localPositions.value.map((p) => p.id));
};
</script>
