<template>
  <div class="flex flex-col min-h-full w-full">
    <ModificationRequestDetail v-if="request" :request="request" @back="back" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import ModificationRequestDetail from '../components/personnel/ModificationRequestDetail.vue';
import { modificationRequests } from '../data/modificationRequests';
import { useGoBack } from '../composables/useGoBack';

// props: true จาก route /records/modification_requests/:requestId
const props = defineProps<{ requestId: string }>();
const router = useRouter();
const back = useGoBack('/records/modification_requests');

const request = computed(() => modificationRequests.value.find((r) => r.id === props.requestId) ?? null);

// deep link ที่ระบุ id ไม่ถูกต้อง → กลับไปหน้ารายการ
if (!request.value) {
  router.replace({ name: 'modification-requests' });
}
</script>
