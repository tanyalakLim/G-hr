<template>
  <!-- หน้ากระดาษคำสั่ง -->
  <div
    v-if="category === 'order'"
    class="bg-white shadow-lg border border-slate-200 w-full aspect-[210/297] p-6 sm:p-10 text-slate-800 text-[11px] sm:text-xs leading-relaxed flex flex-col"
  >
    <!-- ตราครุฑ -->
    <div class="flex flex-col items-center text-center">
      <img :src="logoUrl" alt="ตราครุฑ" class="w-14 h-14 sm:w-16 sm:h-16 object-contain" />
      <h2 class="font-bold text-sm sm:text-base mt-2 tracking-tight text-slate-900">
        คำสั่ง สำนักงานผู้อำนวยการสถานธนานุบาล
      </h2>
      <p class="text-slate-500 mt-0.5">
        ที่ สนพ. 25/2569
      </p>
      <p class="text-slate-500">
        เรื่อง บรรจุและแต่งตั้งผู้สอบแข่งขันได้
      </p>
    </div>

    <div class="mt-4 space-y-2">
      <p>
        โดยอาศัยอำนาจตามความในมาตรา 27 แห่งพระราชบัญญัติระเบียบข้าราชการกรุงเทพมหานคร
        พ.ศ. 2528 อำนวยการสถานธนานุบาลจึงสั่งว่า
      </p>
      <p class="font-semibold">ข้อ 1. บรรจุผู้สอบแข่งขันได้เข้ารับราชการเป็นพนักงานธนานุบาล</p>
      <p class="font-semibold">ข้อ 2. แต่งตั้งผู้สอบแข่งขันได้ดำรงตำแหน่งตามรายชื่อแนบท้ายคำสั่งนี้</p>
      <p class="font-semibold">ข้อ 3. ให้คำสั่งนี้มีผลตั้งแต่วันที่ 1 ตุลาคม 2569 เป็นต้นไป</p>
    </div>

    <div class="mt-5 flex flex-col items-center">
      <p class="text-slate-500">สั่ง ณ วันที่ 1 ตุลาคม 2569</p>
      <p class="font-semibold mt-2">(นายวิชาญ เจริญสุข)</p>
      <p>ผู้อำนวยการสถานธนานุบาล</p>
    </div>

    <div class="mt-auto text-[10px] text-slate-400">
      (รายชื่อผู้สอบแข่งขันได้ เป็นส่วนหนึ่งของคำสั่งนี้ แนบท้าย)
    </div>
  </div>

  <!-- หน้ากระดาษเอกสารแนบท้าย -->
  <div
    v-else
    class="bg-white shadow-lg border border-slate-200 w-full aspect-[210/297] p-6 sm:p-10 text-slate-800 text-[11px] sm:text-xs leading-relaxed flex flex-col"
  >
    <h2 class="font-bold text-sm sm:text-base text-center tracking-tight text-slate-900">
      รายชื่อผู้สอบแข่งขันได้
    </h2>
    <p class="text-center text-slate-500 mt-0.5">
      (แนบท้ายคำสั่ง สำนักงานผู้อำนวยการสถานธนานุบาล ที่ สนพ. 25/2569)
    </p>

    <table class="mt-4 w-full border border-slate-300 text-left">
      <thead>
        <tr class="bg-slate-50 font-semibold text-slate-600">
          <th class="border border-slate-300 px-2 py-1.5 text-center w-10">ที่</th>
          <th class="border border-slate-300 px-2 py-1.5">ชื่อ - นามสกุล</th>
          <th class="border border-slate-300 px-2 py-1.5">ตำแหน่ง</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="border border-slate-300 px-2 py-1.5 text-center">1</td>
          <td class="border border-slate-300 px-2 py-1.5">นางสาวธาริภา กาณจนา</td>
          <td class="border border-slate-300 px-2 py-1.5">นักประเมินราคา</td>
        </tr>
        <tr>
          <td class="border border-slate-300 px-2 py-1.5 text-center">2</td>
          <td class="border border-slate-300 px-2 py-1.5">นางสาวกรกต นานนนา</td>
          <td class="border border-slate-300 px-2 py-1.5">นักประเมินราคา</td>
        </tr>
        <tr>
          <td class="border border-slate-300 px-2 py-1.5 text-center">3</td>
          <td class="border border-slate-300 px-2 py-1.5">นางจอมขวัญ นายขวัญ</td>
          <td class="border border-slate-300 px-2 py-1.5">นักประเมินราคา</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import logoUrl from '../../assets/logo.png';

defineProps<{
  category: string;
}>();
</script>
