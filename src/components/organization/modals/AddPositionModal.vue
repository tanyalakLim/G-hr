<template>
  <UiModal
    :is-open="isOpen"
    max-width="max-w-6xl"
    title="เพิ่มตำแหน่ง"
    subtitle="กำหนดรหัสและเลขที่ตำแหน่ง แล้วเลือกตำแหน่งจากบัญชีตำแหน่งทั้งหมด"
    @close="emit('close')"
  >
    <template #icon>
      <UserPlus class="w-5 h-5 text-blue-900" />
    </template>

    <div class="space-y-5">
      <!-- ส่วนที่ 1: ข้อมูลส่วนที่เกี่ยวข้อง (กำหนดรหัสและเลขที่ตำแหน่ง) -->
      <section class="rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div>
            <h4 class="text-sm font-bold text-slate-900 flex items-center gap-2">
              ส่วนที่ 1: ข้อมูลส่วนที่เกี่ยวข้อง
            </h4>
            <p class="text-[11px] text-slate-400 mt-0.5">กำหนดรหัสและเลขที่ตำแหน่งประจำหน่วยงาน</p>
          </div>
          <span class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 border border-blue-100 text-xs text-slate-600 self-start sm:self-auto flex-shrink-0">
            หน่วยงาน:&nbsp;<strong class="font-semibold text-slate-900 truncate max-w-[200px]">{{ unitName }}</strong>
            <UiBadge tone="blue" shape="chip" mono>{{ unitShort }}</UiBadge>
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_1.4fr] gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">อักษรย่อหน่วยงาน</label>
            <div class="relative">
              <input
                type="text"
                :value="unitAbbrev"
                disabled
                class="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 font-medium cursor-not-allowed pr-24"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">(จากสังกัด)</span>
            </div>
          </div>

          <div>
            <label for="pos-prefix-input" class="block text-xs font-semibold text-slate-700 mb-1.5">Prefix เลขที่</label>
            <input
              id="pos-prefix-input"
              v-model="prefix"
              type="text"
              placeholder="เช่น ข."
              class="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
            />
          </div>

          <div>
            <label for="pos-number-input" class="block text-xs font-semibold text-slate-700 mb-1.5">
              เลขที่ตำแหน่ง <span class="text-red-500">*</span>
            </label>
            <input
              id="pos-number-input"
              v-model="positionNumber"
              type="text"
              placeholder="เช่น 401"
              class="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
            />
          </div>

          <div>
            <label for="pos-suffix-input" class="block text-xs font-semibold text-slate-700 mb-1.5">Suffix เลขที่</label>
            <input
              id="pos-suffix-input"
              v-model="suffix"
              type="text"
              placeholder="ระบุ (ถ้ามี)"
              class="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
            />
          </div>

          <div>
            <label for="pos-note-input" class="block text-xs font-semibold text-slate-700 mb-1.5">หมายเหตุ</label>
            <input
              id="pos-note-input"
              v-model="note"
              type="text"
              placeholder="ระบุรายละเอียด เช่น เหตุผลในขอตั้งตำแหน่ง..."
              class="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder-slate-400"
            />
          </div>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 -mt-1">
          <UiCheckbox v-model="isManagerial" class="py-1 flex-shrink-0">
            กำหนดให้เป็นตำแหน่ง ผู้อำนวยการ/หัวหน้า
          </UiCheckbox>
          <div v-if="isManagerial" class="flex items-center gap-2 min-w-0 flex-1">
            <label for="pos-signature-input" class="text-[11px] font-semibold text-slate-600 flex-shrink-0">
              ตำแหน่งใต้ลายเซ็น
            </label>
            <input
              id="pos-signature-input"
              v-model="signatureTitle"
              type="text"
              placeholder="เช่น ผู้อำนวยการกอง..."
              class="flex-1 min-w-0 text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder-slate-400"
            />
          </div>
        </div>

        <!-- ตาราง: รายการตำแหน่งที่ใช้เลขที่ชุดนี้ -->
        <div class="rounded-xl border border-slate-200 overflow-hidden">
          <div class="px-4 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 min-w-0">
              <h5 class="text-xs font-bold text-slate-800 truncate">รายการตำแหน่งที่ใช้เลขที่ชุดนี้</h5>
              <UiBadge tone="blue" shape="chip">{{ staged.length }} รายการ</UiBadge>
            </div>
            <UiBadge :tone="staged.length ? 'emerald' : 'slate'" shape="chip">
              <span v-if="staged.length" class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
              {{ staged.length ? 'พร้อมบันทึก' : 'ยังไม่มีรายการ' }}
            </UiBadge>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-200/90 text-[11px] font-semibold text-slate-500 select-none">
                  <th class="py-3 px-4 w-16 text-center">จัดการ</th>
                  <th class="py-3 px-4 w-14">ลำดับ</th>
                  <th class="py-3 px-4 min-w-[130px]">ตำแหน่งในสายงาน</th>
                  <th class="py-3 px-4 min-w-[100px]">สายงาน</th>
                  <th class="py-3 px-4 min-w-[90px]">ตำแหน่งประเภท</th>
                  <th class="py-3 px-4 min-w-[80px]">ระดับตำแหน่ง</th>
                  <th class="py-3 px-4 min-w-[110px]">ตำแหน่งทางการบริหาร</th>
                  <th class="py-3 px-4 min-w-[100px]">ด้านทางการบริหาร</th>
                  <th class="py-3 px-4 min-w-[80px]">ด้าน/สาขา</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
                <tr
                  v-for="(item, index) in staged"
                  :key="item.id"
                  class="transition-colors"
                  :class="editingId === item.id ? 'bg-amber-50/50' : 'hover:bg-slate-50/70'"
                >
                  <td class="py-2.5 px-4 text-center">
                    <div v-if="editingId === item.id" class="flex items-center justify-center gap-1">
                      <UiIconButton tone="ghost" title="บันทึกการแก้ไข" @click="applyEdit(item.id)">
                        <Check class="w-3.5 h-3.5 text-emerald-600" />
                      </UiIconButton>
                      <UiIconButton tone="ghost" title="ยกเลิก" @click="cancelEdit">
                        <X class="w-3.5 h-3.5 text-slate-400" />
                      </UiIconButton>
                    </div>
                    <UiIconButton
                      v-else
                      tone="ghost"
                      title="ลบรายการ"
                      @click="removeStagedRow(item.id)"
                    >
                      <Trash2 class="w-3.5 h-3.5 text-red-400" />
                    </UiIconButton>
                  </td>

                  <template v-if="editingId === item.id">
                    <td class="py-2 px-4 font-medium text-slate-500">{{ index + 1 }}</td>
                    <td class="py-2 px-2"><input v-model="draft.jobTitle" type="text" :class="editInputClass" /></td>
                    <td class="py-2 px-2"><input v-model="draft.lineOfWork" type="text" :class="editInputClass" /></td>
                    <td class="py-2 px-2"><input v-model="draft.positionType" type="text" :class="editInputClass" /></td>
                    <td class="py-2 px-2"><input v-model="draft.levelLabel" type="text" :class="editInputClass" /></td>
                    <td class="py-2 px-2"><input v-model="draft.adminPosition" type="text" :class="editInputClass" /></td>
                    <td class="py-2 px-2"><input v-model="draft.adminField" type="text" :class="editInputClass" /></td>
                    <td class="py-2 px-2"><input v-model="draft.fieldOfWork" type="text" :class="editInputClass" /></td>
                  </template>
                  <template v-else>
                    <td class="py-2.5 px-4 font-medium text-slate-600">{{ index + 1 }}</td>
                    <td class="py-2.5 px-4 font-semibold text-blue-950">{{ item.jobTitle }}</td>
                    <td class="py-2.5 px-4">{{ item.lineOfWork }}</td>
                    <td class="py-2.5 px-4">{{ item.positionType }}</td>
                    <td class="py-2.5 px-4">{{ item.levelLabel }}</td>
                    <td class="py-2.5 px-4">{{ item.adminPosition || '-' }}</td>
                    <td class="py-2.5 px-4">{{ item.adminField || '-' }}</td>
                    <td class="py-2.5 px-4">{{ item.fieldOfWork || '-' }}</td>
                  </template>
                </tr>
                <tr v-if="staged.length === 0">
                  <td colspan="9">
                    <UiEmptyState message='ยังไม่มีตำแหน่ง — เลือกจาก "เลือกตำแหน่งที่ต้องการเพิ่ม" ด้านล่าง' />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ส่วนที่ 2: เลือกตำแหน่งที่ต้องการเพิ่ม -->
      <section class="rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div>
            <h4 class="text-sm font-bold text-slate-900 flex items-center gap-2">
              ส่วนที่ 2: ค้นหาและเลือกตำแหน่งที่ต้องการจากบัญชีตำแหน่งทั้งหมด
            </h4>
            <p class="text-[11px] text-slate-400 mt-0.5">กำหนดรหัสและเลขที่ตำแหน่งประจำหน่วยงาน</p>
          </div>
          <UiButton variant="success" size="sm" class="flex-shrink-0" @click="addNewCatalogRow">
            <template #icon>
              <Plus class="w-4 h-4" />
            </template>
            สร้างตำแหน่งใหม่
          </UiButton>
        </div>

        <!-- การ์ดค้นหา -->
        <form class="rounded-xl border border-slate-200 bg-slate-50/60 p-4 grid grid-cols-1 lg:grid-cols-[1fr_2fr_auto] gap-4 items-end" @submit.prevent="handleCatalogSearch">
          <div>
            <label for="pos-search-field" class="block text-xs font-semibold text-slate-700 mb-1.5">ค้นหาจากฟิลด์</label>
            <UiSelect v-model="searchField" :options="searchFieldOptions" />
          </div>
          <div>
            <label for="pos-catalog-search-input" class="block text-xs font-semibold text-slate-700 mb-1.5">คำค้นหา</label>
            <UiSearchInput
              id="pos-catalog-search-input"
              v-model="searchKeyword"
              placeholder="ระบุชื่อตำแหน่ง เช่น ครูศิลป์, นักวิชาการ..."
            />
          </div>
          <UiButton type="submit" size="md" class="w-full lg:w-auto">
            <template #icon>
              <Search class="w-4 h-4" />
            </template>
            ค้นหาตำแหน่ง
          </UiButton>
        </form>

        <div class="rounded-xl border border-slate-200 overflow-hidden">
          <div class="max-h-[380px] overflow-auto">
            <table class="w-full text-left border-collapse">
              <thead class="sticky top-0 z-10">
                <tr class="bg-slate-50/95 backdrop-blur border-b border-slate-200/90 text-[11px] font-semibold text-slate-500 select-none">
                  <th class="py-3 px-4 w-16 text-center">เลือก</th>
                  <th class="py-3 px-4 w-14">ลำดับ</th>
                  <th class="py-3 px-4 min-w-[130px]">ตำแหน่งในสายงาน</th>
                  <th class="py-3 px-4 min-w-[100px]">สายงาน</th>
                  <th class="py-3 px-4 min-w-[90px]">ตำแหน่งประเภท</th>
                  <th class="py-3 px-4 min-w-[80px]">ระดับตำแหน่ง</th>
                  <th class="py-3 px-4 min-w-[110px]">ตำแหน่งทางการบริหาร</th>
                  <th class="py-3 px-4 min-w-[100px]">ด้านทางการบริหาร</th>
                  <th class="py-3 px-4 min-w-[80px]">ด้าน/สาขา</th>
                  <th class="py-3 px-4 w-32 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
                <tr
                  v-for="(pos, index) in catalogResults"
                  :key="pos.id"
                  class="transition-colors"
                  :class="editingCatId === pos.id ? 'bg-amber-50/50' : isStaged(pos.id) ? 'bg-emerald-50/40' : 'hover:bg-slate-50/70'"
                >
                  <td class="py-2.5 px-4 text-center">
                    <button
                      v-if="!isStaged(pos.id)"
                      type="button"
                      class="inline-flex px-3 py-1.5 rounded-lg text-[11px] font-semibold text-blue-900 bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors"
                      @click="stagePosition(pos)"
                    >
                      เลือก
                    </button>
                    <span v-else class="inline-flex items-center text-[11px] font-semibold text-emerald-600">
                      <Check class="w-3.5 h-3.5 mr-0.5" />เลือกแล้ว
                    </span>
                  </td>
                  <td class="py-2.5 px-4 font-medium text-slate-500">{{ index + 1 }}</td>

                  <template v-if="editingCatId === pos.id">
                    <!-- โหมดแก้ไขข้อมูลในตารางส่วนที่ 2 -->
                    <td class="py-2 px-2"><input v-model="catDraft.jobTitle" type="text" :class="editInputClass" /></td>
                    <td class="py-2 px-2"><input v-model="catDraft.lineOfWork" type="text" :class="editInputClass" /></td>
                    <td class="py-2 px-2"><input v-model="catDraft.positionType" type="text" :class="editInputClass" /></td>
                    <td class="py-2 px-2"><input v-model="catDraft.levelLabel" type="text" :class="editInputClass" /></td>
                    <td class="py-2 px-2"><input v-model="catDraft.adminPosition" type="text" :class="editInputClass" /></td>
                    <td class="py-2 px-2"><input v-model="catDraft.adminField" type="text" :class="editInputClass" /></td>
                    <td class="py-2 px-2"><input v-model="catDraft.fieldOfWork" type="text" :class="editInputClass" /></td>
                    <td class="py-2 px-4">
                      <div class="flex items-center justify-center gap-1">
                        <UiIconButton tone="ghost" title="บันทึกการแก้ไข" @click="applyCatEdit(pos.id)">
                          <Check class="w-3.5 h-3.5 text-emerald-600" />
                        </UiIconButton>
                        <UiIconButton tone="ghost" title="ยกเลิก" @click="cancelCatEdit">
                          <X class="w-3.5 h-3.5 text-slate-400" />
                        </UiIconButton>
                      </div>
                    </td>
                  </template>
                  <template v-else>
                    <td class="py-2.5 px-4 font-semibold text-blue-950">{{ pos.jobTitle }}</td>
                    <td class="py-2.5 px-4">{{ pos.lineOfWork }}</td>
                    <td class="py-2.5 px-4">{{ pos.positionType }}</td>
                    <td class="py-2.5 px-4">{{ pos.levelLabel }}</td>
                    <td class="py-2.5 px-4">{{ pos.adminPosition || '-' }}</td>
                    <td class="py-2.5 px-4">{{ pos.adminField || '-' }}</td>
                    <td class="py-2.5 px-4">{{ pos.fieldOfWork || '-' }}</td>
                    <td class="py-2.5 px-4">
                      <div class="flex items-center justify-center gap-0.5">
                        <UiIconButton tone="ghost" title="คัดลอกแถวนี้" @click="copyCatalogRow(pos)">
                          <Copy class="w-3.5 h-3.5 text-slate-400 hover:text-blue-700" />
                        </UiIconButton>
                        <UiIconButton tone="ghost" title="แก้ไขแถวนี้" @click="editCatalogRow(pos)">
                          <Pencil class="w-3.5 h-3.5 text-slate-400 hover:text-blue-700" />
                        </UiIconButton>
                        <UiIconButton tone="ghost" title="ลบออกจากรายการ" @click="deleteCatalogRow(pos.id)">
                          <Trash2 class="w-3.5 h-3.5 text-slate-400 hover:text-red-500" />
                        </UiIconButton>
                      </div>
                    </td>
                  </template>
                </tr>
                <tr v-if="catalogResults.length === 0">
                  <td colspan="10">
                    <UiEmptyState message="ไม่พบตำแหน่งจากการค้นหา" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>

    <template #footer>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p class="inline-flex items-center gap-1.5 text-[11px] text-amber-600">
          <Info class="w-3.5 h-3.5 flex-shrink-0" />
          ตรวจสอบความถูกต้องของเลขที่ตำแหน่งก่อนกดบันทึก
        </p>
        <div class="flex items-center justify-end gap-2 flex-shrink-0">
          <UiButton variant="outline" @click="emit('close')">
            ยกเลิก
          </UiButton>
          <UiButton :disabled="staged.length === 0" @click="handleSave">
            <template #icon>
              <Save class="w-4 h-4" />
            </template>
            บันทึกตำแหน่ง{{ staged.length ? ` (${staged.length})` : '' }}
          </UiButton>
        </div>
      </div>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { Check, Copy, Info, Pencil, Plus, Save, Search, Trash2, UserPlus, X } from 'lucide-vue-next';
import {
  UiBadge,
  UiButton,
  UiCheckbox,
  UiEmptyState,
  UiIconButton,
  UiModal,
  UiSearchInput,
  UiSelect,
} from '../../ui';
import { ORG_POSITIONS } from '../../../data/organizationData';


interface StagedPosition {
  id: string;
  jobTitle: string;
  lineOfWork: string;
  positionType: string;
  levelLabel: string;
  adminPosition: string;
  adminField: string;
  fieldOfWork: string;
  academicPosition: string;
  generatedNumber?: string;
}

const props = defineProps<{
  isOpen: boolean;
  unitName: string;
  unitShort: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', payload: { positions: StagedPosition[]; note: string; isManagerial: boolean; signatureTitle: string }): void;
}>();

// อักษรย่อหน่วยงาน — ค่าเริ่มต้น สกบ. (หากหน่วยงานไม่ได้ส่งอักษรย่อมา)
const unitAbbrev = computed(() => props.unitShort?.trim() || 'สกบ.');

// --- Form state (ส่วนที่ 1)
const prefix = ref('');
const positionNumber = ref('');
const suffix = ref('');
const note = ref('');
const isManagerial = ref(false);
const signatureTitle = ref('');

// --- ตารางรายการ (ส่วนที่ 1)
const staged = ref<StagedPosition[]>([]);
const editingId = ref<string | null>(null);
const draft = reactive<StagedPosition>(emptyDraft());

function emptyDraft(): StagedPosition {
  return {
    id: '',
    jobTitle: '',
    lineOfWork: '',
    positionType: '',
    levelLabel: '',
    adminPosition: '',
    adminField: '',
    fieldOfWork: '',
    academicPosition: '',
  };
}

const editInputClass =
  'w-full min-w-[90px] text-xs px-2 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all';

// --- Catalog search (ส่วนที่ 2)
const searchField = ref('job_title');
const searchKeyword = ref('');
const searchedKeyword = ref('');

// ชุดข้อมูลตารางส่วนที่ 2 (จัดการได้ในตัวเอง: สร้าง/คัดลอก/แก้ไข/ลบ)
interface CatalogRow {
  id: string;
  jobTitle: string;
  lineOfWork: string;
  positionType: string;
  levelLabel: string;
  adminPosition: string;
  adminField: string;
  fieldOfWork: string;
  academicPosition: string;
}

const catalogRows = ref<CatalogRow[]>([]);
const editingCatId = ref<string | null>(null);
const catDraft = reactive<CatalogRow>({
  id: '',
  jobTitle: '',
  lineOfWork: '',
  positionType: '',
  levelLabel: '',
  adminPosition: '',
  adminField: '',
  fieldOfWork: '',
  academicPosition: '',
});

const searchFieldOptions = [
  { value: 'job_title', label: 'ตำแหน่งในสายงาน' },
  { value: 'line_of_work', label: 'สายงาน' },
  { value: 'position_type', label: 'ตำแหน่งประเภท' },
  { value: 'level', label: 'ระดับตำแหน่ง' },
];

// เปิด modal ใหม่ทุกครั้ง -> รีเซ็ตฟอร์ม + โฟกัสช่องค้นหา
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      prefix.value = '';
      positionNumber.value = '';
      suffix.value = '';
      note.value = '';
      isManagerial.value = false;
      signatureTitle.value = '';
      staged.value = [];
      editingId.value = null;
      // โหลดบัญชีตำแหน่งใหม่ทุกครั้งที่เปิด
      catalogRows.value = ORG_POSITIONS.map((pos) => ({
        id: pos.id,
        jobTitle: pos.jobTitle,
        lineOfWork: pos.lineOfWork,
        positionType: pos.positionType,
        levelLabel: pos.levelLabel,
        adminPosition: pos.adminPosition ?? '',
        adminField: '',
        fieldOfWork: '',
        academicPosition: pos.academicPosition ?? '',
      }));
      editingCatId.value = null;
      searchField.value = 'job_title';
      searchKeyword.value = '';
      searchedKeyword.value = '';
      nextTick(() => {
        document.getElementById('pos-catalog-search-input')?.focus();
      });
    }
  }
);

// --- สร้างเลขที่ตำแหน่งอัตโนมัติ: {prefix}-{เลขที่}-{suffix}-{ลำดับ 2 หลัก}
const buildNumber = (order: number) => {
  const parts = [
    prefix.value.trim(),
    positionNumber.value.trim(),
    suffix.value.trim(),
    String(order).padStart(2, '0'),
  ].filter(Boolean);
  return parts.length > 1 ? parts.join('-') : '';
};

const catalogResults = computed(() => {
  const q = searchedKeyword.value.trim().toLowerCase();
  if (!q) return catalogRows.value;
  return catalogRows.value.filter((pos) => {
    if (searchField.value === 'job_title') return pos.jobTitle.toLowerCase().includes(q);
    if (searchField.value === 'line_of_work') return pos.lineOfWork.toLowerCase().includes(q);
    if (searchField.value === 'position_type') return pos.positionType.toLowerCase().includes(q);
    return pos.levelLabel.toLowerCase().includes(q);
  });
});

const handleCatalogSearch = () => {
  searchedKeyword.value = searchKeyword.value;
};

const isStaged = (id: string) => staged.value.some((item) => item.id === id);

// ปุ่ม "เลือก" -> เพิ่มเข้าตารางส่วนที่ 1 ทันที
const stagePosition = (pos: CatalogRow) => {
  if (isStaged(pos.id)) return;
  staged.value.push({ ...pos });
};

// --- จัดการข้อมูลในตารางส่วนที่ 2: คัดลอก / แก้ไข / ลบ / สร้างใหม่
const copyCatalogRow = (pos: CatalogRow) => {
  const index = catalogRows.value.findIndex((row) => row.id === pos.id);
  catalogRows.value.splice(index + 1, 0, {
    ...pos,
    id: `copy-${Date.now()}`,
  });
};

const editCatalogRow = (pos: CatalogRow) => {
  editingCatId.value = pos.id;
  Object.assign(catDraft, pos);
};

const applyCatEdit = (id: string) => {
  const row = catalogRows.value.find((item) => item.id === id);
  if (row) Object.assign(row, { ...catDraft, id: row.id });
  cancelCatEdit();
};

const cancelCatEdit = () => {
  editingCatId.value = null;
  Object.assign(catDraft, {
    id: '',
    jobTitle: '',
    lineOfWork: '',
    positionType: '',
    levelLabel: '',
    adminPosition: '',
    adminField: '',
    fieldOfWork: '',
    academicPosition: '',
  });
};

const deleteCatalogRow = (id: string) => {
  if (editingCatId.value === id) cancelCatEdit();
  catalogRows.value = catalogRows.value.filter((row) => row.id !== id);
};

// "สร้างตำแหน่งใหม่" -> เพิ่มแถวใหม่ในตารางส่วนที่ 2 แล้วเข้าโหมดแก้ไขทันที
const addNewCatalogRow = () => {
  const row: CatalogRow = {
    id: `new-cat-${Date.now()}`,
    jobTitle: 'ตำแหน่งใหม่ (ระบุชื่อ)',
    lineOfWork: '-',
    positionType: '-',
    levelLabel: '-',
    adminPosition: '',
    adminField: '',
    fieldOfWork: '',
    academicPosition: '',
  };
  catalogRows.value.push(row);
  editingCatId.value = row.id;
  Object.assign(catDraft, row);
};

const removeStagedRow = (id: string) => {
  if (editingId.value === id) cancelEdit();
  staged.value = staged.value.filter((item) => item.id !== id);
};

const applyEdit = (id: string) => {
  const row = staged.value.find((item) => item.id === id);
  if (row) Object.assign(row, { ...draft, id: row.id });
  cancelEdit();
};

const cancelEdit = () => {
  editingId.value = null;
  Object.assign(draft, emptyDraft());
};

const handleSave = () => {
  if (staged.value.length === 0) return;
  emit('save', {
    positions: staged.value.map((item, index) => ({
      ...item,
      generatedNumber: buildNumber(index + 1) || undefined,
    })),
    note: note.value.trim(),
    isManagerial: isManagerial.value,
    signatureTitle: signatureTitle.value.trim(),
  });
};
</script>
