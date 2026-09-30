<template>
  <div class="flex flex-col min-h-full w-full">
    <!-- Header เดียว: ย้อนกลับ + เลขที่คำร้อง + สถานะ -->
    <PageActionBar
      back-label="ย้อนกลับ"
      back-title="กลับไปหน้ารายการคำร้องขอแก้ไข"
      :badge="request.title"
      :subtitle="request.personName"
      @back="$emit('back')"
    >
      <template #left-extra>
        <UiBadge tone="outline" shape="chip" mono>{{ request.requestNumber }}</UiBadge>
      </template>
      <template #actions>
        <UiBadge :tone="statusTones[request.status]" shape="chip">
          <span
            class="w-1.5 h-1.5 rounded-full mr-1"
            :class="request.status === 'pending' ? 'bg-amber-500' : request.status === 'approved' ? 'bg-emerald-500' : 'bg-red-500'"
          />
          {{ statusLabels[request.status] }}
        </UiBadge>
      </template>
    </PageActionBar>

    <div class="pt-8  max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
      <!-- ซ้าย: ลำดับงานหลัก อ่านคำร้อง → บันทึกผล -->
      <div class="lg:col-span-2 space-y-4">
        <!-- 1) รายละเอียดคำร้อง -->
        <section class="rounded-xl border border-slate-200/90 bg-white overflow-hidden">
          <div class="px-4 py-3 border-b border-slate-200/90 flex items-center gap-2">
            <h4 class="text-xs font-bold text-slate-800">รายละเอียดคำร้องขอแก้ไข</h4>
          </div>

          <div class="p-4 space-y-4">
            <!-- ข้อมูลคำร้อง: ผู้ยื่น / วันที่ / เรื่อง -->
            <dl class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div class="rounded-lg border border-slate-200/70 bg-slate-50/70 px-3.5 py-2.5 flex items-start gap-2.5">
                <div class="min-w-0">
                  <dt class="text-[11px] text-slate-400">ชื่อผู้ยื่นคำร้อง</dt>
                  <dd class="text-xs font-semibold text-slate-800 mt-0.5 truncate">{{ request.personName }}</dd>
                </div>
              </div>
              <div class="rounded-lg border border-slate-200/70 bg-slate-50/70 px-3.5 py-2.5 flex items-start gap-2.5">
                <div class="min-w-0">
                  <dt class="text-[11px] text-slate-400">วันที่ยื่นคำร้อง</dt>
                  <dd class="text-xs font-semibold text-slate-800 mt-0.5 truncate">{{ request.submittedAt }}</dd>
                </div>
              </div>
              <div class="rounded-lg border border-slate-200/70 bg-slate-50/70 px-3.5 py-2.5 flex items-start gap-2.5">
                <div class="min-w-0">
                  <dt class="text-[11px] text-slate-400">เรื่องที่ต้องการแก้ไข</dt>
                  <dd class="text-xs font-semibold text-slate-800 mt-0.5 truncate">{{ request.title }}</dd>
                </div>
              </div>
            </dl>

            <div>
              <label class="block text-[11px] font-semibold text-slate-500 mb-1">เหตุผลที่ต้องการแก้ไข</label>
              <div class="rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 py-3 text-xs text-slate-700 leading-relaxed">
                {{ request.detail }}
              </div>
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-slate-500 mb-2">รูปภาพประกอบคำร้อง</label>
              <div class="flex items-start gap-3">
                <div class="w-28 h-28 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-center overflow-hidden shrink-0">
                  <img v-if="request.photoUrl" :src="request.photoUrl" alt="รูปภาพประกอบคำร้อง" class="w-full h-full object-cover" />
                  <ImageIcon v-else class="w-8 h-8 text-slate-300" />
                </div>
                <div class="space-y-1.5 min-w-0">
                  <p class="text-xs font-semibold text-slate-800">
                    {{ request.photoUrl ? 'มีเอกสารรูปภาพแนบมากับคำร้อง' : 'ไม่มีรูปภาพแนบกับคำร้องนี้' }}
                  </p>
                  <p class="text-[11px] text-slate-400">ไฟล์รูปภาพที่ผู้ยื่นคำร้องแนบมา เพื่อประกอบการตรวจสอบ</p>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    :disabled="!request.photoUrl"
                    @click="show('กำลังดาวน์โหลดรูปภาพประกอบคำร้อง')"
                  >
                    <Download class="w-3.5 h-3.5" />
                    ดาวน์โหลดรูปภาพ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 2) ผลการดำเนินการ (งานหลักถัดจากการอ่านคำร้อง) -->
        <section class="rounded-xl border border-slate-200/90 bg-white overflow-hidden">
          <div class="px-4 py-3 border-b border-slate-200/90 flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <h4 class="text-xs font-bold text-slate-800">ผลการดำเนินการ</h4>
            </div>
            <span class="text-[11px] text-slate-400">ตั้งค่าสถานะล่าสุดของคำร้อง</span>
          </div>

          <div class="p-4 space-y-3">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <UiSelect
                id="md-result-status"
                v-model="resultStatus"
                :options="resultStatusOptions"
                label="สถานะ"
                select-class="bg-slate-50 border-slate-200 focus:ring-0 focus:border-blue-500"
              />
              <div>
                <label class="block text-[11px] font-semibold text-slate-500 mb-1">สถานะปัจจุบันในระบบ</label>
                <div class="h-[38px] rounded-lg border border-slate-200 bg-slate-100/80 px-3 flex items-center">
                  <UiBadge :tone="statusTones[request.status]" shape="chip">{{ statusLabels[request.status] }}</UiBadge>
                </div>
              </div>
            </div>

            <div>
              <label for="md-remark" class="block text-[11px] font-semibold text-slate-500 mb-1">หมายเหตุ</label>
              <textarea
                id="md-remark"
                v-model="remark"
                rows="4"
                placeholder="ระบุหมายเหตุหรือเหตุผลประกอบการดำเนินการ..."
                class="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder-slate-400 resize-none"
              />
            </div>

            <div class="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p class="text-[11px]" :class="isDirty ? 'text-blue-700 font-semibold' : 'text-slate-400'">
                {{ isDirty ? 'มีการแก้ไขที่ยังไม่ได้บันทึก' : 'ยังไม่มีการแก้ไข — ปรับสถานะหรือพิมพ์หมายเหตุเพื่อเปิดใช้ปุ่มบันทึก' }}
              </p>
              <UiButton :disabled="!isDirty" @click="show(`บันทึกผลการดำเนินการ: ${resultStatusLabel}`)">
                <template #icon>
                  <Save class="w-4 h-4" />
                </template>
                บันทึกผลการดำเนินการ
              </UiButton>
            </div>
          </div>
        </section>
      </div>

      <!-- ขวา: rail ติดตามสถานะ (sticky) -->
      <aside class="lg:sticky lg:top-16 space-y-4">
        <section class="rounded-xl border border-slate-200/90 bg-white overflow-hidden">
          <div class="px-4 py-3 border-b border-slate-200/90 flex items-center gap-2">
            <h4 class="text-xs font-bold text-slate-800">สถานะการดำเนินการ</h4>
          </div>

          <div class="p-4">
            <!-- สถานะปัจจุบัน -->
            <div class="rounded-xl border border-blue-100 bg-blue-50/60 px-3.5 py-3">
              <p class="text-[11px] text-slate-500">ขั้นตอนปัจจุบัน</p>
              <p class="text-sm font-bold text-bma-700 mt-0.5">{{ currentStepLabel }}</p>
            </div>

            <!-- Stepper แบบกระชับ -->
            <ol class="mt-4 space-y-0">
              <li v-for="(step, index) in steps" :key="step.key" class="relative flex gap-3 pb-5 last:pb-0">
                <span
                  v-if="index < steps.length - 1"
                  class="absolute left-[11px] top-6 bottom-0 w-0.5"
                  :class="step.done ? 'bg-emerald-400' : 'bg-slate-200'"
                />
                <span
                  class="relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  :class="step.done ? 'bg-emerald-500' : step.current ? 'bg-bma-700 ring-4 ring-blue-100' : 'bg-slate-200'"
                >
                  <Check v-if="step.done" class="w-3.5 h-3.5 text-white" />
                  <span v-else class="text-[10px] font-bold" :class="step.current ? 'text-white' : 'text-slate-400'">
                    {{ index + 1 }}
                  </span>
                </span>
                <p
                  class="text-xs font-semibold leading-snug pt-0.5"
                  :class="step.done || step.current ? 'text-slate-800' : 'text-slate-400'"
                >
                  {{ step.label }}
                </p>
              </li>
            </ol>

            <!-- ปุ่มดำเนินการของขั้นปัจจุบัน -->
            <div v-if="request.status === 'pending'" class="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <UiButton variant="outline" size="sm" class="w-full" @click="show('ส่งกลับให้ผู้ยื่นคำร้องเข้ามาแก้ไขแล้ว')">
                <template #icon>
                  <Undo2 class="w-3.5 h-3.5" />
                </template>
                ส่งกลับให้ผู้ยื่นคำร้องแก้ไข
              </UiButton>
              <UiButton size="sm" class="w-full" @click="show('ดำเนินการตรวจสอบต่อแล้ว')">
                <template #icon>
                  <ArrowRight class="w-3.5 h-3.5" />
                </template>
                ดำเนินการต่อ
              </UiButton>
            </div>
          </div>
        </section>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  ArrowRight,
  Check,
  Download,
  FilePenLine,
  Image as ImageIcon,
  Save,
  Undo2,
} from 'lucide-vue-next';
import { PageActionBar, UiBadge, UiButton, UiSelect } from '../ui';
import { useToast } from '../../composables/useToast';
import type { RequestRow } from '../../data/modificationRequests';
const { show } = useToast();


const props = defineProps<{
  request: RequestRow;
}>();

const emit = defineEmits<{
  (e: 'back'): void;
}>();

// --- สถานะ
const statusLabels: Record<string, string> = {
  pending: 'รอดำเนินการ',
  approved: 'อนุมัติแล้ว',
  rejected: 'ไม่อนุมัติ',
};

const statusTones: Record<string, 'amber' | 'emerald' | 'red'> = {
  pending: 'amber',
  approved: 'emerald',
  rejected: 'red',
};

// --- ผลการดำเนินการ (ฟอร์ม)
const resultStatus = ref(props.request.status);
const remark = ref(props.request.remark ?? '');

const resultStatusOptions = [
  { value: 'pending', label: 'รอดำเนินการ' },
  { value: 'approved', label: 'อนุมัติแล้ว' },
  { value: 'rejected', label: 'ไม่อนุมัติ' },
];

const resultStatusLabel = computed(
  () => resultStatusOptions.find((o) => o.value === resultStatus.value)?.label ?? ''
);

// ปุ่มบันทึกเปิดเฉพาะเมื่อมีการแก้ค่า
const isDirty = computed(
  () => resultStatus.value !== props.request.status || remark.value !== (props.request.remark ?? '')
);

watch(
  () => props.request.id,
  () => {
    resultStatus.value = props.request.status;
    remark.value = props.request.remark ?? '';
  }
);

// --- Stepper
const stepDefs = [
  { key: 'pending', label: 'รอดำเนินการ' },
  { key: 'verify', label: 'ตรวจสอบความถูกต้อง และแจ้งผู้ยื่นคำร้อง' },
  { key: 'update', label: 'อัปเดตข้อมูลการปฏิบัติงาน/ประวัติ' },
  { key: 'close', label: 'ปิดคำร้อง' },
];

const steps = computed(() => {
  const status = props.request.status;
  return stepDefs.map((step, index) => ({
    ...step,
    done: status !== 'pending' ? index === 0 || index >= 2 : index === 0,
    current: status === 'pending' ? step.key === 'verify' : false,
  }));
});

const currentStepLabel = computed(
  () => steps.value.find((s) => s.current)?.label ?? (props.request.status === 'approved' ? 'เสร็จสิ้น — อนุมัติแล้ว' : 'เสร็จสิ้น — ไม่อนุมัติ')
);
</script>
