<template>
  <!-- หน้าล็อกอินและฝั่งบุคลากร (User) แสดงเต็มจอ ไม่ใช้ Sidebar/Header ของ Admin -->
  <div v-if="isLoginRoute || isUserRoute" class="h-full overflow-hidden text-slate-800 antialiased relative">
    <RouterView />
    <Toast :message="toastMessage" />
  </div>

  <div v-else class="h-full flex overflow-hidden text-slate-800 antialiased relative">
    <!-- Primary Sidebar -->
    <Sidebar
      :is-collapsed="isCollapsed"
      :is-mobile-open="isMobileOpen"
      @closeMobile="isMobileOpen = false"
    />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-50 transition-all duration-300">
      <!-- Top Header -->
      <Header @toggle-sidebar="handleToggleSidebar" />

      <!-- Scrollable Main Content (สลับตาม route) -->
      <main class="flex-1 overflow-y-auto min-w-0 bg-[#f8f9fc]">
        <RouterView />
      </main>
    </div>

    <!-- Global Toast Notification -->
    <Toast :message="toastMessage" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Sidebar, Header, Toast } from './components';
import { useToast } from './composables/useToast';

// สถานะของ shell (layout chrome) — การนำทางทั้งหมดอยู่ที่ router
const isCollapsed = ref(false);
const isMobileOpen = ref(false);
const { message: toastMessage } = useToast();
const route = useRoute();

const isLoginRoute = computed(() => route.path === '/login');
const isUserRoute = computed(() => route.path.startsWith('/user'));

const handleToggleSidebar = () => {
  if (window.innerWidth < 1024) {
    isMobileOpen.value = !isMobileOpen.value;
  } else {
    isCollapsed.value = !isCollapsed.value;
  }
};
</script>
