<template>
  <IndicatorForm :type="type" @cancel="goBack" @saved="goBack" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { IndicatorForm } from '../components/evaluations';
import type { IndicatorType } from '../data/indicatorData';
import { useGoBack } from '../composables/useGoBack';

const route = useRoute();
const goBack = useGoBack('/evaluations/indicators/indicator_by_plan');

const TYPE_BY_MENU: Record<string, IndicatorType> = {
  indicator_by_plan: 'plan',
  indicator_by_role: 'position',
  indicator_assigned_tasks: 'assigned',
};

const type = computed<IndicatorType>(() => {
  const fromQuery = String(route.query.type ?? '');
  return TYPE_BY_MENU[fromQuery] ?? TYPE_BY_MENU[String(route.params.nestedId ?? '')] ?? 'plan';
});
</script>
