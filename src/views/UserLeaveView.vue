<template>
  <div>
    <main class="p-4 sm:p-6 lg:px-20 lg:py-8 max-w-8xl mx-auto space-y-5">
      <!-- หัวเรื่อง -->
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">การลา</h1>
          <p class="text-xs text-slate-500 mt-0.5">ดู/แก้ไขวันลา, ทำเรื่องลา · ระบบลาอิเล็กทรอนิกส์ ปีงบประมาณ 2569</p>
        </div>
        <UiButton variant="primary" size="sm" @click="router.push({ name: 'user-leave-new' })">
          <template #icon><Plus class="w-4 h-4" /></template>
          ยื่นคำขอลา
        </UiButton>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        <!-- สรุปสถิติการลา (ประจำปี) -->
        <aside class="xl:col-span-3 order-1 space-y-3">
          <!-- ลาพักผ่อน: วงแหวน + ตารางโควตา -->
          <div class="bg-white rounded-2xl border border-slate-200/70 shadow-xs p-5 flex flex-col items-center gap-4">
            <div class="flex flex-col items-center">
              <div class="relative w-28 h-28">
                <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
                  <defs>
                    <linearGradient id="vacRing" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stop-color="#34d399" />
                      <stop offset="100%" stop-color="#059669" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" stroke-width="9" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke="url(#vacRing)" stroke-width="9" stroke-linecap="round"
                    class="transition-[stroke-dasharray] duration-700 ease-out"
                    :stroke-dasharray="`${(vacationRemaining / vacationEntitlement) * 264} 264`"
                  />
                </svg>
                <span class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="text-[10px] text-slate-400 mb-0.5">คงเหลือ</span>
                  <span class="text-3xl font-bold tabular-nums leading-none text-slate-800">{{ vacationRemaining }}<span class="text-sm font-semibold text-slate-400">/{{ vacationEntitlement }}</span></span>
                  <span class="text-[10px] text-slate-400 mt-1">วัน</span>
                </span>
              </div>
              <div class="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-emerald-50">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span class="text-[11px] font-bold text-emerald-700">ลาพักผ่อน</span>
                <span class="text-[10px] text-emerald-600/70 tabular-nums">ใช้ไป {{ vacationUsed }} วัน</span>
              </div>
            </div>
            <div class="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                class="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-700"
                :style="{ width: `${(vacationUsed / vacationEntitlement) * 100}%` }"
              />
            </div>
            <div class="w-full rounded-xl bg-slate-50/80 divide-y divide-slate-100 overflow-hidden">
              <div v-for="row in vacationRows" :key="row.label" class="flex items-center justify-between px-4 py-2.5">
                <span class="text-xs text-slate-400">{{ row.label }}</span>
                <span class="text-sm font-bold tabular-nums" :class="row.tone">{{ row.value }} วัน</span>
              </div>
            </div>
          </div>

          <!-- ลาป่วย / ลากิจ -->
          <div class="grid grid-cols-1 gap-3">
            <div
              v-for="row in simpleStats"
              :key="row.label"
              class="bg-white rounded-2xl border border-slate-200/70 shadow-xs px-4 py-3.5 flex items-center gap-3.5 cursor-default"
            >
              <span class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" :class="row.iconTone">
                <component :is="row.icon" class="w-5 h-5" />
              </span>
              <span class="min-w-0 flex-1">
                <span class="block text-xs font-bold text-slate-700">{{ row.label }}</span>
                <span class="block text-[10px] text-slate-400 mt-0.5 tabular-nums">ใช้ไป {{ row.used }} วัน · {{ row.times }} ครั้ง</span>
              </span>
              <span class="text-xl font-bold tabular-nums shrink-0" :class="row.numTone">{{ row.used }}</span>
            </div>
          </div>
        </aside>

        <!-- ปฏิทินและตารางแสดงวันลา -->
        <div class="xl:col-span-9 order-2">
          <UiCard padding="none">
            <!-- แถบเครื่องมือ -->
            <div class="px-4 sm:px-5 py-3 border-b border-slate-100">
              <UiToolbar>
                <template #start>
                  <!-- ตัวกรอง (มุมมองรายการ) -->
                  <template v-if="viewMode === 'list'">
                    <UiSelect v-model="filterYear" :options="yearOptions" size="md" fit select-class="font-bold" />
                    <UiSelect v-model="filterType" :options="typeOptions" size="md" fit />
                    <UiSelect v-model="filterStatus" :options="statusOptions" size="md" fit />
                  </template>
                  <!-- เลือกปี (มุมมองสถิติ) -->
                  <UiSelect v-else-if="viewMode === 'stats'" v-model="filterYear" :options="yearOptions" size="md" fit select-class="font-bold" />
                  <!-- เลือกเดือน (มุมมองปฏิทิน) -->
                  <div v-else class="inline-flex items-center h-9 gap-1 rounded-lg border border-slate-200 bg-white px-1">
                    <UiIconButton tone="ghost" title="เดือนก่อนหน้า" @click="show('ยังรองรับเดือน ต.ค. 2569 เท่านั้น')">
                      <ChevronLeft class="w-4 h-4" />
                    </UiIconButton>
                    <span class="flex items-center gap-2 px-2">
                      <CalendarDays class="w-4 h-4 text-blue-900" />
                      <span class="text-xs font-bold text-slate-700">ต.ค. 2569</span>
                    </span>
                    <UiIconButton tone="ghost" title="เดือนถัดไป" @click="show('ยังรองรับเดือน ต.ค. 2569 เท่านั้น')">
                      <ChevronRight class="w-4 h-4" />
                    </UiIconButton>
                  </div>
                </template>
                <template #end>
                  <UiToggleGroup v-model="viewMode" :items="viewModeItems" size="sm" />
                </template>
              </UiToolbar>
            </div>

            <div class="grid grid-cols-1" :class="viewMode === 'calendar' ? 'lg:grid-cols-12' : ''">
              <!-- สมาชิกในทีม -->
              <div v-if="viewMode === 'calendar'" class="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-slate-100 p-4">
                <p class="text-xs font-bold text-slate-700 px-2">สมาชิกในทีม</p>
                <ul class="mt-3 space-y-1">
                  <li>
                    <button
                      type="button"
                      class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-900/40 focus-visible:outline-none"
                      :class="!selectedMembers.length ? 'bg-blue-50 text-blue-900 border-l-2 border-blue-900' : 'hover:bg-slate-50 text-slate-600'"
                      @click.stop="selectedMembers = []"
                    >
                     <!--  <span
                        class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        :class="!selectedMembers.length ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-400'"
                      >
                        <Users class="w-4 h-4" />
                      </span> -->
                      <span class="min-w-0 flex-1 text-left">
                        <span class="block text-[11px] font-bold truncate">ทั้งหมด (ทีมของฉัน)</span>
                        <span class="block text-[10px] text-slate-400 mt-0.5">ดูการลาของทุกคน</span>
                      </span>
                    </button>
                  </li>
                  <li
                    v-for="member in teamLeaves"
                    :key="member.name"
                  >
                    <button
                      type="button"
                      class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-900/40 focus-visible:outline-none"
                      :class="selectedMembers.includes(member.name) ? 'bg-blue-50 text-blue-900 border-l-2 border-blue-900' : 'hover:bg-slate-50'"
                      @click.stop="toggleMember(member.name)"
                    >
                     <!--  <span
                        class="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                        :class="selectedMembers.includes(member.name) ? 'bg-blue-900 text-white' : 'bg-blue-900/90 text-white'"
                      >
                        {{ member.initial }}
                      </span> -->
                      <span class="min-w-0 flex-1 text-left">
                        <span class="block text-[11px] font-bold truncate" :class="selectedMembers.includes(member.name) ? 'text-blue-900' : 'text-slate-700'">{{ member.name }}</span>
                        <span class="block text-[10px] text-slate-400 mt-0.5">{{ typeLabel[member.type] }} · {{ member.until }}</span>
                      </span>
                      <span class="w-2 h-2 rounded-full shrink-0" :class="typeDot[member.type]" />
                    </button>
                  </li>
                  <li v-if="!teamLeaves.length" class="py-6 text-center text-[11px] text-slate-400">ไม่มีสมาชิกลาในเดือนนี้</li>
                </ul>
              </div>

              <!-- ปฏิทิน -->
              <div class="p-4" :class="viewMode === 'calendar' ? 'lg:col-span-9' : ''">
                <!-- มุมมองปฏิทิน -->
                <div v-if="viewMode === 'calendar'">
                  <div class="grid grid-cols-7">
                    <span
                      v-for="day in weekdayLabels"
                      :key="day"
                      class="text-center text-[10px] font-semibold text-slate-400 uppercase tracking-wide py-2"
                    >{{ day }}</span>
                  </div>
                  <div class="grid grid-cols-7 rounded-xl overflow-hidden border border-slate-200/70">
                    <template v-for="(cell, i) in calendarCells" :key="i">
                      <button
                        type="button"
                        class="min-h-[84px] sm:min-h-[100px] border-b border-l first:border-t-0 border-slate-100 p-2 text-right transition-colors cursor-pointer relative hover:bg-blue-50/40 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-900/40 focus-visible:outline-none"
                        :class="[cell.tone, { 'border-b-0': i >= calendarCells.length - 7, 'border-l-0': i % 7 === 0 }]"
                        :title="cell.title"
                        @click.stop="cell.muted ? undefined : show(cell.title ?? `วันที่ ${cell.day} ต.ค. 2569 ไม่มีรายการ`)"
                      >
                        <span
                          class="text-xs tabular-nums font-semibold inline-flex items-center justify-center min-w-6 h-6 rounded-full"
                          :class="cell.dayText"
                        >{{ cell.day }}</span>
                        <span v-if="cell.tag" class="block mt-1.5 text-left">
                          <span class="inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold leading-tight" :class="cell.tagClass">{{ cell.tag }}</span>
                        </span>
                      </button>
                    </template>
                  </div>
                   <div class="flex items-center gap-4 flex-wrap pt-3">
                    <span v-for="item in legend" :key="item.label" class="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                      <span class="w-2.5 h-2.5 rounded-full" :class="item.dot" />
                      {{ item.label }}
                    </span>
                  </div>
                </div>

                <!-- มุมมองรายการ: ตารางใบลา -->
                <div v-else-if="viewMode === 'list'">
                  <!-- ตารางแสดงรายการใบลา -->
                  <AppTable
                    :columns="listColumns"
                    :data="filteredLeaves"
                    row-key="id"
                  >
                    <template #cell-no="{ value }">
                      <span class="tabular-nums text-slate-400">{{ value }}</span>
                    </template>
                    <template #cell-type="{ row }">
                      <span class="font-semibold text-slate-800">{{ row.type }}</span>
                    </template>
                    <template #cell-status="{ value }">
                      <span
                        class="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold"
                        :class="statusTone(value)"
                      >{{ value }}</span>
                    </template>
                    <template #cell-actions>
                      <UiDropdownButton
                        icon-only
                        menu-title="จัดการใบลา"
                        :items="leaveActionItems"
                        @select="show(`${$event.label} ยังไม่เปิดใช้งาน`)"
                      />
                    </template>
                  </AppTable>
                </div>

                <!-- มุมมองตารางสถิติการลา -->
                <div v-else-if="viewMode === 'stats'">
                  <AppTable
                    :columns="statsColumns"
                    :data="statsTable"
                    row-key="id"
                    :row-class="'bg-white hover:bg-blue-50/30'"
                  >
                    <template #cell-quota="{ row }">
                      <span class="tabular-nums" :class="row.quota === null ? 'text-slate-300' : 'text-slate-700'">{{ row.quota ?? '-' }}</span>
                    </template>
                    <template #cell-carried="{ row }">
                      <span class="tabular-nums" :class="row.carried === null ? 'text-slate-300' : 'text-slate-700'">{{ row.carried ?? '-' }}</span>
                    </template>
                    <template #cell-approved="{ value }">
                      <span class="tabular-nums font-semibold text-emerald-600">{{ value }}</span>
                    </template>
                    <template #cell-rejected="{ value }">
                      <span class="tabular-nums font-semibold text-red-500">{{ value }}</span>
                    </template>
                    <template #cell-pending="{ value }">
                      <span class="tabular-nums font-semibold text-amber-600">{{ value }}</span>
                    </template>
                  </AppTable>
                  <p class="px-1 py-2 text-[10px] text-slate-400">สถิติประจำปีงบประมาณ {{ filterYear }}</p>
                </div>
              </div>
            </div>
          </UiCard>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  CalendarDays,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  List,
  Pencil,
  Plus,
  Thermometer,
  Trash2,
  UserRound,
} from 'lucide-vue-next';
import { UiButton, UiCard, UiIconButton, UiSelect, UiToggleGroup, UiDropdownButton, AppTable, UiToolbar } from '../components/ui';
import { useToast } from '../composables/useToast';
import { useRouter } from 'vue-router';

const { show } = useToast();
const router = useRouter();

const viewMode = ref<'calendar' | 'list' | 'stats'>('calendar');
const selectedMembers = ref<string[]>([]);

const viewModeItems = [
  { value: 'calendar', title: 'มุมมองแบบปฏิทิน', icon: CalendarDays },
  { value: 'list', title: 'มุมมองแบบรายการ', icon: List },
  { value: 'stats', title: 'ตารางสถิติการลา', icon: BarChart3 },
];

const yearOptions = [
  { value: '2570', label: 'ปีงบประมาณ 2570' },
  { value: '2569', label: 'ปีงบประมาณ 2569' },
];

// --- ตัวกรองมุมมองรายการ
const filterYear = ref('2570');
const filterType = ref('all');
const filterStatus = ref('all');

const listColumns = [
  { key: 'no', label: 'ลำดับ', align: 'center' as const, width: '64px' },
  { key: 'type', label: 'ประเภทการลา' },
  { key: 'range', label: 'วันที่ลา' },
  { key: 'days', label: 'จำนวนวัน', align: 'center' as const },
  { key: 'submitted', label: 'วันที่ยื่นใบลา', align: 'center' as const },
  { key: 'status', label: 'สถานะ', align: 'center' as const },
  { key: 'actions', label: 'จัดการ', align: 'center' as const, width: '72px' },
];

const leaveActionItems = [
  { value: 'view', label: 'ดูรายละเอียด', icon: List },
  { value: 'edit', label: 'แก้ไข', icon: Pencil },
  { value: 'delete', label: 'ลบ', icon: Trash2 },
];

const toggleMember = (name: string) => {
  selectedMembers.value = selectedMembers.value.includes(name)
    ? selectedMembers.value.filter((n) => n !== name)
    : [...selectedMembers.value, name];
};

const legend = [
  { label: 'วันหยุด', dot: 'bg-blue-400' },
  { label: 'การลาของฉัน', dot: 'bg-emerald-400' },
  { label: 'การลาของบุคคลอื่น', dot: 'bg-slate-300' },
];

// --- สถิติ ลาพักผ่อน
const vacationEntitlement = 10;
const vacationUsed = 0;
const vacationRemaining = vacationEntitlement - vacationUsed;

const vacationRows = [
  { label: 'โควตา', value: vacationEntitlement, tone: 'text-slate-800' },
  { label: 'ใช้ไป', value: vacationUsed, tone: vacationUsed > 0 ? 'text-emerald-600' : 'text-slate-800' },
  { label: 'คงเหลือ', value: vacationRemaining, tone: 'text-slate-800' },
];

const simpleStats = [
  { label: 'ลาป่วย', used: 0, times: 0, icon: Thermometer, iconTone: 'bg-sky-50 text-sky-600', numTone: 'text-sky-600' },
  { label: 'ลากิจส่วนตัว', used: 0, times: 0, icon: UserRound, iconTone: 'bg-amber-50 text-amber-600', numTone: 'text-amber-600' },
];

type LeaveType = 'vacation' | 'sick' | 'personal';
const typeLabel: Record<LeaveType, string> = {
  vacation: 'ลาพักผ่อน',
  sick: 'ลาป่วย',
  personal: 'ลากิจส่วนตัว',
};
const typeDot: Record<LeaveType, string> = {
  vacation: 'bg-emerald-400',
  sick: 'bg-sky-400',
  personal: 'bg-amber-400',
};
const statusTone = (status: string) =>
  status === 'อนุมัติ' ? 'bg-emerald-50 text-emerald-700'
    : status === 'ไม่อนุมัติ' ? 'bg-red-50 text-red-600'
    : status === 'แบบร่าง' ? 'bg-slate-100 text-slate-500'
    : 'bg-amber-50 text-amber-600';

const leaveStatuses = ['แบบร่าง', 'รออนุมัติ', 'อนุมัติ', 'ไม่อนุมัติ'];

const typeOptions = [
  { value: 'all', label: 'ประเภทใบลา: ทั้งหมด' },
  ...(Object.entries(typeLabel) as [LeaveType, string][]).map(([value, label]) => ({ value, label })),
];

const statusOptions = [
  { value: 'all', label: 'สถานะ: ทั้งหมด' },
  ...leaveStatuses.map((s) => ({ value: s, label: s })),
];

interface LeaveRequest {
  id: number;
  type: string;
  range: string;
  days: number;
  submitted: string;
  status: string;
}

const leaveRequests: LeaveRequest[] = [
  { id: 1, type: 'ลากิจส่วนตัว', range: '21 ต.ค. 2569 - 24 ต.ค. 2569', days: 4, submitted: '-', status: 'แบบร่าง' },
  { id: 2, type: 'ลาป่วย', range: '13 ต.ค. 2569 - 14 ต.ค. 2569', days: 2, submitted: '-', status: 'แบบร่าง' },
];

const filteredLeaves = computed(() =>
  leaveRequests.filter((l) =>
    (filterType.value === 'all' || l.type === typeLabel[filterType.value as LeaveType]) &&
    (filterStatus.value === 'all' || l.status === filterStatus.value),
  ),
);

const teamLeaves: { name: string; initial: string; type: LeaveType; until: string }[] = [
  { name: 'นายกิตติ ว่องไว', initial: 'ก', type: 'sick', until: 'ถึง 7 ต.ค.' },
  { name: 'นางสาวบุญมี ใจดี', initial: 'บ', type: 'personal', until: '20 ต.ค.' },
];

// --- ปฏิทิน ต.ค. 2569 (เริ่มสัปดาห์วันจันทร์, 1 ต.ค. = วันพฤหัสบดี)
const weekdayLabels = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];
const firstWeekdayMon = 3; // จันทร์=0 ... พฤหัสบดี=3
const daysInMonth = 31;
const daysInPrevMonth = 30; // ก.ย.
const todayOct = 12;

interface Cell {
  day: number;
  muted: boolean;
  tag?: string;
  tagClass?: string;
  title?: string;
  tone: string;
  dayText: string;
}

const calendarCells = computed<Cell[]>(() => {
  const cells: Cell[] = [];
  // วันท้ายเดือนก่อนหน้า
  for (let i = firstWeekdayMon - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    cells.push({
      day: d,
      muted: true,
      tone: 'bg-slate-50/50',
      dayText: 'text-slate-300',
    });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const holiday = holidays.find((h) => h.day === d);
    const other = visibleOthersLeaves.value.find((o) => o.day === d);
    const isToday = d === todayOct;
    const isWeekend = (() => {
      const wd = (firstWeekdayMon + d - 1) % 7;
      return wd >= 5;
    })();

    let tone = 'bg-white';
    let dayText = 'text-slate-700';
    let tag: string | undefined;
    let tagClass: string | undefined;
    let title: string | undefined;

    if (holiday) {
      tag = holiday.short;
      tagClass = 'bg-blue-100 text-blue-700';
      title = holiday.name;
      tone = 'bg-blue-50/40';
    } else if (other) {
      tag = other.short;
      tagClass = 'bg-slate-100 text-slate-500';
      title = other.name;
    }
    if (isWeekend) dayText = 'text-red-400';

    if (isToday) {
      tone = 'bg-slate-50';
      dayText = 'bg-blue-900 !text-white';
    }

    cells.push({ day: d, muted: false, tag, tagClass, title, tone, dayText });
  }
  // วันต้นเดือนถัดไปให้ครบแถว
  while (cells.length % 7 !== 0) {
    cells.push({
      day: cells.length - firstWeekdayMon - daysInMonth + 1,
      muted: true,
      tone: 'bg-slate-50/50',
      dayText: 'text-slate-300',
    });
  }
  return cells;
});

const holidays = [
  { day: 13, short: 'วันคล้ายวันสวรรคตพระบรมชนกาธิเบศร', name: 'วันคล้ายวันสวรรคตพระบาทสมเด็จพระบรมชนกาธิเบศร มหาภูมิพลอดุลยเดชมหาราช บรมนาถบพิตร' },
  { day: 23, short: 'วันปิยมหาราช', name: 'วันปิยมหาราช' },
];

const othersLeaves = [
  { day: 6, who: 'นายกิตติ ว่องไว', name: 'นายกิตติ ว่องไว — ลาป่วย', short: 'กิตติ ลาป่วย' },
  { day: 20, who: 'นางสาวบุญมี ใจดี', name: 'นางสาวบุญมี ใจดี — ลากิจ', short: 'บุญมี ลากิจ' },
];

const visibleOthersLeaves = computed(() =>
  selectedMembers.value.length ? othersLeaves.filter((o) => selectedMembers.value.includes(o.who)) : othersLeaves,
);

// --- ตารางสถิติการลา (ประจำปี)
const statsColumns = [
  { key: 'no', label: 'ลำดับ', align: 'center' as const, width: '64px' },
  { key: 'label', label: 'ประเภทการลา' },
  { key: 'quota', label: 'โควต้าวันลา', align: 'center' as const },
  { key: 'carried', label: 'วันลาสะสม', align: 'center' as const },
  { key: 'submitted', label: 'จำนวนยื่นบอก (วัน)', align: 'right' as const },
  { key: 'approved', label: 'จำนวนที่อนุมัติ (วัน)', align: 'right' as const },
  { key: 'rejected', label: 'จำนวนที่ไม่อนุมัติ (วัน)', align: 'right' as const },
  { key: 'pending', label: 'จำนวนที่กำลังเลย (วัน)', align: 'right' as const },
];

interface StatsRow {
  label: string;
  quota: number | null;
  carried: number | null;
  submitted: number;
  approved: number;
  rejected: number;
  pending: number;
}

const statsRows: StatsRow[] = [
  { label: 'ลาเพื่อเตรียมความพร้อมหรือพักฟื้นความพร้อมในการทำงาน', quota: null, carried: null, submitted: 0, approved: 0, rejected: 0, pending: 0 },
  { label: 'ลาพักผ่อน', quota: vacationEntitlement, carried: 0, submitted: 0, approved: 0, rejected: 0, pending: 0 },
  { label: 'ลากิจส่วนตัว', quota: null, carried: null, submitted: 0, approved: 0, rejected: 0, pending: 0 },
  { label: 'ลาป่วย', quota: null, carried: null, submitted: 0, approved: 0, rejected: 0, pending: 0 },
  { label: 'ลาไปช่วยเหลือภริยาที่คลอดบุตร', quota: null, carried: null, submitted: 0, approved: 0, rejected: 0, pending: 0 },
  { label: 'ลาดูแลบุคคลในครอบครัว', quota: null, carried: null, submitted: 0, approved: 0, rejected: 0, pending: 0 },
  { label: 'ลาอุปสมบทหรือไปประกอบพิธีฮัจญ์', quota: null, carried: null, submitted: 0, approved: 0, rejected: 0, pending: 0 },
  { label: 'ลาเข้ารับการตรวจสุขภาพหรือเข้ารับการทำหมัน', quota: null, carried: null, submitted: 0, approved: 0, rejected: 0, pending: 0 },
  { label: 'ลาไปปฏิบัติงานในองค์กรระหว่างประเทศ', quota: null, carried: null, submitted: 0, approved: 0, rejected: 0, pending: 0 },
  { label: 'ลาคลอดบุตร', quota: null, carried: null, submitted: 0, approved: 0, rejected: 0, pending: 0 },
  { label: 'ลาเพื่อฟื้นฟูสมรรถภาพด้านการปฏิบัติงาน', quota: null, carried: null, submitted: 0, approved: 0, rejected: 0, pending: 0 },
];

const statsTable = statsRows.map((row, i) => ({ id: i + 1, no: i + 1, ...row }));
</script>
