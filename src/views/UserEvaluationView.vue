<template>
  <div>
    <main class="p-4 sm:p-6 lg:px-20 lg:py-8 max-w-8xl mx-auto space-y-5">
    
    <!-- หัวเรื่อง -->
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">ระบบประเมินบุคคล</h1>
        <p class="text-xs text-slate-500 mt-0.5">ตรวจสอบข้อมูลการประเมินบุคคล · ระบบประเมินปีงบประมาณ 2569</p>
      </div>
    </div>

      <UiCard padding="none">
        <!-- แถบเครื่องมือ: ตัวกรอง + ค้นหา + คอลัมน์ -->
        <div class="px-4 sm:px-5 py-3 border-b border-slate-100">
          <UiToolbar>
            <template #start>
              <UiSelect v-model="filterTopic" :options="topicOptions" size="md" fit />
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

        <!-- ตารางรายการประเมินบุคคล -->
        <div class="p-4">
          <AppTable :columns="visibleColumns" :data="filteredRecords" row-key="id">
            <template #cell-no="{ value }">
              <span class="tabular-nums text-slate-400">{{ value }}</span>
            </template>
            <template #cell-status="{ value }">
              <span
                class="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold"
                :class="statusTone(value)"
              >{{ value }}</span>
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
import { Columns3 } from 'lucide-vue-next';
import UserPageActionBar from '../components/user/UserPageActionBar.vue';
import { UiButton, UiCard, UiSearchInput, UiSelect, UiToolbar, AppTable } from '../components/ui';

const router = useRouter();

// --- ตัวกรองหัวข้อ + ค้นหา
const filterTopic = ref('self-check');
const searchQuery = ref('');

const topics = ['ตรวจสอบคุณสมบัติด้วยตนเอง', 'จัดเตรียมเอกสารเล่ม 1'];

const topicOptions = [
  { value: 'self-check', label: 'ตรวจสอบคุณสมบัติด้วยตนเอง' },
  { value: 'doc-vol1', label: 'จัดเตรียมเอกสารเล่ม 1' },
  { value: 'others', label: 'อื่นๆ (7)' },
];

const statusTone = (status: string) =>
  status === 'อนุมัติ' ? 'bg-emerald-50 text-emerald-700'
    : status === 'ไม่อนุมัติ' ? 'bg-red-50 text-red-600'
    : 'bg-amber-50 text-amber-600';

// --- คอลัมน์
const columnDefs = [
  { key: 'no', label: 'ลำดับ' },
  { key: 'level', label: 'ระดับที่ยื่นขอ' },
  { key: 'submitted', label: 'วันที่ยื่นขอ' },
  { key: 'status', label: 'สถานะ' },
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
      align: (['no', 'submitted', 'status'].includes(c.key) ? 'center' : 'left') as 'center' | 'left',
      width: c.key === 'no' ? '64px' : undefined,
    })),
);

// --- ข้อมูลรายการประเมิน (ปัจจุบันยังไม่มีรายการ)
interface EvaluationRecord {
  id: number;
  level: string;
  submitted: string;
  status: string;
}

const records: EvaluationRecord[] = [];

const filteredRecords = computed(() =>
  records
    .filter((r) => {
      const q = searchQuery.value.trim().toLowerCase();
      if (q && ![r.level, r.submitted, r.status].some((v) => v.toLowerCase().includes(q))) return false;
      return true;
    })
    .map((r, i) => ({ ...r, no: i + 1 })),
);
</script>
