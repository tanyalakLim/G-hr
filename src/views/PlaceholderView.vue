<template>
  <div class="p-8 max-w-4xl mx-auto space-y-4">
    <div class="p-6 bg-white border border-slate-200 rounded-xl shadow-xs text-center space-y-3">
      <AlertCircle class="w-10 h-10 text-blue-900 mx-auto" />
      <h3 class="text-base font-bold text-slate-800">
        กำลังอยู่ในหมวดหมู่: {{ categoryLabel }}
      </h3>
      <p class="text-xs text-slate-500">
        ท่านสามารถสลับไปยังเมนู <strong>ทะเบียนประวัติ</strong> หรือ <strong>หน้าแรก (กล่องข้อความ)</strong> จากแถบเมนูด้านข้างได้ตลอดเวลา
      </p>
      <div class="pt-2 flex justify-center gap-3">
        <UiButton size="md" class="font-semibold" @click="router.push('/records/civil_servant')">
          ไปที่ ทะเบียนประวัติ
        </UiButton>
        <UiButton
          size="md"
          variant="ghost"
          class="font-semibold bg-slate-100 hover:bg-slate-200"
          @click="router.push('/home')"
        >
          กลับไปที่ หน้าแรก
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AlertCircle } from 'lucide-vue-next';
import { UiButton } from '../components/ui';
import { MENU_LABELS } from '../router/menu';

const route = useRoute();
const router = useRouter();

// โชว์ป้ายภาษาไทยของหมวดที่ละเอียดที่สุด: nested → sub → submenu → menu → title
const categoryLabel = computed(() => {
  const nested = route.params.nestedId as string | undefined;
  if (nested && MENU_LABELS[nested]) return MENU_LABELS[nested];
  const sub = route.params.subId as string | undefined;
  if (sub && MENU_LABELS[sub]) return MENU_LABELS[sub];
  const submenu = (route.meta.submenu as string | undefined) ?? '';
  if (submenu && MENU_LABELS[submenu]) return MENU_LABELS[submenu];
  const menu = (route.meta.menu as string | undefined) ?? '';
  if (menu && MENU_LABELS[menu]) return MENU_LABELS[menu];
  return (route.meta.title as string | undefined) ?? 'หน้านี้';
});
</script>
