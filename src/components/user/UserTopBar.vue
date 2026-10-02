<template>
  <header class="bg-white border-b border-slate-200/80 sticky top-0 z-20">
    <div class="max-w-8xl mx-auto h-16 flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-20">
      <!-- โลโก้ + ชื่อระบบ -->
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img :src="logoUrl" alt="โลโก้ระบบ G-HR" class="w-full h-full object-cover rounded-xl" />
        </div>
        <div class="min-w-0 leading-tight">
          <p class="text-sm font-bold text-slate-900 truncate">ระบบบริหารทรัพยากรบุคคล</p>
          <p class="text-[11px] text-slate-500 truncate">กรุงเทพมหานคร · สำนักบริหารราชการ</p>
        </div>
      </div>

      <!-- เมนูหลัก -->
      <nav class="hidden lg:flex items-center gap-1">
        <button
          type="button"
          class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-150 cursor-pointer"
          :class="active === 'home' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-500 hover:text-blue-900 hover:bg-blue-50'"
          :aria-current="active === 'home' ? 'page' : undefined"
          @click.stop="router.push('/user/home')"
        >
          <LayoutGrid class="w-4 h-4" />
          หน้าแรก
        </button>
        <button
          type="button"
          class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-500 hover:text-blue-900 hover:bg-blue-50 transition-colors cursor-pointer"
          @click.stop="show('การลา')"
        >
          <CalendarDays class="w-4 h-4" />
          การลา
        </button>
        <button
          type="button"
          class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-500 hover:text-blue-900 hover:bg-blue-50 transition-colors cursor-pointer"
          @click.stop="show('เมนูผลงานปฏิบัติราชการยังไม่เปิดใช้งาน')"
        >
          <Award class="w-4 h-4" />
          ผลงานปฏิบัติราชการ
        </button>
      </nav>

      <!-- ขวา: แจ้งเตือน + ผู้ใช้ -->
      <div class="flex items-center gap-1.5 sm:gap-3 shrink-0 relative">
        <!-- ปุ่มบุ๊กมาร์ก -->
        <button
          type="button"
          class="p-2 rounded-lg transition-colors hidden sm:inline-flex cursor-pointer"
          :class="isBookmarked ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'"
          :title="isBookmarked ? 'ลบบุ๊กมาร์ก' : 'บันทึกหน้านี้'"
          @click.stop="isBookmarked = !isBookmarked"
        >
          <Bookmark class="w-5 h-5" :class="isBookmarked ? 'fill-amber-500' : ''" />
        </button>

        <!-- กระดิ่งแจ้งเตือน + dropdown -->
        <div class="relative">
          <button
            type="button"
            class="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="การแจ้งเตือน"
            @click.stop="toggleNotif"
          >
            <Bell class="w-5 h-5" />
            <span
              v-if="unreadCount > 0"
              class="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none"
            >
              {{ unreadCount }}
            </span>
          </button>

          <Transition name="pop">
            <div
              v-if="isNotifOpen"
              class="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-30"
              @click.stop
            >
              <div class="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span class="font-semibold text-xs text-slate-800">
                  การแจ้งเตือนล่าสุด ({{ unreadCount }} ยังไม่อ่าน)
                </span>
                <span
                  class="text-[11px] text-blue-700 hover:underline cursor-pointer"
                  @click.stop="isNotifOpen = false; show('เปิดกล่องข้อความทั้งหมดยังไม่พร้อมใช้งาน')"
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
                  @click.stop="handleMessageClick(msg.id)"
                >
                  <span
                    class="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    :class="!msg.isRead ? 'bg-blue-700' : 'bg-slate-300'"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-1">
                      <span class="font-semibold text-slate-900 truncate">{{ msg.title }}</span>
                      <span class="text-[10px] text-slate-400 whitespace-nowrap">{{ msg.time }}</span>
                    </div>
                    <p class="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{{ msg.content }}</p>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- เมนูผู้ใช้ -->
        <div class="relative">
          <button
            type="button"
            class="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-slate-200 cursor-pointer text-left hover:opacity-90 transition-opacity"
            @click.stop="isUserMenuOpen = !isUserMenuOpen"
          >
            <span class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#003380] flex items-center justify-center text-white shadow-xs flex-shrink-0">
              <User class="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <span class="hidden sm:flex flex-col text-left">
              <span class="text-xs sm:text-sm font-semibold text-slate-800 leading-tight truncate max-w-30">{{ displayName }}</span>
              <span class="text-[10px] sm:text-[11px] text-slate-500 leading-tight font-normal">นักวิทยาศาสตร์</span>
            </span>
            <ChevronDown class="w-4 h-4 text-slate-400 hidden sm:block ml-0.5 transition-transform" :class="{ 'rotate-180': isUserMenuOpen }" />
          </button>

          <Transition name="pop">
            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 text-xs"
              @click.stop
            >
              <div class="px-3.5 py-2 border-b border-slate-100 sm:hidden">
                <div class="font-semibold text-slate-800 truncate">{{ displayName }}</div>
                <div class="text-[11px] text-slate-500">นักวิทยาศาสตร์</div>
              </div>
              <div class="px-3.5 py-2 text-[11px] text-slate-400 font-medium">
                สังกัด: สำนักบริหารราชการ
              </div>
              <button
                type="button"
                class="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                @click.stop="isUserMenuOpen = false; show('ข้อมูลประวัติส่วนบุคคลยังไม่เปิดใช้งาน')"
              >
                <User class="w-3.5 h-3.5 text-slate-400" />
                ข้อมูลประวัติส่วนบุคคล
              </button>
              <button
                type="button"
                class="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                @click.stop="isUserMenuOpen = false; show('สิทธิ์การเข้าถึงระบบยังไม่เปิดใช้งาน')"
              >
                <ShieldCheck class="w-3.5 h-3.5 text-slate-400" />
                สิทธิ์การเข้าถึงระบบ
              </button>
              <div class="border-t border-slate-100 my-1" />
              <button
                type="button"
                class="w-full text-left px-3.5 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium cursor-pointer"
                @click.stop="handleSignOut"
              >
                <LogOut class="w-3.5 h-3.5 text-red-500" />
                ออกจากระบบ
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  Award,
  Bell,
  Bookmark,
  CalendarDays,
  ChevronDown,
  LayoutGrid,
  LogOut,
  ShieldCheck,
  User,
} from 'lucide-vue-next';
import logoUrl from '../../assets/logo.png';
import { useAuth, displayName } from '../../composables/useAuth';
import { useInbox } from '../../composables/useInbox';
import { useToast } from '../../composables/useToast';

withDefaults(defineProps<{ active?: 'home' | null }>(), { active: 'home' });

const router = useRouter();
const { signOut } = useAuth();
const { show } = useToast();
const { messages, unreadCount, markRead } = useInbox();

const isUserMenuOpen = ref(false);
const isNotifOpen = ref(false);
const isBookmarked = ref(false);

const toggleNotif = () => {
  isNotifOpen.value = !isNotifOpen.value;
  isUserMenuOpen.value = false;
};

const handleMessageClick = (id: string) => {
  markRead(id);
  isNotifOpen.value = false;
  show('เปิดกล่องข้อความยังไม่พร้อมใช้งานในหน้านี้');
};

const handleSignOut = () => {
  isUserMenuOpen.value = false;
  signOut();
  router.push('/login');
};

const closeAllPopovers = () => {
  isUserMenuOpen.value = false;
  isNotifOpen.value = false;
};

onMounted(() => document.addEventListener('click', closeAllPopovers));
onUnmounted(() => document.removeEventListener('click', closeAllPopovers));
</script>

<style scoped>
.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
