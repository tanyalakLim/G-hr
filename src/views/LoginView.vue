<template>
  <div class="min-h-full grid grid-cols-1 lg:grid-cols-2 bg-white">
    <!-- ===== ซ้าย: ฟอร์มเข้าสู่ระบบ ===== -->
    <div class="flex flex-col px-8 sm:px-14 lg:px-16 py-8 min-h-screen">
      <!-- Logo -->
      <div class="flex items-center gap-3 sm:pt-10">
        <div class="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-bma-900 flex items-center justify-center shadow-sm overflow-hidden">
          <img :src="logoUrl" alt="โลโก้ระบบ G-HR" class="w-full h-full object-cover rounded-xl" />
        </div>
        <div>
          <p class="text-base font-bold text-slate-900 leading-tight">G-HR</p>
          <p class="text-[11px] text-slate-500">ระบบบริหารทรัพยากรบุคคล</p>
        </div>
      </div>

      <!-- Form -->
      <div class="flex-1 flex flex-col justify-center max-w-md w-full mx-auto lg:mx-0 py-10">
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">เข้าสู่ระบบปฏิบัติงาน</h1>
        <p class="mt-2 text-sm text-slate-500">กรอกข้อมูลบัญชีผู้ใช้เพื่อเข้าสู่ระบบงานบริหารทรัพยากรบุคคล</p>

        <form class="mt-8 space-y-5" @submit.prevent="handleSignIn">
          <!-- ชื่อผู้ใช้งาน -->
          <div>
            <label for="login-account" class="block text-sm font-semibold text-slate-700 mb-1.5">ชื่อผู้ใช้งาน</label>
            <div class="relative">
              <input
                id="login-account"
                v-model="account"
                type="text"
                autocomplete="username"
                placeholder="กรอกชื่อผู้ใช้งาน"
                class="w-full text-sm px-4 py-3 pr-11 border rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-bma-500/20"
                :class="isAccountValid ? 'border-emerald-400 focus:border-emerald-500' : 'border-slate-200 focus:border-bma-600'"
              />
              <CheckCircle2
                v-if="isAccountValid"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500"
              />
            </div>
          </div>

          <!-- รหัสผ่าน -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label for="login-password" class="block text-sm font-semibold text-slate-700">รหัสผ่าน</label>
              <button
                type="button"
                class="text-xs font-medium text-bma-700 hover:text-bma-500 transition-colors cursor-pointer"
                @click="show('ระบบกู้คืนรหัสผ่านยังไม่เปิดใช้งาน')"
              >
                ลืมรหัสผ่าน?
              </button>
            </div>
            <div class="relative">
              <input
                id="login-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••••••"
                class="w-full text-sm px-4 py-3 pr-11 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bma-500/20 focus:border-bma-600 transition-all"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                :title="showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'"
                @click="showPassword = !showPassword"
              >
                <Eye v-if="!showPassword" class="w-5 h-5" />
                <EyeOff v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- จดจำรหัสผ่าน -->
          <label class="flex items-center gap-2.5 cursor-pointer select-none">
            <input v-model="rememberMe" type="checkbox" class="w-4 h-4 rounded border-slate-300 accent-bma-700 cursor-pointer" />
            <span class="text-sm text-slate-600">จดจำรหัสผ่านไว้ในเครื่องนี้</span>
          </label>

          <!-- Sign in -->
          <UiButton variant="primary" size="md" class="w-full justify-center !py-3.5" type="submit">
            เข้าสู่ระบบ (Sign In)
            <template #icon>
              <ArrowRight class="w-4 h-4" />
            </template>
          </UiButton>
        </form>
      </div>

      <p class="text-[11px] text-slate-400 text-center sm:pb-10 lg:text-left">ระบบบริหารทรัพยากรบุคคล © 2568</p>
    </div>

    <!-- ===== ขวา: แนะนำระบบ (โทนน้ำเงินเข้ม) ===== -->
    <div class="hidden lg:flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-bma-800 via-bma-900 to-[#101b3f] px-14 py-12">
      <!-- สลักแสงตกแต่ง -->
      <div class="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-bma-600/20 blur-3xl" />
      <div class="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />

      <div class="relative max-w-xl">
        <h2 class="text-3xl xl:text-4xl font-bold text-white leading-snug">
          ระบบบริหารทรัพยากรบุคคล<br />ของหน่วยงานภาครัฐ
        </h2>
        <p class="mt-4 text-sm text-blue-100/80 leading-relaxed">
          เชื่อมโยงข้อมูลทรัพยากรบุคคลทั้งหมดไว้ในที่เดียว โดยรักษาความปลอดภัยสูง
        </p>

        <!-- การ์ดแดชบอร์ดจำลอง -->
        <div class="mt-10 rounded-2xl bg-white shadow-2xl shadow-black/30 p-5 space-y-4">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2.5">
              <span class="w-9 h-9 rounded-xl bg-bma-900 flex items-center justify-center overflow-hidden">
                <img :src="logoUrl" alt="โลโก้ระบบ G-HR" class="w-full h-full object-cover rounded-xl" />
              </span>
              <span class="text-sm font-bold text-slate-900">แดชบอร์ดภาพรวม</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] text-slate-400">1 ต.ค. - 31 ต.ค.</span>
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100 text-[10px] font-semibold text-bma-700">
                • ไม่มีข้อมูลล่า
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-xl border border-slate-100 p-3.5">
              <p class="text-[11px] text-slate-500">อัตรากำลังปฏิบัติงานจริง</p>
              <p class="mt-1 text-xl font-bold text-slate-900">
                12,450
                <span class="ml-1 text-[10px] font-semibold text-emerald-500">+2.3%</span>
              </p>
              <div class="mt-2.5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div class="h-full w-[78%] rounded-full bg-emerald-500" />
              </div>
            </div>
            <div class="rounded-xl border border-slate-100 p-3.5">
              <p class="text-[11px] text-slate-500">อัตราการมาปฏิบัติงาน</p>
              <p class="mt-1 text-xl font-bold text-slate-900">
                94.8%
                <span class="ml-1 text-[10px] font-medium text-slate-400">เป้า 95%</span>
              </p>
              <div class="mt-2.5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div class="h-full w-[95%] rounded-full bg-bma-700" />
              </div>
            </div>
          </div>

          <p class="text-[11px] font-semibold text-slate-500">ภาพรวมหน่วยงาน</p>
          <div class="space-y-2.5">
            <div v-for="row in overviewRows" :key="row.label" class="flex items-center gap-3">
              <span
                class="w-7 h-7 rounded-lg text-[10px] font-bold flex items-center justify-center flex-shrink-0"
                :class="row.tone"
              >
                {{ row.badge }}
              </span>
              <span class="flex-1 min-w-0 truncate text-xs font-medium text-slate-700">{{ row.label }}</span>
              <span class="text-[11px] font-semibold text-emerald-500">{{ row.value }}</span>
              <span class="text-[10px] text-slate-400">{{ row.unit }}</span>
            </div>
          </div>
        </div>

        <!-- การ์ดลงนามดิจิทัล (Thal ID) -->
        <div class="mt-4 ml-auto max-w-sm rounded-2xl bg-white shadow-2xl shadow-black/30 p-4 space-y-3">
          <div class="flex items-center justify-between gap-2">
            <span class="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              อนุมัติคำขอบุคคล / เปลี่ยนงาน
            </span>
            <span class="text-[10px] text-slate-400 font-mono">ID: REQ-2568-9</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 flex items-center justify-center flex-shrink-0">นส.</span>
            <div class="min-w-0 flex-1">
              <p class="text-xs font-semibold text-slate-900 truncate">นส. สุทธิดา โรจน์วงศ์</p>
              <p class="text-[10px] text-slate-400 truncate">เจ้าหน้าที่การเงินอาวุโส</p>
            </div>
            <UiBadge tone="amber" shape="chip">รอตรวจสอบ</UiBadge>
          </div>
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-full bg-amber-100 text-[10px] font-bold text-amber-700 flex items-center justify-center flex-shrink-0">ป</span>
            <div class="min-w-0 flex-1">
              <p class="text-xs font-semibold text-slate-900 truncate">ประวีร์ ศรีจันทร์</p>
              <p class="text-[10px] text-slate-400 truncate">โอนย้ายไปหน่วยงานการเงิน</p>
            </div>
            <UiBadge tone="emerald" shape="chip">อนุมัติแล้ว</UiBadge>
          </div>
          <div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <span class="text-[10px] text-slate-400">บูรณาการกับ ThalID GovSign</span>
            <UiButton size="xs" class="!rounded-lg">ลงนามดิจิทัล</UiButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-vue-next';
import logoUrl from '../assets/logo.png';
import { UiBadge, UiButton } from '../components/ui';
import { useAuth } from '../composables/useAuth';
import { useToast } from '../composables/useToast';
const { show } = useToast();
const { signIn } = useAuth();

const router = useRouter();

const account = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(true);

// จำลอง: ถือว่าชื่อผู้ใช้งานถูกต้องเมื่อกรอกอย่างน้อย 4 ตัวอักษร
const isAccountValid = computed(() => account.value.trim().length >= 4);

const handleSignIn = () => {
  if (!isAccountValid.value) {
    show('กรุณากรอกชื่อผู้ใช้งานอย่างน้อย 4 ตัวอักษร');
    return;
  }
  if (!password.value) {
    show('กรุณากรอกรหัสผ่าน');
    return;
  }
  signIn();
  router.push('/home');
};

// ข้อมูลจำลอง "ภาพรวมหน่วยงาน" ในการ์ดขวา
const overviewRows = [
  { badge: 'ผ', tone: 'bg-blue-100 text-bma-700', label: 'ผ่านผลการประเมิน', value: '89.1%', unit: '2,412 ราย' },
  { badge: 'ย', tone: 'bg-blue-100 text-bma-700', label: 'คำขอการโอนย้าย', value: '96.8%', unit: '341 ราย' },
  { badge: 'พ', tone: 'bg-amber-100 text-amber-700', label: 'คำของานแผนพัฒนา', value: '92.4%', unit: '186 ราย' },
];
</script>
