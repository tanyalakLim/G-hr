<template>
  <div class="flex flex-col min-h-full w-full">
    <!-- Top Action / Navigation Bar (component ui กลาง เหมือนหน้าค้นหาขั้นสูง) -->
    <PageActionBar
      back-label="ตัวชี้วัด"
      back-title="กลับไปหน้ารายการตัวชี้วัด"
      :badge="`เพิ่ม${typeLabel}`"
      subtitle="กำหนดรายละเอียด เกณฑ์คะแนน และขอบเขตหน่วยงาน/บุคลากร"
      @back="emit('cancel')"
    />

    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-4">
    <form class="space-y-4" @submit.prevent="save">
      <!-- กลุ่ม 1: ข้อมูลตัวชี้วัด -->
      <UiCard>
        <template #header>
          <h2 class="text-sm font-bold text-slate-800">ข้อมูลตัวชี้วัด</h2>
        </template>
        <div class="p-4 space-y-3">
          <!-- แถว 1: ชื่อตัวชี้วัด / ปีงบประมาณ / รอบการประเมิน -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-3">
            <UiInput
              v-model="form.name"
              placeholder="ชื่อตัวชี้วัด"
              :input-class="nameError ? 'text-sm !border-red-400' : 'text-sm'"
              size="lg"
              class="lg:col-span-8"
            />
            <div class="relative lg:col-span-2">
              <UiSelect
                v-model="form.fiscalYear"
                :options="fiscalYearOptions"
                placeholder="ปีงบประมาณ"
                size="lg"
                select-class="pl-9"
              />
              <Calendar class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-700" />
            </div>
            <UiSelect
              v-model="form.round"
              :options="roundOptions"
              placeholder="รอบการประเมิน"
              size="lg"
              class="lg:col-span-2"
            />
          </div>
          <p v-if="nameError" class="text-[11px] text-red-600 -mt-1">กรุณาระบุชื่อตัวชี้วัด</p>

          <!-- แถว 2: คำนำหน้า / หน่วยนับ / น้ำหนัก -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <UiInput v-model="form.prefix" placeholder="คำนำหน้า" size="lg" />
            <UiInput v-model="form.measureUnit" placeholder="หน่วยนับ" size="lg" />
            <UiInput v-model="form.weight" placeholder="น้ำหนัก" size="lg" />
          </div>
        </div>
      </UiCard>

      <!-- กลุ่ม 2: เกณฑ์ระดับคะแนน -->
      <UiCard>
        <template #header>
          <h2 class="text-sm font-bold text-slate-800">เกณฑ์ระดับคะแนน</h2>
        </template>
        <div class="p-4">
          <AppTable :columns="levelColumns" :data="levels" :show-toolbar="false" class="rounded-xl">
            <template #body>
              <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
                <tr v-for="(_, index) in levels" :key="index" class="hover:bg-slate-50/70 transition-colors">
                  <td class="py-4 px-4 text-center text-sm w-32">{{ levels.length - index }}</td>
                  <td class="py-3 px-4">
                    <UiInput
                      v-model="levels[index]"
                      :placeholder="`ครอบคลุมคำอธิบายของงาน ${levels.length - index}`"
                      size="md"
                    />
                  </td>
                </tr>
              </tbody>
            </template>
          </AppTable>
        </div>
      </UiCard>

      <!-- กลุ่ม 3: รายละเอียดตัวชี้วัด -->
      <UiCard>
        <template #header>
          <h2 class="text-sm font-bold text-slate-800">รายละเอียดตัวชี้วัด</h2>
        </template>
        <div class="p-4 space-y-3">
          <div>
            <label class="block text-xs font-medium text-slate-500 mb-1">นิยามหรือความหมาย</label>
            <textarea
              v-model="form.definition"
              rows="5"
              class="w-full text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 px-2.5 py-2 resize-y"
              placeholder="อธิบายความหมายของตัวชี้วัด เช่น สิ่งที่วัด ขอบเขต และวิธีการวัด"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-500 mb-1">สูตรคำนวณ</label>
            <textarea
              v-model="form.formula"
              rows="5"
              class="w-full text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 px-2.5 py-2 resize-y"
              placeholder="เช่น (จำนวนงานที่เสร็จตามกำหนด / จำนวนงานทั้งหมด) × 100"
            />
          </div>
        </div>
      </UiCard>

      <!-- กลุ่ม 4: ขอบเขต — หน่วยงาน + บุคลากร -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UiCard>
          <template #header>
            <h2 class="text-sm font-bold text-slate-800">หน่วยงาน/ส่วนราชการ</h2>
          </template>
          <div class="p-3 sm:p-4 space-y-2.5">
            <UiSearchInput v-model="unitSearch" placeholder="ค้นหา" />
            <div class="overflow-y-auto max-h-80 -mx-1 px-1">
              <UiTree
                :items="visibleTreeNodes"
                v-model:expanded="expandedUnitIds"
                :selected-id="selectedUnitId"
                @select="(node) => (selectedUnitId = node.id)"
              />
            </div>
          </div>
        </UiCard>

        <UiCard>
          <template #header>
            <h2 class="text-sm font-bold text-slate-800">บุคลากรที่เกี่ยวข้อง</h2>
          </template>
          <div class="p-3 sm:p-4 space-y-2.5">
            <UiSearchInput v-model="personSearch" placeholder="ค้นหา" />
            <div class="overflow-y-auto max-h-80 -mx-1 px-1">
              <UiTree
                :items="personTreeNodes"
                v-model:expanded="expandedPersonIds"
                :selected-id="selectedPersonId"
                @select="(node) => (selectedPersonId = node.id)"
              />
            </div>
          </div>
        </UiCard>
      </div>

      <!-- กลุ่ม 5: เอกสารอ้างอิง -->
      <UiCard>
        <template #header>
          <h2 class="text-sm font-bold text-slate-800">ข้อมูลเอกสารหลักฐาน</h2>
        </template>
        <div class="p-4">
          <textarea
            v-model="form.evidence"
            rows="5"
            class="w-full text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 px-2.5 py-2 resize-y"
            placeholder="ระบุเอกสารอ้างอิง เช่น รายงานผลการปฏิบัติงาน, ทะเบียนคุมงาน"
          />
        </div>
      </UiCard>

    </form>
    </div>

    <!-- Sticky footer: ปุ่มบันทึก (สไตล์เดียวกับ PageActionBar แต่อยู่ด้านล่าง — sticky ใน <main> ไม่ทับ Sidebar) -->
    <div class="sticky bottom-0 z-20 bg-white border-t border-slate-200 shadow-2xs">
      <div class="w-full px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3">
        <UiBadge
          :tone="completionPct === 100 ? 'emerald' : 'slate'"
          shape="chip"
          class="mr-auto flex-shrink-0"
        >
          กรอกข้อมูล {{ completedSections }}/{{ totalSections }} หัวข้อ
        </UiBadge>
        <UiButton variant="outline" @click="resetForm">ล้างฟอร์ม</UiButton>
        <UiButton variant="outline" @click="requestCancel">ยกเลิก</UiButton>
        <UiButton variant="primary" @click="save">
          <template #icon>
            <Save class="w-4 h-4" />
          </template>
          บันทึก
        </UiButton>
      </div>
    </div>

    <!-- ยืนยันการออกจากฟอร์มเมื่อมีข้อมูลกรอกค้างไว้ -->
    <UiModal :is-open="showDiscardConfirm" max-width="420px" @close="showDiscardConfirm = false">
      <template #header>
        <h2 class="text-sm font-bold text-slate-800">ออกจากฟอร์ม?</h2>
      </template>
      <p class="text-xs text-slate-600 leading-relaxed">
        ข้อมูลที่กรอกไว้จะไม่ถูกบันทึก ต้องการออกจากฟอร์มหรือไม่
      </p>
      <template #footer>
        <div class="flex items-center justify-end gap-2">
          <UiButton variant="outline" size="sm" @click="showDiscardConfirm = false">แก้ไขต่อ</UiButton>
          <UiButton variant="primary" size="sm" @click="confirmCancel">ออกจากฟอร์ม</UiButton>
        </div>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Calendar, Save } from 'lucide-vue-next';
import {
  AppTable,
  PageActionBar,
  UiBadge,
  UiButton,
  UiCard,
  UiInput,
  UiModal,
  UiSearchInput,
  UiSelect,
  UiTree,
} from '../ui';
import type { AppTableColumn } from '../ui';
import { ORG_UNITS } from '../../data/organizationData';
import { ACTING_CANDIDATES } from '../../data/actingData';
import {
  INDICATORS,
  INDICATOR_FISCAL_YEARS,
  INDICATOR_ROUNDS,
  INDICATOR_TYPE_LABELS,
  type IndicatorType,
} from '../../data/indicatorData';
import { useToast } from '../../composables/useToast';

const props = withDefaults(
  defineProps<{
    type?: IndicatorType;
  }>(),
  { type: 'plan' }
);

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'saved', code: string): void;
}>();

const { show } = useToast();

const typeLabel = computed(() => INDICATOR_TYPE_LABELS[props.type]);

// --- ฟอร์ม (placeholder เป็นตัวบอกชื่อฟิลด์ตามดีไซน์ในรูป)
const form = ref({
  name: '',
  fiscalYear: '',
  round: '',
  prefix: '',
  measureUnit: '',
  weight: '',
  definition: '',
  formula: '',
  evidence: '',
});

const fiscalYearOptions = INDICATOR_FISCAL_YEARS.map((y) => ({ value: String(y), label: String(y) }));
const roundOptions = INDICATOR_ROUNDS.filter((r) => r !== 'ทั้งหมด').map((r) => ({ value: r, label: r }));

// --- ตารางระดับคะแนน 5→1
const levels = ref<string[]>(['', '', '', '', '']);

const levelColumns: AppTableColumn[] = [
  { key: 'score', label: 'ระดับคะแนน', width: '128px', align: 'center' },
  { key: 'desc', label: 'ครอบคลุมคำอธิบายของงาน' },
];

// --- Tree หน่วยงาน (เลือกได้หน่วยงานเดียว)
const unitSearch = ref('');
const selectedUnitId = ref('');
const expandedUnitIds = ref<string[]>(['1000', '1001']);

const collectParentIds = (units: typeof ORG_UNITS): string[] => {
  const ids: string[] = [];
  const walk = (node: (typeof ORG_UNITS)[number]) => {
    if (node.children?.length) {
      ids.push(node.id);
      node.children.forEach(walk);
    }
  };
  units.forEach(walk);
  return ids;
};

interface UiTreeNodeInput {
  id: string;
  label: string;
  desc?: string;
  children?: UiTreeNodeInput[];
}

const subtreeMatches = (node: (typeof ORG_UNITS)[number], q: string): boolean => {
  const self =
    node.name.toLowerCase().includes(q) ||
    node.code.includes(q) ||
    (node.shortName ?? '').toLowerCase().includes(q);
  return self || (node.children ?? []).some((c) => subtreeMatches(c, q));
};

const visibleTreeNodes = computed<UiTreeNodeInput[]>(() => {
  const q = unitSearch.value.trim().toLowerCase();
  const toNodes = (units: typeof ORG_UNITS): UiTreeNodeInput[] =>
    units
      .filter((u) => (q ? subtreeMatches(u, q) : true))
      .map((u) => ({
        id: u.id,
        label: u.name,
        desc: `${u.code} ${u.shortName ?? ''}`.trim(),
        children: u.children ? toNodes(u.children) : undefined,
      }));
  return toNodes(ORG_UNITS);
});

watch(unitSearch, (q) => {
  if (q.trim()) expandedUnitIds.value = collectParentIds(ORG_UNITS);
});

// --- บุคลากรที่เกี่ยวข้อง (tree: รายชื่อใต้หัวข้อรวม, เลือกได้คนเดียว)
const personSearch = ref('');
const selectedPersonId = ref('');
const expandedPersonIds = ref<string[]>(['persons']);

const personTreeNodes = computed<UiTreeNodeInput[]>(() => {
  const q = personSearch.value.trim().toLowerCase();
  const persons = q
    ? ACTING_CANDIDATES.filter(
        (p) =>
          p.fullName.toLowerCase().includes(q) ||
          p.citizenId.includes(q) ||
          p.positionNumber.toLowerCase().includes(q)
      )
    : ACTING_CANDIDATES;
  return [
    {
      id: 'persons',
      label: `บุคลากรราชการ ${ACTING_CANDIDATES.length} คน`,
      children: persons.map((p) => ({
        id: p.id,
        label: p.fullName,
        desc: `${p.positionNumber} · ${p.jobTitle}`,
      })),
    },
  ];
});

watch(personSearch, (q) => {
  if (q.trim()) expandedPersonIds.value = ['persons'];
});

// --- บันทึก
const nameError = ref(false);

// --- ความคืบหน้าของฟอร์ม (นับเฉพาะหัวข้อหลักที่ควรกรอก)
const sectionChecks = computed(() => [
  Boolean(form.value.name.trim()),
  Boolean(form.value.fiscalYear),
  Boolean(form.value.round),
  Boolean(form.value.measureUnit.trim()),
  levels.value.some((l) => l.trim()),
  Boolean(form.value.definition.trim()),
  Boolean(form.value.formula.trim()),
  selectedUnitId.value !== '',
]);
const completedSections = computed(() => sectionChecks.value.filter(Boolean).length);
const totalSections = computed(() => sectionChecks.value.length);
const completionPct = computed(() =>
  totalSections.value === 0 ? 0 : Math.round((completedSections.value / totalSections.value) * 100)
);

// --- สถานะมีข้อมูลค้าง + ยืนยันก่อนออกจากฟอร์ม
const isDirty = computed(() =>
  form.value.name.trim() !== '' ||
  form.value.prefix.trim() !== '' ||
  form.value.measureUnit.trim() !== '' ||
  form.value.weight.trim() !== '' ||
  form.value.definition.trim() !== '' ||
  form.value.formula.trim() !== '' ||
  form.value.evidence.trim() !== '' ||
  levels.value.some((l) => l.trim()) ||
  selectedUnitId.value !== '' ||
  selectedPersonId.value !== ''
);

const showDiscardConfirm = ref(false);

const requestCancel = () => {
  if (isDirty.value) showDiscardConfirm.value = true;
  else emit('cancel');
};

const confirmCancel = () => {
  showDiscardConfirm.value = false;
  emit('cancel');
};

const resetForm = () => {
  form.value = {
    name: '',
    fiscalYear: '',
    round: '',
    prefix: '',
    measureUnit: '',
    weight: '',
    definition: '',
    formula: '',
    evidence: '',
  };
  levels.value = ['', '', '', '', ''];
  selectedUnitId.value = '';
  selectedPersonId.value = '';
  nameError.value = false;
  show('ล้างข้อมูลในฟอร์มแล้ว');
};

watch(
  () => form.value.name,
  (v) => {
    if (v.trim()) nameError.value = false;
  }
);

const save = () => {
  if (!form.value.name.trim()) {
    nameError.value = true;
    show('กรุณาระบุชื่อตัวชี้วัด');
    return;
  }

  const code = `HR-KPI-${String(INDICATORS.length + 1).padStart(2, '0')}`;
  INDICATORS.push({
    id: `ind-${Date.now()}`,
    type: props.type,
    code,
    title: form.value.name.trim(),
    unitId: selectedUnitId.value || '1000',
    fiscalYear: Number(form.value.fiscalYear) || INDICATOR_FISCAL_YEARS[0],
    round: form.value.round || 'ทั้งหมด',
    prefix: form.value.prefix.trim() || undefined,
    measureUnit: form.value.measureUnit.trim() || undefined,
    weight: form.value.weight.trim() || undefined,
    definition: form.value.definition.trim() || undefined,
    formula: form.value.formula.trim() || undefined,
    evidence: form.value.evidence.trim() || undefined,
    levels: levels.value.map((l) => l.trim()).some(Boolean) ? levels.value : undefined,
  });
  show(`บันทึก${typeLabel.value} "${form.value.name.trim()}" เรียบร้อยแล้ว`);
  emit('saved', code);
};
</script>
