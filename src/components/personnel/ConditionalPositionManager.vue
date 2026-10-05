<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
    <PageTitle
      title="จัดการตำแหน่งติดเงื่อนไข"
      subtitle="กำหนดสถานะตำแหน่งติดเงื่อนไขและหมายเหตุของแต่ละตำแหน่งในหน่วยงาน"
    />

    <div class="mt-4 bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div class="grid grid-cols-1 lg:grid-cols-12">
        <!-- Tree หน่วยงาน -->
        <ActingUnitTree
          v-show="!showAllPositions"
          :selected-node-id="selectedUnitId"
          @select="selectedUnitId = $event"
        />

        <!-- แผงขวา: ตารางตำแหน่ง -->
        <div
          class="p-3 sm:p-4 space-y-4 min-w-0"
          :class="showAllPositions ? 'lg:col-span-12' : 'lg:col-span-9'"
        >
          <section class=" overflow-hidden">
            <header class=" pb-3 border-b border-slate-100 bg-white flex flex-wrap items-center justify-end gap-3">
              <UiCheckbox v-model="showAllPositions">แสดงตำแหน่งทั้งหมด</UiCheckbox>
              <div class="w-full md:w-64">
                <UiSearchInput v-model="search" placeholder="ค้นหา" />
              </div>
            </header>

            <div class="overflow-x-auto rounded-xl border border-slate-200/90">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50/80 border-b border-slate-200/90 text-[12px] font-semibold text-slate-600 select-none">
                    <th class="py-3 px-4 w-14 text-center">แก้ไข</th>
                    <th class="py-3 px-2 w-10"></th>
                    <th class="py-3 px-4 w-16">ลำดับ</th>
                    <th class="py-3 px-4 min-w-[130px]">ตำแหน่งเลขที่</th>
                    <th class="py-3 px-4 min-w-[180px]">ตำแหน่งในสายงาน</th>
                    <th class="py-3 px-4 min-w-[130px]">ตำแหน่งประเภท</th>
                    <th class="py-3 px-4 min-w-[130px]">ระดับตำแหน่ง</th>
                    <th class="py-3 px-4 min-w-[140px] text-center">ตำแหน่งติดเงื่อนไข</th>
                    <th class="py-3 px-4 min-w-[160px]">หมายเหตุ</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
                  <template v-for="row in pagedPositions" :key="row.id">
                    <tr class="hover:bg-slate-50/70 transition-colors">
                      <td class="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          title="แก้ไขตำแหน่งติดเงื่อนไข"
                          class="inline-flex items-center justify-center w-7 h-7 rounded-md text-sky-700 hover:bg-sky-50 transition-colors cursor-pointer"
                          @click="openEditModal(row)"
                        >
                          <Pencil class="w-4 h-4" />
                        </button>
                      </td>
                      <td class="py-3.5 px-2 text-center">
                        <button
                          type="button"
                          :title="expandedId === row.id ? 'ย่อรายละเอียด' : 'ขยายรายละเอียด'"
                          class="inline-flex items-center justify-center w-6 h-6 rounded-md text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                          @click="toggleExpand(row.id)"
                        >
                          <ChevronDown v-if="expandedId === row.id" class="w-4 h-4" />
                          <ChevronRight v-else class="w-4 h-4" />
                        </button>
                      </td>
                      <td class="py-3.5 px-4">{{ row.order }}</td>
                      <td class="py-3.5 px-4">
                        <UiBadge tone="outline" shape="chip" mono>{{ row.positionNumber }}</UiBadge>
                      </td>
                      <td class="py-3.5 px-4">{{ row.jobTitle }}</td>
                      <td class="py-3.5 px-4">{{ row.positionType }}</td>
                      <td class="py-3.5 px-4">{{ row.levelLabel }}</td>
                      <td class="py-3.5 px-4 text-center">
                        <Check v-if="row.isConditional" class="w-4 h-4 text-slate-700 inline-block" />
                        <span v-else class="text-slate-400">-</span>
                      </td>
                      <td class="py-3.5 px-4">{{ row.note || '-' }}</td>
                    </tr>

                    <!-- แถวรายละเอียดตำแหน่ง (ขยาย) -->
                    <tr v-if="expandedId === row.id">
                      <td colspan="9" class="p-3 bg-slate-50/60">
                        <div class="overflow-x-auto rounded-lg border border-slate-200/90 bg-white">
                          <table class="w-full text-left border-collapse">
                            <thead>
                              <tr class="bg-slate-50/80 border-b border-slate-200/90 text-[12px] font-semibold text-slate-600 select-none">
                                <th class="py-3 px-4 w-16">ลำดับ</th>
                                <th class="py-3 px-4 min-w-[170px]">ตำแหน่งในสายงาน</th>
                                <th class="py-3 px-4 min-w-[110px]">สายงาน</th>
                                <th class="py-3 px-4 min-w-[130px]">ประเภทตำแหน่ง</th>
                                <th class="py-3 px-4 min-w-[130px]">ระดับตำแหน่ง</th>
                                <th class="py-3 px-4 min-w-[160px]">ตำแหน่งทางการบริหาร</th>
                                <th class="py-3 px-4 min-w-[160px]">ด้านทางการบริหาร</th>
                                <th class="py-3 px-4 min-w-[110px]">ด้าน/สาย</th>
                              </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
                              <tr
                                v-for="d in row.details"
                                :key="d.id"
                                class="hover:bg-slate-50/70 transition-colors"
                              >
                                <td class="py-3.5 px-4">{{ d.order }}</td>
                                <td class="py-3.5 px-4">{{ d.jobTitle }}</td>
                                <td class="py-3.5 px-4">{{ d.division }}</td>
                                <td class="py-3.5 px-4">{{ d.positionType }}</td>
                                <td class="py-3.5 px-4">{{ d.levelLabel }}</td>
                                <td class="py-3.5 px-4">{{ d.adminPosition }}</td>
                                <td class="py-3.5 px-4">{{ d.adminField }}</td>
                                <td class="py-3.5 px-4">{{ d.line }}</td>
                              </tr>
                              <tr v-if="row.details.length === 0">
                                <td colspan="8">
                                  <UiEmptyState message="ไม่มีรายละเอียดตำแหน่ง" />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  </template>
                  <tr v-if="pagedPositions.length === 0">
                    <td colspan="9">
                      <UiEmptyState message="ไม่พบตำแหน่งในหน่วยงานที่เลือก" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="border-t border-slate-100">
              <UiPagination
                v-model:current-page="page"
                v-model:page-size="pageSize"
                :total="filteredPositions.length"
              />
            </div>
          </section>
        </div>
      </div>
    </div>

    <!-- Modal แก้ไขตำแหน่งติดเงื่อนไข -->
    <UiModal :is-open="editTarget !== null" max-width="max-w-xl" @close="closeEditModal">
      <template #header>
        <h2 class="text-base font-bold text-slate-800">จัดการตำแหน่งติดเงื่อนไข</h2>
      </template>

      <div v-if="editTarget" class="space-y-4">
        <UiCheckbox v-model="editIsConditional">ตำแหน่งติดเงื่อนไข</UiCheckbox>
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-slate-600">หมายเหตุ</label>
          <textarea
            v-model="editNote"
            rows="5"
            placeholder="หมายเหตุ"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 resize-y"
          ></textarea>
        </div>
        <div class="text-xs text-slate-500">
          ตำแหน่งเลขที่ <UiBadge tone="outline" shape="chip" mono>{{ editTarget.positionNumber }}</UiBadge>
          · {{ editTarget.jobTitle }}
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton variant="outline" size="sm" @click="closeEditModal">ยกเลิก</UiButton>
          <UiButton size="sm" @click="saveEdit">บันทึก</UiButton>
        </div>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Check, ChevronDown, ChevronRight, Pencil } from 'lucide-vue-next';
import { PageTitle } from '../common';
import {
  UiBadge,
  UiButton,
  UiCheckbox,
  UiEmptyState,
  UiModal,
  UiPagination,
  UiSearchInput,
} from '../ui';
import ActingUnitTree from './ActingUnitTree.vue';
import { descendantMap } from '../organization/orgHelpers';
import {
  CONDITIONAL_POSITIONS,
  type ConditionalPosition,
} from '../../data/conditionalRolesData';
import { useToast } from '../../composables/useToast';

const { show } = useToast();

// --- หน่วยงานที่เลือก (จาก tree)
const selectedUnitId = ref('1000');
const showAllPositions = ref(false);
const search = ref('');

const filteredPositions = computed(() => {
  let result = CONDITIONAL_POSITIONS;
  if (!showAllPositions.value) {
    const unitIds = descendantMap.get(selectedUnitId.value) ?? [selectedUnitId.value];
    result = result.filter((p) => unitIds.includes(p.unitId));
  }
  const q = search.value.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (p) =>
        p.positionNumber.toLowerCase().includes(q) ||
        p.jobTitle.toLowerCase().includes(q) ||
        p.positionType.toLowerCase().includes(q) ||
        p.note.toLowerCase().includes(q)
    );
  }
  return result;
});

const page = ref(1);
const pageSize = ref(10);

const pagedPositions = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filteredPositions.value.slice(start, start + pageSize.value);
});

watch([selectedUnitId, showAllPositions, search, pageSize], () => {
  page.value = 1;
  expandedId.value = null;
});

// --- ขยาย/ย่อรายละเอียดตำแหน่ง
const expandedId = ref<string | null>(null);
const toggleExpand = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id;
};

// --- Modal แก้ไข
const editTarget = ref<ConditionalPosition | null>(null);
const editIsConditional = ref(false);
const editNote = ref('');

const openEditModal = (row: ConditionalPosition) => {
  editTarget.value = row;
  editIsConditional.value = row.isConditional;
  editNote.value = row.note;
};

const closeEditModal = () => {
  editTarget.value = null;
};

const saveEdit = () => {
  if (!editTarget.value) return;
  editTarget.value.isConditional = editIsConditional.value;
  editTarget.value.note = editNote.value.trim();
  show(`บันทึกการแก้ไขตำแหน่ง ${editTarget.value.positionNumber} แล้ว`);
  closeEditModal();
};
</script>
