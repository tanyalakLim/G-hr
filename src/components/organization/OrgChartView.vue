<template>
  <div>
    <!-- Chart Sub Toolbar -->
    <div class="px-4 py-3 border-b border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-2.5">
        <span
          class="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-700"
        >
          <LayoutGrid class="w-4 h-4 text-slate-500" />
          <span>{{ structureLabel }}</span>
        </span>

        <UiButton
          id="btn-download-chart-png"
          variant="outline"
          @click="show('กำลังส่งออกผังองค์กรเป็นไฟล์ PNG')"
        >
          <template #icon>
            <Image class="w-4 h-4 text-blue-700" />
          </template>
          ดาวน์โหลด PNG
        </UiButton>

        <UiButton
          id="btn-download-chart-pdf"
          variant="outline"
          @click="show('กำลังส่งออกผังองค์กรเป็นไฟล์ PDF')"
        >
          <template #icon>
            <FileText class="w-4 h-4 text-red-600" />
          </template>
          ดาวน์โหลด PDF
        </UiButton>
      </div>
    </div>

    <!-- Chart Canvas -->
    <div class="p-4 sm:p-8 bg-slate-50/70 overflow-x-auto">
      <div class="flex flex-col items-center min-w-max mx-auto">
        <!-- Structure Frame Header -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3 flex items-center gap-3.5">
          <div class="w-11 h-11 rounded-xl bg-blue-900 flex items-center justify-center flex-shrink-0">
            <Landmark class="w-5 h-5 text-white" />
          </div>
          <div class="min-w-0">
            <div class="text-[10px] text-slate-400 leading-tight">กรอบอัตรากำลังปีบุคลากร</div>
            <div class="text-sm font-bold text-slate-900">{{ structureLabel }}</div>
          </div>
          <div class="h-9 w-px bg-slate-200 mx-0.5" />
          <UiBadge
            tone="blue"
            size="sm"
            class="flex-shrink-0"
            title="อัตรากำลังทั้งหมดในโครงสร้าง"
          >
            <Users class="w-3.5 h-3.5" />
            {{ totalPeople.toLocaleString() }}
          </UiBadge>
        </div>

        <!-- Connectors -->
        <div class="w-px h-8 bg-slate-300" />
        <div class="relative flex gap-5 items-stretch">
          <div
            class="absolute h-px bg-slate-300"
            :style="{ left: barInset, right: barInset }"
          />
          <div
            v-for="group in chartGroups"
            :key="group.id"
            class="flex-1 min-w-[230px] flex flex-col items-center"
          >
            <div class="w-px h-6 bg-slate-300" />

            <!-- Department Group Card -->
            <div
              class="w-full bg-white rounded-xl border border-slate-200 border-t-4 border-t-blue-900 shadow-sm px-3.5 py-3 flex items-center justify-between gap-2 transition-shadow hover:shadow-md cursor-pointer"
              :title="`หน่วยงาน ${group.name} (${group.code})`"
              @click="emit('showUnitInfo', group)"
            >
              <div class="flex items-center gap-2 min-w-0">
                <span class="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                <span class="text-xs font-bold text-slate-800 truncate">{{ group.name }}</span>
              </div>
              <UiBadge tone="blue" shape="chip" class="flex-shrink-0">{{ group.count }}</UiBadge>
            </div>

            <!-- Child Unit Rows -->
            <div
              v-if="group.children.length"
              class="w-full mt-2.5 ml-2 border-l border-slate-200 pl-2.5 flex flex-col gap-2"
            >
              <div v-for="child in group.children" :key="child.id" class="relative">
                <div class="absolute -left-[0.6rem] top-1/2 w-2.5 h-px bg-slate-200" />
                <div
                  class="bg-white rounded-lg border border-slate-200 px-3 py-2.5 flex items-center justify-between gap-2 hover:border-blue-300 transition-colors cursor-pointer"
                  @click="emit('showUnitInfo', child)"
                >
                  <span class="text-[11px] font-medium text-slate-700 truncate">{{ child.name }}</span>
                  <span class="flex items-center gap-1.5 flex-shrink-0">
                    <UiBadge tone="blue" shape="chip">{{ child.count }}</UiBadge>
                    <ChevronDown class="w-3.5 h-3.5 text-slate-400" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  ChevronDown,
  LayoutGrid,
  Users,
  Landmark,
  Image,
  FileText,
} from 'lucide-vue-next';
import { UiBadge, UiButton } from '../ui';
import { chartGroups, totalPeople } from './orgHelpers';
import type { ChartGroup, ChartGroupChild } from './orgHelpers';
import { useToast } from '../../composables/useToast';
const { show } = useToast();

defineProps<{
  structureLabel: string;
}>();

const emit = defineEmits<{
  (e: 'showUnitInfo', unit: ChartGroup | ChartGroupChild): void;
}>();

const barInset = computed(() => `${50 / chartGroups.length}%`);
</script>
