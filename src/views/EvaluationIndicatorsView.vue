<template>
  <!-- แต่ละเมนู (ตามแผน/ตามตำแหน่ง/งานอื่นๆ) เป็นหน้าคอมโพเนนต์ของตัวเอง -->
  <component :is="pageComponent" @create="openCreate" @open-type="openType" />
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { IndicatorByPlan, IndicatorByPosition, IndicatorByOtherTasks } from '../components/evaluations';
import type { IndicatorType } from '../data/indicatorData';

const route = useRoute();
const router = useRouter();

const openCreate = (type: IndicatorType) => {
  router.push({ path: '/evaluations/indicators/new', query: { type } });
};

const PATH_BY_TYPE: Record<string, string> = {
  plan: '/evaluations/indicators/indicator_by_plan',
  position: '/evaluations/indicators/indicator_by_role',
  assigned: '/evaluations/indicators/indicator_assigned_tasks',
};

const openType = (type: IndicatorType | 'all') => {
  router.push(PATH_BY_TYPE[type] ?? PATH_BY_TYPE.plan);
};

const PAGE_BY_MENU: Record<string, { component: Component; type: IndicatorType }> = {
  indicator_by_plan: { component: IndicatorByPlan, type: 'plan' },
  indicator_by_role: { component: IndicatorByPosition, type: 'position' },
  indicator_assigned_tasks: { component: IndicatorByOtherTasks, type: 'assigned' },
};

const pageComponent = computed(() => {
  const nestedId = String(route.params.nestedId ?? '');
  return PAGE_BY_MENU[nestedId]?.component ?? IndicatorByPlan;
});
</script>
