<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4">
    <!-- Page Title -->
    <PageTitle
      title="รายการคำสั่ง"
      subtitle="ค้นหาและจัดการคำสั่งทางราชการ ตั้งแต่ร่างจนถึงออกคำสั่งเสร็จสิ้น"
    />

    <!-- การ์ดหลัก: ฟิลเตอร์ + ตาราง (โครงเดียวกับหน้าแก้ไขทะเบียนประวัติ) -->
    <div class="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      <!-- Toolbar: ฟิลเตอร์ -->
      <div class="p-4 sm:p-5 space-y-4 border-b border-slate-200/90">
        <!-- แถว 1: ปีงบประมาณ + ประเภทคำสั่ง + สถานะ -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <label class="block text-[11px] font-medium text-slate-500 mb-1">ปีงบประมาณ</label>
            <UiSelect
              id="order-fiscal-year-select"
              v-model="fiscalYear"
              :options="fiscalYearOptions"
              size="lg"
              select-class="bg-slate-50 border-slate-200 focus:ring-0 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-slate-500 mb-1">ประเภทคำสั่ง</label>
            <UiSelect
              id="order-type-select"
              v-model="filterType"
              :options="typeOptions"
              size="lg"
              select-class="bg-slate-50 border-slate-200 focus:ring-0 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-slate-500 mb-1">สถานะ</label>
            <UiSelect
              id="order-status-select"
              v-model="activeStatus"
              :options="statusOptions"
              size="lg"
              select-class="bg-slate-50 border-slate-200 focus:ring-0 focus:border-blue-500"
            />
          </div>
        </div>

        <!-- แถว 2: คำค้นหา (+ เพิ่มคำสั่ง) + ล้างตัวกรอง -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end pt-3 border-t border-slate-100">
          <div class="lg:col-span-2 flex items-center gap-2.5">
            <UiButton id="btn-add-order" size="md" class="whitespace-nowrap shrink-0" @click="isAddOrderModalOpen = true">
              <template #icon>
                <Plus class="w-4 h-4" />
              </template>
              เพิ่มคำสั่ง
            </UiButton>
            <UiSearchInput
              id="order-search-input"
              v-model="searchQuery"
              placeholder="ระบุคำค้นหา เช่น เลขที่คำสั่ง, ชื่อคำสั่ง, ผู้สร้าง..."
              size="lg"
              class="flex-1 min-w-0"
            />
            
          </div>
          <div class="flex items-center justify-end gap-3 pb-1 lg:col-span-2">
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
              <th class="py-3 px-4 w-[1%]"></th>
              <th class="py-3 px-4 min-w-[280px]">เลขที่คำสั่ง</th>
              <th class="py-3 px-4 min-w-[220px]">ชื่อคำสั่ง</th>
              <th class="py-3 px-4 min-w-[130px]">วันที่ลงนาม</th>
              <th class="py-3 px-4 min-w-[130px]">วันที่คำสั่งมีผล</th>
              <th class="py-3 px-4 min-w-[120px]">ผู้สร้าง</th>
              <th class="py-3 px-4 min-w-[140px]">ผู้ลงนาม</th>
              <th class="py-3 px-4 min-w-[120px]">สถานะ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
            <tr
              v-for="(item, i) in pagedOrders"
              :key="item.id"
              class="hover:bg-slate-50/70 transition-colors"
              :class="i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'"
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
              <td class="py-3.5 px-4">
                <UiBadge tone="outline" shape="chip" mono>{{ item.orderNo }}</UiBadge>
              </td>
              <td class="py-3.5 px-4 font-semibold text-blue-950">{{ item.name }}</td>
              <td class="py-3.5 px-4 text-slate-600">{{ item.signedDate ?? '-' }}</td>
              <td class="py-3.5 px-4 text-slate-600">{{ item.effectiveDate ?? '-' }}</td>
              <td class="py-3.5 px-4">{{ item.creator }}</td>
              <td class="py-3.5 px-4 text-slate-600">{{ item.signer ?? '-' }}</td>
              <td class="py-3.5 px-4">
                <UiBadge :tone="statusTones[item.status] ?? 'slate'" shape="chip">{{ statusLabels[item.status] ?? item.status }}</UiBadge>
              </td>
            </tr>
            <tr v-if="pagedOrders.length === 0">
              <td colspan="8">
                <UiEmptyState message="ไม่พบข้อมูลคำสั่งตามเงื่อนไขที่ระบุ" />
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
        <span>ทั้งหมด {{ filteredOrders.length }} รายการ</span>
        <UiPagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="filteredOrders.length"
          :page-size-options="[10, 20, 50]"
        />
      </div>
    </div>

    <!-- Modal: เพิ่มคำสั่ง -->
    <UiModal
      :is-open="isAddOrderModalOpen"
      title="เพิ่มคำสั่ง"
      subtitle="ระบุประเภทและเลขที่คำสั่งเพื่อเริ่มสร้างคำสั่งใหม่"
      @close="isAddOrderModalOpen = false"
    >
      <template #icon>
        <Plus class="w-5 h-5 text-blue-900" />
      </template>

      <div class="space-y-3.5 text-xs">
        <!-- ประเภทคำสั่ง -->
        <div class="space-y-1">
          <label class="block font-medium text-slate-700">ประเภทคำสั่ง <span class="text-rose-500">*</span></label>
          <UiSelect
            id="add-order-type"
            v-model="addOrderForm.type"
            :options="typeOptions.filter((t) => t.value !== 'all')"
            size="lg"
          />
        </div>

        <!-- คำสั่งเลขที่ / ปี พ.ศ. -->
        <div class="space-y-1">
          <label class="block font-medium text-slate-700">คำสั่งเลขที่ / ปี พ.ศ. <span class="text-rose-500">*</span></label>
          <div class="flex items-center gap-2">
            <div class="flex-1 min-w-0">
              <UiInput
                id="add-order-no"
                v-model="addOrderForm.orderNo"
                size="lg"
                placeholder="เช่น สนพ. 25/9"
              />
            </div>
            <span class="text-slate-400 font-medium flex-shrink-0">/</span>
            <div class="relative flex-shrink-0">
              <UiSelect
                id="add-order-year"
                v-model="addOrderForm.fiscalYear"
                :options="addOrderYearOptions"
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
            @click="isAddOrderModalOpen = false"
          >
            ยกเลิก
          </button>
          <UiButton size="md" @click="confirmAddOrder">
            <template #icon>
              <Check class="w-4 h-4" />
            </template>
            สร้างคำสั่ง
          </UiButton>
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
  Copy,
  Eye,
  MoreVertical,
  Pencil,
  Plus,
  UserCheck,
  X,
} from 'lucide-vue-next';
import { PageTitle } from '../common';
import {
  UiBadge,
  UiButton,
  UiDropdownButton,
  UiEmptyState,
  UiInput,
  UiModal,
  UiPagination,
  UiSearchInput,
  UiSelect,
} from '../ui';
import { useToast } from '../../composables/useToast';

const { show } = useToast();

// --- Filters
const fiscalYear = ref('2569');
const filterType = ref('all');
const activeStatus = ref('all');
const searchQuery = ref('');

const fiscalYearOptions = [
  { value: '2569', label: 'ปี พ.ศ. 2569' },
  { value: '2568', label: 'ปี พ.ศ. 2568' },
  { value: '2567', label: 'ปี พ.ศ. 2567' },
];

const typeOptions = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'personnel', label: 'ด้านบริหารบุคคล' },
  { value: 'committee', label: 'แต่งตั้งคณะกรรมการ' },
  { value: 'general', label: 'ทั่วไป' },
];

const statusOptions = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'draft', label: 'แบบร่าง' },
  { value: 'pending_approve', label: 'รอผู้มีอำนาจลงนามอนุมัติ' },
  { value: 'pending_issue', label: 'รอออกคำสั่ง' },
  { value: 'done', label: 'ออกคำสั่งเสร็จสิ้น' },
];

const statusLabels: Record<string, string> = {
  draft: 'แบบร่าง',
  pending_approve: 'รออนุมัติ',
  pending_issue: 'รอออกคำสั่ง',
  done: 'เสร็จสิ้น',
};

const statusTones: Record<string, 'amber' | 'blue' | 'emerald' | 'slate'> = {
  draft: 'amber',
  pending_approve: 'blue',
  pending_issue: 'slate',
  done: 'emerald',
};

// --- ข้อมูลคำสั่งจำลอง
interface Order {
  id: string;
  status: string;
  type: string;
  fiscalYear: string;
  orderNo: string;
  name: string;
  signedDate: string | null;
  effectiveDate: string | null;
  creator: string;
  signer: string | null;
}

const orders: Order[] = [
  {
    id: '1', status: 'draft', type: 'personnel', fiscalYear: '2569',
    orderNo: 'สนพ. 25/9 สั่งรายชื่อผู้สอบแข่งขันได้ในโครงการ/2569',
    name: 'บรรจุและแต่งตั้งผู้สอบแข่งขันได้',
    signedDate: null, effectiveDate: null, creator: 'สมชาย ใจดี', signer: null,
  },
  {
    id: '2', status: 'draft', type: 'personnel', fiscalYear: '2569',
    orderNo: 'สนพ. 25/9 บรรจุรายชื่อผู้สอบแข่งขันได้/2569',
    name: 'บรรจุและแต่งตั้งผู้สอบแข่งขันได้',
    signedDate: null, effectiveDate: null, creator: 'สมชาย ใจดี', signer: null,
  },
  {
    id: '3', status: 'draft', type: 'personnel', fiscalYear: '2569',
    orderNo: 'สนพ. 21/9 นรก.ลาออกไปประกอบอาชีพภาคเหนือ/2569',
    name: 'อนุญาตให้ลาออกไปประกอบอาชีพภาคเหนือ',
    signedDate: null, effectiveDate: null, creator: 'สมชาย ใจดี', signer: null,
  },
  {
    id: '4', status: 'draft', type: 'general', fiscalYear: '2569',
    orderNo: 'สนพ. 16/9 ยุติเรื่องขอโยนย้าย/2569',
    name: 'ยุติเรื่อง',
    signedDate: null, effectiveDate: null, creator: 'สมชาย ใจดี', signer: null,
  },
  {
    id: '5', status: 'pending_approve', type: 'personnel', fiscalYear: '2569',
    orderNo: 'สนพ. 15/9 แต่งตั้งคณะกรรมการ/2569',
    name: 'แต่งตั้งคณะกรรมการพิจารณาผลการประเมิน',
    signedDate: '18 ก.ย. 2569', effectiveDate: null, creator: 'สมชาย ใจดี', signer: null,
  },
  {
    id: '6', status: 'done', type: 'committee', fiscalYear: '2569',
    orderNo: 'สนพ. 10/9 แต่งตั้งคณะทำงานพัฒนาระบบ/2569',
    name: 'แต่งตั้งคณะทำงานพัฒนาระบบสารสนเทศ',
    signedDate: '10 ก.ย. 2569', effectiveDate: '12 ก.ย. 2569', creator: 'สมชาย ใจดี', signer: 'ผู้อำนวยการเขต',
  },
];

// --- เมนู ⋮ รายแถว
const rowMenuItems = [
  { value: 'edit', label: 'แก้ไขข้อมูล', icon: Pencil },
  { value: 'detail', label: 'รายละเอียด', icon: Eye },
  { value: 'duplicate', label: 'ทำสำเนาคำสั่ง', icon: Copy },
  { value: 'assign', label: 'มอบหมายคำสั่ง', icon: UserCheck },
  { value: 'delete', label: 'ลบ', icon: X },
];

const router = useRouter();

// --- Modal เพิ่มคำสั่ง
const isAddOrderModalOpen = ref(false);
const addOrderForm = ref({
  type: 'personnel',
  orderNo: '',
  fiscalYear: '2569',
});

const addOrderYearOptions = [
  { value: '2569', label: '2569' },
  { value: '2568', label: '2568' },
  { value: '2567', label: '2567' },
];

const confirmAddOrder = () => {
  if (!addOrderForm.value.orderNo.trim()) {
    show('กรุณาระบุคำสั่งเลขที่');
    return;
  }
  isAddOrderModalOpen.value = false;
  show(`สร้างคำสั่ง ${addOrderForm.value.orderNo}/${addOrderForm.value.fiscalYear} เรียบร้อยแล้ว`);
  addOrderForm.value.orderNo = '';
};

const handleRowMenu = (action: string, item: Order) => {
  if (action === 'edit') {
    router.push(`/orders/${item.id}/edit`);
    return;
  }
  if (action === 'detail') {
    router.push(`/orders/${item.id}/view`);
    return;
  }
  show(`${action} — ${item.orderNo} (ยังไม่เปิดใช้งาน)`);
};

// --- Filtering
const filteredOrders = computed(() => {
  let result = [...orders];

  if (fiscalYear.value !== 'all') {
    result = result.filter((o) => o.fiscalYear === fiscalYear.value);
  }
  if (filterType.value !== 'all') {
    result = result.filter((o) => o.type === filterType.value);
  }
  if (activeStatus.value !== 'all') {
    result = result.filter((o) => o.status === activeStatus.value);
  }

  const q = searchQuery.value.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (o) =>
        o.orderNo.toLowerCase().includes(q) ||
        o.name.toLowerCase().includes(q) ||
        o.creator.toLowerCase().includes(q)
    );
  }
  return result;
});

// --- Active filter chips / clear
const hasActiveFilters = computed(
  () => filterType.value !== 'all' || activeStatus.value !== 'all' || !!searchQuery.value.trim()
);

const activeFilterChips = computed(() => {
  const chips: { key: string; label: string; clear: () => void }[] = [];
  if (filterType.value !== 'all') chips.push({ key: 'type', label: `ประเภทคำสั่ง: ${typeOptions.find((t) => t.value === filterType.value)?.label}`, clear: () => (filterType.value = 'all') });
  if (activeStatus.value !== 'all') chips.push({ key: 'status', label: `สถานะ: ${statusLabels[activeStatus.value]}`, clear: () => (activeStatus.value = 'all') });
  if (searchQuery.value.trim()) chips.push({ key: 'q', label: `คำค้นหา: ${searchQuery.value.trim()}`, clear: () => (searchQuery.value = '') });
  return chips;
});

const handleClearFilters = () => {
  filterType.value = 'all';
  activeStatus.value = 'all';
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

const pagedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredOrders.value.slice(start, start + pageSize.value);
});

watch([filterType, activeStatus, searchQuery, pageSize], () => {
  currentPage.value = 1;
});
</script>
