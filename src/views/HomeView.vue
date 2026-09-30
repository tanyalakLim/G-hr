<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 h-full flex flex-col">
    <!-- Page Title & Quick Actions Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
      <PageTitle
        title="กล่องข้อความและการแจ้งเตือน"
        subtitle="ตรวจสอบการแจ้งเตือน ติดตามสถานะคำร้อง และติดต่อประสานงานกับเจ้าหน้าที่บุคคล"
      />

      <!-- Quick Actions Buttons -->
      <div class="flex items-center gap-2 self-start sm:self-auto flex-wrap">
        <UiButton id="mark-all-read-btn" variant="outline" size="xs" @click="handleMarkAllAsRead">
          <template #icon>
            <Check class="w-3.5 h-3.5 text-slate-500" />
          </template>
          ทำเครื่องหมายว่าอ่านแล้วทั้งหมด
        </UiButton>

        <UiButton
          id="refresh-btn"
          variant="outline"
          size="xs"
          :disabled="isRefreshing"
          title="รีเฟรชข้อความ"
          @click="handleRefresh"
        >
          <template #icon>
            <RefreshCw class="w-3.5 h-3.5 text-slate-500" :class="{ 'animate-spin': isRefreshing }" />
          </template>
          รีเฟรช
        </UiButton>
      </div>
    </div>

    <!-- Two-Column Message Center Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2 items-stretch flex-1">
      <!-- Left Column: Inbox List (4 cols) -->
      <div class="lg:col-span-4">
        <InboxList
          :messages="filteredMessages"
          :selected-message-id="selectedMessageId"
          :filter="filter"
          :search-query="searchQuery"
          :total-count="messages.length"
          :unread-count="unreadCount"
          @select-message="selectMessage"
          @update:filter="(f) => (filter = f)"
          @update:search-query="(q) => (searchQuery = q)"
        />
      </div>

      <!-- Right Column: Message Content View (8 cols) -->
      <div class="lg:col-span-8">
        <MessageDetail
          :message="selectedMessage"
          @open-attendance-history="isAttendanceModalOpen = true"
          @open-reply="isReplyModalOpen = true"
          @delete-message="handleDeleteMessage"
          @archive-message="handleArchiveMessage"
        />
      </div>
    </div>

    <!-- Attendance History Modal -->
    <AttendanceHistoryModal
      :is-open="isAttendanceModalOpen"
      @close="isAttendanceModalOpen = false"
    />

    <!-- Reply Message Modal -->
    <ReplyModal
      v-if="selectedMessage"
      :is-open="isReplyModalOpen"
      :message="selectedMessage"
      @close="isReplyModalOpen = false"
      @send-reply="handleSendReply"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Check, RefreshCw } from 'lucide-vue-next';
import {
  PageTitle,
  InboxList,
  MessageDetail,
  AttendanceHistoryModal,
  ReplyModal,
} from '../components';
import { UiButton } from '../components/ui';
import { useInbox } from '../composables/useInbox';
import { useToast } from '../composables/useToast';
import type { InboxFilterType } from '../types';

const route = useRoute();
const router = useRouter();
const { messages, unreadCount, markRead, markAllAsRead, removeMessage, sendReply } = useInbox();
const { show } = useToast();

const filter = ref<InboxFilterType>('all');
const searchQuery = ref('');
const isAttendanceModalOpen = ref(false);
const isReplyModalOpen = ref(false);
const isRefreshing = ref(false);

// ข้อความที่เลือกอยู่ผูกกับ URL (?selected=<id>) — คลิกจากกระดิ่งแจ้งเตือนหน้าอื่นก็เข้าถูกข้อความ
const selectedMessageId = computed<string | null>(() => {
  const q = route.query.selected;
  const id = Array.isArray(q) ? q[0] : q;
  return id ?? '1';
});

const filteredMessages = computed(() => {
  return messages.value.filter((msg) => {
    if (filter.value === 'unread' && msg.isRead) return false;
    if (filter.value === 'system' && msg.type !== 'system') return false;

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      const matchTitle = msg.title.toLowerCase().includes(q);
      const matchContent = msg.content.toLowerCase().includes(q);
      const matchSender = msg.sender.toLowerCase().includes(q);
      const matchId = msg.details.requestId.toLowerCase().includes(q);
      return matchTitle || matchContent || matchSender || matchId;
    }
    return true;
  });
});

const selectedMessage = computed(() => {
  return messages.value.find((m) => m.id === selectedMessageId.value) || null;
});

// เข้าหน้ามาพร้อม ?selected= (เช่นคลิกจากกระดิ่งแจ้งเตือน) ถือว่าเปิดอ่านแล้ว
// ส่วน default '1' ตอนเข้าปกติไม่นับว่าอ่าน — คงพฤติกรรมเดิม
if (route.query.selected) {
  markRead(selectedMessageId.value ?? '');
}

watch(selectedMessageId, (id) => {
  if (id) markRead(id);
});

const selectMessage = (id: string) => {
  router.replace({ query: { selected: id } });
};

const handleMarkAllAsRead = () => {
  markAllAsRead();
  show('ทำเครื่องหมายว่าอ่านแล้วทั้งหมดเรียบร้อยแล้ว');
};

const handleRefresh = () => {
  isRefreshing.value = true;
  setTimeout(() => {
    isRefreshing.value = false;
    show('อัปเดตข้อมูลกล่องข้อความล่าสุดแล้ว');
  }, 600);
};

const handleDeleteMessage = (id: string) => {
  const nextId = removeMessage(id);
  if (selectedMessageId.value === id) {
    router.replace({ query: nextId ? { selected: nextId } : {} });
  }
  show('ลบข้อความเรียบร้อยแล้ว');
};

const handleArchiveMessage = (id: string) => {
  const nextId = removeMessage(id);
  if (selectedMessageId.value === id) {
    router.replace({ query: nextId ? { selected: nextId } : {} });
  }
  show('จัดเก็บข้อความเรียบร้อยแล้ว');
};

const handleSendReply = (messageId: string, replyText: string) => {
  sendReply(messageId, replyText);
  show('ส่งข้อความตอบกลับถึงเจ้าหน้าที่เรียบร้อยแล้ว');
};
</script>
