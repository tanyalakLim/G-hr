<template>
  <div class="flex flex-col min-h-full w-full">
    <UserPageActionBar
      back-label="ย้อนกลับ"
      badge="การแจ้งเตือน"
      :subtitle="`กล่องข้อความ · ${unreadCount} ยังไม่อ่าน`"
      @back="router.back()"
    >
      <template #actions>
        <UiButton variant="outline" size="sm" :disabled="unreadCount === 0" @click="markAllAsRead()">
          <template #icon><CheckCheck class="w-4 h-4" /></template>
          อ่านทั้งหมดแล้ว
        </UiButton>
      </template>
    </UserPageActionBar>

    <main class="p-4 sm:p-6 lg:px-20 lg:py-8 max-w-8xl mx-auto w-full space-y-5">
      <UiCard padding="none">
        <!-- แถบเครื่องมือ: ตัวกรอง + ค้นหา -->
        <div class="px-4 sm:px-5 py-3 border-b border-slate-100">
          <UiToolbar>
            <template #start>
              <UiSelect v-model="filter" :options="filterOptions" size="md" fit />
              <UiSearchInput v-model="searchQuery" placeholder="ค้นหาข้อความ..." size="md" class="w-full sm:w-64" />
            </template>
          </UiToolbar>
        </div>

        <!-- รายการแจ้งเตือน -->
        <div class="divide-y divide-slate-100">
          <button
            v-for="msg in filteredMessages"
            :key="msg.id"
            type="button"
            class="w-full text-left px-4 sm:px-5 py-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-slate-50"
            :class="!msg.isRead ? 'bg-blue-50/40' : ''"
            @click.stop="openMessage(msg.id)"
          >
            <span class="w-2 h-2 rounded-full mt-2 shrink-0" :class="!msg.isRead ? 'bg-blue-700' : 'bg-slate-300'" />
            <span class="min-w-0 flex-1">
              <span class="flex items-center justify-between gap-2">
                <span class="text-xs font-bold truncate" :class="!msg.isRead ? 'text-slate-900' : 'text-slate-600'">{{ msg.title }}</span>
                <span class="text-[10px] text-slate-400 whitespace-nowrap shrink-0">{{ msg.date }} · {{ msg.time }}</span>
              </span>
              <span class="block text-[11px] text-slate-500 mt-0.5 line-clamp-1">{{ msg.content }}</span>
              <span class="flex items-center gap-2 mt-1.5">
                <span class="text-[10px] text-slate-400">{{ msg.sender }} · {{ msg.senderRole }}</span>
                <span
                  class="inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold"
                  :class="statusTone(msg.status)"
                >{{ msg.statusLabel }}</span>
              </span>
            </span>
          </button>

          <div v-if="!filteredMessages.length" class="py-16 text-center">
            <BellOff class="w-8 h-8 text-slate-200 mx-auto" />
            <p class="text-xs text-slate-400 mt-2">ไม่พบข้อความ</p>
          </div>
        </div>
      </UiCard>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { BellOff, CheckCheck } from 'lucide-vue-next';
import UserPageActionBar from '../components/user/UserPageActionBar.vue';
import { UiButton, UiCard, UiSearchInput, UiSelect, UiToolbar } from '../components/ui';
import { useInbox } from '../composables/useInbox';

const router = useRouter();
const { messages, unreadCount, markRead, markAllAsRead } = useInbox();

const filter = ref<'all' | 'unread' | 'read'>('all');
const searchQuery = ref('');

const filterOptions = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'unread', label: 'ยังไม่อ่าน' },
  { value: 'read', label: 'อ่านแล้ว' },
];

const statusTone = (status: string) =>
  status === 'approved' ? 'bg-emerald-50 text-emerald-700'
    : status === 'rejected' ? 'bg-red-50 text-red-600'
    : 'bg-amber-50 text-amber-600';

const filteredMessages = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  return messages.value
    .filter((m) => {
      if (filter.value === 'unread' && m.isRead) return false;
      if (filter.value === 'read' && !m.isRead) return false;
      if (q && ![m.title, m.content, m.sender].some((v) => v.toLowerCase().includes(q))) return false;
      return true;
    });
});

const openMessage = (id: string) => {
  markRead(id);
};
</script>
