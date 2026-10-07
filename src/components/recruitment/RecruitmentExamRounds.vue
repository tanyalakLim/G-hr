<template>
  <div class="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
    <PageTitle
      title="จัดการรอบสอบแข่งขัน"
      subtitle="สร้างและจัดการรอบการสอบแข่งขันเพื่อบรรจุและแต่งตั้งบุคคลเข้ารับราชการ"
    />

    <!-- การ์ดหลัก: ฟิลเตอร์ + ตาราง (โครงเดียวกับหน้ารายการคำสั่ง) -->
    <div class="bg-white rounded-xl items-center border border-slate-200/90 shadow-sm overflow-hidden">
      <!-- Toolbar: ฟิลเตอร์ -->
      <div class="p-4 sm:p-5 space-y-4 border-b border-slate-200/90">
        <!-- แถว: เพิ่มรอบสอบ + คำค้นหา + เลือกคอลัมน์ + ล้างตัวกรอง -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
          <div class="lg:col-span-2 flex items-center gap-2.5">
            <UiButton id="btn-add-exam-round" size="md" class="whitespace-nowrap shrink-0" @click="router.push('/recruitment/recruitment_exam_round/new')">
              <template #icon>
                <Plus class="w-4 h-4" />
              </template>
              เพิ่มรอบสอบ
            </UiButton>
            
          </div>
          <div class="flex items-center justify-end gap-3 lg:col-span-2 relative">
            <UiSearchInput
              id="exam-round-search-input"
              v-model="searchQuery"
              placeholder="ระบุคำค้นหา เช่น ชื่อรอบสอบแข่งขัน, ครั้งที่, ปีงบประมาณ..."
              size="lg"
              class="flex-1 min-w-0"
            />
            <div class="relative">
              <button
                type="button"
                class="h-9 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                @click="columnMenuOpen = !columnMenuOpen"
              >
                <SlidersHorizontal class="w-3.5 h-3.5 text-slate-500" />
                <span>คอลัมน์</span>
              </button>
              <div
                v-if="columnMenuOpen"
                class="absolute right-0 top-10 z-20 w-56 rounded-xl border border-slate-200 bg-white shadow-lg p-3 space-y-2"
              >
                <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">แสดงคอลัมน์</p>
                <label
                  v-for="col in togglableColumns"
                  :key="col.key"
                  class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    class="rounded border-slate-300 text-blue-700 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                    :checked="!hiddenCols.includes(col.key)"
                    @change="toggleColumn(col.key)"
                  />
                  {{ col.label }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Filter Chips -->
        <div
          v-if="hasActiveFilters"
          class="pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs"
        >
          <span class="text-slate-400 text-[11px] font-medium">เงื่อนไขที่เลือก:</span>
          <span
            v-for="chip in activeFilterChips"
            :key="chip.key"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50/90 text-blue-900 border border-blue-200 text-xs font-medium"
          >
            <span>{{ chip.label }}</span>
            <button type="button" class="hover:text-red-600 transition-colors cursor-pointer" @click="chip.clear">
              <X class="w-3.5 h-3.5" />
            </button>
          </span>
        </div>
      </div>

      <!-- ตารางรายการ -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-100/90 border-b border-slate-200/90 text-xs font-semibold text-slate-700 select-none">
              <th class="py-3 px-4 w-[1%]"></th>
              <th v-if="showCol('no')" class="py-3 px-4 min-w-[70px] text-center">ลำดับ</th>
              <th v-if="showCol('name')" class="py-3 px-4 min-w-[280px]">รอบสอบแข่งขัน</th>
              <th v-if="showCol('times')" class="py-3 px-4 min-w-[90px]">ครั้งที่</th>
              <th v-if="showCol('fiscalYear')" class="py-3 px-4 min-w-[110px]">ปีงบประมาณ</th>
              <th v-if="showCol('applicants')" class="py-3 px-4 min-w-[200px]">ข้อมูลผู้สมัครสอบ</th>
              <th v-if="showCol('score')" class="py-3 px-4 min-w-[190px]">บัญชีรวมคะแนน</th>
              <th v-if="showCol('result')" class="py-3 px-4 min-w-[190px]">ผลการสอบ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
            <tr
              v-for="item in pagedRounds"
              :key="item.id"
              class="hover:bg-slate-50/70 transition-colors"
              :class="pagedRounds.indexOf(item) % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'"
            >
              <td class="py-3 px-4">
                <UiDropdownButton
                  icon-only
                  variant="ghost"
                  size="xs"
                  menu-title="ตัวเลือกเพิ่มเติม"
                  :items="rowMenuItems"
                  @select="(action) => handleRowMenu(action.value, item)"
                >
                  <template #icon>
                    <MoreVertical class="w-4 h-4" />
                  </template>
                </UiDropdownButton>
              </td>
              <td v-if="showCol('no')" class="py-3.5 px-4 text-center text-slate-500 tabular-nums">
                {{ filteredRounds.indexOf(item) + 1 }}
              </td>
              <td v-if="showCol('name')" class="py-3.5 px-4 font-semibold text-blue-950">{{ item.name }}</td>
              <td v-if="showCol('times')" class="py-3.5 px-4 tabular-nums">ครั้งที่ {{ item.times }}</td>
              <td v-if="showCol('fiscalYear')" class="py-3.5 px-4 tabular-nums text-slate-600">{{ item.fiscalYear }}</td>
              <td v-if="showCol('applicants')" class="py-3.5 px-4">
                <div class="flex items-center gap-1.5">
                  <UiBadge tone="blue" shape="chip" mono>{{ item.applicants }} คน</UiBadge>
                  <UiIconButton tone="ghost" title="ส่งออกข้อมูลผู้สมัครสอบ (Excel)" @click="exportApplicants(item)">
                    <FileSpreadsheet class="w-4 h-4 text-emerald-600" />
                  </UiIconButton>
                  <UiIconButton tone="ghost" title="ดาวน์โหลดข้อมูลผู้สมัครสอบ" @click="downloadApplicants(item)">
                    <Download class="w-4 h-4 text-slate-500" />
                  </UiIconButton>
                </div>
              </td>
              <td v-if="showCol('score')" class="py-3.5 px-4">
                <div class="flex items-center gap-1.5">
                  <span class="tabular-nums">{{ item.scoreAccounts }} บัญชี</span>
                  <UiBadge :tone="item.scoreStatus === 'done' ? 'emerald' : 'amber'" shape="chip">
                    {{ item.scoreStatus === 'done' ? 'ครบถ้วน' : 'รอดำเนินการ' }}
                  </UiBadge>
                </div>
              </td>
              <td v-if="showCol('result')" class="py-3.5 px-4">
                <div class="flex items-center gap-1.5">
                  <span class="tabular-nums">{{ item.resultCount }} ตำแหน่ง</span>
                  <UiBadge :tone="item.resultStatus === 'announced' ? 'emerald' : 'slate'" shape="chip">
                    {{ item.resultStatus === 'announced' ? 'ประกาศผลแล้ว' : 'ยังไม่ประกาศผล' }}
                  </UiBadge>
                </div>
              </td>
            </tr>
            <tr v-if="pagedRounds.length === 0">
              <td :colspan="8">
                <UiEmptyState message="ไม่พบรอบสอบแข่งขันตามเงื่อนไขที่ระบุ" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer: pagination -->
      <div class="px-4 py-2.5 border-t border-slate-100 bg-white flex items-center justify-end gap-3 text-[11px] text-slate-500">
        <div class="flex items-center gap-1.5">
          <span>แสดงต่อหน้า:</span>
          <UiSelect
            v-model="pageSize"
            :options="pageSizeOptions"
            size="xs"
            fit
          />
        </div>
        <span>ทั้งหมด {{ filteredRounds.length }} รายการ</span>
        <UiPagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="filteredRounds.length"
          :page-size-options="[10, 20, 50]"
        />
      </div>
    </div>

    <!-- Modal: เพิ่ม/แก้ไขรอบสอบ -->
    <UiModal
      :is-open="modalOpen"
      :title="editingRound ? 'แก้ไขรอบสอบแข่งขัน' : 'เพิ่มรอบสอบแข่งขัน'"
      subtitle="ระบุชื่อรอบ ครั้งที่ และปีงบประมาณของการสอบแข่งขัน"
      max-width="max-w-xl"
      @close="closeModal"
    >
      <template #icon>
        <Plus class="w-5 h-5 text-blue-900" />
      </template>

      <div class="space-y-3.5 text-xs">
        <div class="space-y-1">
          <label class="block font-medium text-slate-700">ชื่อรอบสอบแข่งขัน <span class="text-rose-500">*</span></label>
          <UiInput
            id="exam-round-name"
            v-model="roundForm.name"
            size="lg"
            placeholder="เช่น การสอบแข่งขันเพื่อบรรจุและแต่งตั้งบุคคลเข้ารับราชการ..."
          />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="block font-medium text-slate-700">ครั้งที่ <span class="text-rose-500">*</span></label>
            <UiInput id="exam-round-times" v-model="roundForm.times" size="lg" type="number" min="1" placeholder="1" />
          </div>
          <div class="space-y-1">
            <label class="block font-medium text-slate-700">ปีงบประมาณ <span class="text-rose-500">*</span></label>
            <div class="relative">
              <UiSelect
                id="exam-round-fiscal-year"
                v-model="roundForm.fiscalYear"
                :options="fiscalYearOptions"
                size="lg"
                select-class="pl-8"
              />
              <CalendarDays class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
            @click="closeModal"
          >
            ยกเลิก
          </button>
          <UiButton size="md" @click="saveRound">
            <template #icon>
              <Check class="w-4 h-4" />
            </template>
            บันทึก
          </UiButton>
        </div>
      </template>
    </UiModal>

    <!-- Modal ยืนยันการลบ -->
    <UiModal
      :is-open="!!deleteTarget"
      title="ยืนยันการลบข้อมูล"
      :subtitle="`ต้องการลบรอบสอบ '${deleteTarget?.name ?? ''}' หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`"
      max-width="max-w-md"
      @close="deleteTarget = null"
    >
      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton variant="outline" @click="deleteTarget = null">ยกเลิก</UiButton>
          <UiButton class="bg-red-600! hover:bg-red-700! border-red-600!" @click="confirmDelete">ลบข้อมูล</UiButton>
        </div>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  CalendarDays,
  Check,
  Download,
  Eye,
  FileSpreadsheet,
  History,
  MoreVertical,
  Pencil,
  Plus,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-vue-next';
import { PageTitle } from '../common';
import {
  UiBadge,
  UiButton,
  UiDropdownButton,
  UiEmptyState,
  UiIconButton,
  UiInput,
  UiModal,
  UiPagination,
  UiSearchInput,
  UiSelect,
} from '../ui';
import { useToast } from '../../composables/useToast';

const { show } = useToast();
const router = useRouter();

// --- Filters
const searchQuery = ref('');

const fiscalYearOptions = [
  { value: '2569', label: 'ปี พ.ศ. 2569' },
  { value: '2568', label: 'ปี พ.ศ. 2568' },
  { value: '2567', label: 'ปี พ.ศ. 2567' },
];

// --- ข้อมูลรอบสอบแข่งขันจำลอง
interface ExamRound {
  id: number;
  name: string;
  times: number;
  fiscalYear: string;
  applicants: number;
  scoreAccounts: number;
  scoreStatus: 'done' | 'pending';
  resultCount: number;
  resultStatus: 'announced' | 'unannounced';
}

const rounds = ref<ExamRound[]>([
  {
    id: 1,
    name: 'การสอบแข่งขันเพื่อบรรจุและแต่งตั้งบุคคลเข้ารับราชการตำแหน่งนักประเมินราคา',
    times: 1,
    fiscalYear: '2569',
    applicants: 128,
    scoreAccounts: 3,
    scoreStatus: 'done',
    resultCount: 2,
    resultStatus: 'announced',
  },
  {
    id: 2,
    name: 'การสอบแข่งขันเพื่อบรรจุบุคคลเข้ารับราชการตำแหน่งนักวิเคราะห์นโยบายและแผน',
    times: 1,
    fiscalYear: '2569',
    applicants: 96,
    scoreAccounts: 2,
    scoreStatus: 'done',
    resultCount: 1,
    resultStatus: 'unannounced',
  },
  {
    id: 3,
    name: 'การสอบแข่งขันเพื่อบรรจุบุคคลเข้ารับราชการตำแหน่งเจ้าหน้าที่ทั่วไป',
    times: 2,
    fiscalYear: '2568',
    applicants: 340,
    scoreAccounts: 1,
    scoreStatus: 'pending',
    resultCount: 4,
    resultStatus: 'unannounced',
  },
]);

// --- เลือกคอลัมน์
const columnMenuOpen = ref(false);
const hiddenCols = ref<string[]>([]);
const columnDefs = [
  { key: 'no', label: 'ลำดับ' },
  { key: 'name', label: 'รอบสอบแข่งขัน' },
  { key: 'times', label: 'ครั้งที่' },
  { key: 'fiscalYear', label: 'ปีงบประมาณ' },
  { key: 'applicants', label: 'ข้อมูลผู้สมัครสอบ' },
  { key: 'score', label: 'บัญชีรวมคะแนน' },
  { key: 'result', label: 'ผลการสอบ' },
];
const togglableColumns = columnDefs;

const showCol = (key: string) => !hiddenCols.value.includes(key);
const toggleColumn = (key: string) => {
  hiddenCols.value = hiddenCols.value.includes(key)
    ? hiddenCols.value.filter((k) => k !== key)
    : [...hiddenCols.value, key];
};

// --- เมนู ⋮ รายแถว
const rowMenuItems = [
  { value: 'detail', label: 'รายละเอียด', icon: Eye },
  { value: 'edit', label: 'แก้ไขข้อมูล', icon: Pencil },
  { value: 'delete', label: 'ลบข้อมูล', icon: Trash2 },
  { value: 'history', label: 'แสดงประวัติการนำเข้าข้อมูล', icon: History },
];

const handleRowMenu = (action: string, item: ExamRound) => {
  if (action === 'edit') {
    openModal(item);
    return;
  }
  if (action === 'delete') {
    deleteTarget.value = item;
    return;
  }
  if (action === 'detail') {
    show(`เปิดดูรายละเอียด "${item.name.slice(0, 40)}..." (ยังไม่เปิดใช้งาน)`);
    return;
  }
  show(`ประวัติการนำเข้าข้อมูลของ "${item.name.slice(0, 40)}..." (ยังไม่เปิดใช้งาน)`);
};

// --- ส่งออก / ดาวน์โหลดข้อมูลผู้สมัคร
const exportApplicants = (row: ExamRound) =>
  show(`ส่งออกข้อมูลผู้สมัครสอบ (${row.applicants} คน) เป็น Excel แล้ว`);
const downloadApplicants = (row: ExamRound) =>
  show(`กำลังดาวน์โหลดข้อมูลผู้สมัครสอบของ "${row.name.slice(0, 40)}..."`);

// --- Modal เพิ่ม/แก้ไขรอบสอบ
const modalOpen = ref(false);
const editingRound = ref<ExamRound | null>(null);
const roundForm = ref({ name: '', times: '', fiscalYear: '2569' });

const openModal = (round?: ExamRound) => {
  editingRound.value = round ?? null;
  roundForm.value = round
    ? { name: round.name, times: String(round.times), fiscalYear: round.fiscalYear }
    : { name: '', times: '', fiscalYear: '2569' };
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
  editingRound.value = null;
};

const saveRound = () => {
  const name = roundForm.value.name.trim();
  const times = Number(roundForm.value.times);
  const fiscalYearVal = roundForm.value.fiscalYear;
  if (!name || !times || !fiscalYearVal) {
    show('กรุณากรอกชื่อรอบ ครั้งที่ และปีงบประมาณให้ครบถ้วน');
    return;
  }
  if (editingRound.value) {
    const target = rounds.value.find((r) => r.id === editingRound.value!.id);
    if (target) Object.assign(target, { name, times, fiscalYear: fiscalYearVal });
    show('แก้ไขรอบสอบแข่งขันเรียบร้อยแล้ว');
  } else {
    rounds.value.push({
      id: Date.now(),
      name,
      times,
      fiscalYear: fiscalYearVal,
      applicants: 0,
      scoreAccounts: 0,
      scoreStatus: 'pending',
      resultCount: 0,
      resultStatus: 'unannounced',
    });
    show(`เพิ่มรอบสอบ "${name.slice(0, 40)}..." เรียบร้อยแล้ว`);
  }
  closeModal();
};

// --- ลบรอบสอบ
const deleteTarget = ref<ExamRound | null>(null);
const confirmDelete = () => {
  if (!deleteTarget.value) return;
  rounds.value = rounds.value.filter((r) => r.id !== deleteTarget.value!.id);
  show(`ลบรอบสอบ "${deleteTarget.value.name.slice(0, 40)}..." แล้ว`);
  deleteTarget.value = null;
};

// --- Filtering
const filteredRounds = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return [...rounds.value];
  return rounds.value.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.fiscalYear.includes(q) ||
      String(r.times) === q
  );
});

// --- Active filter chips / clear
const hasActiveFilters = computed(() => !!searchQuery.value.trim());

const activeFilterChips = computed(() => {
  const chips: { key: string; label: string; clear: () => void }[] = [];
  if (searchQuery.value.trim())
    chips.push({ key: 'q', label: `คำค้นหา: ${searchQuery.value.trim()}`, clear: () => (searchQuery.value = '') });
  return chips;
});

// --- Pagination
const currentPage = ref(1);
const pageSize = ref(10);
const pageSizeOptions = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
];

const pagedRounds = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredRounds.value.slice(start, start + pageSize.value);
});

watch([searchQuery, pageSize], () => {
  currentPage.value = 1;
});
</script>
