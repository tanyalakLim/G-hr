<template>
  <Teleport to="body">
    <Transition name="drawer-fade">
      <div v-if="position" class="fixed inset-0 bg-slate-900/40 z-40" @click="emit('close')" />
    </Transition>

    <Transition name="drawer-slide">
      <aside
        v-if="position"
        class="fixed top-0 right-0 h-full w-full max-w-[440px] bg-slate-50 z-50 shadow-2xl overflow-y-auto"
      >
        <!-- Header (แนวเดียวกับ UiModal) -->
        <div class="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-200/90 px-4 py-3.5 flex items-center justify-between gap-2">
          <div class="flex items-center gap-3 min-w-0">
            <span class="w-10 h-10 rounded-xl bg-blue-50 text-bma-700 flex items-center justify-center flex-shrink-0">
              <IdCard class="w-5 h-5" />
            </span>
            <div class="min-w-0">
              <h3 class="text-sm font-bold text-slate-800 leading-tight">ทะเบียนประวัติ</h3>
              <p class="text-[11px] text-slate-400 truncate">ข้อมูลผู้ครองตำแหน่ง{{ position ? ` · ${position.positionNumber}` : '' }}</p>
            </div>
          </div>
          <UiIconButton tone="ghost" title="ปิด" @click="emit('close')">
            <X class="w-4 h-4 text-slate-400" />
          </UiIconButton>
        </div>

        <div v-if="holder" class="p-4 space-y-4 pt-12">
          <!-- โปรไฟล์ -->
          <div class="rounded-2xl bg-gradient-to-b from-bma-50 to-white border border-slate-200/90 px-5 pt-9 pb-5 text-center relative">
            <div class="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/3">
              <div class="w-18 h-18 rounded-2xl bg-bma-700 ring-4 ring-white shadow-lg flex items-center justify-center overflow-hidden">
                <img v-if="holder.avatarUrl" :src="holder.avatarUrl" :alt="holder.name" class="w-full h-full object-cover" />
                <UserRound v-else class="w-8 h-8 text-white" />
              </div>
            </div>
            <h4 class="mt-11 text-base font-bold text-slate-900">{{ holder.name }}</h4>
            <div class="mt-2 flex flex-wrap items-center justify-center gap-1.5">
              <UiBadge tone="blue" shape="pill">{{ holder.jobTitle }}</UiBadge>
              <UiBadge tone="slate" shape="pill">{{ position.positionType ?? '-' }}</UiBadge>
            </div>
            <UiButton variant="outline" size="sm" class="mt-4 w-full" @click="show(`เปิดทะเบียนประวัติฉบับเต็มของ ${holder.name}`)">
              <template #icon>
                <ArrowRight class="w-3.5 h-3.5" />
              </template>
              ดูรายละเอียดเพิ่มเติมทั้งหมด
            </UiButton>
          </div>

          <!-- ข้อมูลส่วนตัว -->
          <section class="rounded-xl border border-slate-200/90 bg-white overflow-hidden">
            <div class="px-4 py-3 border-b border-slate-200/90 flex items-center justify-between">
              <h5 class="text-xs font-bold text-slate-800">ข้อมูลส่วนตัว</h5>
              <span class="text-[11px] text-slate-400">ข้อมูลพนักงาน</span>
            </div>
            <div class="p-4 space-y-3">
              <div class="rounded-xl border border-slate-200 bg-slate-50/70 p-3 flex items-center justify-between gap-2">
                <div class="min-w-0">
                  <p class="text-[11px] text-slate-400">เลขประจำตัวประชาชน</p>
                  <p class="text-sm font-bold text-slate-900 font-mono tracking-wide">{{ holder.citizenId }}</p>
                </div>
                <UiIconButton tone="ghost" title="คัดลอกเลขประจำตัวประชาชน" @click="copyCitizenId">
                  <Copy class="w-4 h-4 text-slate-400" />
                </UiIconButton>
              </div>

              <dl class="grid grid-cols-2 gap-x-4 gap-y-3.5">
                <div>
                  <dt class="text-[11px] text-slate-400">เพศ</dt>
                  <dd class="text-xs font-semibold text-slate-800 mt-0.5">{{ genderText }}</dd>
                </div>
                <div>
                  <dt class="text-[11px] text-slate-400">วัน/เดือน/ปีเกิด</dt>
                  <dd class="text-xs font-semibold text-slate-800 mt-0.5">{{ holder.birthDate || '-' }}</dd>
                </div>
                <div>
                  <dt class="text-[11px] text-slate-400">อายุ</dt>
                  <dd class="text-xs font-semibold text-slate-800 mt-0.5">{{ holder.exactAge || '-' }}</dd>
                </div>
                <div>
                  <dt class="text-[11px] text-slate-400">วันครบเกษียณอายุ</dt>
                  <dd class="text-xs font-semibold text-slate-800 mt-0.5">{{ holder.retirementDate || '-' }}</dd>
                </div>
                <div class="col-span-2">
                  <dt class="text-[11px] text-slate-400">วันที่เข้าสู่งานราชการ</dt>
                  <dd class="text-xs font-semibold text-slate-800 mt-0.5">{{ holder.appointedDate || '-' }}</dd>
                </div>
              </dl>
            </div>
          </section>

          <!-- ข้อมูลตำแหน่ง (สรรหา หรือแบบกำหนดเอง) -->
          <section class="rounded-xl border border-slate-200/90 bg-white overflow-hidden">
            <div class="px-4 py-3 border-b border-slate-200/90 flex items-center justify-between">
              <h5 class="text-xs font-bold text-slate-800">{{ sectionTitle ?? 'ข้อมูลสรรหา' }}</h5>
              <span class="text-[11px] text-slate-400">ตำแหน่งและสังกัด</span>
            </div>
            <div class="p-4 space-y-3">
              <div v-if="!customFields" class="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                <p class="text-[11px] text-slate-400">สังกัดหน่วยงาน</p>
                <p class="text-sm font-bold text-slate-900">{{ unitName }}</p>
              </div>

              <!-- โหมดกำหนดเอง: แสดงเฉพาะ field ที่ส่งเข้ามา -->
              <dl v-if="customFields" class="grid grid-cols-2 gap-x-4 gap-y-3.5">
                <div v-for="field in customFields" :key="field.label">
                  <dt class="text-[11px] text-slate-400">{{ field.label }}</dt>
                  <dd class="text-xs font-semibold text-slate-800 mt-0.5">{{ field.value || '-' }}</dd>
                </div>
              </dl>

              <dl v-else class="grid grid-cols-2 gap-x-4 gap-y-3.5">
                <div>
                  <dt class="text-[11px] text-slate-400">เลขที่ตำแหน่ง</dt>
                  <dd class="mt-0.5">
                    <UiBadge tone="outline" shape="chip" mono>{{ position.positionNumber }}</UiBadge>
                  </dd>
                </div>
                <div>
                  <dt class="text-[11px] text-slate-400">ตำแหน่งในสายงาน</dt>
                  <dd class="text-xs font-semibold text-slate-800 mt-0.5">{{ position.jobTitle }}</dd>
                </div>
                <div>
                  <dt class="text-[11px] text-slate-400">สายงาน</dt>
                  <dd class="text-xs font-semibold text-slate-800 mt-0.5">{{ position.lineOfWork || '-' }}</dd>
                </div>
                <div>
                  <dt class="text-[11px] text-slate-400">ด้าน/สาขา</dt>
                  <dd class="text-xs font-semibold text-slate-800 mt-0.5">{{ holder.fieldOrBranch || '-' }}</dd>
                </div>
                <div>
                  <dt class="text-[11px] text-slate-400">ตำแหน่งประเภท</dt>
                  <dd class="text-xs font-semibold text-slate-800 mt-0.5">{{ position.positionType || '-' }}</dd>
                </div>
                <div>
                  <dt class="text-[11px] text-slate-400">ระดับตำแหน่ง</dt>
                  <dd class="text-xs font-semibold text-slate-800 mt-0.5">{{ position.levelLabel || '-' }}</dd>
                </div>
                <div>
                  <dt class="text-[11px] text-slate-400">ตำแหน่งทางการบริหาร</dt>
                  <dd class="text-xs font-semibold text-slate-800 mt-0.5">{{ position.adminPosition || '-' }}</dd>
                </div>
                <div>
                  <dt class="text-[11px] text-slate-400">ด้านทางการบริหาร</dt>
                  <dd class="text-xs font-semibold text-slate-800 mt-0.5">{{ holder.adminPosition || '-' }}</dd>
                </div>
              </dl>
            </div>
          </section>
        </div>

        <!-- ไม่มีผู้ครองตำแหน่ง -->
        <div v-else class="p-6">
          <UiEmptyState message="ตำแหน่งนี้ยังว่างอยู่ — ไม่มีข้อมูลผู้ครองตำแหน่ง" />
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ArrowRight, Copy, IdCard, UserRound, X } from 'lucide-vue-next';
import { UiBadge, UiButton, UiEmptyState, UiIconButton } from '../../ui';
import { ORG_UNITS } from '../../../data/organizationData';
import { holderOf, findUnit, type SharedPosition } from '../orgHelpers';
import type { PersonnelRecord } from '../../../types';
import { useToast } from '../../../composables/useToast';
const { show } = useToast();

const props = defineProps<{
  /** ตำแหน่งที่เปิดทะเบียน — รับ SharedPosition ได้ทุกชุดข้อมูล (org / ลูกจ้างประจำ) */
  position: SharedPosition | null;
  /** ชื่อ section ข้อมูลตำแหน่ง (ค่าเริ่มต้น = ข้อมูลสรรหา) */
  sectionTitle?: string;
  /** ข้อมูลตำแหน่งแบบกำหนดเอง — ระบุแล้วจะแทน grid ของ section (ใช้กับลูกจ้างชั่วคราว ฯลฯ) */
  customFields?: { label: string; value?: string }[];
  /** ผู้ครองตำแหน่งแบบระบุตรง (ใช้เมื่อไม่อ้างอิง holderPersonId ในทะเบียนบุคคล) */
  holderOverride?: Partial<PersonnelRecord>;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const holder = computed(() =>
  props.holderOverride ?? (props.position ? holderOf(props.position) : undefined)
);

const unitName = computed(() =>
  props.position ? findUnit(ORG_UNITS, props.position.unitId)?.name ?? '-' : '-'
);

const genderText = computed(() => {
  if (!holder.value?.gender) return '-';
  return holder.value.gender === 'female' ? 'หญิง' : 'ชาย';
});

const copyCitizenId = async () => {
  if (!holder.value?.citizenId) return;
  try {
    await navigator.clipboard.writeText(holder.value.citizenId);
    show('คัดลอกเลขประจำตัวประชาชนแล้ว');
  } catch {
    show('คัดลอกไม่สำเร็จ — เบราว์เซอร์ไม่อนุญาต');
  }
};
</script>

<style scoped>
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.2s ease;
}
.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.25s ease;
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
}
</style>
