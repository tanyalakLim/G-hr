<template>
  <div class="space-y-0.5">
    <div v-for="node in items" :key="node.id">
      <div
        class="group flex items-center gap-1.5 rounded-lg px-2 py-1.5 cursor-pointer transition-colors text-xs"
        :class="selectedId === node.id ? 'bg-blue-50 text-blue-900' : 'hover:bg-slate-50 text-slate-700'"
        @click="emit('select', node)"
      >
        <button
          v-if="node.children?.length"
          type="button"
          class="text-slate-400 hover:text-slate-700 flex-shrink-0 cursor-pointer"
          @click.stop="toggle(node.id)"
        >
          <ChevronDown v-if="isExpanded(node.id)" class="w-3.5 h-3.5" />
          <ChevronRight v-else class="w-3.5 h-3.5" />
        </button>

        <div class="min-w-0 flex-1">
          <div class="truncate font-medium leading-snug">{{ node.label }}</div>
          <div v-if="node.desc" class="text-[10px] text-slate-400 mt-0.5">{{ node.desc }}</div>
        </div>

        <UiBadge v-if="node.count !== undefined" tone="blue" shape="chip" class="flex-shrink-0">
          {{ node.count }}
        </UiBadge>

        <button
          v-if="showInfo && selectedId === node.id"
          type="button"
          class="text-slate-400 hover:text-blue-900 flex-shrink-0 cursor-pointer"
          title="ข้อมูลเพิ่มเติม"
          @click.stop="emit('info', node)"
        >
          <Info class="w-3.5 h-3.5" />
        </button>
      </div>

      <div
        v-if="node.children?.length && isExpanded(node.id)"
        class="ml-3.5 border-l border-slate-200 pl-1.5"
      >
        <UiTree
          :items="node.children"
          v-model:expanded="expanded"
          :selected-id="selectedId"
          :show-info="showInfo"
          @select="emit('select', $event)"
          @info="emit('info', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ChevronDown, ChevronRight, Info } from 'lucide-vue-next';
import UiBadge from './UiBadge.vue';

export interface UiTreeNode {
  id: string;
  label: string;
  desc?: string;
  count?: number;
  children?: UiTreeNode[];
}

withDefaults(
  defineProps<{
    items: UiTreeNode[];
    selectedId?: string;
    showInfo?: boolean;
  }>(),
  {
    selectedId: undefined,
    showInfo: false,
  }
);

const emit = defineEmits<{
  (e: 'select', node: UiTreeNode): void;
  (e: 'info', node: UiTreeNode): void;
}>();

const expanded = defineModel<string[]>('expanded', { default: () => [] });

const isExpanded = (id: string) => expanded.value.includes(id);

const toggle = (id: string) => {
  expanded.value = isExpanded(id)
    ? expanded.value.filter((i) => i !== id)
    : [...expanded.value, id];
};
</script>
