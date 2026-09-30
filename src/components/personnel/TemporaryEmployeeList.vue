<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-3">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
      <PageTitle
        title="รายชื่อลูกจ้างชั่วคราว"
        subtitle="รายชื่อลูกจ้างชั่วคราว กทม. ประจำปีงบประมาณ — เพิ่ม แก้ไข และตรวจสอบข้อมูลการจ้าง"
      />

      <div class="flex items-center gap-2 self-start md:self-auto flex-shrink-0 text-xs text-slate-600">
        <span class="text-slate-400">ทั้งหมด</span>
        <UiBadge tone="blue" size="sm">{{ TEMP_EMPLOYEES.length.toLocaleString() }} รายชื่อ</UiBadge>
      </div>
    </div>

    <UiCard>
      <template #header>
        <UiToolbar>
          <template #start>
            <UiButton @click="openAddModal">
              <template #icon>
                <Plus class="w-4 h-4" />
              </template>
              เพิ่มลูกจ้างชั่วคราว
            </UiButton>

            <UiButton
              variant="outline"
              class="!text-blue-700 !border-blue-700 hover:!bg-blue-50 hover:!text-blue-900"
              @click="notify('ส่งรายชื่อไปออกคำสั่ง')"
            >
              <template #icon>
                <Send class="w-4 h-4" />
              </template>
              ส่งรายชื่อไปออกคำสั่ง
            </UiButton>
          </template>

          <template #end>
            <UiSelect
              v-model="searchField"
              :options="searchFieldOptions"
              select-class="bg-slate-50 border-slate-200 font-semibold"
            />

            <UiSearchInput
              id="temp-employee-search-input"
              v-model="searchQuery"
              placeholder="ค้นหา..."
              class="w-48 sm:w-56"
            />

            <UiDropdownButton label="คอลัมน์" :items="columnMenuItems" @select="toggleColumn">
              <template #icon>
                <Columns3 class="w-3.5 h-3.5 text-slate-500" />
              </template>
            </UiDropdownButton>
          </template>
        </UiToolbar>
      </template>

        <AppTable
          :columns="tableColumns"
          :data="pagedRows"
          row-key="id"
          :show-toolbar="false"
          :pagination="true"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total-items="filteredRows.length"
          :page-size-options="[10, 20, 50]"
          empty-text="ไม่พบรายชื่อลูกจ้างชั่วคราวตามเงื่อนไขที่ระบุ"
          :bordered="false"
        >
          <template #cell-actions="{ row }">
            <div class="flex items-center justify-center gap-0.5">
              <UiIconButton tone="ghost" title="ดูรายละเอียด" @click="notify(`ดูรายละเอียด: ${row.fullName}`)">
                <User class="w-4 h-4 text-blue-600" />
              </UiIconButton>
              <UiIconButton tone="ghost" title="แก้ไขข้อมูล" @click="notify(`แก้ไขข้อมูล: ${row.fullName}`)">
                <Pencil class="w-4 h-4 text-sky-600" />
              </UiIconButton>
              <UiIconButton tone="ghost" title="ลบรายชื่อ" @click="notify(`ลบรายชื่อ: ${row.fullName}`)">
                <Trash2 class="w-4 h-4 text-red-500" />
              </UiIconButton>
            </div>
          </template>

          <template #cell-citizenId="{ value }">
            <span class="font-mono text-slate-800">{{ value }}</span>
          </template>

          <template #cell-fullName="{ value }">
            <span class="font-semibold text-slate-800">{{ value }}</span>
          </template>

          <template #cell-hireDate="{ value }">
            <span :class="value === '-' ? 'text-slate-300' : 'font-medium text-slate-700'">{{ value }}</span>
          </template>
        </AppTable>
    </UiCard>

    <!-- Modal เพิ่มข้อมูลลูกจ้างชั่วคราว -->
    <UiModal
      :is-open="isAddModalOpen"
      max-width="max-w-3xl"
      @close="closeAddModal"
    >
      <template #header>
        <h3 class="text-lg font-bold text-slate-900">เพิ่มข้อมูลลูกจ้างชั่วคราว</h3>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
        <UiInput
          v-model="addForm.citizenId"
          label="เลขประจำตัวประชาชน"
          placeholder="เลขประจำตัวประชาชน"
        />
        <UiSelect
          v-model="addForm.prefix"
          label="คำนำหน้านาม"
          placeholder="คำนำหน้านาม"
          :options="prefixOptions"
        />
        <UiSelect v-model="addForm.rank" label="ยศ" placeholder="ยศ" :options="rankOptions" />
        <UiInput v-model="addForm.firstName" label="ชื่อ" placeholder="ชื่อ" />
        <UiInput v-model="addForm.lastName" label="นามสกุล" placeholder="นามสกุล" />
        <UiInput
          v-model="addForm.birthDate"
          label="วัน/เดือน/ปี เกิด"
          type="date"
        />
        <UiInput
          v-model="addForm.age"
          label="อายุ"
          placeholder="อายุ"
          input-class="border-dashed"
          disabled
        />
        <UiSelect v-model="addForm.gender" label="เพศ" placeholder="เพศ" :options="genderOptions" />
        <UiSelect v-model="addForm.maritalStatus" label="สถานภาพ" placeholder="สถานภาพ" :options="maritalStatusOptions" />
        <UiInput v-model="addForm.nationality" label="สัญชาติ" placeholder="สัญชาติ" />
        <UiInput v-model="addForm.ethnicity" label="เชื้อชาติ" placeholder="เชื้อชาติ" />
        <UiSelect v-model="addForm.religion" label="ศาสนา" placeholder="ศาสนา" :options="religionOptions" />
        <UiSelect v-model="addForm.bloodType" label="หมู่เลือด" placeholder="หมู่เลือด" :options="bloodTypeOptions" />
        <UiInput v-model="addForm.phone" label="เบอร์โทร" placeholder="เบอร์โทร" />
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UiButton :disabled="!isAddFormValid" @click="saveNewEmployee">
            บันทึก
          </UiButton>
        </div>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { PageTitle } from '../common';
import { AppTable, type AppTableColumn } from '../ui';
import {
  UiBadge,
  UiButton,
  UiCard,
  UiDropdownButton,
  UiIconButton,
  UiInput,
  UiModal,
  UiSearchInput,
  UiSelect,
  UiToolbar,
} from '../ui';
import {
  Columns3,
  Pencil,
  Plus,
  Send,
  Trash2,
  User,
} from 'lucide-vue-next';
import { TEMP_EMPLOYEES } from '../../data/tempEmployeeData';
import type { TempEmployee } from '../../data/tempEmployeeData';
import { useToast } from '../../composables/useToast';
const { show } = useToast();


const notify = (msg: string) => show(msg);

// --- Modal เพิ่มข้อมูลลูกจ้างชั่วคราว
const isAddModalOpen = ref(false);
const emptyAddForm = () => ({
  citizenId: '',
  prefix: '',
  rank: '',
  firstName: '',
  lastName: '',
  birthDate: '',
  age: '',
  gender: '',
  maritalStatus: '',
  nationality: '',
  ethnicity: '',
  religion: '',
  bloodType: '',
  phone: '',
});
const addForm = ref(emptyAddForm());

const prefixOptions = [
  { value: 'นาย', label: 'นาย' },
  { value: 'นาง', label: 'นาง' },
  { value: 'นางสาว', label: 'นางสาว' },
];
const rankOptions = [
  { value: 'ว่าที่ ร.ท.', label: 'ว่าที่ ร.ท.' },
  { value: 'ว่าที่ ร.อ.', label: 'ว่าที่ ร.อ.' },
  { value: 'น.อ.', label: 'น.อ.' },
  { value: 'พ.ต.', label: 'พ.ต.' },
];
const genderOptions = [
  { value: 'ชาย', label: 'ชาย' },
  { value: 'หญิง', label: 'หญิง' },
];
const maritalStatusOptions = [
  { value: 'โสด', label: 'โสด' },
  { value: 'สมรส', label: 'สมรส' },
  { value: 'หย่า', label: 'หย่า' },
  { value: 'หม้าย', label: 'หม้าย' },
];
const religionOptions = [
  { value: 'พุทธ', label: 'พุทธ' },
  { value: 'คริสต์', label: 'คริสต์' },
  { value: 'อิสลาม', label: 'อิสลาม' },
  { value: 'ฮินดู', label: 'ฮินดู' },
];
const bloodTypeOptions = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'AB', label: 'AB' },
  { value: 'O', label: 'O' },
];

const isAddFormValid = computed(
  () => addForm.value.citizenId.trim() !== '' && addForm.value.firstName.trim() !== '' && addForm.value.lastName.trim() !== ''
);

const openAddModal = () => {
  addForm.value = emptyAddForm();
  isAddModalOpen.value = true;
};

const closeAddModal = () => {
  isAddModalOpen.value = false;
};

const saveNewEmployee = () => {
  const f = addForm.value;
  TEMP_EMPLOYEES.unshift({
    id: `temp-new-${Date.now()}`,
    orderNumber: 0,
    citizenId: f.citizenId.trim(),
    fullName: `${f.prefix ? f.prefix + ' ' : ''}${f.firstName.trim()} ${f.lastName.trim()}`.trim(),
    positionDept: '-',
    serviceYears: 0,
    hireDate: '-',
    appointDate: '-',
    ageText: f.age || '-',
  });
  TEMP_EMPLOYEES.forEach((row, i) => {
    row.orderNumber = i + 1;
  });
  closeAddModal();
  show(`เพิ่มข้อมูลลูกจ้างชั่วคราว: ${f.firstName} ${f.lastName} แล้ว`);
};

// --- ค้นหา
const searchField = ref('name');
const searchQuery = ref('');

const searchFieldOptions = [
  { value: 'name', label: 'ชื่อ-นามสกุล' },
  { value: 'citizenId', label: 'เลขประจำตัวประชาชน' },
  { value: 'all', label: 'ทุกฟิลด์' },
];

// --- คอลัมน์ (ซ่อน/แสดงได้จากเมนู คอลัมน์)
const hiddenCols = ref<string[]>([]);

const toggleableCols = [
  { key: 'citizenId', label: 'เลขประจำตัวประชาชน' },
  { key: 'positionDept', label: 'ตำแหน่ง/สังกัดตามงบประมาณ' },
  { key: 'serviceYears', label: 'อายุราชการ(ปี)' },
  { key: 'hireDate', label: 'วันที่จ้าง' },
  { key: 'appointDate', label: 'วันที่แต่งตั้ง' },
  { key: 'ageText', label: 'อายุ' },
];

const columnMenuItems = computed(() =>
  toggleableCols.map((col) => ({
    value: col.key,
    label: hiddenCols.value.includes(col.key) ? `แสดง : ${col.label}` : `ซ่อน : ${col.label}`,
  }))
);

const toggleColumn = (item: { value: string }) => {
  hiddenCols.value = hiddenCols.value.includes(item.value)
    ? hiddenCols.value.filter((k) => k !== item.value)
    : [...hiddenCols.value, item.value];
};

const tableColumns = computed<AppTableColumn[]>(() => [
  { key: 'actions', label: '', width: '110px' },
  { key: 'orderNumber', label: 'ลำดับ', width: '64px', align: 'center' },
  { key: 'citizenId', label: 'เลขประจำตัวประชาชน', hidden: hiddenCols.value.includes('citizenId') },
  { key: 'fullName', label: 'ชื่อ-นามสกุล' },
  { key: 'positionDept', label: 'ตำแหน่ง/สังกัดตามงบประมาณ', hidden: hiddenCols.value.includes('positionDept') },
  { key: 'serviceYears', label: 'อายุราชการ(ปี)', align: 'center', hidden: hiddenCols.value.includes('serviceYears') },
  { key: 'hireDate', label: 'วันที่จ้าง', hidden: hiddenCols.value.includes('hireDate') },
  { key: 'appointDate', label: 'วันที่แต่งตั้ง', hidden: hiddenCols.value.includes('appointDate') },
  { key: 'ageText', label: 'อายุ', hidden: hiddenCols.value.includes('ageText') },
]);

// --- กรอง + แบ่งหน้า
const currentPage = ref(1);
const pageSize = ref(10);

const filteredRows = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return TEMP_EMPLOYEES;
  return TEMP_EMPLOYEES.filter((row: TempEmployee) => {
    if (searchField.value === 'name') return row.fullName.toLowerCase().includes(q);
    if (searchField.value === 'citizenId') return row.citizenId.includes(q);
    return row.fullName.toLowerCase().includes(q) || row.citizenId.includes(q);
  });
});

const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredRows.value.slice(start, start + pageSize.value);
});

watch([searchQuery, searchField], () => {
  currentPage.value = 1;
});
</script>
