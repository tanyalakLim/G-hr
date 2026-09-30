<template>
  <!-- หน้ารายการตัวชี้วัดตำแหน่ง -->
  <IndicatorList type="position" @create="(t) => emit('create', t)" @open-type="(t) => emit('openType', t)" />
</template>

<script setup lang="ts">
import IndicatorList from './IndicatorList.vue';
import type { IndicatorType } from '../../data/indicatorData';

const emit = defineEmits<{
  (e: 'create', type: IndicatorType): void;
  (e: 'openType', type: IndicatorType | 'all'): void;
}>();
</script>
