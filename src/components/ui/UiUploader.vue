<template>
  <div>
    <label
      class="flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed p-6 text-center transition-colors select-none cursor-pointer"
      :class="dragOver ? 'border-blue-500 bg-blue-50/60' : 'border-slate-300 bg-slate-50/50 hover:border-blue-400 hover:bg-slate-50'"
      @dragover.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false"
      @drop.prevent="onDrop"
    >
      <UploadCloud class="w-6 h-6 text-slate-400" />
      <span class="text-xs font-medium text-slate-600">
        ลากไฟล์มาวาง หรือ <span class="text-blue-700 underline">เลือกไฟล์</span>
      </span>
      <span v-if="hint" class="text-[10px] text-slate-400">{{ hint }}</span>
      <input
        type="file"
        class="hidden"
        :accept="accept"
        :multiple="multiple"
        @change="onInput"
      />
    </label>

    <ul v-if="model.length" class="mt-2.5 space-y-1.5">
      <li
        v-for="(file, index) in model"
        :key="`${file.name}-${index}`"
        class="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs"
      >
        <FileText class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        <span class="flex-1 truncate text-slate-700">{{ file.name }}</span>
        <span class="text-[10px] text-slate-400 flex-shrink-0">{{ formatSize(file.size) }}</span>
        <button
          type="button"
          class="text-slate-300 hover:text-red-600 transition-colors cursor-pointer flex-shrink-0"
          title="ลบไฟล์"
          @click="remove(index)"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FileText, UploadCloud, X } from 'lucide-vue-next';

withDefaults(
  defineProps<{
    accept?: string;
    multiple?: boolean;
    hint?: string;
  }>(),
  {
    accept: undefined,
    multiple: false,
    hint: '',
  }
);

const model = defineModel<File[]>({ default: () => [] });
const dragOver = ref(false);

const addFiles = (fileList: FileList | null) => {
  if (!fileList?.length) return;
  const incoming = Array.from(fileList);
  model.value = multiple ? [...model.value, ...incoming] : incoming.slice(0, 1);
};

const onInput = (event: Event) => {
  addFiles((event.target as HTMLInputElement).files);
  (event.target as HTMLInputElement).value = '';
};

const onDrop = (event: DragEvent) => {
  dragOver.value = false;
  addFiles(event.dataTransfer?.files ?? null);
};

const remove = (index: number) => {
  model.value = model.value.filter((_, i) => i !== index);
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
</script>
