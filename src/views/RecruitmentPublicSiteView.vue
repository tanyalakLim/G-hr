<template>
  <!-- เว็บไซต์สรรหา (หน้า public แยกจากระบบภายใน) — แสดงเต็มจอ ไม่มี Sidebar/Header ของแอดมิน -->
  <div class="h-full overflow-y-auto flex flex-col bg-slate-50 text-slate-800 antialiased">
    <!-- ===== แถบนำทางด้านบน ===== -->
    <header class="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <RouterLink to="/recruitment_site" class="flex items-center gap-3 shrink-0">
          <div class="w-10 h-10 rounded-xl bg-bma-900 flex items-center justify-center shadow-sm overflow-hidden">
            <img :src="siteLogo || logoUrl" alt="โลโก้ระบบสรรหา" class="w-full h-full object-cover" />
          </div>
          <div class="leading-tight">
            <p class="text-sm sm:text-base font-bold text-slate-900">ระบบสรรหาบุคลากร</p>
            <p class="text-[10px] sm:text-[11px] text-slate-500">กรุงเทพมหานคร • bangkok.go.th</p>
          </div>
        </RouterLink>

        <!-- เมนูหลัก (desktop) -->
        <nav class="hidden md:flex items-center gap-1">
          <RouterLink
            v-for="item in NAV_ITEMS"
            :key="item.to"
            :to="item.to"
            class="px-3.5 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="isActive(item) ? 'bg-bma-50 text-bma-700' : 'text-slate-600 hover:text-bma-700 hover:bg-slate-100'"
          >
            {{ item.label }}
          </RouterLink>
        </nav>

        <div class="flex items-center gap-2">
          <RouterLink
            to="/login"
            class="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-bma-700 hover:bg-bma-600 text-white text-xs font-semibold px-4 py-2.5 transition-colors"
          >
            <LogIn class="w-4 h-4" />
            เข้าสู่ระบบ
          </RouterLink>
          <!-- ปุ่มเมนู (mobile) -->
          <button
            type="button"
            class="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title="เมนู"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <Menu v-if="!mobileMenuOpen" class="w-5 h-5" />
            <X v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- เมนูหลัก (mobile) -->
      <nav v-if="mobileMenuOpen" class="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
        <RouterLink
          v-for="item in NAV_ITEMS"
          :key="item.to"
          :to="item.to"
          class="block px-3 py-2.5 rounded-lg text-sm font-medium"
          :class="isActive(item) ? 'bg-bma-50 text-bma-700' : 'text-slate-600 hover:bg-slate-100'"
          @click="mobileMenuOpen = false"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </header>

    <main class="flex-1">
      <!-- ===== หน้าแรก: แบนเนอร์ระบบสรรหา ===== -->
      <template v-if="section === 'home'">
        <!-- Hero: รูปแบนเนอร์ (อัปโหลด หรือตัวอย่างเริ่มต้น) พร้อมข้อความและปุ่มซ้อนด้านบนรูป -->
        <section class="relative overflow-hidden text-white">
          <!-- รูปแบนเนอร์ -->
          <img
            :src="siteBanner || defaultBannerUrl"
            alt="แบนเนอร์ระบบสรรหาบุคลากร"
            class="absolute inset-0 w-full h-full object-cover object-center"
          />
          <!-- เกรเดียนต์คลุมด้านบนรูป เพื่อให้ตัวอักษรอ่านง่ายบนรูปสีอ่อน -->
          <div class="absolute inset-0 bg-gradient-to-r from-bma-900/92 via-bma-800/72 to-bma-900/30" aria-hidden="true"></div>

          <div class="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
            <!-- สโลแกน -->
           <!--  <div class="flex flex-wrap items-center gap-2">
              <span
                v-for="word in SLOGAN"
                :key="word"
                class="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 backdrop-blur px-3.5 py-1.5 text-xs sm:text-sm font-medium"
              >
                <ShieldCheck class="w-3.5 h-3.5 text-emerald-300" />
                {{ word }}
              </span>
            </div> -->

            <h1 class="mt-6 text-2xl sm:text-4xl lg:text-5xl font-bold leading-snug max-w-3xl drop-shadow-sm">
              ระบบสรรหาและสอบคัดเลือก
              <p class="text-sky-200">บุคลากรเข้ารับราชการ</p>
            </h1>
            <p class="mt-4 text-sm sm:text-base text-blue-100/95 max-w-xl leading-relaxed drop-shadow-sm">
              ศูนย์กลางประกาศรับสมัคร กำหนดการสอบ และประกาศผลการสรรหาบุคลากร
              ครอบคลุมทั้งการคัดเลือกและการสอบแข่งขัน ตั้งแต่รับสมัครจนถึงบรรจุแต่งตั้ง
            </p>

            <!-- ปุ่มทางลัดหลัก (ซ้อนบนรูปแบนเนอร์) -->
            <div class="mt-8 flex flex-wrap gap-3">
              <RouterLink
                to="/recruitment_site/select"
                class="inline-flex items-center gap-2 rounded-xl bg-white text-bma-800 text-sm font-semibold px-5 py-3 shadow-lg shadow-bma-900/30 hover:bg-blue-50 transition-colors"
              >
                <Users class="w-4.5 h-4.5" />
                การคัดเลือก
              </RouterLink>
              <RouterLink
                to="/recruitment_site/exam"
                class="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 backdrop-blur text-white text-sm font-semibold px-5 py-3 hover:bg-white/20 transition-colors"
              >
                <PenLine class="w-4.5 h-4.5" />
                การสอบแข่งขัน
              </RouterLink>
            </div>
          </div>
        </section>

        <!-- ===== 2) ภารกิจและบริการหลัก 4 ด้าน (Core Pillars) (พื้นเทา แยกช่วงจากภาพรวม) ===== -->
        <section class="bg-slate-50 border-b border-slate-200/80">
          <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
            <div class="mb-6">
              <span class="inline-flex rounded-full bg-sky-50 text-sky-700 px-3 py-1 text-[11px] font-semibold ring-1 ring-sky-100">Core Pillars</span>
              <h2 class="mt-3 text-lg sm:text-xl font-bold text-slate-900">ภารกิจและบริการหลัก 4 ด้าน</h2>
              <p class="text-xs sm:text-sm text-slate-500 mt-1">ระบบได้บูรณาการขั้นตอนการทำงานออกเป็น 4 ระยะอย่างครบถ้วน</p>
            </div>
            <!-- การ์ด 4 เสาหลัก: เลขลำดับขนาดใหญ่ + ไอคอนประจำระยะ -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                v-for="pillar in CORE_PILLARS"
                :key="pillar.no"
                class="relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm p-5 hover:border-bma-300 hover:shadow-md transition-all"
              >
                <span class="absolute top-3 right-4 text-3xl font-bold text-bma-100 select-none" aria-hidden="true">{{ pillar.no }}</span>
                <div class="w-10 h-10 rounded-xl bg-bma-50 text-bma-700 flex items-center justify-center shrink-0">
                  <component :is="pillar.icon" class="w-5 h-5" />
                </div>
                <p class="mt-3 text-[10px] font-bold uppercase tracking-wide text-bma-600">Pillar {{ pillar.no }}</p>
                <h3 class="mt-1 text-sm font-bold text-slate-900 leading-snug">{{ pillar.title }}</h3>
                <p class="mt-2 text-xs text-slate-500 leading-relaxed">{{ pillar.desc }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- ===== ประกาศการคัดเลือก (แถบพื้นขาว แยกช่วงจากส่วนสอบแข่งขันให้ชัดเจน) ===== -->
        <section class="bg-white border-b border-slate-200/80">
          <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
            <div class="flex flex-wrap items-end justify-between gap-3 mb-6">
              <div class="flex items-center gap-3">
               
                <div>
                  <span class="inline-flex rounded-full bg-bma-50 text-bma-700 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-bma-100">Featured Spotlight</span>
                  <h2 class="mt-1.5 text-lg sm:text-xl font-bold text-slate-900">ประกาศการคัดเลือกบุคลากร</h2>
                  <p class="text-xs sm:text-sm text-slate-500 mt-0.5">รวบรวมประกาศรับสมัครและผลการคัดเลือกบุคลากร กทม. ล่าสุด</p>
                </div>
              </div>
              <RouterLink
                to="/recruitment_site/select"
                class="inline-flex items-center gap-1 text-sm font-medium text-bma-700 hover:text-bma-600 transition-colors"
              >
                ดูทั้งหมด
                <ChevronRight class="w-4 h-4" />
              </RouterLink>
            </div>

            <!-- การ์ดประกาศ: บล็อกวันที่แบบปฏิทิน + ป้ายหมวด -->
            <div v-if="homeSelectAnnouncements.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                v-for="item in homeSelectAnnouncements"
                :key="item.id"
                type="button"
                class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-bma-300 hover:shadow-md transition-all cursor-pointer text-left"
                @click="openAnnouncement(item)"
              >
                <!-- รูปประกอบ + บล็อกวันที่แบบปฏิทินซ้อนบนรูป -->
                <div class="relative">
                  <img :src="coverUrl(item)" :alt="item.title" class="h-40 w-full object-cover" />
                  <div class="absolute bottom-3 left-4 rounded-xl bg-white/95 px-2.5 py-1.5 text-center shadow-sm backdrop-blur">
                    <p class="text-lg font-bold leading-none text-bma-700">{{ dateParts(item.date).day }}</p>
                    <p class="mt-0.5 text-[10px] font-medium whitespace-nowrap text-bma-600">{{ dateParts(item.date).monthAbbr }} {{ dateParts(item.date).year }}</p>
                  </div>
                </div>
                <div class="flex min-w-0 flex-1 flex-col p-5">
                  <div class="flex flex-wrap items-center gap-1.5">
                    <span class="inline-flex items-center rounded-full bg-bma-50 text-bma-700 px-2 py-0.5 text-[10px] font-semibold ring-1 ring-bma-100">
                      การคัดเลือก
                    </span>
                    <span
                      v-if="item.reference"
                      class="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 px-2 py-0.5 text-[10px] font-semibold ring-1 ring-amber-100"
                    >
                      <ScrollText class="w-3 h-3 shrink-0" />
                      {{ item.reference }}
                    </span>
                  </div>
                  <h3 class="mt-2 text-sm sm:text-base font-bold text-slate-900 group-hover:text-bma-700 transition-colors line-clamp-2">
                    {{ item.title }}
                  </h3>
                  <p class="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">{{ item.excerpt }}</p>
                  <span class="mt-auto pt-3 inline-flex items-center gap-1 text-sm font-semibold text-bma-700">
                    ดูรายละเอียด
                    <ChevronRight class="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </button>
            </div>
            <EmptyState v-else text="ยังไม่มีประกาศการคัดเลือก" />
          </div>
        </section>

        <!-- ===== ประกาศการสอบแข่งขัน (พื้นเทา ต่อเนื่องจากแถบคัดเลือก เห็นเส้นแบ่งชัดเจน) ===== -->
        <section class="bg-slate-50">
          <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
            <div class="flex flex-wrap items-end justify-between gap-3 mb-6">
              <div class="flex items-center gap-3">
                <div>
                  <span class="inline-flex rounded-full bg-sky-50 text-sky-700 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-sky-100">Featured Spotlight</span>
                  <h2 class="mt-1.5 text-lg sm:text-xl font-bold text-slate-900">ประกาศการสอบแข่งขัน</h2>
                  <p class="text-xs sm:text-sm text-slate-500 mt-0.5">ประกาศรับสมัครสอบแข่งขัน กำหนดการสอบ และประกาศรายชื่อผู้สอบผ่าน</p>
                </div>
              </div>
              <RouterLink
                to="/recruitment_site/exam"
                class="inline-flex items-center gap-1 text-sm font-medium text-bma-700 hover:text-bma-600 transition-colors"
              >
                ดูทั้งหมด
                <ChevronRight class="w-4 h-4" />
              </RouterLink>
            </div>

            <!-- รอบสอบล่าสุด (featured) -->
            <div v-if="latestExam" class="rounded-2xl border border-bma-100 bg-white shadow-sm overflow-hidden">
              <div class="bg-gradient-to-r from-bma-900 to-bma-600 text-white px-5 sm:px-6 py-4 flex items-center justify-between gap-3">
                <div class="flex items-center gap-2.5">
                  <span class="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                    <Megaphone class="w-4.5 h-4.5 text-sky-200" />
                  </span>
                  <div>
                    <p class="text-[11px] font-semibold uppercase tracking-wide text-sky-200/90">รอบสอบแข่งขันล่าสุด</p>
                    <p class="text-xs text-blue-100/85">ประกาศเมื่อวันที่ {{ latestExam.date }}</p>
                  </div>
                </div>
                <span class="hidden sm:inline-flex items-center rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[11px] font-semibold">
                  อัปเดตล่าสุด
                </span>
              </div>
              <button
                type="button"
                class="group flex w-full flex-col gap-4 p-5 text-left hover:bg-bma-50/40 transition-colors cursor-pointer sm:flex-row sm:items-center sm:gap-6 sm:p-6"
                @click="openAnnouncement(latestExam)"
              >
                <div class="min-w-0 flex-1">
                  <h3 class="text-base sm:text-lg font-bold text-slate-900 group-hover:text-bma-700 transition-colors">
                    {{ latestExam.title }}
                  </h3>
                  <p class="mt-2 text-sm text-slate-600 leading-relaxed">{{ latestExam.excerpt }}</p>
                  <!-- ข้อมูลเด่นของรอบสอบ (ตำแหน่ง/กำหนดการ) -->
                  <ul v-if="latestExam.highlights?.length" class="mt-3 space-y-1.5">
                    <li v-for="hl in latestExam.highlights" :key="hl.label" class="flex items-start gap-2 text-xs text-slate-600">
                      <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bma-400" aria-hidden="true"></span>
                      <span class="shrink-0 font-semibold text-slate-700">{{ hl.label }}:</span>
                      <span>{{ hl.value }}</span>
                    </li>
                  </ul>
                  <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div class="flex items-center gap-4 text-xs text-slate-500">
                      <span class="inline-flex items-center gap-1.5">
                        <FileText class="w-3.5 h-3.5" />
                        {{ latestExam.attachments.length }} เอกสารแนบ
                      </span>
                      <span class="inline-flex items-center gap-1.5">
                        <CalendarDays class="w-3.5 h-3.5" />
                        วันที่ {{ latestExam.date }}
                      </span>
                    </div>
                    <span class="inline-flex items-center gap-1.5 rounded-xl bg-bma-700 text-white text-sm font-semibold px-4 py-2 group-hover:bg-bma-600 transition-colors">
                      ดูรายละเอียดประกาศ
                      <ChevronRight class="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
                <!-- รูปประกอบ -->
                <img
                  :src="coverUrl(latestExam)"
                  :alt="latestExam.title"
                  class="h-36 w-full shrink-0 rounded-xl object-cover sm:h-32 sm:w-48"
                />
              </button>
            </div>

            <!-- ประกาศย้อนหลัง (ไทม์ไลน์) -->
            <div v-if="pastExamAnnouncements.length" class="mt-8">
              <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">ประกาศย้อนหลัง</h3>
              <div class="relative">
                <div class="absolute left-[5px] top-4 bottom-4 w-px bg-slate-200" aria-hidden="true"></div>
                <div class="space-y-1">
                  <button
                    v-for="item in pastExamAnnouncements"
                    :key="item.id"
                    type="button"
                    class="group relative flex w-full items-center gap-4 rounded-xl py-3 pl-8 pr-3 text-left hover:bg-bma-50/50 transition-colors cursor-pointer"
                    @click="openAnnouncement(item)"
                  >
                    <span
                      class="absolute left-0 top-1/2 -translate-y-1/2 w-[11px] h-[11px] rounded-full border-2 border-bma-400 bg-white group-hover:bg-bma-500 transition-colors"
                      aria-hidden="true"
                    ></span>
                    <!-- รูปประกอบ -->
                    <img :src="coverUrl(item)" :alt="item.title" class="h-11 w-16 shrink-0 rounded-lg object-cover" />
                    <span class="shrink-0 whitespace-nowrap text-xs font-medium text-slate-500">วันที่ {{ item.date }}</span>
                    <span class="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800 group-hover:text-bma-700 transition-colors">
                      {{ item.title }}
                    </span>
                    <ChevronRight class="w-4.5 h-4.5 text-slate-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </template>

      <!-- ===== หน้า การคัดเลือก ===== -->
      <template v-else-if="section === 'select'">
        <PageHero
          eyebrow="การคัดเลือก"
          title="ประกาศการคัดเลือกบุคลากร กทม."
          desc="รวบรวมประกาศรับสมัครผู้เข้ารับการคัดเลือก กำหนดการต่างๆ และประกาศผลการคัดเลือก เรียงจากล่าสุดไปเก่าสุด"
        />
        <section class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <template v-if="selectAnnouncements.length">
            <!-- แถบสรุปจำนวนประกาศ -->
            <div class="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <p class="text-sm text-slate-600">
                รวมประกาศการคัดเลือกทั้งหมด <span class="font-bold text-bma-700">{{ selectAnnouncements.length }}</span> ฉบับ
              </p>
              <p class="inline-flex items-center gap-1.5 text-xs text-slate-500">
                <CalendarDays class="w-3.5 h-3.5" />
                อัปเดตล่าสุด {{ selectAnnouncements[0].date }}
              </p>
            </div>

            <!-- ประกาศล่าสุด (featured) -->
            <button
              type="button"
              class="group block w-full overflow-hidden rounded-2xl border border-bma-100 bg-white text-left shadow-sm hover:shadow-md transition-all cursor-pointer"
              @click="openAnnouncement(selectAnnouncements[0])"
            >
              <div class="bg-bma-900 text-white px-5 sm:px-6 py-3 flex items-center justify-between gap-3">
                <span class="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold">
                  <Megaphone class="w-4.5 h-4.5 text-sky-200" />
                  ประกาศล่าสุด
                </span>
                <span class="hidden sm:inline-flex items-center rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[11px] font-semibold">อัปเดตล่าสุด</span>
              </div>
              <div class="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
                <div class="min-w-0 flex-1">
                  <p class="inline-flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarDays class="w-3.5 h-3.5" />
                    ประกาศเมื่อวันที่ {{ selectAnnouncements[0].date }}
                  </p>
                  <h3 class="mt-2 text-base sm:text-lg font-bold text-slate-900 group-hover:text-bma-700 transition-colors">{{ selectAnnouncements[0].title }}</h3>
                  <p class="mt-1.5 text-sm text-slate-600 leading-relaxed">{{ selectAnnouncements[0].excerpt }}</p>
                  <span class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-bma-700">
                    ดูรายละเอียดประกาศ
                    <ChevronRight class="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
                <img :src="coverUrl(selectAnnouncements[0])" :alt="selectAnnouncements[0].title" class="h-36 w-full shrink-0 rounded-xl object-cover sm:h-32 sm:w-48" />
              </div>
            </button>

            <!-- ประกาศก่อนหน้า (รายการแนวนอน พร้อมบล็อกวันที่แบบปฏิทิน) -->
            <div v-if="pastSelectAnnouncements.length" class="mt-8">
              <h3 class="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">ประกาศก่อนหน้า</h3>
              <div class="space-y-3">
                <button
                  v-for="item in pastSelectAnnouncements"
                  :key="item.id"
                  type="button"
                  class="group flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left hover:border-bma-300 hover:bg-bma-50/40 transition-colors cursor-pointer sm:px-5"
                  @click="openAnnouncement(item)"
                >
                  <div class="w-14 shrink-0 rounded-lg bg-bma-50 py-2 text-center">
                    <p class="text-lg font-bold leading-none text-bma-700">{{ dateParts(item.date).day }}</p>
                    <p class="mt-1 text-[10px] font-medium whitespace-nowrap text-bma-600">{{ dateParts(item.date).monthAbbr }} {{ dateParts(item.date).year }}</p>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-semibold text-slate-800 group-hover:text-bma-700 transition-colors">{{ item.title }}</p>
                    <p class="mt-0.5 truncate text-xs text-slate-500">{{ item.excerpt }}</p>
                  </div>
                  <span class="hidden shrink-0 items-center gap-1.5 text-xs text-slate-500 sm:inline-flex">
                    <FileText class="w-3.5 h-3.5" />
                    {{ item.attachments.length }}
                  </span>
                  <ChevronRight class="w-4.5 h-4.5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </template>
          <EmptyState v-else text="ยังไม่มีประกาศการคัดเลือก" />
        </section>
      </template>

      <!-- ===== หน้า การสอบแข่งขัน ===== -->
      <template v-else-if="section === 'exam'">
        <PageHero
          eyebrow="การสอบแข่งขัน"
          title="ประกาศการสอบแข่งขัน"
          desc="ติดตามประกาศรับสมัครสอบแข่งขัน กำหนดการสอบ และประกาศรายชื่อผู้สอบผ่าน เพื่อบรรจุและแต่งตั้งเข้ารับราชการ"
        />
        <section class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <template v-if="latestExam">
            <!-- แถบสรุปจำนวนประกาศ -->
            <div class="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <p class="text-sm text-slate-600">
                รวมประกาศการสอบแข่งขันทั้งหมด <span class="font-bold text-bma-700">{{ examAnnouncements.length }}</span> ฉบับ
              </p>
              <p class="inline-flex items-center gap-1.5 text-xs text-slate-500">
                <CalendarDays class="w-3.5 h-3.5" />
                อัปเดตล่าสุด {{ latestExam.date }}
              </p>
            </div>

            <!-- ประกาศล่าสุด (featured) -->
            <button
              type="button"
              class="group block w-full overflow-hidden rounded-2xl border border-bma-100 bg-white text-left shadow-sm hover:shadow-md transition-all cursor-pointer"
              @click="openAnnouncement(latestExam)"
            >
              <div class="bg-bma-900 text-white px-5 sm:px-6 py-3 flex items-center justify-between gap-3">
                <span class="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold">
                  <Megaphone class="w-4.5 h-4.5 text-sky-200" />
                  ประกาศล่าสุด
                </span>
                <span class="hidden sm:inline-flex items-center rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[11px] font-semibold">รอบสอบแข่งขันล่าสุด</span>
              </div>
              <div class="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
                <div class="min-w-0 flex-1">
                  <p class="inline-flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarDays class="w-3.5 h-3.5" />
                    ประกาศเมื่อวันที่ {{ latestExam.date }}
                  </p>
                  <h3 class="mt-2 text-base sm:text-lg font-bold text-slate-900 group-hover:text-bma-700 transition-colors">{{ latestExam.title }}</h3>
                  <p class="mt-1.5 text-sm text-slate-600 leading-relaxed">{{ latestExam.excerpt }}</p>
                  <span class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-bma-700">
                    ดูรายละเอียดประกาศ
                    <ChevronRight class="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
                <img
                  :src="coverUrl(latestExam)"
                  :alt="latestExam.title"
                  class="h-36 w-full shrink-0 rounded-xl object-cover sm:h-32 sm:w-48"
                />
              </div>
            </button>

            <!-- ประกาศก่อนหน้า (รายการแนวนอน พร้อมบล็อกวันที่แบบปฏิทิน) -->
            <div v-if="pastExamAnnouncements.length" class="mt-8">
              <h3 class="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">ประกาศก่อนหน้า</h3>
              <div class="space-y-3">
                <button
                  v-for="item in pastExamAnnouncements"
                  :key="item.id"
                  type="button"
                  class="group flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left hover:border-bma-300 hover:bg-bma-50/40 transition-colors cursor-pointer sm:px-5"
                  @click="openAnnouncement(item)"
                >
                  <div class="w-14 shrink-0 rounded-lg bg-bma-50 py-2 text-center">
                    <p class="text-lg font-bold leading-none text-bma-700">{{ dateParts(item.date).day }}</p>
                    <p class="mt-1 text-[10px] font-medium whitespace-nowrap text-bma-600">{{ dateParts(item.date).monthAbbr }} {{ dateParts(item.date).year }}</p>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-semibold text-slate-800 group-hover:text-bma-700 transition-colors">{{ item.title }}</p>
                    <p class="mt-0.5 truncate text-xs text-slate-500">{{ item.excerpt }}</p>
                  </div>
                  <span class="hidden shrink-0 items-center gap-1.5 text-xs text-slate-500 sm:inline-flex">
                    <FileText class="w-3.5 h-3.5" />
                    {{ item.attachments.length }}
                  </span>
                  <ChevronRight class="w-4.5 h-4.5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </template>
          <EmptyState v-else text="ยังไม่มีประกาศการสอบแข่งขัน" />
        </section>
      </template>

      <!-- ===== หน้า เกี่ยวกับเรา ===== -->
      <template v-else>
        <PageHero
          eyebrow="เกี่ยวกับเรา"
          title="เกี่ยวกับระบบสรรหาบุคลากร"
          desc="ระบบสารสนเทศสำหรับประกาศและจัดการข้อมูลการสรรหาและสอบคัดเลือกบุคลากรเข้ารับราชการ"
        />
        <section class="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8 space-y-4">
            <h3 class="text-base font-bold text-slate-900">วัตถุประสงค์ของระบบ</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              ระบบสรรหาบุคลากรจัดทำขึ้นเพื่อเป็นช่องทางกลางในการประกาศรับสมัคร ดำเนินการสอบคัดเลือก
              และประกาศผลการสรรหาบุคลากรเข้ารับราชการในส่วนของกรุงเทพมหานคร
              ครอบคลุมทั้งการคัดเลือกและการสอบแข่งขัน โดยยึดหลัก
              <span class="font-semibold text-bma-700">โปร่งใส • เป็นระบบ • ตรวจสอบได้</span>
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div v-for="pillar in CORE_PILLARS" :key="pillar.no" class="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <div class="w-9 h-9 rounded-xl bg-bma-50 text-bma-700 flex items-center justify-center shrink-0">
                  <component :is="pillar.icon" class="w-4.5 h-4.5" />
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-800">{{ pillar.title }}</p>
                  <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">{{ pillar.desc }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8 space-y-4">
            <h3 class="text-base font-bold text-slate-900">ที่อยู่ติดต่อ</h3>
            <div class="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
              <MapPin class="w-4.5 h-4.5 text-bma-700 shrink-0 mt-0.5" />
              59/451 แขวงศรีภูมิ<br />เขตเมืองเชียงใหม่ จังหวัดเชียงใหม่ 50200
            </div>
            <h3 class="text-base font-bold text-slate-900 pt-2">ส่วนราชการ / หน่วยงาน</h3>
            <ul class="space-y-2">
              <li v-for="org in ORGANIZATIONS" :key="org.name">
                <a :href="org.url" target="_blank" rel="noopener" class="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 text-sm font-medium text-slate-700 hover:border-bma-300 hover:text-bma-700 transition-colors">
                  {{ org.name }}
                  <ExternalLink class="w-4 h-4 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>
        </section>
      </template>
    </main>

    <!-- ===== ส่วนท้ายเว็บไซต์ ===== -->
    <footer class="bg-bma-900 text-blue-100/90">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
              <img :src="siteLogo || logoUrl" alt="โลโก้ระบบสรรหา" class="w-full h-full object-cover" />
            </div>
            <p class="text-sm font-bold text-white">ระบบสรรหาบุคลากร</p>
          </div>
          <p class="mt-3 text-xs leading-relaxed">
            เว็บไซต์สำหรับประกาศและจัดการข้อมูลเกี่ยวกับการสรรหาและสอบคัดเลือกบุคลากรเข้ารับราชการ
          </p>
        </div>
        <div>
          <p class="text-xs font-bold uppercase tracking-wide text-sky-200 mb-3">ที่อยู่ติดต่อ</p>
          <p class="text-xs leading-relaxed flex items-start gap-2">
            <MapPin class="w-4 h-4 shrink-0 mt-0.5 text-sky-300" />
            59/451 แขวงศรีภูมิ เขตเมืองเชียงใหม่<br />จังหวัดเชียงใหม่ 50200
          </p>
          <ul class="mt-3 space-y-2 text-xs">
            <li v-for="channel in SUPPORT_CHANNELS" :key="channel.title" class="flex items-center gap-2">
              <component :is="channel.icon" class="w-4 h-4 shrink-0 text-sky-300" />
              <span>{{ channel.title }} <span class="font-semibold text-white">{{ channel.value }}</span></span>
            </li>
          </ul>
        </div>
        <div>
          <p class="text-xs font-bold uppercase tracking-wide text-sky-200 mb-3">ส่วนราชการ / หน่วยงาน</p>
          <ul class="space-y-2 text-xs">
            <li v-for="org in ORGANIZATIONS" :key="org.name">
              <a :href="org.url" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                <ExternalLink class="w-3.5 h-3.5 text-sky-300" />
                {{ org.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="border-t border-white/10">
        <p class="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-[11px] text-blue-200/70">
          สงวนลิขสิทธิ์โดย bangkok.go.th/ksb ประจำปี ค.ศ. 2026
        </p>
      </div>
    </footer>

    <!-- ===== Modal รายละเอียดประกาศ ===== -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        leave-active-class="transition duration-150 ease-in"
        leave-to-class="opacity-0"
      >
        <div v-if="selectedAnnouncement" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div class="absolute inset-0 bg-slate-900/55" @click="closeAnnouncement"></div>
          <div class="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div class="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-100 px-5 sm:px-7 py-4 flex items-start justify-between gap-4">
              <div class="min-w-0">
                <span class="inline-flex items-center rounded-full bg-bma-50 text-bma-700 px-2.5 py-1 text-[11px] font-semibold">
                  {{ selectedAnnouncement.category === 'select' ? 'การคัดเลือก' : 'การสอบแข่งขัน' }}
                </span>
                <h2 class="mt-2 text-base sm:text-lg font-bold text-slate-900 leading-snug">{{ selectedAnnouncement.title }}</h2>
                <p class="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <CalendarDays class="w-3.5 h-3.5" />
                  ประกาศเมื่อวันที่ {{ selectedAnnouncement.date }}
                </p>
              </div>
              <button
                type="button"
                class="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="ปิด"
                @click="closeAnnouncement"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
            <div class="px-5 sm:px-7 py-5 space-y-3">
              <!-- รูปประกอบประกาศ -->
              <img :src="coverUrl(selectedAnnouncement)" :alt="selectedAnnouncement.title" class="h-44 w-full rounded-xl object-cover sm:h-52" />
              <!-- อ้างอิงหนังสือราชการ (ถ้ามี) -->
              <div
                v-if="selectedAnnouncement.reference"
                class="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 text-amber-700 px-3 py-1.5 text-xs font-semibold ring-1 ring-amber-100"
              >
                <ScrollText class="w-3.5 h-3.5 shrink-0" />
                {{ selectedAnnouncement.reference }}
              </div>
              <!-- ข้อมูลเด่นของประกาศ (ถ้ามี) -->
              <ul v-if="selectedAnnouncement.highlights?.length" class="space-y-1.5 rounded-xl bg-slate-50 p-4">
                <li v-for="hl in selectedAnnouncement.highlights" :key="hl.label" class="flex items-start gap-2 text-sm text-slate-600">
                  <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-bma-400" aria-hidden="true"></span>
                  <span class="shrink-0 font-semibold text-slate-700">{{ hl.label }}:</span>
                  <span>{{ hl.value }}</span>
                </li>
              </ul>
              <p v-for="(para, i) in selectedAnnouncement.body" :key="i" class="text-sm text-slate-700 leading-relaxed">
                {{ para }}
              </p>
              <div v-if="selectedAnnouncement.attachments.length" class="pt-3 border-t border-slate-100">
                <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2.5">เอกสารแนบ</h4>
                <ul class="space-y-2">
                  <li v-for="file in selectedAnnouncement.attachments" :key="file">
                    <button
                      type="button"
                      class="inline-flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-sm text-slate-700 hover:border-bma-300 hover:text-bma-700 transition-colors cursor-pointer"
                      @click="show('ระบบจำลอง — ยังไม่มีไฟล์เอกสารแนบจริง')"
                    >
                      <FileText class="w-4 h-4 text-bma-600 shrink-0" />
                      {{ file }}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div class="sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-100 px-5 sm:px-7 py-4 flex justify-end">
              <button type="button" class="rounded-xl bg-bma-700 hover:bg-bma-600 text-white text-sm font-semibold px-5 py-2.5 transition-colors cursor-pointer" @click="closeAnnouncement">
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, ref, type Component } from 'vue';
import { useRoute } from 'vue-router';
import {
  CalendarDays,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  FileText,
  GraduationCap,
  Headphones,
  LogIn,
  MapPin,
  Megaphone,
  Menu,
  PenLine,
  Phone,
  ScrollText,
  ShieldCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-vue-next';
import logoUrl from '../assets/logo.png';
import defaultBannerUrl from '../assets/banner-default.svg';
import examCoverUrl from '../assets/announcement-exam.svg';
import selectCoverUrl from '../assets/announcement-select.svg';
import { useToast } from '../composables/useToast';
import { useRecruitmentSite } from '../composables/useRecruitmentSite';
import {
  RECRUITMENT_ANNOUNCEMENTS,
  latestAnnouncement,
  type RecruitmentAnnouncement,
} from '../data/recruitmentAnnouncements';

const { show } = useToast();
const { siteLogo, siteBanner } = useRecruitmentSite();
const route = useRoute();

// --- เมนูนำทาง / สโลแกน / บริการหลัก / หน่วยงาน ---
const NAV_ITEMS = [
  { key: 'home', label: 'หน้าแรก', to: '/recruitment_site' },
  { key: 'select', label: 'การคัดเลือก', to: '/recruitment_site/select' },
  { key: 'exam', label: 'การสอบแข่งขัน', to: '/recruitment_site/exam' },
  { key: 'about', label: 'เกี่ยวกับเรา', to: '/recruitment_site/about' },
] as const;

const SLOGAN = ['โปร่งใส', 'เป็นระบบ', 'เที่ยงธรรม', 'ตรวจสอบได้'];

// 4 เสาหลักของระบบ (Core Pillars) — ใช้ในหน้าแรก (การ์ด 4 ระยะ) และหน้า เกี่ยวกับเรา
const CORE_PILLARS: { no: string; icon: Component; title: string; desc: string }[] = [
  { no: '01', icon: UserPlus, title: 'การรับสมัครผู้เข้ารับการสรรหา', desc: 'ระบบลงทะเบียนออนไลน์ กรอกประวัติการศึกษา และอัปโหลดเอกสารหลักฐานผ่านระบบดิจิทัลที่มีความปลอดภัยสูง' },
  { no: '02', icon: ClipboardList, title: 'จัดการข้อมูลผู้สมัคร', desc: 'ระบบคัดกรองคุณสมบัติเฉพาะตำแหน่ง ตรวจสอบสถานะการชำระเงินค่าธรรมเนียม และตรวจสอบเอกสารประกอบแบบเรียลไทม์' },
  { no: '03', icon: PenLine, title: 'ดำเนินการสอบและประมวลผล', desc: 'ระบบพิมพ์บัตรประจำตัวสอบ ผังที่นั่งสอบรายห้อง และระบบตรวจวิเคราะห์ประมวลผลคะแนนตามมาตรฐานสากล' },
  { no: '04', icon: GraduationCap, title: 'ประกาศผลและบรรจุแต่งตั้ง', desc: 'ตรวจสอบรายชื่อผู้ผ่านเกณฑ์ การขึ้นบัญชีผู้สอบแข่งขันได้ และการรายงานตัวเพื่อบรรจุเป็นข้าราชการ' },
];

// ช่องทางติดต่อและขอความช่วยเหลือ (Support Hub ปิดท้ายหน้าแรก)
const SUPPORT_CHANNELS: { icon: Component; title: string; value: string; note: string }[] = [
  { icon: Phone, title: 'สายด่วนภาครัฐ', value: '1111 กด 9', note: 'มาตรฐานความปลอดภัยภาครัฐ' },
  { icon: Headphones, title: 'ศูนย์รับสมัครสอบ', value: '053-112-299', note: 'สอบถามการสมัคร กำหนดการสอบ และการใช้งานระบบ' },
];

const ORGANIZATIONS = [
  { name: 'สำนักงานกองสรรหา', url: 'https://recruit.bma.go.th' },
  { name: 'หน่วยงาน G-Hr', url: 'https://g-hr.bma.go.th' },
];

const mobileMenuOpen = ref(false);

// --- ส่วนปัจจุบันของเว็บ (จาก path) ---
const section = computed<'home' | 'select' | 'exam' | 'about'>(() => {
  const sub = route.path.split('/')[2];
  if (sub === 'select' || sub === 'exam' || sub === 'about') return sub;
  return 'home';
});

const isActive = (item: { key: string; to: string }) => {
  if (item.key === 'home') return section.value === 'home';
  return section.value === item.key;
};

// --- ประกาศแยกตามหมวด (เรียงล่าสุด → เก่า) ---
// แยกวันที่ภาษาไทย ('28 ตุลาคม 2569') เป็นวัน/เดือนย่อ/ปี สำหรับบล็อกวันที่แบบปฏิทินในการ์ด
const MONTH_ABBR: Record<string, string> = {
  มกราคม: 'ม.ค.',
  กุมภาพันธ์: 'ก.พ.',
  มีนาคม: 'มี.ค.',
  เมษายน: 'เม.ย.',
  พฤษภาคม: 'พ.ค.',
  มิถุนายน: 'มิ.ย.',
  กรกฎาคม: 'ก.ค.',
  สิงหาคม: 'ส.ค.',
  กันยายน: 'ก.ย.',
  ตุลาคม: 'ต.ค.',
  พฤศจิกายน: 'พ.ย.',
  ธันวาคม: 'ธ.ค.',
};
const dateParts = (date: string) => {
  const [day = '', month = '', year = ''] = date.split(' ');
  return { day, monthAbbr: MONTH_ABBR[month] ?? month, year };
};
const selectAnnouncements = computed(() =>
  RECRUITMENT_ANNOUNCEMENTS.filter((a) => a.category === 'select')
);
// หน้าแรกแสดงเฉพาะประกาศการคัดเลือกล่าสุด 4 รายการ (หน้า การคัดเลือก แสดงทั้งหมด)
const homeSelectAnnouncements = computed(() => selectAnnouncements.value.slice(0, 4));
// หน้า การคัดเลือก: ฉบับล่าสุดแสดงแบบเด่น ที่เหลือเป็นรายการก่อนหน้า
const pastSelectAnnouncements = computed(() => selectAnnouncements.value.slice(1));
// รูปประกอบประกาศ: ใช้รูปที่กำหนดเองถ้ามี ไม่เช่นนั้นใช้ภาพประกอบเริ่มต้นตามหมวด
const coverUrl = (item: RecruitmentAnnouncement) =>
  item.image ?? (item.category === 'exam' ? examCoverUrl : selectCoverUrl);
const latestExam = latestAnnouncement('exam');
// รายการประกาศการสอบแข่งขันทั้งหมด (ใช้นับจำนวนในแถบสรุปของหน้า การสอบแข่งขัน)
const examAnnouncements = computed(() =>
  RECRUITMENT_ANNOUNCEMENTS.filter((a) => a.category === 'exam')
);
const pastExamAnnouncements = computed(() => examAnnouncements.value.slice(1));

// --- Modal รายละเอียดประกาศ ---
const selectedAnnouncement = ref<RecruitmentAnnouncement | null>(null);
const openAnnouncement = (item: RecruitmentAnnouncement) => {
  selectedAnnouncement.value = item;
};
const closeAnnouncement = () => {
  selectedAnnouncement.value = null;
};

// --- ส่วนประกอบย่อยของหน้า (local) ---
// แบนเนอร์ย่อยด้านบนของแต่ละหน้าย่อย
const PageHero = defineComponent({
  props: { eyebrow: String, title: String, desc: String },
  setup(props) {
    return () =>
      h('section', { class: 'bg-gradient-to-br from-bma-900 via-bma-800 to-bma-600 text-white' }, [
        h('div', { class: 'max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14' }, [
          props.eyebrow
            ? h(
                'span',
                { class: 'inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wide' },
                props.eyebrow
              )
            : null,
          h('h1', { class: 'mt-4 text-xl sm:text-3xl font-bold' }, props.title),
          props.desc ? h('p', { class: 'mt-2.5 text-sm text-blue-100/85 max-w-2xl leading-relaxed' }, props.desc) : null,
        ]),
      ]);
  },
});

// สถานะว่างเมื่อไม่มีประกาศ
const EmptyState = defineComponent({
  props: { text: String },
  setup(props) {
    return () =>
      h(
        'div',
        { class: 'rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center' },
        [
          h(FileText, { class: 'w-8 h-8 mx-auto text-slate-300' }),
          h('p', { class: 'mt-3 text-sm text-slate-500' }, props.text ?? 'ยังไม่มีประกาศ'),
        ]
      );
  },
});
</script>
