<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-3">
    <!-- Page Title & Scope Switcher -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
      <PageTitle
        title="โครงสร้างอัตรากำลัง"
        subtitle="โครงสร้างอัตรากำลังข้าราชการ ตำแหน่งว่าง และการจัดดำแหน่งเข้าประจำการ"
      />

      <UiToggleGroup
        :model-value="scopeMode"
        :items="scopeToggleItems"
        size="md"
        class="self-start md:self-auto flex-shrink-0"
        @update:model-value="setScope"
      />
    </div>

    <!-- Main Structure Card -->
    <div class="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      <!-- Structure Toolbar -->
      <div class="px-4 py-3 border-b border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-3">
          <UiButton variant="success" @click="showAddStructure = true">
            <template #icon>
              <Plus class="w-4 h-4" />
            </template>
            เพิ่มโครงสร้าง
          </UiButton>

          <span class="inline-flex items-center gap-1.5 text-xs font-medium" :class="structureBadge.text">
            <span class="w-1.5 h-1.5 rounded-full" :class="structureBadge.dot" />
            <span>{{ structureBadge.label }}</span>
          </span>
        </div>

        <!-- View Mode Toggle Button Group -->
        <UiToggleGroup
          v-model="viewMode"
          :items="viewToggleItems"
          size="sm"
          class="self-start sm:self-auto"
        />
      </div>

      <!-- Table Mode -->
      <div v-if="viewMode === 'table'" class="grid grid-cols-1 lg:grid-cols-12">
        <OrgUnitTreePanel
          v-show="!showAllPositions"
          :selected-unit-id="selectedUnitId"
          @select="selectedUnitId = $event"
        />
        <OrgPositionTable
          v-model:show-all-positions="showAllPositions"
          :selected-unit-id="selectedUnitId"
        />
      </div>

      <!-- Org Chart Mode (ผังองค์กรตามหน่วยงาน) -->
      <OrgChartView
        v-else-if="viewMode === 'chart'"
        :structure-label="structureLabel"
        @show-unit-info="showUnitInfo"
      />

      <!-- People Mode (รายบุคคล) -->
      <OrgPeopleView
        v-else
      />
    </div>

    <!-- Add Structure Modal -->
    <AddStructureModal
      :is-open="showAddStructure"
      @close="showAddStructure = false"
      @save="handleStructureSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Plus, LayoutGrid, Network, Users } from 'lucide-vue-next';
import { PageTitle } from '../common';
import { UiButton, UiToggleGroup } from '../ui';
import { ORG_UNITS } from '../../data/organizationData';
import OrgUnitTreePanel from './OrgUnitTreePanel.vue';
import OrgPositionTable from './OrgPositionTable.vue';
import OrgChartView from './OrgChartView.vue';
import OrgPeopleView from './OrgPeopleView.vue';
import AddStructureModal from './modals/AddStructureModal.vue';
import { findUnit } from './orgHelpers';
import { useToast } from '../../composables/useToast';
const { show } = useToast();


// --- Add Structure modal
const showAddStructure = ref(false);

const handleStructureSave = (payload: {
  name: string;
  note: string;
  sections: Record<string, boolean>;
}) => {
  showAddStructure.value = false;
  show(`สร้างโครงสร้าง "${payload.name}" เป็นฉบับแบบร่างแล้ว (ยังไม่บังคับใช้) — แก้ไขเพิ่มเติมได้ที่เมนูแบบร่าง`
  );
};

// --- View mode
const viewMode = ref<'table' | 'chart' | 'people'>('table');

// ติ๊ก "แสดงตำแหน่งทั้งหมด" — ตารางโชว์ทุกหน่วยงาน (ขยายเต็มความกว้าง) และซ่อน tree หน่วยงาน
const showAllPositions = ref(false);

const scopeToggleItems = [
  { value: 'current', label: 'ปัจจุบัน', dotTone: 'bg-emerald-500' },
  { value: 'plan', label: 'แบบร่าง', dotTone: 'bg-amber-500' },
];

const viewToggleItems = [
  { value: 'table', icon: LayoutGrid, title: 'มุมมองแบบตาราง' },
  { value: 'chart', icon: Network, title: 'มุมมองแบบผังองค์กร' },
  { value: 'people', icon: Users, title: 'มุมมองแบบรายบุคคล' },
];

// --- Structure scope (ปัจจุบัน / แผนที่)
const scopeMode = ref<'current' | 'plan'>('current');

const structureBadge = computed(() =>
  scopeMode.value === 'current'
    ? { label: 'โครงสร้างที่กำลังบังคับใช้', dot: 'bg-emerald-500', text: 'text-slate-600' }
    : { label: 'โครงสร้างฉบับแผน (ยังไม่บังคับใช้)', dot: 'bg-amber-500', text: 'text-slate-600' }
);

const structureLabel = computed(() =>
  scopeMode.value === 'current' ? 'โครงสร้าง 2569' : 'โครงสร้างแผน 2570'
);

const setScope = (mode: string) => {
  if (scopeMode.value === (mode as 'current' | 'plan')) return;
  scopeMode.value = mode as 'current' | 'plan';
  show(mode === 'current'
      ? 'แสดงโครงสร้างอัตรากำลังฉบับปัจจุบัน (บังคับใช้)'
      : 'แสดงโครงสร้างอัตรากำลังฉบับแผน (ยังไม่บังคับใช้)'
  );
};

// --- Selected unit (shared between tree panel & position table)
const selectedUnitId = ref('1000');

const showUnitInfo = (unit: { id: string }) => {
  const full = findUnit(ORG_UNITS, unit.id);
  if (!full) return;
  show(`หน่วยงาน ${full.name} (${full.code}) — ${full.quotaText}${full.count ? ` · ${full.count} คน` : ''}`
  );
};
</script>
