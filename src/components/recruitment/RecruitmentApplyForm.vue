<template>
  <!-- ===== หน้า ข้อมูลสมัครสอบ (แบบฟอร์มสมัครสอบ/สมัครคัดเลือก ของเว็บไซต์สรรหา public) ===== -->

  <!-- ไม่พบประกาศตาม id ที่ระบุ -->
  <section v-if="!announcement" class="max-w-4xl mx-auto px-4 sm:px-6 py-16">
    <div class="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center">
      <FileText class="w-8 h-8 mx-auto text-slate-300" />
      <p class="mt-3 text-sm text-slate-500">ไม่พบประกาศที่ต้องการ จึงไม่สามารถสมัครได้</p>
      <RouterLink
        to="/recruitment_site"
        class="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-bma-700 hover:bg-bma-600 text-white text-xs font-semibold px-4 py-2.5 transition-colors"
      >
        กลับหน้าแรก
      </RouterLink>
    </div>
  </section>

  <!-- ยังไม่เข้าสู่ระบบผู้สมัคร — ให้ล็อกอินก่อนกรอกแบบฟอร์ม -->
  <section v-else-if="!isRecruitAuthenticated" class="max-w-4xl mx-auto px-4 sm:px-6 py-16">
    <div class="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center">
      <UserRound class="w-8 h-8 mx-auto text-slate-300" />
      <p class="mt-3 text-sm text-slate-500">กรุณาเข้าสู่ระบบผู้สมัครก่อนกรอกข้อมูลสมัคร{{ applyVerb }}</p>
      <RouterLink
        :to="{ path: '/recruitment_site/login', query: { redirect: route.path, position: props.position } }"
        class="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-bma-700 hover:bg-bma-600 text-white text-xs font-semibold px-4 py-2.5 transition-colors"
      >
        <LogIn class="w-4 h-4" />
        เข้าสู่ระบบผู้สมัคร
      </RouterLink>
    </div>
  </section>

  <template v-else>
    <!-- แบนเนอร์ย่อย: หัวข้อหลักของหน้าสมัครสอบ -->
    <PageHero
      :eyebrow="`${announcement.category === 'exam' ? 'การสอบแข่งขัน' : 'การคัดเลือก'} • ข้อมูลสมัคร${applyVerb}`"
      :title="`${applyVerb}ตำแหน่ง ${position}`"
      :desc="`รอบ: ${announcement.title} • ประกาศเมื่อวันที่ ${announcement.date}`"
    />

    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-5">
      <!-- แถวบน: ขั้นตอนการกรอก + ปุ่มย้อนกลับไปหน้าประกาศ -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <ol class="flex flex-wrap items-center gap-2 sm:gap-3">
          <!-- ขั้นตอนปัจจุบัน (เน้นสี) -->
          <li class="flex items-center gap-2 rounded-xl bg-bma-700 text-white text-xs font-semibold px-3.5 py-2">
            <span class="w-5 h-5 rounded-full bg-white/20 text-[10px] font-bold flex items-center justify-center">1</span>
            ข้อมูลสมัคร{{ applyVerb }}
          </li>
          <ChevronRight class="w-4 h-4 text-slate-300 shrink-0" aria-hidden="true" />
          <li class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-500 text-xs font-semibold px-3.5 py-2">
            <span class="w-5 h-5 rounded-full bg-slate-100 text-[10px] font-bold flex items-center justify-center">2</span>
            แนบเอกสารประกอบ
          </li>
          <ChevronRight class="w-4 h-4 text-slate-300 shrink-0" aria-hidden="true" />
          <li class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-500 text-xs font-semibold px-3.5 py-2">
            <span class="w-5 h-5 rounded-full bg-slate-100 text-[10px] font-bold flex items-center justify-center">3</span>
            ยืนยันส่งใบสมัคร
          </li>
        </ol>
        <button
          type="button"
          class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-bma-50 hover:text-bma-700 transition-colors cursor-pointer"
          @click="goBackToAnnouncement"
        >
          <ChevronRight class="w-4 h-4 rotate-180" />
          ย้อนกลับไปหน้าประกาศ
        </button>
      </div>

      <!-- ===== แถบคำเตือนเบื้องต้น: ต้องใส่เครื่องหมายแดช "-" ในช่องที่ไม่มีข้อมูล ===== -->
      <div class="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <TriangleAlert class="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
        <div>
          <p class="text-sm font-bold text-amber-800">หมายเหตุสำคัญ</p>
          <p class="mt-0.5 text-xs leading-relaxed text-amber-700">
            ขอให้ท่านใส่เครื่องหมายแดช <span class="font-bold">"-"</span> ในช่องที่ไม่มีข้อมูล เพื่อป้องกันระบบติดปัญหาฟิลด์ว่าง
            ทั้งนี้ช่องที่มีเครื่องหมาย <span class="font-bold text-red-500">*</span> จำเป็นต้องกรอกก่อนส่งใบสมัคร
          </p>
        </div>
      </div>

      <!-- ===== 1) ข้อมูลส่วนตัวและการอัปโหลดรูปถ่าย ===== -->
      <div
        id="card-personal"
        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        :class="invalidCard === 'card-personal' ? 'ring-2 ring-red-300' : ''"
      >
        <div class="flex items-center gap-2.5 border-b border-slate-100 bg-slate-50/60 px-5 py-3.5 sm:px-6">
          <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bma-900 text-[11px] font-bold text-white">1</span>
          <p class="text-sm font-bold text-slate-800">ข้อมูลส่วนตัวและรูปถ่ายผู้สมัคร</p>
        </div>
        <div class="flex flex-col gap-6 p-5 sm:flex-row sm:p-6">
          <!-- ฟิลด์ข้อมูลส่วนตัว -->
          <div class="grid min-w-0 flex-1 grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-2">
            <UiInput v-model="form.citizenId" label="เลขประจำตัวประชาชน *" type="text" inputmode="numeric" maxlength="13" size="lg" placeholder="13 หลัก เช่น 1100123456789" />
            <UiInput v-model="form.confirmCitizenId" label="ยืนยันเลขประจำตัวประชาชน *" type="text" inputmode="numeric" maxlength="13" size="lg" placeholder="กรอกเลข 13 หลักอีกครั้ง" />
            <!-- คำนำหน้า + ชื่อ + นามสกุล อยู่แถวเดียวกัน -->
            <div class="grid grid-cols-1 gap-4 sm:col-span-2 sm:grid-cols-[10rem_1fr_1fr]">
              <UiSelect v-model="form.prefix" label="คำนำหน้า *" :options="PREFIX_OPTIONS" size="lg" />
              <UiInput v-model="form.firstName" label="ชื่อ (ภาษาไทย) *" size="lg" />
              <UiInput v-model="form.lastName" label="นามสกุล (ภาษาไทย) *" size="lg" />
            </div>
            <UiInput v-model="form.nationality" label="สัญชาติ" size="lg" placeholder="-" />
            <UiSelect v-model="form.religion" label="ศาสนา" :options="RELIGION_OPTIONS" size="lg" />
            <UiInput v-model="form.birthDate" label="วัน/เดือน/ปี เกิด *" type="date" size="lg" />
            <UiInput :model-value="age" label="อายุ (ปี)" size="lg" disabled placeholder="-" />
            <UiInput v-model="form.phone" label="เบอร์โทรศัพท์ *" type="tel" size="lg" placeholder="เช่น 08X-XXX-XXXX" />
            <UiInput v-model="form.email" label="E-mail address *" type="email" size="lg" placeholder="เช่น name@email.com" />
          </div>

          <!-- รูปถ่ายผู้สมัคร (ด้านขวา) -->
          <div class="w-full shrink-0 sm:w-52">
            <p class="mb-1 text-[11px] font-medium text-slate-500">รูปถ่ายผู้สมัคร <span class="text-red-500">*</span></p>
            <!-- กรอบรูป: แสดงตัวอย่างเมื่ออัปโหลดแล้ว -->
            <div
              class="aspect-3/4 w-full overflow-hidden rounded-2xl border-2 border-dashed"
              :class="invalidCard === 'card-personal' && !form.photo ? 'border-red-300 bg-red-50/50' : 'border-slate-300 bg-slate-50/60'"
            >
              <img v-if="form.photo" :src="form.photo" alt="รูปถ่ายผู้สมัคร" class="h-full w-full object-cover" />
              <div v-else class="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
                <Camera class="w-8 h-8 text-slate-300" />
                <p class="text-[11px] leading-relaxed text-slate-400">ยังไม่ได้อัปโหลดรูปถ่าย</p>
              </div>
            </div>
            <!-- ปุ่มเลือกไฟล์ / ลบรูป -->
            <div class="mt-2 flex items-center gap-2">
              <label class="inline-flex flex-1">
                <input ref="photoInput" type="file" accept="image/jpeg,.jpg" class="hidden" @change="onPhotoChosen" />
                <span class="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-bma-300 hover:text-bma-700">
                  <ImagePlus class="w-3.5 h-3.5" />
                  {{ form.photo ? 'เปลี่ยนรูป' : 'เลือกรูปถ่าย' }}
                </span>
              </label>
              <button
                v-if="form.photo"
                type="button"
                class="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-200 px-2.5 py-2 text-slate-400 transition-colors hover:border-red-200 hover:text-red-500"
                title="ลบรูปถ่าย"
                @click="removePhoto"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
            <!-- ข้อกำหนดรูปถ่าย -->
            <ul class="mt-2.5 space-y-1 text-[11px] leading-relaxed text-slate-500">
              <li class="flex items-start gap-1.5"><span class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" aria-hidden="true"></span>ไฟล์ภาพ JPG ขนาด 40–100 KB{{ form.photoKb ? ` (ปัจจุบัน ${form.photoKb} KB)` : '' }}</li>
              <li class="flex items-start gap-1.5"><span class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" aria-hidden="true"></span>เป็นรูปหน้าตรง ชุดสุภาพ ไม่สวมหมวก ไม่ใส่แว่นตาดำ</li>
              <li class="flex items-start gap-1.5"><span class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" aria-hidden="true"></span>ไม่มีลวดลายใด ๆ บนรูป</li>
            </ul>
            <p v-if="photoError" class="mt-2 text-[11px] font-semibold text-red-500">{{ photoError }}</p>
          </div>
        </div>
      </div>

      <!-- ===== 2) วุฒิที่ใช้สมัครสอบ ===== -->
      <div
        id="card-education"
        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        :class="invalidCard === 'card-education' ? 'ring-2 ring-red-300' : ''"
      >
        <div class="flex items-center gap-2.5 border-b border-slate-100 bg-slate-50/60 px-5 py-3.5 sm:px-6">
          <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bma-900 text-[11px] font-bold text-white">2</span>
          <p class="text-sm font-bold text-slate-800">วุฒิที่ใช้สมัคร{{ applyVerb }}</p>
        </div>
        <div class="p-5 sm:p-6">
          <div class="grid grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-3">
            <UiSelect v-model="form.eduLevel" label="วุฒิที่ใช้สมัครสอบ *" :options="EDU_LEVEL_OPTIONS" size="lg" />
            <UiInput v-model="form.major" label="สาขาวิชา/วิชาเอก *" size="lg" />
            <UiInput v-model="form.school" label="ชื่อสถานศึกษา *" size="lg" />
            <UiSelect v-model="form.schoolType" label="ประเภทสถานศึกษา" :options="SCHOOL_TYPE_OPTIONS" size="lg" />
            <UiInput v-model="form.gradDate" label="วันที่สำเร็จการศึกษา" type="date" size="lg" />
            <UiInput v-model="form.gpa" label="คะแนนเฉลี่ยสะสม" size="lg" placeholder="-" />
            <UiInput v-model="form.highestDegree" label="วุฒิการศึกษาสูงสุด" size="lg" placeholder="- เช่น วิทยาศาสตรบัณฑิต" />
          </div>
        </div>
      </div>

      <!-- ===== 3) ตำแหน่งปัจจุบัน (สถานภาพการทำงานในสังกัดกรุงเทพมหานคร) ===== -->
      <div
        id="card-work-status"
        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        :class="invalidCard === 'card-work-status' ? 'ring-2 ring-red-300' : ''"
      >
        <div class="flex items-center gap-2.5 border-b border-slate-100 bg-slate-50/60 px-5 py-3.5 sm:px-6">
          <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bma-900 text-[11px] font-bold text-white">3</span>
          <div>
            <p class="text-sm font-bold text-slate-800">ตำแหน่งปัจจุบัน</p>
            <p class="text-[11px] text-slate-500">สถานภาพการทำงานในสังกัดกรุงเทพมหานคร (ปัจจุบัน)</p>
          </div>
        </div>
        <div class="p-5 sm:p-6">
          <div class="max-w-md">
            <UiSelect v-model="form.workStatus" label="สถานภาพการทำงานในสังกัดกรุงเทพมหานคร *" :options="WORK_STATUS_OPTIONS" size="lg" />
          </div>
          <!-- รายละเอียดตำแหน่งปัจจุบัน (ซ่อนเมื่อไม่ได้ปฏิบัติงานในสังกัด กทม.) -->
          <div v-if="form.workStatus !== 'ไม่ปฏิบัติงานในสังกัดกรุงเทพมหานคร'" class="mt-4 grid grid-cols-1 gap-x-4 gap-y-3.5 rounded-xl border border-slate-100 bg-slate-50/60 p-4 sm:grid-cols-2 lg:grid-cols-3">
            <UiInput v-model="form.posName" label="ชื่อตำแหน่ง" size="lg" placeholder="-" />
            <UiInput v-model="form.salary" label="เงินเดือน (บาท)" size="lg" placeholder="-" />
            <UiInput v-model="form.group" label="กลุ่ม/ฝ่าย" size="lg" placeholder="-" />
            <UiInput v-model="form.division" label="กอง" size="lg" placeholder="-" />
            <UiInput v-model="form.department" label="สังกัด" size="lg" placeholder="-" />
            <UiInput v-model="form.workPhone" label="เบอร์โทรที่ทำงาน" type="tel" size="lg" placeholder="-" />
          </div>
        </div>
      </div>

      <!-- ===== 4) ประวัติการทำงาน (ดึงจากทะเบียนประวัติ กทม. อัตโนมัติ + เพิ่มเองได้) ===== -->
      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center gap-2.5 border-b border-slate-100 bg-slate-50/60 px-5 py-3.5 sm:px-6">
          <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bma-900 text-[11px] font-bold text-white">4</span>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-bold text-slate-800">ประวัติการทำงาน</p>
            <p class="text-[11px] text-slate-500">ตั้งแต่เริ่มปฏิบัติงานกับกรุงเทพมหานครจนถึงปัจจุบัน (ระบบดึงจากทะเบียนประวัติอัตโนมัติ หรือเพิ่มเองได้)</p>
          </div>
          <!-- ปุ่มเพิ่มประวัติการทำงาน -->
          <button
            type="button"
            class="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-bma-700 px-3.5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-bma-600"
            @click="openWorkHistoryForm"
          >
            <Plus class="h-3.5 w-3.5" />
            เพิ่มประวัติการทำงาน
          </button>
        </div>

        <!-- ฟอร์มเพิ่มประวัติการทำงาน (แสดงเมื่อกดปุ่มเพิ่ม) -->
        <div v-if="showWorkHistoryForm" class="space-y-3.5 border-b border-slate-100 bg-slate-50/60 p-4 sm:p-5">
          <div class="grid grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-4">
            <UiInput v-model="workDraft.position" label="ชื่อตำแหน่ง *" size="lg" />
            <UiSelect v-model="workDraft.type" label="ประเภท" :options="WORK_TYPE_OPTIONS" size="lg" />
            <UiInput v-model="workDraft.startDate" label="วันที่เริ่มต้น *" type="date" size="lg" />
            <UiInput v-model="workDraft.endDate" label="วันที่สิ้นสุด" type="date" size="lg" :disabled="workDraft.isCurrent" />
          </div>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <label class="inline-flex cursor-pointer select-none items-center gap-2 text-xs text-slate-600">
              <input v-model="workDraft.isCurrent" type="checkbox" class="h-4 w-4 cursor-pointer rounded border-slate-300 text-bma-700 focus:ring-bma-500" />
              <span class="font-semibold">ปฏิบัติงานถึงปัจจุบัน</span>
            </label>
            <div class="flex gap-2">
              <button
                type="button"
                class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:border-bma-300 hover:text-bma-700"
                @click="showWorkHistoryForm = false"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-bma-700 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-bma-600"
                @click="addWorkHistory"
              >
                <Check class="h-3.5 w-3.5" />
                บันทึกรายการ
              </button>
            </div>
          </div>
          <p v-if="workDraftError" class="text-[11px] font-semibold text-red-500">{{ workDraftError }}</p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[640px] text-left text-xs">
            <thead class="border-b border-slate-100 bg-white text-[10px] font-bold uppercase tracking-wide text-slate-400">
              <tr>
                <th class="px-5 py-3 sm:px-6">ชื่อตำแหน่ง</th>
                <th class="px-4 py-3">ประเภท</th>
                <th class="px-4 py-3">วันที่เริ่มต้น</th>
                <th class="px-4 py-3">วันที่สิ้นสุด</th>
                <th class="px-5 py-3 sm:px-6">ระยะเวลา</th>
                <th v-if="workHistory.length" class="px-4 py-3 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="(row, i) in workHistory" :key="i" class="text-slate-700">
                <td class="px-5 py-3 font-semibold sm:px-6">{{ row.position }}</td>
                <td class="px-4 py-3">{{ row.type }}</td>
                <td class="px-4 py-3">{{ row.startDate }}</td>
                <td class="px-4 py-3">{{ row.endDate }}</td>
                <td class="px-5 py-3 sm:px-6">{{ row.duration }}</td>
                <td v-if="workHistory.length" class="px-4 py-3 text-right">
                  <button
                    type="button"
                    class="inline-flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    title="ลบรายการ"
                    @click="removeWorkHistory(i)"
                  >
                    <Trash2 class="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
              <tr v-if="!workHistory.length">
                <td colspan="5" class="px-5 py-10 text-center text-sm text-slate-400 sm:px-6">ไม่มีข้อมูล</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ===== 5) ข้อมูลที่อยู่ และบุคคลที่สามารถติดต่อได้ ===== -->
      <div
        id="card-address"
        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        :class="invalidCard === 'card-address' ? 'ring-2 ring-red-300' : ''"
      >
        <div class="flex items-center gap-2.5 border-b border-slate-100 bg-slate-50/60 px-5 py-3.5 sm:px-6">
          <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bma-900 text-[11px] font-bold text-white">5</span>
          <div>
            <p class="text-sm font-bold text-slate-800">ข้อมูลที่อยู่และบุคคลที่สามารถติดต่อได้</p>
            <p class="text-[11px] text-slate-500">ที่อยู่ตามทะเบียนบ้าน ที่อยู่ปัจจุบัน และผู้ติดต่อกรณีฉุกเฉิน</p>
          </div>
        </div>
        <div class="space-y-6 p-5 sm:p-6">
          <!-- ที่อยู่ตามทะเบียนบ้าน -->
          <div>
            <p class="mb-3 inline-flex items-center gap-1.5 rounded-full bg-bma-50 px-3 py-1 text-[11px] font-bold text-bma-700 ring-1 ring-bma-100">
              <Home class="h-3.5 w-3.5" />
              ที่อยู่ตามทะเบียนบ้าน
            </p>
            <div class="grid grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-3">
              <UiInput v-model="form.addressNo" label="บ้านเลขที่ / หมู่ / ถนน" size="lg" placeholder="-" />
              <UiSelect v-model="form.province" label="จังหวัด *" :options="PROVINCE_OPTIONS" size="lg" />
              <UiInput v-model="form.district" label="เขต/อำเภอ *" size="lg" />
              <UiInput v-model="form.subDistrict" label="แขวง/ตำบล *" size="lg" />
              <UiInput v-model="form.zipcode" label="รหัสไปรษณีย์" type="text" inputmode="numeric" maxlength="5" size="lg" placeholder="-" />
            </div>
            <!-- ยืนยันว่าที่อยู่ปัจจุบันตรงกับทะเบียนบ้านหรือไม่ -->
            <label class="mt-3.5 inline-flex cursor-pointer select-none items-center gap-2 text-xs text-slate-600">
              <input v-model="form.sameAddress" type="checkbox" class="h-4 w-4 cursor-pointer rounded border-slate-300 text-bma-700 focus:ring-bma-500" />
              <span class="font-semibold">ที่อยู่ปัจจุบันตรงกับที่อยู่ตามทะเบียนบ้าน</span>
            </label>
            <!-- ที่อยู่ปัจจุบัน (แสดงเมื่อไม่ตรงกับทะเบียนบ้าน) -->
            <div v-if="!form.sameAddress" class="mt-3.5 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <p class="mb-3 text-[11px] font-bold text-slate-500">ที่อยู่ปัจจุบันที่สามารถติดต่อได้</p>
              <div class="grid grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-3">
                <UiInput v-model="form.curAddressNo" label="บ้านเลขที่ / หมู่ / ถนน" size="lg" placeholder="-" />
                <UiSelect v-model="form.curProvince" label="จังหวัด" :options="PROVINCE_OPTIONS" size="lg" />
                <UiInput v-model="form.curDistrict" label="เขต/อำเภอ" size="lg" placeholder="-" />
                <UiInput v-model="form.curSubDistrict" label="แขวง/ตำบล" size="lg" placeholder="-" />
                <UiInput v-model="form.curZipcode" label="รหัสไปรษณีย์" type="text" inputmode="numeric" maxlength="5" size="lg" placeholder="-" />
              </div>
            </div>
          </div>

          <!-- บุคคลที่สามารถติดต่อได้ (กรณีฉุกเฉิน) -->
          <div class="border-t border-slate-100 pt-5">
            <p class="mb-3 inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-bold text-sky-700 ring-1 ring-sky-100">
              <Contact class="h-3.5 w-3.5" />
              บุคคลที่สามารถติดต่อได้ (กรณีฉุกเฉิน)
            </p>
            <div class="grid grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-4">
              <UiSelect v-model="form.contactPrefix" label="คำนำหน้า" :options="PREFIX_OPTIONS" size="lg" />
              <UiInput v-model="form.contactName" label="ชื่อ-นามสกุล *" size="lg" />
              <UiSelect v-model="form.contactRelation" label="ความเกี่ยวข้อง" :options="RELATION_OPTIONS" size="lg" />
              <UiInput v-model="form.contactPhone" label="เบอร์โทรศัพท์ *" type="tel" size="lg" placeholder="เช่น 08X-XXX-XXXX" />
            </div>
          </div>
        </div>
      </div>

      <!-- ===== 6) คำรับรองและความยินยอม (PDPA) ===== -->
      <div
        id="card-consent"
        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        :class="invalidCard === 'card-consent' ? 'ring-2 ring-red-300' : ''"
      >
        <div class="flex items-center gap-2.5 border-b border-slate-100 bg-slate-50/60 px-5 py-3.5 sm:px-6">
          <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bma-900 text-[11px] font-bold text-white">6</span>
          <div>
            <p class="text-sm font-bold text-slate-800">คำรับรองและความยินยอม</p>
            <p class="text-[11px] text-slate-500">ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 โปรดอ่านโดยละเอียดก่อนกดยอมรับ</p>
          </div>
        </div>
        <div class="p-5 sm:p-6">
          <!-- เนื้อความ 5 ข้อ (เลื่อนอ่านได้) -->
          <ol class="max-h-72 space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <li v-for="(item, i) in CONSENT_ITEMS" :key="i" class="flex items-start gap-2.5 text-xs leading-relaxed text-slate-600">
              <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bma-100 text-[10px] font-bold text-bma-700">{{ i + 1 }}</span>
              <span>{{ item }}</span>
            </li>
          </ol>
          <!-- ช่องยืนยันการยอมรับ (จำเป็นก่อนส่งใบสมัคร) -->
          <label class="mt-4 flex cursor-pointer select-none items-start gap-2.5">
            <input v-model="form.consent" type="checkbox" class="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 text-bma-700 focus:ring-bma-500" />
            <span class="text-xs font-semibold leading-relaxed text-slate-700 sm:text-sm">
              ข้าพเจ้าได้ศึกษาข้อความคำรับรองและความยินยอมข้างต้นโดยละเอียดครบถ้วนแล้ว และข้าพเจ้ายอมรับคำรับรองและเงื่อนไขทุกประการ
            </span>
          </label>
        </div>
      </div>

      <!-- ===== ปุ่มดำเนินการด้านล่าง: บันทึกข้อมูล (ร่าง) / ส่งใบสมัคร ===== -->
      <div class="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg shadow-slate-900/5 backdrop-blur sm:p-5">
        <p class="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
          <Save class="w-3.5 h-3.5 shrink-0" />
          {{ draftSavedAt ? `ร่างล่าสุดบันทึกเมื่อ ${draftSavedAt}` : 'ยังไม่ได้บันทึกร่างในครั้งนี้' }}
        </p>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:border-bma-300 hover:text-bma-700"
            @click="saveDraft"
          >
            <Save class="w-3.5 h-3.5" />
            บันทึกข้อมูล
          </button>
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-bma-700 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-bma-600"
            @click="submitApplication"
          >
            <Send class="w-3.5 h-3.5" />
            ส่งใบสมัคร
          </button>
        </div>
      </div>
    </section>
  </template>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  Camera,
  Check,
  ChevronRight,
  Contact,
  FileText,
  Home,
  ImagePlus,
  LogIn,
  Plus,
  Save,
  Send,
  Trash2,
  TriangleAlert,
  UserRound,
} from 'lucide-vue-next';
import PageHero from './PageHero.vue';
import { UiInput, UiSelect } from '../ui';
import { useToast } from '../../composables/useToast';
import { isRecruitAuthenticated } from '../../composables/useRecruitmentAuth';
import type { AnnouncementCategory, RecruitmentAnnouncement } from '../../data/recruitmentAnnouncements';

const props = defineProps<{
  /** ประกาศที่กำลังสมัคร (จาก route param) — undefined เมื่อไม่พบประกาศ */
  announcement?: RecruitmentAnnouncement;
  /** ตำแหน่งที่สมัคร (จาก query ?position=) */
  position: string;
  /** หมวดประกาศ: สอบแข่งขัน หรือ คัดเลือก */
  category: AnnouncementCategory;
}>();

const { show } = useToast();
const route = useRoute();
const router = useRouter();

// --- ป้ายคำของหมวด: สอบแข่งขัน = สมัครสอบ / คัดเลือก = สมัครคัดเลือก ---
const applyVerb = computed(() => (props.category === 'exam' ? 'สมัครสอบ' : 'สมัครคัดเลือก'));

// --- ตัวเลือกคงที่ของฟอร์ม ---
const PREFIX_OPTIONS = [
  { value: 'นาย', label: 'นาย' },
  { value: 'นาง', label: 'นาง' },
  { value: 'นางสาว', label: 'นางสาว' },
];
const RELIGION_OPTIONS = [
  { value: 'พุทธ', label: 'พุทธ' },
  { value: 'คริสต์', label: 'คริสต์' },
  { value: 'อิสลาม', label: 'อิสลาม' },
  { value: 'ฮินดู', label: 'ฮินดู' },
  { value: 'ซิกข์', label: 'ซิกข์' },
  { value: 'อื่นๆ', label: 'อื่นๆ' },
];
const EDU_LEVEL_OPTIONS = [
  { value: 'อนุปริญญา (ปวส.)', label: 'อนุปริญญา (ปวส.)' },
  { value: 'ปริญญาตรี', label: 'ปริญญาตรี' },
  { value: 'ปริญญาโท', label: 'ปริญญาโท' },
  { value: 'ปริญญาเอก', label: 'ปริญญาเอก' },
];
const SCHOOL_TYPE_OPTIONS = [
  { value: 'รัฐ', label: 'รัฐ' },
  { value: 'เอกชน', label: 'เอกชน' },
  { value: 'ต่างประเทศ', label: 'ต่างประเทศ' },
];
const WORK_STATUS_OPTIONS = [
  { value: 'ไม่ปฏิบัติงานในสังกัดกรุงเทพมหานคร', label: 'ไม่ปฏิบัติงานในสังกัดกรุงเทพมหานคร' },
  { value: 'ข้าราชการกรุงเทพมหานคร', label: 'ข้าราชการกรุงเทพมหานคร' },
  { value: 'ลูกจ้างประจำ', label: 'ลูกจ้างประจำ' },
  { value: 'ลูกจ้างชั่วคราว', label: 'ลูกจ้างชั่วคราว' },
  { value: 'ผู้ปฏิบัติงานอื่นในกรุงเทพมหานคร', label: 'ผู้ปฏิบัติงานอื่นในกรุงเทพมหานคร' },
];
const RELATION_OPTIONS = [
  { value: 'บิดา', label: 'บิดา' },
  { value: 'มารดา', label: 'มารดา' },
  { value: 'คู่สมรส', label: 'คู่สมรส' },
  { value: 'พี่น้อง', label: 'พี่น้อง' },
  { value: 'ญาติ', label: 'ญาติ' },
  { value: 'เพื่อน', label: 'เพื่อน' },
  { value: 'อื่นๆ', label: 'อื่นๆ' },
];
// ประเภทการจ้างงานของแต่ละรายการในประวัติการทำงาน
const WORK_TYPE_OPTIONS = [
  { value: 'ข้าราชการกรุงเทพมหานคร', label: 'ข้าราชการกรุงเทพมหานคร' },
  { value: 'ลูกจ้างประจำ', label: 'ลูกจ้างประจำ' },
  { value: 'ลูกจ้างชั่วคราว', label: 'ลูกจ้างชั่วคราว' },
  { value: 'ผู้ปฏิบัติงานอื่น', label: 'ผู้ปฏิบัติงานอื่น' },
];
// รายชื่อจังหวัดทั้งหมด 77 จังหวัด (รวมกรุงเทพมหานคร)
const THAILAND_PROVINCES = [
  'กรุงเทพมหานคร', 'สมุทรปราการ', 'นนทบุรี', 'ปทุมธานี', 'พระนครศรีอยุธยา', 'อ่างทอง', 'ลพบุรี', 'สิงห์บุรี', 'ชัยนาท', 'สระบุรี',
  'ชลบุรี', 'ระยอง', 'จันทบุรี', 'ตราด', 'ฉะเชิงเทรา', 'ปราจีนบุรี', 'นครนายก', 'สระแก้ว',
  'นครสวรรค์', 'อุทัยธานี', 'กำแพงเพชร', 'ตาก', 'สุโขทัย', 'พิษณุโลก', 'พิจิตร', 'เพชรบูรณ์',
  'เชียงใหม่', 'ลำพูน', 'ลำปาง', 'อุตรดิตถ์', 'แพร่', 'น่าน', 'พะเยา', 'เชียงราย', 'แม่ฮ่องสอน',
  'นครศรีธรรมราช', 'กระบี่', 'พังงา', 'ภูเก็ต', 'สุราษฎร์ธานี', 'ชุมพร', 'ระนอง', 'สตูล', 'ตรัง', 'พัทลุง', 'สงขลา', 'ยะลา', 'ปัตตานี', 'นราธิวาส',
  'นครราชสีมา', 'บุรีรัมย์', 'สุรินทร์', 'ศรีสะเกษ', 'อุบลราชธานี', 'ยโสธร', 'ชัยภูมิ', 'อำนาจเจริญ', 'บึงกาฬ', 'หนองบัวลำภู',
  'ขอนแก่น', 'อุดรธานี', 'เลย', 'หนองคาย', 'มหาสารคาม', 'ร้อยเอ็ด', 'กาฬสินธุ์', 'สกลนคร',
  'สมุทรสาคร', 'สมุทรสงคราม', 'ราชบุรี', 'กาญจนบุรี', 'สุพรรณบุรี', 'นครปฐม', 'เพชรบุรี', 'ประจวบคีรีขันธ์',
  'มุกดาหาร', 'นครพนม',
];
const PROVINCE_OPTIONS = THAILAND_PROVINCES.map((p) => ({ value: p, label: p }));

// --- เนื้อความคำรับรองและความยินยอม 5 ข้อ (ตามประกาศรับสมัครและ PDPA) ---
const CONSENT_ITEMS = [
  'ข้าพเจ้าขอให้คำรับรองว่า ข้อความดังกล่าวข้างต้นเป็นจริงทุกประการ และข้าพเจ้ามีคุณสมบัติทั่วไปและไม่มีลักษณะต้องห้ามตามมาตรา 43 แห่งพระราชบัญญัติระเบียบข้าราชการกรุงเทพมหานครและบุคลากรกรุงเทพมหานคร พ.ศ. 2554 และมีคุณสมบัติเฉพาะสำหรับตำแหน่งที่สมัครตรงตามประกาศรับสมัคร',
  'กรณีข้าพเจ้ามีลักษณะต้องห้าม ตามมาตรา 43 ข. แห่งพระราชบัญญัติระเบียบข้าราชการกรุงเทพมหานครและบุคลากรกรุงเทพมหานคร พ.ศ. 2554 และประสงค์จะยื่นคำขอยกเว้นเข้ารับราชการฯ ต่อสำนักงาน ก.ก. ตามระเบียบ ก.ก. ว่าด้วยการยกเว้นให้ผู้มีลักษณะต้องห้ามเข้ารับราชการเป็นข้าราชการกรุงเทพมหานคร พ.ศ. 2556 ตามมติ ก.ก. ครั้งที่ 7/2556 เมื่อวันที่ 15 สิงหาคม 2556 ข้าพเจ้าจะยื่นคำขอยกเว้นฯ ภายในวันปิดรับสมัคร ทั้งนี้ หากยื่นภายหลังกำหนด สำนักงาน ก.ก. จะไม่รับคำขอดังกล่าว',
  'ข้าพเจ้าจะยื่นหลักฐานและเอกสารที่แสดงว่า เป็นผู้มีคุณสมบัติทั่วไปและมีคุณสมบัติเฉพาะสำหรับตำแหน่งที่สมัครตรงตามประกาศรับสมัครภายในระยะเวลาที่กำหนดตามประกาศฯ หากมีการตรวจสอบหลักฐานและเอกสาร และหรือคุณวุฒิการศึกษาของข้าพเจ้าในภายหลังปรากฏว่าข้าพเจ้ามีคุณสมบัติไม่ตรงหรือมีลักษณะต้องห้ามตามประกาศรับสมัครหรือไม่ได้รับการยกเว้นให้ถือว่า ข้าพเจ้าเป็นผู้ขาดคุณสมบัติในการสมัครครั้งนี้มาตั้งแต่ต้น และไม่มีสิทธิได้รับการบรรจุและแต่งตั้งให้ดำรงตำแหน่ง และข้าพเจ้าจะไม่มีสิทธิเรียกร้องใดๆ ทั้งสิ้น และหากข้าพเจ้าจงใจกรอกข้อความอันเป็นเท็จ อาจมีความผิดทางอาญาฐานแจ้งความเท็จต่อเจ้าพนักงาน ตามประมวลกฎหมายอาญา มาตรา 137',
  'ข้าพเจ้าได้ศึกษาและทำความเข้าใจพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 ตลอดจนประกาศและระเบียบที่เกี่ยวข้องโดยละเอียดครบถ้วนแล้ว ข้าพเจ้าขอแสดงความยินยอมให้หน่วยงานหรือบุคคลที่เกี่ยวข้องกับการดำเนินการสรรหา สามารถเก็บ รวบรวม ใช้และเปิดเผยข้อมูลส่วนบุคคลที่เกี่ยวข้องกับข้าพเจ้า เพื่อประโยชน์ของทางราชการตามกฎหมายที่เกี่ยวข้อง',
  'ข้าพเจ้ารับทราบว่าการส่งใบสมัครคัดเลือกฯ พร้อมเอกสารนี้ ยังไม่ได้รับการตรวจสอบคุณสมบัติตามหลักเกณฑ์ ประกาศรับสมัครคัดเลือก และเงื่อนไขต่างๆ โดยจะได้รับการตรวจสอบคุณสมบัติเมื่อเป็นผู้สอบผ่านข้อเขียนภาคความรู้ความสามารถที่ใช้เฉพาะตำแหน่งแล้วเท่านั้น',
];

// --- ข้อมูลฟอร์ม ---
interface ApplyForm {
  // ข้อมูลส่วนตัว
  citizenId: string;
  confirmCitizenId: string;
  prefix: string;
  firstName: string;
  lastName: string;
  nationality: string;
  religion: string;
  birthDate: string;
  phone: string;
  email: string;
  photo: string; // data URL ของรูปถ่าย
  photoKb: number; // ขนาดไฟล์รูป (KB)
  // วุฒิที่ใช้สมัครสอบ
  eduLevel: string;
  major: string;
  school: string;
  schoolType: string;
  gradDate: string;
  gpa: string;
  highestDegree: string;
  // ตำแหน่งปัจจุบัน
  workStatus: string;
  posName: string;
  salary: string;
  group: string;
  division: string;
  department: string;
  workPhone: string;
  // ที่อยู่
  addressNo: string;
  province: string;
  district: string;
  subDistrict: string;
  zipcode: string;
  sameAddress: boolean; // ที่อยู่ปัจจุบันตรงกับทะเบียนบ้าน
  curAddressNo: string;
  curProvince: string;
  curDistrict: string;
  curSubDistrict: string;
  curZipcode: string;
  // ผู้ติดต่อฉุกเฉิน
  contactPrefix: string;
  contactName: string;
  contactRelation: string;
  contactPhone: string;
  // คำรับรองและความยินยอม
  consent: boolean;
}

// ค่าเริ่มต้น (ตัวอย่างข้อมูล: สมชาย ใจดี — ผู้ปฏิบัติงานอื่นในกรุงเทพมหานคร)
const defaultForm = (): ApplyForm => ({
  citizenId: '',
  confirmCitizenId: '',
  prefix: 'นาย',
  firstName: 'สมชาย',
  lastName: 'ใจดี',
  nationality: 'ไทย',
  religion: 'พุทธ',
  birthDate: '',
  phone: '',
  email: '',
  photo: '',
  photoKb: 0,
  eduLevel: 'ปริญญาตรี',
  major: '',
  school: '',
  schoolType: 'รัฐ',
  gradDate: '',
  gpa: '',
  highestDegree: '',
  workStatus: 'ผู้ปฏิบัติงานอื่นในกรุงเทพมหานคร',
  posName: '',
  salary: '',
  group: '',
  division: '',
  department: '',
  workPhone: '',
  addressNo: '',
  province: 'กรุงเทพมหานคร',
  district: '',
  subDistrict: '',
  zipcode: '',
  sameAddress: true,
  curAddressNo: '',
  curProvince: 'กรุงเทพมหานคร',
  curDistrict: '',
  curSubDistrict: '',
  curZipcode: '',
  contactPrefix: 'นาง',
  contactName: '',
  contactRelation: '',
  contactPhone: '',
  consent: false,
});

const form = ref<ApplyForm>(defaultForm());

// --- ประวัติการทำงานกับ กทม. (ระบบดึงจากทะเบียนประวัติอัตโนมัติ + ผู้สมัครเพิ่มเองได้) ---
interface WorkHistoryRow {
  position: string;
  type: string;
  startDate: string;
  endDate: string;
  duration: string;
}
const workHistory = ref<WorkHistoryRow[]>([]);

// --- ฟอร์มเพิ่มประวัติการทำงาน (inline ในการ์ดที่ 4) ---
const showWorkHistoryForm = ref(false);
const workDraft = ref({ position: '', type: 'ลูกจ้างประจำ', startDate: '', endDate: '', isCurrent: false });
const workDraftError = ref('');

// วันที่แบบไทย เช่น '25 มี.ค. 2568' (สำหรับแสดงในตาราง)
const THAI_MONTHS_ABBR = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const formatThaiDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return `${d.getDate()} ${THAI_MONTHS_ABBR[d.getMonth()]} ${d.getFullYear() + 543}`;
};
// ระยะเวลาแบบ ปี/เดือน เช่น '2 ปี 3 เดือน' (นับวันเริ่มต้นเป็นเดือนเต็ม)
const durationBetween = (startIso: string, endIso: string) => {
  const start = new Date(startIso);
  const end = new Date(endIso);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return '-';
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  if (end.getDate() < start.getDate()) months--;
  if (months < 0) {
    years--;
    months += 12;
  }
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ปี`);
  if (months > 0) parts.push(`${months} เดือน`);
  return parts.join(' ') || 'น้อยกว่า 1 เดือน';
};

const openWorkHistoryForm = () => {
  workDraft.value = { position: '', type: 'ลูกจ้างประจำ', startDate: '', endDate: '', isCurrent: false };
  workDraftError.value = '';
  showWorkHistoryForm.value = true;
};
const addWorkHistory = () => {
  const { position, startDate, endDate, isCurrent } = workDraft.value;
  if (!position.trim()) {
    workDraftError.value = 'กรุณากรอกชื่อตำแหน่ง';
    return;
  }
  if (!startDate) {
    workDraftError.value = 'กรุณาระบุวันที่เริ่มต้น';
    return;
  }
  const endIso = isCurrent ? new Date().toISOString() : endDate;
  if (!isCurrent && (!endDate || (endDate && new Date(endDate) < new Date(startDate)))) {
    workDraftError.value = 'กรุณาระบุวันที่สิ้นสุดให้ถูกต้อง (ไม่ก่อนวันที่เริ่มต้น)';
    return;
  }
  workHistory.value.push({
    position: position.trim(),
    type: workDraft.value.type,
    startDate: formatThaiDate(startDate),
    endDate: isCurrent ? 'ปัจจุบัน' : formatThaiDate(endDate),
    duration: durationBetween(startDate, endIso),
  });
  showWorkHistoryForm.value = false;
  show('เพิ่มประวัติการทำงานเรียบร้อยแล้ว');
};
const removeWorkHistory = (index: number) => {
  workHistory.value.splice(index, 1);
};

// --- อายุ (คำนวณจากวันเกิด) ---
const age = computed(() => {
  if (!form.value.birthDate) return '';
  const birth = new Date(form.value.birthDate);
  if (Number.isNaN(birth.getTime())) return '';
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) years--;
  return years > 0 ? String(years) : '';
});

// --- รูปถ่าย: ยอมรับเฉพาะ JPG ขนาด 40–100 KB ---
const PHOTO_MIN_BYTES = 40 * 1024;
const PHOTO_MAX_BYTES = 100 * 1024;
const photoInput = ref<HTMLInputElement | null>(null);
const photoError = ref('');
const onPhotoChosen = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  photoError.value = '';
  if (!file) return;
  if (file.type !== 'image/jpeg') {
    photoError.value = 'รองรับเฉพาะไฟล์ภาพ JPG เท่านั้น';
    return;
  }
  if (file.size < PHOTO_MIN_BYTES || file.size > PHOTO_MAX_BYTES) {
    photoError.value = `ขนาดไฟล์ต้องอยู่ระหว่าง 40–100 KB (ไฟล์ที่เลือก ${Math.round(file.size / 1024)} KB)`;
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    form.value.photo = reader.result as string;
    form.value.photoKb = Math.round(file.size / 1024);
    show('อัปโหลดรูปถ่ายสำเร็จ');
  };
  reader.onerror = () => {
    photoError.value = 'อ่านไฟล์รูปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
  };
  reader.readAsDataURL(file);
};
const removePhoto = () => {
  form.value.photo = '';
  form.value.photoKb = 0;
  photoError.value = '';
};

// --- ร่างแบบฟอร์ม: เก็บใน localStorage แยกตามประกาศ/ตำแหน่ง และกู้คืนเมื่อเปิดหน้าใหม่ ---
const draftKey = `g-hr:apply-draft:${props.announcement?.id ?? 'none'}:${props.position}`;
const draftSavedAt = ref('');
const loadDraft = () => {
  try {
    const raw = localStorage.getItem(draftKey);
    if (!raw) return;
    const saved = JSON.parse(raw) as { form?: Partial<ApplyForm>; workHistory?: WorkHistoryRow[]; savedAt?: string };
    if (saved.form) form.value = { ...defaultForm(), ...saved.form };
    if (saved.workHistory) workHistory.value = saved.workHistory;
    if (saved.savedAt) draftSavedAt.value = saved.savedAt;
  } catch {
    /* ข้อมูลร่างเสียหาย — เริ่มฟอร์มใหม่ตามค่าเริ่มต้น */
  }
};
loadDraft();
const saveDraft = () => {
  const savedAt = new Date().toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' });
  try {
    localStorage.setItem(draftKey, JSON.stringify({ form: form.value, workHistory: workHistory.value, savedAt }));
    draftSavedAt.value = savedAt;
    show('บันทึกข้อมูลเรียบร้อย (ร่าง)');
  } catch {
    show('บันทึกร่างไม่สำเร็จ — พื้นที่จัดเก็บเบราว์เซอร์เต็ม');
  }
};
const clearDraft = () => {
  try {
    localStorage.removeItem(draftKey);
  } catch {
    /* ไม่มีผลต่อการส่งใบสมัคร */
  }
  draftSavedAt.value = '';
};

// --- ตรวจสอบความครบถ้วนก่อนส่งใบสมัคร (คืนข้อความ error แรก + id การ์ดที่ต้องแก้) ---
const invalidCard = ref('');
const highlightCard = (cardId: string) => {
  invalidCard.value = cardId;
  document.getElementById(cardId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.setTimeout(() => {
    if (invalidCard.value === cardId) invalidCard.value = '';
  }, 4000);
};
const validate = (): { cardId: string; message: string } | null => {
  const digits = (s: string) => s.replace(/\D/g, '');
  if (!form.value.photo) return { cardId: 'card-personal', message: 'กรุณาอัปโหลดรูปถ่ายผู้สมัคร (JPG ขนาด 40–100 KB)' };
  if (digits(form.value.citizenId).length !== 13) return { cardId: 'card-personal', message: 'กรุณากรอกเลขประจำตัวประชาชนให้ครบถ้วน 13 หลัก' };
  if (digits(form.value.confirmCitizenId) !== digits(form.value.citizenId)) return { cardId: 'card-personal', message: 'ยืนยันเลขประจำตัวประชาชนไม่ตรงกับเลขประจำตัวประชาชนที่กรอกไว้' };
  if (!form.value.firstName.trim() || !form.value.lastName.trim()) return { cardId: 'card-personal', message: 'กรุณากรอกชื่อและนามสกุล (ภาษาไทย)' };
  if (!form.value.birthDate) return { cardId: 'card-personal', message: 'กรุณาระบุวัน/เดือน/ปี เกิด' };
  if (digits(form.value.phone).length < 9) return { cardId: 'card-personal', message: 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email.trim())) return { cardId: 'card-personal', message: 'กรุณากรอก E-mail address ให้ถูกต้อง' };
  if (!form.value.eduLevel || !form.value.major.trim() || !form.value.school.trim()) {
    return { cardId: 'card-education', message: 'กรุณากรอกวุฒิที่ใช้สมัครสอบ สาขาวิชา และชื่อสถานศึกษาให้ครบถ้วน' };
  }
  if (!form.value.province || !form.value.district.trim() || !form.value.subDistrict.trim()) {
    return { cardId: 'card-address', message: 'กรุณากรอกที่อยู่ตามทะเบียนบ้าน (จังหวัด เขต/อำเภอ แขวง/ตำบล) ให้ครบถ้วน' };
  }
  if (!form.value.contactName.trim() || digits(form.value.contactPhone).length < 9) {
    return { cardId: 'card-address', message: 'กรุณากรอกชื่อและเบอร์โทรศัพท์ของบุคคลที่สามารถติดต่อได้' };
  }
  if (!form.value.consent) return { cardId: 'card-consent', message: 'กรุณากดยอมรับคำรับรองและเงื่อนไขทุกประการก่อนส่งใบสมัคร' };
  return null;
};

// --- ส่งใบสมัคร: ตรวจสอบ → ล้างร่าง → กลับไปหน้าประกาศ (ระบบจำลอง ยังไม่มี backend) ---
const submitApplication = () => {
  const error = validate();
  if (error) {
    show(error.message);
    highlightCard(error.cardId);
    return;
  }
  clearDraft();
  show(`ส่งใบสมัคร${applyVerb.value}ตำแหน่ง ${props.position} เรียบร้อยแล้ว (ระบบจำลอง)`);
  goBackToAnnouncement();
};

// --- ย้อนกลับไปหน้ารายละเอียดประกาศ ---
const goBackToAnnouncement = () => {
  if (!props.announcement) {
    router.push('/recruitment_site');
    return;
  }
  router.push(`/recruitment_site/announcement/${props.announcement.id}`);
};
</script>
