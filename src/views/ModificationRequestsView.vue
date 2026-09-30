<template>
  <div class="flex flex-col min-h-full w-full">
    <!-- Header: ย้อนกลับ + ชื่อหน้า (PageActionBar) -->
    <PageActionBar
      back-label="ย้อนกลับ"
      back-title="กลับไปหน้าทะเบียนประวัติ"
      badge="รายการคำร้องขอแก้ไข"
      subtitle="ประวัติบุคลากร (นักวิชาการ กศน.สามัญ)"
      @back="backToRegistry"
    />

    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-4">
      <h1 class="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">รายการคำร้องขอแก้ไข</h1>
    <!-- การ์ดหลัก: Tabs + ตาราง -->
    <div class="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      <!-- Tabs -->
      <UiTabs v-model="activeTab" :items="tabItems" class="px-2 pt-1" />

      <!-- Toolbar: ฟิลเตอร์สถานะ + ค้นหา + เรียงลำดับ -->
      <div class="px-4 py-3.5 border-b border-slate-200/90 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div class="w-full lg:w-64">
          <UiSelect
            id="mod-request-status-select"
            v-model="selectedStatus"
            :options="statusOptions"
            select-class="bg-slate-50 border-slate-200 focus:ring-0 focus:border-blue-500"
          />
        </div>
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <UiSearchInput
            id="mod-request-search-input"
            v-model="searchQuery"
            placeholder="ค้นหา"
            class="w-full sm:w-56"
          />
          <div class="w-full sm:w-40">
            <UiSelect
              id="mod-request-sort-select"
              v-model="sortBy"
              :options="sortOptions"
              select-class="bg-slate-50 border-slate-200 focus:ring-0 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- ตารางรายการคำร้อง -->
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-100/90 border-b border-slate-200/90 text-xs font-semibold text-slate-700 select-none">
            <th class="py-3 px-3 w-12 text-center"></th>
            <th class="py-3 px-3 min-w-[150px]">วันที่ยื่นคำร้อง</th>
            <th class="py-3 px-3 min-w-[140px]">ชื่อ-นามสกุล</th>
            <th class="py-3 px-3 min-w-[160px]">ชื่อเรื่อง</th>
            <th class="py-3 px-3 min-w-[260px]">รายละเอียด</th>
            <th class="py-3 px-3 min-w-[110px]">สถานะคำร้อง</th>
            <th class="py-3 px-3 min-w-[90px]">หมายเหตุ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
          <tr
            v-for="item in pagedRequests"
            :key="item.id"
            class="hover:bg-slate-50/70 transition-colors cursor-pointer"
            @click="openDetail(item)"
          >
            <td class="py-3.5 px-3 text-center">
              <button
                type="button"
                title="แก้ไข / เปิดดูคำร้อง"
                class="p-1.5 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                @click.stop="openDetail(item)"
              >
                <Pencil class="w-4 h-4 text-sky-500" />
              </button>
            </td>
            <td class="py-3.5 px-3 font-medium text-slate-800 whitespace-nowrap">{{ item.submittedAt }}</td>
            <td class="py-3.5 px-3">{{ item.personName }}</td>
            <td class="py-3.5 px-3 font-semibold text-slate-800">{{ item.title }}</td>
            <td class="py-3.5 px-3 text-slate-600">{{ item.detail }}</td>
            <td class="py-3.5 px-3">
              <UiBadge :tone="statusTones[item.status]" shape="chip">{{ statusLabels[item.status] }}</UiBadge>
            </td>
            <td class="py-3.5 px-3 text-slate-400">{{ item.remark || '-' }}</td>
          </tr>
          <tr v-if="pagedRequests.length === 0">
            <td colspan="7">
              <UiEmptyState message="ไม่พบคำร้องขอแก้ไขตามเงื่อนไขที่ระบุ" />
            </td>
          </tr>
        </tbody>
      </table>

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
        <span>ทั้งหมด {{ filteredRequests.length }} รายการ</span>
        <UiPagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="filteredRequests.length"
          :page-size-options="[10, 20, 50]"
        />
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Pencil } from 'lucide-vue-next';
import { PageActionBar, UiBadge, UiEmptyState, UiPagination, UiSearchInput, UiSelect, UiTabs } from '../components/ui';
import { modificationRequests, type RequestRow } from '../data/modificationRequests';
import { useGoBack } from '../composables/useGoBack';

const router = useRouter();
const backToRegistry = useGoBack('/records/civil_servant');

const openDetail = (row: RequestRow) => {
  router.push({ name: 'modification-request-detail', params: { requestId: row.id } });
};

// --- Tabs
const activeTab = ref('personal');
const tabItems = [
  { value: 'personal', label: 'ข้อมูลส่วนตัว' },
  { value: 'idp', label: 'ข้อมูลแผนพัฒนาบุคลากร (IDP)' },
];

// --- Filters
const selectedStatus = ref('all');
const searchQuery = ref('');
const searchedQuery = ref('');
const sortBy = ref('latest');

const statusOptions = [
  { value: 'all', label: 'สถานะคำร้อง' },
  { value: 'pending', label: 'รอดำเนินการ' },
  { value: 'approved', label: 'อนุมัติแล้ว' },
  { value: 'rejected', label: 'ไม่อนุมัติ' },
];

const sortOptions = [
  { value: 'latest', label: 'ล่าสุด' },
  { value: 'oldest', label: 'เก่าสุด' },
];

const statusOptionsNoAll = statusOptions.filter((s) => s.value !== 'all');
const statusLabels: Record<string, string> = Object.fromEntries(
  statusOptionsNoAll.map((s) => [s.value, s.label])
);

const statusTones: Record<string, 'amber' | 'emerald' | 'red'> = {
  pending: 'amber',
  approved: 'emerald',
  rejected: 'red',
};

// --- Filtering / sorting
const filteredRequests = computed(() => {
  let result = [...modificationRequests.value];

  if (selectedStatus.value !== 'all') {
    result = result.filter((r) => r.status === selectedStatus.value);
  }

  const q = searchedQuery.value.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (r) =>
        r.personName.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.detail.toLowerCase().includes(q)
    );
  }

  result.sort((a, b) => {
    if (sortBy.value === 'oldest') return a.id.localeCompare(b.id);
    return b.id.localeCompare(a.id);
  });
  return result;
});

watch(searchQuery, () => {
  // ค้นเมื่อพิมพ์ทันที (ไม่ต้องกด Enter)
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

const pagedRequests = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredRequests.value.slice(start, start + pageSize.value);
});

watch([selectedStatus, searchedQuery, pageSize], () => {
  currentPage.value = 1;
});
</script>
