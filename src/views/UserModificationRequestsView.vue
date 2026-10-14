<template>
  <div class="flex flex-col min-h-full w-full">
    <UserPageActionBar
      back-label="ย้อนกลับ"
      badge="รายการยื่นคำร้องขอแก้ไขข้อมูล"
      subtitle="ยื่นคำร้องขอแก้ไขข้อมูลส่วนตัว · ติดตามสถานะการพิจารณา"
      @back="router.back()"
    >
      <template #actions>
        <UiButton variant="primary" size="sm" @click="show('สร้างคำร้องขอแก้ไขข้อมูลยังไม่เปิดใช้งาน')">
          <template #icon><Plus class="w-4 h-4" /></template>
          สร้างคำร้องใหม่
        </UiButton>
      </template>
    </UserPageActionBar>
    <main class="p-4 sm:p-6 lg:px-20 lg:py-8 max-w-8xl mx-auto w-full space-y-5">

      <UiCard padding="none">
        <!-- แถบเครื่องมือ: ตัวกรอง + ค้นหา + คอลัมน์ -->
        <div class="px-4 sm:px-5 py-3 border-b border-slate-100">
          <UiToolbar>
            <template #start>
              <UiSelect v-model="filterStatus" :options="statusOptions" size="md" fit />
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

        <!-- ตารางรายการคำร้อง -->
        <div class="p-4">
          <AppTable :columns="visibleColumns" :data="filteredRequests" row-key="id">
            <template #cell-no="{ value }">
              <span class="tabular-nums text-slate-400">{{ value }}</span>
            </template>
            <template #cell-title="{ value }">
              <span class="font-semibold text-slate-800">{{ value }}</span>
            </template>
            <template #cell-status="{ value }">
              <span
                class="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold"
                :class="statusTone(value)"
              >{{ value }}</span>
            </template>
            <template #cell-actions>
              <UiDropdownButton
                icon-only
                menu-title="จัดการคำร้อง"
                :items="requestActionItems"
                @select="show(`${$event.label} ยังไม่เปิดใช้งาน`)"
              />
            </template>
          </AppTable>
        </div>
      </UiCard>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Columns3, List, Pencil, Plus, Trash2 } from 'lucide-vue-next';
import UserPageActionBar from '../components/user/UserPageActionBar.vue';
import { UiButton, UiCard, UiDropdownButton, UiSearchInput, UiSelect, UiToolbar, AppTable } from '../components/ui';
import { useToast } from '../composables/useToast';
import { useRouter } from 'vue-router';

const { show } = useToast();
const router = useRouter();

// --- ตัวกรอง + ค้นหา
const filterStatus = ref('all');
const searchQuery = ref('');

const statuses = ['รอดำเนินการ', 'อนุมัติ', 'ไม่อนุมัติ'];

const statusOptions = [
  { value: 'all', label: 'สถานะคำร้อง: ทั้งหมด' },
  ...statuses.map((s) => ({ value: s, label: s })),
];

const statusTone = (status: string) =>
  status === 'อนุมัติ' ? 'bg-emerald-50 text-emerald-700'
    : status === 'ไม่อนุมัติ' ? 'bg-red-50 text-red-600'
    : 'bg-amber-50 text-amber-600';

// --- คอลัมน์
const columnDefs = [
  { key: 'no', label: 'ลำดับ' },
  { key: 'title', label: 'ชื่อเรื่อง' },
  { key: 'detail', label: 'รายละเอียด' },
  { key: 'status', label: 'สถานะคำร้อง' },
  { key: 'note', label: 'หมายเหตุ' },
  { key: 'actions', label: 'จัดการ' },
];

const togglableColumns = columnDefs.filter((c) => c.key !== 'no' && c.key !== 'actions');

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
      align: (c.key === 'no' || c.key === 'status' || c.key === 'actions' ? 'center' : 'left') as 'center' | 'left',
      width: c.key === 'no' ? '64px' : c.key === 'actions' ? '72px' : undefined,
    })),
);

// --- ข้อมูลคำร้อง
interface ModificationRequest {
  id: number;
  title: string;
  detail: string;
  status: string;
  note: string;
}

const requests: ModificationRequest[] = [
  { id: 1, title: 'ขอแก้ไขรูปภาพประจำตัว', detail: 'แก้ไขรูปภาพ', status: 'รอดำเนินการ', note: '-' },
];

const filteredRequests = computed(() =>
  requests
    .filter((r) => {
      if (filterStatus.value !== 'all' && r.status !== filterStatus.value) return false;
      const q = searchQuery.value.trim().toLowerCase();
      if (!q) return true;
      return [r.title, r.detail, r.status, r.note].some((v) => v.toLowerCase().includes(q));
    })
    .map((r, i) => ({ ...r, no: i + 1 })),
);

const requestActionItems = [
  { value: 'view', label: 'ดูรายละเอียด', icon: List },
  { value: 'edit', label: 'แก้ไข', icon: Pencil },
  { value: 'delete', label: 'ลบ', icon: Trash2 },
];
</script>
