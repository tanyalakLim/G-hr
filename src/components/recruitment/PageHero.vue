<script setup lang="ts">
// แบนเนอร์ย่อยด้านบนของแต่ละหน้าย่อยในเว็บไซต์สรรหา (public)
// ไล่เฉดน้ำเงิน bma + ลายจุด + แสงเบลอตกแต่ง เพื่อให้หน้าย่อยมีมิติเหมือน hero ของหน้าแรก
defineProps<{ eyebrow?: string; title: string; desc?: string }>();
</script>

<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-bma-900 via-bma-800 to-bma-600 text-white">
    <!-- ลายจุดตกแต่งทั้งแถบ -->
    <div
      class="absolute inset-0 opacity-15"
      style="background-image: radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.65) 1px, transparent 0); background-size: 22px 22px"
      aria-hidden="true"
    ></div>
    <!-- แสงเบลอตกแต่ง -->
    <div class="absolute -top-24 -right-16 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl" aria-hidden="true"></div>
    <div class="absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-bma-400/20 blur-3xl" aria-hidden="true"></div>

    <div class="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <!-- ป้ายหมวด (eyebrow) -->
      <span
        v-if="eyebrow"
        class="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide backdrop-blur"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-sky-300" aria-hidden="true"></span>
        {{ eyebrow }}
      </span>
      <h1 class="mt-4 text-2xl sm:text-3xl font-bold leading-snug drop-shadow-sm">{{ title }}</h1>
      <p v-if="desc" class="mt-3 max-w-2xl text-sm leading-relaxed text-blue-100/85">{{ desc }}</p>
    </div>

    <!-- เส้น accent ด้านล่าง -->
    <div class="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-sky-400/70 via-white/30 to-transparent" aria-hidden="true"></div>
  </section>
</template>
