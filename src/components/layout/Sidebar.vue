<template>
  <div>
    <!-- Mobile Backdrop Overlay -->
    <div
      id="mobile-sidebar-backdrop"
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 transition-opacity duration-300 lg:hidden"
      :class="isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
      aria-hidden="true"
      @click="$emit('closeMobile')"
    />

    <!-- Main Sidebar -->
    <aside
      id="main-sidebar"
      data-purpose="primary-sidebar"
      class="fixed lg:static inset-y-0 left-0 transition-all duration-300 ease-in-out bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-50 select-none shadow-xl lg:shadow-[2px_0_10px_rgba(0,0,0,0.02)] h-full"
      :class="[
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        isCollapsed ? 'lg:w-[4.5rem]' : 'w-72'
      ]"
    >
      <!-- Brand Identification -->
      <div
        class="h-16 flex items-center justify-between px-4 border-b border-slate-100 bg-white transition-all duration-300 flex-shrink-0"
        :class="isCollapsed ? 'lg:justify-center lg:px-2' : ''"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-white shadow-sm flex-shrink-0 overflow-hidden">
            <img
              :src="logoUrl"
              alt="โลโก้ระบบ G-HR"
              class="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div v-if="!isCollapsed" class="flex flex-col min-w-0">
            <div class="font-bold text-slate-800 text-base leading-tight tracking-tight truncate">
              ระบบบริหารทรัพยากรบุคคล
            </div>
            <div class="text-[13px] text-slate-400 font-normal leading-tight truncate">
              ของหน่วยงานภาครัฐ
            </div>
          </div>
        </div>

        <!-- Mobile Close Button -->
        <button
          id="mobile-close-sidebar-btn"
          class="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          title="ปิดเมนู"
          type="button"
          @click="$emit('closeMobile')"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation Menu Items -->
      <nav class="flex-1 overflow-y-auto px-2 sm:px-3 py-4 space-y-1 text-[14px] font-700 overflow-x-hidden">
        <template v-for="item in menuItems" :key="item.id">
          
          <!-- Case 1: Accordion / Nested Menu (เมนูที่มี Submenu) -->
          <div v-if="item.subItems && item.subItems.length > 0" class="relative group/accordion space-y-1">
            <button
              :id="`sidebar-nav-${item.id}`"
              type="button"
              class="w-full sidebar-item flex items-center rounded-lg transition-all text-left cursor-pointer"
              :class="[
                isCollapsed ? 'lg:justify-center lg:px-2 py-2.5' : 'justify-between px-3 py-2.5',
                activeMenu === item.id
                  ? 'text-blue-900 font-semibold bg-blue-50/70 border-l-2 border-blue-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-2 border-transparent'
              ]"
              :title="isCollapsed ? item.label : undefined"
              @click="handleAccordionClick(item.id)"
            >
              <div class="flex items-center gap-3" :class="isCollapsed ? 'justify-center' : 'min-w-0'">
                <component
                  :is="item.icon"
                  class="w-[18px] h-[18px] flex-shrink-0 transition-colors"
                  :class="activeMenu === item.id ? 'text-blue-900' : 'text-slate-400 group-hover/accordion:text-slate-600'"
                />
                <span v-if="!isCollapsed" class="truncate">{{ item.label }}</span>
              </div>

              <template v-if="!isCollapsed">
                <ChevronUp v-if="openAccordions[item.id]" class="w-3.5 h-3.5 text-blue-900 sidebar-chevron flex-shrink-0" />
                <ChevronDown v-else class="w-3.5 h-3.5 text-slate-400 sidebar-chevron flex-shrink-0" />
              </template>
            </button>

            <!-- Expanded Submenu Level 1 (โหมด Sidebar ขยายเต็ม) -->
            <div
              v-if="!isCollapsed && openAccordions[item.id]"
              class="sidebar-submenu pl-8 pr-1 space-y-1 py-1 border-l-2 border-blue-100 ml-4 my-0.5"
            >
              <template v-for="sub in item.subItems" :key="sub.id">
                
                <!-- Submenu Level 1 ที่มี Level 2 ซ้อนอยู่ (เช่น "ตัวชี้วัด") -->
                <div v-if="sub.subItems && sub.subItems.length > 0" class="space-y-1">
                  <button
                    type="button"
                    class="w-full flex items-center justify-between px-2.5 py-1.5 text-[13px] rounded-md transition-colors text-left cursor-pointer"
                    :class="
                      activeSubmenu === sub.id
                        ? 'font-semibold text-blue-900'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    "
                    @click.stop="handleSubAccordionClick(item.id, sub)"
                  >
                    <span class="truncate">{{ sub.label }}</span>
                    <ChevronUp v-if="openAccordions[sub.id]" class="w-3 h-3 text-blue-900 flex-shrink-0" />
                    <ChevronDown v-else class="w-3 h-3 text-slate-400 flex-shrink-0" />
                  </button>

                  <!-- Expanded Submenu Level 2 (เช่น "ตามแผน", "ตามตำแหน่ง", "งานอื่นๆ ที่ได้รับมอบหมาย") -->
                  <div
                    v-if="openAccordions[sub.id]"
                    class="pl-3.5 space-y-1 py-1 border-l border-slate-200 ml-3"
                  >
                    <button
                      v-for="child in sub.subItems"
                      :key="child.id"
                      type="button"
                      class="w-full flex items-center justify-between px-2.5 py-1.5 text-[12px] rounded-md transition-colors text-left cursor-pointer"
                      :class="[
                        activeNestedSubmenu === child.id
                          ? 'font-bold text-blue-900 bg-blue-100/80 border-l-2 border-blue-900'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                      ]"
                      @click.stop="handleNestedSubmenuClick(item.id, sub.id, child.id)"
                    >
                      <span class="truncate">{{ child.label }}</span>
                      <span
                        v-if="activeNestedSubmenu === child.id"
                        class="w-1.5 h-1.5 rounded-full bg-blue-900 flex-shrink-0"
                      />
                    </button>
                  </div>
                </div>

                <!-- Submenu Level 1 ทั่วไป (เช่น "ข้าราชการ กทม. สามัญ", "สมรรถนะ", "ยุทธศาสตร์") -->
                <button
                  v-else
                  type="button"
                  class="w-full flex items-center justify-between px-2.5 py-1.5 text-[13px] rounded-md transition-colors text-left cursor-pointer"
                  :class="
                    activeMenu === item.id && activeSubmenu === sub.id && !activeNestedSubmenu
                      ? 'font-semibold text-blue-900 bg-blue-50/90 border-l-2 border-blue-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  "
                  @click.stop="handleSubmenuClick(item.id, sub.id)"
                >
                  <span class="truncate">{{ sub.label }}</span>
                  <span
                    v-if="activeMenu === item.id && activeSubmenu === sub.id && !activeNestedSubmenu"
                    class="w-1.5 h-1.5 rounded-full bg-blue-900 flex-shrink-0"
                  />
                </button>
              </template>
            </div>

            <!-- Flyout Popover Dropdown (โหมด Sidebar พับเก็บ - Collapsed) -->
            <div
              v-if="isCollapsed"
              class="hidden lg:group-hover/accordion:block absolute left-full top-0 ml-2 w-60 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-[80vh] overflow-y-auto"
            >
              <div class="px-3 py-1.5 border-b border-slate-100 text-[13px] font-bold text-slate-800">
                {{ item.label }}
              </div>
              <div class="px-1 pt-1 space-y-1">
                <template v-for="sub in item.subItems" :key="sub.id">
                  
                  <div v-if="sub.subItems && sub.subItems.length > 0" class="space-y-0.5">
                    <div class="px-2.5 py-1 text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                      {{ sub.label }}
                    </div>
                    <button
                      v-for="child in sub.subItems"
                      :key="child.id"
                      type="button"
                      class="w-full flex items-center justify-between pl-4 pr-2.5 py-1.5 text-[13px] rounded-md transition-colors text-left cursor-pointer"
                      :class="
                        activeNestedSubmenu === child.id
                          ? 'font-bold text-blue-900 bg-blue-100/80 border-l-2 border-blue-900'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      "
                      @click.stop="handleNestedSubmenuClick(item.id, sub.id, child.id)"
                    >
                      <span class="truncate">{{ child.label }}</span>
                      <span
                        v-if="activeNestedSubmenu === child.id"
                        class="w-1.5 h-1.5 rounded-full bg-blue-900 flex-shrink-0"
                      />
                    </button>
                  </div>

                  <button
                    v-else
                    type="button"
                    class="w-full flex items-center justify-between px-2.5 py-1.5 text-[13px] rounded-md transition-colors text-left cursor-pointer"
                    :class="
                      activeMenu === item.id && activeSubmenu === sub.id && !activeNestedSubmenu
                        ? 'font-semibold text-blue-900 bg-blue-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    "
                    @click.stop="handleSubmenuClick(item.id, sub.id)"
                  >
                    <span class="truncate">{{ sub.label }}</span>
                    <span
                      v-if="activeMenu === item.id && activeSubmenu === sub.id && !activeNestedSubmenu"
                      class="w-1.5 h-1.5 rounded-full bg-blue-900 flex-shrink-0"
                    />
                  </button>
                </template>
              </div>
            </div>
          </div>

          <!-- Case 2: Normal Menu Item (เมนูชั้นเดียวปกติ) -->
          <button
            v-else
            :id="`sidebar-nav-${item.id}`"
            type="button"
            class="w-full sidebar-item flex items-center rounded-lg transition-all group text-left cursor-pointer"
            :class="[
              isCollapsed ? 'lg:justify-center lg:px-2 py-2.5' : 'justify-between px-3 py-2.5',
              activeMenu === item.id
                ? 'text-blue-900 font-semibold bg-blue-50/70 border-l-2 border-blue-900'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-2 border-transparent'
            ]"
            :title="isCollapsed ? item.label : undefined"
            @click="handleMenuClick(item.id)"
          >
            <div class="flex items-center gap-3" :class="isCollapsed ? 'justify-center' : 'min-w-0'">
              <component
                :is="item.icon"
                class="w-[18px] h-[18px] flex-shrink-0 transition-colors"
                :class="activeMenu === item.id ? 'text-blue-900' : 'text-slate-400 group-hover:text-slate-600'"
              />
              <span v-if="!isCollapsed" class="truncate">{{ item.label }}</span>
            </div>

            <span
              v-if="!isCollapsed && activeMenu === item.id && !item.hasArrow"
              class="w-1.5 h-1.5 rounded-full bg-blue-900 flex-shrink-0"
            />
            <ChevronDown
              v-if="!isCollapsed && item.hasArrow"
              class="w-4 h-4 text-slate-400 flex-shrink-0"
            />
          </button>
        </template>
      </nav>

      <!-- Sidebar Footer -->
      <div
        class="p-3 border-t border-slate-100 bg-slate-50/70 text-center flex-shrink-0"
        :class="isCollapsed ? 'lg:p-2' : ''"
      >
        <div class="flex items-center justify-center gap-2 text-[12px] text-slate-500 font-medium">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <span v-if="!isCollapsed" class="whitespace-nowrap">ระบบออนไลน์ (v2.5.4)</span>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChevronDown, ChevronUp, X } from 'lucide-vue-next';

import logoUrl from '../../assets/logo.png';
import { menuItems, pathForMenu, pathForNested, pathForSubmenu, type SubMenuItem } from '../../router/menu';

const props = defineProps<{
  isCollapsed: boolean;
  isMobileOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'closeMobile'): void;
}>();

const route = useRoute();
const router = useRouter();

// สถานะ active อ่านจาก route โดยตรง (ชื่อเดียวกับที่ template อ้างอิงอยู่แล้ว)
// category = หมวดทะเบียน, subId/nestedId = submenu ของหมวด placeholder แบบ accordion
const activeMenu = computed(() => route.meta.menu ?? '');
const activeSubmenu = computed(
  () =>
    (route.params.category as string) ||
    (route.params.subId as string) ||
    (route.meta.submenu as string) ||
    ''
);
const activeNestedSubmenu = computed(
  () => (route.meta.nestedSubmenu as string) || (route.params.nestedId as string) || ''
);

const openAccordions = reactive<Record<string, boolean>>({
  records: false,
  retired_records: false,
  evaluations: false,
  indicators: false,
});

// --- Helper Functions สำหรับพับเก็บ Accordion ที่ไม่ใช้งาน ---

const closeOtherAccordions = (currentMenuId?: string) => {
  menuItems.forEach((item) => {
    if (item.isAccordion && item.id !== currentMenuId) {
      openAccordions[item.id] = false;
    }
  });
};

const closeOtherSubAccordions = (currentSubId?: string) => {
  menuItems.forEach((item) => {
    item.subItems?.forEach((sub) => {
      if (sub.subItems && sub.id !== currentSubId) {
        openAccordions[sub.id] = false;
      }
    });
  });
};

// --- Action Handlers ---

const handleAccordionClick = (menuId: string) => {
  const willOpen = !openAccordions[menuId];

  if (willOpen) {
    closeOtherAccordions(menuId);
    openAccordions[menuId] = true;

    // เลือกเมนูย่อยแรกสุดให้อัตโนมัติเมื่อกดเปิดเมนูหลัก
    const targetMenu = menuItems.find((m) => m.id === menuId);
    if (targetMenu && targetMenu.subItems && targetMenu.subItems.length > 0) {
      const firstSub = targetMenu.subItems[0];
      if (firstSub.subItems && firstSub.subItems.length > 0) {
        openAccordions[firstSub.id] = true;
        router.push(pathForNested(menuId, firstSub.id, firstSub.subItems[0].id));
      } else {
        router.push(pathForSubmenu(menuId, firstSub.id));
      }
    } else if (targetMenu) {
      router.push(pathForMenu(menuId));
    }
  } else {
    // ปิด accordion — ไม่ navigate คงหน้าปัจจุบันไว้
    openAccordions[menuId] = false;
  }
};

const handleSubAccordionClick = (menuId: string, sub: SubMenuItem) => {
  const willOpen = !openAccordions[sub.id];

  if (willOpen) {
    closeOtherSubAccordions(sub.id);
    openAccordions[sub.id] = true;

    // Active เมนูย่อยแรกสุดทันทีเมื่อสั่งเปิด Expanded Submenu
    if (sub.subItems && sub.subItems.length > 0) {
      router.push(pathForNested(menuId, sub.id, sub.subItems[0].id));
    }
  } else {
    openAccordions[sub.id] = false;
  }
};

const handleSubmenuClick = (menuId: string, subId: string) => {
  router.push(pathForSubmenu(menuId, subId));
  emit('closeMobile');

  closeOtherAccordions(menuId);
};

const handleNestedSubmenuClick = (menuId: string, subId: string, nestedSubId: string) => {
  router.push(pathForNested(menuId, subId, nestedSubId));
  emit('closeMobile');

  closeOtherAccordions(menuId);
  closeOtherSubAccordions(subId);
};

const handleMenuClick = (menuId: string) => {
  router.push(pathForMenu(menuId));
  emit('closeMobile');

  closeOtherAccordions();
};

// deep link / refresh — กาง accordion ของเมนูที่ active ให้อัตโนมัติ
watch(
  () => route.meta.menu,
  (menuId) => {
    const targetMenu = menuItems.find((m) => m.id === menuId);
    if (menuId && targetMenu?.isAccordion) {
      closeOtherAccordions(menuId);
      openAccordions[menuId] = true;
      const subId =
        (route.params.category as string) ||
        (route.params.subId as string) ||
        (route.meta.submenu as string) ||
        '';
      const sub = targetMenu.subItems?.find((s) => s.id === subId);
      if (sub?.subItems?.length) {
        closeOtherSubAccordions(sub.id);
        openAccordions[sub.id] = true;
      }
    }
  },
  { immediate: true }
);
</script>