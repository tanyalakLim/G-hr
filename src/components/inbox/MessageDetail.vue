<template>
  <div
    v-if="!message"
    class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-8 min-h-[620px] flex flex-col items-center justify-center text-center"
  >
    <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
      <User class="w-6 h-6" />
    </div>
    <h3 class="font-semibold text-slate-700 text-sm">กรุณาเลือกข้อความ</h3>
    <p class="text-xs text-slate-400 mt-1 max-w-sm">
      เลือกรายการข้อความจากกล่องข้อความด้านซ้ายเพื่อดูรายละเอียดคำขอและการแจ้งเตือน
    </p>
  </div>

  <div
    v-else
    id="message-detail-container"
    class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-7 min-h-[620px] flex flex-col justify-between h-full"
  >
    <div>
      <!-- Message Top Action & Header Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-9 h-9 rounded-lg bg-blue-900 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <User class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="text-sm sm:text-base font-semibold text-slate-900 leading-tight">
                {{ message.title }}
              </h3>
              <UiBadge :tone="isApproved ? 'emerald' : isPending ? 'amber' : 'blue'">
                {{ message.statusLabel }}
              </UiBadge>
            </div>
            <div class="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span>จาก :</span>
              <span class="text-slate-800 font-semibold">{{ message.sender }}</span>
              <span class="text-slate-400 text-[11px] hidden md:inline">
                ({{ message.senderRole }})
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
          <span class="text-[11px] text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
            {{ message.timestamp }}
          </span>

          <!-- Top right icon button group -->
          <div class="flex items-center border border-slate-200 rounded-lg p-0.5 bg-white shadow-xs">
            <button
              id="message-action-print"
              class="p-1 text-slate-500 hover:text-blue-900 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
              title="พิมพ์ / ส่งออก"
              type="button"
              @click="handlePrint"
            >
              <Printer class="w-3.5 h-3.5" />
            </button>
            <button
              id="message-action-archive"
              class="p-1 text-slate-500 hover:text-blue-900 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
              title="จัดเก็บ"
              type="button"
              @click="$emit('archiveMessage', message.id)"
            >
              <Archive class="w-3.5 h-3.5" />
            </button>
            <button
              id="message-action-delete"
              class="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
              title="ลบข้อความ"
              type="button"
              @click="$emit('deleteMessage', message.id)"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Message Body Main Area -->
      <div class="mt-5 space-y-4">
        <!-- Status Alert Banner -->
        <div
          class="rounded-xl border p-3 flex items-start gap-3"
          :class="
            isApproved
              ? 'border-emerald-200 bg-emerald-50/60'
              : isPending
              ? 'border-amber-200 bg-amber-50/60'
              : 'border-blue-200 bg-blue-50/60'
          "
        >
          <div
            class="w-7 h-7 rounded-lg text-white flex items-center justify-center flex-shrink-0 shadow-2xs mt-0.5"
            :class="isApproved ? 'bg-emerald-600' : isPending ? 'bg-amber-600' : 'bg-blue-600'"
          >
            <Check v-if="isApproved" class="w-4 h-4" />
            <Clock v-else-if="isPending" class="w-4 h-4" />
            <AlertCircle v-else class="w-4 h-4" />
          </div>
          <div class="flex-1 min-w-0">
            <h4
              class="text-xs font-semibold"
              :class="
                isApproved
                  ? 'text-emerald-900'
                  : isPending
                  ? 'text-amber-900'
                  : 'text-blue-900'
              "
            >
              สถานะ: {{ isApproved ? 'ดำเนินการอนุมัติเรียบร้อย' : message.statusLabel }}
            </h4>
            <p
              class="text-[11px] mt-0.5"
              :class="
                isApproved
                  ? 'text-emerald-700'
                  : isPending
                  ? 'text-amber-700'
                  : 'text-blue-700'
              "
            >
              {{
                isApproved
                  ? 'บันทึกเวลาปฏิบัติงานนอกสถานที่เข้าสู่ฐานข้อมูลระบบสารสนเทศบุคคลเรียบร้อยแล้ว'
                  : isPending
                  ? 'คำขออยู่ระหว่างกระบวนการตรวจสอบคุณสมบัติและเอกสารแนบโดยผู้บังคับบัญชา'
                  : 'ระบบได้แจ้งเตือนความคืบหน้าของคำขอเรียบร้อยแล้ว'
              }}
            </p>
          </div>
        </div>

        <!-- Details Card -->
        <div class="rounded-xl border border-slate-200/80 bg-slate-50/40 p-4 sm:p-5 space-y-4 min-h-[220px]">
          <div>
            <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              เนื้อหาข้อความ
            </span>
            <p class="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed mt-1.5">
              {{ message.content }}
            </p>
          </div>

          <!-- 3-Column Metadata Grid -->
          <div class="pt-3.5 border-t border-slate-200/70 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div class="bg-white p-2.5 rounded-lg border border-slate-200/60 shadow-2xs">
              <div class="text-slate-400 text-[10px] font-normal">
                รหัสอ้างอิงคำขอ
              </div>
              <div class="font-semibold text-slate-800 text-xs mt-0.5 font-mono">
                {{ message.details.requestId }}
              </div>
            </div>

            <div class="bg-white p-2.5 rounded-lg border border-slate-200/60 shadow-2xs">
              <div class="text-slate-400 text-[10px] font-normal">
                รอบเวลาที่ขอลงเวลา
              </div>
              <div class="font-semibold text-slate-800 text-xs mt-0.5">
                {{ message.details.requestedTime }}
              </div>
            </div>

            <div class="bg-white p-2.5 rounded-lg border border-slate-200/60 shadow-2xs">
              <div class="text-slate-400 text-[10px] font-normal">
                ผู้อนุมัติคำขอ
              </div>
              <div class="font-semibold text-slate-800 text-xs mt-0.5 truncate">
                {{ message.details.approver }}
              </div>
            </div>
          </div>

          <!-- Extra remarks if present -->
          <div
            v-if="message.details.remarks"
            class="pt-2 text-[11px] text-slate-500 bg-white/70 p-2.5 rounded-lg border border-slate-200/40"
          >
            <span class="font-medium text-slate-700">หมายเหตุประกอบ:</span>
            {{ message.details.remarks }}
          </div>
        </div>

        <!-- Reply Thread History (if any) -->
        <div v-if="message.replies && message.replies.length > 0" class="space-y-2 pt-2">
          <div class="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
            <CornerDownRight class="w-3.5 h-3.5 text-slate-400" />
            <span>ประวัติการประสานงาน ({{ message.replies.length }})</span>
          </div>
          <div class="space-y-2">
            <div
              v-for="reply in message.replies"
              :key="reply.id"
              class="p-3 bg-blue-50/40 border border-blue-100 rounded-xl text-xs space-y-1"
            >
              <div class="flex items-center justify-between text-[11px]">
                <span class="font-semibold text-blue-950">
                  {{ reply.sender }} ({{ reply.senderRole }})
                </span>
                <span class="text-slate-400 text-[10px]">
                  {{ reply.timestamp }}
                </span>
              </div>
              <p class="text-slate-700">{{ reply.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Action Buttons & Status -->
    <div class="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
      <div class="flex items-center gap-1.5 text-slate-500 text-[11px]">
        <Check v-if="isApproved" class="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
        <Clock v-else class="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
        <span>
          สถานะ: {{ isApproved ? 'ดำเนินการอนุมัติเรียบร้อย' : message.statusLabel }}
        </span>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <UiButton
          id="btn-view-attendance-history"
          variant="outline"
          size="xs"
          @click="$emit('openAttendanceHistory')"
        >
          <template #icon>
            <Clock class="w-3.5 h-3.5 text-slate-500" />
          </template>
          ดูประวัติการลงเวลา
        </UiButton>

        <UiButton id="btn-reply-message" size="xs" @click="$emit('openReply')">
          <template #icon>
            <Send class="w-3.5 h-3.5" />
          </template>
          ตอบกลับข้อความ
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { UiBadge, UiButton } from '../ui';
import {
  User,
  Printer,
  Archive,
  Trash2,
  Check,
  Clock,
  Send,
  CornerDownRight,
  AlertCircle,
} from 'lucide-vue-next';
import type { MessageItem } from '../../types';

const props = defineProps<{
  message: MessageItem | null;
}>();

defineEmits<{
  (e: 'openAttendanceHistory'): void;
  (e: 'openReply'): void;
  (e: 'deleteMessage', id: string): void;
  (e: 'archiveMessage', id: string): void;
}>();

const isApproved = computed(() => props.message?.status === 'approved');
const isPending = computed(() => props.message?.status === 'pending');

const handlePrint = () => {
  window.print();
};
</script>
