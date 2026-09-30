<template>
  <div>
    <!-- People Sub Toolbar -->
    <div class="px-4 py-3 border-b border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-2.5">
        <UiButton
          id="btn-download-people-png"
          variant="outline"
          @click="show('กำลังส่งออกผังรายบุคคลเป็นไฟล์ PNG')"
        >
          <template #icon>
            <Image class="w-4 h-4 text-blue-700" />
          </template>
          ดาวน์โหลด PNG
        </UiButton>

        <UiButton
          id="btn-download-people-pdf"
          variant="outline"
          @click="show('กำลังส่งออกผังรายบุคคลเป็นไฟล์ PDF')"
        >
          <template #icon>
            <FileText class="w-4 h-4 text-red-600" />
          </template>
          ดาวน์โหลด PDF
        </UiButton>
      </div>

      <!-- Unit Selector -->
      <div class="relative rounded-xl border border-slate-200 bg-white pl-3 pr-16 py-1.5 min-w-[240px] self-start sm:self-auto">
        <div class="text-[10px] text-slate-400 leading-none mb-1">หน่วยงาน</div>
        <select
          id="people-unit-filter"
          v-model="personUnitFilter"
          class="appearance-none bg-transparent w-full text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-2"
        >
          <option value="all">ทุกหน่วยงาน</option>
          <option v-for="unit in unitOptions" :key="unit.id" :value="unit.id">
            {{ unit.name }}
          </option>
        </select>
        <button
          v-if="personUnitFilter !== 'all'"
          type="button"
          class="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
          title="ล้างหน่วยงานที่เลือก"
          @click="personUnitFilter = 'all'"
        >
          <CircleX class="w-4 h-4" />
        </button>
        <ChevronDown class="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>

    <!-- People Canvas -->
    <div class="p-4 sm:p-8 bg-slate-50/70 overflow-x-auto">
      <div v-if="personRoot" class="flex flex-col items-center min-w-max mx-auto">
        <!-- Root Person Card -->
        <div class="w-full max-w-xl bg-white rounded-2xl border border-slate-200 border-t-4 border-t-blue-900 shadow-sm px-5 py-4 flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img
              v-if="personRootHolder?.avatarUrl"
              :src="personRootHolder.avatarUrl"
              :alt="personRootHolder.name"
              class="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <User v-else class="w-7 h-7 text-blue-700" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-base font-bold text-slate-900">{{ personRootHolder?.name }}</span>
              <UiBadge tone="blue" size="sm" class="flex-shrink-0">ระดับบริหาร</UiBadge>
            </div>
            <div class="text-sm font-semibold text-blue-800 mt-0.5">{{ personRoot.jobTitle }}</div>
            <div class="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
              <FileText class="w-3 h-3 flex-shrink-0" />
              <span class="truncate">{{ unitRootName(personRoot.unitId) }}</span>
            </div>
          </div>

          <button
            type="button"
            class="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-blue-900 transition-colors flex-shrink-0 cursor-pointer"
            :title="peopleExpanded ? 'ยุบผู้ใต้บังคับบัญชา' : 'ขยายผู้ใต้บังคับบัญชา'"
            @click="peopleExpanded = !peopleExpanded"
          >
            <ChevronDown class="w-4 h-4 transition-transform" :class="peopleExpanded ? '' : '-rotate-90'" />
          </button>
        </div>

        <!-- Connectors + Reports -->
        <template v-if="peopleExpanded && personChildren.length > 0">
          <div class="w-px h-8 bg-slate-300" />
          <div class="relative flex gap-5 items-stretch">
            <div
              class="absolute h-px bg-slate-300"
              :style="{ left: barInset, right: barInset }"
            />
            <div
              v-for="report in personChildren"
              :key="report.id"
              class="flex flex-col items-center"
            >
              <div class="w-px h-6 bg-slate-300" />

              <!-- Report Person Card -->
              <div class="w-[240px] bg-white rounded-xl border border-slate-200 border-t-4 border-t-emerald-500 shadow-sm p-3.5 relative transition-shadow hover:shadow-md">
                <button
                  type="button"
                  class="absolute top-3 right-3 text-slate-300 hover:text-blue-900 transition-colors cursor-pointer"
                  title="ดูข้อมูลเพิ่มเติม"
                  @click="show(`ข้อมูลของ ${holderOf(report)?.name ?? 'ตำแหน่งว่าง'} — ${report.jobTitle}`)"
                >
                  <ChevronRight class="w-4 h-4" />
                </button>

                <div class="flex items-center gap-2.5">
                  <div class="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                    <img
                      v-if="holderOf(report)?.avatarUrl"
                      :src="holderOf(report)!.avatarUrl"
                      :alt="holderOf(report)!.name"
                      class="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <User v-else class="w-4 h-4 text-slate-500" />
                  </div>
                  <div class="min-w-0 pr-4">
                    <div class="text-xs font-bold text-slate-900 truncate">
                      {{ holderOf(report)?.name ?? 'ตำแหน่งว่าง' }}
                    </div>
                    <div class="text-[11px] font-medium text-emerald-600 truncate">
                      {{ report.jobTitle }}
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2.5">
                  <Folder class="w-3 h-3 flex-shrink-0" />
                  <span class="truncate">{{ unitParentName(report.unitId) }}</span>
                </div>

                <div class="flex items-center justify-between gap-2 mt-2.5">
                  <UiBadge tone="slate" shape="chip">ระดับ{{ report.levelLabel }}</UiBadge>
                  <span
                    v-if="holderOf(report)"
                    class="text-[11px] font-semibold text-emerald-600"
                  >
                    ครองตำแหน่ง
                  </span>
                  <span v-else class="text-[11px] font-semibold text-amber-600">ตำแหน่งว่าง</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <UiEmptyState v-else message="ไม่พบข้อมูลบุคลากรในหน่วยงานที่เลือก" class="py-12" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  ChevronDown,
  ChevronRight,
  Image,
  FileText,
  Folder,
  User,
  CircleX,
} from 'lucide-vue-next';
import { UiBadge, UiButton, UiEmptyState } from '../ui';
import { ORG_UNITS, ORG_POSITIONS } from '../../data/organizationData';
import { holderOf, descendantMap, unitRootName, unitParentName } from './orgHelpers';
import { useToast } from '../../composables/useToast';
const { show } = useToast();


const unitOptions = ORG_UNITS;
const personUnitFilter = ref('all');
const peopleExpanded = ref(true);

const personScopedPositions = computed(() => {
  const ids =
    personUnitFilter.value === 'all'
      ? null
      : descendantMap.get(personUnitFilter.value) ?? [personUnitFilter.value];
  return ORG_POSITIONS.filter(
    (p) => p.holderPersonId && (!ids || ids.includes(p.unitId))
  );
});

const personRoot = computed(() => {
  const list = personScopedPositions.value;
  return (
    list.find((p) => p.jobTitle.includes('ผู้อำนวยการ') && !p.jobTitle.includes('รอง')) ?? list[0]
  );
});

const personRootHolder = computed(() => (personRoot.value ? holderOf(personRoot.value) : undefined));

const personChildren = computed(() =>
  personScopedPositions.value.filter((p) => p !== personRoot.value)
);

const barInset = computed(() => `${50 / Math.max(personChildren.value.length, 1)}%`);

watch(personUnitFilter, () => {
  peopleExpanded.value = true;
});
</script>
