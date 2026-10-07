<template>
  <div class="p-4 sm:p-6 flex-1 space-y-4">
    <!-- 1. ข้อมูลรายละเอียดคำสั่ง -->
    <!-- โหมดดูรายละเอียด: ข้อมูลละบรรทัด หัวข้อซ้าย ข้อมูลขวา เรียงบนลงล่าง -->
    <div v-if="readonly" class="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
      <div class="p-3 sm:p-4 flex items-start  gap-4 bg-white hover:bg-slate-50/50 transition-colors">
        <span class="text-slate-500 font-medium w-40 flex-shrink-0">คำสั่งเรื่อง</span>
        <span class="font-bold text-slate-900">{{ displayValue(form.title) }}</span>
      </div>
      <div class="p-3 sm:p-4 flex items-start  gap-4 bg-white hover:bg-slate-50/50 transition-colors">
        <span class="text-slate-500 font-medium w-40 flex-shrink-0">คำสั่งเลขที่</span>
        <span class="font-mono text-slate-900 text-right">{{ displayValue(form.orderNo) }}</span>
      </div>
      <div class="p-3 sm:p-4 flex items-start  gap-4 bg-white hover:bg-slate-50/50 transition-colors">
        <span class="text-slate-500 font-medium w-40 flex-shrink-0">ปี พ.ศ.</span>
        <span class="text-slate-900 text-right">{{ displayValue(form.fiscalYear) }}</span>
      </div>
      <div class="p-3 sm:p-4 flex items-start  gap-4 bg-white hover:bg-slate-50/50 transition-colors">
        <span class="text-slate-500 font-medium w-40 flex-shrink-0">วันที่ลงนาม</span>
        <span class="text-slate-900 text-right">{{ displayValue(form.signedDate) }}</span>
      </div>
      <div class="p-3 sm:p-4 flex items-start  gap-4 bg-white hover:bg-slate-50/50 transition-colors">
        <span class="text-slate-500 font-medium w-40 flex-shrink-0">วันที่คำสั่งมีผล</span>
        <span class="text-slate-900 text-right">{{ displayValue(form.effectiveDate) }}</span>
      </div>
      <div class="p-3 sm:p-4 flex items-start  gap-4 bg-white hover:bg-slate-50/50 transition-colors">
        <span class="text-slate-500 font-medium w-40 flex-shrink-0">เนื้อหาคำสั่งขั้นต้น</span>
        <span class="text-slate-900 text-right leading-relaxed whitespace-pre-line">{{ displayValue(form.intro) }}</span>
      </div>
      <div class="p-3 sm:p-4 flex items-start  gap-4 bg-white hover:bg-slate-50/50 transition-colors">
        <span class="text-slate-500 font-medium w-40 flex-shrink-0">เนื้อหาคำสั่งหลัก</span>
        <span class="text-slate-900 text-right leading-relaxed whitespace-pre-line">{{ displayValue(form.main) }}</span>
      </div>
      <div class="p-3 sm:p-4 flex items-start  gap-4 bg-white hover:bg-slate-50/50 transition-colors">
        <span class="text-slate-500 font-medium w-40 flex-shrink-0">เนื้อหาคำสั่งลงท้าย</span>
        <span class="text-slate-900 text-right leading-relaxed whitespace-pre-line">{{ displayValue(form.ending) }}</span>
      </div>
    </div>

    <!-- โหมดแก้ไข -->
    <div v-else class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <!-- คำสั่งเรื่อง -->
        <div class="space-y-1 sm:col-span-2">
          <label class="block text-[11px] font-medium text-slate-500">คำสั่งเรื่อง <span class="text-rose-500">*</span></label>
          <UiInput
            id="order-detail-title"
            v-model="form.title"
            size="lg"
            placeholder="ระบุหัวข้อคำสั่ง"
          />
        </div>

        <!-- คำสั่งเลขที่ / ปี พ.ศ. -->
        <div class="space-y-1">
          <label class="block text-[11px] font-medium text-slate-500">คำสั่งเลขที่ <span class="text-rose-500">*</span></label>
          <UiInput
            id="order-detail-no"
            v-model="form.orderNo"
            size="lg"
            placeholder="เช่น สนพ. 25/9"
          />
        </div>
        <div class="space-y-1">
          <label class="block text-[11px] font-medium text-slate-500">ปี พ.ศ. <span class="text-rose-500">*</span></label>
          <UiSelect
            id="order-detail-year"
            v-model="form.fiscalYear"
            :options="yearOptions"
            size="lg"
          />
        </div>

        <!-- วันที่ลงนาม / วันที่คำสั่งมีผล -->
        <div class="space-y-1">
          <label class="block text-[11px] font-medium text-slate-500">วันที่ลงนาม</label>
          <UiInput
            id="order-detail-signed-date"
            v-model="form.signedDate"
            type="date"
            size="lg"
          />
        </div>
        <div class="space-y-1">
          <label class="block text-[11px] font-medium text-slate-500">วันที่คำสั่งมีผล</label>
          <UiInput
            id="order-detail-effective-date"
            v-model="form.effectiveDate"
            type="date"
            size="lg"
          />
        </div>
      </div>

      <!-- เนื้อหาคำสั่ง 3 ส่วน -->
      <div class="space-y-3">
        <div class="space-y-1">
          <label class="block text-[11px] font-medium text-slate-500">
            เนื้อหาคำสั่งขั้นต้น <span class="text-slate-400">(optional)</span>
          </label>
          <textarea
            v-model="form.intro"
            rows="2"
            placeholder="ข้อความเกริ่นนำคำสั่ง เช่น อ้างอิงคำสั่งหรือระเบียบที่เกี่ยวข้อง"
            class="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 placeholder-slate-400 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-colors resize-y"
          />
        </div>

        <div class="space-y-1">
          <label class="block text-[11px] font-medium text-slate-500">
            เนื้อหาคำสั่งหลัก <span class="text-rose-500">*</span>
          </label>
          <textarea
            v-model="form.main"
            rows="6"
            placeholder="ร่างข้อความคำสั่งตามกฎหมายและระเบียบข้าราชการกรุงเทพมหานคร"
            class="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 placeholder-slate-400 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-colors resize-y"
          />
          <p class="text-[11px] text-slate-400 leading-relaxed">
            ตัวอย่างร่าง: โดยอาศัยอำนาจตามความในมาตรา ... แห่งพระราชบัญญัติระเบียบข้าราชการกรุงเทพมหานคร
            พ.ศ. 2528 อธิบดีกรุงเทพมหานครจึงสั่ง...
          </p>
        </div>

        <div class="space-y-1">
          <label class="block text-[11px] font-medium text-slate-500">
            เนื้อหาคำสั่งลงท้าย <span class="text-slate-400">(optional)</span>
          </label>
          <textarea
            v-model="form.ending"
            rows="2"
            placeholder="ข้อความส่วนท้ายคำสั่ง เช่น ให้ผู้เกี่ยวข้องปฏิบัติตามคำสั่งนี้"
            class="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 placeholder-slate-400 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-colors resize-y"
          />
        </div>
      </div>
    </div>

    <!-- 2. รายชื่อผู้ลงนามในแนบท้ายคำสั่ง -->
    <div class="space-y-3">
      <div class="flex items-center justify-between gap-3 pt-2">
        <h3 class="font-bold text-sm text-slate-900">รายชื่อผู้ลงนามในแนบท้ายคำสั่ง</h3>
        <button
          v-if="!readonly"
          type="button"
          class="h-8 px-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-blue-900 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          @click="isAddSignerModalOpen = true"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>เพิ่มผู้ลงนาม</span>
        </button>
      </div>

      <div class="border border-slate-200 rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/80 border-b border-slate-200/90 text-[12px] font-semibold text-slate-600 tracking-tight select-none">
                <th class="py-2.5 px-4 text-center w-16">ลำดับ</th>
                <th class="py-2.5 px-4">บทบาท</th>
                <th class="py-2.5 px-4">ชื่อ - นามสกุล</th>
                <th class="py-2.5 px-4">เลขที่ตำแหน่ง</th>
                <th class="py-2.5 px-4">ตำแหน่ง</th>
                <th v-if="!readonly" class="py-2.5 px-4 text-center w-28">จัดการ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-xs">
              <tr
                v-for="(signer, i) in signers"
                :key="signer.id"
                class="hover:bg-slate-50/50 transition-colors"
              >
                <td class="py-3 px-4 text-center text-slate-500 font-medium">{{ i + 1 }}</td>
                <td class="py-3 px-4">
                  <UiBadge tone="blue" shape="chip">{{ signer.role }}</UiBadge>
                </td>
                <td class="py-3 px-4 font-semibold text-slate-900">{{ signer.name }}</td>
                <td class="py-3 px-4 font-mono text-slate-600">{{ signer.positionNo }}</td>
                <td class="py-3 px-4 text-slate-700">{{ signer.position }}</td>
                <td v-if="!readonly" class="py-3 px-4">
                  <div class="flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      class="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:text-blue-900 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      title="เลื่อนขึ้น"
                      :disabled="i === 0"
                      @click="moveSigner(i, -1)"
                    >
                      <ChevronUp class="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      class="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:text-blue-900 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      title="เลื่อนลง"
                      :disabled="i === signers.length - 1"
                      @click="moveSigner(i, 1)"
                    >
                      <ChevronDown class="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="ลบข้อมูล"
                      @click="removeSigner(i)"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="signers.length === 0">
                <td colspan="6">
                  <UiEmptyState message="ยังไม่มีรายชื่อผู้ลงนาม กดปุ่ม เพิ่มผู้ลงนาม เพื่อเพิ่มรายการ" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
    </div>

    <!-- ปุ่มบันทึก (ล่างสุด) -->
    <div v-if="!readonly" class="flex items-center justify-end pt-3 border-t border-slate-100">
      <UiButton id="btn-save-order-detail" size="md" @click="handleSave">
        <template #icon>
          <Check class="w-4 h-4" />
        </template>
        บันทึกข้อมูล
      </UiButton>
    </div>

    <!-- Modal: เพิ่มรายชื่อลงนามในแนบท้ายคำสั่ง -->
    <UiModal
      :is-open="isAddSignerModalOpen"
      max-width="max-w-xl sm:max-w-2xl"
      title="เพิ่มรายชื่อลงนามในแนบท้ายคำสั่ง"
      @close="isAddSignerModalOpen = false"
    >
      <template #icon>
        <PenLine class="w-5 h-5 text-blue-900" />
      </template>

      <div class="space-y-4 text-xs">
        <!-- ส่วนที่ 1: เลือกบทบาท -->
        <div>
          <h4 class="font-bold text-slate-900 mb-2">1. เลือกบทบาท</h4>
          <UiSelect
            id="signer-role-select"
            v-model="signerRole"
            :options="roleOptions"
            size="lg"
          />
        </div>

        <!-- ส่วนที่ 2: เลือกรายชื่อ -->
        <div class="space-y-3">
          <h4 class="font-bold text-slate-900">2. เลือกรายชื่อ</h4>

          <!-- ตัวกรอง + ค้นหา -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <label class="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                v-model="onlyActing"
                type="checkbox"
                class="w-4 h-4 rounded text-blue-900 border-slate-300 focus:ring-blue-700 cursor-pointer"
              />
              <span class="text-slate-700">แสดงเฉพาะรักษาการแทน</span>
            </label>
            <UiSearchInput
              id="signer-search-input"
              v-model="signerSearch"
              placeholder="ค้นหารายชื่อ..."
              size="md"
              class="sm:w-56"
            />
          </div>

          <!-- ตารางรายชื่อ -->
          <div class="border border-slate-200 rounded-xl overflow-hidden">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/80 border-b border-slate-200/90 text-[12px] font-semibold text-slate-600 tracking-tight select-none">
                  <th class="py-2.5 px-4 w-10"></th>
                  <th class="py-2.5 px-4">ชื่อ - นามสกุล</th>
                  <th class="py-2.5 px-4">เลขที่ตำแหน่ง</th>
                  <th class="py-2.5 px-4">ตำแหน่งใต้ลายเซ็น</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="person in filteredCandidates"
                  :key="person.positionNo"
                  class="hover:bg-slate-50/50 transition-colors cursor-pointer"
                  @click="toggleCandidate(person)"
                >
                  <td class="py-3 px-4">
                    <input
                      type="checkbox"
                      class="w-4 h-4 rounded text-blue-900 border-slate-300 focus:ring-blue-700 cursor-pointer"
                      :checked="selectedCandidates.includes(person.positionNo)"
                      @click.stop
                      @change="toggleCandidate(person)"
                    />
                  </td>
                  <td class="py-3 px-4 font-semibold text-slate-900">{{ person.name }}</td>
                  <td class="py-3 px-4 font-mono text-slate-600">{{ person.positionNo }}</td>
                  <td class="py-3 px-4 text-slate-700">{{ person.signPosition }}</td>
                </tr>
                <tr v-if="filteredCandidates.length === 0">
                  <td colspan="4">
                    <UiEmptyState message="ไม่พบรายชื่อตามเงื่อนไขที่ค้นหา" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
            @click="isAddSignerModalOpen = false"
          >
            ยกเลิก
          </button>
          <UiButton size="md" @click="confirmAddSigners">
            <template #icon>
              <Check class="w-4 h-4" />
            </template>
            เพิ่มรายชื่อ
          </UiButton>
        </div>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { Check, ChevronDown, ChevronUp, PenLine, Plus, Trash2 } from 'lucide-vue-next';
import {
  UiBadge,
  UiButton,
  UiEmptyState,
  UiInput,
  UiModal,
  UiSearchInput,
  UiSelect,
} from '../ui';
import { useToast } from '../../composables/useToast';

const { show } = useToast();

const props = withDefaults(
  defineProps<{
    readonly?: boolean;
  }>(),
  {
    readonly: false,
  }
);

// --- ฟอร์มรายละเอียดคำสั่ง
const form = reactive({
  title: 'บรรจุและแต่งตั้งผู้สอบแข่งขันได้',
  orderNo: 'สนพ. 25/9',
  fiscalYear: '2569',
  signedDate: '',
  effectiveDate: '',
  intro: '',
  main: '',
  ending: '',
});

const yearOptions = [
  { value: '2569', label: '2569' },
  { value: '2568', label: '2568' },
  { value: '2567', label: '2567' },
];

const displayValue = (value: string) => (value && value.trim() ? value : '-');

const handleSave = () => {
  if (!form.title.trim() || !form.orderNo.trim() || !form.main.trim()) {
    show('กรุณากรอกคำสั่งเรื่อง เลขที่คำสั่ง และเนื้อหาคำสั่งหลัก');
    return;
  }
  show('บันทึกรายละเอียดคำสั่งเรียบร้อยแล้ว');
};

// --- รายชื่อผู้ลงนาม
interface Signer {
  id: number;
  role: string;
  name: string;
  positionNo: string;
  position: string;
}

const signers = ref<Signer[]>([
  {
    id: 1,
    role: 'เจ้าหน้าที่ดำเนินการ',
    name: 'นายสมชาย ใจดี',
    positionNo: 'สนพ.ผล. 16',
    position: 'นักวิเคราะห์นโยบายและแผน',
  },
]);

// --- Modal เพิ่มรายชื่อลงนาม
const isAddSignerModalOpen = ref(false);
const signerRole = ref('ผู้ลงนามแนบท้าย');
const onlyActing = ref(false);
const signerSearch = ref('');
const selectedCandidates = ref<string[]>([]);

const roleOptions = [
  { value: 'ผู้ลงนามแนบท้าย', label: 'ผู้ลงนามแนบท้าย' },
  { value: 'เจ้าหน้าที่ดำเนินการ', label: 'เจ้าหน้าที่ดำเนินการ' },
  { value: 'ผู้ตรวจสอบ', label: 'ผู้ตรวจสอบ' },
];

interface Candidate {
  name: string;
  positionNo: string;
  signPosition: string;
  isActing?: boolean;
}

const candidates: Candidate[] = [
  { name: 'นายวิชาญ เจริญสุข', positionNo: 'กบท. 1', signPosition: 'ผู้อำนวยการสำนักงาน', isActing: true },
  { name: 'นายสมชาย ใจดี', positionNo: 'สนพ.ฝล. 16', signPosition: 'นักวิเคราะห์นโยบายและแผน' },
  { name: 'นางสาวบัวขาว อารีรักษ์', positionNo: 'สนพ.งป. 5', signPosition: 'นักจัดการงานทั่วไป', isActing: true },
  { name: 'นายเกริก สัจจวัตร', positionNo: 'สนพ. 1', signPosition: 'เจ้าหน้าที่พัสดุ' },
];

const filteredCandidates = computed(() => {
  let list = candidates;
  if (onlyActing.value) {
    list = list.filter((c) => c.isActing);
  }
  const q = signerSearch.value.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.positionNo.toLowerCase().includes(q) ||
        c.signPosition.toLowerCase().includes(q)
    );
  }
  return list;
});

const toggleCandidate = (person: Candidate) => {
  const idx = selectedCandidates.value.indexOf(person.positionNo);
  if (idx >= 0) {
    selectedCandidates.value.splice(idx, 1);
  } else {
    selectedCandidates.value.push(person.positionNo);
  }
};

const confirmAddSigners = () => {
  const chosen = candidates.filter((c) => selectedCandidates.value.includes(c.positionNo));
  if (chosen.length === 0) {
    show('กรุณาเลือกรายชื่ออย่างน้อย 1 คน');
    return;
  }
  chosen.forEach((c) => {
    signers.value.push({
      id: Date.now() + Math.random(),
      role: signerRole.value,
      name: c.name,
      positionNo: c.positionNo,
      position: c.signPosition,
    });
  });
  selectedCandidates.value = [];
  signerSearch.value = '';
  onlyActing.value = false;
  isAddSignerModalOpen.value = false;
  show(`เพิ่มรายชื่อลงนาม ${chosen.length} รายการเรียบร้อยแล้ว`);
};

const moveSigner = (index: number, direction: -1 | 1) => {
  const target = index + direction;
  if (target < 0 || target >= signers.value.length) return;
  const list = signers.value;
  [list[index], list[target]] = [list[target], list[index]];
};

const removeSigner = (index: number) => {
  signers.value.splice(index, 1);
  show('ลบรายชื่อผู้ลงนามเรียบร้อยแล้ว');
};
</script>
