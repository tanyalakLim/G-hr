import { computed, ref } from 'vue';
import { INITIAL_MESSAGES } from '../data/mockData';
import type { MessageItem } from '../types';

// กล่องข้อความ (module-scoped singleton) — ใช้ร่วมกันระหว่าง Header (กระดิ่งแจ้งเตือน)
// และ HomeView เพื่อให้สถานะอ่าน/ยังไม่อ่านตรงกันทั้งระบบ
const messages = ref<MessageItem[]>(
  INITIAL_MESSAGES.map((m) => ({
    ...m,
    details: { ...m.details },
    replies: m.replies?.map((r) => ({ ...r })),
  }))
);

const unreadCount = computed(() => messages.value.filter((m) => !m.isRead).length);

const markRead = (id: string) => {
  const target = messages.value.find((m) => m.id === id);
  if (target) {
    target.isRead = true;
  }
};

const markAllAsRead = () => {
  messages.value.forEach((m) => {
    m.isRead = true;
  });
};

// ลบ/จัดเก็บใช้ logic เดียวกัน — คืน id ข้อความแรกที่เหลือ (ไว้เลือกแทน) หรือ null ถ้าไม่เหลือ
const removeMessage = (id: string): string | null => {
  messages.value = messages.value.filter((m) => m.id !== id);
  return messages.value.length > 0 ? messages.value[0].id : null;
};

const sendReply = (messageId: string, replyText: string) => {
  const target = messages.value.find((m) => m.id === messageId);
  if (!target) return;
  if (!target.replies) target.replies = [];
  target.replies.push({
    id: `rep-${Date.now()}`,
    sender: 'สมชาย ใจดี',
    senderRole: 'เจ้าหน้าที่บุคลากร',
    timestamp: 'วันนี้ เมื่อสักครู่',
    content: replyText,
    isCurrentUser: true,
  });
};

export function useInbox() {
  return { messages, unreadCount, markRead, markAllAsRead, removeMessage, sendReply };
}
