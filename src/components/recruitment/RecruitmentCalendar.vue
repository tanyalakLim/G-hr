<template>
  <!-- ปฏิทินประกาศ — ใช้ร่วมกันในหน้า การคัดเลือก และ การสอบแข่งขัน (เว็บสรรหา public)
       UX: แถบเครื่องมือ (สลับมุมมอง + จำนวน + ค้นหา) อยู่บนสุดของการ์ดมุมมอง
       ปฏิทิน = กดวันที่แล้วดูประกาศของวันนั้นในแผงด้านขวา -->
  <div class="space-y-4">
    <!-- ===== แถบเครื่องมือ: สลับมุมมอง + สรุปจำนวนประกาศ + ช่องค้นหา ===== -->
    <div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl">
      <div class="inline-flex rounded-xl border border-slate-200 bg-white shadow-sm  p-1">
        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors"
          :class="viewMode === 'calendar' ? 'bg-bma-700 text-white' : 'text-slate-500 hover:text-bma-700'"
          @click="viewMode = 'calendar'"
        >
          <CalendarDays class="h-3.5 w-3.5" />
          ปฏิทิน
        </button>
        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors"
          :class="viewMode === 'list' ? 'bg-bma-700 text-white' : 'text-slate-500 hover:text-bma-700'"
          @click="viewMode = 'list'"
        >
          <List class="h-3.5 w-3.5" />
          รายการทั้งหมด
        </button>
      </div>
      <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p class="whitespace-nowrap text-xs text-slate-500">
          รวมประกาศ{{ categoryLabel }}ทั้งหมด <span class="font-bold text-bma-700">{{ items.length }}</span> ฉบับ
        </p>
        <!-- ช่องค้นหาประกาศ -->
        <div class="relative w-full sm:w-64">
          <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchQuery"
            type="search"
            aria-label="ค้นหาประกาศ"
            placeholder="ค้นหาประกาศ..."
            class="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm text-slate-700 placeholder:text-slate-400 [&::-webkit-search-cancel-button]:appearance-none focus:border-bma-400 focus:outline-none focus:ring-2 focus:ring-bma-100"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition-colors hover:text-slate-600 cursor-pointer"
            title="ล้างคำค้นหา"
            @click="searchQuery = ''"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- ===== โหมดค้นหา: แสดงเฉพาะรายการที่ตรงคำค้น ===== -->
    <template v-if="searchQuery.trim()">
      <p class="text-xs text-slate-500">พบ <span class="font-bold text-bma-700">{{ searchResults.length }}</span> ฉบับจากคำค้น “{{ searchQuery.trim() }}”</p>
      <div v-if="searchResults.length" class="space-y-3">
        <button
          v-for="item in searchResults"
          :key="item.id"
          type="button"
          class="group flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left transition-colors hover:border-bma-300 hover:bg-bma-50/40 cursor-pointer sm:px-5"
          @click="emit('open', item)"
        >
          <div class="w-14 shrink-0 rounded-lg bg-bma-50 py-2 text-center">
            <p class="text-lg font-bold leading-none text-bma-700">{{ dateParts(item.date).day }}</p>
            <p class="mt-1 text-[10px] font-medium whitespace-nowrap text-bma-600">{{ dateParts(item.date).monthAbbr }} {{ dateParts(item.date).year }}</p>
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold text-slate-800 transition-colors group-hover:text-bma-700">{{ item.title }}</p>
            <p class="mt-0.5 truncate text-xs text-slate-500">{{ item.excerpt }}</p>
          </div>
          <span class="hidden shrink-0 items-center gap-1.5 text-xs text-slate-500 sm:inline-flex">
            <FileText class="h-3.5 w-3.5" />
            {{ item.attachments.length }}
          </span>
          <ChevronRight class="h-4.5 w-4.5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
      <!-- ไม่พบผลลัพธ์การค้นหา -->
      <div v-else class="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center">
        <Search class="mx-auto h-8 w-8 text-slate-300" />
        <p class="mt-3 text-sm text-slate-500">ไม่พบประกาศที่ตรงกับคำค้น “{{ searchQuery.trim() }}”</p>
        <button
          type="button"
          class="mt-3 cursor-pointer text-sm font-semibold text-bma-700 transition-colors hover:text-bma-600"
          @click="searchQuery = ''"
        >
          ล้างคำค้นหา
        </button>
      </div>
    </template>

    <!-- ===== โหมดปฏิทิน: ตารางเดือน (ซ้าย) + แผงประกาศของวัน/เดือน (ขวา) ===== -->
    <div v-else-if="viewMode === 'calendar'" class="grid items-start gap-4 lg:grid-cols-3">
      <!-- ปฏิทินเดือน -->
      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
        <!-- แถบควบคุมเดือน -->
        <div class="flex flex-wrap items-center justify-between gap-3 bg-bma-900 px-5 py-4 text-white sm:px-6">
          <div class="flex items-center gap-1">
            <button
              type="button"
              class="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-sky-200 transition-colors hover:bg-white/10 hover:text-white"
              title="เดือนก่อนหน้า"
              @click="shiftMonth(-1)"
            >
              <ChevronLeft class="h-4.5 w-4.5" />
            </button>
            <p class="min-w-[11rem] text-center text-sm font-bold sm:text-base">{{ monthLabel }}</p>
            <button
              type="button"
              class="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-sky-200 transition-colors hover:bg-white/10 hover:text-white"
              title="เดือนถัดไป"
              @click="shiftMonth(1)"
            >
              <ChevronRight class="h-4.5 w-4.5" />
            </button>
          </div>
          <div class="flex items-center gap-3">
            <span class="inline-flex items-center gap-1.5 text-[11px] text-sky-200/90">
              <CalendarDays class="h-3.5 w-3.5" />
              ประกาศ {{ monthItems.length }} รายการ
            </span>
            <button
              type="button"
              class="inline-flex cursor-pointer items-center rounded-lg border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-semibold transition-colors hover:bg-white/20"
              @click="goToday"
            >
              วันนี้
            </button>
          </div>
        </div>

        <!-- หัววันในสัปดาห์ -->
        <div class="grid grid-cols-7 border-b border-slate-100 bg-slate-50/60 text-center text-[10px] font-bold uppercase tracking-wide text-slate-400">
          <span v-for="w in WEEKDAYS" :key="w" class="py-2.5">{{ w }}</span>
        </div>

        <!-- ตารางวันที่ (6 สัปดาห์) — กดที่ช่องวันเพื่อเลือกวัน -->
        <div class="grid grid-cols-7 gap-px bg-slate-100">
          <button
            v-for="(cell, i) in cells"
            :key="i"
            type="button"
            class="min-h-[92px] p-2 text-left transition-colors"
            :class="[
              cell.inMonth ? 'bg-white hover:bg-bma-50/50' : 'bg-slate-50/60',
              cell.inMonth && selectedDay === cell.day ? 'ring-2 ring-inset ring-bma-500' : '',
            ]"
            @click="cell.inMonth && (selectedDay = cell.day)"
          >
            <span
              class="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold"
              :class="cell.inMonth ? (isToday(cell.day) ? 'bg-bma-700 text-white' : 'text-slate-600') : 'text-slate-300'"
            >
              {{ cell.day }}
            </span>
            <!-- ป้ายประกาศของวันนั้น (สูงสุด 2 ป้าย + สรุปจำนวนที่เหลือ) -->
            <div v-if="cell.inMonth && itemsFor(cell.day).length" class="mt-1 space-y-1">
              <span
                v-for="item in itemsFor(cell.day).slice(0, 2)"
                :key="item.id"
                class="block truncate rounded-md bg-bma-50 px-1.5 py-1 text-[10px] font-semibold text-bma-700"
                :title="item.title"
              >
                {{ item.title }}
              </span>
              <p v-if="itemsFor(cell.day).length > 2" class="text-[10px] text-slate-400">
                +{{ itemsFor(cell.day).length - 2 }} รายการ
              </p>
            </div>
          </button>
        </div>
      </div>

      <!-- แผงด้านขวา: ประกาศของวันที่เลือก + ประกาศทั้งเดือน -->
      <aside class="space-y-4 lg:sticky lg:top-20">
        <!-- วันที่เลือก -->
        <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div class="flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/60 px-4 py-3">
            <p class="text-sm font-bold text-slate-800">{{ selectedDay ? `วันที่ ${selectedDay} ${monthLabel}` : 'เลือกวันที่ในปฏิทิน' }}</p>
            <span v-if="selectedDay" class="text-[11px] text-slate-400">{{ selectedDayItems.length }} รายการ</span>
          </div>
          <div v-if="selectedDay && selectedDayItems.length" class="divide-y divide-slate-100">
            <button
              v-for="item in selectedDayItems"
              :key="item.id"
              type="button"
              class="group flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-bma-50/40 cursor-pointer"
              @click="emit('open', item)"
            >
              <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-bma-500" aria-hidden="true"></span>
              <span class="min-w-0 flex-1">
                <span class="block truncate text-xs font-semibold text-slate-800 transition-colors group-hover:text-bma-700">{{ item.title }}</span>
                <span class="mt-0.5 block truncate text-[11px] text-slate-500">{{ item.excerpt }}</span>
              </span>
              <ChevronRight class="mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
          <div v-else class="px-4 py-8 text-center">
            <CalendarDays class="mx-auto h-6 w-6 text-slate-300" />
            <p class="mt-2 text-xs text-slate-400">
              {{ selectedDay ? 'ไม่มีประกาศในวันที่นี้' : 'กดวันที่ในปฏิทินเพื่อดูประกาศของวันนั้น' }}
            </p>
          </div>
        </div>

        <!-- ประกาศทั้งเดือน -->
        <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div class="flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/60 px-4 py-3">
            <p class="text-sm font-bold text-slate-800">ประกาศทั้งเดือน</p>
            <span class="text-[11px] text-slate-400">{{ monthItems.length }} รายการ</span>
          </div>
          <div v-if="monthItems.length" class="divide-y divide-slate-100">
            <button
              v-for="item in monthItems"
              :key="item.id"
              type="button"
              class="group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-bma-50/40 cursor-pointer"
              @click="emit('open', item)"
            >
              <div class="w-10 shrink-0 rounded-lg bg-bma-50 py-1.5 text-center">
                <p class="text-sm font-bold leading-none text-bma-700">{{ dateParts(item.date).day }}</p>
              </div>
              <span class="min-w-0 flex-1 truncate text-xs font-semibold text-slate-800 transition-colors group-hover:text-bma-700">{{ item.title }}</span>
              <ChevronRight class="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
          <div v-else class="px-4 py-8 text-center">
            <p class="text-xs text-slate-400">{{ emptyText ?? 'ไม่มีประกาศในเดือนนี้' }}</p>
          </div>
        </div>
      </aside>
    </div>

    <!-- ===== โหมดรายการทั้งหมด: จัดกลุ่มตามเดือน ===== -->
    <div v-else class="space-y-4">
      <div v-for="group in monthGroups" :key="group.label" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-3 sm:px-6">
          <h3 class="inline-flex items-center gap-2 text-sm font-bold text-slate-800">
            <CalendarDays class="h-4 w-4 text-bma-700" />
            {{ group.label }}
          </h3>
          <span class="text-[11px] text-slate-400">{{ group.items.length }} รายการ</span>
        </div>
        <div class="divide-y divide-slate-100">
          <button
            v-for="item in group.items"
            :key="item.id"
            type="button"
            class="group flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-bma-50/40 cursor-pointer sm:px-6"
            @click="emit('open', item)"
          >
            <!-- บล็อกวันที่แบบปฏิทิน -->
            <div class="w-14 shrink-0 rounded-lg bg-bma-50 py-2 text-center">
              <p class="text-lg font-bold leading-none text-bma-700">{{ dateParts(item.date).day }}</p>
              <p class="mt-1 text-[10px] font-medium whitespace-nowrap text-bma-600">{{ dateParts(item.date).monthAbbr }} {{ dateParts(item.date).year }}</p>
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-slate-800 transition-colors group-hover:text-bma-700">{{ item.title }}</p>
              <p class="mt-0.5 truncate text-xs text-slate-500">{{ item.excerpt }}</p>
            </div>
            <span class="hidden shrink-0 items-center gap-1.5 text-xs text-slate-500 sm:inline-flex">
              <FileText class="h-3.5 w-3.5" />
              {{ item.attachments.length }}
            </span>
            <ChevronRight class="h-4.5 w-4.5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { CalendarDays, ChevronLeft, ChevronRight, FileText, List, Search, X } from 'lucide-vue-next';
import type { RecruitmentAnnouncement } from '../../data/recruitmentAnnouncements';

const props = defineProps<{
  /** รายการประกาศ (เรียงล่าสุด → เก่าสุด) — ปฏิทินเริ่มที่เดือนของประกาศแรก */
  items: RecruitmentAnnouncement[];
  /** ชื่อหมวดสำหรับข้อความสรุปจำนวน เช่น 'การคัดเลือก' */
  categoryLabel?: string;
  /** ข้อความเมื่อเดือนที่แสดงไม่มีประกาศ */
  emptyText?: string;
}>();

const emit = defineEmits<{ open: [item: RecruitmentAnnouncement] }>();

// --- วันที่ภาษาไทย: '28 ตุลาคม 2569' ---
const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];
const MONTH_ABBR: Record<string, string> = {
  มกราคม: 'ม.ค.', กุมภาพันธ์: 'ก.พ.', มีนาคม: 'มี.ค.', เมษายน: 'เม.ย.', พฤษภาคม: 'พ.ค.', มิถุนายน: 'มิ.ย.',
  กรกฎาคม: 'ก.ค.', สิงหาคม: 'ส.ค.', กันยายน: 'ก.ย.', ตุลาคม: 'ต.ค.', พฤศจิกายน: 'พ.ย.', ธันวาคม: 'ธ.ค.',
};
const WEEKDAYS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

// แยกวันที่ไทยเป็น เลขวัน / เลขเดือน (1-12) / พ.ศ.
const parseThaiDate = (date: string) => {
  const [dayStr = '', monthName = '', yearStr = ''] = date.split(' ');
  return {
    day: Number(dayStr) || 0,
    month: THAI_MONTHS.indexOf(monthName) + 1,
    year: Number(yearStr) || 0,
  };
};

// บล็อกวันที่แบบปฏิทินของรายการ (วัน / เดือนย่อ / ปี)
const dateParts = (date: string) => {
  const { day, month, year } = parseThaiDate(date);
  return { day: String(day), monthAbbr: MONTH_ABBR[THAI_MONTHS[month - 1]] ?? '', year: String(year) };
};

// --- มุมมอง: ปฏิทิน หรือ รายการทั้งหมด ---
const viewMode = ref<'calendar' | 'list'>('calendar');

// --- ค้นหาประกาศ (ค้นจากชื่อเรื่อง เนื้อหาย่อ และเลขอ้างอิง) — มีคำค้นเมื่อไรแสดงผลค้นหาแทนมุมมองอื่น ---
const searchQuery = ref('');
const searchResults = computed(() => {
  const needle = searchQuery.value.trim().toLowerCase();
  if (!needle) return [];
  return props.items.filter((item) =>
    [item.title, item.excerpt, item.reference ?? ''].some((text) => text.toLowerCase().includes(needle))
  );
});

// --- เดือนที่กำลังแสดง (เริ่มที่เดือนของประกาศล่าสุด เพื่อให้เห็นเนื้อหาทันที) ---
const now = new Date();
const initial = props.items.length ? parseThaiDate(props.items[0].date) : null;
const displayYear = ref(initial?.year ?? now.getFullYear() + 543);
const displayMonth = ref(initial?.month ?? now.getMonth() + 1);
// วันที่เลือกในปฏิทิน (เริ่มที่วันของประกาศล่าสุด เพื่อให้แผงขวามีเนื้อหา)
const selectedDay = ref<number | null>(initial?.day ?? null);

// ประกาศของเดือนที่แสดง จับกลุ่มตามวันที่
const itemsByDay = computed(() => {
  const map = new Map<number, RecruitmentAnnouncement[]>();
  for (const item of props.items) {
    const d = parseThaiDate(item.date);
    if (d.year === displayYear.value && d.month === displayMonth.value && d.day > 0) {
      const list = map.get(d.day) ?? [];
      list.push(item);
      map.set(d.day, list);
    }
  }
  return map;
});
const itemsFor = (day: number) => itemsByDay.value.get(day) ?? [];

// ประกาศของวันที่เลือก (สำหรับแผงด้านขวา)
const selectedDayItems = computed(() => (selectedDay.value ? itemsFor(selectedDay.value) : []));

// ช่องวันที่ 42 ช่อง (6 สัปดาห์) — เติมวันนำ/วันต่อท้ายของเดือนข้างเคียง
const cells = computed(() => {
  const gregYear = displayYear.value - 543;
  const firstDow = new Date(gregYear, displayMonth.value - 1, 1).getDay();
  const daysInMonth = new Date(gregYear, displayMonth.value, 0).getDate();
  const daysInPrev = new Date(gregYear, displayMonth.value - 1, 0).getDate();
  const out: { day: number; inMonth: boolean }[] = [];
  for (let i = firstDow - 1; i >= 0; i--) out.push({ day: daysInPrev - i, inMonth: false });
  for (let d = 1; d <= daysInMonth; d++) out.push({ day: d, inMonth: true });
  let next = 1;
  while (out.length < 42) out.push({ day: next++, inMonth: false });
  return out;
});

const monthLabel = computed(() => `${THAI_MONTHS[displayMonth.value - 1]} ${displayYear.value}`);

// ประกาศของเดือนที่แสดง (เรียงตามวันที่)
const monthItems = computed(() =>
  props.items
    .map((item) => ({ item, d: parseThaiDate(item.date) }))
    .filter(({ d }) => d.year === displayYear.value && d.month === displayMonth.value)
    .sort((a, b) => a.d.day - b.d.day)
    .map(({ item }) => item)
);

// รายการทั้งหมดจัดกลุ่มตามเดือน (สำหรับมุมมองรายการ)
const monthGroups = computed(() => {
  const groups: { label: string; items: RecruitmentAnnouncement[] }[] = [];
  for (const item of props.items) {
    const d = parseThaiDate(item.date);
    const label = `${THAI_MONTHS[d.month - 1]} ${d.year}`;
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(item);
    else groups.push({ label, items: [item] });
  }
  return groups;
});

// เลื่อนเดือนก่อนหน้า/ถัดไป (ข้ามปี พ.ศ. อัตโนมัติ) — รีเซ็ตวันที่เลือกให้ผู้ใช้เลือกใหม่
const shiftMonth = (delta: number) => {
  let month = displayMonth.value + delta;
  let year = displayYear.value;
  if (month < 1) {
    month = 12;
    year--;
  } else if (month > 12) {
    month = 1;
    year++;
  }
  displayMonth.value = month;
  displayYear.value = year;
  selectedDay.value = null;
};
// กลับมาที่เดือนปัจจุบัน
const goToday = () => {
  displayMonth.value = now.getMonth() + 1;
  displayYear.value = now.getFullYear() + 543;
  selectedDay.value = now.getDate();
};
const isToday = (day: number) =>
  day === now.getDate() && displayMonth.value === now.getMonth() + 1 && displayYear.value === now.getFullYear() + 543;
</script>
