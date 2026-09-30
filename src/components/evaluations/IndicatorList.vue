<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-3">
    <!-- Page Title (เฉพาะตามประเภทของหน้า) -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
      <PageTitle :title="pageMeta.title" :subtitle="pageMeta.subtitle" />
    </div>

    <!-- Main Card -->
    <div class="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div class="grid grid-cols-1 lg:grid-cols-12">
        <!-- Unit Tree Panel (เฉพาะหน้าตามแผน — ซ่อนเมื่อแสดงทั้งหมด) -->
        <aside v-show="!isCompactMode && !showAll" class="lg:col-span-3 p-3 sm:p-4 lg:border-r border-slate-100">
          <div class="rounded-xl flex flex-col h-full min-h-[420px]">
            <!-- Tree Header -->
            <div class="flex items-center justify-between gap-2 pb-2.5">
              <h3 class="text-xs font-bold text-slate-800">หน่วยงาน/ส่วนราชการ</h3>
              <button
                type="button"
                class="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 hover:text-blue-900 transition-colors cursor-pointer"
                @click="toggleExpandAll"
              >
                <Plus class="w-3 h-3" />
                <span>{{ allExpanded ? 'ยุบทั้งหมด' : 'ขยายทั้งหมด' }}</span>
              </button>
            </div>

            <!-- Tree Search -->
            <div class="pb-2.5">
              <UiSearchInput v-model="unitSearch" placeholder="ค้นหา" />
            </div>

            <!-- Unit Tree -->
            <div class="flex-1 overflow-y-auto max-h-[520px] -mx-1 px-1">
              <UiTree
                :items="visibleTreeNodes"
                v-model:expanded="expandedUnitIds"
                :selected-id="selectedUnitId"
                @select="(node) => (selectedUnitId = node.id)"
              />
            </div>
          </div>
        </aside>

        <!-- Indicator Table Section -->
        <section
          class="p-3 sm:p-4 space-y-4"
          :class="isCompactMode || showAll ? 'lg:col-span-12' : 'lg:col-span-9'"
        >
         <!-- การ์ดสรุปจำนวนตัวชี้วัดแต่ละประเภท -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <UiStatCard v-for="card in cards"
            :key="card.key"
              :title="card.label"
              :value="card.count"
              unit="รายการ"
              :tone="card.tone"
              :icon="card.icon"
              layout="vertical"
            />
        </div>
          <!-- Table Toolbar -->
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            
            <div class="flex flex-wrap items-center gap-2">
              <UiSelect
                v-if="isPositionMode"
                v-model="positionGroup"
                :options="positionGroupOptions"
                size="sm"
                select-class="max-w-[160px]"
              />

              <div class="relative">
                <UiSelect
                  v-model="fiscalYear"
                  :options="fiscalYearOptions"
                  size="sm"
                  select-class="pl-8 pr-7"
                />
                <Calendar class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <button
                  v-if="fiscalYear"
                  type="button"
                  title="ล้างปีงบประมาณ"
                  class="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 inline-flex items-center justify-center cursor-pointer transition-colors"
                  @click="fiscalYear = ''"
                >
                  <X class="w-3 h-3" />
                </button>
              </div>

              <UiSelect v-model="round" :options="roundOptions" size="sm" select-class="max-w-[150px]" />

              <UiButton
                v-if="type !== 'assigned'"
                variant="primary"
                size="sm"
                title="เพิ่มตัวชี้วัด"
                @click="emit('create', type)"
              >
                <template #icon>
                  <Plus class="w-4 h-4" />
                </template>
                เพิ่มตัวชี้วัด
              </UiButton>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <UiCheckbox v-if="!isCompactMode" v-model="showAll">แสดงทั้งหมด</UiCheckbox>
              <UiSearchInput v-model="search" placeholder="ค้นหา" class="w-full lg:w-56" />
            </div>
          </div>

          <!-- Indicators Table (AppTable) -->
          <AppTable :columns="columns" :data="pagedRows" row-key="id" :show-toolbar="false" class="rounded-xl">
            <template #body>
              <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
                <tr
                  v-for="row in pagedRows"
                  :key="row.id"
                  class="hover:bg-slate-50/70 transition-colors group"
                >
                  <td class="py-3 px-2 text-center">
                    <!-- งานอื่นๆ: ปุ่มไอคอนตรง (ดู/ลบ) — ประเภทอื่น: เมนู ⋯ -->
                    <template v-if="type === 'assigned'">
                      <div class="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          title="รายละเอียด"
                          class="inline-flex items-center justify-center w-7 h-7 rounded-md text-sky-500 hover:bg-sky-50 transition-colors cursor-pointer"
                          @click="detailRow = row"
                        >
                          <Eye class="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          title="ลบข้อมูล"
                          class="inline-flex items-center justify-center w-7 h-7 rounded-md text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          @click="onRowAction('delete', row)"
                        >
                          <Trash2 class="w-4 h-4" />
                        </button>
                      </div>
                    </template>
                    <UiDropdownButton
                      v-else
                      icon-only
                      variant="ghost"
                      size="xs"
                      menu-title="ตัวเลือกเพิ่มเติม"
                      :items="rowActionItems"
                      @select="(action) => onRowAction(action.value, row)"
                    >
                      <template #icon>
                        <Ellipsis class="w-4 h-4" />
                      </template>
                    </UiDropdownButton>
                  </td>
                  <td v-if="isCompactMode" class="py-3 px-3">{{ row.code }}</td>
                  <td v-if="isCompactMode" class="py-3 px-3">{{ row.title }}</td>
                  <td v-if="!isCompactMode" class="py-3 px-3">
                    <span class="font-semibold text-blue-950">{{ row.title }}</span>
                  </td>
                  <td v-if="!isCompactMode" class="py-3 px-3">
                    <UiBadge tone="outline" shape="chip" mono>{{ row.code }}</UiBadge>
                  </td>
                  <td v-if="!isCompactMode" class="py-3 px-3 font-medium text-slate-800">
                    {{ unitNameOf(row.unitId) }}
                  </td>
                  <td v-if="!isCompactMode" class="py-3 px-3 text-center">{{ row.fiscalYear }}</td>
                  <td v-if="!isCompactMode" class="py-3 px-3">{{ row.round }}</td>
                </tr>

                <tr v-if="filteredRows.length === 0">
                  <td :colspan="columns.length">
                    <UiEmptyState message="ไม่พบข้อมูลตัวชี้วัดตามเงื่อนไขที่ระบุ" />
                  </td>
                </tr>
              </tbody>
            </template>
          </AppTable>

          <!-- Pagination Footer -->
          <UiPagination
            v-if="filteredRows.length > 0"
            v-model:current-page="page"
            v-model:page-size="pageSize"
            :total="filteredRows.length"
            :page-size-options="[10, 20, 50]"
          />
        </section>
      </div>
    </div>

    <!-- Modal รายละเอียดตัวชี้วัด — คอลัมน์เดียว อ่านไล่จากบนลงล่าง -->
    <UiModal
      :is-open="detailRow !== null"
      @close="detailRow = null"
    >
      <template #header>
        <div class="flex items-center gap-2 min-w-0">
          <h2 class="text-sm font-bold text-slate-800">รายละเอียดตัวชี้วัด</h2>
          <UiBadge v-if="detailRow" tone="outline" shape="chip" mono>{{ detailRow.code }}</UiBadge>
        </div>
      </template>
      <div v-if="detailRow" class="divide-y divide-slate-200/70 text-xs">
        <!-- ชื่อตัวชี้วัด -->
        <div class="flex items-baseline gap-4 py-2.5">
          <span class="w-36 flex-shrink-0 text-slate-500">ชื่อตัวชี้วัด</span>
          <p class="font-bold text-blue-950 leading-snug min-w-0">{{ detailRow.title }}</p>
        </div>

        <!-- ข้อมูลทั่วไป: หัวข้อซ้าย เนื้อหาขวา คั่นด้วยเส้น -->
        <div
          v-for="field in detailFields"
          :key="field.label"
          class="flex items-baseline gap-4 py-2.5"
        >
          <span class="w-36 flex-shrink-0 text-slate-500">{{ field.label }}</span>
          <span class="font-medium text-slate-800 min-w-0">{{ field.value || '-' }}</span>
        </div>

        <!-- เกณฑ์ระดับคะแนน (แสดง 5 ระดับเสมอ — ช่องว่างแสดงคำแนะนำตามฟอร์มเพิ่ม) -->
        <div class="flex items-start gap-4 py-2.5">
          <span class="w-36 flex-shrink-0 text-slate-500">เกณฑ์ระดับคะแนน</span>
          <div class="min-w-0 space-y-1.5">
            <div
              v-for="(level, index) in detailLevelRows"
              :key="index"
              class="flex items-center gap-2.5"
            >
              <UiBadge tone="blue" shape="pill" class="w-14 justify-center flex-shrink-0">
                {{ detailLevelRows.length - index }}
              </UiBadge>
              <template v-if="level.trim()">
                <span class="text-slate-700 min-w-0">{{ level }}</span>
              </template>
              <template v-else>
                <span class="text-blue-700">{{ levelSuggestions[detailLevelRows.length - index] }}</span>
              </template>
            </div>
          </div>
        </div>

        <!-- รายละเอียดยาว: นิยาม / สูตรคำนวณ / เอกสารหลักฐาน -->
        <div
          v-for="block in detailBlocks"
          :key="block.label"
          class="flex items-start gap-4 py-2.5"
        >
          <span class="w-36 flex-shrink-0 text-slate-500">{{ block.label }}</span>
          <p class="text-slate-700 whitespace-pre-line leading-relaxed min-w-0">
            {{ block.value || 'ไม่ได้ระบุ' }}
          </p>
        </div>
      </div>
      <template #footer>
        <div class="flex items-center justify-end">
          <UiButton variant="outline" size="sm" @click="detailRow = null">ปิด</UiButton>
        </div>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  Briefcase,
  Calendar,
  Ellipsis,
  Eye,
  History,
  ListChecks,
  Pencil,
  Plus,
  Target,
  Trash2,
  X,
} from 'lucide-vue-next';
import { PageTitle } from '../common';
import {
  AppTable,
  UiBadge,
  UiButton,
  UiCheckbox,
  UiDropdownButton,
  UiEmptyState,
  UiModal,
  UiPagination,
  UiSearchInput,
  UiSelect,
  UiStatCard,
  UiTree,
} from '../ui';
import type { AppTableColumn } from '../ui';
import { ORG_UNITS } from '../../data/organizationData';
import { findUnit } from '../organization/orgHelpers';
import {
  INDICATORS,
  INDICATOR_FISCAL_YEARS,
  INDICATOR_POSITION_GROUPS,
  INDICATOR_ROUNDS,
  INDICATOR_TYPE_LABELS,
  type IndicatorRow,
  type IndicatorType,
} from '../../data/indicatorData';
import { useToast } from '../../composables/useToast';

const props = defineProps<{
  /** ประเภทตัวชี้วัดของหน้านี้ (หน้าละประเภท ตามเมนู) */
  type: IndicatorType;
}>();

const emit = defineEmits<{
  (e: 'create', type: IndicatorType): void;
  (e: 'openType', type: IndicatorType | 'all'): void;
}>();

const { show } = useToast();

const isPositionMode = computed(() => props.type === 'position');

// โหมดตารางแบบย่อ (ตำแหน่ง/งานอื่นๆ): ไม่มี tree หน่วยงาน, ตารางแสดงเฉพาะ รหัส+ชื่อตัวชี้วัด
const isCompactMode = computed(() => props.type !== 'plan');

// --- การ์ดสรุปจำนวนตามประเภท (คลิกเพื่อเปลี่ยนหน้า)
type CardKey = IndicatorType | 'all';

const cards = computed(() => {
  const entries: { key: CardKey; tone: 'blue' | 'emerald' | 'teal' | 'amber'; icon: typeof Target }[] = [
    { key: 'plan', tone: 'blue', icon: Target },
    { key: 'position', tone: 'emerald', icon: Briefcase },
    { key: 'assigned', tone: 'teal', icon: ListChecks },
    { key: 'all', tone: 'amber', icon: ListChecks },
  ];
  return entries.map(({ key, tone, icon }) => ({
    key,
    label: key === 'all' ? 'ทั้งหมด' : INDICATOR_TYPE_LABELS[key],
    hint: key === 'all' ? 'ตัวชี้วัดทุกประเภท' : 'ในหน่วยงานที่เลือก',
    count:
      key === 'all'
        ? INDICATORS.length
        : INDICATORS.filter((i) => i.type === key).length,
    tone,
    icon,
  }));
});

// --- หัวเรื่องเฉพาะของแต่ละหน้า
const PAGE_META: Record<IndicatorType, { title: string; subtitle: string }> = {
  plan: {
    title: 'รายการตัวชี้วัดตามแผนแม่บท',
    subtitle: 'จัดการตัวชี้วัดตามแผนแม่บท แยกตามหน่วยงาน/ส่วนราชการ',
  },
  position: {
    title: 'รายการตัวชี้วัดตำแหน่ง',
    subtitle: 'จัดการตัวชี้วัดตำแหน่ง แยกตามกลุ่มแหน่ง',
  },
  assigned: {
    title: 'รายการงานอื่นๆ ที่ได้รับมอบหมาย',
    subtitle: 'จัดการตัวชี้วัดงานอื่นๆ ที่ได้รับมอบหมาย',
  },
};

const pageMeta = computed(() => PAGE_META[props.type]);

// --- Unit tree (โครงสร้างหน่วยงานร่วมกับ ORG_UNITS เหมือนหน้าอัตรากำลัง)
const selectedUnitId = ref('1000');
const expandedUnitIds = ref<string[]>(['1000', '1001']);
const unitSearch = ref('');
const allExpanded = ref(false);

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

const toggleExpandAll = () => {
  allExpanded.value = !allExpanded.value;
  expandedUnitIds.value = allExpanded.value ? collectParentIds(ORG_UNITS) : [];
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
        desc: u.quotaText,
        children: u.children ? toNodes(u.children) : undefined,
      }));
  return toNodes(ORG_UNITS);
});

// พิมพ์ค้นหา -> ขยายทุกโหนดให้เห็นผลลัพธ์
watch(unitSearch, (q) => {
  if (q.trim()) {
    expandedUnitIds.value = collectParentIds(ORG_UNITS);
    allExpanded.value = true;
  }
});

// ติ๊ก "แสดงทั้งหมด" — ตารางโชว์ทุกหน่วยงาน (ขยายเต็มความกว้าง) และซ่อน tree หน่วยงาน
const showAll = ref(false);

const descendantIds = (unitId: string): string[] => {
  const unit = findUnit(ORG_UNITS, unitId);
  if (!unit) return [unitId];
  const ids = [unit.id];
  unit.children?.forEach((child) => ids.push(...descendantIds(child.id)));
  return ids;
};

const unitNameOf = (unitId: string) => findUnit(ORG_UNITS, unitId)?.name ?? '-';

const scopedIndicators = computed(() => {
  if (isCompactMode.value || showAll.value) return INDICATORS.filter((i) => i.type === props.type);
  const ids = descendantIds(selectedUnitId.value);
  return INDICATORS.filter((i) => i.type === props.type && ids.includes(i.unitId));
});

// --- Toolbar
const fiscalYear = ref<string>(String(INDICATOR_FISCAL_YEARS[0]));
const fiscalYearOptions = INDICATOR_FISCAL_YEARS.map((y) => ({ value: String(y), label: String(y) }));

const round = ref('ทั้งหมด');
const roundOptions = INDICATOR_ROUNDS.map((r) => ({ value: r, label: r }));

const search = ref('');

const positionGroup = ref('ทั้งหมด');
const positionGroupOptions = INDICATOR_POSITION_GROUPS.map((g) => ({ value: g, label: g }));

// --- ตาราง
const columns = computed<AppTableColumn[]>(() => {
  const base: AppTableColumn[] = [{ key: 'actions', label: '', width: '44px' }];
  if (isCompactMode.value) {
    return [
      ...base,
      { key: 'code', label: 'รหัสตัวชี้วัด' },
      { key: 'title', label: 'ชื่อตัวชี้วัด' },
    ];
  }
  return [
    ...base,
    { key: 'title', label: 'ลำดับ/หัวข้อตัวชี้วัด' },
    { key: 'code', label: 'รหัสตัวชี้วัด', width: '160px' },
    { key: 'unit', label: 'หน่วยงาน' },
    { key: 'fiscalYear', label: 'ปีงบประมาณ', width: '110px', align: 'center' },
    { key: 'round', label: 'รอบการประเมิน', width: '140px' },
  ];
});

// --- Modal รายละเอียดตัวชี้วัด
const detailRow = ref<IndicatorRow | null>(null);

const detailFields = computed(() => {
  const row = detailRow.value;
  if (!row) return [];
  return [
    { label: 'รหัสตัวชี้วัด', value: row.code },
    { label: 'ประเภทตัวชี้วัด', value: INDICATOR_TYPE_LABELS[row.type] },
    { label: 'หน่วยงาน/ส่วนราชการ', value: unitNameOf(row.unitId) },
    { label: 'ปีงบประมาณ', value: String(row.fiscalYear) },
    { label: 'รอบการประเมิน', value: row.round },
    ...(row.positionGroup ? [{ label: 'กลุ่มแหน่ง', value: row.positionGroup }] : []),
    { label: 'คำนำหน้า', value: row.prefix ?? '' },
    { label: 'หน่วยนับ', value: row.measureUnit ?? '' },
    { label: 'น้ำหนัก', value: row.weight ?? '' },
  ];
});

const detailBlocks = computed(() => {
  const row = detailRow.value;
  if (!row) return [];
  return [
    { label: 'นิยามหรือความหมาย', value: row.definition ?? '' },
    { label: 'สูตรคำนวณ', value: row.formula ?? '' },
    { label: 'ข้อมูลเอกสารหลักฐาน', value: row.evidence ?? '' },
  ];
});

// ระดับคะแนนใน modal — ไม่มีข้อมูลให้แสดงค่าว่าง 5 ระดับ (โชว์คำแนะนำแทน)
const detailLevelRows = computed(() => detailRow.value?.levels ?? ['', '', '', '', '']);

// คำแนะนำต่อระดับ (เหมือนฟอร์มเพิ่มตัวชี้วัด)
const levelSuggestions: Record<number, string> = {
  5: 'ดีเยี่ยม',
  4: 'ดีมาก',
  3: 'ปานกลาง',
  2: 'พอใช้',
  1: 'ปรับปรุง',
};

const rowActionItems = [
  { value: 'history', label: 'ประวัติการแก้ไข', icon: History },
  { value: 'detail', label: 'รายละเอียด', icon: Eye },
  { value: 'edit', label: 'แก้ไขข้อมูล', icon: Pencil },
  { value: 'delete', label: 'ลบข้อมูล', icon: Trash2 },
];

const onRowAction = (action: string, row: IndicatorRow) => {
  switch (action) {
    case 'history':
      show(`ประวัติการแก้ไขตัวชี้วัด ${row.code} (ยังไม่เปิดใช้ฟีเจอร์)`);
      break;
    case 'detail':
      detailRow.value = row;
      break;
    case 'edit':
      show(`แก้ไขตัวชี้วัด ${row.code} (ยังไม่เปิดใช้ฟอร์มแก้ไข)`);
      break;
    case 'delete':
      show(`ลบตัวชี้วัด ${row.code} (ยังไม่เปิดใช้ฟีเจอร์)`);
      break;
  }
};

const filteredRows = computed(() => {
  let result = [...scopedIndicators.value];
  if (isPositionMode.value && positionGroup.value !== 'ทั้งหมด') {
    result = result.filter((i) => i.positionGroup === positionGroup.value);
  }
  if (fiscalYear.value) result = result.filter((i) => String(i.fiscalYear) === fiscalYear.value);
  if (round.value !== 'ทั้งหมด') result = result.filter((i) => i.round === round.value);

  const q = search.value.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (i) => i.title.toLowerCase().includes(q) || i.code.toLowerCase().includes(q)
    );
  }
  return result;
});

// --- Pagination
const page = ref(1);
const pageSize = ref(10);

const pagedRows = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filteredRows.value.slice(start, start + pageSize.value);
});

watch([selectedUnitId, showAll, fiscalYear, round, search, pageSize, positionGroup], () => {
  page.value = 1;
});
</script>
