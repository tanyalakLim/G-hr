<template>
  <div>
    <main class="p-4 sm:p-6 lg:px-20 lg:py-8 max-w-8xl mx-auto space-y-5">
      <!-- หัวเรื่อง -->
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">การลา</h1>
          <p class="text-xs text-slate-500 mt-0.5">ดู/แก้ไขวันลา, ทำเรื่องลา · ระบบลาอิเล็กทรอนิกส์ ปีงบประมาณ 2569</p>
        </div>
        <UiButton variant="primary" size="sm" @click="show('แบบฟอร์มยื่นคำขอลายังไม่เปิดใช้งาน')">
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
            <div class="px-4 sm:px-5 py-3 flex items-center justify-between gap-3 flex-wrap border-b border-slate-100">
              <div class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-1.5 py-1.5">
                <button
                  type="button"
                  class="w-6 h-6 rounded-md text-slate-400 hover:text-blue-900 hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-900/40 focus-visible:outline-none"
                  title="เดือนก่อนหน้า"
                  @click.stop="show('ยังรองรับเดือน ต.ค. 2569 เท่านั้น')"
                >
                  <ChevronLeft class="w-4 h-4" />
                </button>
                <span class="flex items-center gap-2 px-2 py-1">
                  <CalendarDays class="w-4 h-4 text-blue-900" />
                  <span class="text-xs font-bold text-slate-700">ต.ค. 2569</span>
                </span>
                <button
                  type="button"
                  class="w-6 h-6 rounded-md text-slate-400 hover:text-blue-900 hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-900/40 focus-visible:outline-none"
                  title="เดือนถัดไป"
                  @click.stop="show('ยังรองรับเดือน ต.ค. 2569 เท่านั้น')"
                >
                  <ChevronRight class="w-4 h-4" />
                </button>
              </div>
              <div class="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                <button
                  type="button"
                  class="p-1.5 rounded-md transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-900/40 focus-visible:outline-none"
                  :class="viewMode === 'calendar' ? 'bg-white shadow-xs text-blue-900' : 'text-slate-400 hover:text-slate-600'"
                  :aria-pressed="viewMode === 'calendar'"
                  title="มุมมองแบบปฏิทิน"
                  @click.stop="viewMode = 'calendar'"
                >
                  <CalendarDays class="w-4 h-4" />
                </button>
                <button
                  type="button"
                  class="p-1.5 rounded-md transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-900/40 focus-visible:outline-none"
                  :class="viewMode === 'list' ? 'bg-white shadow-xs text-blue-900' : 'text-slate-400 hover:text-slate-600'"
                  :aria-pressed="viewMode === 'list'"
                  title="มุมมองแบบรายการ"
                  @click.stop="viewMode = 'list'"
                >
                  <List class="w-4 h-4" />
                </button>
                <button
                  type="button"
                  class="p-1.5 rounded-md transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-900/40 focus-visible:outline-none"
                  :class="viewMode === 'stats' ? 'bg-white shadow-xs text-blue-900' : 'text-slate-400 hover:text-slate-600'"
                  :aria-pressed="viewMode === 'stats'"
                  title="ตารางสถิติการลา"
                  @click.stop="viewMode = 'stats'"
                >
                  <BarChart3 class="w-4 h-4" />
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12">
              <!-- สมาชิกในทีม -->
              <div class="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-slate-100 p-4">
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
              <div class="lg:col-span-9 p-4">
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

                <!-- มุมมองรายการ -->
                <div v-else-if="viewMode === 'list'" class="py-2">
                  <p v-if="!myLeaves.length" class="py-12 text-center">
                    <span class="inline-flex w-14 h-14 rounded-full bg-slate-50 border border-slate-200 items-center justify-center">
                      <CalendarDays class="w-6 h-6 text-slate-300" />
                    </span>
                    <span class="block text-xs text-slate-400 mt-3">ไม่พบรายการลาของท่านในเดือน ต.ค. 2569</span>
                  </p>
                  <ul v-else class="divide-y divide-slate-50">
                    <li v-for="leave in myLeaves" :key="leave.id" class="py-3 flex items-center gap-3">
                      <span class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" :class="typeTone[leave.type]">
                        <CalendarDays class="w-4 h-4" />
                      </span>
                      <div class="min-w-0 flex-1">
                        <p class="text-xs font-bold text-slate-800">{{ typeLabel[leave.type] }}</p>
                        <p class="text-[11px] text-slate-400 mt-0.5">{{ leave.date }} · {{ leave.days }} วัน</p>
                      </div>
                      <span
                        class="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                        :class="statusTone(leave.status)"
                      >{{ leave.status }}</span>
                    </li>
                  </ul>
                </div>

                <!-- มุมมองตารางสถิติการลา -->
                <div v-else-if="viewMode === 'stats'" class="py-1">
                  <div class="overflow-x-auto">
                    <table class="w-full text-left border-separate border-spacing-0">
                      <thead>
                        <tr class="bg-slate-50">
                          <th class="px-3 py-2.5 text-[11px] font-semibold text-slate-500 border-b border-slate-200 text-center w-14">ลำดับ</th>
                          <th class="px-3 py-2.5 text-[11px] font-semibold text-slate-500 border-b border-slate-200">ประเภทการลา</th>
                          <th class="px-3 py-2.5 text-[11px] font-semibold text-slate-500 border-b border-slate-200 text-center">โควต้าวันลา</th>
                          <th class="px-3 py-2.5 text-[11px] font-semibold text-slate-500 border-b border-slate-200 text-center">วันลาสะสม</th>
                          <th class="px-3 py-2.5 text-[11px] font-semibold text-slate-500 border-b border-slate-200 text-right">จำนวนยื่นบอก (วัน)</th>
                          <th class="px-3 py-2.5 text-[11px] font-semibold text-slate-500 border-b border-slate-200 text-right">จำนวนที่อนุมัติ (วัน)</th>
                          <th class="px-3 py-2.5 text-[11px] font-semibold text-slate-500 border-b border-slate-200 text-right">จำนวนที่ไม่อนุมัติ (วัน)</th>
                          <th class="px-3 py-2.5 text-[11px] font-semibold text-slate-500 border-b border-slate-200 text-right">จำนวนที่กำลังเลย (วัน)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(row, i) in statsTable" :key="row.label" class="hover:bg-blue-50/30 transition-colors">
                          <td class="px-3 py-2.5 border-b border-slate-100 text-center text-xs tabular-nums text-slate-400">{{ i + 1 }}</td>
                          <td class="px-3 py-2.5 border-b border-slate-100 text-xs text-slate-700">{{ row.label }}</td>
                          <td class="px-3 py-2.5 border-b border-slate-100 text-center text-xs tabular-nums" :class="row.quota === null ? 'text-slate-300' : 'text-slate-700'">{{ row.quota ?? '-' }}</td>
                          <td class="px-3 py-2.5 border-b border-slate-100 text-center text-xs tabular-nums" :class="row.carried === null ? 'text-slate-300' : 'text-slate-700'">{{ row.carried ?? '-' }}</td>
                          <td class="px-3 py-2.5 border-b border-slate-100 text-right text-xs tabular-nums text-slate-700">{{ row.submitted }}</td>
                          <td class="px-3 py-2.5 border-b border-slate-100 text-right text-xs tabular-nums text-emerald-600">{{ row.approved }}</td>
                          <td class="px-3 py-2.5 border-b border-slate-100 text-right text-xs tabular-nums text-red-500">{{ row.rejected }}</td>
                          <td class="px-3 py-2.5 border-b border-slate-100 text-right text-xs tabular-nums text-amber-600">{{ row.pending }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p class="px-3 py-2 text-[10px] text-slate-400">สถิติประจำปีงบประมาณ 2569</p>
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
  Plus,
  Thermometer,
  UserRound,
  Users,
} from 'lucide-vue-next';
import { UiButton, UiCard } from '../components/ui';
import { useToast } from '../composables/useToast';

const { show } = useToast();

const viewMode = ref<'calendar' | 'list' | 'stats'>('calendar');
const selectedMembers = ref<string[]>([]);

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
const typeTone: Record<LeaveType, string> = {
  vacation: 'bg-emerald-50 text-emerald-600',
  sick: 'bg-sky-50 text-sky-600',
  personal: 'bg-amber-50 text-amber-600',
};
const typeDot: Record<LeaveType, string> = {
  vacation: 'bg-emerald-400',
  sick: 'bg-sky-400',
  personal: 'bg-amber-400',
};
const statusTone = (status: string) =>
  status === 'อนุมัติ' ? 'bg-emerald-50 text-emerald-700'
    : status === 'ไม่อนุมัติ' ? 'bg-red-50 text-red-600'
    : 'bg-amber-50 text-amber-600';

const myLeaves: { id: string; type: LeaveType; date: string; days: number; status: string }[] = [];

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
interface StatsRow {
  label: string;
  quota: number | null;
  carried: number | null;
  submitted: number;
  approved: number;
  rejected: number;
  pending: number;
}

const statsTable: StatsRow[] = [
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
</script>
