<template>
   <!-- Page Title -->
    <PageActionBar
      back-label="รายการคำสั่ง"
      badge="แบบร่าง"
      :subtitle="`เลขที่คำสั่ง: ${order.orderNo}`"
      @back="router.push('/orders')"
    >
      <template #actions>
        <UiButton variant="outline" size="xs" class="font-semibold shadow-2xs">
          <template #icon>
            <Printer class="w-3.5 h-3.5 text-slate-500" />
          </template>
          พิมพ์คำสั่ง
        </UiButton>
      </template>
    </PageActionBar>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4">

    <!-- สถานะของคำสั่ง: แถบความคืบหน้า -->
    <div class="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      <div class="h-1.5 bg-[#003380]" />
      <div class="p-4 sm:p-5">
        <div class="text-[11px] font-medium text-slate-400 mb-3">
          สถานะของคำสั่ง: <strong class="text-slate-900">{{ orderStatusSteps[currentStep].label }}</strong>
        </div>
        <ol class="flex items-center">
          <li
            v-for="(step, i) in orderStatusSteps"
            :key="step.id"
            class="flex items-center"
            :class="i < orderStatusSteps.length - 1 ? 'flex-1' : ''"
          >
            <div class="flex items-center gap-2 flex-shrink-0">
              <div
                class="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border transition-colors"
                :class="
                  i < currentStep
                    ? 'bg-blue-900 border-blue-900 text-white'
                    : i === currentStep
                      ? 'bg-blue-50 border-blue-900 text-blue-900 ring-4 ring-blue-100'
                      : 'bg-white border-slate-200 text-slate-400'
                "
              >
                <Check v-if="i < currentStep" class="w-3.5 h-3.5" />
                <span v-else>{{ i + 1 }}</span>
              </div>
              <span
                class="text-[11px] sm:text-xs whitespace-nowrap"
                :class="i <= currentStep ? 'font-bold text-slate-900' : 'font-medium text-slate-400'"
              >
                {{ step.label }}
              </span>
            </div>
            <div
              v-if="i < orderStatusSteps.length - 1"
              class="flex-1 h-0.5 mx-2 sm:mx-3 rounded-full"
              :class="i < currentStep ? 'bg-blue-900' : 'bg-slate-200'"
            />
          </li>
        </ol>
      </div>
    </div>

    <!-- การ์ดหลัก: เมนูซ้าย + เนื้อหาขวา -->
    <div
      class="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col lg:flex-row items-stretch min-w-0"
    >
      <!-- เมนูด้านซ้าย 5 แท็บ -->
      <UiSideNav v-model="activeSection" :items="sections" />

      <!-- เนื้อหาด้านขวา -->
      <div class="flex-1 min-w-0 bg-white flex flex-col">
        <!-- Header -->
        <div class="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3 bg-white">
          <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center flex-shrink-0 border border-blue-100">
            <component :is="currentSectionIcon" class="w-4 h-4" />
          </div>
          <div class="flex-1 min-w-0">
          <h2 class="font-bold text-sm sm:text-base text-slate-900">
            {{ currentSectionLabel }}
          </h2>
           <p class="text-xs text-slate-500">
            {{ currentSectionDescription }}
          </p>
          </div>
          
        </div>

        <!-- 1. วิธีการลงนาม -->
        <div v-if="activeSection === 'signature'" class="p-4 sm:p-6 flex-1 flex flex-col">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5" :class="readonly ? 'pointer-events-none' : ''">
            <!-- เซ็นสด -->
            <button
              type="button"
              class="text-left border rounded-xl p-4 transition-all cursor-pointer space-y-2.5"
              :class="
                signingMethod === 'wet'
                  ? 'border-blue-900 ring-2 ring-blue-100 bg-blue-50/40'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              "
              @click="signingMethod = 'wet'"
            >
              <div class="flex items-center justify-between">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center border"
                  :class="signingMethod === 'wet' ? 'bg-blue-900 border-blue-900 text-white' : 'bg-slate-50 border-slate-200 text-slate-500'">
                  <PenLine class="w-4 h-4" />
                </div>
                <div
                  class="w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center"
                  :class="signingMethod === 'wet' ? 'border-blue-900' : 'border-slate-300'"
                >
                  <div v-if="signingMethod === 'wet'" class="w-2 h-2 rounded-full bg-blue-900" />
                </div>
              </div>
              <div>
                <div class="text-xs font-bold text-slate-900">เซ็นสด</div>
                <p class="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  ดาวน์โหลดเอกสารเป็นไฟล์ Word หรือ PDF นำไปปริ้นท์เพื่อเสนอผู้มีอำนาจลงนาม
                  จากนั้นสแกนเอกสารที่เซ็นแล้วและอัปโหลดกลับเข้าสู่ระบบ
                </p>
              </div>
            </button>

            <!-- Digital Signature -->
            <button
              type="button"
              class="text-left border rounded-xl p-4 transition-all cursor-pointer space-y-2.5"
              :class="
                signingMethod === 'digital'
                  ? 'border-blue-900 ring-2 ring-blue-100 bg-blue-50/40'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              "
              @click="signingMethod = 'digital'"
            >
              <div class="flex items-center justify-between">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center border"
                  :class="signingMethod === 'digital' ? 'bg-blue-900 border-blue-900 text-white' : 'bg-slate-50 border-slate-200 text-slate-500'">
                  <FileSignature class="w-4 h-4" />
                </div>
                <div
                  class="w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center"
                  :class="signingMethod === 'digital' ? 'border-blue-900' : 'border-slate-300'"
                >
                  <div v-if="signingMethod === 'digital'" class="w-2 h-2 rounded-full bg-blue-900" />
                </div>
              </div>
              <div>
                <div class="text-xs font-bold text-slate-900">Digital Signature</div>
                <p class="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  เสนอให้ผู้มีอำนาจลงนามด้วยกระบวนการลายมือชื่อดิจิทัลภายในระบบ
                  โดยไม่ต้องพิมพ์เอกสารและสแกนกลับ
                </p>
              </div>
            </button>
          </div>

          <!-- การยืนยัน -->
          <div class="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
            <template v-if="!readonly">
              <UiButton
                id="btn-confirm-signing-method"
                size="md"
                @click="handleConfirmSigningMethod"
              >
                <template #icon>
                  <Check class="w-4 h-4" />
                </template>
                ยืนยันวิธีการลงนาม
              </UiButton>
              <span class="text-[11px] text-rose-600 font-medium">
                *เมื่อยืนยันวิธีลงนามแล้วจะไม่สามารถเปลี่ยนวิธีการได้
              </span>
            </template>
            <span v-else class="text-[11px] text-slate-500">
              วิธีการลงนาม: <strong class="text-slate-900">{{ signingMethod === 'wet' ? 'เซ็นสด' : 'Digital Signature' }}</strong>
            </span>
          </div>
        </div>

        <!-- 2. รายละเอียดคำสั่ง (component แยก) -->
        <OrderDetailTab v-else-if="activeSection === 'detail'" :readonly="readonly" />

        <!-- 3. รายชื่อผู้ได้รับคำสั่ง (component แยก) -->
        <OrderRecipientsTab v-else-if="activeSection === 'recipients'" :readonly="readonly" />

        <!-- 4. รายชื่อผู้ได้รับสำเนาคำสั่ง (component แยก) -->
        <OrderCCTab v-else-if="activeSection === 'cc'" :readonly="readonly" />

        <!-- 5. พรีวิวคำสั่ง (component แยก) -->
        <OrderPreviewTab v-else-if="activeSection === 'preview'" />

        <!-- แท็บอื่นๆ (ยังไม่เปิดใช้งาน) -->
        <div v-else class="p-4 sm:p-6 flex-1">
          <UiEmptyState :message="`ส่วนของ${currentSectionLabel} อยู่ระหว่างการพัฒนา`" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  Check,
  FileSignature,
  FileText,
  PenLine,
  Printer,
  ScrollText,
  Users,
} from 'lucide-vue-next';
import { PageActionBar } from '../ui';
import { UiButton, UiEmptyState, UiSideNav, type UiSideNavItem } from '../ui';
import OrderDetailTab from './OrderDetailTab.vue';
import OrderRecipientsTab from './OrderRecipientsTab.vue';
import OrderCCTab from './OrderCCTab.vue';
import OrderPreviewTab from './OrderPreviewTab.vue';
import { useToast } from '../../composables/useToast';

const { show } = useToast();

const router = useRouter();

const props = withDefaults(
  defineProps<{
    readonly?: boolean;
  }>(),
  {
    readonly: false,
  }
);

const readonly = computed(() => props.readonly);

const order = {
  orderNo: 'สนพ. 25/9 สั่งรายชื่อผู้สอบแข่งขันได้ในโครงการ/2569',
  status: 'draft',
};

// --- สถานะของคำสั่ง (แถบความคืบหน้า): ปัจจุบันอยู่ขั้นที่ 1 = แบบร่าง
const orderStatusSteps = [
  { id: 'draft', label: 'แบบร่าง' },
  { id: 'pending_approve', label: 'รอผู้มีอำนาจลงนามอนุมัติ' },
  { id: 'pending_issue', label: 'รอออกคำสั่ง' },
  { id: 'done', label: 'ออกคำสั่งเสร็จสิ้น' },
];
const currentStep = ref(0);

// --- เมนูด้านซ้าย 5 แท็บ
const sections: UiSideNavItem[] = [
  { id: 'signature', label: 'วิธีการลงนาม', icon: PenLine },
  { id: 'detail', label: 'รายละเอียดคำสั่ง', icon: FileText },
  { id: 'recipients', label: 'รายชื่อผู้ได้รับคำสั่ง', icon: Users },
  { id: 'cc', label: 'รายชื่อผู้ได้รับสำเนาคำสั่ง', icon: ScrollText },
  { id: 'preview', label: 'พรีวิวคำสั่ง', icon: FileSignature },
];

const activeSection = ref('signature');

const currentSectionLabel = computed(
  () => sections.find((s) => s.id === activeSection.value)?.label ?? ''
);
const currentSectionIcon = computed(
  () => sections.find((s) => s.id === activeSection.value)?.icon
);

const sectionDescriptions: Record<string, string> = {
  signature: 'เลือกรูปแบบการเซ็นอนุมัติเอกสารคำสั่ง',
  detail: 'ตรวจสอบและแก้ไขรายละเอียดของคำสั่ง เช่น เลขที่คำสั่ง วันที่ และเนื้อหา',
  recipients: 'จัดการรายชื่อผู้ที่อยู่ในความครอบคลุมของคำสั่งนี้',
  cc: 'ระบุรายชื่อหน่วยงานหรือบุคคลที่ได้รับสำเนาคำสั่ง',
  preview: 'ตรวจสอบเอกสารคำสั่งฉบับสมบูรณ์ก่อนยื่นเสนอลงนาม',
};

const currentSectionDescription = computed(
  () => sectionDescriptions[activeSection.value] ?? ''
);

// --- วิธีการลงนาม
const signingMethod = ref<'wet' | 'digital'>('wet');

const handleConfirmSigningMethod = () => {
  show(
    signingMethod.value === 'wet'
      ? 'ยืนยันวิธีการลงนาม: เซ็นสด เรียบร้อยแล้ว'
      : 'ยืนยันวิธีการลงนาม: Digital Signature เรียบร้อยแล้ว'
  );
};
</script>
