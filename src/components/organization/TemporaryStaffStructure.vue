<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-3">
    <!-- Page Title -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
      <PageTitle
        title="อัตรากำลังลูกจ้างชั่วคราว"
        subtitle="อัตรากำลังลูกจ้างชั่วคราว ตำแหน่งว่าง และผู้ปฏิบัติงานในแต่ละหน่วยงาน"
      />
    </div>

    <!-- Main Structure Card -->
    <div class="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div class="grid grid-cols-1 lg:grid-cols-12">
        <!-- Unit Tree Panel -->
        <aside v-show="!showAllPositions" class="lg:col-span-3 p-3 sm:p-4 lg:border-r border-slate-100">
          <div class="rounded-xl flex flex-col h-full min-h-[420px]">
            <!-- Tree Header -->
            <div class="flex items-center justify-between gap-2 pb-2.5">
              <h3 class="text-xs font-bold text-slate-800">หน่วยงานและอัตรา</h3>
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
              <UiSearchInput
                id="temp-unit-tree-search-input"
                v-model="unitSearch"
                placeholder="ค้นหา"
              />
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

        <!-- Position Table Section -->
        <section class="p-3 sm:p-4 space-y-4" :class="showAllPositions ? 'lg:col-span-12' : 'lg:col-span-9'">
          <!-- Summary Stat Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <UiStatCard
              title="ตำแหน่งทั้งหมด"
              hint="โครงสร้างปัจจุบัน"
              :value="stats.total"
              unit="อัตรา"
              tone="blue"
              :icon="Briefcase"
            />

            <UiStatCard
              title="ตำแหน่งที่มีผู้ปฏิบัติงาน"
              :hint="`${stats.pct}% มีผู้ปฏิบัติงาน`"
              hint-accent
              :value="stats.filled"
              unit="อัตรา"
              tone="emerald"
              :icon="UserCheck"
            />

            <UiStatCard
              title="ตำแหน่งว่าง"
              hint="ไม่มีผู้ปฏิบัติงาน"
              :value="stats.vacant"
              unit="อัตรา"
              tone="teal"
              :icon="ShieldCheck"
            />
          </div>

          <!-- Position Table Toolbar -->
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-2">
              <UiButton @click="showAddPosition = true">
                <template #icon>
                  <Plus class="w-4 h-4" />
                </template>
                เพิ่มตำแหน่ง
              </UiButton>

              <UiIconButton title="จัดลำดับตำแหน่งในหน่วยงาน" @click="showReorder = true">
                <ArrowUpDown class="w-4 h-4" />
              </UiIconButton>

              <UiIconButton title="ย้ายตำแหน่งข้ามหน่วยงาน/ส่วนราชการ" @click="showMove = true">
                <Shuffle class="w-4 h-4" />
              </UiIconButton>

              <UiDropdownButton
                icon-only
                variant="outline"
                size="xs"
                :items="downloadMenuItems"
                @select="(item) => handleDownload(item.value)"
              >
                <template #icon>
                  <Download class="w-4 h-4" />
                </template>
              </UiDropdownButton>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <UiCheckbox
                :model-value="showAllPositions"
                @update:model-value="showAllPositions = $event"
              >
                แสดงตำแหน่งทั้งหมด
              </UiCheckbox>

              <UiSearchInput
                id="temp-position-table-search-input"
                v-model="tableSearch"
                placeholder="ค้นหา"
                class="w-full lg:w-56"
              />
            </div>
          </div>

          <!-- Positions Table (AppTable) -->
          <AppTable
            :columns="posColumns"
            :data="pagedPositions"
            row-key="id"
            :show-toolbar="false"
            class="rounded-xl"
          >
            <template #body>
              <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
                <tr
                  v-for="pos in pagedPositions"
                  :key="pos.id"
                  class="hover:bg-slate-50/70 transition-colors group"
                >
                  <td class="py-3 px-2 text-center">
                    <UiDropdownButton
                      icon-only
                      variant="ghost"
                      size="xs"
                      menu-title="ตัวเลือกเพิ่มเติม"
                      :items="rowMenuItemsFor(pos)"
                      @select="(action) => handleRowMenu(action.value, pos)"
                    >
                      <template #icon>
                        <Ellipsis class="w-4 h-4" />
                      </template>
                    </UiDropdownButton>
                  </td>
                  <td class="py-3 px-2 text-center text-slate-500 font-mono text-[11px]">
                    {{ pos.orderNumber }}
                  </td>
                  <td class="py-3 px-3">
                    <span class="font-semibold text-blue-950">{{ pos.jobTitle }}</span>
                  </td>
                  <td class="py-3 px-3 font-medium text-slate-800">
                    {{ pos.jobGroup }}
                  </td>
                  <td class="py-3 px-3">
                    <div v-if="pos.holderName" class="flex items-center gap-2 min-w-0">
                      <span class="font-medium text-slate-800 truncate group-hover:text-blue-900 transition-colors">
                        {{ pos.holderName }}
                      </span>
                      <UiIconButton
                        tone="ghost"
                        title="ข้อมูลผู้ปฏิบัติงาน"
                        @click="showHolderInfo(pos)"
                      >
                        <Info class="w-4 h-4" />
                      </UiIconButton>
                    </div>
                    <UiBadge v-else tone="red" shape="chip">ว่าง</UiBadge>
                  </td>
                </tr>

                <tr v-if="filteredPositions.length === 0">
                  <td :colspan="posColumns.length">
                    <UiEmptyState message="ไม่พบข้อมูลอัตราตามเงื่อนไขที่ระบุ" />
                  </td>
                </tr>
              </tbody>
            </template>
          </AppTable>

          <!-- Pagination Footer -->
          <UiPagination
            v-if="filteredPositions.length > 0"
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="filteredPositions.length"
            :page-size-options="[10, 20, 50]"
          />
        </section>
      </div>
    </div>

    <!-- Add Position Modal (ตัวหลัก) -->
    <AddPositionModal
      :is-open="showAddPosition"
      :unit-name="selectedUnitName"
      :unit-short="selectedUnitCode"
      @close="showAddPosition = false"
      @save="handlePositionSave"
    />

    <!-- จัดลำดับตำแหน่งในหน่วยงาน (modal ตัวหลัก) -->
    <ReorderPositionModal
      :is-open="showReorder"
      :positions="filteredPositions"
      :unit-name="selectedUnitName"
      @close="showReorder = false"
      @save="handleReorderSave"
    />

    <!-- ย้ายตำแหน่งข้ามหน่วยงาน/ส่วนราชการ (modal ตัวหลัก) -->
    <MovePositionModal
      :is-open="showMove"
      :positions="filteredPositions"
      :unit-name="selectedUnitName"
      :current-unit-id="selectedUnitId"
      @close="showMove = false"
      @confirm="handleMoveConfirm"
    />

    <!-- ทะเบียนประวัติผู้ปฏิบัติงาน (Drawer ตัวหลัก, section แบบลูกจ้างชั่วคราว) -->
    <HolderRegistryDrawer
      :position="holderDrawerPosition"
      :section-title="'ข้อมูลลูกจ้างชั่วคราว'"
      :custom-fields="holderCustomFields"
      :holder-override="holderDrawerOverride"
      @close="holderDrawerPosition = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  Plus,
  Briefcase,
  UserCheck,
  ShieldCheck,
  ArrowUpDown,
  Ellipsis,
  Download,
  Info,
  UserPlus,
  UserMinus,
  Pencil,
  FileText,
  Shuffle,
  Table2,
} from 'lucide-vue-next';
import { PageTitle } from '../common';
import {
  AppTable,
  UiBadge,
  UiButton,
  UiCheckbox,
  UiDropdownButton,
  UiEmptyState,
  UiIconButton,
  UiPagination,
  UiSearchInput,
  UiStatCard,
  UiTree,
} from '../ui';
import type { AppTableColumn } from '../ui';
import { ORG_UNITS } from '../../data/organizationData';
import { TEMP_STAFF_POSITIONS } from '../../data/temporaryStaffData';
import type { TemporaryStaffPosition } from '../../data/temporaryStaffData';
import { findUnit } from './orgHelpers';
import AddPositionModal from './modals/AddPositionModal.vue';
import ReorderPositionModal from './modals/ReorderPositionModal.vue';
import MovePositionModal from './modals/MovePositionModal.vue';
import HolderRegistryDrawer from './modals/HolderRegistryDrawer.vue';
import { useToast } from '../../composables/useToast';
const { show } = useToast();

// --- ทะเบียนประวัติผู้ปฏิบัติงาน (Drawer ตัวหลัก)
const holderDrawerPosition = ref<TemporaryStaffPosition | null>(null);

/** field ของ section "ข้อมูลลูกจ้างชั่วคราว" ใน Drawer */
const holderCustomFields = computed(() => {
  const pos = holderDrawerPosition.value;
  if (!pos) return undefined;
  return [
    { label: 'สังกัด', value: findUnit(ORG_UNITS, pos.unitId)?.name ?? '-' },
    { label: 'กลุ่มงาน', value: pos.jobGroup },
    { label: 'สายงาน', value: pos.lineOfWork },
    { label: 'ตำแหน่ง', value: pos.jobTitle },
    { label: 'ประเภทบุคคล', value: 'ลูกจ้างชั่วคราว' },
    { label: 'ค่าจ้าง', value: pos.wage },
    { label: 'เงินเพิ่มการครองชีพชั่วคราว', value: pos.extraLivingAllowance },
    { label: 'เงินช่วยเหลือการครองชีพชั่วคราว', value: pos.livingAssistance },
    { label: 'เงินสมทบประกันสังคม (ลูกจ้าง)', value: pos.ssoEmployee },
    { label: 'เงินสมทบประกันสังคม (นายจ้าง)', value: pos.ssoEmployer },
  ];
});

const holderDrawerOverride = computed(() => {
  const pos = holderDrawerPosition.value;
  if (!pos?.holderName) return undefined;
  return {
    name: pos.holderName,
    jobTitle: pos.jobTitle,
    citizenId: pos.citizenId,
    gender: pos.gender,
    birthDate: pos.birthDate,
    exactAge: pos.exactAge,
    appointedDate: pos.appointedDate,
    // ลูกจ้างชั่วคราวไม่มีวันครบเกษียณ/ด้านทางการบริหาร
    retirementDate: '-',
  };
});

// --- Unit tree (โครงสร้างหน่วยงานร่วมกับ ORG_UNITS)
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

// ติ๊ก "แสดงตำแหน่งทั้งหมด" — ตารางโชว์ทุกหน่วยงาน (ขยายเต็มความกว้าง) และซ่อน tree หน่วยงาน
const showAllPositions = ref(false);

const selectedUnitName = computed(() => findUnit(ORG_UNITS, selectedUnitId.value)?.name ?? '-');
const selectedUnitCode = computed(
  () =>
    findUnit(ORG_UNITS, selectedUnitId.value)?.shortName ??
    findUnit(ORG_UNITS, selectedUnitId.value)?.code ??
    ''
);

// --- ตำแหน่งในขอบเขตหน่วยงาน (ติ๊ก = ทุกหน่วยงาน, ไม่ติ๊ก = หน่วยงานที่เลือกรวมหน่วยงานลูก)
const descendantIds = (unitId: string): string[] => {
  const unit = findUnit(ORG_UNITS, unitId);
  if (!unit) return [unitId];
  const ids = [unit.id];
  unit.children?.forEach((child) => ids.push(...descendantIds(child.id)));
  return ids;
};

const tableSearch = ref('');

const scopedPositions = computed(() => {
  if (showAllPositions.value) return [...TEMP_STAFF_POSITIONS];
  const ids = descendantIds(selectedUnitId.value);
  return TEMP_STAFF_POSITIONS.filter((p) => ids.includes(p.unitId));
});

const stats = computed(() => {
  const total = scopedPositions.value.length;
  const filled = scopedPositions.value.filter((p) => p.holderName).length;
  return {
    total,
    filled,
    vacant: total - filled,
    pct: total ? Math.round((filled / total) * 100) : 0,
  };
});

const filteredPositions = computed(() => {
  let result = [...scopedPositions.value];

  const q = tableSearch.value.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (p) =>
        p.jobTitle.toLowerCase().includes(q) ||
        p.jobGroup.toLowerCase().includes(q) ||
        (p.holderName ? p.holderName.toLowerCase().includes(q) : false)
    );
  }

  return result.sort((a, b) => a.orderNumber - b.orderNumber);
});

// --- Columns
const posColumns: AppTableColumn[] = [
  { key: 'actions', label: '', width: '44px' },
  { key: 'orderNumber', label: 'ลำดับ', width: '60px', align: 'center' },
  { key: 'jobTitle', label: 'ตำแหน่ง' },
  { key: 'jobGroup', label: 'กลุ่มงาน' },
  { key: 'holder', label: 'ผู้ปฏิบัติงาน' },
];

// --- เมนูดาวน์โหลด
const downloadMenuItems = [
  { value: 'account_1', label: 'บัญชี 1', icon: FileText },
  { value: 'account_2', label: 'บัญชี 2', icon: FileText },
  { value: 'budget_report', label: 'รายงานสรุปงบประมาณบุคลากร', icon: Table2 },
];

const handleDownload = (value: string) => {
  const label = downloadMenuItems.find((item) => item.value === value)?.label ?? '';
  show(`กำลังเตรียมดาวน์โหลด: ${label}`);
};

// --- ตัวเลือกเพิ่มเติม ("...") ต่อแถว — รายการแรกเปลี่ยนตามสถานะของแถวนั้น
const rowMenuItemsFor = (pos: TemporaryStaffPosition) => [
  pos.holderName
    ? { value: 'remove_holder', label: 'ลบผู้ปฏิบัติงาน', icon: UserMinus }
    : { value: 'select_holder', label: 'เลือกผู้ปฏิบัติงาน', icon: UserPlus },
  { value: 'edit', label: 'แก้ไข', icon: Pencil },
];

const handleRowMenu = (action: string, pos: TemporaryStaffPosition) => {
  switch (action) {
    case 'edit':
      show(`แก้ไขอัตรา ${pos.jobTitle} (ยังไม่เปิดใช้ฟอร์มแก้ไข)`);
      break;
    case 'select_holder':
      show(`เลือกผู้ปฏิบัติงานอัตรา ${pos.jobTitle} (ยังไม่เปิดใช้ฟีเจอร์)`);
      break;
    case 'remove_holder':
      if (!pos.holderName) {
        show(`อัตรา ${pos.jobTitle} ไม่มีผู้ปฏิบัติงานอยู่แล้ว`);
        break;
      }
      pos.holderName = undefined;
      show(`ลบผู้ปฏิบัติงานออกจากอัตรา ${pos.jobTitle} เรียบร้อยแล้ว`);
      break;
  }
};

const showHolderInfo = (pos: TemporaryStaffPosition) => {
  if (!pos.holderName) {
    show(`อัตรา ${pos.jobTitle} เป็นตำแหน่งว่าง (ไม่มีผู้ปฏิบัติงาน)`);
    return;
  }
  holderDrawerPosition.value = pos;
};

// --- Add Position modal
const showAddPosition = ref(false);

const handlePositionSave = (payload: {
  positions: { jobTitle: string }[];
  note: string;
  isManagerial: boolean;
}) => {
  showAddPosition.value = false;
  show(`บันทึกอัตราใหม่ ${payload.positions.length} อัตรา ในหน่วยงาน ${selectedUnitName.value} เรียบร้อยแล้ว`);
};

// --- Modal ตัวหลัก: จัดลำดับ / ย้ายตำแหน่ง
const showReorder = ref(false);
const showMove = ref(false);

const handleReorderSave = (orderedIds: string[]) => {
  orderedIds.forEach((id, index) => {
    const pos = TEMP_STAFF_POSITIONS.find((p) => p.id === id);
    if (pos) pos.orderNumber = index + 1;
  });
  showReorder.value = false;
  show(`บันทึกลำดับตำแหน่งใน ${selectedUnitName.value} เรียบร้อยแล้ว`);
};

const handleMoveConfirm = (payload: { positionIds: string[]; destinationUnitId: string }) => {
  payload.positionIds.forEach((id) => {
    const pos = TEMP_STAFF_POSITIONS.find((p) => p.id === id);
    if (pos) pos.unitId = payload.destinationUnitId;
  });
  showMove.value = false;
  const destName = findUnit(ORG_UNITS, payload.destinationUnitId)?.name ?? '-';
  show(`ย้ายตำแหน่ง ${payload.positionIds.length} รายการ ไปยัง ${destName} เรียบร้อยแล้ว`);
};

// --- Pagination
const currentPage = ref(1);
const pageSize = ref(10);

const pagedPositions = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredPositions.value.slice(start, start + pageSize.value);
});

watch([selectedUnitId, showAllPositions, tableSearch, pageSize], () => {
  currentPage.value = 1;
});
</script>
