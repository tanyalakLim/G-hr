<template>
  <div class="h-screen flex flex-col bg-slate-50 text-slate-800 antialiased overflow-hidden">
    <UserTopBar :active="route.name === 'user-home' ? 'home' : null" />
    <main class="flex-1 overflow-y-auto nice-scroll">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import UserTopBar from '../components/user/UserTopBar.vue';

const route = useRoute();
</script>

<style scoped>
.nice-scroll::-webkit-scrollbar {
  width: 6px;
}
.nice-scroll::-webkit-scrollbar-thumb {
  border-radius: 9999px;
  background: #cbd5e1;
}
.nice-scroll::-webkit-scrollbar-track {
  background: transparent;
}
</style>
