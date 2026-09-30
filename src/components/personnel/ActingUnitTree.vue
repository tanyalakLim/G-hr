<template>
  <aside class="lg:col-span-3 p-3 sm:p-4 lg:border-r border-slate-100">
    <div class="rounded-xl flex flex-col h-full min-h-[420px]">
      <!-- Tree Header -->
      <div class="flex items-center justify-between gap-2 pb-2.5">
        <h3 class="text-xs font-bold text-slate-800">หน่วยงานและตำแหน่ง</h3>
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
          :selected-id="selectedNodeId"
          @select="handleSelect"
        />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Plus } from 'lucide-vue-next';
import { UiSearchInput, UiTree } from '../ui';
import { ORG_UNITS } from '../../data/organizationData';

const props = defineProps<{
  selectedNodeId: string;
}>();

const emit = defineEmits<{
  (e: 'select', unitId: string): void;
}>();

// --- ต้นไม้หน่วยงาน (โครงสร้างร่วมกับ ORG_UNITS เหมือนหน้าอัตรากำลัง)
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

const handleSelect = (node: { id: string }) => {
  emit('select', node.id);
};
</script>
