<template>
  <UiModal
    :is-open="isOpen"
    max-width="max-w-4xl"
    title="รายละเอียดโครงสร้างหน่วยงาน"
    subtitle="ข้อมูลโครงสร้าง การจัดสรรงาน และรหัสอ้างอิงของหน่วยงานภาครัฐ"
    @close="emit('close')"
  >
    <template #icon>
      <Network class="w-5 h-5 text-bma-700" />
    </template>

    <div v-if="unit" class="space-y-4">
      <!-- ส่วนที่ 1: ข้อมูลทั่วไปของโครงสร้าง -->
      <section class="rounded-xl border border-slate-200/90 bg-white overflow-hidden">
        <div class="px-4 py-3 border-b border-slate-200/90 flex items-center justify-between gap-2">
          <h4 class="inline-flex items-center gap-2 text-xs font-bold text-slate-800">
            ข้อมูลทั่วไปของโครงสร้าง
          </h4>
          <span class="text-[11px] text-slate-400">ส่วนที่ 1: ข้อมูลระเบียนและสังกัด</span>
        </div>

        <dl class="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div class="rounded-lg bg-slate-50/70 border border-slate-200/70 px-3.5 py-2.5">
            <dt class="text-[11px] text-slate-400">หน่วยงาน</dt>
            <dd class="text-xs font-semibold text-slate-900 mt-0.5">{{ unit.name }}</dd>
          </div>
          <div class="rounded-lg bg-slate-50/70 border border-slate-200/70 px-3.5 py-2.5">
            <dt class="text-[11px] text-slate-400">ส่วนราชการ</dt>
            <dd class="text-xs font-semibold text-slate-900 mt-0.5">{{ parentName }}</dd>
          </div>
          <div class="rounded-lg bg-slate-50/70 border border-slate-200/70 px-3.5 py-2.5">
            <dt class="text-[11px] text-slate-400">อักษรย่อ / รหัสสังกัด</dt>
            <dd class="mt-1">
              <UiBadge tone="blue" shape="chip" mono>{{ [unit.code, unit.shortName].filter(Boolean).join(' ') }}</UiBadge>
            </dd>
          </div>

          <div class="rounded-lg bg-slate-50/70 border border-slate-200/70 px-3.5 py-2.5">
            <dt class="text-[11px] text-slate-400">ประเภท</dt>
            <dd class="text-xs font-semibold text-slate-900 mt-0.5">{{ unitType }}</dd>
          </div>
          <div class="rounded-lg bg-slate-50/70 border border-slate-200/70 px-3.5 py-2.5">
            <dt class="text-[11px] text-slate-400">ระดับ</dt>
            <dd class="text-xs font-semibold text-slate-900 mt-0.5">สำนักระดับสูง / กทมระดับต้น</dd>
          </div>
          <div class="rounded-lg bg-slate-50/70 border border-slate-200/70 px-3.5 py-2.5">
            <dt class="text-[11px] text-slate-400">สถานะ</dt>
            <dd class="mt-0.5">
              <UiBadge tone="emerald" shape="chip">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
                ใช้งานอยู่ขณะนี้ (สมบูรณ์)
              </UiBadge>
            </dd>
          </div>

          <div class="rounded-lg bg-slate-50/70 border border-slate-200/70 px-3.5 py-2.5">
            <dt class="text-[11px] text-slate-400">เบอร์โทรศัพท์</dt>
            <dd class="text-xs font-semibold text-slate-900 font-mono mt-0.5">0 2224 8657 ต่อ {{ unit.code }}</dd>
          </div>
          <div class="rounded-lg bg-slate-50/70 border border-slate-200/70 px-3.5 py-2.5">
            <dt class="text-[11px] text-slate-400">โทรสาร (Fax)</dt>
            <dd class="text-xs font-semibold text-slate-900 font-mono mt-0.5">0 2224 8658</dd>
          </div>
          <div class="rounded-lg bg-slate-50/70 border border-slate-200/70 px-3.5 py-2.5">
            <dt class="text-[11px] text-slate-400">การบรรจุงาน ก.น.</dt>
            <dd class="text-xs font-semibold text-slate-900 mt-0.5">ฝ่ายความเห็นชอบสำนักงาน ก.น.</dd>
          </div>
        </dl>
      </section>

      <!-- ส่วนที่ 2: รหัสโครงสร้างและผังทำงาน -->
      <section class="rounded-xl border border-slate-200/90 bg-white overflow-hidden">
        <div class="px-4 py-3 border-b border-slate-200/90 flex items-center justify-between gap-2">
          <h4 class="inline-flex items-center gap-2 text-xs font-bold text-slate-800">
            รหัสโครงสร้างและผังทำงาน
          </h4>
          <span class="text-[11px] text-slate-400">ส่วนที่ 2: รหัสอ้างอิงภายใน</span>
        </div>

        <div class="p-4 grid grid-cols-2 md:grid-cols-5 gap-2.5">
          <div v-for="item in structureCodes" :key="item.label" class="rounded-lg bg-slate-50/70 border border-slate-200/70 px-3 py-2">
            <p class="text-[10px] text-slate-400 uppercase tracking-wide truncate">{{ item.label }}</p>
            <p class="text-[11px] font-bold text-slate-900 font-mono mt-0.5 truncate">{{ item.value }}</p>
          </div>
        </div>
      </section>

      <!-- หน้าที่ความรับผิดชอบ -->
      <section class="rounded-xl border border-slate-200/90 bg-white overflow-hidden">
        <div class="px-4 py-3 border-b border-slate-200/90 flex items-center justify-between gap-2">
          <h4 class="inline-flex items-center gap-2 text-xs font-bold text-slate-800">
            หน้าที่ความรับผิดชอบ
          </h4>
          <span class="text-[11px] text-slate-400">ตามทะเบียนราชการและระเบียบ กทม.</span>
        </div>

        <div class="p-4">
          <p class="text-xs font-semibold text-slate-800">มีอำนาจหน้าที่และขอบข่ายความรับผิดชอบเกี่ยวกับการดำเนินงานดังต่อไปนี้:</p>
          <ul class="mt-2.5 space-y-1.5 text-xs text-slate-600 leading-relaxed list-disc pl-4">
            <li>การบริหารจัดการงบประมาณ งานคลังบรรณ และงานส่วนประสานงานราชการภายในหน่วยงาน</li>
            <li>การวางแผนยุทธศาสตร์ การพัฒนาระบบเทคโนโลยีสารสนเทศ และการคลอมูลข้อมูลเพื่อดำเนินการประมวลราชการให้เป็นไปตามภารกิจภายใน</li>
            <li>ประสานงานและประสานการทำงานร่วมกับสำนักงาน ก.น. และหน่วยงานภายใต้สำนักปลัดกรุงเทพมหานคร</li>
            <li>การจัดทำรายงานสรุปผลการประมวลราชการและติดตามประเมินผลการครองตำแหน่งในส่วนราชการที่รับผิดชอบ</li>
          </ul>
        </div>
      </section>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Network } from 'lucide-vue-next';
import { UiBadge, UiModal } from '../../ui';
import { ORG_UNITS } from '../../../data/organizationData';
import type { OrgUnit } from '../../../data/organizationData';
import { findUnit } from '../orgHelpers';

const props = defineProps<{
  isOpen: boolean;
  unitId: string | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const unit = computed(() => (props.unitId ? findUnit(ORG_UNITS, props.unitId) ?? null : null));

const parentName = computed(() => {
  const find = (units: OrgUnit[]): OrgUnit | null => {
    for (const u of units) {
      if (u.children?.some((c) => c.id === props.unitId)) return u;
      const inChild = u.children ? find(u.children) : null;
      if (inChild) return inChild;
    }
    return null;
  };
  return find(ORG_UNITS)?.name ?? 'สำนักปลัดกรุงเทพมหานคร';
});

const unitType = computed(() => {
  if (!unit.value) return '-';
  if (unit.value.children?.length) return 'สำนัก (ส่วนราชการระดับสำนัก)';
  return 'กอง / แผน (หน่วยงานระดับปฏิบัติ)';
});

// รหัสอ้างอิงภายใน — derive จากรหัสหน่วยงานแบบ deterministic
const structureCodes = computed(() => {
  const code = unit.value?.code ?? '0000';
  const firstChildCode = unit.value?.children?.[0]?.code ?? `${code}01`;
  return [
    { label: 'Department Code', value: `D-${code}` },
    { label: 'Division Code', value: `DIV-${code}` },
    { label: 'Section Code', value: `SEC-${firstChildCode}` },
    { label: 'Job Code', value: 'JOB-BMA-01' },
    { label: 'Root Code', value: 'ROOT-BMA-001' },
    { label: 'Child1 Code', value: `CH1-${code}` },
    { label: 'Child2 Code', value: `CH2-${code}` },
    { label: 'Child3 Code', value: `CH3-${firstChildCode}` },
    { label: 'Child4 Code', value: 'CH4-0000' },
    { label: 'สำนักปลัด', value: 'สำนักปลัด กทม.' },
  ];
});
</script>
