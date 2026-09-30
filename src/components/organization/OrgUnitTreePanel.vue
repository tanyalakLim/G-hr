<template>
  <aside class="lg:col-span-3 p-3 sm:p-4 lg:border-r border-slate-100">
    <div class="rounded-xl flex flex-col h-full min-h-[420px]">
      <!-- Tree Header -->
      <div class="flex items-center justify-between gap-2 pb-2.5">
        <h3 class="text-xs font-bold text-slate-800">หน่วยงานและตำแหน่ง</h3>
        <button
          id="btn-expand-all-units"
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
          id="unit-tree-search-input"
          v-model="unitSearch"
          placeholder="ค้นหาหน่วยงาน..."
        />
      </div>

      <!-- Unit Tree -->
      <div class="flex-1 overflow-y-auto max-h-[520px] -mx-1 px-1">
        <UiTree
          :items="visibleTreeNodes"
          v-model:expanded="expandedUnitIds"
          :selected-id="selectedUnitId"
          show-info
          @select="(node) => emit('select', node.id)"
          @info="handleUnitInfo"
        />
      </div>
    </div>

    <!-- รายละเอียดโครงสร้างหน่วยงาน -->
    <UnitInfoModal
      :is-open="infoUnitId !== null"
      :unit-id="infoUnitId"
      @close="infoUnitId = null"
    />
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Plus } from 'lucide-vue-next';
import { UiSearchInput, UiTree } from '../ui';
import { ORG_UNITS } from '../../data/organizationData';
import type { OrgUnit } from '../../data/organizationData';
import { collectAllParentIds, unitSubtreeMatches } from './orgHelpers';
import UnitInfoModal from './modals/UnitInfoModal.vue';

const props = defineProps<{
  selectedUnitId: string;
}>();

const emit = defineEmits<{
  (e: 'select', unitId: string): void;
}>();

const expandedUnitIds = ref<string[]>(['1000', '1001']);
const unitSearch = ref('');
const allExpanded = ref(false);

const toggleExpandAll = () => {
  allExpanded.value = !allExpanded.value;
  expandedUnitIds.value = allExpanded.value ? collectAllParentIds() : [];
};

// --- ต้นไม้ที่กรองด้วยช่องค้นหา (map เป็นโครงสร้างของ UiTree)
interface UiTreeNodeInput {
  id: string;
  label: string;
  desc?: string;
  children?: UiTreeNodeInput[];
}

const visibleTreeNodes = computed<UiTreeNodeInput[]>(() => {
  const q = unitSearch.value.trim().toLowerCase();
  const prune = (units: OrgUnit[]): OrgUnit[] =>
    q ? units.filter((u) => unitSubtreeMatches(u, q)) : units;
  const toNodes = (units: OrgUnit[]): UiTreeNodeInput[] =>
    prune(units).map((u) => ({
      id: u.id,
      label: u.name,
      desc: [u.code, u.shortName].filter(Boolean).join(' '),
      children: u.children ? toNodes(u.children) : undefined,
    }));
  return toNodes(ORG_UNITS);
});

// พิมพ์ค้นหา -> ขยายทุกโหนดให้เห็นผลลัพธ์
watch(unitSearch, (q) => {
  if (q.trim()) {
    expandedUnitIds.value = collectAllParentIds();
    allExpanded.value = true;
  }
});

const handleUnitInfo = (node: { id: string }) => {
  infoUnitId.value = node.id;
};

// --- รายละเอียดโครงสร้างหน่วยงาน
const infoUnitId = ref<string | null>(null);
</script>
