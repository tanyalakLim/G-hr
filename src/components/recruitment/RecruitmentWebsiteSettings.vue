<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4">
    <div class="pb-1">
      <PageTitle
        title="ตั้งค่าเว็บสรรหา"
        subtitle="จัดการและแก้ไขข้อมูลทั่วไปที่แสดงบนเว็บไซต์ระบบสรรหาบุคลากร"
      />
    </div>

    <!-- 1. ส่วนรูปภาพ (โลโก้และแบนเนอร์) -->
    <section class="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      <SectionHeader icon="image" title="ส่วนรูปภาพ" subtitle="โลโก้เว็บไซต์และแบนเนอร์หน้าหลัก" />
      <div class="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- โลโก้ -->
        <div class="space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <div>
              <h4 class="text-sm font-semibold text-slate-800">โลโก้เว็บไซต์</h4>
              <p class="text-[11px] text-slate-500">แสดงบนส่วนหัวของเว็บไซต์ • แนะนำ PNG/SVG ไม่เกิน 2 MB</p>
            </div>
            <button
              v-if="logoFiles.length"
              type="button"
              class="text-[11px] font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg px-2 py-1 transition-colors cursor-pointer shrink-0"
              title="ยกเลิกรูปที่เลือก"
              @click="logoFiles = []"
            >
              ยกเลิกรูป
            </button>
          </div>
          <label
            class="block relative rounded-xl border-2 border-dashed overflow-hidden cursor-pointer group transition-colors"
            :class="dragOverLogo ? 'border-blue-500 bg-blue-50/60' : 'border-slate-300 bg-slate-50/50 hover:border-blue-400'"
            @dragover.prevent="dragOverLogo = true"
            @dragleave.prevent="dragOverLogo = false"
            @drop.prevent="onDropImage($event, 'logo')"
          >
            <div class="h-40 flex items-center justify-center">
              <img v-if="logoPreview" :src="logoPreview" alt="โลโก้เว็บไซต์" class="max-h-full max-w-full object-contain p-3" />
              <span v-else class="text-4xl font-black tracking-tight">
                <span class="text-bma-600">G</span><span class="text-slate-300">-Hr</span>
              </span>
            </div>
            <div
              class="absolute inset-0 bg-slate-900/55 flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera class="w-5 h-5 text-white" />
              <span class="text-xs font-medium text-white">{{ logoFiles.length ? 'เปลี่ยนรูปโลโก้' : 'อัปโหลดโลโก้' }}</span>
            </div>
            <input type="file" class="hidden" accept="image/*" @change="onPickImage($event, 'logo')" />
          </label>
          <p v-if="logoFiles.length" class="text-[11px] text-emerald-600 flex items-center gap-1">
            <CheckCircle2 class="w-3.5 h-3.5 shrink-0" />
            <span class="truncate">{{ logoFiles[0].name }} ({{ formatSize(logoFiles[0].size) }}) — พร้อมบันทึก</span>
          </p>
          <p v-else class="text-[11px] text-slate-400">คลิกเพื่อเลือกรูป หรือลากไฟล์มาวางบนพื้นที่นี้</p>
        </div>

        <!-- แบนเนอร์ -->
        <div class="space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <div>
              <h4 class="text-sm font-semibold text-slate-800">แบนเนอร์หน้าหลัก</h4>
              <p class="text-[11px] text-slate-500">ภาพประชาสัมพันธ์ส่วนบนสุด • แนะนำ 1920×600 px ไม่เกิน 5 MB</p>
            </div>
            <button
              v-if="bannerFiles.length"
              type="button"
              class="text-[11px] font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg px-2 py-1 transition-colors cursor-pointer shrink-0"
              title="ยกเลิกรูปที่เลือก"
              @click="bannerFiles = []"
            >
              ยกเลิกรูป
            </button>
          </div>
          <label
            class="block relative rounded-xl border-2 border-dashed overflow-hidden cursor-pointer group transition-colors"
            :class="dragOverBanner ? 'border-blue-500 bg-blue-50/60' : 'border-slate-300 bg-slate-50/50 hover:border-blue-400'"
            @dragover.prevent="dragOverBanner = true"
            @dragleave.prevent="dragOverBanner = false"
            @drop.prevent="onDropImage($event, 'banner')"
          >
            <div class="h-40 flex items-center justify-center">
              <img v-if="bannerPreview" :src="bannerPreview" alt="แบนเนอร์หน้าหลัก" class="w-full h-full object-cover" />
              <div v-else class="flex flex-col items-center gap-1.5 text-slate-300">
                <Image class="w-8 h-8" />
                <span class="text-xs text-slate-400">ยังไม่ได้เลือกแบนเนอร์</span>
              </div>
            </div>
            <div
              class="absolute inset-0 bg-slate-900/55 flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera class="w-5 h-5 text-white" />
              <span class="text-xs font-medium text-white">{{ bannerFiles.length ? 'เปลี่ยนแบนเนอร์' : 'อัปโหลดแบนเนอร์' }}</span>
            </div>
            <input type="file" class="hidden" accept="image/*" @change="onPickImage($event, 'banner')" />
          </label>
          <p v-if="bannerFiles.length" class="text-[11px] text-emerald-600 flex items-center gap-1">
            <CheckCircle2 class="w-3.5 h-3.5 shrink-0" />
            <span class="truncate">{{ bannerFiles[0].name }} ({{ formatSize(bannerFiles[0].size) }}) — พร้อมบันทึก</span>
          </p>
          <p v-else class="text-[11px] text-slate-400">คลิกเพื่อเลือกรูป หรือลากไฟล์มาวางบนพื้นที่นี้</p>
        </div>
      </div>
      <div class="px-4 sm:px-6 py-3.5 border-t border-slate-100 bg-slate-50/60 flex justify-end">
        <UiButton :disabled="!hasNewImages" :title="hasNewImages ? '' : 'ยังไม่ได้เลือกรูปภาพใหม่'" @click="saveImages">
          <template #icon><Save class="w-4 h-4" /></template>
          บันทึกรูปภาพ
        </UiButton>
      </div>
    </section>

    <!-- 2. รายละเอียดเว็บ -->
    <section class="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div class="px-4 sm:px-6 py-3.5 border-b border-slate-100 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-blue-50 text-bma-700 flex items-center justify-center shrink-0">
            <Globe class="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-900">รายละเอียดเว็บ</h3>
            <p class="text-[11px] text-slate-500">ชื่อเว็บไซต์และข้อมูลโดยย่อที่แสดงบนเว็บไซต์สรรหา</p>
          </div>
        </div>
        <UiIconButton v-if="!editingDetails" tone="outline" title="แก้ไขรายละเอียดเว็บ" @click="startEditDetails">
          <Pencil class="w-4 h-4 text-bma-700" />
        </UiIconButton>
        <div v-else class="flex items-center gap-1.5">
          <UiButton size="xs" @click="saveDetails">บันทึก</UiButton>
          <UiButton variant="outline" size="xs" @click="cancelEditDetails">ยกเลิก</UiButton>
        </div>
      </div>

      <div class="p-4 sm:p-6">
        <dl v-if="!editingDetails" class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <DetailItem label="ชื่อเว็บภาษาไทย" :value="details.nameTh" />
          <DetailItem label="ชื่อเว็บภาษาอังกฤษ" :value="details.nameEn" />
          <DetailItem label="ผู้จัดโดย" :value="details.author" />
          <DetailItem label="ข้อมูลเว็บโดยย่อ" :value="details.summary" />
        </dl>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <label class="space-y-1.5 block">
            <span class="text-xs font-medium text-slate-600">ชื่อเว็บภาษาไทย</span>
            <UiInput id="detail-name-th" v-model="draftDetails.nameTh" />
          </label>
          <label class="space-y-1.5 block">
            <span class="text-xs font-medium text-slate-600">ชื่อเว็บภาษาอังกฤษ</span>
            <UiInput id="detail-name-en" v-model="draftDetails.nameEn" />
          </label>
          <label class="space-y-1.5 block">
            <span class="text-xs font-medium text-slate-600">ผู้จัดโดย</span>
            <UiInput id="detail-author" v-model="draftDetails.author" />
          </label>
          <label class="space-y-1.5 block">
            <span class="text-xs font-medium text-slate-600">ข้อมูลเว็บโดยย่อ</span>
            <UiInput id="detail-summary" v-model="draftDetails.summary" />
          </label>
        </div>
      </div>
    </section>

    <!-- 3. ข้อมูลเกี่ยวกับเรา -->
    <section class="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div class="flex items-center justify-between gap-3 border-b border-slate-100 px-4 sm:px-6 py-3.5">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-blue-50 text-bma-700 flex items-center justify-center shrink-0">
            <Info class="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-900">ข้อมูลเกี่ยวกับเรา</h3>
            <p class="text-[11px] text-slate-500">รายละเอียดองค์กร/หน่วยงาน ที่อยู่และช่องทางติดต่อที่แสดงบนเว็บไซต์</p>
          </div>
        </div>
        <UiIconButton v-if="!editingAbout" tone="outline" title="แก้ไขข้อมูลเกี่ยวกับเรา" @click="startEditAbout">
          <Pencil class="w-4 h-4 text-bma-700" />
        </UiIconButton>
        <div v-else class="flex items-center gap-1.5">
          <UiButton size="xs" @click="saveAbout">บันทึก</UiButton>
          <UiButton variant="outline" size="xs" @click="cancelEditAbout">ยกเลิก</UiButton>
        </div>
      </div>

      <!-- โหมดอ่านอย่างเดียว -->
      <div v-if="!editingAbout" class="p-4 sm:p-6 space-y-4">
        <div
          class="prose prose-sm max-w-none text-sm text-slate-800 leading-relaxed"
          v-html="savedAbout.content"
        ></div>
        <div class="space-y-3">
          <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wide">ที่อยู่และสถานที่ติดต่อ</h4>
          <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            <DetailItem label="ที่อยู่" :value="savedAbout.form.address" />
            <DetailItem label="จังหวัด" :value="savedAbout.form.province" />
            <DetailItem label="เขต / อำเภอ" :value="savedAbout.form.district" />
            <DetailItem label="แขวง / ตำบล" :value="savedAbout.form.subdistrict" />
            <DetailItem label="รหัสไปรษณีย์" :value="savedAbout.form.zip" />
            <DetailItem label="เบอร์โทร" :value="savedAbout.form.phone" />
          </dl>
        </div>
      </div>

      <!-- โหมดแก้ไข -->
      <div v-else class="p-4 sm:p-6 space-y-4">
        <!-- 3.1 Text Editor -->
        <UiTextEditor id="about-editor" v-model="aboutContent" printable />

        <!-- 3.3 ที่อยู่และสถานที่ติดต่อ -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wide">ที่อยู่และสถานที่ติดต่อ</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
            <UiInput
              id="about-address"
              v-model="aboutForm.address"
              label="ที่อยู่"
              placeholder="บ้านเลขที่ อาคาร ซอย ถนน"
            />
            <UiSelect
              id="about-province"
              v-model="aboutForm.province"
              :options="provinceOptions"
              label="จังหวัด"
              placeholder="เลือกจังหวัด"
            />
            <UiSelect
              id="about-district"
              v-model="aboutForm.district"
              :options="districtOptions"
              label="เขต / อำเภอ"
              placeholder="เลือกเขต/อำเภอ"
            />
            <UiSelect
              id="about-subdistrict"
              v-model="aboutForm.subdistrict"
              :options="subdistrictOptions"
              label="แขวง / ตำบล"
              placeholder="เลือกแขวง/ตำบล"
            />
            <UiInput
              id="about-zip"
              v-model="aboutForm.zip"
              label="รหัสไปรษณีย์"
              maxlength="5"
              placeholder="50200"
            />
            <UiInput
              id="about-phone"
              v-model="aboutForm.phone"
              label="เบอร์โทร"
              type="tel"
              placeholder="0212345678"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 4. ส่วนราชการ / หน่วยงาน -->
    <section class="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      <SectionHeader icon="building" title="ส่วนราชการ / หน่วยงาน" subtitle="จัดการรายชื่อส่วนราชการและหน่วยงานที่เกี่ยวข้องพร้อมลิงก์เว็บไซต์" />
      <div class="p-4 sm:p-6">
        <div class="relative">
          <!-- เมนูเลือกคอลัมน์ -->
          <div
            v-if="columnMenuOpen"
            class="absolute right-0 top-12 z-20 w-52 rounded-xl border border-slate-200 bg-white shadow-lg p-3 space-y-2"
          >
            <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">แสดงคอลัมน์</p>
            <label
              v-for="col in togglableColumns"
              :key="col.key"
              class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                class="rounded border-slate-300 text-blue-700 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                :checked="!hiddenCols.includes(col.key)"
                @change="toggleColumn(col.key)"
              />
              {{ col.label }}
            </label>
          </div>

          <AppTable
            :columns="visibleAgencyColumns"
            :data="filteredAgencies"
            row-key="id"
            searchable
            v-model:search-query="agencySearch"
            search-placeholder="ค้นหารายชื่อ..."
            show-column-button
            column-button-text="คอลัมน์"
            @column-click="columnMenuOpen = !columnMenuOpen"
          >
          <template #toolbar-left>
            <UiButton title="เพิ่มส่วนราชการ/หน่วยงานใหม่" @click="openAgencyModal()">
              <template #icon><Plus class="w-4 h-4" /></template>
              เพิ่มรายการ
            </UiButton>
          </template>
          <template #cell-name="{ row }">
            <span class="font-medium text-slate-800">{{ row.name }}</span>
          </template>
          <template #cell-type="{ row }">
            <UiBadge tone="blue" shape="chip">{{ typeLabel(row.type) }}</UiBadge>
          </template>
          <template #cell-url="{ row }">
            <a
              :href="row.url"
              target="_blank"
              rel="noopener"
              class="text-blue-700 hover:underline break-all"
            >{{ row.url }}</a>
          </template>
          <template #cell-actions="{ row }">
            <UiIconButton tone="ghost" title="แก้ไขรายการ" @click="openAgencyModal(row)">
              <Pencil class="w-4 h-4 text-sky-600" />
            </UiIconButton>
          </template>
        </AppTable>
        </div>
      </div>
    </section>

    <!-- Modal เพิ่ม/แก้ไข ส่วนราชการ -->
    <UiModal
      :is-open="agencyModalOpen"
      :title="editingAgency ? 'แก้ไขส่วนราชการ / หน่วยงาน' : 'เพิ่มส่วนราชการ / หน่วยงาน'"
      subtitle="ระบุชื่อหน่วยงานและลิงก์เว็บไซต์ที่จะเชื่อมโยง"
      @close="closeAgencyModal"
    >
      <div class="space-y-4">
        <label class="space-y-1.5 block">
          <span class="text-xs font-medium text-slate-600">ชื่อส่วนราชการ / หน่วยงาน <span class="text-red-500">*</span></span>
          <UiInput id="agency-name" v-model="agencyForm.name" placeholder="เช่น สำนักงานกองสรรหา" />
        </label>
        <label class="space-y-1.5 block">
          <span class="text-xs font-medium text-slate-600">ประเภท <span class="text-red-500">*</span></span>
          <UiSelect
            id="agency-type"
            v-model="agencyForm.type"
            :options="agencyTypeOptions"
            placeholder="เลือกประเภท"
          />
        </label>
        <label class="space-y-1.5 block">
          <span class="text-xs font-medium text-slate-600">ลิงก์เว็บไซต์ <span class="text-red-500">*</span></span>
          <UiInput id="agency-url" v-model="agencyForm.url" placeholder="https://example.go.th" />
        </label>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton variant="outline" @click="closeAgencyModal">ยกเลิก</UiButton>
          <UiButton @click="saveAgency">บันทึก</UiButton>
        </div>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineComponent, h, type Component } from 'vue';
import {
  Building2,
  Camera,
  CheckCircle2,
  Globe,
  Image as ImageIcon,
  Info,
  Pencil,
  Plus,
  Save,
} from 'lucide-vue-next';
import { PageTitle } from '../common';
import { AppTable, UiBadge, UiButton, UiIconButton, UiInput, UiModal, UiSelect, UiTextEditor } from '../ui';
import { useToast } from '../../composables/useToast';

const { show } = useToast();

// --- SectionHeader: หัวข้อมาตรฐานของแต่ละส่วน (icon + title + subtitle)
const ICONS: Record<string, Component> = { image: ImageIcon, info: Info, building: Building2 };
const SectionHeader = defineComponent({
  props: {
    icon: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
  },
  setup(props) {
    return () =>
      h('div', { class: 'px-4 sm:px-6 py-3.5 border-b border-slate-100 flex items-center gap-3' }, [
        h(
          'div',
          { class: 'w-9 h-9 rounded-xl bg-blue-50 text-bma-700 flex items-center justify-center shrink-0' },
          [h(ICONS[props.icon] ?? ImageIcon, { class: 'w-4.5 h-4.5' })]
        ),
        h('div', {}, [
          h('h3', { class: 'text-sm font-bold text-slate-900' }, props.title),
          props.subtitle ? h('p', { class: 'text-[11px] text-slate-500' }, props.subtitle) : null,
        ]),
      ]);
  },
});

const DetailItem = defineComponent({
  props: { label: String, value: String },
  setup(props) {
    return () =>
      h('div', {}, [
        h('dt', { class: 'text-[11px] font-medium text-slate-500 mb-0.5' }, props.label),
        h('dd', { class: 'text-sm text-slate-800' }, props.value || '-'),
      ]);
  },
});

// --- 1. รูปภาพ (โลโก้ / แบนเนอร์) — คลิก/ลากวางบนพรีวิวโดยตรง
const logoFiles = ref<File[]>([]);
const bannerFiles = ref<File[]>([]);
const dragOverLogo = ref(false);
const dragOverBanner = ref(false);

const toPreview = (files: File[]) => (files.length ? URL.createObjectURL(files[0]) : '');
const logoPreview = computed(() => toPreview(logoFiles.value));
const bannerPreview = computed(() => toPreview(bannerFiles.value));
const hasNewImages = computed(() => logoFiles.value.length > 0 || bannerFiles.value.length > 0);

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const acceptImage = (files: File[], fallback: 'logo' | 'banner') => {
  const file = files.find((f) => f.type.startsWith('image/'));
  if (!file) {
    show('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
    return;
  }
  const maxBytes = fallback === 'logo' ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
  if (file.size > maxBytes) {
    show(`ไฟล์ใหญ่เกิน ${formatSize(maxBytes)} — กรุณาเลือกไฟล์ที่เล็กกว่า`);
    return;
  }
  if (fallback === 'logo') logoFiles.value = [file];
  else bannerFiles.value = [file];
};

const onPickImage = (event: Event, target: 'logo' | 'banner') => {
  const input = event.target as HTMLInputElement;
  acceptImage(Array.from(input.files ?? []), target);
  input.value = '';
};

const onDropImage = (event: DragEvent, target: 'logo' | 'banner') => {
  if (target === 'logo') dragOverLogo.value = false;
  else dragOverBanner.value = false;
  acceptImage(Array.from(event.dataTransfer?.files ?? []), target);
};

const saveImages = () => {
  const parts = [logoFiles.value.length ? 'โลโก้' : '', bannerFiles.value.length ? 'แบนเนอร์' : ''].filter(Boolean);
  show(`บันทึก${parts.join('และ')}เรียบร้อยแล้ว`);
  logoFiles.value = [];
  bannerFiles.value = [];
};

// --- 2. รายละเอียดเว็บ
const details = ref({
  nameTh: 'สรรหาบุคลากร',
  nameEn: 'Recruit',
  author: 'HRM',
  summary: 'เว็บไซต์สำหรับประกาศการสรรหาบุคลากร',
});
const editingDetails = ref(false);
const draftDetails = ref({ ...details.value });

const startEditDetails = () => {
  draftDetails.value = { ...details.value };
  editingDetails.value = true;
};
const saveDetails = () => {
  details.value = { ...draftDetails.value };
  editingDetails.value = false;
  show('บันทึกรายละเอียดเว็บเรียบร้อยแล้ว');
};
const cancelEditDetails = () => {
  editingDetails.value = false;
};

// --- 3. ข้อมูลเกี่ยวกับเรา (UiTextEditor + ที่อยู่/ติดต่อ)
const editingAbout = ref(false);
const aboutContent = ref('');

// ที่อยู่: dropdown จังหวัด → เขต/อำเภอ → แขวง/ตำบล (mock)
interface AboutForm {
  address: string;
  province: string;
  district: string;
  subdistrict: string;
  zip: string;
  phone: string;
}

const defaultAbout: () => { content: string; form: AboutForm } = () => ({
  content:
    '<p>กองสรรหาบุคลากรเพื่อเข้ารับการบรรจุเข้ารับราชการ</p>',
  form: {
    address: '59/451',
    province: 'เชียงใหม่',
    district: 'เมืองเชียงใหม่',
    subdistrict: 'ศรีภูมิ',
    zip: '50200',
    phone: '0212345678',
  },
});

const savedAbout = ref(defaultAbout());
const aboutForm = ref<AboutForm>({ ...savedAbout.value.form });

const startEditAbout = () => {
  aboutForm.value = { ...savedAbout.value.form };
  aboutContent.value = savedAbout.value.content;
  editingAbout.value = true;
};

const cancelEditAbout = () => {
  editingAbout.value = false;
};

const LOCATION_DATA: Record<string, Record<string, string[]>> = {
  'กรุงเทพมหานคร': {
    'พระนคร': ['พระบรมมหาราชวัง', 'วังบูรณภาชน์'],
    'ปทุมวัน': ['วังใหม่', 'ลุมพินี'],
    'ห้วยขวาง': ['ห้วยขวาง', 'สามเสนใน'],
  },
  เชียงใหม่: {
    เมืองเชียงใหม่: ['ศรีภูมิ', 'พระสิงห์', 'ช้างม่อย'],
    สันทราย: ['สันทรายหลวง', 'หนอนห่าง'],
  },
  ลำปาง: {
    เมืองลำปาง: ['พระบาท', 'สบตุ๋ย'],
    ห้างฉัตร: ['ห้างฉัตร', 'บุญเรือง'],
  },
};

const provinceOptions = Object.keys(LOCATION_DATA).map((p) => ({ value: p, label: p }));
const districtOptions = computed(() =>
  Object.keys(LOCATION_DATA[aboutForm.value.province] ?? {}).map((d) => ({ value: d, label: d }))
);
const subdistrictOptions = computed(() =>
  (LOCATION_DATA[aboutForm.value.province]?.[aboutForm.value.district] ?? []).map((s) => ({
    value: s,
    label: s,
  }))
);
watch(
  () => aboutForm.value.province,
  () => {
    aboutForm.value.district = '';
    aboutForm.value.subdistrict = '';
  }
);
watch(
  () => aboutForm.value.district,
  () => {
    aboutForm.value.subdistrict = '';
  }
);

const saveAbout = () => {
  savedAbout.value = {
    content: aboutContent.value,
    form: { ...aboutForm.value },
  };
  editingAbout.value = false;
  show('บันทึกข้อมูลเกี่ยวกับเราเรียบร้อยแล้ว');
};
// --- 4. ส่วนราชการ / หน่วยงาน
interface Agency {
  id: number;
  name: string;
  type: 'government' | 'organization';
  url: string;
  createdAt: string;
  updatedAt: string;
}

const now = () => new Date().toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' });

let agencyUid = 3;
const agencies = ref<Agency[]>([
  { id: 1, name: 'สำนักงานกองสรรหา', type: 'government', url: 'https://recruit.bma.go.th', createdAt: now(), updatedAt: now() },
  { id: 2, name: 'G-Hr', type: 'organization', url: 'https://g-hr.bma.go.th', createdAt: now(), updatedAt: now() },
]);

const agencyTypeOptions = [
  { value: 'government', label: 'ส่วนราชการ' },
  { value: 'organization', label: 'หน่วยงาน' },
];
const typeLabel = (type: string) =>
  agencyTypeOptions.find((o) => o.value === type)?.label ?? '-';

const agencyColumns = [
  { key: 'name', label: 'ชื่อส่วนราชการ / หน่วยงาน' },
  { key: 'type', label: 'ประเภท', width: '130px' },
  { key: 'url', label: 'ลิงก์เว็บไซต์' },
  { key: 'createdAt', label: 'วันที่สร้าง', width: '130px' },
  { key: 'updatedAt', label: 'วันที่แก้ไขล่าสุด', width: '150px' },
  { key: 'actions', label: 'จัดการ', align: 'center' as const, width: '90px' },
];

// ค้นหา + เลือกคอลัมน์ที่แสดง
const agencySearch = ref('');
const columnMenuOpen = ref(false);
const hiddenCols = ref<string[]>([]);
const togglableColumns = agencyColumns.filter((c) => c.key !== 'actions');

const visibleAgencyColumns = computed(() =>
  agencyColumns.map((c) => ({ ...c, hidden: hiddenCols.value.includes(c.key) }))
);

const toggleColumn = (key: string) => {
  hiddenCols.value = hiddenCols.value.includes(key)
    ? hiddenCols.value.filter((k) => k !== key)
    : [...hiddenCols.value, key];
};

const filteredAgencies = computed(() => {
  const q = agencySearch.value.trim().toLowerCase();
  if (!q) return agencies.value;
  return agencies.value.filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      a.url.toLowerCase().includes(q) ||
      typeLabel(a.type).toLowerCase().includes(q)
  );
});

const agencyModalOpen = ref(false);
const editingAgency = ref<Agency | null>(null);
const agencyForm = ref<{ name: string; type: string; url: string }>({ name: '', type: '', url: '' });

const openAgencyModal = (agency?: Agency) => {
  editingAgency.value = agency ?? null;
  agencyForm.value = agency
    ? { name: agency.name, type: agency.type, url: agency.url }
    : { name: '', type: '', url: '' };
  agencyModalOpen.value = true;
};

const closeAgencyModal = () => {
  agencyModalOpen.value = false;
  editingAgency.value = null;
};

const saveAgency = () => {
  const name = agencyForm.value.name.trim();
  const url = agencyForm.value.url.trim();
  const type = agencyForm.value.type as Agency['type'];
  if (!name || !url || !type) {
    show('กรุณากรอกชื่อ ประเภท และลิงก์เว็บไซต์ให้ครบถ้วน');
    return;
  }
  if (editingAgency.value) {
    const target = agencies.value.find((a) => a.id === editingAgency.value!.id);
    if (target) {
      target.name = name;
      target.type = type;
      target.url = url;
      target.updatedAt = now();
    }
    show(`แก้ไข "${name}" เรียบร้อยแล้ว`);
  } else {
    agencies.value.push({ id: agencyUid++, name, type, url, createdAt: now(), updatedAt: now() });
    show(`เพิ่ม "${name}" เรียบร้อยแล้ว`);
  }
  closeAgencyModal();
};
</script>
