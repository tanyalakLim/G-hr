<template>
  <div>
    <!-- เนื้อหา -->
    <main class="p-4 sm:p-6 lg:px-20 lg:py-8 max-w-8xl mx-auto space-y-4">
      <!-- คำทักทาย + IDP -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            สวัสดี<span class="text-blue-900">,</span> {{ displayName }}
          </h1>
          <p class="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
            <CalendarDays class="w-3.5 h-3.5" />
            {{ todayText }} · รายการเมนูและสรุปสถิติส่วนตัวของท่านวันนี้
          </p>
        </div>

        <!-- เช็คอินเวลาลงงาน -->
        <div
          class="self-start sm:self-auto relative overflow-hidden flex items-center gap-3.5 rounded-xl pl-4 pr-3.5 py-3
                 bg-gradient-to-r from-blue-900 to-blue-800 shadow-md shadow-blue-900/25
                 transition-all duration-200 ease-out"
        >
          <!-- วงกลมตกแต่ง -->
          <div class="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

          <!-- เวลาปัจจุบัน -->
          <div class="text-center shrink-0 relative">
            <p class="text-2xl font-bold text-white tabular-nums leading-none tracking-tight">{{ currentTimeText }}</p>
            <p class="text-[9px] text-blue-200/80 font-medium mt-1">เวลาปัจจุบัน</p>
          </div>

          <div class="w-px self-stretch bg-white/15" />

          <!-- สถานะ -->
          <div class="text-left min-w-0 flex-1 relative">
            <p class="flex items-center gap-1.5 text-[11px] text-blue-200 font-medium">
              <span class="relative flex w-2 h-2 shrink-0">
                <span v-if="isCheckedIn" class="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                <span class="relative inline-flex w-2 h-2 rounded-full" :class="isCheckedIn ? 'bg-emerald-400' : 'bg-slate-400'" />
              </span>
              {{ isCheckedIn ? 'ลงงานอยู่' : 'ยังไม่ลงงาน' }}
            </p>
            <p class="text-sm font-bold text-white leading-tight mt-0.5 flex items-center gap-2 tabular-nums">
              <span>เข้า {{ isCheckedIn ? checkInTime : '--:--' }}</span>
              <span class="text-white/30 font-normal">·</span>
              <span>ออก {{ checkOutTime ?? '--:--' }}</span>
            </p>
          </div>

          <!-- ปุ่มเช็คอิน/เช็คเอาต์ -->
          <button
            type="button"
            class="relative shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer
                   focus:outline-none focus:ring-2 focus:ring-white/40 active:scale-95 flex items-center gap-1.5"
            :class="isCheckedIn
              ? 'bg-white/10 text-white border border-white/25 hover:bg-white/20'
              : 'bg-white text-blue-900 shadow-sm hover:shadow-md hover:-translate-y-0.5'"
            @click.stop="toggleCheckIn"
          >
            <component :is="isCheckedIn ? LogOut : LogIn" class="w-4 h-4" />
            {{ isCheckedIn ? 'เช็คเอาต์' : 'เช็คอิน' }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-2 items-start">
        <!-- เมนูฟังก์ชัน (ซ้าย) -->
        <div class="lg:col-span-8 order-2 lg:order-none">
          <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            <button
              v-for="item in menuItems"
              :key="item.title"
              type="button"
              class="group text-left bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5
                     hover:border-blue-900/30 hover:shadow-md hover:-translate-y-0.5
                     transition-all duration-200 ease-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-900/20
                     flex flex-col items-start"
              @click.stop="show(`เมนู ${item.title} ยังไม่เปิดใช้งาน`)"
            >
              <span class="w-10 h-10 rounded-lg bg-blue-50/60 text-blue-900 flex items-center justify-center shrink-0 transition-all duration-200 group-hover:bg-blue-900 group-hover:text-white group-hover:shadow-sm group-hover:shadow-blue-900/30">
                <component :is="item.icon" class="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              </span>
              <span class="block mt-3.5 text-sm font-bold text-slate-800 leading-snug transition-colors duration-150 group-hover:text-blue-900">{{ item.title }}</span>
              <span class="block mt-1 mb-4 text-xs text-slate-500 leading-relaxed">{{ item.desc }}</span>
              <div class="mt-auto pt-1 border-t border-slate-100 flex items-center justify-between self-stretch">
                <span class="text-[11px] text-slate-400 font-medium">{{ item.footer }}</span>
                <ArrowUpRight class="w-3.5 h-3.5 text-slate-400 transition-all duration-200 group-hover:text-blue-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </button>
          </div>
        </div>

        <!-- สรุปสถิติส่วนตัว (ขวา) -->
        <div class="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col lg:sticky lg:top-24 order-1 lg:order-none">
          <!-- Header -->
          <div class="p-3.5 sm:p-4 border-b border-slate-100 bg-slate-50/40">
            <h3 class="flex items-center gap-2.5 min-w-0">
              <span class="w-7 h-7 rounded-lg bg-blue-50/60 text-blue-900 flex items-center justify-center shrink-0">
                <TrendingUp class="w-3.5 h-3.5" />
              </span>
              <span class="min-w-0">
                <span class="block text-sm font-bold text-slate-800">สรุปสถิติส่วนตัว</span>
                <span class="block text-[11px] text-slate-500">ข้อมูลของ {{ displayName }} · ปีงบประมาณ 2569</span>
              </span>
            </h3>
          </div>

          <!-- รายการสถิติ -->
          <div class="divide-y divide-slate-50">
            <button
              v-for="stat in personalStats"
              :key="stat.label"
              type="button"
              class="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer group/stat hover:bg-slate-50"
              @click.stop="show(`สถิติ ${stat.label} ยังไม่เปิดใช้งาน`)"
            >
              <span
                class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200"
                :class="stat.tone"
              >
                <component :is="stat.icon" class="w-4 h-4" />
              </span>
              <span class="min-w-0 flex-1">
                <span class="block text-xs font-semibold text-slate-800">{{ stat.label }}</span>
                <span class="block text-[11px] text-slate-400 mt-0.5">{{ stat.sub }}</span>
              </span>
              <span class="text-base font-bold tabular-nums shrink-0" :class="stat.valueTone">{{ stat.value }}</span>
              <ArrowUpRight class="w-3.5 h-3.5 text-slate-300 shrink-0 transition-all duration-200 group-hover/stat:text-blue-900 group-hover/stat:translate-x-0.5 group-hover/stat:-translate-y-0.5" />
            </button>
          </div>

          <!-- ความก้าวหน้า IDP -->
          <div class="px-4 py-3.5 border-t border-slate-100 bg-slate-50/40">
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <GraduationCap class="w-3.5 h-3.5 text-blue-900" />
                ความก้าวหน้า IDP ปี 2569
              </span>
              <span class="text-sm font-bold text-blue-900 tabular-nums">75%</span>
            </div>
            <div class="mt-2 w-full h-1.5 rounded-full bg-slate-200/70 overflow-hidden">
              <div class="h-full w-3/4 rounded-full bg-blue-900" />
            </div>
            <p class="text-[11px] text-slate-400 mt-1.5">อบรมแล้ว 3 จาก 4 หลักสูตรที่วางแผนไว้</p>
          </div>

          <!-- Footer -->
          <div class="px-4 py-3 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/40">
            <button
              type="button"
              class="text-[11px] font-semibold text-blue-900 hover:underline transition-colors cursor-pointer inline-flex items-center gap-1"
              @click.stop="show('ดูสถิติทั้งหมดยังไม่พร้อมใช้งาน')"
            >
              ดูสถิติทั้งหมด
              <ArrowRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ClipboardCheck,
  FolderOpen,
  GraduationCap,
  IdCard,
  LogIn,
  LogOut,
  Scale,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-vue-next';
import { displayName } from '../composables/useAuth';
import { useToast } from '../composables/useToast';

const router = useRouter();
const { show } = useToast();

// --- เช็คอินเวลาลงงาน
const isCheckedIn = ref(false);
const checkInTime = ref('');
const checkOutTime = ref<string | null>(null);
const now = ref(new Date());
let clockTimer: ReturnType<typeof setInterval> | undefined;

const currentTimeText = computed(() => {
  const t = now.value;
  return `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`;
});

const toggleCheckIn = () => {
  if (isCheckedIn.value) {
    isCheckedIn.value = false;
    checkOutTime.value = currentTimeText.value;
    show(`เช็คเอาต์เวลา ${checkOutTime.value} เรียบร้อยแล้ว`);
  } else {
    router.push('/user/check-in');
  }
};

onMounted(() => {
  clockTimer = setInterval(() => (now.value = new Date()), 1000 * 30);
});
onUnmounted(() => clearInterval(clockTimer));

const todayText = computed(() => {
  const fmt = new Intl.DateTimeFormat('th-TH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return fmt.format(new Date());
});

// --- เมนูฟังก์ชันฝั่งบุคลากร
const menuItems: { icon: typeof IdCard; title: string; desc: string; footer: string }[] = [
  { icon: Users, title: 'แผนที่องค์กร', desc: 'ดูแผนที่องค์กร, ดาวน์โหลดไฟล์', footer: 'ระบบแผนผังองค์กร กทม.' },
  { icon: IdCard, title: 'ทะเบียนประวัติ', desc: 'ดูข้อมูล, ยื่นคำร้องขอแก้ไขข้อมูล', footer: 'ก.พ.7 อิเล็กทรอนิกส์' },
  { icon: ClipboardCheck, title: 'ประเมินบุคคล', desc: 'ตรวจสอบข้อมูลการประเมินบุคคล', footer: 'ระบบประเมิน ก.พ.' },
  { icon: CalendarDays, title: 'การลา', desc: 'ดู/แก้ไขวันลา, ทำเรื่องลา', footer: 'ระบบลาอิเล็กทรอนิกส์' },
  { icon: FolderOpen, title: 'ผลงาน', desc: 'ดู/เพิ่มผลงาน, แนบไฟล์ประกอบ', footer: 'ฐานข้อมูลผลงาน กทม.' },
  { icon: UserCheck, title: 'ขอโอน', desc: 'ประวัติขอโอน, ยื่นคำร้องขอโอน', footer: 'ระบบสายงาน ก.พ.' },
  { icon: Scale, title: 'อุทธรณ์/ร้องทุกข์', desc: 'ทำเรื่องขออุทธรณ์ หรือร้องทุกข์', footer: 'ระบบอุทธรณ์ ก.พ.' },
  { icon: Target, title: 'ตัวชี้วัดการประเมิน (KPI)', desc: 'ประเมินผลการปฏิบัติหน้าที่ราชการ', footer: 'ระบบ KPI กทม.' },
  { icon: UserCheck, title: 'ตัวประเมิน (KPI)', desc: 'ประเมินผลการปฏิบัติหน้าที่ราชการ', footer: 'ระบบ KPI กทม.' },
  { icon: GraduationCap, title: 'ทุนการศึกษา/ฝึกอบรม', desc: 'รายการทุนการศึกษา/ฝึกอบรม', footer: 'ระบบ HRD กทม.' },
  { icon: TrendingUp, title: 'การพัฒนารายบุคคล', desc: 'Individual Development Plan', footer: 'ระบบ IDP กทม.' },
];

// --- สรุปสถิติส่วนตัว
const personalStats: { icon: typeof IdCard; label: string; sub: string; value: string; tone: string; valueTone: string }[] = [
  { icon: CalendarDays, label: 'วันลาคงเหลือ', sub: 'ลาไปแล้ว 6 วันในปีนี้', value: '14 วัน', tone: 'bg-blue-50/60 text-blue-900', valueTone: 'text-blue-900' },
  { icon: Target, label: 'ผลประเมิน KPI ล่าสุด', sub: 'รอบ 1/2569 · อนุมัติแล้ว', value: '92%', tone: 'bg-emerald-50/60 text-emerald-600', valueTone: 'text-emerald-600' },
  { icon: FolderOpen, label: 'ผลงานที่บันทึก', sub: 'อัปเดตล่าสุด 28 ก.ย. 69', value: '5', tone: 'bg-violet-50/60 text-violet-600', valueTone: 'text-violet-600' },
  { icon: IdCard, label: 'คำร้องทะเบียนประวัติ', sub: 'รอตรวจสอบ 1 เรื่อง', value: '2', tone: 'bg-amber-50/60 text-amber-600', valueTone: 'text-amber-600' },
  { icon: GraduationCap, label: 'อบรม/ทุนที่ผ่านมา', sub: 'ปีงบประมาณ 2569', value: '3', tone: 'bg-pink-50/60 text-pink-600', valueTone: 'text-pink-600' },
];

</script>

<style scoped>
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid > button {
  animation: fade-up 0.35s ease-out both;
}
.grid > button:nth-child(1) { animation-delay: 0.02s; }
.grid > button:nth-child(2) { animation-delay: 0.05s; }
.grid > button:nth-child(3) { animation-delay: 0.08s; }
.grid > button:nth-child(4) { animation-delay: 0.11s; }
.grid > button:nth-child(5) { animation-delay: 0.14s; }
.grid > button:nth-child(6) { animation-delay: 0.17s; }
.grid > button:nth-child(7) { animation-delay: 0.2s; }
.grid > button:nth-child(8) { animation-delay: 0.23s; }
.grid > button:nth-child(9) { animation-delay: 0.26s; }
.grid > button:nth-child(10) { animation-delay: 0.29s; }
.grid > button:nth-child(11) { animation-delay: 0.32s; }

.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

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
