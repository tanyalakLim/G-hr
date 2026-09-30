<template>
  <div
    class="flex items-center gap-3 py-3 transition-colors"
    :class="clickable ? 'cursor-pointer hover:bg-slate-50/70 px-2 -mx-2 rounded-lg' : ''"
    @click="clickable && emit('click')"
  >
    <div v-if="$slots.leading" class="flex-shrink-0">
      <slot name="leading" />
    </div>

    <div class="flex-1 min-w-0">
      <div class="text-xs font-semibold text-slate-800 truncate">
        <slot name="title" />
      </div>
      <div v-if="$slots.subtitle" class="text-[11px] text-slate-400 truncate mt-0.5">
        <slot name="subtitle" />
      </div>
    </div>

    <div v-if="$slots.trailing" class="flex-shrink-0">
      <slot name="trailing" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    clickable?: boolean;
  }>(),
  {
    clickable: false,
  }
);

const emit = defineEmits<{
  (e: 'click'): void;
}>();
</script>
