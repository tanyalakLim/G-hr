<template>
  <UiModal
    :is-open="isOpen"
    max-width="max-w-3xl"
    title="เพิ่มโครงสร้าง"
    subtitle="สร้างโครงสร้างหน่วยงานใหม่ หรือคัดลอกจากโครงสร้างเดิม"
    @close="handleClose"
  >
    <template #icon>
      <Building2 class="w-5 h-5 text-blue-900" />
    </template>

    <!-- Body Form -->
    <form id="add-structure-form" class="space-y-5" @submit.prevent="handleSubmit">
      <!-- ชื่อโครงสร้าง -->
      <div>
        <label for="structure-name-input" class="block text-xs font-semibold text-slate-700 mb-1.5">
          ชื่อโครงสร้าง <span class="text-red-500">*</span>
        </label>
        <input
          id="structure-name-input"
          v-model="name"
          type="text"
          placeholder="เช่น โครงสร้างอัตรากำลัง ประจำปีงบประมาณ 2568"
          class="w-full text-sm px-3.5 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-800 placeholder-slate-400"
        />
      </div>

      <!-- หมายเหตุ -->
      <div>
        <label for="structure-note-textarea" class="block text-xs font-semibold text-slate-700 mb-1.5">
          หมายเหตุ
        </label>
        <textarea
          id="structure-note-textarea"
          v-model="note"
          rows="3"
          placeholder="ระบุรายละเอียดเพิ่มเติม หรือเหตุผลความจำเป็นในการปรับปรุง/จัดทำโครงสร้างใหม่"
          class="w-full text-sm p-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-800 placeholder-slate-400 resize-y"
        />
      </div>

      <!-- เลือกทำสำเนาจากโครงสร้างปัจจุบัน -->
      <div>
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-2.5">
          <div class="min-w-0">
            <h4 class="text-sm font-bold text-slate-800">เลือกทำสำเนา</h4>
            <p class="text-[11px] text-slate-400 mt-0.5">
              เลือกข้อมูลจากโครงสร้างปัจจุบันที่ต้องการคัดลอกไปยังโครงสร้างใหม่ (อย่างน้อย 1 ส่วน)
            </p>
          </div>
          <button
            type="button"
            class="self-start sm:self-auto px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-semibold hover:bg-blue-100 transition-colors cursor-pointer flex-shrink-0"
            title="เลือกคัดลอกทุกส่วนจากโครงสร้างปัจจุบัน"
            @click="selectAllSections"
          >
            คัดลอกจากโครงสร้างปัจจุบัน
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            v-for="section in sections"
            :key="section.key"
            type="button"
            class="flex items-start gap-3 p-3.5 rounded-xl border text-left transition-colors cursor-pointer"
            :class="selected[section.key] ? 'border-blue-200 bg-blue-50/40' : 'border-slate-200 bg-white hover:border-slate-300'"
            @click="toggleSection(section.key)"
          >
            <span
              class="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
              :class="selected[section.key] ? 'bg-blue-900 border-blue-900' : 'border-slate-300 bg-white'"
            >
              <Check v-if="selected[section.key]" class="w-3.5 h-3.5 text-white" />
            </span>
            <span class="min-w-0">
              <span class="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                <component :is="section.icon" class="w-4 h-4 text-slate-400 flex-shrink-0" />
                {{ section.label }}
              </span>
              <span class="block text-[11px] text-slate-400 mt-1 leading-relaxed">{{ section.desc }}</span>
            </span>
          </button>
        </div>
      </div>

    </form>

    <!-- Footer -->
    <template #footer>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p class="text-[11px] text-slate-400">
          <span class="text-red-400">*</span> สามารถแก้ไขเพิ่มเติมในภายหลังได้ที่เมนูแบบร่าง
        </p>
        <div class="flex items-center justify-end gap-2 flex-shrink-0">
          <UiButton variant="outline" @click="handleClose">
            ยกเลิก
          </UiButton>
          <UiButton type="submit" form="add-structure-form" :disabled="!canSave">
            <template #icon>
              <Save class="w-4 h-4" />
            </template>
            บันทึก
          </UiButton>
        </div>
      </div>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { Building2, Check, IdCard, Network, Save, ShieldCheck, UserCheck } from 'lucide-vue-next';
import { UiButton, UiModal } from '../../ui';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', payload: { name: string; note: string; sections: Record<SectionKey, boolean> }): void;
}>();

const sections = [
  { key: 'structure', label: 'โครงสร้าง', desc: 'ผังการบังคับบัญชา และหน่วยงานในสังกัด', icon: Network },
  { key: 'positions', label: 'ตำแหน่ง', desc: 'กรอบอัตรากำลังและเลขที่ตำแหน่งทั้งหมด', icon: IdCard },
  { key: 'holders', label: 'คนครอง', desc: 'ข้าราชการและบุคลากรที่ครองตำแหน่งในปัจจุบัน', icon: UserCheck },
  { key: 'permissions', label: 'สิทธิ์', desc: 'สิทธิ์การเข้าถึงและการจัดการในระบบ', icon: ShieldCheck },
] as const;

type SectionKey = (typeof sections)[number]['key'];

const defaultSelected = (): Record<SectionKey, boolean> => ({
  structure: true,
  positions: true,
  holders: false,
  permissions: false,
});

const name = ref('');
const note = ref('');
const selected = reactive<Record<SectionKey, boolean>>(defaultSelected());

const canSave = computed(() => name.value.trim() !== '' && Object.values(selected).some(Boolean));

// เปิด modal ใหม่ทุกครั้ง -> เริ่มจากฟอร์มว่าง (ค่าเริ่มต้นเลือกโครงสร้าง + ตำแหน่ง)
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      name.value = '';
      note.value = '';
      Object.assign(selected, defaultSelected());
    }
  }
);

const toggleSection = (key: SectionKey) => {
  selected[key] = !selected[key];
};

const selectAllSections = () => {
  (Object.keys(selected) as SectionKey[]).forEach((key) => {
    selected[key] = true;
  });
};

const handleSubmit = () => {
  if (!canSave.value) return;
  emit('save', { name: name.value.trim(), note: note.value.trim(), sections: { ...selected } });
};

const handleClose = () => emit('close');
</script>
