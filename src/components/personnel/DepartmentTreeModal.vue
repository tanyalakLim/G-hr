<template>
  <UiModal 
    title="เลือกสังกัด/ส่วนราชการ"
    subtitle="เลือกสังกัด/ส่วนราชการ ที่คุณต้องการกรองข้อมูลบุคลากร"
    :is-open="isOpen" 
    @close="emit('close')">
    <template #icon>
      <Building class="w-5 h-5 text-bma-700" />
    </template>
    

    <div class="space-y-3">
      <UiSearchInput
        id="department-tree-search-input"
        v-model="unitSearch"
        placeholder="ค้นหาหน่วยงาน..."
      />

      <div class="overflow-y-auto max-h-[360px] -mx-1 px-1 border border-slate-100 rounded-xl p-2 bg-slate-50/50">
        <button
          type="button"
          class="w-full text-left flex items-center gap-2 rounded-lg px-2 py-1.5 mb-1 text-xs transition-colors cursor-pointer"
          :class="!selectedUnitId ? 'bg-blue-50 text-blue-900 font-semibold' : 'hover:bg-white text-slate-600'"
          @click="handleSelect(null)"
        >
          <span>สังกัด/ส่วนราชการ (ทั้งหมด)</span>
        </button>

        <UiTree
          :items="visibleTreeNodes"
          v-model:expanded="expandedUnitIds"
          :selected-id="selectedUnitId ?? undefined"
          @select="handleSelect"
        />

        <div v-if="visibleTreeNodes.length === 0" class="py-8 text-center text-xs text-slate-400">
          ไม่พบหน่วยงานที่ค้นหา
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UiButton variant="outline" size="xs" @click="emit('close')">ปิด</UiButton>
      </div>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Building } from 'lucide-vue-next';
import { UiButton, UiModal, UiSearchInput, UiTree } from '../ui';
import type { UiTreeNode } from '../ui/UiTree.vue';
import { ORG_UNITS } from '../../data/organizationData';
import type { OrgUnit } from '../../data/organizationData';
import { collectAllParentIds, unitSubtreeMatches } from '../organization/orgHelpers';

const props = defineProps<{
  isOpen: boolean;
  selectedUnitId?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'select', unit: OrgUnit | null): void;
}>();

const unitSearch = ref('');
const expandedUnitIds = ref<string[]>(['1000', '2000', '3000', '4000', '5000']);

watch(
  () => props.isOpen,
  (open) => {
    if (open) unitSearch.value = '';
  }
);

watch(unitSearch, (q) => {
  if (q.trim()) expandedUnitIds.value = collectAllParentIds();
});

const visibleTreeNodes = computed<UiTreeNode[]>(() => {
  const q = unitSearch.value.trim().toLowerCase();
  const prune = (units: OrgUnit[]): OrgUnit[] =>
    q ? units.filter((u) => unitSubtreeMatches(u, q)) : units;
  const toNodes = (units: OrgUnit[]): UiTreeNode[] =>
    prune(units).map((u) => ({
      id: u.id,
      label: u.name,
      desc: [u.code, u.shortName].filter(Boolean).join(' '),
      children: u.children ? toNodes(u.children) : undefined,
    }));
  return toNodes(ORG_UNITS);
});

const handleSelect = (node: UiTreeNode | null) => {
  if (!node) {
    emit('select', null);
    return;
  }
  const find = (units: OrgUnit[]): OrgUnit | undefined => {
    for (const u of units) {
      if (u.id === node.id) return u;
      const found = u.children ? find(u.children) : undefined;
      if (found) return found;
    }
    return undefined;
  };
  emit('select', find(ORG_UNITS) ?? null);
};
</script>
