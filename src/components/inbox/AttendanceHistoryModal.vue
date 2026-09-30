<template>
  <UiModal
    :is-open="isOpen"
    max-width="max-w-2xl"
    @close="$emit('close')"
  >
    <template #header>
      <div class="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center flex-shrink-0">
        <Clock class="w-4 h-4" />
      </div>
      <div>
        <h3 class="font-bold text-sm sm:text-base text-slate-900">
          ประวัติการลงเวลาปฏิบัติราชการ
        </h3>
        <p class="text-xs text-slate-500">
          บันทึกเวลาปฏิบัติงานปกติและกรณีพิเศษย้อนหลัง
        </p>
      </div>
    </template>

      <!-- Modal Content / Table -->
      <div class="space-y-3">
        <div class="overflow-x-auto border border-slate-200 rounded-xl">
          <table class="w-full text-left text-xs border-collapse">
            <thead class="bg-slate-50/80 border-b border-slate-200/90 text-[12px] font-semibold text-slate-600 tracking-tight select-none">
              <tr>
                <th class="py-3.5 px-4">วันที่</th>
                <th class="py-3.5 px-4">เวลาเข้า - ออก</th>
                <th class="py-3.5 px-4">ประเภทการลงเวลา</th>
                <th class="py-3.5 px-4">สถานที่ / รายละเอียด</th>
                <th class="py-3.5 px-4 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr
                v-for="item in ATTENDANCE_HISTORY"
                :key="item.id"
                class="hover:bg-slate-50/60 transition-colors"
              >
                <td class="p-3 whitespace-nowrap font-medium text-slate-800">
                  <div class="flex items-center gap-1.5">
                    <Calendar class="w-3.5 h-3.5 text-slate-400" />
                    {{ item.date }}
                  </div>
                </td>
                <td class="p-3 whitespace-nowrap">
                  <div class="font-mono text-xs">
                    {{ item.checkIn }} - {{ item.checkOut }}
                  </div>
                </td>
                <td class="p-3">
                  <span class="font-medium text-slate-800">
                    {{ item.type }}
                  </span>
                </td>
                <td class="p-3 text-slate-500 text-[11px]">
                  <div class="flex items-center gap-1">
                    <MapPin class="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span class="truncate max-w-xs">{{ item.location }}</span>
                  </div>
                </td>
                <td class="p-3 text-center whitespace-nowrap">
                  <UiBadge :tone="item.status === 'approved' ? 'emerald' : 'slate'" shape="chip">
                    <CheckCircle2 class="w-3 h-3" />
                    {{ item.statusText }}
                  </UiBadge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
        <UiButton variant="outline" size="md" @click="$emit('close')">
          ปิด
        </UiButton>
      </div>
  </UiModal>
</template>

<script setup lang="ts">
import { Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-vue-next';
import { UiBadge, UiButton, UiModal } from '../ui';
import { ATTENDANCE_HISTORY } from '../../data/mockData';

defineProps<{
  isOpen: boolean;
}>();

defineEmits<{
  (e: 'close'): void;
}>();
</script>
