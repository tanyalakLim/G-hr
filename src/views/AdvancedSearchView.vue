<template>
  <AdvancedSearch @back-to-dossier="backToDossier" @open-detail="openDetail" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { AdvancedSearch } from '../components';
import { useGoBack } from '../composables/useGoBack';
import type { PersonnelRecord } from '../types';

const router = useRouter();
const backToDossier = useGoBack('/records/civil_servant');

const openDetail = (person: PersonnelRecord) => {
  router.push({ name: 'person-detail', params: { category: person.category, id: person.id } });
};
</script>
