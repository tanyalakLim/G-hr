<template>
  <div>
    <main class="p-4 sm:p-6 lg:px-20 lg:py-8 max-w-8xl mx-auto space-y-4">
      <!-- หัวหน้า + ปุ่มบนขวา -->
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-1">
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">ทะเบียนประวัติ</h1>
          <p class="text-xs text-slate-500 mt-0.5">ดูข้อมูลทะเบียนประวัติของท่าน · ก.พ.7 อิเล็กทรอนิกส์</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-100 text-sky-800 text-xs font-bold
                   hover:bg-sky-200 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer
                   focus:outline-none focus:ring-2 focus:ring-sky-300"
            @click.stop="show('การตรวจสอบข้อมูลตำแหน่งและเงินเดือนยังไม่เปิดใช้งาน')"
          >
            <SearchCheck class="w-4 h-4" />
            ตรวจสอบข้อมูลตำแหน่งและเงินเดือน
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-900 text-white text-xs font-bold
                   shadow-md shadow-blue-900/25 hover:bg-blue-800 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer
                   focus:outline-none focus:ring-2 focus:ring-blue-900/30"
            @click.stop="show('แบบฟอร์มยื่นคำร้องขอแก้ไขยังไม่เปิดใช้งาน')"
          >
            <PenLine class="w-4 h-4" />
            ยื่นคำร้องขอแก้ไขข้อมูล
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        <!-- เนื้อหาหลัก -->
        <div class="xl:col-span-9 order-2 space-y-4">
          <!-- แท็บเมนูหลัก -->
          <div class="flex items-center gap-1 border-b border-slate-200">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              class="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold -mb-px border-b-2 transition-colors cursor-pointer whitespace-nowrap"
              :class="activeTab === tab.id
                ? 'text-blue-900 border-blue-900'
                : 'text-slate-500 border-transparent hover:text-blue-900'"
              @click.stop="switchTab(tab.id)"
            >
              <component :is="tab.icon" class="w-3.5 h-3.5" />
              {{ tab.label }}
            </button>
          </div>

          <!-- ข้ามไปยังหัวข้อ -->
          <div class="flex items-center gap-2 overflow-x-auto pb-0.5">
            <span class="text-[11px] text-slate-400 font-medium shrink-0">ข้ามไปยัง:</span>
            <button
              v-for="anchor in anchors"
              :key="anchor.id"
              type="button"
              class="shrink-0 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-[11px] font-semibold text-slate-600
                     hover:border-blue-900/30 hover:bg-blue-50/60 hover:text-blue-900 transition-colors cursor-pointer"
              @click.stop="scrollTo(anchor.id)"
            >
              {{ anchor.label }}
            </button>
          </div>

          <!-- 1. ประวัติส่วนตัว -->
          <section id="sec-personal" class="scroll-mt-24 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div class="px-4 sm:px-5 py-3.5 border-b border-slate-100 bg-slate-50/40">
              <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
                <UserRound class="w-4 h-4 text-blue-900" />
                ประวัติส่วนตัว
              </h3>
            </div>
            <dl class="px-4 sm:px-5 py-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 divide-y sm:divide-y-0 divide-slate-50 [&>div]:sm:border-b [&>div]:sm:border-slate-50">
              <div v-for="field in personalFields" :key="field.label" class="py-2.5 flex items-start justify-between gap-4">
                <dt class="text-xs text-slate-500 shrink-0 w-32 sm:w-28">{{ field.label }}</dt>
                <dd class="text-xs font-semibold text-slate-800 text-right flex items-center justify-end gap-2 min-w-0">
                  <span class="truncate">{{ field.value }}</span>
                  <button
                    v-if="field.editable"
                    type="button"
                    class="p-1 rounded-md text-slate-400 hover:text-blue-900 hover:bg-blue-50 transition-colors cursor-pointer shrink-0"
                    title="แก้ไขข้อมูลการติดต่อ"
                    @click.stop="show(`แก้ไข${field.label}ยังไม่เปิดใช้งาน`)"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                  </button>
                </dd>
              </div>
              <div class="py-2.5 flex items-start justify-between gap-4 sm:col-span-2">
                <dt class="text-xs text-slate-500 shrink-0 w-32 sm:w-40">ประวัติการเปลี่ยนชื่อ - นามสกุล</dt>
                <dd class="text-xs font-semibold text-slate-400 text-right">ปัจจุบันไม่พบข้อมูลการเปลี่ยนชื่อ-นามสกุล</dd>
              </div>
            </dl>
          </section>

          <!-- 2. ข้อมูลที่อยู่ -->
          <section id="sec-address" class="scroll-mt-24 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div class="px-4 sm:px-5 py-3.5 border-b border-slate-100 bg-slate-50/40">
              <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Home class="w-4 h-4 text-blue-900" />
                ข้อมูลที่อยู่
              </h3>
            </div>
            <dl class="px-4 sm:px-5 py-2 divide-y divide-slate-50">
              <div class="py-2.5 flex items-start justify-between gap-4">
                <dt class="text-xs text-slate-500 shrink-0 w-48">ที่อยู่ตามทะเบียนบ้าน</dt>
                <dd class="text-xs font-semibold text-slate-800 text-right">{{ profile.address }}</dd>
              </div>
              <div class="py-2.5 flex items-start justify-between gap-4">
                <dt class="text-xs text-slate-500 shrink-0 w-48">ที่อยู่ปัจจุบัน</dt>
                <dd class="text-xs font-semibold text-slate-800 text-right">{{ profile.address }}</dd>
              </div>
            </dl>
          </section>

          <!-- 3. ข้อมูลครอบครัว -->
          <section id="sec-family" class="scroll-mt-24 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div class="px-4 sm:px-5 py-3.5 border-b border-slate-100 bg-slate-50/40">
              <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Users class="w-4 h-4 text-blue-900" />
                ข้อมูลครอบครัว
              </h3>
            </div>
            <dl class="px-4 sm:px-5 py-2 divide-y divide-slate-50">
              <div v-for="member in family" :key="member.relation" class="py-2.5 flex items-start justify-between gap-4">
                <dt class="text-xs text-slate-500 shrink-0 w-48">{{ member.relation }}</dt>
                <dd class="text-xs font-semibold text-slate-800 text-right">{{ member.detail }}</dd>
              </div>
            </dl>
          </section>

          <!-- 4. ประวัติการศึกษา -->
          <section id="sec-education" class="scroll-mt-24 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div class="px-4 sm:px-5 py-3.5 border-b border-slate-100 bg-slate-50/40 flex items-center justify-between">
              <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
                <GraduationCap class="w-4 h-4 text-blue-900" />
                ประวัติการศึกษา
              </h3>
              <span class="text-[11px] text-slate-400">{{ education.length }} รายการ</span>
            </div>
            <ul class="divide-y divide-slate-50">
              <li v-for="edu in education" :key="edu.level" class="px-4 sm:px-5 py-3 flex items-start gap-3">
                <span class="w-9 h-9 rounded-lg bg-blue-50/60 text-blue-900 flex items-center justify-center shrink-0">
                  <GraduationCap class="w-4 h-4" />
                </span>
                <div class="min-w-0 flex-1">
                  <p class="text-xs font-bold text-slate-800">{{ edu.level }} · {{ edu.field }}</p>
                  <p class="text-[11px] text-slate-500 mt-0.5">{{ edu.institution }}</p>
                  <p class="text-[11px] text-slate-400 mt-0.5">
                    สำเร็จการศึกษา {{ edu.graduatedDate }} | เกรดเฉลี่ย {{ edu.gpa }}
                    <span v-if="edu.isHighest" class="ml-1 text-blue-900 font-semibold">(วุฒิการศึกษาสูงสุดในปัจจุบัน)</span>
                  </p>
                </div>
              </li>
            </ul>
          </section>

          <!-- 5. ความสามารถพิเศษ -->
          <section id="sec-talent" class="scroll-mt-24 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div class="px-4 sm:px-5 py-4 border-b border-slate-100 flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                <Star class="w-4 h-4" />
              </span>
              <div class="min-w-0">
                <h3 class="text-sm font-bold text-slate-800 leading-tight">ความสามารถพิเศษ</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">ทักษะและความสามารถเป็นทางการ</p>
              </div>
            </div>
            <div class="px-4 sm:px-5 py-10 text-center">
              <span class="inline-flex w-12 h-12 rounded-full bg-slate-50 border border-slate-200 items-center justify-center">
                <Star class="w-5 h-5 text-slate-300" />
              </span>
              <p class="text-xs text-slate-400 mt-3">ยังไม่พบรายการบันทึกความสามารถพิเศษ</p>
            </div>
          </section>
        </div>

        <!-- เมนูด่วนด้านข้าง -->
        <aside class="xl:col-span-3 order-1 space-y-3 xl:sticky xl:top-5 self-start">
          <!-- การ์ดโปรไฟล์ + ข้อมูลเบื้องต้น -->
          <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div class="h-24 bg-gradient-to-br from-blue-900 via-blue-800 to-sky-700 relative">
              <div class="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />
              <div class="absolute -bottom-12 -left-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
            </div>
            <div class="px-4 pb-4 -mt-10 flex flex-col items-center text-center">
              <div class="w-20 h-20 z-10 rounded-full ring-4 ring-white shadow-lg shadow-blue-900/15 overflow-hidden bg-slate-50 flex items-center justify-center">
                <img
                  v-if="profilePhotoUrl"
                  :src="profilePhotoUrl"
                  :alt="`รูปถ่าย ${profile.name}`"
                  class="w-full h-full object-cover"
                />
                <UserRound v-else class="w-9 h-9 text-blue-900" />
              </div>
              <h2 class="mt-3 text-sm font-bold text-slate-900">{{ profile.name }}</h2>
              <p class="text-[11px] font-semibold text-blue-900 mt-1 bg-blue-50 px-3 py-1 rounded-full">
                {{ profile.position }}
              </p>

              <div class="mt-3.5 w-full grid grid-cols-2 gap-2 text-left">
                <div class="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2">
                  <p class="text-[10px] text-slate-400">เลขที่ตำแหน่ง</p>
                  <p class="text-[11px] font-bold text-slate-800 leading-snug mt-0.5">{{ profile.positionNo }}</p>
                </div>
                <div class="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2">
                  <p class="text-[10px] text-slate-400">ระดับ</p>
                  <p class="text-[11px] font-bold text-slate-800 leading-snug mt-0.5">{{ profile.positionLevel }}</p>
                </div>
                <div class="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2 col-span-2">
                  <p class="text-[10px] text-slate-400">ตำแหน่งประเภท</p>
                  <p class="text-[11px] font-bold text-slate-800 leading-snug mt-0.5">{{ profile.positionCategory }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div class="px-4 py-3 border-b border-slate-100 bg-slate-50/40">
              <h3 class="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Zap class="w-3.5 h-3.5 text-blue-900" />
                เมนูด่วน
              </h3>
            </div>
            <div class="p-3 space-y-2">
              <button
                v-for="action in quickActions"
                :key="action.label"
                type="button"
                class="w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-200
                       text-xs font-semibold text-slate-700 hover:border-blue-900/30 hover:bg-blue-50/50 hover:text-blue-900
                       transition-all duration-150 cursor-pointer group/action"
                @click.stop="show(`${action.label}ยังไม่เปิดใช้งาน`)"
              >
                <span class="w-8 h-8 rounded-lg bg-blue-50/60 text-blue-900 flex items-center justify-center shrink-0 transition-colors group-hover/action:bg-blue-900 group-hover/action:text-white">
                  <component :is="action.icon" class="w-4 h-4" />
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block">{{ action.label }}</span>
                  <span class="block text-[10px] text-slate-400 font-normal mt-0.5">{{ action.sub }}</span>
                </span>
                <ArrowUpRight class="w-3.5 h-3.5 text-slate-300 shrink-0 transition-colors group-hover/action:text-blue-900" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  Briefcase,
  Download,
  FileStack,
  GraduationCap,
  Home,
  LayoutGrid,
  Pencil,
  PenLine,
  SearchCheck,
  Star,
  UserRound,
  Users,
  Zap,
} from 'lucide-vue-next';
import { useToast } from '../composables/useToast';
import { ref } from 'vue';

const { show } = useToast();

const tabs = [
  { id: 'personal', label: 'ข้อมูลส่วนตัว', icon: UserRound },
  { id: 'government', label: 'ข้อมูลราชการ', icon: BadgeCheck },
  { id: 'salary', label: 'ข้อมูลเงินเดือน', icon: Banknote },
  { id: 'works', label: 'ข้อมูลผลงาน', icon: FileStack },
  { id: 'other', label: 'ข้อมูลอื่นๆ', icon: LayoutGrid },
];
const activeTab = ref<string>('personal');

const anchors = [
  { id: 'sec-personal', label: 'ประวัติส่วนตัว' },
  { id: 'sec-address', label: 'ที่อยู่' },
  { id: 'sec-family', label: 'ครอบครัว' },
  { id: 'sec-education', label: 'การศึกษา' },
  { id: 'sec-talent', label: 'ความสามารถพิเศษ' },
];
const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
const switchTab = (id: string) => {
  if (id === 'personal') {
    activeTab.value = 'personal';
    return;
  }
  const label = tabs.find((t) => t.id === id)?.label ?? id;
  show(`แท็บ ${label} ยังไม่เปิดใช้งาน`);
};

let profilePhotoUrl: string | null = null;

const profile = {
  name: 'นายสมชาย ใจดี',
  positionType: 'ข้าราชการกรุงเทพมหานครสามัญ (ตำแหน่งประเภทวิชาการ ระดับทรงคุณวุฒิ)',
  position: 'นักวิเคราะห์นโยบายและแผน',
  positionNo: 'สนผ.ฝล. 16',
  positionCategory: 'วิชาการ',
  positionLevel: 'ทรงคุณวุฒิ',
  address: '98 หมู่ 5 ซอยวัชรพล 9 ถนนพระราม 9 แขวงบางโพงพาง เขตยานนาวา กรุงเทพมหานคร 10120',
};

const personalFields: { label: string; value: string; editable?: boolean }[] = [
  { label: 'ชื่อ - สกุล', value: profile.name },
  { label: 'เลขประจำตัวประชาชน', value: 'x-xxxx-xxxxx-xx-x' },
  { label: 'วันเดือนปีเกิด', value: '01 ม.ค. 2510' },
  { label: 'เพศ', value: 'ชาย' },
  { label: 'สถานภาพ', value: 'หม้าย' },
  { label: 'สัญชาติ/เชื้อชาติ', value: 'ไทย' },
  { label: 'ศาสนา', value: 'พุทธ' },
  { label: 'หมู่เลือด', value: 'O' },
  { label: 'เบอร์โทรศัพท์', value: '08x-xxx-xxxx', editable: true },
  { label: 'อีเมล', value: 'somchai.j@mail.bkk.go.th', editable: true },
];

const family = [
  { relation: 'บิดา', detail: 'นายปิยะ ใจดี (มีชีวิตอยู่) อาชีพตัดเย็บเสื้อผ้า' },
  { relation: 'มารดา', detail: 'นางสุนทรี ใจดี (มีชีวิตอยู่) อาชีพพ่อค้าแม่ค้า' },
  { relation: 'คู่สมรส', detail: '-' },
];

const education = [
  {
    level: 'ประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.)',
    field: 'เทคนิคคอมพิวเตอร์',
    institution: 'วิทยาลัยเทคนิคกรุงเทพ',
    graduatedDate: '15 มี.ค. 2532',
    gpa: '2.67',
    isHighest: false,
  },
  {
    level: 'ปริญญาตรี',
    field: 'มนุษยศาสตร์',
    institution: 'มหาวิทยาลัยเกษตรศาสตร์',
    graduatedDate: '15 มี.ค. 2536',
    gpa: '2.68',
    isHighest: true,
  },
];

const quickActions = [
  { icon: Download, label: 'ดาวน์โหลดประวัติแบบย่อ', sub: 'สำหรับบันทึกหรือพิมพ์สรุปประวัติ' },
  { icon: Download, label: 'ดาวน์โหลด ทปอ. สามัญ', sub: 'ทะเบียนประวัติข้าราชการ' },
  /* { icon: SearchCheck, label: 'ตรวจสอบข้อมูลตำแหน่ง/เงินเดือน', sub: 'ตรวจสอบข้อมูลปัจจุบัน' },
  { icon: PenLine, label: 'ยื่นคำร้องขอแก้ไขข้อมูล', sub: 'ส่งคำขอปรับปรุงข้อมูล' }, */
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

.space-y-4 > section {
  animation: fade-up 0.35s ease-out both;
}
</style>
