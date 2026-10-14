<template>
  <div class="flex flex-col min-h-full w-full">
    <UserPageActionBar
      back-label="ย้อนกลับ"
      badge="รายการประวัติตำแหน่ง/เงินเดือน"
      subtitle="ประวัติการบรรจุ แต่งตั้ง และเลื่อนเงินเดือน"
      @back="router.back()"
    >
      <template #actions>
        <UiButton variant="primary" size="sm" @click="show('ดาวน์โหลดข้อมูลประวัติยังไม่เปิดใช้งาน')">
          <template #icon><Download class="w-4 h-4" /></template>
          ดาวน์โหลด
        </UiButton>
      </template>
    </UserPageActionBar>

    <main class="p-4 sm:p-6 lg:px-20 lg:py-8 max-w-8xl mx-auto w-full space-y-5">
      <UiCard padding="none">
        <!-- แถบเครื่องมือ: ค้นหา + คอลัมน์ -->
        <div class="px-4 sm:px-5 py-3 border-b border-slate-100">
          <UiToolbar>
            <template #start>
              <UiSearchInput v-model="searchQuery" placeholder="ค้นหา..." size="md" class="w-full sm:w-64" />
            </template>
            <template #end>
              <!-- เลือกคอลัมน์ -->
              <div class="relative">
                <UiButton variant="outline" size="sm" @click="columnMenuOpen = !columnMenuOpen">
                  <template #icon><Columns3 class="w-4 h-4" /></template>
                  คอลัมน์
                </UiButton>
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
            </template>
          </UiToolbar>
        </div>

        <!-- ตารางประวัติตำแหน่ง/เงินเดือน -->
        <div class="p-4">
          <AppTable :columns="visibleColumns" :data="filteredRecords" row-key="id">
            <template #cell-no="{ value }">
              <span class="tabular-nums text-slate-400">{{ value }}</span>
            </template>
            <template #cell-effectiveDate="{ value }">
              <span class="font-semibold text-slate-800 tabular-nums">{{ value }}</span>
            </template>
            <template #cell-salary="{ row }">
              <span class="font-semibold text-slate-800 tabular-nums">{{ formatNumber(row.salary) }} บาท</span>
              <span class="block text-[10px] text-slate-400 tabular-nums">ค่าตอบแทน/ประจำตำแหน่ง: {{ formatNumber(row.extraPay) }} บาท</span>
            </template>
          </AppTable>
        </div>
      </UiCard>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Columns3, Download } from 'lucide-vue-next';
import UserPageActionBar from '../components/user/UserPageActionBar.vue';
import { UiButton, UiCard, UiSearchInput, UiToolbar, AppTable } from '../components/ui';
import { useToast } from '../composables/useToast';

const { show } = useToast();
const router = useRouter();

// --- ค้นหา
const searchQuery = ref('');

// --- คอลัมน์
const columnDefs = [
  { key: 'no', label: 'ลำดับ' },
  { key: 'effectiveDate', label: 'วันที่คำสั่งมีผล' },
  { key: 'position', label: 'ตำแหน่งในสายงาน / ประเภท / ระดับ' },
  { key: 'salary', label: 'เงินเดือน' },
  { key: 'affiliation', label: 'สังกัด' },
  { key: 'issuedBy', label: 'หน่วยงานที่ออกคำสั่ง' },
  { key: 'orderInfo', label: 'ข้อมูลคำสั่ง' },
  { key: 'orderType', label: 'ประเภทคำสั่ง' },
];

const togglableColumns = columnDefs.filter((c) => c.key !== 'no');

const columnMenuOpen = ref(false);
const hiddenCols = ref<string[]>([]);

const toggleColumn = (key: string) => {
  hiddenCols.value = hiddenCols.value.includes(key)
    ? hiddenCols.value.filter((k) => k !== key)
    : [...hiddenCols.value, key];
};

const visibleColumns = computed(() =>
  columnDefs
    .filter((c) => !hiddenCols.value.includes(c.key))
    .map((c) => ({
      ...c,
      align: (['no', 'effectiveDate', 'salary'].includes(c.key) ? 'center' : 'left') as 'center' | 'left',
      width: c.key === 'no' ? '64px' : undefined,
    })),
);

// --- ข้อมูลประวัติ
interface PositionSalaryRecord {
  id: number;
  effectiveDate: string;
  position: string;
  salary: number;
  extraPay: number;
  affiliation: string;
  positionNo: string;
  issuedBy: string;
  orderInfo: string;
  orderType: string;
}

const records: PositionSalaryRecord[] = [
  {
    id: 1,
    effectiveDate: '01 ก.ย. 2569',
    position: 'นักวิเคราะห์นโยบายและแผน / วิชาการ / ทรงคุณวุฒิ',
    salary: 31650,
    extraPay: 0,
    affiliation: 'ฝ่ายอำนวยการ กองสารบรรณ สำนักงานผู้อำนวยการสถานธนานุบาล',
    positionNo: 'สนผ. 16',
    issuedBy: 'สำนักปลัดกรุงเทพมหานคร (สนป.)',
    orderInfo: 'เลขที่ 23/9 เลื่อนเงินเดือน ขรก./2569 (วันที่ลงนาม 01 ก.ย. 2569)',
    orderType: 'เลื่อนเงินเดือน/ค่าจ้างกรณีอื่น ๆ',
  },
  {
    id: 2,
    effectiveDate: '02 เม.ย. 2543',
    position: 'นักวิเคราะห์นโยบายและแผน / วิชาการ / ทรงคุณวุฒิ',
    salary: 27900,
    extraPay: 0,
    affiliation: 'ฝ่ายเลขานุการผู้บริหาร งานเลขานุการและประชุม สำนักงานผู้อำนวยการสถานธนานุบาล',
    positionNo: 'สนผ. 16',
    issuedBy: '-',
    orderInfo: 'เลขที่ 11/43/2543 (วันที่ลงนาม 02 เม.ย. 2543)',
    orderType: 'บรรจุและแต่งตั้งผู้สอบแข่งขันได้',
  },
];

const formatNumber = (n: number) => n.toLocaleString('th-TH');

const filteredRecords = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  const filtered = q
    ? records.filter((r) =>
        [r.effectiveDate, r.position, r.affiliation, r.positionNo, r.issuedBy, r.orderInfo, r.orderType].some((v) =>
          v.toLowerCase().includes(q),
        ),
      )
    : records;
  return filtered.map((r, i) => ({ ...r, no: i + 1 }));
});
</script>
