<template>
  <div class="flex flex-col min-h-full w-full">
    <!-- Header: ย้อนกลับ + ชื่อหน้า (PageActionBar) -->
    <PageActionBar
      back-label="ย้อนกลับ"
      back-title="กลับไปหน้าจัดการรอบสอบแข่งขัน"
      badge="จัดการรอบสอบแข่งขัน"
      subtitle="เพิ่มรอบสอบแข่งขัน"
      @back="router.back()"
    />

    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-4">

    <!-- 1. ข้อมูลทั่วไปและกำหนดการ -->
    <section class="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      <SectionHeader icon="clipboard" title="ข้อมูลทั่วไปและกำหนดการ" subtitle="รายละเอียดหลักและกำหนดการของรอบการสอบแข่งขัน" />
      <div class="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
        <div class="sm:col-span-2 lg:col-span-3">
          <UiInput id="round-name" v-model="form.name" label="ชื่อรอบสอบแข่งขัน" size="lg" placeholder="เช่น การสอบแข่งขันเพื่อบรรจุและแต่งตั้งบุคคลเข้ารับราชการ..." />
        </div>
        <UiInput id="round-times" v-model="form.times" label="รอบการสอบ (ครั้ง)" type="number" min="1" placeholder="1" />
        <div>
          <label class="block text-[11px] font-medium text-slate-500 mb-1">ปีงบประมาณ</label>
          <UiSelect id="round-fiscal-year" v-model="form.fiscalYear" :options="fiscalYearOptions" size="lg" placeholder="เลือกปีงบประมาณ" />
        </div>
        <UiInput id="round-fee" v-model="form.fee" label="ค่าธรรมเนียม (บาท)" type="number" min="0" placeholder="0" />
        <UiInput id="round-exam-date" v-model="form.examDate" label="วันที่สอบ" type="date" />
        <UiInput id="round-announce-date" v-model="form.announceDate" label="วันที่ประกาศ" type="date" />
        <div>
          <label class="block text-[11px] font-medium text-slate-500 mb-1">วันที่สมัคร</label>
          <div class="flex items-center gap-2">
            <UiInput id="round-apply-start" v-model="form.applyStart" type="date" class="flex-1" />
            <span class="text-slate-400 text-xs shrink-0">ถึง</span>
            <UiInput id="round-apply-end" v-model="form.applyEnd" type="date" class="flex-1" />
          </div>
        </div>
        <UiInput id="round-result-date" v-model="form.resultDate" label="วันที่ประกาศผลสอบ" type="date" />
        <UiInput id="round-expire-date" v-model="form.expireDate" label="วันหมดอายุบัญชี" type="date" />
      </div>
    </section>

    <!-- 2. ส่วนแนบไฟล์เอกสาร -->
    <section class="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      <SectionHeader icon="paperclip" title="ส่วนแนบไฟล์เอกสาร" subtitle="รองรับ jpg, png, pdf, csv, doc — ไม่เกิน 10MB ต่อไฟล์" />
      <div class="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-1.5">
          <h4 class="text-sm font-semibold text-slate-800">รูปภาพประกอบ</h4>
          <UiUploader v-model="form.images" :accept="ACCEPT" hint="รองรับ jpg, png, pdf, csv, doc (ไม่เกิน 10MB)" />
        </div>
        <div class="space-y-1.5">
          <h4 class="text-sm font-semibold text-slate-800">เอกสารประกอบ</h4>
          <UiUploader v-model="form.documents" :accept="ACCEPT" multiple hint="แนบได้หลายไฟล์ — รองรับ jpg, png, pdf, csv, doc (ไม่เกิน 10MB)" />
        </div>
      </div>
    </section>

    <!-- 3. รายละเอียดและหมายเหตุ -->
    <section class="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      <SectionHeader icon="align" title="รายละเอียดและหมายเหตุ" subtitle="รายละเอียด เงื่อนไข หรือคุณสมบัติของการสอบแข่งขัน" />
      <div class="p-4 sm:p-6 space-y-4">
        <UiTextEditor id="round-detail-editor" v-model="form.details" placeholder="พิมพ์รายละเอียด เงื่อนไข หรือคุณสมบัติของการสอบแข่งขัน..." />
        <div>
          <label class="block text-[11px] font-medium text-slate-500 mb-1">หมายเหตุ</label>
          <textarea
            id="round-note"
            v-model="form.note"
            rows="3"
            placeholder="บันทึกเพิ่มเติมเกี่ยวกับการจัดสอบ..."
            class="w-full rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
          ></textarea>
        </div>
      </div>
    </section>

    <!-- 4. ปุ่มบันทึก -->
    <div class="flex items-center justify-end gap-2">
      <UiButton variant="outline" size="md" @click="router.back()">ยกเลิก</UiButton>
      <UiButton size="md" @click="saveRound">
        <template #icon><Save class="w-4 h-4" /></template>
        บันทึกข้อมูล
      </UiButton>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineComponent, h, type Component } from 'vue';
import { useRouter } from 'vue-router';
import { ClipboardList, FileText, Paperclip, Save } from 'lucide-vue-next';
import { PageActionBar } from '../ui';
import { UiButton, UiInput, UiSelect, UiTextEditor, UiUploader } from '../ui';
import { useToast } from '../../composables/useToast';

const { show } = useToast();
const router = useRouter();

// --- SectionHeader: หัวข้อมาตรฐานของแต่ละส่วน (icon + title + subtitle)
const ICONS: Record<string, Component> = {
  clipboard: ClipboardList,
  paperclip: Paperclip,
  align: FileText,
};
const SectionHeader = defineComponent({
  props: {
    icon: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
  },
  setup(props) {
    return () =>
      h('div', { class: 'px-4 sm:px-6 py-3.5 border-b border-slate-100 flex items-center gap-3' }, [
        h(
          'div',
          { class: 'w-9 h-9 rounded-xl bg-blue-50 text-bma-700 flex items-center justify-center shrink-0' },
          [h(ICONS[props.icon] ?? Paperclip, { class: 'w-4.5 h-4.5' })]
        ),
        h('div', {}, [
          h('h3', { class: 'text-sm font-bold text-slate-900' }, props.title),
          props.subtitle ? h('p', { class: 'text-[11px] text-slate-500' }, props.subtitle) : null,
        ]),
      ]);
  },
});

// --- 1. ข้อมูลทั่วไปและกำหนดการ
const fiscalYearOptions = [
  { value: '2570', label: 'ปี พ.ศ. 2570' },
  { value: '2569', label: 'ปี พ.ศ. 2569' },
  { value: '2568', label: 'ปี พ.ศ. 2568' },
];

const form = ref({
  name: '',
  times: '1',
  fiscalYear: '',
  fee: '0',
  examDate: '',
  announceDate: '',
  applyStart: '',
  applyEnd: '',
  resultDate: '',
  expireDate: '',
  images: <File[]>[],
  documents: <File[]>[],
  details: '',
  note: '',
});

// --- 2. ไฟล์แนบ
const ACCEPT = '.jpg,.jpeg,.png,.pdf,.csv,.doc,.docx';

// --- 4. บันทึก
const saveRound = () => {
  if (!form.value.name.trim()) {
    show('กรุณากรอกชื่อรอบสอบแข่งขัน');
    return;
  }
  show(`บันทึกรอบสอบแข่งขัน "${form.value.name.trim().slice(0, 40)}..." เรียบร้อยแล้ว`);
  router.push('/recruitment/recruitment_exam_round');
};
</script>
