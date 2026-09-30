<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5">
    <!-- Hero Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#002B7F] via-[#062058] to-[#021235] px-5 sm:px-8 py-7 text-white">
      <div class="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-blue-400/10 blur-2xl pointer-events-none" />
      <div class="absolute -bottom-24 -left-12 w-64 h-64 rounded-full bg-sky-400/10 blur-3xl pointer-events-none" />

      <div class="relative flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div class="min-w-0">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold text-blue-100">
            <Sparkles class="w-3 h-3" />
            Design System · G-HR
          </span>
          <h1 class="text-xl sm:text-2xl font-bold mt-3 tracking-tight">UI Component Library</h1>
          <p class="text-xs sm:text-sm text-blue-100/80 mt-1.5 max-w-xl leading-relaxed">
            ชุด component หลักของระบบ — ทุกหน้านำเข้าใช้จาก
            <code class="font-mono text-[11px] bg-white/10 px-1.5 py-0.5 rounded">src/components/ui</code>
            เพื่อให้หน้าตาเป็นแนวเดียวกัน คลิกปุ่มโค้ดเพื่อคัดลอกวิธีใช้
          </p>
        </div>

        <div class="flex gap-7 sm:gap-9 flex-shrink-0">
          <div>
            <div class="text-2xl font-bold">20</div>
            <div class="text-[10px] text-blue-100/70 mt-0.5">Components</div>
          </div>
          <div class="w-px bg-white/15" />
          <div>
            <div class="text-2xl font-bold">18</div>
            <div class="text-[10px] text-blue-100/70 mt-0.5">Sections</div>
          </div>
          <div class="w-px bg-white/15" />
          <div>
            <div class="text-2xl font-bold">5</div>
            <div class="text-[10px] text-blue-100/70 mt-0.5">หมวดหมู่</div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-start gap-6">
      <div class="flex-1 min-w-0 grid grid-cols-1 gap-4 items-start">

      <!-- ======================= Group: ธีม ======================= -->
      <div class="order-[1] scroll-mt-4 flex items-center gap-3">
        <div class="w-7 h-7 rounded-lg bg-blue-900 text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0">1</div>
        <h2 class="text-sm font-bold text-slate-800 whitespace-nowrap">ธีม</h2>
        <span class="text-[10px] text-slate-400 whitespace-nowrap">3 รายการ</span>
        <div class="h-px bg-slate-200 flex-1" />
      </div>

      <!-- ======================= Theme Builder ======================= -->
       <UiCard id="sec-theme" class="order-[2] scroll-mt-4 ">
        <template #header>
          <UiToolbar>
            <template #start>
              <div class="flex items-start gap-2.5 min-w-0">
                <div class="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <Palette class="w-3.5 h-3.5 text-blue-700" />
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-slate-800 tracking-tight">Theme Builder</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">ทดลองเลือกสีหลัก (brand color) — พรีวิวปุ่ม/badge/แท็บ/ไอคอนเปลี่ยนตามสีที่เลือกแบบเรียลไทม์</p>
              </div>
              </div>
            </template>
            <template #end>
              <button type="button" class="group inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900 text-slate-300 font-mono text-[10px] hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0" title="คัดลอกโค้ด" @click='copyCode(`inline style จาก hex color`)'>
                <span>inline style จาก hex color</span>
                <Copy class="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </template>
          </UiToolbar>
        </template>
        <div class="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <span class="text-[11px] font-medium text-slate-500">เลือกสีหลัก</span>
            <div class="flex flex-wrap gap-2 mt-2.5">
              <button
                v-for="c in brandColors"
                :key="c.value"
                type="button"
                class="w-9 h-9 rounded-lg transition-transform cursor-pointer"
                :class="brandColor === c.value ? 'border-2 border-slate-800 scale-110' : 'ring-1 ring-slate-200'"
                :style="{ backgroundColor: c.value }"
                :title="`${c.name} (${c.value})`"
                @click="brandColor = c.value"
              >
                <Check v-if="brandColor === c.value" class="w-4 h-4 text-white mx-auto" />
              </button>
            </div>
            <div class="mt-3 text-[11px] font-mono text-slate-400">
              currentColor: <span class="text-slate-600">{{ brandColor }}</span>
            </div>
            <div class="mt-3 text-[11px] text-slate-400 leading-relaxed">
              สีหลักของระบบปัจจุบันคือ BMA Navy <code class="font-mono">#002B7F</code> กำหนดใน <code class="font-mono">src/index.css</code> (โทน bma-*)
            </div>
          </div>

          <div class="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-white text-xs font-medium shadow-xs cursor-pointer"
                :style="{ backgroundColor: brandColor }"
              >
                <Plus class="w-4 h-4" />
                ปุ่มหลัก
              </button>
              <span
                class="px-2 py-0.5 rounded-full text-[11px] font-medium border inline-flex items-center"
                :style="{ color: brandColor, backgroundColor: `${brandColor}14`, borderColor: `${brandColor}33` }"
              >
                badge ตามสีหลัก
              </span>
              <span class="text-xs font-medium underline-offset-2 cursor-pointer" :style="{ color: brandColor }">
                ลิงก์สีหลัก
              </span>
            </div>

            <div class="flex gap-4 border-b border-slate-200 text-xs">
              <span class="pb-2 border-b-2 font-medium" :style="{ color: brandColor, borderColor: brandColor }">
                แท็บที่เลือก
              </span>
              <span class="pb-2 text-slate-400">แท็บอื่น</span>
            </div>

            <div class="flex items-center gap-3 rounded-xl bg-white border border-slate-200 p-3.5">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" :style="{ backgroundColor: `${brandColor}14`, color: brandColor }">
                <Building2 class="w-5 h-5" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-xs font-bold text-slate-800">พรีวิวการ์ดสถิติ</div>
                <div class="text-[11px] text-slate-400 mt-0.5">ไอคอน ตัวเลข และลิงก์ เปลี่ยนตามสีหลัก</div>
              </div>
              <div class="text-2xl font-bold" :style="{ color: brandColor }">685</div>
            </div>
          </div>
        </div>
      </UiCard>

      <!-- ======================= Typography ======================= -->
      <UiCard id="sec-typography" class="order-[3] scroll-mt-4">
        <template #header>
          <UiToolbar>
            <template #start>
              <div class="flex items-start gap-2.5 min-w-0">
                <div class="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <Type class="w-3.5 h-3.5 text-blue-700" />
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-slate-800 tracking-tight">Typography</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">ฟอนต์หลัก Prompt — ขนาดและน้ำหนักที่ใช้ในระบบ</p>
              </div>
              </div>
            </template>
            <template #end>
              <button type="button" class="group inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900 text-slate-300 font-mono text-[10px] hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0" title="คัดลอกโค้ด" @click='copyCode(`font-sans · font-mono`)'>
                <span>font-sans · font-mono</span>
                <Copy class="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </template>
          </UiToolbar>
        </template>
        <div class="p-4 sm:p-5 space-y-2.5">
          <h1 class="text-xl font-bold text-slate-900 tracking-tight">หัวข้อหลัก — text-xl font-bold</h1>
          <h2 class="text-base font-bold text-slate-900">หัวข้อรอง — text-base font-bold</h2>
          <h3 class="text-sm font-semibold text-slate-800">หัวข้อย่อย — text-sm font-semibold</h3>
          <p class="text-xs text-slate-600 leading-relaxed">
            เนื้อความปกติ — text-xs text-slate-600: ระบบบริหารทรัพยากรบุคคลภาครัฐ (G-HR) ใช้ฟอนต์ Prompt เป็นหลัก
          </p>
          <p class="text-[11px] text-slate-400">ข้อความเสริม — text-[11px] text-slate-400</p>
          <p class="text-xs font-mono text-slate-700">ข้อความโมโน — font-mono: สนบ. 399 · REQ-2569-0915-0042</p>
          <p class="text-xs">
            <a class="text-blue-700 hover:text-blue-900 font-medium underline-offset-2 hover:underline cursor-pointer">ลิงก์ — text-blue-700 hover:underline</a>
          </p>
        </div>
      </UiCard>

      <!-- ======================= Shadows ======================= -->
      <UiCard id="sec-shadows" class="order-[4] scroll-mt-4">
        <template #header>
          <UiToolbar>
            <template #start>
              <div class="flex items-start gap-2.5 min-w-0">
                <div class="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <Box class="w-3.5 h-3.5 text-blue-700" />
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-slate-800 tracking-tight">Shadows</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">ระดับเงาที่ใช้ในระบบ — เรียงจากเบาสุดไปหนักสุด</p>
              </div>
              </div>
            </template>
            <template #end>
              <button type="button" class="group inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900 text-slate-300 font-mono text-[10px] hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0" title="คัดลอกโค้ด" @click='copyCode(`shadow-2xs … shadow-lg`)'>
                <span>shadow-2xs … shadow-lg</span>
                <Copy class="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </template>
          </UiToolbar>
        </template>
        <div class="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div
            v-for="s in shadowSamples"
            :key="s"
            class="h-16 rounded-xl bg-white border border-slate-100 flex items-center justify-center"
            :class="s"
          >
            <span class="text-[11px] font-mono text-slate-600">{{ s }}</span>
          </div>
        </div>
      </UiCard>

      <!-- ======================= Group: พื้นฐาน ======================= -->
      <div class="order-[5] scroll-mt-4 flex items-center gap-3">
        <div class="w-7 h-7 rounded-lg bg-blue-900 text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0">2</div>
        <h2 class="text-sm font-bold text-slate-800 whitespace-nowrap">พื้นฐาน</h2>
        <span class="text-[10px] text-slate-400 whitespace-nowrap">3 รายการ</span>
        <div class="h-px bg-slate-200 flex-1" />
      </div>

      <!-- ======================= UiButton ======================= -->
      <UiCard id="sec-button" class="order-[6] scroll-mt-4">
        <template #header>
          <UiToolbar>
            <template #start>
              <div class="flex items-start gap-2.5 min-w-0">
                <div class="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <MousePointerClick class="w-3.5 h-3.5 text-blue-700" />
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-slate-800 tracking-tight">UiButton</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">variants: primary · success · accent · outline · ghost / sizes: xs · sm · md</p>
              </div>
              </div>
            </template>
            <template #end>
              <button type="button" class="group inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900 text-slate-300 font-mono text-[10px] hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0" title="คัดลอกโค้ด" @click='copyCode(`&lt;UiButton variant="primary" /&gt;`)'>
                <span>&lt;UiButton variant="primary" /&gt;</span>
                <Copy class="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </template>
          </UiToolbar>
        </template>
        <div class="p-4 sm:p-5 space-y-4">
          <div class="flex flex-wrap items-center gap-2">
            <UiButton variant="primary">Primary</UiButton>
            <UiButton variant="success">Success</UiButton>
            <UiButton variant="accent">Accent</UiButton>
            <UiButton variant="outline">Outline</UiButton>
            <UiButton variant="ghost">Ghost</UiButton>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <UiButton variant="primary" size="xs">XS</UiButton>
            <UiButton variant="primary" size="sm">SM (ค่าเริ่มต้น)</UiButton>
            <UiButton variant="primary" size="md">MD</UiButton>
            <UiButton variant="primary" disabled>ปุ่มปิดใช้งาน</UiButton>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <UiButton variant="primary" @click="notify('UiButton primary ถูกคลิก')">
              <template #icon>
                <Plus class="w-4 h-4" />
              </template>
              พร้อมไอคอน
            </UiButton>
            <UiButton variant="outline" @click="notify('UiButton outline ถูกคลิก')">
              <template #icon>
                <RotateCw class="w-4 h-4 text-slate-500" />
              </template>
              รีเฟรชข้อมูล
            </UiButton>
          </div>
        </div>
      </UiCard>

      <!-- ======================= UiBadge ======================= -->
      <UiCard id="sec-badge" class="order-[7] scroll-mt-4">
        <template #header>
          <UiToolbar>
            <template #start>
              <div class="flex items-start gap-2.5 min-w-0">
                <div class="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <Tags class="w-3.5 h-3.5 text-blue-700" />
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-slate-800 tracking-tight">UiBadge</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">tones: slate · blue · emerald · amber · red · teal · outline / shapes: pill · chip / dot · mono</p>
              </div>
              </div>
            </template>
            <template #end>
              <button type="button" class="group inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900 text-slate-300 font-mono text-[10px] hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0" title="คัดลอกโค้ด" @click='copyCode(`&lt;UiBadge tone="emerald" /&gt;`)'>
                <span>&lt;UiBadge tone="emerald" /&gt;</span>
                <Copy class="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </template>
          </UiToolbar>
        </template>
        <div class="p-4 sm:p-5 space-y-3">
          <div class="flex flex-wrap items-center gap-2">
            <UiBadge tone="slate">ปกติ</UiBadge>
            <UiBadge tone="blue">อนุมัติ</UiBadge>
            <UiBadge tone="emerald">ตรวจสอบแล้ว</UiBadge>
            <UiBadge tone="amber">รอพิจารณา</UiBadge>
            <UiBadge tone="red">ยกเลิก</UiBadge>
            <UiBadge tone="teal">ใหม่</UiBadge>
            <UiBadge tone="outline">ทั่วไป</UiBadge>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <UiBadge tone="blue" dot>มีจุดสถานะ</UiBadge>
            <UiBadge tone="emerald" dot>กำลังทำงาน</UiBadge>
            <UiBadge tone="amber" dot>รอดำเนินการ</UiBadge>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <UiBadge tone="outline" shape="chip" mono>สนบ. 399</UiBadge>
            <UiBadge tone="slate" shape="chip">หัวหน้า</UiBadge>
            <UiBadge tone="blue" shape="chip">685</UiBadge>
            <UiBadge tone="blue" size="sm">size sm</UiBadge>
          </div>
        </div>
      </UiCard>

      <!-- ======================= UiIconButton + UiToggleGroup ======================= -->
      <UiCard id="sec-icon-toggle" class="order-[8] scroll-mt-4">
        <template #header>
          <UiToolbar>
            <template #start>
              <div class="flex items-start gap-2.5 min-w-0">
                <div class="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <Shapes class="w-3.5 h-3.5 text-blue-700" />
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-slate-800 tracking-tight">UiIconButton · UiToggleGroup</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">ปุ่มไอคอนและสวิตช์ segmented control (tone: outline / ghost)</p>
              </div>
              </div>
            </template>
            <template #end>
              <button type="button" class="group inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900 text-slate-300 font-mono text-[10px] hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0" title="คัดลอกโค้ด" @click='copyCode(`&lt;UiToggleGroup v-model="..." /&gt;`)'>
                <span>&lt;UiToggleGroup v-model="..." /&gt;</span>
                <Copy class="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </template>
          </UiToolbar>
        </template>
        <div class="p-4 sm:p-5 space-y-4">
          <div class="flex flex-wrap items-center gap-2">
            <UiIconButton title="ปุ่มไอคอน (outline)">
              <LayoutGrid class="w-4 h-4" />
            </UiIconButton>
            <UiIconButton tone="ghost" title="ปุ่มไอคอน (ghost)">
              <LayoutGrid class="w-4 h-4" />
            </UiIconButton>
          </div>

          <div class="space-y-1.5">
            <span class="text-[11px] text-slate-400">แบบไอคอน (size sm) — เลือกอยู่: {{ demoView }}</span>
            <div>
              <UiToggleGroup v-model="demoView" :items="viewItems" size="sm" />
            </div>
          </div>

          <div class="space-y-1.5">
            <span class="text-[11px] text-slate-400">แบบมีข้อความ + จุดสถานะ (size md) — เลือกอยู่: {{ demoScope }}</span>
            <UiToggleGroup v-model="demoScope" :items="scopeItems" size="md" />
          </div>
        </div>
      </UiCard>

      <!-- ======================= Group: ฟอร์มและการนำทาง ======================= -->
      <div class="order-[9] scroll-mt-4 flex items-center gap-3">
        <div class="w-7 h-7 rounded-lg bg-blue-900 text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0">3</div>
        <h2 class="text-sm font-bold text-slate-800 whitespace-nowrap">ฟอร์มและการนำทาง</h2>
        <span class="text-[10px] text-slate-400 whitespace-nowrap">4 รายการ</span>
        <div class="h-px bg-slate-200 flex-1" />
      </div>

      <!-- ======================= Form controls ======================= -->
      <UiCard id="sec-form" class="order-[10] scroll-mt-4">
        <template #header>
          <UiToolbar>
            <template #start>
              <div class="flex items-start gap-2.5 min-w-0">
                <div class="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <FormInput class="w-3.5 h-3.5 text-blue-700" />
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-slate-800 tracking-tight">UiSearchInput · UiSelect · UiCheckbox</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">ช่องค้นหา (มีปุ่มล้างอัตโนมัติ) · dropdown · checkbox — ใช้ v-model</p>
              </div>
              </div>
            </template>
            <template #end>
              <button type="button" class="group inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900 text-slate-300 font-mono text-[10px] hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0" title="คัดลอกโค้ด" @click='copyCode(`&lt;UiSelect v-model="..." :options /&gt;`)'>
                <span>&lt;UiSelect v-model="..." :options /&gt;</span>
                <Copy class="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </template>
          </UiToolbar>
        </template>
        <div class="p-4 sm:p-5 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <span class="text-[11px] text-slate-400">UiSearchInput (size md)</span>
              <UiSearchInput v-model="demoSearch" placeholder="ค้นหาข้อมูล..." />
            </div>
            <div class="space-y-1.5">
              <span class="text-[11px] text-slate-400">size lg — ค่าปัจจุบัน: {{ demoSearch || '(ว่าง)' }}</span>
              <UiSearchInput v-model="demoSearch" placeholder="พิมพ์เพื่อทดสอบ..." size="lg" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
            <UiInput
              v-model="demoInput"
              label="UiInput พร้อม label"
              placeholder="กรอกข้อความ..."
            />
            <UiInput
              v-model="demoInputDisabled"
              label="แบบ disabled"
              placeholder="กรอกข้อมูลไม่ได้"
              disabled
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
            <UiSelect
              v-model="demoSelect"
              label="UiSelect พร้อม label"
              :options="[
                { value: 'name', label: 'ชื่อ - นามสกุล' },
                { value: 'position', label: 'เลขที่ตำแหน่ง' },
                { value: 'department', label: 'สังกัด' },
              ]"
            />
            <div class="flex items-center gap-2">
              <span class="text-[11px] text-slate-400">แบบ fit:</span>
              <UiSelect
                v-model="demoPageSize"
                :options="[
                  { value: 10, label: '10' },
                  { value: 20, label: '20' },
                  { value: 50, label: '50' },
                ]"
                size="sm"
                fit
              />
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-4 pt-1">
            <UiCheckbox v-model="demoCheck1">แสดงตำแหน่งว่าง ({{ demoCheck1 }})</UiCheckbox>
            <UiCheckbox v-model="demoCheck2">เฉพาะทดลองปฏิบัติงาน ({{ demoCheck2 }})</UiCheckbox>
          </div>
        </div>
      </UiCard>

      <!-- ======================= Dropdown Button ======================= -->
      <UiCard id="sec-dropdown" class="order-[11] scroll-mt-4">
        <template #header>
          <UiToolbar>
            <template #start>
              <div class="flex items-start gap-2.5 min-w-0">
                <div class="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <ChevronsUpDown class="w-3.5 h-3.5 text-blue-700" />
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-slate-800 tracking-tight">UiDropdownButton</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">ปุ่มที่มีเมนูตัวเลือก — ปิดเองเมื่อคลิกนอกเมนู, รองรับ icon ต่อรายการ</p>
              </div>
              </div>
            </template>
            <template #end>
              <button type="button" class="group inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900 text-slate-300 font-mono text-[10px] hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0" title="คัดลอกโค้ด" @click='copyCode(`&lt;UiDropdownButton :items @select /&gt;`)'>
                <span>&lt;UiDropdownButton :items @select /&gt;</span>
                <Copy class="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </template>
          </UiToolbar>
        </template>
        <div class="p-4 sm:p-5 flex flex-wrap items-center gap-3">
          <UiDropdownButton
            label="ดำเนินการ"
            menu-title="เลือกรายการ"
            :items="dropdownItems"
            @select="notify(`เลือก: ${$event.label}`)"
          >
            <template #icon>
              <Download class="w-3.5 h-3.5 text-slate-500" />
            </template>
          </UiDropdownButton>

          <UiDropdownButton
            label="สร้างใหม่"
            variant="primary"
            :items="createItems"
            @select="notify(`สร้าง: ${$event.label}`)"
          />
        </div>
      </UiCard>

      <!-- ======================= Tabs ======================= -->
      <UiCard id="sec-tabs" class="order-[12] scroll-mt-4">
        <template #header>
          <UiToolbar>
            <template #start>
              <div class="flex items-start gap-2.5 min-w-0">
                <div class="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <PanelTop class="w-3.5 h-3.5 text-blue-700" />
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-slate-800 tracking-tight">UiTabs</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">แถบแท็บ (v-model + items) — สลับเนื้อหาด้วย v-if ตามค่าที่เลือก</p>
              </div>
              </div>
            </template>
            <template #end>
              <button type="button" class="group inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900 text-slate-300 font-mono text-[10px] hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0" title="คัดลอกโค้ด" @click='copyCode(`&lt;UiTabs v-model="tab" :items /&gt;`)'>
                <span>&lt;UiTabs v-model="tab" :items /&gt;</span>
                <Copy class="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </template>
          </UiToolbar>
        </template>
        <div class="p-4 sm:p-5 space-y-3">
          <UiTabs
            v-model="demoTab"
            :items="[
              { value: 'overview', label: 'ภาพรวม' },
              { value: 'positions', label: 'ตำแหน่ง', count: 4 },
              { value: 'history', label: 'ประวัติ', count: 12 },
            ]"
          />
          <div class="text-xs text-slate-600 leading-relaxed pt-1">
            <p v-if="demoTab === 'overview'">
              ภาพรวมของหน่วยงาน — จำนวนอัตราทั้งหมด, อัตรากำลังที่มีผู้ครอง และตำแหน่งว่างในโครงสร้างปัจจุบัน
            </p>
            <p v-else-if="demoTab === 'positions'">
              รายการตำแหน่งทั้งหมดในหน่วยงาน พร้อมผู้ครองตำแหน่งและระดับตำแหน่ง
            </p>
            <p v-else>
              ประวัติการแก้ไขข้อมูลล่าสุด 12 รายการ พร้อมผู้บันทึกและเวลา
            </p>
          </div>
        </div>
      </UiCard>

      <!-- ======================= Breadcrumbs ======================= -->
      <UiCard id="sec-breadcrumbs" class="order-[13] scroll-mt-4">
        <template #header>
          <UiToolbar>
            <template #start>
              <div class="flex items-start gap-2.5 min-w-0">
                <div class="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <Route class="w-3.5 h-3.5 text-blue-700" />
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-slate-800 tracking-tight">UiBreadcrumbs</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">ผังเดินทางของหน้า — รายการสุดท้ายเป็นหน้าปัจจุบัน, event @select สำหรับย้อนกลับ</p>
              </div>
              </div>
            </template>
            <template #end>
              <button type="button" class="group inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900 text-slate-300 font-mono text-[10px] hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0" title="คัดลอกโค้ด" @click='copyCode(`&lt;UiBreadcrumbs :items @select /&gt;`)'>
                <span>&lt;UiBreadcrumbs :items @select /&gt;</span>
                <Copy class="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </template>
          </UiToolbar>
        </template>
        <div class="p-4 sm:p-5 space-y-3">
          <UiBreadcrumbs :items="breadcrumbItems" @select="notify(`ย้อนกลับไป: ${$event.label}`)" />
          <p class="text-[11px] text-slate-400">
            คลิกรายการก่อนหน้าเพื่อย้อนกลับ — รายการสุดท้ายคือหน้าปัจจุบัน (แสดงเป็นข้อความเน้น)
          </p>
        </div>
      </UiCard>

      <!-- ======================= Group: การแสดงข้อมูล ======================= -->
      <div class="order-[14] scroll-mt-4 flex items-center gap-3">
        <div class="w-7 h-7 rounded-lg bg-blue-900 text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0">4</div>
        <h2 class="text-sm font-bold text-slate-800 whitespace-nowrap">การแสดงข้อมูล</h2>
        <span class="text-[10px] text-slate-400 whitespace-nowrap">6 รายการ</span>
        <div class="h-px bg-slate-200 flex-1" />
      </div>

      <!-- ======================= UiCard · UiToolbar ======================= -->
      <UiCard id="sec-card" class="order-[15] scroll-mt-4">
        <template #header>
          <UiToolbar>
            <template #start>
              <div class="flex items-start gap-2.5 min-w-0">
                <div class="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <Layers class="w-3.5 h-3.5 text-blue-700" />
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-slate-800 tracking-tight">UiCard · UiToolbar</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">container หลัก (slot header / footer) และแถวเครื่องมือ (slot start / end)</p>
              </div>
              </div>
            </template>
            <template #end>
              <button type="button" class="group inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900 text-slate-300 font-mono text-[10px] hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0" title="คัดลอกโค้ด" @click='copyCode(`&lt;UiCard&gt; #header + #footer &lt;/UiCard&gt;`)'>
                <span>&lt;UiCard&gt; #header + #footer &lt;/UiCard&gt;</span>
                <Copy class="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </template>
          </UiToolbar>
        </template>

        <div class="p-4 sm:p-5 space-y-4">
          <UiToolbar>
            <template #start>
              <UiButton variant="success">
                <template #icon>
                  <Plus class="w-4 h-4" />
                </template>
                เพิ่มรายการ
              </UiButton>
              <UiIconButton title="เรียงลำดับ">
                <ArrowUpDown class="w-4 h-4" />
              </UiIconButton>
            </template>
            <template #end>
              <UiSearchInput v-model="demoToolbarSearch" placeholder="ค้นหาใน toolbar..." class="w-52" />
            </template>
          </UiToolbar>

          <div class="rounded-xl border border-slate-200/90 overflow-hidden">
            <div class="p-4 bg-slate-50/50 text-xs text-slate-600 leading-relaxed">
              ตัวอย่างเนื้อหาภายใน UiCard แบบมี header และ footer — ทุกหน้าควรใช้ UiCard เป็น container หลักแทนการเขียน class <code class="font-mono text-[10px]">bg-white rounded-xl border...</code> เอง
            </div>
            <div class="px-4 py-2.5 border-t border-slate-100 text-[11px] text-slate-400">
              ส่วนนี้คือ slot "footer"
            </div>
          </div>
        </div>
      </UiCard>

      <!-- ======================= UiStatCard ======================= -->
      <UiCard id="sec-stat" class="order-[16] scroll-mt-4">
        <template #header>
          <UiToolbar>
            <template #start>
              <div class="flex items-start gap-2.5 min-w-0">
                <div class="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <BarChart3 class="w-3.5 h-3.5 text-blue-700" />
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-slate-800 tracking-tight">UiStatCard</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">การ์ดสถิติ — tones: blue · emerald · teal · amber (hint-accent = ข้อความเน้นสีเขียว)</p>
              </div>
              </div>
            </template>
            <template #end>
              <button type="button" class="group inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900 text-slate-300 font-mono text-[10px] hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0" title="คัดลอกโค้ด" @click='copyCode(`&lt;UiStatCard :icon :value /&gt;`)'>
                <span>&lt;UiStatCard :icon :value /&gt;</span>
                <Copy class="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </template>
          </UiToolbar>
        </template>
        <div class="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <UiStatCard title="ตำแหน่งทั้งหมด" hint="โครงสร้างปัจจุบัน" :value="6" unit="อัตรา" tone="blue" :icon="Briefcase" />
          <UiStatCard title="ตำแหน่งที่มีผู้ครอง" hint="67% ครองตำแหน่ง" hint-accent :value="4" unit="อัตรา" tone="emerald" :icon="UserCheck" />
          <UiStatCard title="ตำแหน่งว่าง" hint="ไม่มีผู้ครอง" :value="2" unit="อัตรา" tone="teal" :icon="ShieldCheck" />
          <UiStatCard title="รายการรอดำเนินการ" hint="ภายใน 7 วัน" :value="12" unit="รายการ" tone="amber" :icon="Clock" />
          <UiStatCard layout="vertical" title="แนวตั้ง (พื้นที่แคบ)" hint="สำหรับเรียงหลายการ์ด" :value="42" unit="รายการ" tone="blue" :icon="Briefcase" />
          <UiStatCard layout="vertical" title="แนวตั้ง" hint-accent hint="เน้นสี hint ได้" :value="8" unit="อัตรา" tone="emerald" :icon="UserCheck" />
        </div>
      </UiCard>

      <!-- ======================= Table ======================= -->
       <UiCard id="sec-table" class="order-[17] scroll-mt-4 ">
        <template #header>
          <UiToolbar>
            <template #start>
              <div class="flex items-start gap-2.5 min-w-0">
                <div class="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <Table class="w-3.5 h-3.5 text-blue-700" />
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-slate-800 tracking-tight">Table (AppTable)</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">ตารางข้อมูลแบบ generic — ค้นหา / custom cell slots / row click</p>
              </div>
              </div>
            </template>
            <template #end>
              <button type="button" class="group inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900 text-slate-300 font-mono text-[10px] hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0" title="คัดลอกโค้ด" @click='copyCode(`&lt;AppTable :columns :data /&gt;`)'>
                <span>&lt;AppTable :columns :data /&gt;</span>
                <Copy class="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </template>
          </UiToolbar>
        </template>
        <AppTable
          :columns="tableColumns"
          :data="tableRows"
          row-key="id"
          :row-clickable="true"
          :show-toolbar="true"
          :searchable="true"
          v-model:search-query="tableSearch"
          search-placeholder="ค้นหาชื่อ หรือตำแหน่ง..."
          empty-text="ไม่พบข้อมูล"
          @row-click="notify(`เลือก: ${$event.name}`)"
        />
      </UiCard>
      <!-- ======================= List and List Items ======================= -->
      <UiCard id="sec-list" class="order-[18] scroll-mt-4">
        <template #header>
          <UiToolbar>
            <template #start>
              <div class="flex items-start gap-2.5 min-w-0">
                <div class="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <List class="w-3.5 h-3.5 text-blue-700" />
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-slate-800 tracking-tight">UiList · UiListItem</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">รายการแนวตั้ง — slots: leading / title / subtitle / trailing, ตั้ง clickable ได้</p>
              </div>
              </div>
            </template>
            <template #end>
              <button type="button" class="group inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900 text-slate-300 font-mono text-[10px] hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0" title="คัดลอกโค้ด" @click='copyCode(`&lt;UiList&gt; &lt;UiListItem /&gt; &lt;/UiList&gt;`)'>
                <span>&lt;UiList&gt; &lt;UiListItem /&gt; &lt;/UiList&gt;</span>
                <Copy class="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </template>
          </UiToolbar>
        </template>
        <div class="p-4 sm:p-5">
          <UiList>
            <UiListItem clickable @click="notify('เปิดข้อความ: ลงเวลากรณีพิเศษ')">
              <template #leading>
                <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Mail class="w-4 h-4 text-blue-700" />
                </div>
              </template>
              <template #title>ลงเวลากรณีพิเศษ</template>
              <template #subtitle>การขอลงเวลาได้รับการอนุมัติแล้ว · 10:24 น.</template>
              <template #trailing>
                <UiBadge tone="emerald">อนุมัติ</UiBadge>
              </template>
            </UiListItem>
            <UiListItem clickable @click="notify('เปิดข้อความ: ประเมินผลงาน')">
              <template #leading>
                <div class="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Bell class="w-4 h-4 text-amber-600" />
                </div>
              </template>
              <template #title>รอบการประเมินผลงานประจำปี</template>
              <template #subtitle>กรุณาประเมินผลงานภายใน 30 ก.ย. 2569</template>
              <template #trailing>
                <UiBadge tone="amber">รอดำเนินการ</UiBadge>
              </template>
            </UiListItem>
            <UiListItem>
              <template #leading>
                <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <FolderOpen class="w-4 h-4 text-slate-500" />
                </div>
              </template>
              <template #title>เอกสารแนบคำสั่ง</template>
              <template #subtitle>แฟ้มเอกสาร · 3 ไฟล์</template>
              <template #trailing>
                <ChevronRight class="w-4 h-4 text-slate-300" />
              </template>
            </UiListItem>
          </UiList>
        </div>
      </UiCard>

      <!-- ======================= Tree ======================= -->
      <UiCard id="sec-tree" class="order-[19] scroll-mt-4">
        <template #header>
          <UiToolbar>
            <template #start>
              <div class="flex items-start gap-2.5 min-w-0">
                <div class="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <ListTree class="w-3.5 h-3.5 text-blue-700" />
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-slate-800 tracking-tight">UiTree</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">ต้นไม้หน่วยงานแบบ recursive — ขยาย/ยุบรายโหนด, badge จำนวน, event @select</p>
              </div>
              </div>
            </template>
            <template #end>
              <button type="button" class="group inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900 text-slate-300 font-mono text-[10px] hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0" title="คัดลอกโค้ด" @click='copyCode(`&lt;UiTree :items @select /&gt;`)'>
                <span>&lt;UiTree :items @select /&gt;</span>
                <Copy class="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </template>
          </UiToolbar>
        </template>
        <div class="p-4 sm:p-5">
          <UiTree :items="treeNodes" :selected-id="treeSelected" @select="onTreeSelect" />
        </div>
      </UiCard>

      <!-- ======================= UiPagination ======================= -->
      <UiCard id="sec-pagination" class="order-[20] scroll-mt-4">
        <template #header>
          <UiToolbar>
            <template #start>
              <div class="flex items-start gap-2.5 min-w-0">
                <div class="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <ChevronsLeft class="w-3.5 h-3.5 text-blue-700" />
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-slate-800 tracking-tight">UiPagination</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">v-model:current-page · v-model:page-size · :total — ตัวอย่างมี 87 รายการ (หน้าปัจจุบัน {{ demoPage }})</p>
              </div>
              </div>
            </template>
            <template #end>
              <button type="button" class="group inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900 text-slate-300 font-mono text-[10px] hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0" title="คัดลอกโค้ด" @click='copyCode(`&lt;UiPagination :total="87" /&gt;`)'>
                <span>&lt;UiPagination :total="87" /&gt;</span>
                <Copy class="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </template>
          </UiToolbar>
        </template>
        <div class="p-4 sm:p-5">
          <UiPagination
            v-model:current-page="demoPage"
            v-model:page-size="demoPageSize2"
            :total="87"
            :page-size-options="[10, 20, 50]"
          />
        </div>
      </UiCard>

      <!-- ======================= Group: ซ้อนทับและไฟล์ ======================= -->
      <div class="order-[21] scroll-mt-4 flex items-center gap-3">
        <div class="w-7 h-7 rounded-lg bg-blue-900 text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0">5</div>
        <h2 class="text-sm font-bold text-slate-800 whitespace-nowrap">ซ้อนทับและไฟล์</h2>
        <span class="text-[10px] text-slate-400 whitespace-nowrap">3 รายการ</span>
        <div class="h-px bg-slate-200 flex-1" />
      </div>

      <!-- ======================= UiEmptyState + UiModal ======================= -->
      <UiCard id="sec-modal" class="order-[22] scroll-mt-4">
        <template #header>
          <UiToolbar>
            <template #start>
              <div class="flex items-start gap-2.5 min-w-0">
                <div class="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <AppWindow class="w-3.5 h-3.5 text-blue-700" />
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-slate-800 tracking-tight">UiEmptyState · UiModal</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">สถานะว่าง (message + icon) และ modal พร้อม overlay, ปุ่มปิด, slot header / footer และ body เลื่อนได้ในตัว</p>
              </div>
              </div>
            </template>
            <template #end>
              <button type="button" class="group inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900 text-slate-300 font-mono text-[10px] hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0" title="คัดลอกโค้ด" @click='copyCode(`&lt;UiModal :is-open @close /&gt;`)'>
                <span>&lt;UiModal :is-open @close /&gt;</span>
                <Copy class="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </template>
          </UiToolbar>
        </template>
        <div class="p-4 sm:p-5 space-y-3">
          <div class="rounded-xl border border-slate-200/90">
            <UiEmptyState message="ไม่พบข้อมูลตามเงื่อนไขที่ระบุ" :icon="Inbox" />
          </div>
          <div class="flex justify-end">
            <UiButton @click="demoModal = true">
              <template #icon>
                <LayoutGrid class="w-4 h-4" />
              </template>
              เปิดตัวอย่าง UiModal
            </UiButton>
          </div>
        </div>
      </UiCard>

      <!-- ======================= Uploader ======================= -->
      <UiCard id="sec-uploader" class="order-[23] scroll-mt-4">
        <template #header>
          <UiToolbar>
            <template #start>
              <div class="flex items-start gap-2.5 min-w-0">
                <div class="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <UploadCloud class="w-3.5 h-3.5 text-blue-700" />
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-slate-800 tracking-tight">UiUploader</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">อัปโหลดไฟล์แบบลากวางหรือเลือก — v-model เป็น File[], แสดงรายชื่อ + ขนาดไฟล์</p>
              </div>
              </div>
            </template>
            <template #end>
              <button type="button" class="group inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900 text-slate-300 font-mono text-[10px] hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0" title="คัดลอกโค้ด" @click='copyCode(`&lt;UiUploader v-model="files" /&gt;`)'>
                <span>&lt;UiUploader v-model="files" /&gt;</span>
                <Copy class="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </template>
          </UiToolbar>
        </template>
        <div class="p-4 sm:p-5">
          <UiUploader
            v-model="uploaderFiles"
            multiple
            accept=".pdf,.png,.jpg"
            hint="PDF, PNG, JPG ขนาดไม่เกิน 5MB"
          />
        </div>
      </UiCard>

      <!-- ======================= Splitter ======================= -->
      <UiCard id="sec-splitter" class="order-[24] scroll-mt-4">
        <template #header>
          <UiToolbar>
            <template #start>
              <div class="flex items-start gap-2.5 min-w-0">
                <div class="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <Columns2 class="w-3.5 h-3.5 text-blue-700" />
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-slate-800 tracking-tight">UiSplitter</h3>
                  <p class="text-[11px] text-slate-400 mt-0.5">แบ่งสองคอนเทนเนอร์แนวตั้งซ้าย-ขวา ลากแถบกลางเพื่อปรับสัดส่วน (จอ &lt; xl วางซ้อนอัตโนมัติ)</p>
                </div>
              </div>
            </template>
            <template #end>
              <button type="button" class="group inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900 text-slate-300 font-mono text-[10px] hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0" title="คัดลอกโค้ด" @click='copyCode(`&lt;UiSplitter v-model="percent" :min="25" :max="75"&gt; #first / #second &lt;/UiSplitter&gt;`)'>
                <span>&lt;UiSplitter v-model="percent"&gt;#first / #second&lt;/UiSplitter&gt;</span>
                <Copy class="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </template>
          </UiToolbar>
        </template>
        <div class="p-4 sm:p-5">
          <UiSplitter v-model="splitterPercent" class="h-56">
            <template #first>
              <div class="h-full rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-xs text-slate-500">
                ฝั่งซ้าย {{ Math.round(splitterPercent) }}%
              </div>
            </template>
            <template #second>
              <div class="h-full rounded-xl border border-slate-200 bg-white flex items-center justify-center text-xs text-slate-500">
                ฝั่งขวา — ลากแถบกลางเพื่อปรับ (ดับเบิลคลิก = รีเซ็ต 50/50, รองรับปุ่มลูกศร)
              </div>
            </template>
          </UiSplitter>
        </div>
      </UiCard>
      
      </div>

      <!-- Right Mini Menu (สารบัญ) -->
      <aside class="hidden xl:block w-52 flex-shrink-0 sticky top-6 self-start">
        <div v-if="!tocCollapsed" class="rounded-xl border border-slate-200/90 bg-white shadow-sm overflow-hidden">
          <div class="h-0.5 bg-slate-100">
            <div
              class="h-full bg-gradient-to-r from-blue-900 to-sky-500 transition-all duration-150"
              :style="{ width: `${Math.round(scrollProgress * 100)}%` }"
            />
          </div>
          <div class="px-3 py-2.5 border-b border-slate-100 flex items-center justify-between">
            <span class="text-[11px] font-bold text-slate-700">สารบัญหน้านี้</span>
            <button
              type="button"
              class="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              title="ย่อเมนู"
              @click="tocCollapsed = true"
            >
              <PanelRightClose class="w-3.5 h-3.5" />
            </button>
          </div>
          <nav class="px-2 py-2 space-y-2.5 max-h-[calc(100vh-180px)] overflow-y-auto">
            <div v-for="group in tocGroups" :key="group.label">
              <div class="px-1.5 pb-1 text-[10px] font-semibold text-slate-400">{{ group.label }}</div>
              <button
                v-for="item in group.items"
                :key="item.id"
                type="button"
                class="w-full text-left px-2 py-1 rounded-md text-[11px] border-l-2 transition-colors cursor-pointer truncate"
                :class="
                  activeSection === item.id
                    ? 'border-blue-900 text-blue-900 font-semibold bg-blue-50/60'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                "
                @click="scrollToSection(item.id)"
              >
                {{ item.label }}
              </button>
            </div>
          </nav>
        </div>

        <button
          v-else
          type="button"
          class="w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-blue-900 hover:bg-slate-50 shadow-sm transition-colors cursor-pointer flex items-center justify-center"
          title="แสดงสารบัญ"
          @click="tocCollapsed = false"
        >
          <PanelRightOpen class="w-4 h-4" />
        </button>
      </aside>
    </div>

    <!-- Demo Modal -->
    <UiModal
      :is-open="demoModal"
      max-width="max-w-md"
      title="ตัวอย่าง UiModal"
      subtitle="Header แบบมาตรฐาน — icon + ชื่อหัวข้อ + คำอธิบาย"
      @close="demoModal = false"
    >
      <template #icon>
        <LayoutGrid class="w-5 h-5 text-blue-900" />
      </template>

      <div class="space-y-3 text-xs text-slate-600 leading-relaxed">
        <p>
          Modal นี้สร้างจาก UiModal ทั้งหมด — overlay, animation, ปุ่มปิด (X), header และ slot footer มาให้พร้อม
        </p>
        <p>
          ใช้ props <code class="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">is-open</code>,
          <code class="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">max-width</code>,
          <code class="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">panel-class</code>,
          <code class="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">title</code>,
          <code class="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">subtitle</code>,
          <code class="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">icon-class</code>
          + slot <code class="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">#icon</code>
          สำหรับ header แบบมาตรฐาน (icon box + ชื่อหัวข้อ + คำอธิบาย) หรือใช้ slot
          <code class="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">#header</code>
          เพื่อกำหนดเองทั้งหมด
        </p>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton variant="outline" size="xs" @click="demoModal = false">ปิด</UiButton>
          <UiButton size="xs" @click="notify('บันทึกจาก UiModal ตัวอย่าง'); demoModal = false">ตกลง</UiButton>
        </div>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { AppTable, type AppTableColumn } from './index';
import {
  UiBadge,
  UiBreadcrumbs,
  UiButton,
  UiCard,
  UiCheckbox,
  UiDropdownButton,
  UiEmptyState,
  UiIconButton,
  UiInput,
  UiList,
  UiListItem,
  UiModal,
  UiPagination,
  UiSearchInput,
  UiSelect,
  UiStatCard,
  UiTabs,
  UiToggleGroup,
  UiToolbar,
  UiTree,
  UiUploader,
} from './index';
import { ORG_UNITS } from '../../data/organizationData';
import {
  AppWindow,
  ArrowUpDown,
  BarChart3,
  Bell,
  Box,
  Briefcase,
  Building2,
  Check,
  ChevronRight,
  ChevronsLeft,
  ChevronsUpDown,
  Clock,
  Copy,
  Download,
  FolderOpen,
  FormInput,
  History,
  Inbox,
  Layers,
  LayoutGrid,
  List,
  ListTree,
  Mail,
  MousePointerClick,
  PanelRightClose,
  PanelRightOpen,
  PanelTop,
  Palette,
  Plus,
  Printer,
  RotateCw,
  Route,
  ShieldCheck,
  Shapes,
  Sparkles,
  Blocks,
  Table,
  Columns2,
  Tags,
  Type,
  UserCheck,
} from 'lucide-vue-next';
import { useToast } from '../../composables/useToast';
const { show } = useToast();


const notify = (msg: string) => show(msg);

// --- คัดลอกโค้ดจาก section header
const copyCode = (code: string) => {
  navigator.clipboard?.writeText(code);
  notify(`คัดลอกโค้ดแล้ว: ${code}`);
};

// --- Scroll progress bar (สำหรับสารบัญฝั่งขวา)
const scrollProgress = ref(0);
let mainEl: HTMLElement | null = null;

const onScroll = () => {
  const el = mainEl;
  if (!el) return;
  const max = el.scrollHeight - el.clientHeight;
  scrollProgress.value = max > 0 ? Math.min(1, el.scrollTop / max) : 0;
};

// --- Right mini menu (สารบัญ) — จัดกลุ่มตามลำดับความสำคัญ
const tocCollapsed = ref(false);
const activeSection = ref('sec-typography');

const tocGroups = [
  {
    label: 'ธีม',
    items: [
      { id: 'sec-theme', label: 'Theme Builder' },
      { id: 'sec-typography', label: 'Typography' },
      { id: 'sec-shadows', label: 'Shadows' },
    ],
  },
  {
    label: 'พื้นฐาน',
    items: [
      { id: 'sec-button', label: 'UiButton' },
      { id: 'sec-badge', label: 'UiBadge' },
      { id: 'sec-icon-toggle', label: 'UiIconButton · UiToggleGroup' },
    ],
  },
  {
    label: 'ฟอร์มและการนำทาง',
    items: [
      { id: 'sec-form', label: 'Search · Select · Checkbox' },
      { id: 'sec-dropdown', label: 'Dropdown Button' },
      { id: 'sec-tabs', label: 'Tabs' },
      { id: 'sec-breadcrumbs', label: 'Breadcrumbs' },
    ],
  },
  {
    label: 'การแสดงข้อมูล',
    items: [
      { id: 'sec-card', label: 'UiCard · UiToolbar' },
      { id: 'sec-stat', label: 'UiStatCard' },
      { id: 'sec-table', label: 'Table (AppTable)' },
      { id: 'sec-list', label: 'UiList · UiListItem' },
      { id: 'sec-tree', label: 'UiTree' },
      { id: 'sec-pagination', label: 'UiPagination' },
    ],
  },
  {
    label: 'ซ้อนทับและไฟล์',
    items: [
      { id: 'sec-modal', label: 'UiEmptyState · UiModal' },
      { id: 'sec-uploader', label: 'UiUploader' },
      { id: 'sec-splitter', label: 'UiSplitter' },
    ],
  },
];

let observer: IntersectionObserver | null = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id;
        }
      }
    },
    { rootMargin: '-10% 0px -75% 0px' }
  );

  tocGroups.flatMap((g) => g.items).forEach((item) => {
    const el = document.getElementById(item.id);
    if (el) observer!.observe(el);
  });

  mainEl = document.querySelector('main');
  mainEl?.addEventListener('scroll', onScroll, { passive: true });
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
  mainEl?.removeEventListener('scroll', onScroll);
  mainEl = null;
});

const scrollToSection = (id: string) => {
  activeSection.value = id;
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// --- Demo state
const demoView = ref('table');
const demoScope = ref('current');
const demoSearch = ref('');
const demoInput = ref('');
const demoInputDisabled = ref('');
const demoToolbarSearch = ref('');
const demoSelect = ref('name');
const demoCheck1 = ref(false);
const demoCheck2 = ref(true);
const demoPage = ref(1);
const demoPageSize = ref(10);
const demoPageSize2 = ref(10);
const demoModal = ref(false);
const demoTab = ref('overview');
const brandColor = ref('#002B7F');
const treeSelected = ref('');
const uploaderFiles = ref<File[]>([]);
const tableSearch = ref('');
const splitterPercent = ref(50);

const brandColors = [
  { name: 'BMA Navy', value: '#002B7F' },
  { name: 'Blue', value: '#1d4ed8' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Teal', value: '#0d9488' },
  { name: 'Amber', value: '#d97706' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Slate', value: '#475569' },
];

const shadowSamples = ['shadow-2xs', 'shadow-xs', 'shadow-sm', 'shadow', 'shadow-md', 'shadow-lg'];

const dropdownItems = [
  { value: 'print', label: 'พิมพ์ ก.พ. 7', icon: Printer },
  { value: 'export', label: 'ส่งออก Excel', icon: Download },
  { value: 'history', label: 'ประวัติการแก้ไข', icon: History },
];

const createItems = [
  { value: 'position', label: 'ตำแหน่งใหม่' },
  { value: 'unit', label: 'หน่วยงานใหม่' },
];

const breadcrumbItems = [
  { label: 'หน้าแรก', value: 'home' },
  { label: 'ทะเบียนประวัติ', value: 'records' },
  { label: 'ข้าราชการ กทม.' },
];

const treeNodes = ORG_UNITS.map((root) => ({
  id: root.id,
  label: root.name,
  count: root.count,
  children: (root.children ?? []).map((child) => ({
    id: child.id,
    label: child.name,
    count: child.count,
  })),
}));

const onTreeSelect = (node: { id: string; label: string }) => {
  treeSelected.value = node.id;
  notify(`เลือกหน่วยงาน: ${node.label}`);
};

const tableColumns: AppTableColumn[] = [
  { key: 'name', label: 'ชื่อ-นามสกุล' },
  { key: 'position', label: 'ตำแหน่ง' },
  { key: 'department', label: 'สังกัด' },
  { key: 'status', label: 'สถานะ' },
];

const tableRows = [
  { id: 1, name: 'นางสาวอรพินท์ จันทร์เจ้า', position: 'รองผู้อำนวยการสำนัก', department: 'สำนักงาน ก.ก.', status: 'ปกติ' },
  { id: 2, name: 'นางจารุณี สัจจวัตร', position: 'รองผู้อำนวยการสำนัก', department: 'สำนักปลัด', status: 'ปกติ' },
  { id: 3, name: 'นายเกริก สัจจวัตร', position: 'ผู้อำนวยการสำนัก', department: 'สำนักการระบายน้ำ', status: 'ปกติ' },
  { id: 4, name: 'นางวิภาวรรณ รัตนวิชัย', position: 'นิติกร', department: 'สำนักการคลัง', status: 'ทดลองงาน' },
];

const viewItems = [
  { value: 'card', icon: LayoutGrid, title: 'มุมมองการ์ด' },
  { value: 'table', icon: List, title: 'มุมมองตาราง' },
];

const scopeItems = [
  { value: 'current', label: 'ปัจจุบัน', dotTone: 'bg-emerald-500' },
  { value: 'plan', label: 'แผนที่', dotTone: 'bg-amber-500' },
];
</script>
