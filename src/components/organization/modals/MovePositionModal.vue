<template>
  <UiModal
    :is-open="isOpen"
    max-width="max-w-5xl"
    title="ย้ายตำแหน่งข้ามหน่วยงาน/ส่วนราชการ"
    subtitle="จัดการโอนย้ายตำแหน่งและส่วนราชการไปยังหน่วยงานหรือส่วนราชการปลายทาง"
    @close="emit('close')"
  >
    <template #icon>
      <Shuffle class="w-5 h-5 text-bma-700" />
    </template>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- ส่วนที่ 1: เลือกตำแหน่งที่ต้องการย้าย -->
      <section class="rounded-xl border border-slate-200/90 bg-white p-4 space-y-3">
        <div>
          <h4 class="text-sm font-bold text-slate-900 flex items-center gap-2">
            ส่วนที่ 1: เลือกตำแหน่งที่ต้องการย้าย
          </h4>
          <p class="text-[11px] text-slate-400 mt-0.5">ระบุหน่วยงานและผู้ครองตำแหน่งที่ต้องการโอนย้าย</p>
        </div>

        <!-- หน่วยงานปัจจุบัน -->
        <div class="rounded-xl bg-blue-50/60 border border-blue-100 px-3.5 py-3 flex items-center gap-3">
          <span class="w-10 h-10 rounded-xl bg-white border border-blue-100 text-bma-700 flex items-center justify-center flex-shrink-0">
            <Building2 class="w-5 h-5" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-[11px] text-slate-500">หน่วยงานต้นทางของคุณ</p>
            <p class="text-sm font-bold text-slate-900 truncate">{{ unitName }}</p>
          </div>
          <UiBadge tone="emerald" shape="chip">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
            {{ positions.length }} ตำแหน่งทั้งหมด
          </UiBadge>
        </div>

        <div class="flex items-center justify-between gap-2">
          <span class="text-xs font-semibold text-slate-700">
            รายการตำแหน่งที่ต้องการย้าย <span class="text-red-500">*</span>
          </span>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="text-[11px] font-semibold cursor-pointer transition-colors"
              :class="allVisibleSelected ? 'text-slate-500 hover:text-slate-700' : 'text-bma-700 hover:text-bma-500'"
              @click="toggleSelectAll"
            >
              {{ allVisibleSelected ? 'ยกเลิกทั้งหมด' : 'เลือกทั้งหมด' }}
            </button>
            <UiBadge :tone="selectedIds.length ? 'blue' : 'slate'" shape="chip">
              เลือกแล้ว {{ selectedIds.length }} รายการ
            </UiBadge>
          </div>
        </div>

        <UiSearchInput
          id="move-position-search-input"
          v-model="positionSearch"
          placeholder="ค้นหาเลขที่ตำแหน่ง, ชื่อตำแหน่ง หรือชื่อผู้ครองตำแหน่ง..."
        />

        <div class="rounded-xl border border-slate-200/90 overflow-hidden">
          <div class="max-h-[300px] overflow-auto divide-y divide-slate-100">
            <label
              v-for="pos in filteredPositions"
              :key="pos.id"
              class="flex items-center gap-3 px-3.5 py-2.5 cursor-pointer transition-colors hover:bg-slate-50/70"
              :class="selectedIds.includes(pos.id) ? 'bg-blue-50/40' : ''"
            >
              <input
                type="checkbox"
                :checked="selectedIds.includes(pos.id)"
                class="w-4 h-4 rounded border-slate-300 text-blue-900 accent-blue-900 cursor-pointer flex-shrink-0"
                @change="toggleSelected(pos.id)"
              />
              <span class="inline-flex items-center flex-shrink-0">
                <UiBadge tone="outline" shape="chip" mono>{{ pos.positionNumber }}</UiBadge>
                <Star v-if="pos.isKeyPosition" class="w-3 h-3 ml-0.5 fill-amber-400 text-amber-400" />
              </span>
              <span class="text-xs font-semibold text-blue-950 truncate">{{ pos.jobTitle }}</span>
              <UiBadge tone="slate" shape="chip" class="flex-shrink-0">{{ pos.positionType ?? '-' }} / {{ levelShort(pos) }}</UiBadge>
              <span class="flex-1" />
              <span class="text-xs font-medium text-slate-800 truncate max-w-40 text-right flex-shrink-0">
                {{ holderOf(pos)?.name ?? '-' }}
              </span>
            </label>
            <div v-if="filteredPositions.length === 0" class="p-4">
              <UiEmptyState message="ไม่พบตำแหน่งจากการค้นหา" />
            </div>
          </div>
        </div>
      </section>

      <!-- ส่วนที่ 2: กำหนดหน่วยงานปลายทาง -->
      <section class="rounded-xl border border-slate-200/90 bg-white p-4 space-y-3">
        <div>
          <h4 class="text-sm font-bold text-slate-900 flex items-center gap-2">
            ส่วนที่ 2: กำหนดหน่วยงานปลายทาง
          </h4>
          <p class="text-[11px] text-slate-400 mt-0.5">เลือกสำนัก/กอง/แผน ที่จะโอนย้ายตำแหน่งไป</p>
        </div>

        <UiSearchInput
          id="move-unit-search-input"
          v-model="unitSearch"
          placeholder="ค้นหาหน่วยงานปลายทาง..."
        />

        <div class="rounded-xl border border-slate-200/90 overflow-hidden">
          <div class="max-h-[360px] overflow-auto p-2">
            <UiTree
              :items="destinationTree"
              :selected-id="destUnitId"
              v-model:expanded="expandedUnitIds"
              @select="(node) => (destUnitId = node.id)"
            />
          </div>
        </div>
      </section>
    </div>

    <!-- สรุปการดำเนินการโดยย่อ -->
    <div class="mt-4 rounded-xl border border-slate-200/90 bg-white px-4 py-3.5 flex items-start gap-3">
      <span class="w-10 h-10 rounded-xl bg-blue-50 text-bma-700 flex items-center justify-center flex-shrink-0">
        <Route class="w-5 h-5" />
      </span>
      <div class="min-w-0">
        <h5 class="text-xs font-bold text-slate-800">สรุปการดำเนินการโดยย่อ</h5>
        <p class="text-xs text-slate-600 mt-1 leading-relaxed">
          <template v-if="selectedIds.length && destUnitName">
            ตำแหน่งที่เลือก (<strong class="text-bma-700">{{ selectedCountText }}</strong>) จะถูกโอนย้ายจาก
            <strong class="text-slate-900">{{ unitName }}</strong> ไปยัง
            <strong class="text-bma-700">{{ destUnitName }}</strong> หลังจากได้รับการอนุมัติ
          </template>
          <template v-else>
            เลือกตำแหน่งในส่วนที่ 1 และหน่วยงานปลายทางในส่วนที่ 2 เพื่อดูสรุปการย้าย
          </template>
        </p>
      </div>
    </div>

    <template #footer>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p class="inline-flex items-center gap-1.5 text-[11px] text-amber-600">
          <Info class="w-3.5 h-3.5 flex-shrink-0" />
          ตำแหน่งที่ย้ายจะถูกอัปเดตในข้อมูลโครงสร้างอัตรากำลังของหน่วยงานปลายทาง
        </p>
        <div class="flex items-center justify-end gap-2 flex-shrink-0">
          <UiButton variant="outline" @click="emit('close')">ยกเลิก</UiButton>
          <UiButton :disabled="!canSubmit" @click="handleConfirm">
            <template #icon>
              <Check class="w-4 h-4" />
            </template>
            ยืนยันการย้ายตำแหน่ง
          </UiButton>
        </div>
      </div>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Building2, Check, Info, Route, Shuffle, Star } from 'lucide-vue-next';
import { UiBadge, UiButton, UiEmptyState, UiModal, UiSearchInput, UiTree } from '../../ui';
import { ORG_UNITS } from '../../../data/organizationData';
import type { OrgUnit } from '../../../data/organizationData';
import { holderOf, levelBadge, unitSubtreeMatches, type SharedPosition } from '../orgHelpers';

const props = defineProps<{
  isOpen: boolean;
  /** รายการตำแหน่งต้นทาง — รับ SharedPosition ได้ทุกชุดข้อมูล (org / ลูกจ้างประจำ) */
  positions: SharedPosition[];
  unitName: string;
  currentUnitId: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm', payload: { positionIds: string[]; destinationUnitId: string }): void;
}>();

// --- ส่วนที่ 1: เลือกตำแหน่ง
const selectedIds = ref<string[]>([]);
const positionSearch = ref('');

const levelShort = (pos: SharedPosition) => levelBadge(pos);

const filteredPositions = computed(() => {
  const q = positionSearch.value.trim().toLowerCase();
  if (!q) return props.positions;
  return props.positions.filter((p) => {
    const holder = holderOf(p);
    return (
      p.positionNumber.toLowerCase().includes(q) ||
      p.jobTitle.toLowerCase().includes(q) ||
      (holder ? holder.name.toLowerCase().includes(q) : false)
    );
  });
});

const toggleSelected = (id: string) => {
  selectedIds.value = selectedIds.value.includes(id)
    ? selectedIds.value.filter((sid) => sid !== id)
    : [...selectedIds.value, id];
};

// เลือกทั้งหมด/ยกเลิกทั้งหมด เฉพาะตำแหน่งที่แสดงผลจากการค้นหา
const allVisibleSelected = computed(
  () =>
    filteredPositions.value.length > 0 &&
    filteredPositions.value.every((pos) => selectedIds.value.includes(pos.id))
);

const toggleSelectAll = () => {
  const visibleIds = filteredPositions.value.map((pos) => pos.id);
  selectedIds.value = allVisibleSelected.value
    ? selectedIds.value.filter((sid) => !visibleIds.includes(sid))
    : [...new Set([...selectedIds.value, ...visibleIds])];
};

// --- ส่วนที่ 2: หน่วยงานปลายทาง (ต้นไม้หน่วยงาน)
interface UiTreeNodeInput {
  id: string;
  label: string;
  desc?: string;
  children?: UiTreeNodeInput[];
}

const unitSearch = ref('');
const destUnitId = ref<string | null>(null);
const expandedUnitIds = ref<string[]>([]);

const toTree = (units: OrgUnit[]): UiTreeNodeInput[] =>
  units
    .filter((u) => !unitSearch.value.trim() || unitSubtreeMatches(u, unitSearch.value.trim().toLowerCase()))
    .map((u) => ({
      id: u.id,
      label: u.name,
      desc: [u.code, u.shortName].filter(Boolean).join(' '),
      children: u.children ? toTree(u.children) : undefined,
    }));

const destinationTree = computed<UiTreeNodeInput[]>(() => {
  // ไม่ให้เลือกหน่วยงานเดิมเป็นปลายทาง
  const pruneCurrent = (units: OrgUnit[]): OrgUnit[] =>
    units
      .filter((u) => u.id !== props.currentUnitId)
      .map((u) => ({ ...u, children: u.children ? pruneCurrent(u.children) : undefined }));
  return toTree(pruneCurrent(ORG_UNITS));
});

// --- สรุป + ยืนยัน
const selectedCountText = computed(() =>
  props.positions
    .filter((p) => selectedIds.value.includes(p.id))
    .map((p) => p.positionNumber)
    .join(', ')
);

const destUnitName = computed(() => {
  if (!destUnitId.value) return '';
  const find = (units: OrgUnit[]): OrgUnit | undefined => {
    for (const u of units) {
      if (u.id === destUnitId.value) return u;
      const inChild = u.children ? find(u.children) : undefined;
      if (inChild) return inChild;
    }
    return undefined;
  };
  return find(ORG_UNITS)?.name ?? '';
});

const canSubmit = computed(() => selectedIds.value.length > 0 && !!destUnitId.value);

const handleConfirm = () => {
  if (!canSubmit.value || !destUnitId.value) return;
  emit('confirm', { positionIds: [...selectedIds.value], destinationUnitId: destUnitId.value });
};

// เปิด modal ใหม่ทุกครั้ง -> รีเซ็ต
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      selectedIds.value = [];
      positionSearch.value = '';
      unitSearch.value = '';
      destUnitId.value = null;
      expandedUnitIds.value = [];
    }
  }
);
</script>
