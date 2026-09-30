<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4">
    <!-- Page Title -->
    <PageTitle
      title="แก้ไขทะเบียนประวัติ ตำแหน่ง/เงินเดือน"
      subtitle="ค้นหาและแก้ไขข้อมูลตำแหน่งและเงินเดือนของบุคลากรตามหน่วยงานสังกัด"
    />

    <!-- การ์ดหลัก: ฟิลเตอร์ + ตาราง -->
    <div class="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      <!-- Toolbar: ฟิลเตอร์ (สไตล์การ์ดค้นหาแบบทะเบียนประวัติ) -->
      <div class="p-4 sm:p-5 space-y-4 border-b border-slate-200/90">
        <!-- แถว 1: หน่วยงาน + ประเภทตำแหน่ง + สถานะ -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <label class="block text-[11px] font-medium text-slate-500 mb-1">หน่วยงาน</label>
            <UiSelect
              id="registry-edit-unit-select"
              v-model="selectedUnit"
              :options="unitOptions"
              size="lg"
              select-class="bg-slate-50 border-slate-200 focus:ring-0 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-slate-500 mb-1">ประเภทตำแหน่ง</label>
            <UiSelect
              id="registry-edit-position-type-select"
              v-model="selectedPositionType"
              :options="positionTypeOptions"
              size="lg"
              select-class="bg-slate-50 border-slate-200 focus:ring-0 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-slate-500 mb-1">สถานะ</label>
            <UiSelect
              id="registry-edit-status-select"
              v-model="selectedStatus"
              :options="statusFilterOptions"
              size="lg"
              select-class="bg-slate-50 border-slate-200 focus:ring-0 focus:border-blue-500"
            />
          </div>
        </div>

        <!-- แถว 2: คำค้นหา + ลำดับ + ล้างตัวกรอง -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end pt-3 border-t border-slate-100">
          <div class="lg:col-span-2">
            <UiSearchInput
              id="registry-edit-search-input"
              v-model="searchQuery"
              placeholder="ระบุคำค้นหา เช่น เลขที่ตำแหน่ง, ชื่อ-นามสกุล, เลขประจำตัวประชาชน..."
              size="lg"
            />
          </div>
          <div>
            <UiSelect
              id="registry-edit-sort-select"
              v-model="sortBy"
              :options="sortOptions"
              size="lg"
              select-class="bg-slate-50 border-slate-200 focus:ring-0 focus:border-blue-500"
            />
          </div>
          <div class="flex items-center justify-end gap-2 pb-1">
            <button
              type="button"
              class="text-xs text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
              @click="handleClearFilters"
            >
              ล้างตัวกรอง
            </button>
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
              <th class="py-3 px-4 min-w-[110px]">เลขที่ตำแหน่ง</th>
              <th class="py-3 px-4 min-w-[150px]">เลขประจำตัวประชาชน</th>
              <th class="py-3 px-4 min-w-[170px]">ชื่อ-นามสกุล</th>
              <th class="py-3 px-4 min-w-[150px]">ตำแหน่งในสายงาน</th>
              <th class="py-3 px-4 min-w-[110px]">ตำแหน่งประเภท</th>
              <th class="py-3 px-4 min-w-[110px]">ระดับ</th>
              <th class="py-3 px-4 min-w-[180px]">สังกัด</th>
              <th class="py-3 px-4 min-w-[130px]">สถานะ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
            <tr
              v-for="row in pagedRows"
              :key="row.citizenId"
              class="hover:bg-slate-50/70 transition-colors cursor-pointer"
              @click="openDetail(row)"
            >
              <td class="py-3.5 px-4">
                <UiBadge tone="outline" shape="chip" mono>{{ row.positionNumber }}</UiBadge>
              </td>
              <td class="py-3.5 px-4 font-mono text-slate-600">{{ row.citizenId }}</td>
              <td class="py-3.5 px-4 font-semibold text-blue-950">{{ row.fullName }}</td>
              <td class="py-3.5 px-4">{{ row.jobTitle }}</td>
              <td class="py-3.5 px-4">{{ row.positionType }}</td>
              <td class="py-3.5 px-4">{{ row.level }}</td>
              <td class="py-3.5 px-4 text-slate-600">{{ row.department }}</td>
              <td class="py-3.5 px-4">
                <UiBadge :tone="editStatusTones[row.editStatus]" shape="chip">{{ row.editStatus }}</UiBadge>
              </td>
            </tr>
            <tr v-if="pagedRows.length === 0">
              <td colspan="8">
                <UiEmptyState message="ไม่พบข้อมูลตำแหน่งตามเงื่อนไขที่ระบุ" />
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
import { useRouter } from 'vue-router';
import { X } from 'lucide-vue-next';
import { PageTitle } from '../components/common';
import { UiBadge, UiEmptyState, UiPagination, UiSearchInput, UiSelect } from '../components/ui';
import { registryRows, type RegistryRow } from '../data/registryRows';

const router = useRouter();

const openDetail = (row: RegistryRow) => {
  router.push({ name: 'edit-records-detail', params: { citizenId: row.citizenId } });
};

// --- Filters
const selectedUnit = ref('สำนักการระบายน้ำ');
const selectedPositionType = ref('ข้าราชการ กทม.สามัญ');
const selectedStatus = ref('all');
const searchQuery = ref('');
const searchedQuery = ref('');
const sortBy = ref('latest');

const unitOptions = [
  { value: 'สำนักการระบายน้ำ', label: 'สำนักการระบายน้ำ' },
  { value: 'สำนักงานบริหารราชการ', label: 'สำนักงานบริหารราชการ' },
  { value: 'สำนักปลัดกรุงเทพมหานคร', label: 'สำนักปลัดกรุงเทพมหานคร' },
];

const positionTypeOptions = [
  { value: 'ข้าราชการ กทม.สามัญ', label: 'ข้าราชการ กทม.สามัญ' },
  { value: 'ลูกจ้างประจำ', label: 'ลูกจ้างประจำ' },
  { value: 'ลูกจ้างชั่วคราว', label: 'ลูกจ้างชั่วคราว' },
];

const statusFilterOptions = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'ยังไม่ได้แก้ไข', label: 'ยังไม่ได้แก้ไข' },
  { value: 'แก้ไขแล้ว', label: 'แก้ไขแล้ว' },
  { value: 'ตรวจสอบแล้ว', label: 'ตรวจสอบแล้ว' },
];

const editStatusTones: Record<string, 'amber' | 'emerald' | 'blue'> = {
  'ยังไม่ได้แก้ไข': 'amber',
  'แก้ไขแล้ว': 'emerald',
  'ตรวจสอบแล้ว': 'blue',
};

const sortOptions = [
  { value: 'latest', label: 'เรียงตาม : ล่าสุด' },
  { value: 'oldest', label: 'เรียงตาม : เก่าสุด' },
];

// --- Filtering / sorting
const filteredRows = computed(() => {
  let result = [...registryRows.value];

  if (selectedUnit.value !== 'all') {
    result = result.filter((r) => r.department.includes(selectedUnit.value));
  }
  if (selectedStatus.value !== 'all') {
    result = result.filter((r) => r.editStatus === selectedStatus.value);
  }

  const q = searchedQuery.value.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (r) =>
        r.positionNumber.toLowerCase().includes(q) ||
        r.fullName.toLowerCase().includes(q) ||
        r.citizenId.includes(q) ||
        r.jobTitle.toLowerCase().includes(q)
    );
  }

  if (sortBy.value === 'oldest') result.reverse();
  return result;
});

watch(searchQuery, () => {
  searchedQuery.value = searchQuery.value;
});

// --- Active filter chips / clear
const hasActiveFilters = computed(
  () => selectedUnit.value !== 'all' || selectedPositionType.value !== 'all' || selectedStatus.value !== 'all' || !!searchQuery.value.trim()
);

const activeFilterChips = computed(() => {
  const chips: { key: string; label: string; clear: () => void }[] = [];
  if (selectedUnit.value !== 'all') chips.push({ key: 'unit', label: `หน่วยงาน: ${selectedUnit.value}`, clear: () => (selectedUnit.value = 'all') });
  if (selectedPositionType.value !== 'all') chips.push({ key: 'type', label: `ประเภทตำแหน่ง: ${selectedPositionType.value}`, clear: () => (selectedPositionType.value = 'all') });
  if (selectedStatus.value !== 'all') chips.push({ key: 'status', label: `สถานะ: ${selectedStatus.value}`, clear: () => (selectedStatus.value = 'all') });
  if (searchQuery.value.trim()) chips.push({ key: 'q', label: `คำค้นหา: ${searchQuery.value.trim()}`, clear: () => (searchQuery.value = '') });
  return chips;
});

const handleClearFilters = () => {
  selectedUnit.value = 'all';
  selectedPositionType.value = 'all';
  selectedStatus.value = 'all';
  searchQuery.value = '';
};

// --- Pagination
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

watch([selectedUnit, selectedStatus, searchedQuery, pageSize], () => {
  currentPage.value = 1;
});
</script>
