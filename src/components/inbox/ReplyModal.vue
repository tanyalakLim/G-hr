<template>
  <UiModal :is-open="isOpen" @close="$emit('close')">
    <template #header>
      <div class="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-medium flex-shrink-0">
        <Send class="w-4 h-4" />
      </div>
      <div>
        <h3 class="font-bold text-sm text-slate-900">
          ตอบกลับ: {{ message.title }}
        </h3>
        <p class="text-[11px] text-slate-500">
          ส่งข้อความประสานงานถึง: {{ message.sender }} ({{ message.senderRole }})
        </p>
      </div>
    </template>

    <!-- Body Form -->
    <form class="space-y-3.5" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">
            ข้อความตอบกลับ
          </label>
          <textarea
            id="reply-modal-textarea"
            v-model="replyText"
            rows="4"
            placeholder="พิมพ์ข้อความที่ต้องการติดต่อหรือสอบถามเจ้าหน้าที่บุคคล..."
            class="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-800 placeholder-slate-400 resize-none"
            autofocus
          />
        </div>

        <!-- Quick reply templates -->
        <div>
          <span class="text-[10px] text-slate-400 font-medium block mb-1.5">
            ข้อความด่วน:
          </span>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="(text, idx) in quickReplies"
              :key="idx"
              type="button"
              class="px-2 py-1 text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-900 text-slate-600 rounded-lg transition-colors text-left cursor-pointer"
              @click="replyText = text"
            >
              {{ text }}
            </button>
          </div>
        </div>

        <!-- Attach file notice -->
        <div class="flex items-center gap-2 text-xs text-slate-500 pt-1">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors cursor-pointer"
          >
            <Paperclip class="w-3.5 h-3.5 text-slate-400" />
            <span>แนบไฟล์เอกสารคำสั่ง</span>
          </button>
          <span class="text-[10px] text-slate-400">(PDF, PNG, JPG ขนาดไม่เกิน 5MB)</span>
        </div>

        <!-- Footer buttons -->
        <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <UiButton variant="ghost" size="xs" @click="$emit('close')">
            ยกเลิก
          </UiButton>
          <UiButton type="submit" size="xs" :disabled="!replyText.trim()">
            <template #icon>
              <Send class="w-3.5 h-3.5" />
            </template>
            ส่งข้อความ
          </UiButton>
        </div>
      </form>
  </UiModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Send, Paperclip } from 'lucide-vue-next';
import { UiButton, UiModal } from '../ui';
import type { MessageItem } from '../../types';

const props = defineProps<{
  isOpen: boolean;
  message: MessageItem;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'sendReply', messageId: string, replyText: string): void;
}>();

const replyText = ref('');

const quickReplies = [
  'รับทราบและขอขอบคุณครับ',
  'ส่งเอกสารหลักฐานเพิ่มเติมให้ทางอีเมลแล้วครับ',
  'ขอสอบถามรายละเอียดขั้นตอนต่อไปครับ',
];

const handleSubmit = () => {
  if (!replyText.value.trim()) return;
  emit('sendReply', props.message.id, replyText.value);
  replyText.value = '';
  emit('close');
};
</script>
