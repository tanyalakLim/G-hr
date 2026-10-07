<template>
  <div class="p-4 sm:p-6 flex-1 space-y-4">
    <!-- แถบบน: เพิ่มรายชื่อ (ซ้าย) / ค้นหา + คอลัมน์ (ขวา) -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
      <UiIconButton v-if="!readonly" title="เพิ่มข้อมูล" @click="handleAddRecipient">
          <Plus class="w-4 h-4" />
        </UiIconButton>
      <div class="flex items-center gap-2.5">
        <UiSelect
          id="cc-search-by"
          v-model="searchBy"
          :options="searchByOptions"
          size="md"
          fit
        />
        <UiSearchInput
          id="cc-search-input"
          v-model="searchQuery"
          placeholder="ค้นหารายชื่อ..."
          size="md"
          class="w-56"
        />
      </div>
    </div>

    <!-- ตารางรายชื่อผู้ได้รับสำเนาคำสั่ง -->
    <div class="border border-slate-200 rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200/90 text-[12px] font-semibold text-slate-600 tracking-tight select-none">
              <th class="py-2.5 px-4 text-center w-16">ลำดับ</th>
              <th class="py-2.5 px-4">เลขประจำตัวประชาชน</th>
              <th class="py-2.5 px-4">ชื่อ - นามสกุล</th>
              <th class="py-2.5 px-4">ตำแหน่ง</th>
              <th class="py-2.5 px-4">หน่วยงาน</th>
              <th class="py-2.5 px-4 min-w-[180px]">ช่องทางการส่งสำเนา</th>
              <th v-if="!readonly" class="py-2.5 px-4 text-center w-20">ลบ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs">
            <tr
              v-for="(person, i) in filteredRecipients"
              :key="person.citizenId"
              class="hover:bg-slate-50/50 transition-colors"
            >
              <td class="py-3 px-4 text-center text-slate-500 font-medium">{{ i + 1 }}</td>
              <td class="py-3 px-4 font-mono text-slate-600">{{ person.citizenId }}</td>
              <td class="py-3 px-4 font-semibold text-slate-900">{{ person.name }}</td>
              <td class="py-3 px-4 text-slate-700">{{ person.position }}</td>
              <td class="py-3 px-4 text-slate-700">{{ person.agency }}</td>
              <td class="py-3 px-4">
                <UiSelect
                  v-if="!readonly"
                  v-model="person.channel"
                  :options="channelOptions"
                  size="sm"
                  fit
                />
                <span v-else class="text-slate-700">
                  {{ channelOptions.find((c) => c.value === person.channel)?.label || '-' }}
                </span>
              </td>
              <td v-if="!readonly" class="py-3 px-4">
                <div class="flex items-center justify-center">
                  <button
                    type="button"
                    class="p-1.5 text-rose-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="ลบรายชื่อ"
                    @click="removeRecipient(person)"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredRecipients.length === 0">
              <td colspan="7">
                <UiEmptyState message="ไม่พบรายชื่อผู้ได้รับสำเนาคำสั่งตามเงื่อนไขที่ค้นหา" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ส่วนควบคุมด้านล่างตาราง -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
      <div class="flex items-center gap-1.5">
        <span>แสดงต่อหน้า:</span>
        <UiSelect v-model="pageSize" :options="pageSizeOptions" size="xs" fit />
        <span>แถวต่อหน้า</span>
      </div>
      <div class="flex items-center gap-3">
        <span>ทั้งหมด {{ filteredRecipients.length }} รายการ</span>
        <UiPagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="filteredRecipients.length"
          :page-size-options="[10, 20, 50]"
        />
      </div>
    </div>

    <!-- ปุ่มบันทึกข้อมูล (ล่างสุด) -->
    <div v-if="!readonly" class="flex items-center justify-end pt-3 border-t border-slate-100">
      <UiButton id="btn-save-cc-recipients" size="md" @click="handleSave">
        <template #icon>
          <Check class="w-4 h-4" />
        </template>
        บันทึกข้อมูล
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Check, Plus, Trash2 } from 'lucide-vue-next';
import { UiIconButton, UiButton, UiEmptyState, UiPagination, UiSearchInput, UiSelect } from '../ui';
import { useToast } from '../../composables/useToast';

const { show } = useToast();

withDefaults(
  defineProps<{
    readonly?: boolean;
  }>(),
  {
    readonly: false,
  }
);

// --- ข้อมูลผู้ได้รับสำเนาคำสั่ง
interface CcRecipient {
  citizenId: string;
  name: string;
  position: string;
  agency: string;
  channel: string;
}

const recipients = ref<CcRecipient[]>([
  {
    citizenId: '8478225235641',
    name: 'นายเกริก สัจจวัตร',
    position: 'ผู้อำนวยการสถานธนานุบาล',
    agency: 'สำนักงานผู้อำนวยการสถานธนานุบาล',
    channel: 'email_sms',
  },
  {
    citizenId: '5329676461391',
    name: 'นางสมหญิง สุขเกษม',
    position: 'นักจัดการงานทั่วไป',
    agency: 'กลุ่มงานบริหารทั่วไป',
    channel: 'email_sms',
  },
]);

const channelOptions = [
  { value: 'email', label: 'อีเมล' },
  { value: 'sms', label: 'กล่องข้อความ' },
  { value: 'email_sms', label: 'อีเมล, กล่องข้อความ' },
];

// --- ค้นหา
const searchQuery = ref('');
const searchBy = ref('all');

const searchByOptions = [
  { value: 'all', label: 'ทุกคอลัมน์' },
  { value: 'citizenId', label: 'เลขประจำตัวประชาชน' },
  { value: 'name', label: 'ชื่อ-นามสกุล' },
  { value: 'position', label: 'ตำแหน่ง' },
  { value: 'agency', label: 'หน่วยงาน' },
];

const filteredRecipients = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return recipients.value;
  return recipients.value.filter((p) => {
    if (searchBy.value === 'all') {
      return (
        p.citizenId.includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.position.toLowerCase().includes(q) ||
        p.agency.toLowerCase().includes(q)
      );
    }
    return String(p[searchBy.value as keyof CcRecipient]).toLowerCase().includes(q);
  });
});

// --- เพิ่ม / ลบ
const handleAddRecipient = () => {
  show('เพิ่มรายชื่อผู้ได้รับสำเนาคำสั่ง (ยังไม่เปิดใช้งาน)');
};

const handleSave = () => {
  show('บันทึกรายชื่อผู้ได้รับสำเนาคำสั่งเรียบร้อยแล้ว');
};

const removeRecipient = (person: CcRecipient) => {
  recipients.value = recipients.value.filter((p) => p.citizenId !== person.citizenId);
  show(`ลบรายชื่อ ${person.name} เรียบร้อยแล้ว`);
};

// --- การแสดงผล
const currentPage = ref(1);
const pageSize = ref(10);
const pageSizeOptions = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
];

watch([searchQuery, searchBy, pageSize], () => {
  currentPage.value = 1;
});
</script>
