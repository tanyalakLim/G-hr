<template>
  <UiModal
    :is-open="!!position"
    max-width="max-w-2xl"
    title="เลือกผู้ครองตำแหน่ง"
    :subtitle="position ? `ตำแหน่ง ${position.positionNumber} · ${position.jobTitle}` : ''"
    @close="emit('close')"
  >
    <template #icon>
      <UserPlus class="w-5 h-5 text-bma-700" />
    </template>

    <!-- ตำแหน่งเป้าหมาย -->
    <div class="rounded-xl bg-blue-50/60 border border-blue-100 px-3.5 py-3 flex items-center gap-3">
      <span class="w-10 h-10 rounded-xl bg-white border border-blue-100 text-bma-700 flex items-center justify-center flex-shrink-0">
        <Briefcase class="w-5 h-5" />
      </span>
      <div class="min-w-0 flex-1">
        <p class="text-[11px] text-slate-500">กำลังเลือกผู้ครองให้ตำแหน่ง</p>
        <div class="text-sm font-bold text-slate-900 truncate">
          <span class="inline-flex items-center gap-1.5">
            <UiBadge tone="outline" shape="chip" mono>{{ position?.positionNumber }}</UiBadge>
            {{ position?.jobTitle }}
          </span>
        </div>
      </div>
      <UiBadge tone="teal" shape="chip" class="flex-shrink-0">
        <span class="w-1.5 h-1.5 rounded-full bg-teal-500 mr-1" />
        ตำแหน่งว่าง
      </UiBadge>
      <span class="text-[11px] text-slate-400 truncate hidden sm:inline max-w-40">{{ unitName }}</span>
    </div>

    <!-- ค้นหาบุคลากร -->
    <div class="mt-4">
      <UiSearchInput
        id="select-holder-search-input"
        v-model="search"
        placeholder="ค้นหาชื่อ, ตำแหน่ง, สังกัด..."
      />
    </div>

    <!-- รายชื่อบุคลากร -->
    <div class="mt-3 rounded-xl border border-slate-200/90 overflow-hidden">
      <div class="max-h-[320px] overflow-auto divide-y divide-slate-100">
        <label
          v-for="person in filteredPeople"
          :key="person.id"
          class="flex items-center gap-3 px-3.5 py-2.5 cursor-pointer transition-colors hover:bg-slate-50/70"
          :class="selectedId === person.id ? 'bg-blue-50/40' : ''"
        >
          <input
            type="radio"
            name="holder-candidate"
            :checked="selectedId === person.id"
            class="w-4 h-4 accent-blue-900 cursor-pointer flex-shrink-0"
            @change="selectedId = person.id"
          />
         
          <div class="min-w-0 flex-1">
            <p class="text-xs font-semibold text-slate-900 truncate">{{ person.name }}</p>
            <p class="text-[11px] text-slate-500 truncate">{{ person.jobTitle }} · {{ person.department }}</p>
          </div>
          <UiBadge
            v-if="heldPositionLabel(person.id)"
            tone="amber"
            shape="chip"
            class="flex-shrink-0"
          >
            ครองตำแหน่ง: {{ heldPositionLabel(person.id) }}
          </UiBadge>
        </label>
        <div v-if="filteredPeople.length === 0" class="p-4">
          <UiEmptyState message="ไม่พบบุคลากรจากการค้นหา" />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p class="inline-flex items-center gap-1.5 text-[11px] text-amber-600">
          <Info class="w-3.5 h-3.5 flex-shrink-0" />
          บุคคลที่มีตำแหน่งอยู่แล้วสามารถครองเพิ่มได้ในโครงสร้างจำลองนี้
        </p>
        <div class="flex items-center justify-end gap-2 flex-shrink-0">
          <UiButton variant="outline" @click="emit('close')">ยกเลิก</UiButton>
          <UiButton :disabled="!selectedId" @click="handleConfirm">
            <template #icon>
              <Check class="w-4 h-4" />
            </template>
            บันทึกผู้ครองตำแหน่ง
          </UiButton>
        </div>
      </div>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Briefcase, Check, Info, UserPlus } from 'lucide-vue-next';
import { UiBadge, UiButton, UiEmptyState, UiModal, UiSearchInput } from '../../ui';
import { INITIAL_PERSONNEL } from '../../../data/personnelData';
import { ORG_POSITIONS, ORG_UNITS } from '../../../data/organizationData';
import { EMPLOYEE_STAFF_POSITIONS } from '../../../data/permanentStaffData';
import { findUnit, type SharedPosition } from '../orgHelpers';

const props = defineProps<{
  /** ตำแหน่งเป้าหมาย — รับ SharedPosition ได้ทุกชุดข้อมูล (org / ลูกจ้างประจำ) */
  position: SharedPosition | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm', personId: string): void;
}>();

const search = ref('');
const selectedId = ref<string | null>(null);

const unitName = computed(() =>
  props.position ? findUnit(ORG_UNITS, props.position.unitId)?.name ?? '-' : ''
);

// บุคคลนี้กำลังครองตำแหน่งอื่นอยู่หรือไม่ (แสดงป้ายเตือน) — ตรวจทุกชุดข้อมูลอัตรา
const heldPositionLabel = (personId: string) => {
  const held = [...ORG_POSITIONS, ...EMPLOYEE_STAFF_POSITIONS].find(
    (p) => p.holderPersonId === personId && p.id !== props.position?.id
  );
  return held ? held.jobTitle : '';
};

const filteredPeople = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return INITIAL_PERSONNEL;
  return INITIAL_PERSONNEL.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.jobTitle.toLowerCase().includes(q) ||
      p.department.toLowerCase().includes(q)
  );
});

const handleConfirm = () => {
  if (!selectedId.value) return;
  emit('confirm', selectedId.value);
};

// เปิด modal ใหม่ทุกครั้ง -> รีเซ็ต
watch(
  () => props.position,
  () => {
    search.value = '';
    selectedId.value = null;
  }
);
</script>
