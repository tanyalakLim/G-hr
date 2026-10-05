<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-3">
    <!-- Page Title -->
    <div class="pb-2">
      <PageTitle title="ยุทธศาสตร์" subtitle="จัดการโครงสร้างยุทธศาสตร์และยุทธการย่อยสำหรับการประเมิน" />
    </div>

    <!-- Main Card -->
    <div class="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      <!-- Toolbar -->
      <div class="px-4 sm:px-6 py-3.5 border-b border-slate-100 flex items-center gap-2">
        <UiButton
          id="btn-add-competency"
          title="เพิ่มยุทธศาสตร์ใหม่"
          class="whitespace-nowrap shrink-0"
          @click="addRoot"
        >
          <template #icon>
            <Plus class="w-4 h-4" />
          </template>
          เพิ่มข้อมูล
        </UiButton>

        <UiIconButton
          id="btn-reorder-strategy"
          tone="outline"
          class="shrink-0"
          title="จัดเรียงยุทธศาสตร์"
          @click="show('จัดเรียงยุทธศาสตร์ ยังไม่เปิดใช้งาน')"
        >
          <ArrowDownUp class="w-4 h-4 text-bma-700" />
        </UiIconButton>

        <UiSearchInput
          id="strategy-search-input"
          v-model="search"
          placeholder="ค้นหา"
          class="w-full sm:w-72"
        />

      </div>

      <!-- Tree: การ์ดแยกเป็นชั้น -->
      <div class="px-3 sm:px-4 py-4 min-h-[420px] space-y-2">
        <template v-for="row in flatRows" :key="row.node.id">
          <!-- การ์ดโหนด -->
          <div
            class="group/row flex items-center gap-2.5 bg-white rounded-xl border px-3.5 py-3 transition-all cursor-pointer"
            :class="[
              row.depth === 0 ? '' : 'ml-6',
              selectedId === row.node.id
                ? 'border-slate-200/90 bg-bma-50/40'
                : 'border-slate-200/90 hover:border-slate-300'
            ]"
            :style="row.depth > 0 ? { marginLeft: row.depth * 24 + 'px' } : {}"
            @click="selectedId = row.node.id"
          >
            <!-- ปุ่มขยาย -->
            <button
              type="button"
              class="w-7 h-7 rounded-lg border border-slate-200/90 bg-slate-50 flex items-center justify-center transition-colors cursor-pointer shrink-0 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              :title="isExpanded(row.node.id) ? 'ยุบ' : 'ขยาย'"
              @click.stop="toggleExpand(row.node.id)"
            >
              <ChevronDown
                v-if="row.node.children.length"
                class="w-3.5 h-3.5 transition-transform"
                :class="{ '-rotate-90': !isExpanded(row.node.id) }"
              />
              <span v-else class="w-1.5 h-1.5 rounded-full" :class="row.depth === 0 ? 'bg-bma-600' : 'bg-slate-300'" />
            </button>

            <!-- ชื่อ / ช่องแก้ชื่อ -->
            <div
              v-if="editingId === row.node.id"
              class="flex-1 min-w-0"
              @keyup.enter="commitEdit"
              @keyup.esc="cancelEdit"
              @click.stop
            >
              <UiInput
                id="strategy-edit-input"
                v-model="editingName"
                :placeholder="row.depth === 0 ? 'กรอกชื่อยุทธศาสตร์...' : 'กรอกชื่อยุทธศาสตร์ย่อย...'"
              />
            </div>
            <span
              v-else
              class="flex-1 min-w-0 leading-snug truncate"
              :class="row.depth === 0 ? 'text-sm font-bold text-slate-800' : 'text-xs font-medium text-slate-700'"
            >{{ row.node.name }}</span>

            <!-- ชิปนับจำนวนย่อย -->
            <UiBadge
              v-if="row.depth === 0 && row.node.children.length"
              tone="blue"
              shape="chip"
              class="shrink-0 tabular-nums"
            >
              {{ row.node.children.length }} ย่อย
            </UiBadge>

            <!-- ตอนแก้ไข: บันทึก / ปิด -->
            <div v-if="editingId === row.node.id" class="flex items-center gap-1.5 shrink-0">
              <UiButton size="xs" class="!rounded-lg" @click.stop="commitEdit">
                บันทึก
              </UiButton>
              <UiButton variant="outline" size="xs" class="!rounded-lg" @click.stop="cancelEdit">
                ปิด
              </UiButton>
            </div>

            <!-- ปุ่มจัดการ (UiIconButton จากระบบ) -->
            <div v-else class="flex items-center gap-1 shrink-0">
              <UiIconButton tone="ghost" title="เพิ่มระดับย่อย" @click.stop="addChild(row.node)">
                <Plus class="w-4 h-4 text-bma-600" />
              </UiIconButton>
              <UiIconButton tone="ghost" title="แก้ไขชื่อ" @click.stop="startRename(row.node)">
                <Pencil class="w-4 h-4 text-sky-600" />
              </UiIconButton>
              <UiIconButton
                v-if="row.depth === 0"
                tone="ghost"
                title="จัดลำดับข้อมูล (สลับขึ้น)"
                @click.stop="moveUp(row.node)"
              >
                <ArrowDownUp class="w-4 h-4 text-bma-600" />
              </UiIconButton>
              <UiIconButton tone="ghost" title="ลบข้อมูล" @click.stop="removeNode(row.node)">
                <Trash2 class="w-4 h-4 text-red-500" />
              </UiIconButton>
            </div>
          </div>
        </template>

        <UiEmptyState
          v-if="flatRows.length === 0"
          :message="search.trim() ? 'ไม่พบยุทธศาสตร์ตามเงื่อนไขที่ระบุ' : 'ยังไม่มียุทธศาสตร์ — กดปุ่ม + เพื่อเพิ่ม'"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { PageTitle } from '../common';
import { UiBadge, UiButton, UiEmptyState, UiIconButton, UiInput, UiSearchInput } from '../ui';
import { ArrowDownUp, ChevronDown, Pencil, Plus, Trash2 } from 'lucide-vue-next';
import { useToast } from '../../composables/useToast';

const { show } = useToast();

interface StrategyNode {
  id: string;
  name: string;
  children: StrategyNode[];
}

let uidCounter = 1;
const uid = () => `n${uidCounter++}`;

const strategies = ref<StrategyNode[]>([
  {
    id: 's1',
    name: 'ยุทธศาสตร์ชาติ 20 ปี',
    children: [
      { id: 's1-1', name: 'ยุทธการด้านความมั่นคง', children: [] },
      { id: 's1-2', name: 'ยุทธการประชาสัมพันธ์', children: [] },
      { id: 's1-3', name: 'ยุทธการสร้างธรรมาภิบาล', children: [] },
    ],
  },
  {
    id: 's2',
    name: 'ภายในยุทธศาสตร์',
    children: [
      {
        id: 's2-1',
        name: 'ยุทธศาสตร์ย่อย 1',
        children: [
          { id: 's2-1-1', name: 'ยุทธศาสตร์ย่อย 1.1', children: [] },
        ],
      },
    ],
  },
]);

const expandedIds = ref<string[]>(['s1', 's2', 's2-1']);
const selectedId = ref<string | null>(null);

const isExpanded = (id: string) => expandedIds.value.includes(id);
const toggleExpand = (id: string) => {
  expandedIds.value = isExpanded(id)
    ? expandedIds.value.filter((i) => i !== id)
    : [...expandedIds.value, id];
};

// --- ค้นหาโหนดในต้นไม้จริง (สำหรับ add/edit/delete)
const findNode = (nodes: StrategyNode[], id: string): StrategyNode | null => {
  for (const n of nodes) {
    if (n.id === id) return n;
    const found = findNode(n.children, id);
    if (found) return found;
  }
  return null;
};

const findSiblingList = (nodes: StrategyNode[], id: string): StrategyNode[] | null => {
  if (nodes.some((n) => n.id === id)) return nodes;
  for (const n of nodes) {
    const found = findSiblingList(n.children, id);
    if (found) return found;
  }
  return null;
};

// --- จัดการโหนด: เพิ่มย่อยได้ทุกระดับ + กรอกชื่อในแถว
const editingId = ref<string | null>(null);
const editingName = ref('');
let pendingParentId: string | null = null;
let pendingIsRoot = false;

const editingIsRename = ref(false);

const startEdit = (nodeId: string, initialName: string) => {
  editingId.value = nodeId;
  editingName.value = initialName;
  nextTick(() => document.getElementById('strategy-edit-input')?.focus());
};

// เข้าโหมดแก้ชื่อโหนดที่มีอยู่
const startRename = (node: StrategyNode) => {
  if (editingId.value) commitEdit();
  editingIsRename.value = true;
  pendingParentId = null;
  selectedId.value = node.id;
  startEdit(node.id, node.name);
};

const commitEdit = () => {
  if (!editingId.value) return;
  const list = findSiblingList(strategies.value, editingId.value);
  const node = list?.find((n) => n.id === editingId.value);
  if (!node) return;
  const name = editingName.value.trim();

  if (editingIsRename.value) {
    if (name) node.name = name;
    show(name ? `แก้ไขชื่อเป็น "${name}" แล้ว` : 'คงชื่อเดิมไว้');
  } else if (!name) {
    list!.splice(list!.indexOf(node), 1);
    show('ยกเลิกการเพิ่มยุทธศาสตร์');
  } else {
    node.name = name;
    show(`เพิ่ม"${name}"แล้ว`);
  }
  editingId.value = null;
  editingIsRename.value = false;
  pendingParentId = null;
};

const cancelEdit = () => {
  if (!editingId.value) return;
  if (!editingIsRename.value) {
    const list = findSiblingList(strategies.value, editingId.value);
    const node = list?.find((n) => n.id === editingId.value);
    if (node && !node.name) list!.splice(list!.indexOf(node), 1);
  }
  editingId.value = null;
  editingIsRename.value = false;
  pendingParentId = null;
};

// จัดลำดับ: สลับขึ้นหนึ่งตำแหน่ง (ถ้าอยู่บนสุด ไปท้ายสุด)
const moveUp = (node: StrategyNode) => {
  const list = findSiblingList(strategies.value, node.id);
  if (!list || list.length < 2) {
    show('ไม่มีรายการอื่นให้สลับ');
    return;
  }
  const idx = list.findIndex((n) => n.id === node.id);
  if (idx === 0) {
    list.push(list.shift()!);
    show(`ย้าย "${node.name}" ไปลำดับสุดท้าย`);
  } else {
    [list[idx - 1], list[idx]] = [list[idx], list[idx - 1]];
    show(`ย้าย "${node.name}" ขึ้นหนึ่งลำดับ`);
  }
};

const addChild = (parent: StrategyNode) => {
  const target = findNode(strategies.value, parent.id);
  if (!target) return;
  if (editingId.value) commitEdit();
  const node: StrategyNode = { id: uid(), name: '', children: [] };
  target.children.push(node);
  if (!isExpanded(target.id)) expandedIds.value.push(target.id);
  pendingParentId = target.id;
  pendingIsRoot = false;
  startEdit(node.id, '');
};

const addRoot = () => {
  if (editingId.value) commitEdit();
  const node: StrategyNode = { id: uid(), name: '', children: [] };
  strategies.value.push(node);
  pendingParentId = null;
  pendingIsRoot = true;
  startEdit(node.id, '');
};

const removeNode = (node: StrategyNode) => {
  const list = findSiblingList(strategies.value, node.id);
  if (!list) return;
  list.splice(
    list.findIndex((n) => n.id === node.id),
    1
  );
  show(`ลบ "${node.name}" แล้ว`);
};

// --- ค้นหา (คงโครงสร้าง path ที่เจอ)
const search = ref('');

const matchNode = (node: StrategyNode, q: string): StrategyNode | null => {
  const children = node.children
    .map((c) => matchNode(c, q))
    .filter((c): c is StrategyNode => c !== null);
  if (node.name.toLowerCase().includes(q) || children.length) {
    return { ...node, children: q ? children : node.children };
  }
  return null;
};

const filteredStrategies = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return strategies.value;
  return strategies.value
    .map((s) => matchNode(s, q))
    .filter((s): s is StrategyNode => s !== null);
});

// --- แปลงต้นไม้เป็นรายการแบน (เฉพาะ path ที่ขยายอยู่)
interface FlatNode {
  node: StrategyNode;
  depth: number;
  isLast: boolean;
}

const flatten = (nodes: StrategyNode[], depth = 0): FlatNode[] =>
  nodes.flatMap((n, i) => [
    { node: n, depth, isLast: i === nodes.length - 1 },
    ...(isExpanded(n.id) && n.children.length ? flatten(n.children, depth + 1) : []),
  ]);

const flatRows = computed(() => flatten(filteredStrategies.value));
</script>
