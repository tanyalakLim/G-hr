<template>
  <div class="flex flex-col min-h-full w-full">
    <!-- Header: ย้อนกลับ + ชื่อหน้า (PageActionBar) -->
    <PageActionBar
      back-label="ย้อนกลับ"
      back-title="กลับไปหน้ารายละเอียดรอบสอบแข่งขัน"
      badge="รายละเอียดรอบสอบแข่งขัน"
      :subtitle="applicant ? applicant.fullName : ''"
      @back="router.back()"
    >
      <template #actions>
        <UiButton variant="outline" size="sm" title="ดาวน์โหลดไฟล์ผลคะแนนสอบ" @click="downloadExamResult">
          <template #icon>
            <FileText class="w-4 h-4" />
          </template>
          ผลคะแนนสอบ
        </UiButton>
        <UiButton variant="outline" size="sm" title="ดาวน์โหลดเอกสารรับรอง" @click="downloadCertificate">
          <template #icon>
            <FileCheck2 class="w-4 h-4" />
          </template>
          เอกสารรับรอง
        </UiButton>
      </template>
    </PageActionBar>

    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-4">
      <template v-if="applicant">
        <!-- 1. ข้อมูลทั่วไป -->
        <section class="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
          <SectionHeader icon="user" title="ข้อมูลทั่วไป" subtitle="ข้อมูลส่วนตัวและการศึกษาของผู้สมัคร" />
          <div class="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-xs">
            <InfoRow label="เลขประจำตัวประชาชน" :value="formatCitizenId(applicant.citizenId)" mono />
            <InfoRow label="เลขประจำตัวสอบ" :value="applicant.examNo" mono />
            <InfoRow label="ชื่อ-นามสกุล" :value="applicant.fullName" strong />
            <InfoRow label="วัน/เดือน/ปีเกิด" :value="applicant.birthDate" />
            <InfoRow label="เพศ" :value="applicant.gender" />
            <InfoRow label="ตำแหน่งที่สมัคร" :value="applicant.position" />
            <div class="sm:col-span-2">
              <InfoRow
                label="สถานศึกษา / วุฒิการศึกษา"
                :value="`สำเร็จการศึกษาระดับ ${applicant.degree} สาขาวิชาเอก ${applicant.major} จาก${applicant.school}`"
              />
            </div>
            <InfoRow label="ครั้งที่ประกาศรับสมัคร" :value="`ครั้งที่ ${applicant.announceTimes}`" />
            <InfoRow label="ใบอนุญาตประกอบวิชาชีพ" :value="applicant.license === '-' ? '- (ไม่มี)' : applicant.license" />
            <InfoRow label="บัญชีสอบ" :value="applicant.account" />
            <div>
              <div class="text-[11px] font-medium text-slate-500 mb-1">สถานะการคัดกรองคุณสมบัติ</div>
              <UiBadge :tone="applicant.screening === 'ผ่าน' ? 'emerald' : 'red'" shape="chip">
                {{ applicant.screening === 'ผ่าน' ? 'มีคุณสมบัติ ครบถ้วน' : 'ไม่ผ่านการคัดกรองคุณสมบัติ' }}
              </UiBadge>
            </div>
          </div>
        </section>

        <!-- 2. ผลคะแนนสอบ -->
        <section class="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
          <SectionHeader icon="chart" title="ผลคะแนนสอบ" subtitle="รายละเอียดคะแนนแยกตามภาคการทดสอบ" />
          <div class="p-4 sm:p-6 space-y-4">
            <div class="overflow-x-auto rounded-lg border border-slate-200/90">
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr class="bg-slate-100/90 border-b border-slate-200/90 font-semibold text-slate-700 select-none">
                    <th class="py-2.5 px-4">ภาคการทดสอบ</th>
                    <th class="py-2.5 px-4 min-w-[110px] text-center">คะแนนเต็ม</th>
                    <th class="py-2.5 px-4 min-w-[110px] text-center">ทำได้</th>
                    <th class="py-2.5 px-4 min-w-[120px]">ร้อยละ</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                  <tr class="bg-white hover:bg-slate-50/70 transition-colors">
                    <td class="py-3 px-4 font-medium">ภาคความรู้ความสามารถที่ใช้เฉพาะตำแหน่ง (ภาค ข)</td>
                    <td class="py-3 px-4 text-center tabular-nums text-slate-500">200</td>
                    <td class="py-3 px-4 text-center tabular-nums font-semibold">{{ applicant.partA }}</td>
                    <td class="py-3 px-4">
                      <ScoreMeter :value="applicant.partA" :max="200" />
                    </td>
                  </tr>
                  <tr class="bg-slate-50/60 hover:bg-slate-50/70 transition-colors">
                    <td class="py-3 px-4 font-medium">ภาคความเหมาะสมกับตำแหน่ง (ภาค ค) — ทดสอบสมรรถนะ และทดสอบจิตวิทยาฯ</td>
                    <td class="py-3 px-4 text-center tabular-nums text-slate-500">50</td>
                    <td class="py-3 px-4 text-center tabular-nums font-semibold">{{ applicant.competency }}</td>
                    <td class="py-3 px-4">
                      <ScoreMeter :value="applicant.competency" :max="50" />
                    </td>
                  </tr>
                  <tr class="bg-white hover:bg-slate-50/70 transition-colors">
                    <td class="py-3 px-4 font-medium">ภาคความเหมาะสมกับตำแหน่ง (ภาค ค) — สัมภาษณ์</td>
                    <td class="py-3 px-4 text-center tabular-nums text-slate-500">50</td>
                    <td class="py-3 px-4 text-center tabular-nums font-semibold">{{ applicant.interview.toFixed(2) }}</td>
                    <td class="py-3 px-4">
                      <ScoreMeter :value="applicant.interview" :max="50" />
                    </td>
                  </tr>
                  <tr class="bg-blue-50/60 border-t-2 border-blue-100 font-semibold text-blue-950">
                    <td class="py-3 px-4">คะแนนรวมทั้งหมด</td>
                    <td class="py-3 px-4 text-center tabular-nums">300</td>
                    <td class="py-3 px-4 text-center tabular-nums font-bold">{{ applicant.totalScore.toFixed(2) }}</td>
                    <td class="py-3 px-4">
                      <ScoreMeter :value="applicant.totalScore" :max="300" accent />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <UiStatCard
                title="ภาค ข — เฉพาะตำแหน่ง"
                :value="applicant.partA"
                unit="/ 200 คะแนน"
                tone="blue"
                :icon="FileText"
                layout="vertical"
              />
              <UiStatCard
                title="ภาค ค — ความเหมาะสมกับตำแหน่ง"
                :value="(applicant.competency + applicant.interview).toFixed(2)"
                unit="/ 100 คะแนน"
                tone="teal"
                :icon="ClipboardCheck"
                layout="vertical"
              />
              <UiStatCard
                title="คะแนนรวมทั้งหมด"
                :value="applicant.totalScore.toFixed(2)"
                unit="/ 300 คะแนน"
                tone="emerald"
                :icon="Award"
                layout="vertical"
              />
            </div>
          </div>
        </section>

        <!-- 3. ผลการสอบและสถานะบัญชี -->
        <section class="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
          <SectionHeader icon="award" title="ผลการสอบและสถานะบัญชี" subtitle="ผลการสอบ ลำดับที่สอบได้ และสถานะบัญชีสอบแข่งขัน" />
          <div class="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-xs">
            <div>
              <div class="text-[11px] font-medium text-slate-500 mb-1">ผลการสอบ</div>
              <UiBadge :tone="applicant.result === 'pass' ? 'emerald' : 'red'" shape="chip">
                {{ applicant.result === 'pass' ? 'ผ่าน' : 'ไม่ผ่าน' }}
              </UiBadge>
            </div>
            <InfoRow
              label="ลำดับที่สอบได้"
              :value="applicant.rank ? `ลำดับที่ ${applicant.rank}` : '-'"
              strong
            />
            <InfoRow label="วันหมดอายุบัญชีสอบแข่งขัน" :value="applicant.accountExpiry" />
            <InfoRow label="บัญชีสอบ" :value="applicant.account" />
          </div>
        </section>
      </template>

      <div v-else class="bg-white rounded-xl border border-slate-200/90 shadow-sm">
        <UiEmptyState message="ไม่พบข้อมูลผู้สมัครสอบรายนี้" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, type Component } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Award, ClipboardCheck, FileCheck2, FileText, Paperclip, UserCircle2, BarChart3, Trophy } from 'lucide-vue-next';
import { PageActionBar, UiBadge, UiButton, UiEmptyState, UiStatCard } from '../ui';
import { EXAM_APPLICANTS, formatCitizenId, type ExamApplicant } from '../../data/examApplicants';
import { useToast } from '../../composables/useToast';

const { show } = useToast();
const route = useRoute();
const router = useRouter();

// --- ปุ่มดาวน์โหลดไฟล์
const downloadExamResult = () => show('กำลังดาวน์โหลดไฟล์ผลคะแนนสอบ');
const downloadCertificate = () => show('กำลังดาวน์โหลดเอกสารรับรอง');

// --- SectionHeader: หัวข้อมาตรฐานของแต่ละส่วน (icon + title + subtitle) — แนวเดียวกับหน้าฟอร์มรอบสอบ
const ICONS: Record<string, Component> = {
  user: UserCircle2,
  chart: BarChart3,
  award: Trophy,
  paperclip: Paperclip,
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

// --- InfoRow: แถวแสดง label + value ในส่วนข้อมูลทั่วไป
const InfoRow = defineComponent({
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
    strong: { type: Boolean, default: false },
    mono: { type: Boolean, default: false },
  },
  setup(props) {
    return () =>
      h('div', {}, [
        h('div', { class: 'text-[11px] font-medium text-slate-500 mb-1' }, props.label),
        h(
          'div',
          {
            class: [
              'text-slate-800 leading-relaxed',
              props.strong ? 'font-bold text-blue-950' : 'font-medium',
              props.mono ? 'font-mono tabular-nums' : '',
            ],
          },
          props.value
        ),
      ]);
  },
});

// --- ScoreMeter: แถบแสดงร้อยละคะแนนของแต่ละภาค
const ScoreMeter = defineComponent({
  props: {
    value: { type: Number, required: true },
    max: { type: Number, required: true },
    accent: { type: Boolean, default: false },
  },
  setup(props) {
    return () => {
      const pct = Math.min(100, (props.value / props.max) * 100);
      return h('div', { class: 'flex items-center gap-2' }, [
        h('div', { class: 'flex-1 h-1.5 rounded-full bg-slate-200/80 overflow-hidden' }, [
          h('div', {
            class: ['h-full rounded-full', props.accent ? 'bg-blue-700' : 'bg-emerald-500'],
            style: { width: `${pct}%` },
          }),
        ]),
        h('span', { class: 'text-[11px] tabular-nums text-slate-500 w-10 text-right' }, `${pct.toFixed(0)}%`),
      ]);
    };
  },
});

// --- ข้อมูลผู้สมัครตาม id จาก route
const applicant = computed<ExamApplicant | undefined>(
  () => EXAM_APPLICANTS.find((a) => a.citizenId === String(route.params.applicantId))
);
</script>
