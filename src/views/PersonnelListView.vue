<template>
  <PersonnelDossier
    :category="category"
    @open-detail="openDetail"
    @open-advanced-search="router.push({ name: 'records-advanced-search' })"
    @view-requests="router.push({ name: 'modification-requests' })"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PersonnelDossier } from '../components';
import type { PersonnelCategory, PersonnelRecord } from '../types';

const route = useRoute();
const router = useRouter();

const category = computed(() => route.params.category as PersonnelCategory);

// เปิดหน้ารายละเอียดบุคคล — ใช้หมวดของตัวบุคคลเองใน URL (เข้าได้จากทั้งทะเบียนและค้นหาขั้นสูง)
const openDetail = (person: PersonnelRecord) => {
  router.push({ name: 'person-detail', params: { category: person.category, id: person.id } });
};
</script>
