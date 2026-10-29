<template>
  <div class="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
    <PageTitle
      title="รายชื่อผู้สอบผ่าน"
      subtitle="รายการบัญชีผู้สอบผ่านจากการสอบแข่งขันและคัดเลือก สำหรับบรรจุ แต่งตั้ง ย้าย โอน"
    />

    <!-- การ์ดหลัก: ฟิลเตอร์ + ตาราง -->
    <div class="bg-white rounded-xl items-center border border-slate-200/90 shadow-sm overflow-hidden">
      <!-- Toolbar: ค้นหา + คอลัมน์ + ตัวกรอง + แสดงบัญชีหมดอายุ -->
      <div class="p-4 sm:p-5 space-y-4 border-b border-slate-200/90">
        <div class="flex flex-col lg:flex-row lg:items-center gap-3">
          <UiSearchInput
            id="placement-pass-search"
            v-model="searchQuery"
            placeholder="ระบุคำค้นหา เช่น ตำแหน่ง, รอบการสอบ, ปีงบประมาณ..."
            size="lg"
            class="flex-1 min-w-0"
          />
          <div class="flex flex-wrap items-center justify-end gap-3 shrink-0">
            <UiDropdownButton
              :label="`ครั้งที่: ${timesFilterLabel}`"
              menu-title="กรองตามครั้งที่"
              :items="timesFilterItems"
              align="left"
              @select="(item) => (timesFilter = item.value)"
            />
            <UiDropdownButton
              :label="`ประเภทการสอบ: ${typeFilterLabel}`"
              menu-title="กรองตามประเภทการสอบ"
              :items="typeFilterItems"
              align="left"
              @select="(item) => (typeFilter = item.value)"
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
                  v-for="col in columnDefs"
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

        <UiCheckbox v-model="showExpired">แสดงบัญชีหมดอายุ</UiCheckbox>

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
              <th v-if="showCol('no')" class="py-3 px-4 min-w-[70px] text-center">ลำดับ</th>
              <th v-if="showCol('position')" class="py-3 px-4 min-w-[280px]">รอบการสอบ / ตำแหน่ง</th>
              <th v-if="showCol('times')" class="py-3 px-4 min-w-[80px]">ครั้งที่</th>
              <th v-if="showCol('fiscalYear')" class="py-3 px-4 min-w-[110px]">ปีงบประมาณ</th>
              <th v-if="showCol('passCount')" class="py-3 px-4 min-w-[140px]">จำนวนผู้สอบได้</th>
              <th v-if="showCol('examType')" class="py-3 px-4 min-w-[130px]">ประเภทการสอบ</th>
              <th v-if="showCol('accountPeriod')" class="py-3 px-4 min-w-[220px]">วันที่บัญชีใช้ได้ (ตั้งแต่ - ถึง)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
            <tr
              v-for="(item, idx) in pagedRows"
              :key="item.id"
              class="hover:bg-slate-50/70 transition-colors"
              :class="idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'"
            >
              <td v-if="showCol('no')" class="py-3.5 px-4 text-center text-slate-500 tabular-nums">
                {{ filteredRows.indexOf(item) + 1 }}
              </td>
              <td v-if="showCol('position')" class="py-3.5 px-4 font-semibold text-blue-950">{{ item.position }}</td>
              <td v-if="showCol('times')" class="py-3.5 px-4 tabular-nums">ครั้งที่ {{ item.times }}</td>
              <td v-if="showCol('fiscalYear')" class="py-3.5 px-4 tabular-nums text-slate-600">{{ item.fiscalYear }}</td>
              <td v-if="showCol('passCount')" class="py-3.5 px-4">
                <UiBadge tone="blue" shape="chip" mono>{{ item.passCount }} คน</UiBadge>
              </td>
              <td v-if="showCol('examType')" class="py-3.5 px-4">
                <UiBadge :tone="item.examType === 'competitive' ? 'blue' : 'teal'" shape="chip">
                  {{ item.examType === 'competitive' ? 'สอบแข่งขัน' : 'คัดเลือกอื่นๆ' }}
                </UiBadge>
              </td>
              <td v-if="showCol('accountPeriod')" class="py-3.5 px-4">
                <div class="flex items-center gap-2">
                  <span class="tabular-nums text-slate-600">{{ item.accountStart }} - {{ item.accountEnd }}</span>
                  <UiBadge v-if="item.expired" tone="red" shape="chip">หมดอายุ</UiBadge>
                </div>
              </td>
            </tr>
            <tr v-if="pagedRows.length === 0">
              <td :colspan="columnDefs.length">
                <UiEmptyState message="ไม่พบรายชื่อผู้สอบผ่านตามเงื่อนไขที่ระบุ" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer: pagination -->
      <div class="px-4 py-2.5 border-t border-slate-100 bg-white flex items-center justify-end gap-3 text-[11px] text-slate-500">
        <div class="flex items-center gap-1.5">
          <span>แถวต่อหน้า:</span>
          <UiSelect
            v-model="pageSize"
            :options="pageSizeOptions"
            size="xs"
            fit
          />
        </div>
        <span>ทั้งหมด {{ filteredRows.length }} รายการ</span>
        <UiPagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="filteredRows.length"
          :page-size-options="[10, 20, 50]"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { SlidersHorizontal, X } from 'lucide-vue-next';
import { PageTitle } from '../common';
import {
  UiBadge,
  UiCheckbox,
  UiDropdownButton,
  UiEmptyState,
  UiPagination,
  UiSearchInput,
  UiSelect,
} from '../ui';

// --- ข้อมูลรายการบัญชีผู้สอบผ่าน (จำลอง)
interface PlacementPassRow {
  id: number;
  position: string;
  times: number;
  fiscalYear: string;
  passCount: number;
  examType: 'competitive' | 'other';
  accountStart: string;
  accountEnd: string;
  expired: boolean;
}

const rows = ref<PlacementPassRow[]>([
  { id: 1, position: 'การสอบแข่งขันเพื่อบรรจุและแต่งตั้งบุคคลเข้ารับราชการในตำแหน่งพนักงานชำระบัญชี', times: 1, fiscalYear: '2569', passCount: 25, examType: 'competitive', accountStart: '01 พ.ย. 2569', accountEnd: '31 ต.ค. 2572', expired: false },
  { id: 2, position: 'การสอบแข่งขันเพื่อบรรจุและแต่งตั้งบุคคลเข้ารับราชการตำแหน่งนักประเมินราคา', times: 1, fiscalYear: '2569', passCount: 17, examType: 'competitive', accountStart: '20 ต.ค. 2569', accountEnd: '30 ต.ค. 2571', expired: false },
  { id: 3, position: 'การสอบแข่งขันเพื่อบรรจุบุคคลเข้ารับราชการตำแหน่งนักวิชาการคอมพิวเตอร์ปฏิบัติการ', times: 1, fiscalYear: '2569', passCount: 9, examType: 'competitive', accountStart: '12 ต.ค. 2569', accountEnd: '30 ต.ค. 2571', expired: false },
  { id: 4, position: 'การสอบคัดเลือกเพื่อย้ายไปดำรงตำแหน่งนักจัดการงานทั่วไป', times: 1, fiscalYear: '2569', passCount: 16, examType: 'other', accountStart: '05 ต.ค. 2569', accountEnd: '30 ต.ค. 2570', expired: false },
  { id: 5, position: 'การสอบคัดเลือกเพื่อย้ายไปดำรงตำแหน่งนักจัดการงานโยธา', times: 1, fiscalYear: '2569', passCount: 11, examType: 'other', accountStart: '28 ก.ย. 2569', accountEnd: '30 ต.ค. 2570', expired: false },
  { id: 6, position: 'การสอบแข่งขันเพื่อบรรจุบุคคลเข้ารับราชการตำแหน่งนักวิเคราะห์นโยบายและแผน', times: 1, fiscalYear: '2569', passCount: 8, examType: 'competitive', accountStart: '15 ก.ย. 2569', accountEnd: '30 ต.ค. 2571', expired: false },
  { id: 7, position: 'การสอบคัดเลือกเพื่อย้ายไปดำรงตำแหน่งนักจัดการงานรักษาความสะอาด', times: 2, fiscalYear: '2568', passCount: 6, examType: 'other', accountStart: '10 ส.ค. 2568', accountEnd: '30 ต.ค. 2570', expired: false },
  { id: 8, position: 'การสอบแข่งขันเพื่อบรรจุบุคคลเข้ารับราชการตำแหน่งเจ้าหน้าที่ทั่วไป', times: 2, fiscalYear: '2568', passCount: 31, examType: 'competitive', accountStart: '01 มี.ค. 2568', accountEnd: '28 ก.พ. 2570', expired: false },
  { id: 9, position: 'การสอบคัดเลือกเพื่อย้ายไปดำรงตำแหน่งนักจิตวิทยา', times: 1, fiscalYear: '2568', passCount: 5, examType: 'other', accountStart: '20 ม.ค. 2568', accountEnd: '31 ธ.ค. 2569', expired: false },
  { id: 10, position: 'การสอบแข่งขันเพื่อบรรจุและแต่งตั้งบุคคลเข้ารับราชการตำแหน่งพนักงานการเงินและบัญชี', times: 1, fiscalYear: '2568', passCount: 14, examType: 'competitive', accountStart: '15 พ.ย. 2567', accountEnd: '30 พ.ย. 2569', expired: false },
  { id: 11, position: 'การสอบแข่งขันเพื่อบรรจุบุคคลเข้ารับราชการตำแหน่งนักทรัพยากรบุคคล', times: 1, fiscalYear: '2567', passCount: 7, examType: 'competitive', accountStart: '01 ส.ค. 2567', accountEnd: '31 ส.ค. 2569', expired: false },
  { id: 12, position: 'การสอบคัดเลือกเพื่อย้ายไปดำรงตำแหน่งเจ้าหน้าที่บริหารงานทั่วไป', times: 2, fiscalYear: '2567', passCount: 12, examType: 'other', accountStart: '01 ก.พ. 2567', accountEnd: '31 ม.ค. 2569', expired: true },
  { id: 13, position: 'การสอบแข่งขันเพื่อบรรจุบุคคลเข้ารับราชการตำแหน่งนักวิชาการศึกษาและมาตรฐานการศึกษา', times: 1, fiscalYear: '2567', passCount: 4, examType: 'competitive', accountStart: '15 ต.ค. 2566', accountEnd: '31 ต.ค. 2568', expired: true },
]);

// --- ค้นหา + เลือกคอลัมน์
const searchQuery = ref('');
const columnMenuOpen = ref(false);
const hiddenCols = ref<string[]>([]);
const columnDefs = [
  { key: 'no', label: 'ลำดับ' },
  { key: 'position', label: 'รอบการสอบ / ตำแหน่ง' },
  { key: 'times', label: 'ครั้งที่' },
  { key: 'fiscalYear', label: 'ปีงบประมาณ' },
  { key: 'passCount', label: 'จำนวนผู้สอบได้' },
  { key: 'examType', label: 'ประเภทการสอบ' },
  { key: 'accountPeriod', label: 'วันที่บัญชีใช้ได้' },
];

const showCol = (key: string) => !hiddenCols.value.includes(key);
const toggleColumn = (key: string) => {
  hiddenCols.value = hiddenCols.value.includes(key)
    ? hiddenCols.value.filter((k) => k !== key)
    : [...hiddenCols.value, key];
};

// --- ตัวกรอง ครั้งที่
const timesFilter = ref('all');
const timesFilterItems = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: '1', label: 'ครั้งที่ 1' },
  { value: '2', label: 'ครั้งที่ 2' },
];
const timesFilterLabel = computed(
  () => timesFilterItems.find((i) => i.value === timesFilter.value)?.label ?? 'ทั้งหมด'
);

// --- ตัวกรอง ประเภทการสอบ
const typeFilter = ref('all');
const typeFilterItems = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'competitive', label: 'สอบแข่งขัน' },
  { value: 'other', label: 'คัดเลือกอื่นๆ' },
];
const typeFilterLabel = computed(
  () => typeFilterItems.find((i) => i.value === typeFilter.value)?.label ?? 'ทั้งหมด'
);

// --- แสดงบัญชีหมดอายุ
const showExpired = ref(false);

// --- Filtering
const filteredRows = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  let list = [...rows.value];
  if (!showExpired.value) {
    list = list.filter((r) => !r.expired);
  }
  if (timesFilter.value !== 'all') {
    list = list.filter((r) => String(r.times) === timesFilter.value);
  }
  if (typeFilter.value !== 'all') {
    list = list.filter((r) => r.examType === typeFilter.value);
  }
  if (!q) return list;
  return list.filter(
    (r) =>
      r.position.toLowerCase().includes(q) ||
      r.fiscalYear.includes(q) ||
      String(r.times) === q
  );
});

// --- Active Filter Chips / clear
const hasActiveFilters = computed(
  () =>
    !!searchQuery.value.trim() ||
    timesFilter.value !== 'all' ||
    typeFilter.value !== 'all' ||
    showExpired.value
);

const activeFilterChips = computed(() => {
  const chips: { key: string; label: string; clear: () => void }[] = [];
  if (timesFilter.value !== 'all') {
    chips.push({ key: 'times', label: `ครั้งที่: ${timesFilterLabel.value}`, clear: () => (timesFilter.value = 'all') });
  }
  if (typeFilter.value !== 'all') {
    chips.push({ key: 'type', label: `ประเภทการสอบ: ${typeFilterLabel.value}`, clear: () => (typeFilter.value = 'all') });
  }
  if (showExpired.value) {
    chips.push({ key: 'expired', label: 'แสดงบัญชีหมดอายุ', clear: () => (showExpired.value = false) });
  }
  if (searchQuery.value.trim()) {
    chips.push({ key: 'q', label: `คำค้นหา: ${searchQuery.value.trim()}`, clear: () => (searchQuery.value = '') });
  }
  return chips;
});

// --- Pagination (แถวต่อหน้า)
const currentPage = ref(1);
const pageSize = ref(10);
const pageSizeOptions = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
];

const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredRows.value.slice(start, start + pageSize.value);
});

watch([searchQuery, timesFilter, typeFilter, showExpired, pageSize], () => {
  currentPage.value = 1;
});
</script>
