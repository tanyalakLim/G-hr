<template>
  <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-full">
    <!-- Inbox Card Header -->
    <div class="p-3.5 sm:p-4 border-b border-slate-100 bg-slate-50/40">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-blue-900/10 text-blue-900 flex items-center justify-center font-semibold text-xs">
            <Inbox class="w-3.5 h-3.5" />
          </div>
          <h2 class="text-sm font-bold text-slate-800">กล่องข้อความ</h2>
        </div>
        <UiBadge tone="slate">{{ messages.length }} รายการ</UiBadge>
      </div>

      <!-- Search input -->
      <div class="mt-2.5 relative">
        <input
          id="inbox-search-input"
          :value="searchQuery"
          class="w-full pl-8 pr-7 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          placeholder="ค้นหาข้อความ..."
          type="text"
          @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        />
        <Search class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
        <button
          v-if="searchQuery"
          class="absolute right-2 top-2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
          title="ล้างคำค้นหา"
          type="button"
          @click="$emit('update:searchQuery', '')"
        >
          <X class="w-3 h-3" />
        </button>
      </div>

      <!-- Filter tags -->
      <div class="flex items-center gap-1 mt-2.5 overflow-x-auto pb-0.5">
        <button
          id="filter-all-btn"
          type="button"
          class="px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
          :class="
            filter === 'all'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-200/70'
          "
          @click="$emit('update:filter', 'all')"
        >
          ทั้งหมด ({{ totalCount }})
        </button>
        <button
          id="filter-unread-btn"
          type="button"
          class="px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer whitespace-nowrap"
          :class="
            filter === 'unread'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-200/70'
          "
          @click="$emit('update:filter', 'unread')"
        >
          ยังไม่อ่าน ({{ unreadCount }})
        </button>
        <button
          id="filter-system-btn"
          type="button"
          class="px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer whitespace-nowrap"
          :class="
            filter === 'system'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-200/70'
          "
          @click="$emit('update:filter', 'system')"
        >
          แจ้งเตือนระบบ
        </button>
      </div>
    </div>

    <!-- Message Items List -->
    <div class="divide-y divide-slate-100/90 overflow-y-auto max-h-[640px] flex-1">
      <UiEmptyState
        v-if="messages.length === 0"
        message="ไม่พบข้อความที่ค้นหา"
        :icon="Inbox"
        class="p-8"
      />

      <div
        v-for="item in messages"
        :key="item.id"
        :id="`message-item-${item.id}`"
        class="p-3 transition-all cursor-pointer relative group"
        :class="[
          selectedMessageId === item.id
            ? 'bg-blue-50/70 border-l-4 border-l-blue-900'
            : 'hover:bg-slate-50/90 border-l-4 border-l-transparent'
        ]"
        @click="$emit('selectMessage', item.id)"
      >
        <!-- Header row: Sender tag & Timestamp -->
        <div class="flex items-start justify-between gap-1.5">
          <span
            class="inline-flex items-center gap-1 text-[10px] rounded px-1.5 py-0.5"
            :class="
              selectedMessageId === item.id
                ? 'font-semibold text-blue-900 bg-white border border-blue-200/80 shadow-2xs'
                : 'font-medium text-slate-600 bg-slate-100'
            "
          >
            <span
              class="w-1.5 h-1.5 rounded-full"
              :class="item.type === 'system' ? 'bg-amber-500' : 'bg-emerald-500'"
            />
            {{ item.sender }}
          </span>
          <span
            class="text-[10px] whitespace-nowrap"
            :class="selectedMessageId === item.id ? 'text-slate-500 font-medium' : 'text-slate-400'"
          >
            {{ item.timestamp }}
          </span>
        </div>

        <!-- Subject and Indicators -->
        <div
          class="text-xs mt-1.5 flex items-center justify-between"
          :class="[
            selectedMessageId === item.id
              ? 'font-semibold text-slate-900'
              : !item.isRead
              ? 'font-bold text-slate-900'
              : 'font-medium text-slate-800 group-hover:text-blue-900'
          ]"
        >
          <span class="truncate">{{ item.title }}</span>
          <div class="flex items-center gap-1.5 flex-shrink-0 ml-1.5">
            <span
              v-if="!item.isRead"
              class="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"
              title="ยังไม่ได้อ่าน"
            />
            <span
              v-if="selectedMessageId === item.id"
              class="w-1.5 h-1.5 rounded-full bg-blue-700 flex-shrink-0"
              title="เลือกอยู่"
            />
          </div>
        </div>

        <!-- Preview text -->
        <p class="text-[11px] text-slate-500 mt-0.5 line-clamp-1 leading-relaxed">
          {{ item.snippet }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Inbox, Search, X } from 'lucide-vue-next';
import { UiBadge, UiEmptyState } from '../ui';
import type { MessageItem, InboxFilterType } from '../../types';

defineProps<{
  messages: MessageItem[];
  selectedMessageId: string | null;
  filter: InboxFilterType;
  searchQuery: string;
  totalCount: number;
  unreadCount: number;
}>();

defineEmits<{
  (e: 'selectMessage', id: string): void;
  (e: 'update:filter', filter: InboxFilterType): void;
  (e: 'update:searchQuery', query: string): void;
}>();
</script>
