<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div class="flex flex-wrap items-center gap-2.5">
      <slot name="start" />
    </div>
    <div class="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
      <slot name="end" />
    </div>
  </div>
</template>
