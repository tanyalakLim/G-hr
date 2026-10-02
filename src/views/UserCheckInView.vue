<template>
  <div>
    <div class="max-w-8xl mx-auto p-4 sm:p-6 lg:px-20 lg:py-8 space-y-4">
      <!-- การ์ดหัว: ข้อมูลผู้ใช้ + เวลา -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-7 flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-6">
        <!-- ส่วนซ้าย: ชื่อ + สถานะ -->
        <div class="flex-1 min-w-0">
            <!-- pills จอใหญ่ -->
          <div class="hidden lg:flex flex-wrap items-center gap-2 mb-3.5">
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              สถานะ: ตรงเวลา
            </span>
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50/60 text-blue-900 text-[11px] font-semibold">
              <IdCard class="w-3.5 h-3.5" />
              นักวิทยาศาสตร์ · สำนักบริหารราชการ
            </span>
          </div>
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="text-xs text-slate-400">ยืนยันตัวตนบันทึกเวลา</p>
              <h1 class="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">{{ displayName }}</h1>
            </div>
            <!-- pill มือถือ: ตรงเวลา -->
            <span class="lg:hidden inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold shrink-0">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              ตรงเวลา
            </span>
          </div>


          <p class="hidden lg:block text-xs text-slate-500 mt-2">
            ตามเวลางานประจำวันราชการ
            <span class="font-semibold text-slate-800">09:00 — 18:00 น.</span>
            (วันศุกร์, 14 ก.ย. 2569) · สำนักแผนและพัฒนาองค์ความรู้
          </p>
        </div>

        <!-- ส่วนขวา: เวลา + สถานะเวลา + สลับสถานที่ (มือถือ) -->
        <div class="shrink-0 lg:pl-7 lg:border-l lg:border-slate-100">
          <div class="flex items-center gap-5 sm:gap-6">
            <div class="min-w-0">
              <p class="text-[11px] text-slate-500 font-medium">เวลาปัจจุบัน</p>
              <p class="text-4xl sm:text-5xl font-bold text-blue-900 tabular-nums tracking-tight mt-1 leading-none">{{ liveTimeText }}</p>
              <p class="text-[11px] text-slate-500 mt-2.5 flex items-center gap-1.5">
                <Clock class="w-3.5 h-3.5" />
                09:00 — 18:00 · ค., 2 ส.ค.
              </p>
            </div>
            <div class="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
              <svg viewBox="0 0 36 36" class="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e2e8f0" stroke-width="3.5" />
                <circle
                  cx="18" cy="18" r="15.5" fill="none" stroke="#1e3a8a" stroke-width="3.5"
                  stroke-linecap="round" stroke-dasharray="97.4" stroke-dashoffset="73"
                />
              </svg>
              <span class="absolute inset-0 flex flex-col items-center justify-center leading-none">
                <span class="text-xs sm:text-sm font-bold text-slate-900">25%</span>
                <span class="text-[8px] text-slate-400 mt-0.5">กะงาน</span>
              </span>
            </div>
          </div>

          <!-- สลับสถานที่ทำงาน (มือถือเท่านั้น) -->
          <div class="lg:hidden mt-4 p-1 bg-slate-100 rounded-full flex items-center gap-1">
            <button
              type="button"
              class="flex-1 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
              :class="workMode === 'onsite'
                ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                : 'bg-slate-100 text-slate-600  hover:text-blue-900'"
              @click="workMode = 'onsite'"
            >
              <Building2 class="w-4 h-4" />
              เข้าสำนักงาน
            </button>
            <button
              type="button"
              class="flex-1 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
              :class="workMode === 'wfh'
                ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                : 'bg-slate-100 text-slate-600  hover:text-blue-900'"
              @click="workMode = 'wfh'"
            >
              <Home class="w-4 h-4" />
              ทำงานนอกสถานที่
            </button>
          </div>
        </div>
      </div>

      <!-- การ์ดยืนยัน 3 ใบ -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- ยืนยันใบหน้า -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col">
          <div class="flex items-center justify-between gap-2">
            <h3 class="flex items-center gap-2.5 text-sm font-bold text-slate-800">
              <span class="w-8 h-8 rounded-full border border-blue-900/15 text-blue-900 flex items-center justify-center">
                <Smile class="w-4.5 h-4.5" />
              </span>
              ตัวตน
            </h3>
            <span
              class="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full"
              :class="facePhoto ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-600'"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="facePhoto ? 'bg-emerald-500' : 'bg-amber-500'" />
              {{ facePhoto ? 'ยืนยันแล้ว' : 'รอถ่ายภาพ' }}
            </span>
          </div>

          <div class="mt-3 pt-3 border-t border-slate-100" />

          <!-- กล้อง: ยังไม่มีรูป → แตะเพื่อถ่ายรูป / มีรูปแล้ว → แสดงรูป + ปุ่มถ่ายใหม่ -->
          <button
            v-if="!facePhoto"
            type="button"
            class="flex-1 min-h-24 md:min-h-[220px] relative rounded-2xl border-2 border-dashed border-slate-300
                   hover:border-blue-900/40 hover:bg-blue-50/20
                   flex flex-row md:flex-col items-center justify-center gap-3 md:gap-3 text-left md:text-center transition-all cursor-pointer group p-3.5"
            @click="takeFacePhoto"
          >
            <span class="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-blue-50/60 text-blue-900 flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110 group-hover:bg-blue-900 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-900/30">
              <Camera class="w-5.5 h-5.5 md:w-7 md:h-7" />
            </span>
            <span class="flex-1 min-w-0 md:flex-none">
              <span class="block text-sm font-bold text-slate-800">แตะเพื่อถ่ายรูป</span>
              <span class="block text-[11px] text-slate-400 mt-0.5 md:mt-1">ยืนยันตัวตนด้วยใบหน้าอัตโนมัติ</span>
            </span>
            <ChevronRight class="w-5 h-5 text-slate-300 shrink-0 md:hidden transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-blue-900" />
            <span class="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-900 text-white text-[11px] font-semibold shadow-sm shadow-blue-900/25 transition-transform duration-200 group-hover:-translate-y-0.5">
              เปิดกล้อง
              <ChevronRight class="w-3.5 h-3.5" />
            </span>
          </button>

          <div v-else class="flex-1 mt-3.5">
            <div class="relative h-full min-h-48 md:min-h-[220px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
              <div class="absolute inset-3 rounded-lg border-2 border-emerald-400/80 pointer-events-none" />
              <span class="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                <Check class="w-3.5 h-3.5" />
              </span>
              <span class="w-20 h-20 rounded-full bg-white shadow-inner border border-slate-200 flex items-center justify-center">
                <User class="w-10 h-10 text-slate-300" />
              </span>
              <span class="absolute bottom-14 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900/80 text-white text-[9px] font-mono tracking-wider">
                <ScanFace class="w-3 h-3" />
                HASH-BIO-83921-0K94
              </span>
              <button
                type="button"
                class="absolute bottom-2.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur text-white text-[11px] font-semibold hover:bg-slate-900 active:scale-95 transition-all cursor-pointer shadow-sm"
                @click.stop="retakeFacePhoto"
              >
                <Camera class="w-3.5 h-3.5" />
                ถ่ายรูปใหม่
              </button>
            </div>
          </div>
        </div>

        <!-- พิกัด GPS -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col">
          <div class="flex items-center justify-between gap-2">
            <h3 class="flex items-center gap-2 text-sm font-bold text-slate-800">
              <span class="w-7 h-7 rounded-lg bg-blue-50/60 text-blue-900 flex items-center justify-center">
                <Navigation class="w-3.5 h-3.5" />
              </span>
              พิกัด GPS
            </h3>
            <span class="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
              ความแม่นยำ ≈19 ม.
            </span>
          </div>

          <div class="mt-3.5 relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 aspect-[4/3.4]">
            <!-- แผนที่ mock -->
            <div class="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.25)_1px,transparent_1px)] bg-[size:28px_28px]" />
            <div class="absolute top-1/3 -left-4 right-1/2 h-8 bg-amber-100/80 rounded-full rotate-45" />
            <div class="absolute top-0 bottom-0 left-2/3 w-10 bg-sky-100/80" />
            <span class="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500 text-white text-[10px] font-bold shadow-sm">
              <Check class="w-3 h-3" />
              Verified Hub
            </span>
            <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full text-red-500">
              <MapPin class="w-8 h-8 fill-red-500" />
            </span>
            <div class="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 rounded-lg px-3 py-2 shadow-sm flex items-center justify-between gap-2">
              <div class="min-w-0">
                <p class="text-[11px] font-bold text-slate-800 truncate">สำนักบริหารราชการ (ปัจจุบัน)</p>
                <p class="text-[10px] text-slate-500 truncate">ซอย ซ.5563, อาคาร 99 6114</p>
              </div>
              <button type="button" class="w-7 h-7 rounded-lg bg-blue-50/60 text-blue-900 flex items-center justify-center shrink-0 cursor-pointer hover:bg-blue-100 transition-colors" title="รีเซ็ตพิกัด" @click="show('รีเซ็ตพิกัด GPS ยังไม่พร้อมใช้งาน')">
                <LocateFixed class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <!-- รูปแบบการทำงาน -->
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col">
          <div class="flex items-center justify-between gap-2">
            <h3 class="flex items-center gap-2 text-sm font-bold text-slate-800">
              <span class="w-7 h-7 rounded-lg bg-blue-50/60 text-blue-900 flex items-center justify-center">
                <MapPin class="w-3.5 h-3.5" />
              </span>
              รูปแบบการทำงาน
            </h3>
            <span class="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full bg-blue-50/60 text-blue-900">
              นอกสถานที่ (WFH)
            </span>
          </div>

          <p class="hidden lg:block mt-3.5 text-[11px] font-semibold text-slate-700">เลือกสถานที่ปัจจุบันด้วย</p>
          <div class="hidden lg:flex mt-2 p-1 bg-slate-100 rounded-lg items-center gap-1">
            <button
              type="button"
              class="flex-1 px-2 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1"
              :class="workMode === 'onsite' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'"
              @click="workMode = 'onsite'"
            >
              <Building2 class="w-3.5 h-3.5" />
              เข้าสำนักงาน
            </button>
            <button
              type="button"
              class="flex-1 px-2 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1"
              :class="workMode === 'wfh' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'"
              @click="workMode = 'wfh'"
            >
              <Home class="w-3.5 h-3.5" />
              นอกสถานที่
            </button>
          </div>

          <template v-if="workMode === 'wfh'">
            <p class="mt-3.5 text-[11px] font-semibold text-slate-700">ประเภทสถานที่ทำงานที่ / โครงการ</p>
            <div class="relative mt-2">
            <select
              v-model="workProject"
              class="w-full appearance-none text-xs font-medium pl-3 pr-8 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 focus:border-blue-900/40 focus:outline-none focus:ring-2 focus:ring-blue-900/10 transition-all cursor-pointer"
            >
              <option value="wfh">ทำงานบ้าน (Work From Home)</option>
              <option value="field">ลงพื้นที่ปฏิบัติงานสนาม</option>
              <option value="training">อบรม/สัมมนา</option>
            </select>
            <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </template>

          <p class="mt-3.5 text-[11px] font-semibold text-slate-700">หมายเหตุ</p>
          <div class="relative mt-2">
            <textarea
              v-model="workNote"
              rows="2"
              maxlength="200"
              placeholder="ระบุรายละเอียดเพิ่มเติม เช่น สถานที่ปฏิบัติงาน หรือเหตุผล (ถ้ามี)"
              class="w-full text-xs font-medium px-3 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 placeholder:text-slate-400 placeholder:font-normal resize-none focus:border-blue-900/40 focus:outline-none focus:ring-2 focus:ring-blue-900/10 transition-all"
            />
            <span class="absolute bottom-2 right-2.5 text-[10px] text-slate-300 tabular-nums">{{ workNote.length }}/200</span>
          </div>

          <div class="mt-3.5 rounded-xl bg-slate-50 border border-slate-200/70 p-3 flex items-start gap-2.5">
            <span class="w-7 h-7 rounded-lg bg-white border border-slate-200 text-blue-900 flex items-center justify-center shrink-0">
              <ShieldCheck class="w-3.5 h-3.5" />
            </span>
            <div class="min-w-0">
              <p class="text-[11px] font-bold text-slate-800">ประกาศกรรมการ HR Audit</p>
              <p class="text-[10.5px] text-slate-500 leading-relaxed mt-0.5">
                ระบบจะบันทึกพิกัด GPS และสถานอุปกรณ์เพื่อยืนยันการประมูลปฏิบัติงานตามคู่มือการเวลาปฏิบัติงาน
              </p>
            </div>
          </div>

          <p class="mt-auto pt-3 text-[10px] text-slate-400 flex items-center justify-between">
            <span>การลงเวลาดำเนินการแบบอัตโนมัติ</span>
            <button type="button" class="text-[10px] font-semibold text-blue-900 hover:underline cursor-pointer" @click="show('อ่านนโยบายลงเวลายังไม่พร้อมใช้งาน')">
              อ่านนโยบายลงเวลา
            </button>
          </p>
        </div>
      </div>
    </div>

    <!-- แถบดำเนินการล่าง (sticky) -->
      <div class="max-w-8xl mx-auto  px-4 lg:px-20">
        <div class=" py-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <span class="inline-flex items-center gap-2 text-[11px] font-semibold text-emerald-600 shrink-0">
            <span class="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
              <Check class="w-3 h-3" />
            </span>
            ข้อมูลครบถ้วนสมบูรณ์ 100%
          </span>
          <span class="hidden lg:block text-[10px] text-slate-400 truncate flex-1">
            ยืนยันใบหน้า AI · พิกัด GPS · โหมด WFH
          </span>
          <span class="lg:hidden flex-1" />
          <button
            type="button"
            class="shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-blue-900 text-white shadow-md shadow-blue-900/30 hover:bg-blue-800 hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer text-left"
            @click="clockIn"
          >
            <LogIn class="w-4.5 h-4.5" />
            <span>
              <span class="block text-sm font-bold leading-tight">บันทึกการลงงาน (Clock In)</span>
              <span class="block text-[10px] text-blue-200 font-medium tabular-nums">บันทึกเวลา {{ liveTimeText }} น.</span>
            </span>
          </button>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  Building2,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Home,
  IdCard,
  LocateFixed,
  LogIn,
  MapPin,
  Navigation,
  ScanFace,
  ShieldCheck,
  Smile,
  User,
  Wifi,
} from 'lucide-vue-next';
import { displayName } from '../composables/useAuth';
import { useToast } from '../composables/useToast';

const router = useRouter();
const { show } = useToast();

const now = ref(new Date());
let clockTimer: ReturnType<typeof setInterval> | undefined;

const liveTimeText = computed(() => {
  const t = now.value;
  return `${String(t.getHours()).padStart(2, '0')} : ${String(t.getMinutes()).padStart(2, '0')} : ${String(t.getSeconds()).padStart(2, '0')}`;
});

onMounted(() => {
  clockTimer = setInterval(() => (now.value = new Date()), 1000);
});
onUnmounted(() => clearInterval(clockTimer));

const workMode = ref<'onsite' | 'wfh'>('wfh');
const workProject = ref('wfh');
const workNote = ref('');

// --- ยืนยันใบหน้า: null = ยังไม่ถ่าย (แตะเพื่อถ่ายรูป), มีค่า = ถ่ายแล้ว
const facePhoto = ref<string | null>(null);

const takeFacePhoto = () => {
  // TODO: เรียกกล้องจริง (getUserMedia / input capture) แล้วเก็บ data URL ลง facePhoto
  facePhoto.value = 'mock';
  show('ถ่ายรูปและยืนยันใบหน้าสำเร็จ (AI MATCH 99.4%)');
};

const retakeFacePhoto = () => {
  facePhoto.value = null;
};

const clockIn = () => {
  show(`บันทึกการลงงาน ${liveTimeText.value} เรียบร้อยแล้ว`);
  router.push('/user/home');
};
</script>
