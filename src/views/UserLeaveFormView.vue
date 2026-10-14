<template>
  <div class="flex flex-col min-h-full w-full">
    <UserPageActionBar
      back-label="ย้อนกลับ"
      badge="แบบฟอร์มสร้างใบลา"
      subtitle="ยื่นคำขอลา · ระบบลาอิเล็กทรอนิกส์ ปีงบประมาณ 2570"
      @back="router.back()"
    />
    <main class="p-4 sm:p-6 lg:px-20 lg:py-8 max-w-8xl mx-auto w-full space-y-5">

      <div class="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        <div class="xl:col-span-9 space-y-4">
          <!-- ขั้นตอนที่ 1: เลือกประเภทการลา -->
          <UiCard class="p-4">
            <div class="flex items-center gap-2.5 mb-3">
              <span class="w-6 h-6 rounded-full bg-blue-900 text-white text-[11px] font-bold flex items-center justify-center">1</span>
              <p class="text-sm font-bold text-slate-800">เลือกประเภทการลา</p>
            </div>
            <div class="max-w-sm">
              <UiSelect v-model="form.leaveType" :options="leaveTypeOptions" label="ประเภทใบลา" size="md" />
            </div>
          </UiCard>

          <!-- ขั้นตอนที่ 2: ข้อมูลการลา -->
          <UiCard  class="p-4">
            <div class="flex items-center gap-2.5 mb-4">
              <span class="w-6 h-6 rounded-full bg-blue-900 text-white text-[11px] font-bold flex items-center justify-center">2</span>
              <p class="text-sm font-bold text-slate-800">ข้อมูลการลา</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3.5">
              <div class="flex items-end gap-1.5">
                <UiInput v-model="form.toName" label="เรียน (ชื่อ - นามสกุล)" class="flex-1" />
                <UiIconButton title="เพิ่มผู้รับการลา" class="mb-0.5" @click="show('เพิ่มผู้รับการลายังไม่เปิดใช้งาน')">
                  <Plus class="w-4 h-4" />
                </UiIconButton>
              </div>
              <div class="flex items-end gap-1.5">
                <UiInput v-model="form.toPosition" label="เรียน (ตำแหน่ง)" class="flex-1" />
                <UiIconButton title="เพิ่มผู้รับการลา" class="mb-0.5" @click="show('เพิ่มผู้รับการลายังไม่เปิดใช้งาน')">
                  <Plus class="w-4 h-4" />
                </UiIconButton>
              </div>
              <UiInput v-model="form.submittedDate" label="วันที่ยื่นใบลา" disabled />
              <UiInput v-model="form.subject" label="เรื่อง" disabled />
            </div>

            <!-- ข้อมูลผู้ยื่น -->
            <div class="mt-4 rounded-xl bg-slate-50/80 border border-slate-100 divide-y divide-slate-100">
              <div v-for="row in applicantRows" :key="row.label" class="flex items-start justify-between gap-4 px-4 py-2.5">
                <span class="text-xs text-slate-400 shrink-0">{{ row.label }}</span>
                <span class="text-xs font-semibold text-slate-700 text-right">{{ row.value }}</span>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="rounded-xl border border-slate-200/70 px-4 py-3">
                <p class="text-[11px] text-slate-400">จำนวนสิทธิ์การลาที่ใช้ไป</p>
                <p class="text-xl font-bold tabular-nums text-slate-800 mt-0.5">{{ form.usedQuota }} <span class="text-xs font-semibold text-slate-400">วัน</span></p>
              </div>
              <div class="rounded-xl border border-slate-200/70 px-4 py-3">
                <p class="text-[11px] text-slate-400">จำนวนวันที่อยู่ระหว่างการพิจารณา</p>
                <p class="text-xl font-bold tabular-nums text-amber-600 mt-0.5">{{ form.pendingDays }} <span class="text-xs font-semibold text-slate-400">วัน</span></p>
              </div>
            </div>
          </UiCard>

          <!-- ขั้นตอนที่ 3: รายละเอียดการลา -->
          <UiCard class="p-4">
            <div class="flex items-center gap-2.5 mb-4">
              <span class="w-6 h-6 rounded-full bg-blue-900 text-white text-[11px] font-bold flex items-center justify-center">3</span>
              <p class="text-sm font-bold text-slate-800">กรอกข้อมูลรายละเอียดการลา</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3.5">
              <UiInput v-model="form.writtenAt" label="เขียนที่" placeholder="สถานที่เขียนใบลา" />
              <div class="grid grid-cols-2 gap-3">
                <UiInput v-model="form.startDate" label="วันที่เริ่มต้น" type="date" />
                <UiInput v-model="form.endDate" label="วันที่สิ้นสุด" type="date" />
              </div>
              <UiSelect v-model="form.period" :options="periodOptions" label="ช่วงเวลา" size="md" />
              <UiInput v-model="totalDaysText" label="จำนวนวันที่ลา (วัน)" disabled />
              <UiInput v-model="form.lastLeaveDate" label="ลาครั้งสุดท้ายเมื่อวันที่" disabled />
              <UiInput v-model="form.phone" label="หมายเลขโทรศัพท์ที่ติดต่อได้" placeholder="(0XX)-XXX-XXXX" />
              <div class="sm:col-span-2">
                <UiInput v-model="form.address" label="ที่อยู่ที่ติดต่อได้ระหว่างลา" placeholder="ที่อยู่ระหว่างลา" />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-[11px] font-medium text-slate-500 mb-1">สาเหตุการลา</label>
                <textarea
                  v-model="form.reason"
                  rows="3"
                  placeholder="ระบุเหตุผลความจำเป็นในการลา"
                  class="w-full text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 px-2.5 py-2 resize-none"
                ></textarea>
              </div>
              <div class="sm:col-span-2">
                <label class="block text-[11px] font-medium text-slate-500 mb-1">เอกสารประกอบ</label>
                <label class="inline-flex">
                  <input ref="fileInput" type="file" multiple class="hidden" @change="onFilesChosen" />
                  <UiButton variant="outline" size="sm" @click="fileInput?.click()">
                    <template #icon><Paperclip class="w-4 h-4" /></template>
                    แนบไฟล์
                  </UiButton>
                </label>
                <ul v-if="form.attachments.length" class="mt-2 space-y-1.5">
                  <li v-for="(f, i) in form.attachments" :key="f" class="flex items-center gap-2 text-xs text-slate-600">
                    <Paperclip class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span class="truncate">{{ f }}</span>
                    <button type="button" class="text-slate-400 hover:text-red-500 cursor-pointer ml-1" title="ลบไฟล์" @click="removeAttachment(i)">
                      <X class="w-3.5 h-3.5" />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </UiCard>
        </div>

        <!-- แถบสรุป / ปุ่มบันทึก -->
        <aside class="xl:col-span-3 xl:sticky xl:top-18">
          <UiCard  class="p-4">
            <p class="text-sm font-bold text-slate-800 mb-3">สรุปคำขอ</p>
            <div class="space-y-2.5">
              <div class="flex items-center justify-between">
                <span class="text-xs text-slate-400">ประเภทใบลา</span>
                <span class="text-xs font-bold text-slate-700">{{ selectedTypeLabel }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-slate-400">ช่วงวันที่</span>
                <span class="text-xs font-bold text-slate-700 tabular-nums">{{ dateRangeText }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-slate-400">จำนวนวัน</span>
                <span class="text-xs font-bold text-slate-700 tabular-nums">{{ totalDays }} วัน</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-slate-400">เอกสารแนบ</span>
                <span class="text-xs font-bold text-slate-700 tabular-nums">{{ form.attachments.length }} ไฟล์</span>
              </div>
            </div>
            <div class="mt-4 space-y-2">
              <UiButton variant="primary" size="md" class="w-full" @click="submit('ส่งคำขอลา')">
                ส่งคำขอลา
              </UiButton>
              <UiButton variant="outline" size="md" class="w-full" @click="submit('บันทึกแบบร่าง')">
                บันทึกแบบร่าง
              </UiButton>
            </div>
          </UiCard>
        </aside>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Paperclip, Plus, X } from 'lucide-vue-next';
import UserPageActionBar from '../components/user/UserPageActionBar.vue';
import { UiButton, UiCard, UiIconButton, UiInput, UiSelect } from '../components/ui';
import { useToast } from '../composables/useToast';

const { show } = useToast();
const router = useRouter();

const leaveTypeOptions = [
  { value: 'sick', label: 'ลาป่วย' },
  { value: 'vacation', label: 'ลาพักผ่อน' },
  { value: 'personal', label: 'ลากิจส่วนตัว' },
];

const periodOptions = [
  { value: 'full', label: 'เต็มวัน' },
  { value: 'morning', label: 'ครึ่งวันเช้า' },
  { value: 'afternoon', label: 'ครึ่งวันบ่าย' },
];

const form = ref({
  leaveType: 'sick',
  toName: '',
  toPosition: '',
  submittedDate: '14 ต.ค. 2569',
  subject: 'ลาป่วย',
  usedQuota: 0,
  pendingDays: 0,
  writtenAt: '',
  startDate: '',
  endDate: '',
  period: 'full',
  lastLeaveDate: '-',
  phone: '(098)-889-9880',
  address: 'ย่านถนนพระราม 9 กรุงเทพมหานคร',
  reason: '',
  attachments: [] as string[],
});

const applicantRows = [
  { label: 'ชื่อผู้ยื่นขอ', value: 'นายสมชาย ใจดี' },
  { label: 'ตำแหน่งผู้ยื่นขอ', value: 'นักวิเคราะห์นโยบายและแผน' },
  { label: 'ระดับผู้ยื่นขอ', value: 'ทรงคุณวุฒิ' },
  { label: 'สังกัดผู้ยื่นขอ', value: 'ฝ่ายเลขานุการผู้บริหาร งานเลขานุการและประชุม สำนักงานผู้อำนวยการสถานธนานุบาล' },
];

const selectedTypeLabel = computed(
  () => leaveTypeOptions.find((o) => o.value === form.value.leaveType)?.label ?? '',
);

const totalDays = computed(() => {
  if (!form.value.startDate || !form.value.endDate) return 0;
  const start = new Date(form.value.startDate).getTime();
  const end = new Date(form.value.endDate).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return 0;
  return Math.floor((end - start) / 86400000) + 1;
});

const totalDaysText = computed(() => String(totalDays.value));

const dateRangeText = computed(() => {
  if (!form.value.startDate && !form.value.endDate) return '-';
  return `${formatThai(form.value.startDate)} - ${formatThai(form.value.endDate)}`;
});

const formatThai = (iso: string) => {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
};

const fileInput = ref<HTMLInputElement | null>(null);

const onFilesChosen = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files) {
    form.value.attachments.push(...Array.from(input.files).map((f) => f.name));
  }
  input.value = '';
};

const removeAttachment = (index: number) => {
  form.value.attachments.splice(index, 1);
};

const submit = (action: string) => {
  show(`${action}ยังไม่เปิดใช้งาน`);
};
</script>
