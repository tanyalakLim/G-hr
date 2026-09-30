<template>
  <PersonnelDetailView v-if="person" :person="person" @back="back" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { PersonnelDetailView } from '../components';
import { INITIAL_PERSONNEL } from '../data/personnelData';
import { useGoBack } from '../composables/useGoBack';

// props: true จาก route /records/:category/person/:id
const props = defineProps<{ id: string; category: string }>();
const router = useRouter();

const person = computed(() => INITIAL_PERSONNEL.find((p) => p.id === props.id) ?? null);
const back = useGoBack(`/records/${props.category}`);

// deep link ที่ระบุ id ไม่ถูกต้อง → กลับไปหน้ารายการ
if (!person.value) {
  router.replace({ name: 'records-list', params: { category: props.category } });
}
</script>
