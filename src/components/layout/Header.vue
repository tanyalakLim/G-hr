<template>
  <header
    id="top-navigation-header"
    data-purpose="top-navigation-bar"
    class="h-16 bg-white px-4 sm:px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-20 w-full border-b border-slate-200 shadow-xs"
  >
    <!-- Left section: Toggle button & Breadcrumb -->
    <div class="flex items-center gap-2 sm:gap-4 min-w-0">
      <button
        id="sidebar-toggle-btn"
        class="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 active:scale-95 rounded-lg transition-all flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
        title="ย่อ / ขยายเมนู"
        type="button"
        @click="$emit('toggleSidebar')"
      >
        <Menu class="w-5 h-5" />
      </button>

      <div v-if="activeMenu === 'records'" class="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-500 truncate">
        <span class="hidden md:inline">ทะเบียนประวัติ</span>
        <ChevronRight class="w-3.5 h-3.5 text-slate-400 hidden md:inline flex-shrink-0" />
        <span class="font-medium text-slate-800 truncate">
          {{ breadcrumbLabel }}
        </span>
        <span class="text-slate-300 hidden sm:inline">|</span>
        <span class="text-slate-400 text-xs hidden lg:inline truncate">
          สังกัดส่วนกลางและสำนัก
        </span>
      </div>
      <div v-else class="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-500 truncate">
        <span class="hidden md:inline font-normal text-slate-500">
          ระบบบริหารทรัพยากรบุคคล
        </span>
        <span class="text-slate-300 hidden md:inline">/</span>
        <span class="font-semibold text-slate-800 truncate">
          {{ MENU_LABELS[activeMenu] ?? 'ระบบบริหารทรัพยากรบุคคล' }}
        </span>
        <span v-if="activeMenu === 'home'" class="text-slate-300 hidden sm:inline">|</span>
        <span v-if="activeMenu === 'home'" class="text-slate-400 text-xs hidden sm:inline truncate">
          กล่องข้อความและการแจ้งเตือน
        </span>
      </div>
    </div>

    <!-- Right section: Actions & User Info -->
    <div class="flex items-center gap-1.5 sm:gap-3 flex-shrink-0 relative">
      <!-- Bookmark Button -->
      <button
        id="header-bookmark-btn"
        class="p-2 rounded-lg transition-colors hidden sm:inline-flex"
        :class="isBookmarked ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'"
        :title="isBookmarked ? 'ลบบุ๊กมาร์ก' : 'บันทึกหน้านี้'"
        type="button"
        @click="isBookmarked = !isBookmarked"
      >
        <Bookmark class="w-5 h-5" :class="isBookmarked ? 'fill-amber-500' : ''" />
      </button>

      <!-- Notifications Button -->
      <div class="relative">
        <button
          id="header-notifications-btn"
          class="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="การแจ้งเตือน"
          type="button"
          @click="toggleNotifications"
        >
          <Bell class="w-5 h-5" />
          <span
            v-if="unreadCount > 0"
            class="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none"
          >
            {{ unreadCount }}
          </span>
        </button>

        <!-- Notifications Dropdown -->
        <div
          v-if="showNotifications"
          class="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div class="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
            <span class="font-semibold text-xs text-slate-800">
              การแจ้งเตือนล่าสุด ({{ unreadCount }} ยังไม่อ่าน)
            </span>
            <span
              class="text-[11px] text-blue-700 hover:underline cursor-pointer"
              @click="router.push('/home')"
            >
              ดูทั้งหมด
            </span>
          </div>
          <div class="max-h-72 overflow-y-auto divide-y divide-slate-100">
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors flex items-start gap-2.5"
              :class="!msg.isRead ? 'bg-blue-50/50 font-medium' : ''"
              @click="handleMessageClick(msg.id)"
            >
              <span
                class="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                :class="!msg.isRead ? 'bg-blue-700' : 'bg-slate-300'"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-1">
                  <span class="font-semibold text-slate-900 truncate">
                    {{ msg.title }}
                  </span>
                  <span class="text-[10px] text-slate-400 whitespace-nowrap">
                    {{ msg.time }}
                  </span>
                </div>
                <p class="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {{ msg.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- User Profile Pill -->
      <div class="relative">
        <button
          id="user-profile-menu-btn"
          class="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-slate-200 cursor-pointer text-left hover:opacity-90 transition-opacity"
          type="button"
          @click="toggleProfileMenu"
        >
          <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#003380] flex items-center justify-center text-white font-medium text-sm shadow-xs flex-shrink-0">
            <User class="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div class="hidden sm:flex flex-col text-left">
            <div class="text-xs sm:text-sm font-semibold text-slate-800 leading-tight">
              สมชาย ใจดี
            </div>
            <div class="text-[10px] sm:text-[11px] text-slate-500 leading-tight font-normal">
              เจ้าหน้าที่บุคคลชำนาญการ
            </div>
          </div>
          <ChevronDown class="w-4 h-4 text-slate-400 hidden sm:block ml-0.5" />
        </button>

        <!-- Profile Dropdown Menu -->
        <div
          v-if="showProfileMenu"
          class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs"
        >
          <div class="px-3.5 py-2 border-b border-slate-100 sm:hidden">
            <div class="font-semibold text-slate-800">สมชาย ใจดี</div>
            <div class="text-[11px] text-slate-500">เจ้าหน้าที่บุคคลชำนาญการ</div>
          </div>
          <div class="px-3.5 py-2 text-[11px] text-slate-400 font-medium">
            สังกัด: กลุ่มบริหารงานบุคคล สำนักปลัด
          </div>
          <button
            type="button"
            class="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
            @click="showProfileMenu = false"
          >
            <User class="w-3.5 h-3.5 text-slate-400" />
            ข้อมูลประวัติส่วนบุคคล
          </button>
          <button
            type="button"
            class="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
            @click="showProfileMenu = false"
          >
            <ShieldCheck class="w-3.5 h-3.5 text-slate-400" />
            สิทธิ์การเข้าถึงระบบ
          </button>
          <div class="border-t border-slate-100 my-1" />
          <button
            type="button"
            class="w-full text-left px-3.5 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium cursor-pointer"
            @click="handleSignOut"
          >
            <LogOut class="w-3.5 h-3.5 text-red-500" />
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  Menu,
  Bookmark,
  Bell,
  ChevronDown,
  ChevronRight,
  User,
  ShieldCheck,
  LogOut,
} from 'lucide-vue-next';
import { useInbox } from '../../composables/useInbox';
import { useAuth } from '../../composables/useAuth';
import { MENU_LABELS } from '../../router/menu';

defineEmits<{
  (e: 'toggleSidebar'): void;
}>();

const route = useRoute();
const router = useRouter();
const { messages, unreadCount, markRead } = useInbox();

// breadcrumb อ่านจาก route (meta.menu / meta.submenu / params.category / params.subId)
const activeMenu = computed(() => route.meta.menu ?? '');
const activeSubmenu = computed(
  () =>
    (route.params.category as string) ||
    (route.params.subId as string) ||
    (route.meta.submenu as string) ||
    ''
);

const breadcrumbLabel = computed(() => MENU_LABELS[activeSubmenu.value] ?? 'ทะเบียนประวัติ');

const isBookmarked = ref(false);
const showNotifications = ref(false);
const showProfileMenu = ref(false);
const { signOut } = useAuth();

const handleSignOut = () => {
  signOut();
  router.push('/login');
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  showProfileMenu.value = false;
};

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value;
  showNotifications.value = false;
};

// คลิกข้อความจากกระดิ่งแจ้งเตือน → เปิดหน้ากล่องข้อความที่ข้อความนั้น (?selected=<id>)
const handleMessageClick = (id: string) => {
  markRead(id);
  router.push({ name: 'home', query: { selected: id } }).catch(() => {});
  showNotifications.value = false;
};
</script>
