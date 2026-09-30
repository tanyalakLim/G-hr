<template>
  <div class="flex flex-col min-h-full w-full">
    <!-- Header -->
    <PageActionBar
      back-label="ย้อนกลับ"
      back-title="กลับไปหน้ารายการประวัติแก้ไข/เงินเดือน"
      badge="รายการประวัติแก้ไข/เงินเดือน"
      @back="$emit('back')"
    />

    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-4">
      <!-- โปรไฟล์ + ข้อมูลตำแหน่ง (สไตล์เดียวกับหน้ารายละเอียดทะเบียนประวัติ) -->
      <section class="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <!-- ส่วนหัวโปรไฟล์ -->
          <div class="h-1.5 bg-[#003380]" />
        <div class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-4 min-w-0">
            <div class="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
              <UserRound class="w-8 h-8 text-slate-400" />
            </div>

            <div class="space-y-1.5 min-w-0">
              <h3 class="text-base sm:text-xl font-bold text-slate-900 tracking-tight truncate">{{ row.fullName }}</h3>
              <div class="flex flex-wrap items-center gap-2 pt-0.5">
                <span class="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                  เลขที่ตำแหน่ง: <strong class="text-slate-900">{{ row.positionNumber }}</strong>
                </span>
                <span class="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                  เลขประจำตัวประชาชน: <strong class="text-slate-900">{{ row.citizenId }}</strong>
                </span>
              </div>
            </div>
          </div>

          <!-- สถานะการแก้ไข (ขวา) -->
          <div class="flex flex-col md:items-end gap-1.5 self-start md:self-center shrink-0">
            <span class="text-[11px] font-medium text-slate-400">สถานะการแก้ไข</span>
            <UiBadge :tone="editStatusTones[row.editStatus]" size="sm" class="shadow-2xs">
              <span
                class="w-2 h-2 rounded-full mr-1"
                :class="row.editStatus === 'แก้ไขแล้ว' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'"
              />
              <span>{{ row.editStatus }}</span>
            </UiBadge>
          </div>
        </div>

        <!-- 4-Column Quick Overview Metrics -->
        <div class="border-t border-slate-100 bg-slate-50/40 p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <!-- 1. ตำแหน่งในสายงาน -->
          <div class="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div class="flex items-center gap-2 text-xs mb-1.5">
              <Briefcase class="w-3.5 h-3.5 text-bma-700" />
              <span class="font-medium text-slate-500 text-[11px]">ตำแหน่งในสายงาน</span>
            </div>
            <div>
              <div class="font-bold text-xs sm:text-sm text-slate-900">{{ row.jobTitle }}</div>
              <div class="text-[11px] text-slate-500 mt-0.5">ตำแหน่งในสายงานปัจจุบัน</div>
            </div>
          </div>

          <!-- 2. ตำแหน่งประเภท / ระดับ -->
          <div class="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div class="flex items-center gap-2 text-xs mb-1.5">
              <UserCheck class="w-3.5 h-3.5 text-bma-700" />
              <span class="font-medium text-slate-500 text-[11px]">ตำแหน่งประเภท / ระดับ</span>
            </div>
            <div>
              <div class="font-bold text-xs sm:text-sm text-slate-900">{{ row.positionType }} / {{ row.level }}</div>
              <div class="text-[11px] text-slate-500 mt-0.5">ประเภทและระดับตำแหน่ง</div>
            </div>
          </div>

          <!-- 3. สังกัด / หน่วยงาน -->
          <div class="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div class="flex items-center gap-2 text-xs mb-1.5">
              <Building2 class="w-3.5 h-3.5 text-bma-700" />
              <span class="font-medium text-slate-500 text-[11px]">สังกัด / หน่วยงาน</span>
            </div>
            <div>
              <div class="font-bold text-xs sm:text-sm text-slate-900 truncate" :title="row.department">{{ row.department }}</div>
              <div class="text-[11px] text-slate-500 mt-0.5">หน่วยงานที่สังกัด</div>
            </div>
          </div>

          <!-- 4. สถานะการแก้ไขล่าสุด -->
          <div class="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
            <div class="flex items-center gap-2 text-xs mb-1.5">
              <ClipboardCheck class="w-3.5 h-3.5 text-bma-700" />
              <span class="font-medium text-slate-500 text-[11px]">สถานะการแก้ไขล่าสุด</span>
            </div>
            <div>
              <div class="font-bold text-xs sm:text-sm text-slate-900">{{ row.editStatus }}</div>
              <div class="text-[11px] text-slate-500 mt-0.5">อัปเดตจากขั้นตอนล่าสุด</div>
            </div>
          </div>
        </div>
      </section>

      <!-- การ์ดประวัติ: Tabs + Toolbar แถวเดียว + ตาราง -->
      <div class="rounded-xl border border-slate-200/90 bg-white overflow-hidden">
        <!-- Tabs + Toolbar -->
        <div class="p-3 border-b border-slate-200/90 flex flex-col xl:flex-row xl:items-center justify-between gap-2">
          <div class="flex items-center gap-2.5">
            <UiToggleGroup v-model="activeTab" :items="toggleItems" size="md" />
            <span class="text-[11px] text-slate-400">{{ activeTabCount }} รายการ</span>
          </div>
          <div class="flex items-center gap-2 px-2 pb-2 xl:pb-0">
            <UiDropdownButton
              icon-only
              variant="outline"
              size="xs"
              menu-title="ดาวน์โหลดรายการ"
              :items="downloadMenuItems"
              @select="(item) => show(`กำลังเตรียมดาวน์โหลด: ${item.label}`)"
            >
              <template #icon>
                <Download class="w-4 h-4" />
              </template>
            </UiDropdownButton>
            <UiSearchInput
              id="history-search-input"
              v-model="searchQuery"
              placeholder="ค้นหา"
              class="w-full sm:w-52"
            />
            <div class="w-full sm:w-36">
              <UiSelect
                id="history-sort-select"
                v-model="sortBy"
                :options="sortOptions"
                select-class="bg-slate-50 border-slate-200 focus:ring-0 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <!-- ตารางประวัติแก้ไข/เงินเดือน -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="sticky top-0 z-10">
              <tr class="bg-slate-50/95 backdrop-blur border-b border-slate-200/90 text-[11px] font-semibold text-slate-600 select-none whitespace-nowrap">
                <th class="py-2.5 px-4 w-14 text-center">ลำดับ</th>
                <th class="py-2.5 px-4 min-w-[110px]">วันที่คำสั่งบันทึก</th>
                <th class="py-2.5 px-4 min-w-[140px]">ตำแหน่งในสายงาน</th>
                <th class="py-2.5 px-4 min-w-[110px]">ตำแหน่งประเภท</th>
                <th class="py-2.5 px-4 min-w-[100px]">ระดับ</th>
                <th class="py-2.5 px-4 min-w-[150px]">ตำแหน่งทางการบริหาร</th>
                <th class="py-2.5 px-4 min-w-[140px]">ด้านทางการบริหาร</th>
                <th class="py-2.5 px-4 min-w-[100px]">เงินเดือน</th>
                <th class="py-2.5 px-4 min-w-[150px]">เงินค่าตอบแทนอื่น ๆ</th>
                <th class="py-2.5 px-4 min-w-[150px]">ชื่อประจำตำแหน่ง</th>
                <th class="py-2.5 px-4 min-w-[180px]">สังกัด</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
              <tr v-for="(h, index) in pagedHistory" :key="h.id" class="hover:bg-slate-50/70 transition-colors">
                <td class="py-3 px-4 text-center text-slate-500">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td class="py-3 px-4 font-medium text-slate-800 whitespace-nowrap">{{ h.orderDate }}</td>
                <td class="py-3 px-4">{{ h.jobTitle }}</td>
                <td class="py-3 px-4">{{ h.positionType }}</td>
                <td class="py-3 px-4">{{ h.level }}</td>
                <td class="py-3 px-4">{{ h.adminPosition || '-' }}</td>
                <td class="py-3 px-4">{{ h.adminField || '-' }}</td>
                <td class="py-3 px-4 font-mono font-semibold text-slate-900">{{ h.salary || '-' }}</td>
                <td class="py-3 px-4 font-mono">{{ h.otherCompensation || '-' }}</td>
                <td class="py-3 px-4">{{ h.positionName || '-' }}</td>
                <td class="py-3 px-4 text-slate-600">{{ row.department }}</td>
              </tr>
              <tr v-if="pagedHistory.length === 0">
                <td colspan="11">
                  <UiEmptyState message="ไม่พบรายการแก้ไข/เงินเดือน" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer: pagination -->
        <div class="px-4 py-2.5 border-t border-slate-100 bg-white flex items-center justify-end gap-3 text-[11px] text-slate-500">
          <div class="flex items-center gap-1.5">
            <span>แสดงต่อหน้า:</span>
            <UiSelect v-model="pageSize" :options="pageSizeOptions" size="xs" fit />
          </div>
          <span>ทั้งหมด {{ filteredHistory.length }} รายการ</span>
          <UiPagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="filteredHistory.length"
            :page-size-options="[10, 20, 50]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Briefcase, Building2, ClipboardCheck, Download, UserCheck, UserRound } from 'lucide-vue-next';
import { PageActionBar, UiBadge, UiDropdownButton, UiEmptyState, UiPagination, UiSearchInput, UiSelect, UiToggleGroup } from '../ui';
import { useToast } from '../../composables/useToast';
import type { RegistryRow } from '../../data/registryRows';
const { show } = useToast();


interface HistoryRow {
  id: string;
  orderDate: string;
  jobTitle: string;
  positionType: string;
  level: string;
  adminPosition?: string;
  adminField?: string;
  salary?: string;
  otherCompensation?: string;
  positionName?: string;
  done: boolean;
}

const props = defineProps<{
  row: RegistryRow;
}>();

const editStatusTones: Record<string, 'amber' | 'emerald' | 'blue'> = {
  'ยังไม่ได้แก้ไข': 'amber',
  'แก้ไขแล้ว': 'emerald',
  'ตรวจสอบแล้ว': 'blue',
};

const emit = defineEmits<{
  (e: 'back'): void;
}>();

// --- Tabs
const activeTab = ref('in_progress');

const toggleItems = [
  { value: 'in_progress', label: 'กำลังดำเนินการแก้ไข', dotTone: 'bg-amber-500' },
  { value: 'done', label: 'ดำเนินการแก้ไขแล้ว', dotTone: 'bg-emerald-500' },
];

// --- Toolbar
const searchQuery = ref('');
const searchedQuery = ref('');
const sortBy = ref('latest');

const sortOptions = [
  { value: 'latest', label: 'ล่าสุด' },
  { value: 'oldest', label: 'เก่าสุด' },
];

const downloadMenuItems = [
  { value: 'excel', label: 'Excel (.xlsx)' },
  { value: 'csv', label: 'CSV (.csv)' },
  { value: 'pdf', label: 'PDF (.pdf)' },
];

// --- Mock ประวัติการแก้ไข (2 รายการตามหน้าจอ)
const history = ref<HistoryRow[]>([
  {
    id: 'h-1',
    orderDate: '17 ก.ย. 2569',
    jobTitle: 'กัดฝ่ายช่าง',
    positionType: 'วิชาการ',
    level: 'ทรงคุณวุฒิ',
    adminPosition: 'หัวหน้ากลุ่มงาน',
    adminField: '',
    salary: '85,600',
    otherCompensation: '',
    positionName: '',
    done: false,
  },
  {
    id: 'h-2',
    orderDate: '01 ก.ย. 2569',
    jobTitle: 'กัดฝ่ายช่าง',
    positionType: 'วิชาการ',
    level: 'ทรงคุณวุฒิ',
    adminPosition: 'หัวหน้ากลุ่มงาน',
    adminField: '',
    salary: '',
    otherCompensation: '',
    positionName: '',
    done: true,
  },
]);

// --- Filtering
const filteredHistory = computed(() => {
  let result = history.value.filter((h) =>
    activeTab.value === 'done' ? h.done : !h.done
  );

  const q = searchedQuery.value.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (h) =>
        h.orderDate.toLowerCase().includes(q) ||
        h.jobTitle.toLowerCase().includes(q) ||
        (h.salary ?? '').includes(q)
    );
  }

  if (sortBy.value === 'oldest') result.reverse();
  return result;
});

watch(searchQuery, () => {
  searchedQuery.value = searchQuery.value;
});

// --- Pagination
const currentPage = ref(1);
const pageSize = ref(10);
const pageSizeOptions = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
];

const activeTabCount = computed(
  () => history.value.filter((h) => (activeTab.value === 'done' ? h.done : !h.done)).length
);

const pagedHistory = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredHistory.value.slice(start, start + pageSize.value);
});

watch([activeTab, searchedQuery, pageSize], () => {
  currentPage.value = 1;
});
</script>
