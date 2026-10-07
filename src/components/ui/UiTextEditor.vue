<template>
  <div>
    <!-- Text Editor Bar -->
    <div class="flex flex-wrap items-center gap-1.5 rounded-t-xl border border-b-0 border-slate-200/90 bg-slate-50/80 px-2 py-1.5">
      <UiIconButton tone="ghost" title="เลิกทำ (Undo)" @click="execFormat('undo')">
        <Undo2 class="w-4 h-4 text-slate-600" />
      </UiIconButton>
      <UiIconButton tone="ghost" title="ทำซ้ำ (Redo)" @click="execFormat('redo')">
        <Redo2 class="w-4 h-4 text-slate-600" />
      </UiIconButton>

      <ToolbarDivider />

      <UiSelect
        id="editor-block"
        v-model="blockFormat"
        :options="blockOptions"
        size="xs"
        fit
        title="รูปแบบหัวข้อ"
        @update:model-value="applyBlockFormat"
      />
      <UiSelect
        id="editor-font"
        v-model="fontFamily"
        :options="fontOptions"
        size="xs"
        fit
        title="ฟอนต์"
        @update:model-value="applyFont"
      />

      <ToolbarDivider />

      <UiIconButton tone="ghost" title="ตัวหนา (B)" @click="execFormat('bold')">
        <Bold class="w-4 h-4 text-slate-600" />
      </UiIconButton>
      <UiIconButton tone="ghost" title="ตัวเอียง (I)" @click="execFormat('italic')">
        <Italic class="w-4 h-4 text-slate-600" />
      </UiIconButton>
      <UiIconButton tone="ghost" title="ขีดฆ่า (S)" @click="execFormat('strikeThrough')">
        <Strikethrough class="w-4 h-4 text-slate-600" />
      </UiIconButton>
      <UiIconButton tone="ghost" title="ขีดเส้นใต้ (U)" @click="execFormat('underline')">
        <Underline class="w-4 h-4 text-slate-600" />
      </UiIconButton>
      <UiIconButton tone="ghost" title="ตัวยก (Superscript)" @click="execFormat('superscript')">
        <Superscript class="w-4 h-4 text-slate-600" />
      </UiIconButton>
      <UiIconButton tone="ghost" title="ตัวห้อย (Subscript)" @click="execFormat('subscript')">
        <Subscript class="w-4 h-4 text-slate-600" />
      </UiIconButton>

      <ToolbarDivider />

      <UiIconButton tone="ghost" title="จัดชิดซ้าย" @click="execFormat('justifyLeft')">
        <AlignLeft class="w-4 h-4 text-slate-600" />
      </UiIconButton>
      <UiIconButton tone="ghost" title="จัดกึ่งกลาง" @click="execFormat('justifyCenter')">
        <AlignCenter class="w-4 h-4 text-slate-600" />
      </UiIconButton>
      <UiIconButton tone="ghost" title="จัดชิดขวา" @click="execFormat('justifyRight')">
        <AlignRight class="w-4 h-4 text-slate-600" />
      </UiIconButton>
      <UiIconButton tone="ghost" title="จัดข้อความกระจายเท่ากัน (Justify)" @click="execFormat('justifyFull')">
        <AlignJustify class="w-4 h-4 text-slate-600" />
      </UiIconButton>

      <ToolbarDivider />

      <UiIconButton tone="ghost" title="รายการแบบสัญลักษณ์" @click="execFormat('insertUnorderedList')">
        <List class="w-4 h-4 text-slate-600" />
      </UiIconButton>
      <UiIconButton tone="ghost" title="รายการแบบลำดับ" @click="execFormat('insertOrderedList')">
        <ListOrdered class="w-4 h-4 text-slate-600" />
      </UiIconButton>
      <UiIconButton tone="ghost" title="ใส่เส้นแบ่งแถว (Horizontal Line)" @click="execFormat('insertHorizontalRule')">
        <SeparatorHorizontal class="w-4 h-4 text-slate-600" />
      </UiIconButton>
      <UiIconButton tone="ghost" title="แทรกลิงก์เชื่อมโยง" @click="insertLink">
        <Link2 class="w-4 h-4 text-slate-600" />
      </UiIconButton>

      <ToolbarDivider />

      <UiIconButton tone="ghost" title="ล้างรูปแบบข้อความ" @click="execFormat('removeFormat')">
        <Eraser class="w-4 h-4 text-slate-600" />
      </UiIconButton>
      <UiIconButton v-if="printable" tone="ghost" title="พิมพ์เอกสาร" @click="printContent">
        <Printer class="w-4 h-4 text-slate-600" />
      </UiIconButton>
      <UiIconButton
        tone="ghost"
        :title="codeMode ? 'กลับไปโหมดแก้ไข' : 'ดู/แก้ไขโค้ด HTML'"
        @click="toggleCodeMode"
      >
        <Code2 class="w-4 h-4 text-slate-600" />
      </UiIconButton>
    </div>

    <!-- ช่องกรอกเนื้อหา -->
    <textarea
      v-if="codeMode"
      :id="`${id}-code`"
      v-model="codeContent"
      class="w-full rounded-b-xl border border-slate-200/90 bg-slate-900 text-slate-100 font-mono text-xs px-4 py-3 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
      :class="minHeightClass"
      spellcheck="false"
    ></textarea>
    <div
      v-else
      :id="id"
      ref="editorRef"
      class="rounded-b-xl border border-slate-200/90 bg-white px-4 py-3 text-sm text-slate-800 leading-relaxed focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-colors prose prose-sm max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400"
      :class="minHeightClass"
      :data-placeholder="placeholder"
      contenteditable
      @input="onInput"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Eraser,
  Italic,
  Link2,
  List,
  ListOrdered,
  Printer,
  Redo2,
  SeparatorHorizontal,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
  Undo2,
} from 'lucide-vue-next';
import { defineComponent, h } from 'vue';
import { UiIconButton, UiSelect } from './index';

withDefaults(
  defineProps<{
    id?: string;
    placeholder?: string;
    /** class ความสูงขั้นต่ำของพื้นที่กรอก เช่น "min-h-45" */
    minHeightClass?: string;
    /** แสดงปุ่มพิมพ์เอกสาร */
    printable?: boolean;
  }>(),
  {
    id: 'text-editor',
    placeholder: '',
    minHeightClass: 'min-h-45',
    printable: false,
  }
);

const model = defineModel<string>({ default: '' });

const editorRef = ref<HTMLElement | null>(null);
const codeMode = ref(false);
const codeContent = ref('');

const ToolbarDivider = defineComponent({
  setup() {
    return () => h('span', { class: 'w-px h-5 bg-slate-200 mx-0.5 shrink-0' });
  },
});

const execFormat = (cmd: string) => {
  if (codeMode.value) return;
  document.execCommand(cmd);
  editorRef.value?.focus();
  emitUpdate();
};

// รูปแบบหัวข้อ / ฟอนต์
const blockFormat = ref('P');
const fontFamily = ref('default');
const blockOptions = [
  { value: 'P', label: 'ย่อหน้า (Paragraph)' },
  { value: 'H1', label: 'หัวข้อ 1' },
  { value: 'H2', label: 'หัวข้อ 2' },
  { value: 'H3', label: 'หัวข้อ 3' },
];
const fontOptions = [
  { value: 'default', label: 'ฟอนต์เริ่มต้น' },
  { value: 'Sarabun', label: 'Sarabun' },
  { value: 'Tahoma', label: 'Tahoma' },
  { value: 'Angsana New', label: 'Angsana New' },
  { value: 'Arial', label: 'Arial' },
];
const applyBlockFormat = (tag: string | number) => {
  document.execCommand('formatBlock', false, `<${String(tag)}>`);
  editorRef.value?.focus();
  emitUpdate();
};
const applyFont = (font: string | number) => {
  if (String(font) === 'default') return;
  document.execCommand('fontName', false, String(font));
  editorRef.value?.focus();
  emitUpdate();
};

const insertLink = () => {
  const url = window.prompt('ระบุลิงก์เว็บไซต์ที่ต้องการแทรก:', 'https://');
  if (!url) return;
  document.execCommand('createLink', false, url);
  editorRef.value?.focus();
  emitUpdate();
};

const printContent = () => {
  const html = editorRef.value?.innerHTML ?? '';
  const win = window.open('', '_blank', 'width=800,height=600');
  if (!win) return;
  win.document.write(
    `<html><head><title>เอกสาร</title></head><body style="font-family:sans-serif">${html}</body></html>`
  );
  win.document.close();
  win.focus();
  win.print();
};

const toggleCodeMode = () => {
  if (!codeMode.value) {
    codeContent.value = editorRef.value?.innerHTML ?? '';
  } else {
    if (editorRef.value) editorRef.value.innerHTML = codeContent.value;
    model.value = codeContent.value;
  }
  codeMode.value = !codeMode.value;
};

const emitUpdate = () => {
  model.value = editorRef.value?.innerHTML ?? '';
};

const onInput = () => emitUpdate();

// sync ค่าจากภายนอก (เช่นตอน reset/เข้าโหมดแก้ไข) — ไม่ override ถ้าค่าเดิม
watch(
  model,
  (val) => {
    if (codeMode.value) {
      codeContent.value = val;
      return;
    }
    if (editorRef.value && editorRef.value.innerHTML !== val) {
      editorRef.value.innerHTML = val;
    }
  },
  { flush: 'post' }
);
</script>
