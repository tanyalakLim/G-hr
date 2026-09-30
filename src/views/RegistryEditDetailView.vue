<template>
  <RegistryPositionEditDetail v-if="row" :row="row" @back="back" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import RegistryPositionEditDetail from '../components/personnel/RegistryPositionEditDetail.vue';
import { registryRows } from '../data/registryRows';
import { useGoBack } from '../composables/useGoBack';

// props: true จาก route /edit_records/:citizenId
const props = defineProps<{ citizenId: string }>();
const router = useRouter();
const back = useGoBack('/edit_records');

const row = computed(() => registryRows.value.find((r) => r.citizenId === props.citizenId) ?? null);

// deep link ที่ระบุ citizenId ไม่ถูกต้อง → กลับไปหน้ารายการ
if (!row.value) {
  router.replace({ name: 'edit-records' });
}
</script>
