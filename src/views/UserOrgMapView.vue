<template>
  <div>
    <main class="p-4 sm:p-6 lg:px-20 lg:py-8 max-w-8xl mx-auto space-y-4">
      <!-- หัวหน้า -->
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-1">
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">แผนที่องค์กร</h1>
          <p class="text-xs text-slate-500 mt-0.5">สำรวจโครงสร้างหน่วยงาน · ระบบแผนผังองค์กร กทม.</p>
        </div>
      </div>

      <!-- ผังองค์กร (ชุด component เดียวกับหน้าโครงสร้างอัตรากำลัง) -->
      <div class="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
        <OrgChartView
          structure-label="โครงสร้าง 2569"
          @show-unit-info="showUnitInfo"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import OrgChartView from '../components/organization/OrgChartView.vue';
import { ORG_UNITS } from '../data/organizationData';
import { findUnit } from '../components/organization/orgHelpers';
import { useToast } from '../composables/useToast';

const { show } = useToast();

const showUnitInfo = (unit: { id: string }) => {
  const full = findUnit(ORG_UNITS, unit.id);
  if (!full) return;
  show(`หน่วยงาน ${full.name} (${full.code}) — ${full.quotaText}${full.count ? ` · ${full.count} คน` : ''}`);
};
</script>
