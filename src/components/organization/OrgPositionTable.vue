<template>
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
        title="ตำแหน่งที่มีผู้ครอง"
        :hint="`${stats.pct}% ครองตำแหน่ง`"
        hint-accent
        :value="stats.filled"
        unit="อัตรา"
        tone="emerald"
        :icon="UserCheck"
      />

      <UiStatCard
        title="ตำแหน่งว่าง"
        hint="ไม่มีผู้ครอง"
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
           <Shuffle  class="w-4 h-4" />
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
          @update:model-value="emit('update:showAllPositions', $event)"
        >
          แสดงตำแหน่งทั้งหมด
        </UiCheckbox>

        <UiSearchInput
          id="position-table-search-input"
          v-model="tableSearch"
          placeholder="ค้นหาตำแหน่ง, ผู้ครอง..."
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
          <template v-for="pos in pagedPositions" :key="pos.id">
            <tr
              class="hover:bg-slate-50/70 transition-colors group"
              :class="expandedRowIds.includes(pos.id) ? 'bg-slate-50/50' : ''"
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
              <td class="py-3 px-1.5">
                <button
                  type="button"
                  class="text-slate-400 hover:text-blue-900 transition-colors cursor-pointer"
                  :title="expandedRowIds.includes(pos.id) ? 'ยุบรายละเอียด' : 'ขยายรายละเอียด'"
                  @click="toggleRowExpanded(pos.id)"
                >
                  <ChevronDown v-if="expandedRowIds.includes(pos.id)" class="w-4 h-4 text-blue-900" />
                  <ChevronRight v-else class="w-4 h-4" />
                </button>
              </td>
              <td class="py-3 px-2 text-center text-slate-500 font-mono text-[11px]">
                {{ pos.orderNumber }}
              </td>
              <td class="py-3 px-3">
                <span class="inline-flex items-center gap-1">
                  <UiBadge tone="outline" shape="chip" mono>{{ pos.positionNumber }}</UiBadge>
                  <Star v-if="pos.isKeyPosition" class="w-3 h-3 fill-amber-400 text-amber-400" title="ตำแหน่งบริหารสำคัญ" />
                </span>
              </td>
              <td class="py-3 px-3">
                <span class="font-semibold text-blue-950">{{ pos.jobTitle }}</span>
                
              </td>
              <td class="py-3 px-3 font-medium text-slate-800">
                {{ pos.positionType }}
              </td>
              <td class="py-3 px-3">
                <UiBadge tone="slate" shape="chip">{{ levelBadge(pos) }}</UiBadge>
              </td>
              <td class="py-3 px-3">
                <div v-if="holderOf(pos)" class="flex items-center gap-2 min-w-0">
                  <span class="font-medium text-slate-800 truncate group-hover:text-blue-900 transition-colors">
                    {{ holderOf(pos)!.name }}
                  </span>
                </div>
                <UiBadge v-else tone="red" shape="chip">ว่าง</UiBadge>
              </td>
              <td class="py-3 px-2 text-center">
                <UiIconButton v-if="holderOf(pos)" tone="ghost" title="ข้อมูลผู้ครองตำแหน่ง" @click="showHolderInfo(pos)">
                  <Info class="w-4 h-4" />
                </UiIconButton>
              </td>
            </tr>

            <!-- Expanded Row Detail -->
            <tr v-if="expandedRowIds.includes(pos.id)">
              <td colspan="9" class="px-3 py-3 bg-slate-50/40">
                <div class="ml-6 lg:ml-10 rounded-xl border border-slate-200 bg-white overflow-hidden">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr class="bg-slate-50/80 border-b border-slate-200/90 text-[11px] font-semibold text-slate-500 select-none">
                        <th class="py-2.5 px-3 text-center w-14">ลำดับ</th>
                        <th class="py-2.5 px-3 min-w-[170px]">ตำแหน่งข้าราชการ</th>
                        <th class="py-2.5 px-3 min-w-[170px]">สายงาน</th>
                        <th class="py-2.5 px-3 min-w-[90px]">ประเภทตำแหน่ง</th>
                        <th class="py-2.5 px-3 min-w-[90px]">ระดับตำแหน่ง</th>
                        <th class="py-2.5 px-3 min-w-[120px]">ตำแหน่งบริหารราชการ</th>
                        <th class="py-2.5 px-3 min-w-[120px]">ตำแหน่งวิชาการราชการ</th>
                      </tr>
                    </thead>
                    <tbody class="text-xs text-slate-700">
                      <tr>
                        <td class="py-3 px-3 text-center text-slate-500 font-mono text-[11px]">
                          {{ pos.orderNumber }}
                        </td>
                        <td class="py-3 px-3">
                          <span class="inline-flex items-center gap-1.5 font-semibold text-blue-950">
                            <span>{{ pos.jobTitle }}</span>
                            <BadgeCheck
                              v-if="pos.holderPersonId"
                              class="w-4 h-4 text-emerald-500"
                              title="ยืนยันผู้ครองตำแหน่งแล้ว"
                            />
                          </span>
                        </td>
                        <td class="py-3 px-3 text-slate-600">{{ pos.lineOfWork }}</td>
                        <td class="py-3 px-3 font-medium text-slate-800">{{ pos.positionType }}</td>
                        <td class="py-3 px-3">
                          <UiBadge tone="slate" shape="chip">{{ levelBadge(pos) }}</UiBadge>
                        </td>
                        <td class="py-3 px-3 text-slate-500">{{ pos.adminPosition }}</td>
                        <td class="py-3 px-3 text-slate-500">{{ pos.academicPosition }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="px-3 py-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 bg-white">
                    <div class="flex items-center gap-2">
                      <span>แสดงต่อหน้า:</span>
                      <UiSelect
                        v-model="detailPageSize"
                        :options="detailPageSizeOptions"
                        size="xs"
                        fit
                      />
                    </div>
                    <span>ทั้งหมด 1 รายการ</span>
                  </div>
                </div>
              </td>
            </tr>
          </template>

          <tr v-if="filteredPositions.length === 0">
            <td colspan="9">
              <UiEmptyState message="ไม่พบข้อมูลตำแหน่งตามเงื่อนไขที่ระบุ" />
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

    <!-- Add Position Modal -->
    <AddPositionModal
      :is-open="showAddPosition"
      :unit-name="selectedUnitName"
      :unit-short="selectedUnitCode"
      @close="showAddPosition = false"
      @save="handlePositionSave"
    />

    <!-- ทะเบียนประวัติผู้ครองตำแหน่ง (Drawer) -->
    <HolderRegistryDrawer
      :position="holderDrawerPosition"
      @close="holderDrawerPosition = null"
    />

    <!-- เลือกผู้ครองตำแหน่ง (Modal) -->
    <SelectHolderModal
      :position="holderPickerPosition"
      @close="holderPickerPosition = null"
      @confirm="handleHolderSelect"
    />

    <!-- จัดลำดับตำแหน่งในหน่วยงาน -->
    <ReorderPositionModal
      :is-open="showReorder"
      :positions="filteredPositions"
      :unit-name="selectedUnitName"
      @close="showReorder = false"
      @save="handleReorderSave"
    />

    <!-- ย้ายตำแหน่งข้ามหน่วยงาน/ส่วนราชการ -->
    <MovePositionModal
      :is-open="showMove"
      :positions="filteredPositions"
      :unit-name="selectedUnitName"
      :current-unit-id="selectedUnitId"
      @close="showMove = false"
      @confirm="handleMoveConfirm"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  Plus,
  Info,
  Star,
  Briefcase,
  UserCheck,
  ShieldCheck,
  BadgeCheck,
  ArrowUpDown,
  Ellipsis,
  Download,
  ChevronDown,
  ChevronRight,
  Shuffle,
  UserMinus,
  UserPlus,
  Pencil,
  Copy,
  UserPen,
  History,
  Eye,
  FileText,
  Table2,
} from 'lucide-vue-next';
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
  UiSelect,
  UiStatCard,
} from '../ui';
import type { AppTableColumn } from '../ui';
import { ORG_POSITIONS, ORG_UNITS } from '../../data/organizationData';
import type { OrgPosition } from '../../data/organizationData';
import { holderOf, levelBadge, descendantMap, findUnit } from './orgHelpers';
import AddPositionModal from './modals/AddPositionModal.vue';
import HolderRegistryDrawer from './modals/HolderRegistryDrawer.vue';
import SelectHolderModal from './modals/SelectHolderModal.vue';
import ReorderPositionModal from './modals/ReorderPositionModal.vue';
import MovePositionModal from './modals/MovePositionModal.vue';
import { useToast } from '../../composables/useToast';
const { show } = useToast();

// ตำแหน่งที่กำลังเปิดทะเบียนประวัติผู้ครอง (null = ปิด Drawer)
const holderDrawerPosition = ref<OrgPosition | null>(null);

// ตำแหน่งที่กำลังเลือกผู้ครอง (null = ปิด Modal เลือกคนครอง)
const holderPickerPosition = ref<OrgPosition | null>(null);

// บันทึกผู้ครองจาก Modal เลือกคนครอง
const handleHolderSelect = (personId: string) => {
  const pos = holderPickerPosition.value;
  if (!pos || !personId) return;
  pos.holderPersonId = personId;
  holderPickerPosition.value = null;
  show(`บันทึกผู้ครองตำแหน่ง ${pos.positionNumber}: ${holderOf(pos)?.name} เรียบร้อยแล้ว`);
};

// --- Reorder / Move modal
const showReorder = ref(false);
const showMove = ref(false);

// ยืนยันย้ายตำแหน่ง: อัปเดต unitId ของตำแหน่งที่เลือก
const handleMoveConfirm = (payload: { positionIds: string[]; destinationUnitId: string }) => {
  payload.positionIds.forEach((id) => {
    const pos = ORG_POSITIONS.find((p) => p.id === id);
    if (pos) pos.unitId = payload.destinationUnitId;
  });
  showMove.value = false;
  const destName = findUnit(ORG_UNITS, payload.destinationUnitId)?.name ?? '-';
  show(`ย้ายตำแหน่ง ${payload.positionIds.length} รายการ ไปยัง ${destName} เรียบร้อยแล้ว`
  );
};

const props = defineProps<{
  selectedUnitId: string;
  showAllPositions: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:showAllPositions', value: boolean): void;
}>();


// --- Add Position modal
const showAddPosition = ref(false);

const selectedUnitName = computed(() => findUnit(ORG_UNITS, props.selectedUnitId)?.name ?? '-');
const selectedUnitCode = computed(() => findUnit(ORG_UNITS, props.selectedUnitId)?.shortName ?? findUnit(ORG_UNITS, props.selectedUnitId)?.code ?? '');

const handlePositionSave = (payload: {
  positions: { jobTitle: string }[];
  note: string;
  isManagerial: boolean;
}) => {
  showAddPosition.value = false;
  show(`บันทึกตำแหน่งใหม่ ${payload.positions.length} อัตรา ในหน่วยงาน ${selectedUnitName.value} เรียบร้อยแล้ว`
  );
};

// --- Columns
const posColumns: AppTableColumn[] = [
  { key: 'actions', label: '', width: '44px' },
  { key: 'expand', label: '', width: '36px' },
  { key: 'orderNumber', label: 'ลำดับ', width: '60px', align: 'center' },
  { key: 'positionNumber', label: 'เลขที่ตำแหน่ง' },
  { key: 'jobTitle', label: 'ตำแหน่งและผู้ดำรงตำแหน่ง' },
  { key: 'positionType', label: 'ตำแหน่งบริหาร' },
  { key: 'levelLabel', label: 'ระดับตำแหน่ง' },
  { key: 'holder', label: 'ผู้ครองตำแหน่ง' },
  { key: 'info', label: '', width: '44px', align: 'center' },
];

// --- Filtering & stats
// ติ๊ก = แสดงตำแหน่งทุกหน่วยงานทั้งระบบ (ข้ามขอบเขตหน่วยงานที่เลือก, ปิดไฮไลต์หน่วยงานใน tree)
// ไม่ติ๊ก = ตำแหน่งทั้งหมดในหน่วยงานที่เลือก (รวมตำแหน่งว่าง)
const tableSearch = ref('');
const sortMode = ref<'order' | 'position' | 'holder'>('order');

const scopedPositions = computed(() => {
  if (props.showAllPositions) return [...ORG_POSITIONS];
  const ids = descendantMap.get(props.selectedUnitId) ?? [props.selectedUnitId];
  return ORG_POSITIONS.filter((p) => ids.includes(p.unitId));
});

const stats = computed(() => {
  const total = scopedPositions.value.length;
  const filled = scopedPositions.value.filter((p) => p.holderPersonId).length;
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
    result = result.filter((p) => {
      const holder = holderOf(p);
      return (
        p.positionNumber.toLowerCase().includes(q) ||
        p.jobTitle.toLowerCase().includes(q) ||
        p.positionType.toLowerCase().includes(q) ||
        (holder ? holder.name.toLowerCase().includes(q) : false)
      );
    });
  }

  if (sortMode.value === 'position') {
    result.sort((a, b) => a.positionNumber.localeCompare(b.positionNumber, 'th'));
  } else if (sortMode.value === 'holder') {
    result.sort((a, b) => (holderOf(a)?.name ?? '').localeCompare(holderOf(b)?.name ?? '', 'th'));
  } else {
    result.sort((a, b) => a.orderNumber - b.orderNumber);
  }

  return result;
});

// บันทึกลำดับใหม่: อัปเดต orderNumber ของตำแหน่งในหน่วยงานที่เลือก
const handleReorderSave = (orderedIds: string[]) => {
  orderedIds.forEach((id, index) => {
    const pos = ORG_POSITIONS.find((p) => p.id === id);
    if (pos) pos.orderNumber = index + 1;
  });
  showReorder.value = false;
  show(`บันทึกลำดับตำแหน่งใน ${selectedUnitName.value} เรียบร้อยแล้ว`);
};

// --- เมนูดาวน์โหลดโครงสร้างอัตรากำลัง
const downloadMenuItems = [
  { value: 'account_1', label: 'บัญชี 1', icon: FileText },
  { value: 'account_2', label: 'บัญชี 2', icon: FileText },
  { value: 'budget_report', label: 'รายงานสรุปงบประมาณบุคลากร', icon: Table2 },
];

const handleDownload = (value: string) => {
  const label = downloadMenuItems.find((item) => item.value === value)?.label ?? '';
  show(`กำลังเตรียมดาวน์โหลด: ${label}`);
};

// --- ตัวเลือกเพิ่มเติม ("...") ต่อแถวตำแหน่ง — รายการแรกเปลี่ยนตามสถานะผู้ครองของแถวนั้น
const rowMenuItemsFor = (pos: OrgPosition) => [
  pos.holderPersonId
    ? { value: 'remove_holder', label: 'ลบผู้ครอง', icon: UserMinus }
    : { value: 'select_holder', label: 'เลือกคนครอง', icon: UserPlus },
  { value: 'edit', label: 'แก้ไข', icon: Pencil },
  { value: 'copy', label: 'คัดลอก', icon: Copy },
  { value: 'move', label: 'ย้ายตำแหน่ง', icon: Shuffle },
  { value: 'manage_self', label: 'จัดการตำแหน่งด้วยตนเอง', icon: UserPen },
  { value: 'holder_history', label: 'ประวัติครอง', icon: History },
  { value: 'position_history', label: 'ประวัติตำแหน่ง', icon: History },
  { value: 'detail', label: 'ดูรายละเอียด', icon: Eye },
];

const handleRowMenu = (action: string, pos: OrgPosition) => {
  switch (action) {
    case 'detail':
      showHolderInfo(pos);
      break;
    case 'holder_history':
      if (!holderOf(pos)) {
        show(`ตำแหน่ง ${pos.positionNumber} เป็นตำแหน่งว่าง (ไม่มีประวัติผู้ครอง)`);
        break;
      }
      show(`ประวัติผู้ครองตำแหน่ง ${pos.positionNumber}: ${holderOf(pos)!.name}`);
      break;
    case 'position_history':
      show(`เปิดประวัติตำแหน่ง ${pos.positionNumber}`);
      break;
    case 'move':
      showMove.value = true;
      break;
    case 'edit':
      show(`แก้ไขตำแหน่ง ${pos.positionNumber} (ยังไม่เปิดใช้ฟอร์มแก้ไข)`);
      break;
    case 'select_holder':
      holderPickerPosition.value = pos;
      break;
    case 'remove_holder':
      if (!pos.holderPersonId) {
        show(`ตำแหน่ง ${pos.positionNumber} ไม่มีผู้ครองอยู่แล้ว`);
        break;
      }
      pos.holderPersonId = undefined;
      show(`ลบผู้ครองออกจากตำแหน่ง ${pos.positionNumber} เรียบร้อยแล้ว`);
      break;
    default:
      show(
        `${rowMenuItemsFor(pos).find((i) => i.value === action)?.label} — ตำแหน่ง ${pos.positionNumber}`
      );
  }
};

const showHolderInfo = (pos: Parameters<typeof holderOf>[0]) => {
  if (!holderOf(pos)) {
    show(`ตำแหน่ง ${pos.positionNumber} เป็นตำแหน่งว่าง (ไม่มีผู้ครอง)`);
    return;
  }
  holderDrawerPosition.value = pos;
};

// --- Pagination
const currentPage = ref(1);
const pageSize = ref(10);

const pagedPositions = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredPositions.value.slice(start, start + pageSize.value);
});

watch(
  [() => props.selectedUnitId, () => props.showAllPositions, tableSearch, sortMode, pageSize],
  () => {
    currentPage.value = 1;
  }
);

// --- Expandable rows
const expandedRowIds = ref<string[]>(['pos-1']);
const detailPageSize = ref(10);
const detailPageSizeOptions = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
];

const toggleRowExpanded = (id: string) => {
  expandedRowIds.value = expandedRowIds.value.includes(id)
    ? expandedRowIds.value.filter((i) => i !== id)
    : [...expandedRowIds.value, id];
};
</script>
