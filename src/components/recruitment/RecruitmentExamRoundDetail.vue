<template>
  <div class="flex flex-col min-h-full w-full">
    <!-- Header: ย้อนกลับ + ชื่อหน้า (PageActionBar) -->
    <PageActionBar
      back-label="ย้อนกลับ"
      back-title="กลับไปหน้าจัดการรอบสอบแข่งขัน"
      badge="จัดการรอบสอบแข่งขัน"
      :subtitle="roundName"
      @back="router.back()"
    >
      <template #actions>
        <UiButton variant="outline" size="sm" title="ดาวน์โหลดไฟล์เอกสารประกอบรอบสอบ" @click="downloadFiles">
          <template #icon>
            <Download class="w-4 h-4" />
          </template>
          ดาวน์โหลดไฟล์
        </UiButton>
        <UiButton size="sm" title="บรรจุผู้ผ่านการสอบแข่งขันเข้ารับราชการ" @click="appointModalOpen = true">
          <template #icon>
            <UserPlus class="w-4 h-4" />
          </template>
          บรรจุผู้ผ่านการสอบแข่งขัน
        </UiButton>
      </template>
    </PageActionBar>

    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-4">
      <!-- สถิติภาพรวมของผู้สมัคร -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <UiStatCard
          title="ผู้สมัครสอบทั้งหมด"
          :value="applicants.length"
          unit="ราย"
          tone="blue"
          :icon="Users"
          layout="vertical"
          :hint="`แสดงผลหน้าละ ${pageSize} รายการ`"
        />
        <UiStatCard
          title="สอบผ่าน"
          :value="passCount"
          unit="ราย"
          tone="emerald"
          :icon="CircleCheck"
          layout="vertical"
          hint="ผ่านเกณฑ์การคัดเลือก"
        />
        <UiStatCard
          title="สอบไม่ผ่าน"
          :value="failCount"
          unit="ราย"
          tone="amber"
          :icon="CircleX"
          layout="vertical"
          :hint="failCount > 0 ? lastFailNames : 'ไม่มีผู้สอบไม่ผ่าน'"
          wrap-title
        />
      </div>

      <!-- การ์ดหลัก: ฟิลเตอร์ + ตารางรายชื่อผู้สมัคร -->
      <div class="bg-white rounded-xl items-center border border-slate-200/90 shadow-sm overflow-hidden">
        <!-- Toolbar: ค้นหา + ตัวกรองผลการสอบ + เลือกคอลัมน์ -->
        <div class="p-4 sm:p-5 space-y-4 border-b border-slate-200/90">
          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <UiSearchInput
              id="applicant-search-input"
              v-model="searchQuery"
              placeholder="ระบุคำค้นหา เช่น ชื่อ-นามสกุล, เลขประจำตัวสอบ, เลขประจำตัวประชาชน..."
              size="lg"
              class="flex-1 min-w-0"
            />
            <div class="flex items-center justify-end gap-3 shrink-0">
              <UiDropdownButton
                :label="`ผลการสอบ: ${resultFilterLabel}`"
                menu-title="กรองตามผลการสอบ"
                :items="resultFilterItems"
                align="left"
                @select="(item) => (resultFilter = item.value as ResultFilter)"
              />
              <div class="relative">
                <button
                  type="button"
                  class="h-9 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                  @click="columnMenuOpen = !columnMenuOpen"
                >
                  <SlidersHorizontal class="w-3.5 h-3.5 text-slate-500" />
                  <span>คอลัมน์</span>
                </button>
                <div
                  v-if="columnMenuOpen"
                  class="absolute right-0 top-10 z-20 w-56 rounded-xl border border-slate-200 bg-white shadow-lg p-3 space-y-2 max-h-80 overflow-y-auto"
                >
                  <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">แสดงคอลัมน์</p>
                  <label
                    v-for="col in columnDefs"
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

        <!-- ตารางรายชื่อผู้สมัคร -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-100/90 border-b border-slate-200/90 text-xs font-semibold text-slate-700 select-none">
                <th class="py-3 px-4 w-[1%]"></th>
                <th v-if="showCol('no')" class="py-3 px-4 min-w-[70px] text-center">ลำดับ</th>
                <th v-if="showCol('examNo')" class="py-3 px-4 min-w-[110px]">เลขประจำตัวสอบ</th>
                <th v-if="showCol('citizenId')" class="py-3 px-4 min-w-[140px]">เลขประจำตัวประชาชน</th>
                <th v-if="showCol('fullName')" class="py-3 px-4 min-w-[190px]">ชื่อ-นามสกุล</th>
                <th v-if="showCol('account')" class="py-3 px-4 min-w-[100px]">บัญชีสอบ</th>
                <th v-if="showCol('birthDate')" class="py-3 px-4 min-w-[110px]">วันเดือนปีเกิด</th>
                <th v-if="showCol('gender')" class="py-3 px-4 min-w-[70px]">เพศ</th>
                <th v-if="showCol('position')" class="py-3 px-4 min-w-[220px]">ตำแหน่งและระดับที่สมัคร</th>
                <th v-if="showCol('school')" class="py-3 px-4 min-w-[200px]">สถานศึกษา</th>
                <th v-if="showCol('degree')" class="py-3 px-4 min-w-[110px]">วุฒิการศึกษา</th>
                <th v-if="showCol('major')" class="py-3 px-4 min-w-[180px]">สาขาวิชาเอก</th>
                <th v-if="showCol('screening')" class="py-3 px-4 min-w-[150px]">สถานะการคัดกรองคุณสมบัติ</th>
                <th v-if="showCol('totalScore')" class="py-3 px-4 min-w-[100px] text-center">คะแนนรวม</th>
                <th v-if="showCol('result')" class="py-3 px-4 min-w-[110px]">ผลการสอบ</th>
                <th v-if="showCol('rank')" class="py-3 px-4 min-w-[110px] text-center">ลำดับที่สอบได้</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
              <tr
                v-for="(item, idx) in pagedApplicants"
                :key="item.citizenId"
                class="hover:bg-slate-50/70 transition-colors"
                :class="idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'"
              >
                <td class="py-3 px-4">
                  <UiIconButton tone="ghost" :title="`ดูรายละเอียดผู้สมัคร ${item.fullName}`" @click="router.push(applicantDetailPath(item))">
                    <Eye class="w-4 h-4 text-blue-700" />
                  </UiIconButton>
                </td>
                <td v-if="showCol('no')" class="py-3.5 px-4 text-center text-slate-500 tabular-nums">
                  {{ filteredApplicants.indexOf(item) + 1 }}
                </td>
                <td v-if="showCol('examNo')" class="py-3.5 px-4 tabular-nums text-slate-600">{{ item.examNo }}</td>
                <td v-if="showCol('citizenId')" class="py-3.5 px-4 tabular-nums font-mono">{{ formatCitizenId(item.citizenId) }}</td>
                <td v-if="showCol('fullName')" class="py-3.5 px-4 font-semibold text-blue-950 whitespace-nowrap">{{ item.fullName }}</td>
                <td v-if="showCol('account')" class="py-3.5 px-4 tabular-nums">{{ item.account }}</td>
                <td v-if="showCol('birthDate')" class="py-3.5 px-4 tabular-nums text-slate-600">{{ item.birthDate }}</td>
                <td v-if="showCol('gender')" class="py-3.5 px-4">{{ item.gender }}</td>
                <td v-if="showCol('position')" class="py-3.5 px-4">{{ item.position }}</td>
                <td v-if="showCol('school')" class="py-3.5 px-4">{{ item.school }}</td>
                <td v-if="showCol('degree')" class="py-3.5 px-4">{{ item.degree }}</td>
                <td v-if="showCol('major')" class="py-3.5 px-4">{{ item.major }}</td>
                <td v-if="showCol('screening')" class="py-3.5 px-4">
                  <UiBadge :tone="item.screening === 'ผ่าน' ? 'emerald' : 'red'" shape="chip">{{ item.screening }}</UiBadge>
                </td>
                <td v-if="showCol('totalScore')" class="py-3.5 px-4 text-center tabular-nums font-semibold">{{ item.totalScore.toFixed(2) }}</td>
                <td v-if="showCol('result')" class="py-3.5 px-4">
                  <UiBadge :tone="item.result === 'pass' ? 'emerald' : 'red'" shape="chip">
                    {{ item.result === 'pass' ? 'สอบผ่าน' : 'สอบไม่ผ่าน' }}
                  </UiBadge>
                </td>
                <td v-if="showCol('rank')" class="py-3.5 px-4 text-center tabular-nums">
                  {{ item.rank ? `อันดับ ${item.rank}` : '-' }}
                </td>
              </tr>
              <tr v-if="pagedApplicants.length === 0">
                <td :colspan="columnDefs.length + 1">
                  <UiEmptyState message="ไม่พบรายชื่อผู้สมัครสอบตามเงื่อนไขที่ระบุ" />
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
          <span>ทั้งหมด {{ filteredApplicants.length }} รายการ</span>
          <UiPagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="filteredApplicants.length"
            :page-size-options="[10, 20, 50]"
          />
        </div>
      </div>
    </div>

    <!-- Modal ยืนยันบรรจุผู้ผ่านการสอบแข่งขัน -->
    <UiModal
      :is-open="appointModalOpen"
      title="ยืนยันการบรรจุผู้ผ่านการสอบแข่งขัน"
      :subtitle="`ต้องการบรรจุผู้ผ่านการสอบแข่งขันจำนวน ${passCount} รายเข้ารับราชการ โดยเรียงตามลำดับที่สอบได้ หรือไม่?`"
      max-width="max-w-md"
      @close="appointModalOpen = false"
    >
      <template #icon>
        <UserPlus class="w-5 h-5 text-blue-900" />
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton variant="outline" @click="appointModalOpen = false">ยกเลิก</UiButton>
          <UiButton @click="confirmAppoint">ยืนยันบรรจุ</UiButton>
        </div>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  CircleCheck,
  CircleX,
  Download,
  Eye,
  SlidersHorizontal,
  UserPlus,
  Users,
  X,
} from 'lucide-vue-next';
import {
  PageActionBar,
  UiBadge,
  UiButton,
  UiDropdownButton,
  UiEmptyState,
  UiIconButton,
  UiModal,
  UiPagination,
  UiSearchInput,
  UiSelect,
  UiStatCard,
} from '../ui';
import { useToast } from '../../composables/useToast';
import { EXAM_APPLICANTS, formatCitizenId, type ExamApplicant } from '../../data/examApplicants';

const { show } = useToast();
const route = useRoute();
const router = useRouter();

// --- ข้อมูลรอบสอบ (จำลอง — อ้างอิงตาม id จากหน้าจัดการรอบสอบแข่งขัน)
const roundInfo: Record<string, { name: string }> = {
  '1': { name: 'การสอบแข่งขันเพื่อบรรจุและแต่งตั้งบุคคลเข้ารับราชการตำแหน่งนักประเมินราคา ครั้งที่ 1 ปีงบประมาณ 2569' },
  '2': { name: 'การสอบแข่งขันเพื่อบรรจุบุคคลเข้ารับราชการตำแหน่งนักวิเคราะห์นโยบายและแผน ครั้งที่ 1 ปีงบประมาณ 2569' },
  '3': { name: 'การสอบแข่งขันเพื่อบรรจุบุคคลเข้ารับราชการตำแหน่งเจ้าหน้าที่ทั่วไป ครั้งที่ 2 ปีงบประมาณ 2568' },
};
const roundName = roundInfo[String(route.params.id)]?.name ?? 'รายละเอียดรอบสอบแข่งขัน';

// --- ข้อมูลผู้สมัครสอบจำลอง (18 รายการ: ผ่าน 17 / ไม่ผ่าน 1) — ใช้ร่วมกับหน้ารายละเอียดผู้สมัคร
const applicants = ref<ExamApplicant[]>(EXAM_APPLICANTS);

// --- สถิติภาพรวม
const passCount = computed(() => applicants.value.filter((a) => a.result === 'pass').length);
const failCount = computed(() => applicants.value.filter((a) => a.result === 'fail').length);
const lastFailNames = computed(() => {
  const names = applicants.value.filter((a) => a.result === 'fail').map((a) => a.fullName);
  return `ได้แก่ ${names.join(', ')}`;
});

// --- เลือกคอลัมน์
const columnMenuOpen = ref(false);
const hiddenCols = ref<string[]>([]);
const columnDefs = [
  { key: 'no', label: 'ลำดับ' },
  { key: 'examNo', label: 'เลขประจำตัวสอบ' },
  { key: 'citizenId', label: 'เลขประจำตัวประชาชน' },
  { key: 'fullName', label: 'ชื่อ-นามสกุล' },
  { key: 'account', label: 'บัญชีสอบ' },
  { key: 'birthDate', label: 'วันเดือนปีเกิด' },
  { key: 'gender', label: 'เพศ' },
  { key: 'position', label: 'ตำแหน่งและระดับที่สมัคร' },
  { key: 'school', label: 'สถานศึกษา' },
  { key: 'degree', label: 'วุฒิการศึกษา' },
  { key: 'major', label: 'สาขาวิชาเอก' },
  { key: 'screening', label: 'สถานะการคัดกรองคุณสมบัติ' },
  { key: 'totalScore', label: 'คะแนนรวม' },
  { key: 'result', label: 'ผลการสอบ' },
  { key: 'rank', label: 'ลำดับที่สอบได้' },
];

const showCol = (key: string) => !hiddenCols.value.includes(key);
const toggleColumn = (key: string) => {
  hiddenCols.value = hiddenCols.value.includes(key)
    ? hiddenCols.value.filter((k) => k !== key)
    : [...hiddenCols.value, key];
};

// --- ตัวกรองผลการสอบ
type ResultFilter = 'all' | 'pass' | 'fail';
const resultFilter = ref<ResultFilter>('all');
const resultFilterItems: { value: string; label: string }[] = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'pass', label: 'สอบผ่าน' },
  { value: 'fail', label: 'สอบไม่ผ่าน' },
];
const resultFilterLabel = computed(
  () => resultFilterItems.find((i) => i.value === resultFilter.value)?.label ?? 'ทั้งหมด'
);

// --- ปุ่มดาวน์โหลดไฟล์ / บรรจุผู้ผ่านการสอบแข่งขัน
const downloadFiles = () => show('กำลังดาวน์โหลดไฟล์เอกสารประกอบรอบสอบแข่งขัน');

const appointModalOpen = ref(false);
const confirmAppoint = () => {
  appointModalOpen.value = false;
  show(`บรรจุผู้ผ่านการสอบแข่งขันจำนวน ${passCount.value} ราย เรียบร้อยแล้ว`);
};

// --- เส้นทางไปหน้ารายละเอียดผู้สมัคร
const applicantDetailPath = (item: ExamApplicant) =>
  `/recruitment/recruitment_exam_round/${route.params.id}/applicant/${item.citizenId}`;

// --- Filtering
const searchQuery = ref('');

const filteredApplicants = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  let list = [...applicants.value];
  if (resultFilter.value !== 'all') {
    list = list.filter((a) => a.result === resultFilter.value);
  }
  if (!q) return list;
  return list.filter(
    (a) =>
      a.fullName.toLowerCase().includes(q) ||
      a.examNo.includes(q) ||
      a.citizenId.includes(q) ||
      a.school.toLowerCase().includes(q)
  );
});

// --- Active Filter Chips / clear
const hasActiveFilters = computed(() => !!searchQuery.value.trim() || resultFilter.value !== 'all');

const activeFilterChips = computed(() => {
  const chips: { key: string; label: string; clear: () => void }[] = [];
  if (resultFilter.value !== 'all') {
    chips.push({
      key: 'result',
      label: `ผลการสอบ: ${resultFilterLabel.value}`,
      clear: () => (resultFilter.value = 'all'),
    });
  }
  if (searchQuery.value.trim()) {
    chips.push({
      key: 'q',
      label: `คำค้นหา: ${searchQuery.value.trim()}`,
      clear: () => (searchQuery.value = ''),
    });
  }
  return chips;
});

// --- Pagination (หน้าละ 10 รายการ)
const currentPage = ref(1);
const pageSize = ref(10);
const pageSizeOptions = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
];

const pagedApplicants = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredApplicants.value.slice(start, start + pageSize.value);
});

watch([searchQuery, resultFilter, pageSize], () => {
  currentPage.value = 1;
});
</script>
