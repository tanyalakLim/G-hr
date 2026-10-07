<template>
  <div class="p-4 sm:p-6 flex-1 space-y-4">
    <!-- 1. ส่วนกำหนดต้นแบบและตำแหน่ง -->
    <div
      v-if="readonly"
      class="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs"
    >
      <div class="p-3 sm:p-4 flex items-start gap-4 bg-white hover:bg-slate-50/50 transition-colors">
        <span class="text-slate-500 font-medium w-40 flex-shrink-0">ต้นแบบตำแหน่ง</span>
        <span class="text-slate-900 font-semibold text-right">
          {{ templateOptions.find((t) => t.value === positionTemplate)?.label || '-' }}
        </span>
      </div>
      <div class="p-3 sm:p-4 flex items-start gap-4 bg-white hover:bg-slate-50/50 transition-colors">
        <span class="text-slate-500 font-medium w-40 flex-shrink-0">ตำแหน่ง</span>
        <span class="text-slate-900 text-right leading-relaxed whitespace-pre-line">
          {{ positionText.trim() || '-' }}
        </span>
      </div>
    </div>
    <div v-else class="space-y-3 gap-3 items-end">
      <div class="space-y-1">
        <label class="block text-[11px] font-medium text-slate-500">ต้นแบบตำแหน่ง</label>
        <UiSelect
          id="recipients-template-select"
          v-model="positionTemplate"
          :options="templateOptions"
          size="lg"
        />
      </div>
      <div class="space-y-1">
        <label class="block text-[11px] font-medium text-slate-500">ตำแหน่ง</label>
        <textarea
          v-model="positionText"
          rows="2"
          placeholder="ระบุตำแหน่ง"
          class="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 placeholder-slate-400 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-colors resize-y"
        />
      </div>
      <div class="flex items-center justify-end sm:col-span-2" />
    </div>

    <!-- 2. ตารางรายชื่อผู้ได้รับคำสั่ง -->
    <div class="space-y-3">
      <!-- ค้นหา + กรองตามคอลัมน์ -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <h3 class="font-bold text-sm text-slate-900">รายชื่อผู้ได้รับคำสั่ง</h3>
        <div class="flex items-center gap-2.5">
          <UiSelect
            id="recipients-search-by"
            v-model="searchBy"
            :options="searchByOptions"
            size="md"
            fit
          />
          <UiSearchInput
            id="recipients-search-input"
            v-model="searchQuery"
            placeholder="ค้นหารายชื่อ..."
            size="md"
            class="w-56"
          />
        </div>
      </div>

      <div class="border border-slate-200 rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/80 border-b border-slate-200/90 text-[12px] font-semibold text-slate-600 tracking-tight select-none">
                <th class="py-2.5 px-4 text-center w-16">ลำดับ</th>
                <th class="py-2.5 px-4">เลขประจำตัวประชาชน</th>
                <th class="py-2.5 px-4">ชื่อ - นามสกุล</th>
                <th class="py-2.5 px-4">ตำแหน่ง</th>
                <th class="py-2.5 px-4">ประเภทตำแหน่ง</th>
                <th class="py-2.5 px-4 text-right">เงินเดือน</th>
                <th v-if="!readonly" class="py-2.5 px-4 text-center w-32">จัดการ</th>
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
                <td class="py-3 px-4 text-slate-700">{{ person.positionType }}</td>
                <td class="py-3 px-4 text-right font-mono text-slate-700">{{ formatSalary(person.salary) }}</td>
                <td v-if="!readonly" class="py-3 px-4">
                  <div class="flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      class="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:text-blue-900 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      title="เลื่อนขึ้น"
                      :disabled="i === 0"
                      @click="moveRecipient(i, -1)"
                    >
                      <ChevronUp class="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      class="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:text-blue-900 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      title="เลื่อนลง"
                      :disabled="i === filteredRecipients.length - 1"
                      @click="moveRecipient(i, 1)"
                    >
                      <ChevronDown class="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      class="p-1.5 border border-slate-200 rounded-lg text-slate-600 hover:text-blue-900 hover:bg-slate-50 transition-colors cursor-pointer"
                      title="แก้ไข"
                      @click="editRecipient(person)"
                    >
                      <Pencil class="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="ลบข้อมูล"
                      @click="removeRecipient(person)"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredRecipients.length === 0">
                <td colspan="7">
                  <UiEmptyState message="ไม่พบรายชื่อผู้ได้รับคำสั่งตามเงื่อนไขที่ค้นหา" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ส่วนควบคุมการแสดงผลด้านล่าง -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
        <div class="flex items-center gap-1.5">
          <span>แสดงต่อหน้า:</span>
          <UiSelect v-model="pageSize" :options="pageSizeOptions" size="xs" fit />
          <span>แถวต่อหน้า</span>
        </div>
        <span>ทั้งหมด {{ filteredRecipients.length }} รายการ</span>
      </div>
    </div>

    <!-- ปุ่มบันทึก (ล่างสุด) -->
    <div v-if="!readonly" class="flex items-center justify-end pt-3 border-t border-slate-100">
      <UiButton id="btn-save-recipients-config" size="md" @click="handleSaveConfig">
        <template #icon>
          <Check class="w-4 h-4" />
        </template>
        บันทึกข้อมูล
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Check, ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-vue-next';
import { UiButton, UiEmptyState, UiSearchInput, UiSelect } from '../ui';
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

// --- ส่วนกำหนดต้นแบบและตำแหน่ง
const positionTemplate = ref('appraiser');
const positionText = ref('นักประเมินราคา');

const templateOptions = [
  { value: 'appraiser', label: 'ต้นแบบนักประเมินราคา' },
  { value: 'committee', label: 'ต้นแบบคณะกรรมการ' },
  { value: 'custom', label: 'กำหนดเอง' },
];

const handleSaveConfig = () => {
  show('บันทึกการกำหนดต้นแบบและตำแหน่งเรียบร้อยแล้ว');
};

// --- ตารางรายชื่อผู้ได้รับคำสั่ง
interface Recipient {
  citizenId: string;
  name: string;
  position: string;
  positionType: string;
  salary: number;
}

const recipients = ref<Recipient[]>([
  { citizenId: '3101200854321', name: 'นางสาวธาริภา กาณจนา', position: 'นักประเมินราคา', positionType: 'ทั่วไป (ปฏิบัติงาน)', salary: 18750 },
  { citizenId: '3102200901234', name: 'นางสาวกรกต นานนนา', position: 'นักประเมินราคา', positionType: 'ทั่วไป (ปฏิบัติงาน)', salary: 18750 },
  { citizenId: '3103300876543', name: 'นางจอมขวัญ นายขวัญ', position: 'นักประเมินราคา', positionType: 'ทั่วไป (ปฏิบัติงาน)', salary: 18750 },
]);

const searchQuery = ref('');
const searchBy = ref('all');

const searchByOptions = [
  { value: 'all', label: 'ทุกคอลัมน์' },
  { value: 'citizenId', label: 'เลขประจำตัวประชาชน' },
  { value: 'name', label: 'ชื่อ-นามสกุล' },
  { value: 'position', label: 'ตำแหน่ง' },
  { value: 'positionType', label: 'ประเภทตำแหน่ง' },
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
        p.positionType.toLowerCase().includes(q)
      );
    }
    const value = String(p[searchBy.value as keyof Recipient]).toLowerCase();
    return value.includes(q);
  });
});

const formatSalary = (value: number) => value.toLocaleString('th-TH');

// --- จัดลำดับ / แก้ไข / ลบ
const moveRecipient = (index: number, direction: -1 | 1) => {
  const target = index + direction;
  if (target < 0 || target >= recipients.value.length) return;
  const list = recipients.value;
  [list[index], list[target]] = [list[target], list[index]];
};

const editRecipient = (person: Recipient) => {
  show(`แก้ไขข้อมูล: ${person.name} (ยังไม่เปิดใช้งาน)`);
};

const removeRecipient = (person: Recipient) => {
  recipients.value = recipients.value.filter((p) => p.citizenId !== person.citizenId);
  show(`ลบรายชื่อ ${person.name} เรียบร้อยแล้ว`);
};

// --- การแสดงผล
const pageSize = ref(10);
const pageSizeOptions = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
];
</script>
