<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
    <PageTitle
      title="รักษาการในตำแหน่ง"
      subtitle="เลือกบุคลากรจากหน่วยงานเพื่อมอบหมายให้ปฏิบัติราชการรักษาการแทนตำแหน่ง พร้อมจัดลำดับรายชื่อ"
    />

    <div class="mt-4 bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div class="grid grid-cols-1 lg:grid-cols-12">
        <!-- Tree หน่วยงาน (ซ่อนเมื่อแสดงตำแหน่งทั้งหมด) -->
        <ActingUnitTree
          v-show="!showAllPositions"
          :selected-node-id="selectedUnitId"
          @select="selectedUnitId = $event"
        />

        <!-- แผงขวา: รายชื่อ + รายชื่อรักษาการ -->
        <div
          class="space-y-4 min-w-0"
          :class="showAllPositions ? 'lg:col-span-12' : 'lg:col-span-9'"
        >
          <!-- Checkbox-->
          <section class=" overflow-hidden">
            <header class="px-4 pt-4 bg-white flex flex-wrap items-center justify-between gap-3">
              <h2 class="text-sm font-bold text-slate-800">รายชื่อ</h2>
              <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-700">
                <UiCheckbox v-model="showAllPositions">แสดงตำแหน่งทั้งหมด</UiCheckbox>
              </div>
            </header>

            <!-- เพิ่มที่เลือก + ค้นหา -->
            <div class="px-4 pt-3 flex flex-col md:flex-row md:items-center gap-3 ">
              <div class="flex items-center gap-2.5 md:mr-auto">
                <UiButton
                  variant="success"
                  size="sm"
                  :disabled="selectedIds.size === 0"
                  @click="addSelected"
                >
                  <template #icon>
                    <Plus class="w-4 h-4" />
                  </template>
                  เพิ่มที่เลือก
                </UiButton>
                <UiBadge v-if="selectedIds.size > 0" tone="slate" shape="chip">
                  เลือกไว้ {{ selectedIds.size }} รายชื่อ
                </UiBadge>
              </div>
              <div class="w-full md:w-64">
                <UiSearchInput v-model="listSearch" placeholder="ค้นหา" />
              </div>
            </div>

            <div class="overflow-x-auto rounded-xl border border-slate-200/90 m-3 sm:m-4">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50/80 border-b border-slate-200/90 text-[12px] font-semibold text-slate-600 select-none">
                    <th class="py-3 px-4 w-12 text-center">
                      <input
                        type="checkbox"
                        class="rounded border-slate-300 text-blue-700 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer align-middle"
                        :checked="allPageSelected"
                        title="เลือกทั้งหมดในหน้านี้"
                        @change="toggleSelectAllPage"
                      />
                    </th>
                    <th class="py-3 px-4 w-16">ลำดับ</th>
                    <th class="py-3 px-4 min-w-[160px]">เลขประจำตัวประชาชน</th>
                    <th class="py-3 px-4 min-w-[170px]">ชื่อ-นามสกุล</th>
                    <th class="py-3 px-4 min-w-[130px]">เลขที่ตำแหน่ง</th>
                    <th class="py-3 px-4 min-w-[190px]">ตำแหน่งในสายงาน</th>
                    <th class="py-3 px-4 min-w-[130px]">ตำแหน่งประเภท</th>
                    <th class="py-3 px-4 min-w-[110px]">ระดับ</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
                  <tr
                    v-for="(row, index) in pagedCandidates"
                    :key="row.id"
                    class="transition-colors"
                    :class="rowClass(row)"
                    @click="toggleSelect(row)"
                  >
                    <td class="py-3.5 px-4 text-center" @click.stop>
                      <UiCheckbox
                        :model-value="selectedIds.has(row.id)"
                        @update:model-value="toggleSelect(row)"
                      />
                    </td>
                    <td class="py-3.5 px-4">{{ index + 1 + (listPage - 1) * listPageSize }}</td>
                    <td class="py-3.5 px-4 font-mono text-slate-600">{{ row.citizenId }}</td>
                    <td class="py-3.5 px-4 font-semibold text-blue-950">{{ row.fullName }}</td>
                    <td class="py-3.5 px-4">
                      <UiBadge tone="outline" shape="chip" mono>{{ row.positionNumber }}</UiBadge>
                    </td>
                    <td class="py-3.5 px-4">{{ row.jobTitle }}</td>
                    <td class="py-3.5 px-4">{{ row.positionType }}</td>
                    <td class="py-3.5 px-4">{{ row.levelLabel }}</td>
                  </tr>
                  <tr v-if="pagedCandidates.length === 0">
                    <td colspan="8">
                      <UiEmptyState message="ไม่พบรายชื่อในหน่วยงานที่เลือก" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            
          </section>

          <!-- รายชื่อรักษาการ -->
          <section class=" overflow-hidden ">
            <header class="px-4 pb-3 pt-4 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
              <h2 class="text-sm font-bold text-slate-800">รายชื่อรักษาการ</h2>
              <div class="flex items-center gap-3">
                <span class="text-[11px] text-slate-500">{{ selectedUnitLabel }}</span>
              </div>
            </header>

           <div class="px-4 flex items-center justify-end ">
            <div class="flex items-center gap-2.5 md:mr-auto">
              <UiButton size="sm" @click="saveAssignments">
                  <template #icon>
                    <Save class="w-4 h-4" />
                  </template>
                  บันทึกข้อมูล
                </UiButton>
              </div>
              <div class="w-full md:w-64">
                <UiSearchInput v-model="actingSearch" placeholder="ค้นหา" />
              </div>
            </div>

            <div class="overflow-x-auto rounded-xl border border-slate-200/90 m-3 sm:m-4">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50/80 border-b border-slate-200/90 text-[12px] font-semibold text-slate-600 select-none">
                    <th class="py-3 px-3 w-24 text-center">จัดลำดับ</th>
                    <th class="py-3 px-4 w-16">ลำดับ</th>
                    <th class="py-3 px-4 min-w-[160px]">เลขประจำตัวประชาชน</th>
                    <th class="py-3 px-4 min-w-[170px]">ชื่อ-นามสกุล</th>
                    <th class="py-3 px-4 min-w-[130px]">เลขที่ตำแหน่ง</th>
                    <th class="py-3 px-4 min-w-[190px]">ตำแหน่งในสายงาน</th>
                    <th class="py-3 px-4 min-w-[130px]">ตำแหน่งประเภท</th>
                    <th class="py-3 px-4 w-16 text-center">ลบ</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
                  <tr
                    v-for="(row, index) in filteredAssignments"
                    :key="row.id"
                    class="hover:bg-slate-50/70 transition-colors"
                  >
                    <td class="py-3.5 px-3">
                      <div class="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          title="เลื่อนขึ้น"
                          class="inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors cursor-pointer"
                          :class="index === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-emerald-600 hover:bg-emerald-50'"
                          :disabled="index === 0"
                          @click="moveAssignment(index, -1)"
                        >
                          <ArrowUp class="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          title="เลื่อนลง"
                          class="inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors cursor-pointer"
                          :class="index === filteredAssignments.length - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'"
                          :disabled="index === filteredAssignments.length - 1"
                          @click="moveAssignment(index, 1)"
                        >
                          <ArrowDown class="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td class="py-3.5 px-4">{{ index + 1 }}</td>
                    <td class="py-3.5 px-4 font-mono text-slate-600">{{ row.citizenId }}</td>
                    <td class="py-3.5 px-4 font-semibold text-blue-950">{{ row.fullName }}</td>
                    <td class="py-3.5 px-4">
                      <UiBadge tone="outline" shape="chip" mono>{{ row.positionNumber }}</UiBadge>
                    </td>
                    <td class="py-3.5 px-4">{{ row.jobTitle }}</td>
                    <td class="py-3.5 px-4">{{ row.positionType }}</td>
                    <td class="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        title="นำออกจากรายชื่อรักษาการ"
                        class="inline-flex items-center justify-center w-7 h-7 rounded-md text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        @click="removeAssignment(row.id)"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                  <tr v-if="filteredAssignments.length === 0">
                    <td colspan="8">
                      <UiEmptyState message="ยังไม่มีรายชื่อรักษาการ — เพิ่มจากตารางรายชื่อด้านบน" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from 'lucide-vue-next';
import { PageTitle } from '../common';
import { UiBadge, UiCheckbox, UiEmptyState, UiButton, UiSearchInput } from '../ui';
import ActingUnitTree from './ActingUnitTree.vue';
import { descendantMap, findUnit, unitRootName } from '../organization/orgHelpers';
import { ORG_UNITS } from '../../data/organizationData';
import {
  ACTING_ASSIGNMENTS,
  ACTING_CANDIDATES,
  type ActingAssignment,
  type ActingCandidate,
} from '../../data/actingData';
import { useToast } from '../../composables/useToast';

const { show } = useToast();

// --- หน่วยงานที่เลือก (จาก tree) — ถ้าเลือกหน่วยแม่ให้รวมหน่วยย่อยทั้งหมด
const selectedUnitId = ref('1000');

const selectedUnitLabel = computed(() => {
  const unit = findUnit(ORG_UNITS, selectedUnitId.value);
  const root = unitRootName(selectedUnitId.value);
  if (!unit) return root;
  return unit.id === ORG_UNITS.find((r) => r.id === unit.id)?.id
    ? `${unit.name} (${unit.code})`
    : `${root} · ${unit.name} (${unit.code})`;
});

// --- บันทึกการกำหนดรักษาการ (จำลอง — แจ้งผลผ่าน toast)
const saveAssignments = () => {
  if (ACTING_ASSIGNMENTS.length === 0) {
    show('ยังไม่มีรายชื่อรักษาการให้บันทึก');
    return;
  }
  show(`บันทึกการกำหนดรักษาการของ ${unitRootName(selectedUnitId.value)} จำนวน ${ACTING_ASSIGNMENTS.length} รายชื่อแล้ว`);
};

// --- ตารางรายชื่อ
// showAllPositions: ทุกหน่วยงาน (ซ่อน tree) — ไม่งั้นแสดงเฉพาะหน่วยงานที่เลือก (รวมหน่วยงานลูก)
const showAllPositions = ref(false);
const listSearch = ref('');

const filteredCandidates = computed(() => {
  // คนที่อยู่ในรายชื่อรักษาการแล้ว (ACTING_ASSIGNMENTS) จะไม่แสดงในตารางนี้
  // จะกลับมาแสดงอีกครั้งเมื่อถูกลบออกจากรายชื่อรักษาการ
  let result = ACTING_CANDIDATES.filter((c) => !isAssigned(c));
  if (!showAllPositions.value) {
    const unitIds = descendantMap.get(selectedUnitId.value) ?? [selectedUnitId.value];
    result = result.filter((c) => unitIds.includes(c.unitId));
  }

  const q = listSearch.value.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.citizenId.includes(q) ||
        c.positionNumber.toLowerCase().includes(q) ||
        c.jobTitle.toLowerCase().includes(q)
    );
  }
  return result;
});

const listPage = ref(1);
const listPageSize = ref(10);

const pagedCandidates = computed(() => {
  const start = (listPage.value - 1) * listPageSize.value;
  return filteredCandidates.value.slice(start, start + listPageSize.value);
});

watch([selectedUnitId, showAllPositions, listSearch, listPageSize], () => {
  listPage.value = 1;
  selectedIds.value = new Set();
});

// --- รายชื่อรักษาการ
const actingSearch = ref('');

const filteredAssignments = computed(() => {
  const q = actingSearch.value.trim().toLowerCase();
  if (!q) return ACTING_ASSIGNMENTS;
  return ACTING_ASSIGNMENTS.filter(
    (a) =>
      a.fullName.toLowerCase().includes(q) ||
      a.citizenId.includes(q) ||
      a.positionNumber.toLowerCase().includes(q) ||
      a.jobTitle.toLowerCase().includes(q)
  );
});

const isAssigned = (candidate: ActingCandidate) =>
  ACTING_ASSIGNMENTS.some((a) => a.citizenId === candidate.citizenId);

// --- การเลือกรายชื่อ (checkbox) แล้วยืนยันด้วยปุ่ม "เพิ่มที่เลือก"
const selectedIds = ref(new Set<string>());

const toggleSelect = (candidate: ActingCandidate) => {
  if (isAssigned(candidate)) return;
  const next = new Set(selectedIds.value);
  if (next.has(candidate.id)) next.delete(candidate.id);
  else next.add(candidate.id);
  selectedIds.value = next;
};

const selectablePageRows = computed(() => pagedCandidates.value.filter((c) => !isAssigned(c)));

const allPageSelected = computed(
  () => selectablePageRows.value.length > 0 && selectablePageRows.value.every((c) => selectedIds.value.has(c.id))
);

const toggleSelectAllPage = () => {
  const next = new Set(selectedIds.value);
  if (allPageSelected.value) {
    selectablePageRows.value.forEach((c) => next.delete(c.id));
  } else {
    selectablePageRows.value.forEach((c) => next.add(c.id));
  }
  selectedIds.value = next;
};

const addSelected = () => {
  const picked = ACTING_CANDIDATES.filter((c) => selectedIds.value.has(c.id) && !isAssigned(c));
  if (picked.length === 0) return;
  picked.forEach((c) => {
    ACTING_ASSIGNMENTS.push({
      id: `act-${c.id}`,
      citizenId: c.citizenId,
      fullName: c.fullName,
      positionNumber: c.positionNumber,
      jobTitle: c.jobTitle,
      positionType: c.positionType,
    } satisfies ActingAssignment);
  });
  selectedIds.value = new Set();
  show(picked.length === 1
    ? `เพิ่ม ${picked[0].fullName} เข้ารายชื่อรักษาการแล้ว`
    : `เพิ่ม ${picked.length} รายชื่อเข้ารายชื่อรักษาการแล้ว`);
};

const rowClass = (row: ActingCandidate) => {
  if (selectedIds.value.has(row.id)) return 'bg-blue-50 cursor-pointer';
  return 'hover:bg-slate-50/70 cursor-pointer';
};

const removeAssignment = (id: string) => {
  const index = ACTING_ASSIGNMENTS.findIndex((a) => a.id === id);
  if (index !== -1) {
    const [removed] = ACTING_ASSIGNMENTS.splice(index, 1);
    show(`นำ ${removed.fullName} ออกจากรายชื่อรักษาการแล้ว`);
  }
};

const moveAssignment = (index: number, direction: -1 | 1) => {
  const row = filteredAssignments.value[index];
  const from = ACTING_ASSIGNMENTS.findIndex((a) => a.id === row.id);
  const target = from + direction;
  if (from === -1 || target < 0 || target >= ACTING_ASSIGNMENTS.length) return;
  [ACTING_ASSIGNMENTS[from], ACTING_ASSIGNMENTS[target]] = [
    ACTING_ASSIGNMENTS[target],
    ACTING_ASSIGNMENTS[from],
  ];
};
</script>
