<template>
  <div class="flex flex-col min-h-full w-full">
    <!-- Top Action / Navigation Bar (component ui กลาง) -->
    <PageActionBar
      back-label="ทะเบียนประวัติ"
      :badge="displayPerson.category === 'civil_servant' ? 'ข้าราชการ กทม.' : displayPerson.category === 'permanent_employee' ? 'ลูกจ้างประจำ กทม.' : 'ลูกจ้างชั่วคราว'"
      :subtitle="`เลขที่ประจำตัว: ${displayPerson.officialRegId || '0014-2548-09'}`"
      @back="$emit('back')"
    >
      <template #actions>
        <!-- Actions Dropdown Button -->
        <div class="relative">
          <button
            id="btn-dossier-actions"
            type="button"
            class="h-8 px-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            @click="isActionMenuOpen = !isActionMenuOpen"
          >
            <Download class="w-3.5 h-3.5 text-slate-500" />
            <span>ดำเนินการ</span>
            <ChevronDown class="w-3 h-3 text-slate-400 transition-transform duration-150" :class="{ 'rotate-180': isActionMenuOpen }" />
          </button>

          <div v-if="isActionMenuOpen" class="fixed inset-0 z-20" @click="isActionMenuOpen = false" />

          <div
            v-if="isActionMenuOpen"
            class="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200/90 rounded-2xl shadow-xl py-1 z-30 text-slate-800 text-[13px] animate-in fade-in zoom-in-95 duration-100"
          >
            <div class="px-4 py-2.5 text-xs font-semibold text-slate-400 border-b border-slate-100">
              เลือกประเภทรายการ
            </div>
            <div class="py-1">
              <button
                v-for="item in actionMenuItems"
                :key="item"
                type="button"
                class="w-full text-left px-4 py-2 text-slate-800 hover:text-[#002B7F] hover:bg-slate-50 font-semibold cursor-pointer transition-colors"
                @click="handleSelectAction(item)"
              >
                {{ item }}
              </button>
            </div>
          </div>
        </div>

        <!-- Download File Button -->
        <UiButton
          id="btn-download-kp7-file"
          variant="outline"
          size="xs"
          class="font-semibold shadow-2xs"
          @click="handleDownloadFile"
        >
          <template #icon>
            <Download class="w-3.5 h-3.5 text-slate-500" />
          </template>
          ดาวน์โหลดไฟล์
        </UiButton>
      </template>
    </PageActionBar>


    <!-- Main Content Container with Background -->
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-4 flex flex-col">

    <!-- Top Card: Profile Header Card (Matching Screenshot with Blue Top Accent) -->
    <div class="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      <!-- Blue Decorative Top Bar -->
      <div class="h-1.5 bg-[#003380]" />

      <!-- Profile Identification Section -->
      <div class="p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-start sm:items-center gap-4">
          <!-- Avatar with silhouette and edit overlay -->
          <div class="relative flex-shrink-0">
            <div class="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gradient-to-b from-blue-50 to-blue-100 border border-blue-200/80 flex items-center justify-center text-blue-900 shadow-2xs">
              <img
                v-if="displayPerson.avatarUrl"
                :src="displayPerson.avatarUrl"
                :alt="displayPerson.name"
                class="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <UserCheck v-else class="w-10 h-10 text-blue-900/70" />
            </div>
            <!-- Edit Badge Overlay -->
            <button
              type="button"
              class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-blue-900 shadow-xs flex items-center justify-center cursor-pointer transition-colors"
              title="เปลี่ยนรูปถ่าย"
              @click="show('เปิดหน้าต่างอัปโหลดรูปถ่ายประจำตัวใหม่')"
            >
              <Edit3 class="w-3 h-3" />
            </button>
          </div>

          <!-- Name & Official Numbers -->
          <div class="space-y-1.5">
            <div class="flex flex-wrap items-baseline gap-2">
              <h1 class="text-base sm:text-xl font-bold text-slate-900 tracking-tight">
                {{ displayPerson.name }}
              </h1>
            </div>

            <div class="flex flex-wrap items-center gap-2 pt-0.5">
              <span class="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                รหัสตำแหน่ง: <strong class="text-slate-900">{{ displayPerson.positionNumber || 'สนม. 96' }}</strong>
              </span>
              <span class="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                เลขประจำตัวข้าราชการ: <strong class="text-slate-900">{{ displayPerson.civilServantId || 'กทม. 09241' }}</strong>
              </span>
            </div>
          </div>
        </div>

        <!-- Registry Status Badge (Right aligned) -->
        <div class="flex flex-col md:items-end gap-1.5 self-start md:self-center">
          <span class="text-[11px] font-medium text-slate-400">
            สถานะข้อมูลทะเบียน
          </span>
          <UiBadge tone="emerald" size="sm" class="shadow-2xs">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{{ displayPerson.registryStatus || 'ตรวจสอบและยืนยันแล้ว' }}</span>
          </UiBadge>
        </div>
      </div>

      <!-- 4-Column Quick Overview Metrics (Matching Screenshot) -->
      <div class="border-t border-slate-100 bg-slate-50/40 p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <!-- 1. ตำแหน่งในสายงาน -->
        <div class="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
          <div class="flex items-center gap-2 text-slate-400 text-xs mb-1.5">
            <Briefcase class="w-3.5 h-3.5 text-blue-900" />
            <span class="font-medium text-slate-500 text-[11px]">ตำแหน่งในสายงาน</span>
          </div>
          <div>
            <div class="font-bold text-xs sm:text-sm text-slate-900">
              {{ displayPerson.jobTitle }}
            </div>
            <div class="text-[11px] text-slate-500 mt-0.5">
              {{ displayPerson.jobTitleSub || 'นักบริหารระดับสูง' }}
            </div>
          </div>
        </div>

        <!-- 2. ตำแหน่งประเภท / ระดับ -->
        <div class="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
          <div class="flex items-center gap-2 text-slate-400 text-xs mb-1.5">
            <UserCheck class="w-3.5 h-3.5 text-blue-900" />
            <span class="font-medium text-slate-500 text-[11px]">ตำแหน่งประเภท / ระดับ</span>
          </div>
          <div>
            <div class="font-bold text-xs sm:text-sm text-slate-900">
              {{ displayPerson.positionType }} / {{ displayPerson.positionLevel }}
            </div>
            <div class="text-[11px] text-slate-500 mt-0.5">
              ข้าราชการสามัญ
            </div>
          </div>
        </div>

        <!-- 3. สังกัด / หน่วยงาน -->
        <div class="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
          <div class="flex items-center gap-2 text-slate-400 text-xs mb-1.5">
            <Building2 class="w-3.5 h-3.5 text-blue-900" />
            <span class="font-medium text-slate-500 text-[11px]">สังกัด / หน่วยงาน</span>
          </div>
          <div>
            <div class="font-bold text-xs sm:text-sm text-slate-900 truncate" :title="displayPerson.department">
              {{ displayPerson.department }}
            </div>
            <div class="text-[11px] text-slate-500 mt-0.5">
              {{ displayPerson.departmentSub || 'ศาลาว่าการกรุงเทพมหานคร' }}
            </div>
          </div>
        </div>

        <!-- 4. อายุราชการ / วันบรรจุ -->
        <div class="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
          <div class="flex items-center gap-2 text-slate-400 text-xs mb-1.5">
            <Clock class="w-3.5 h-3.5 text-blue-900" />
            <span class="font-medium text-slate-500 text-[11px]">อายุราชการ / วันบรรจุ</span>
          </div>
          <div>
            <div class="font-bold text-xs sm:text-sm text-slate-900">
              {{ displayPerson.serviceYears || '18 ปี 11 เดือน' }}
            </div>
            <div class="text-[11px] text-slate-500 mt-0.5">
              บรรจุ {{ displayPerson.appointedDate }} • เกษียณปี {{ displayPerson.retirementYear || '2589' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Detailed View: Combined Single Card (Left Sidebar + Right Content in One Card) -->
    <div
      class="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col lg:flex-row items-stretch min-w-0"
      data-purpose="personnel-detail-unified-card"
    >
      <!-- BEGIN: Left Vertical Navigation Menu (Inside unified card) -->
      <div data-purpose="personnel-detail-sidebar" class="w-full">
        <UiSideNav v-model="activeMainSection" :items="mainSections" />
      </div>
      <!-- END: Left Vertical Navigation Menu -->

      <!-- BEGIN: Right Detail Content Container (Inside unified card) -->
      <div
        class="flex-1 min-w-0 bg-white flex flex-col"
        data-purpose="personnel-detail-content"
      >
        <!-- Header of Right Section -->
        <div class="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <!-- Icon + Main Section Title -->
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center flex-shrink-0 border border-blue-100">
              <component :is="currentMainSectionIcon" class="w-4 h-4" />
            </div>
            <h2 class="font-bold text-sm sm:text-base text-slate-900">
              {{ currentMainSectionLabel }}
            </h2>
          </div>

          <!-- Top Right Actions inside Card: ประวัติขอแก้ไข & แก้ไขข้อมูล -->
          <div class="flex items-center gap-2 self-start sm:self-auto">
            <button
              id="btn-edit-history"
              type="button"
              class="h-8 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              @click="isHistoryModalOpen = true"
            >
              <History class="w-3.5 h-3.5 text-slate-500" />
              <span>ประวัติขอแก้ไข</span>
            </button>

            <button
              id="btn-edit-personnel-data"
              type="button"
              class="h-8 px-3.5 bg-[#002B7F] hover:bg-blue-900 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              @click="isEditModalOpen = true"
            >
              <Edit3 class="w-3.5 h-3.5" />
              <span>แก้ไขข้อมูล</span>
            </button>
          </div>
        </div>

        <!-- Horizontal Sub-Tabs Bar (Matching Screenshot) -->
        <div class="border-b border-slate-200 bg-white px-4 sm:px-6 overflow-x-auto flex items-center gap-6 text-xs select-none scrollbar-none">
          <button
            v-for="subTab in currentSubTabs"
            :key="subTab.id"
            type="button"
            class="py-3.5 font-semibold whitespace-nowrap transition-colors relative cursor-pointer"
            :class="
              activeSubTab === subTab.id
                ? 'text-blue-900 border-b-2 border-blue-900 -mb-px'
                : 'text-slate-500 hover:text-slate-800'
            "
            @click="activeSubTab = subTab.id"
          >
            {{ subTab.label }}
          </button>
        </div>

        <!-- Tab Body Content Area -->
        <div class="p-4 sm:p-6 flex-1 bg-white">
          <!-- 1. ข้อมูลส่วนตัว > ประวัติส่วนตัว (Matching Exact 2-Column Screenshot Table) -->
          <div v-if="activeMainSection === 'personal' && activeSubTab === 'personal_profile'" class="space-y-4">
            <div class="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              <!-- Row 1: เลขประจำตัวประชาชน & ชื่อ - สกุล -->
              <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                <div class="p-3 sm:p-4 flex items-center justify-between gap-4 bg-white hover:bg-slate-50/50 transition-colors">
                  <span class="text-slate-500 font-medium w-40 flex-shrink-0">เลขประจำตัวประชาชน</span>
                  <span class="font-bold text-slate-900 font-mono text-xs sm:text-sm">
                    {{ displayPerson.citizenId || '6607205846599' }}
                  </span>
                </div>
                <div class="p-3 sm:p-4 flex items-center justify-between gap-4 bg-white hover:bg-slate-50/50 transition-colors">
                  <span class="text-slate-500 font-medium w-40 flex-shrink-0">ชื่อ - สกุล</span>
                  <span class="font-bold text-slate-900">
                    {{ displayPerson.name }}
                  </span>
                </div>
              </div>

              <!-- Row 2: วันเดือนปีเกิด & อายุ -->
              <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                <div class="p-3 sm:p-4 flex items-center justify-between gap-4 bg-white hover:bg-slate-50/50 transition-colors">
                  <span class="text-slate-500 font-medium w-40 flex-shrink-0">วันเดือนปีเกิด</span>
                  <span class="font-bold text-slate-900">
                    {{ displayPerson.birthDate || '12 ธันวาคม 2529' }}
                  </span>
                </div>
                <div class="p-3 sm:p-4 flex items-center justify-between gap-4 bg-white hover:bg-slate-50/50 transition-colors">
                  <span class="text-slate-500 font-medium w-40 flex-shrink-0">อายุ</span>
                  <span class="font-bold text-slate-900">
                    {{ displayPerson.exactAge || '39 ปี 9 เดือน 3 วัน' }}
                  </span>
                </div>
              </div>

              <!-- Row 3: วันเกษียณอายุราชการ & เพศ / หมู่โลหิต -->
              <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                <div class="p-3 sm:p-4 flex items-center justify-between gap-4 bg-white hover:bg-slate-50/50 transition-colors">
                  <span class="text-slate-500 font-medium w-40 flex-shrink-0">วันเกษียณอายุราชการ</span>
                  <span class="font-bold text-slate-900">
                    {{ displayPerson.retirementDate || '1 ต.ค. 2589' }}
                  </span>
                </div>
                <div class="p-3 sm:p-4 flex items-center justify-between gap-4 bg-white hover:bg-slate-50/50 transition-colors">
                  <span class="text-slate-500 font-medium w-40 flex-shrink-0">เพศ / หมู่โลหิต</span>
                  <span class="font-bold text-slate-900">
                    {{ displayPerson.gender === 'female' ? 'หญิง' : 'ชาย' }} / {{ displayPerson.bloodType || 'AB' }}
                  </span>
                </div>
              </div>

              <!-- Row 4: สัญชาติ / เชื้อชาติ & ศาสนา / สถานภาพ -->
              <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                <div class="p-3 sm:p-4 flex items-center justify-between gap-4 bg-white hover:bg-slate-50/50 transition-colors">
                  <span class="text-slate-500 font-medium w-40 flex-shrink-0">สัญชาติ / เชื้อชาติ</span>
                  <span class="font-bold text-slate-900">
                    {{ displayPerson.nationality || 'ไทย' }} / {{ displayPerson.ethnicity || 'ไทย' }}
                  </span>
                </div>
                <div class="p-3 sm:p-4 flex items-center justify-between gap-4 bg-white hover:bg-slate-50/50 transition-colors">
                  <span class="text-slate-500 font-medium w-40 flex-shrink-0">ศาสนา / สถานภาพ</span>
                  <span class="font-bold text-slate-900">
                    {{ displayPerson.religion || 'อิสลาม' }} / {{ displayPerson.maritalStatus || 'โสด' }}
                  </span>
                </div>
              </div>

              <!-- Row 5: เบอร์โทรศัพท์ & อีเมลราชการ -->
              <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                <div class="p-3 sm:p-4 flex items-center justify-between gap-4 bg-white hover:bg-slate-50/50 transition-colors">
                  <span class="text-slate-500 font-medium w-40 flex-shrink-0">เบอร์โทรศัพท์</span>
                  <span class="font-bold text-slate-900 font-mono">
                    {{ displayPerson.phone || '081–892–XXXX' }}
                  </span>
                </div>
                <div class="p-3 sm:p-4 flex items-center justify-between gap-4 bg-white hover:bg-slate-50/50 transition-colors">
                  <span class="text-slate-500 font-medium w-40 flex-shrink-0">อีเมลราชการ</span>
                  <a
                    :href="'mailto:' + (displayPerson.email || 'oraphin.c@bangkok.go.th')"
                    class="font-bold text-blue-700 hover:text-blue-900 hover:underline"
                  >
                    {{ displayPerson.email || 'oraphin.c@bangkok.go.th' }}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. ข้อมูลส่วนตัว > ประวัติการเปลี่ยนชื่อ - นามสกุล (Using AppTable Standard Design) -->
          <div v-else-if="activeMainSection === 'personal' && activeSubTab === 'name_change'" >
            <AppTable
              :columns="nameChangeColumns"
              :data="filteredNameChangeHistory"
              searchable
              v-model:searchQuery="nameChangeSearchQuery"
              searchPlaceholder="ค้นหา..."
              showColumnButton
              columnButtonText="คอลัมน์"
              emptyText="ไม่พบข้อมูลประวัติการเปลี่ยนชื่อ - นามสกุล"
              @column-click="show('ตั้งค่าการแสดงผลคอลัมน์')"
              @sort="handleNameChangeSort"
            >
              <template #toolbar-left>
                <button
                  type="button"
                  class="h-9 px-4 bg-[#002B7F] hover:bg-blue-900 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  @click="openAddNameChangeModal"
                >
                  <Plus class="w-4 h-4" />
                  <span>เพิ่มรายการใหม่</span>
                </button>
              </template>

              <!-- Cell: ชื่อ (First Name with Current status badge) -->
              <template #cell-firstName="{ row }">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-slate-900">{{ row.firstName }}</span>
                  <span
                    v-if="row.isCurrent"
                    class="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    ปัจจุบัน
                  </span>
                </div>
              </template>

              <!-- Cell: ยศ -->
              <template #cell-rank="{ row }">
                <span class="text-slate-500">{{ row.rank || '-' }}</span>
              </template>

              <!-- Cell: นามสกุล -->
              <template #cell-lastName="{ row }">
                <span class="font-medium text-slate-800">{{ row.lastName }}</span>
              </template>

              <!-- Cell: ผู้ดำเนินการ -->
              <template #cell-operator="{ row }">
                <span class="font-medium text-slate-800">{{ row.operator }}</span>
                <span v-if="row.operatorRole" class="text-slate-400 font-normal ml-1">
                  ({{ row.operatorRole }})
                </span>
              </template>

              <!-- Cell: วันที่แก้ไข -->
              <template #cell-modifiedDate="{ row }">
                <span class="text-slate-700">{{ row.modifiedDate }}</span>
              </template>

              <!-- Cell: เอกสาร / การดำเนินการ -->
              <template #cell-actions="{ row }">
                <div class="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    class="p-1.5 border border-slate-200 rounded-lg text-slate-600 hover:text-blue-900 hover:bg-slate-50 transition-colors cursor-pointer"
                    title="ดาวน์โหลด / เปิดดูเอกสาร"
                    @click="downloadDocument(row)"
                  >
                    <FileDown class="w-4 h-4 text-slate-600" />
                  </button>
                  <button
                    type="button"
                    class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="ลบรายการ"
                    @click="deleteNameChangeItem(row.id)"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </template>
            </AppTable>
          </div>

          <!-- 3. ข้อมูลส่วนตัว > ประวัติการศึกษา -->
          <div v-else-if="activeMainSection === 'personal' && activeSubTab === 'education'" class="space-y-3 text-xs">
            <div class="border border-slate-200 rounded-xl overflow-hidden">
              <table class="w-full text-left">
                <thead class="bg-slate-50/80 border-b border-slate-200/90 text-[12px] font-semibold text-slate-600 tracking-tight select-none">
                  <tr>
                    <th class="py-2.5 px-4">ระดับการศึกษา</th>
                    <th class="py-2.5 px-4">วุฒิการศึกษา</th>
                    <th class="py-2.5 px-4">สาขาวิชา / เอก</th>
                    <th class="py-2.5 px-4">สถาบันการศึกษา</th>
                    <th class="py-2.5 px-4 text-center">ปีที่สำเร็จ</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr class="hover:bg-slate-50/50">
                    <td class="py-3 px-4 font-semibold text-slate-900">ปริญญาโท</td>
                    <td class="py-3 px-4 text-slate-800">{{ displayPerson.degree || 'รัฐประศาสนศาสตรมหาบัณฑิต' }}</td>
                    <td class="py-3 px-4 text-slate-700">{{ displayPerson.major || 'การบริหารทรัพยากรมนุษย์' }}</td>
                    <td class="py-3 px-4 text-slate-600">สถาบันบัณฑิตพัฒนบริหารศาสตร์ (NIDA)</td>
                    <td class="py-3 px-4 text-center font-mono text-slate-600">2552</td>
                  </tr>
                  <tr class="hover:bg-slate-50/50">
                    <td class="py-3 px-4 font-semibold text-slate-900">ปริญญาตรี</td>
                    <td class="py-3 px-4 text-slate-800">รัฐศาสตรบัณฑิต</td>
                    <td class="py-3 px-4 text-slate-700">การปกครอง</td>
                    <td class="py-3 px-4 text-slate-600">จุฬาลงกรณ์มหาวิทยาลัย</td>
                    <td class="py-3 px-4 text-center font-mono text-slate-600">2547</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 3. ข้อมูลส่วนตัว > ข้อมูลที่อยู่ -->
          <div v-else-if="activeMainSection === 'personal' && activeSubTab === 'address'" class="space-y-4 text-xs">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="border border-slate-200 rounded-xl p-4 bg-slate-50/30 space-y-2">
                <div class="flex items-center gap-2 font-bold text-slate-900">
                  <Home class="w-4 h-4 text-blue-900" />
                  <span>ที่อยู่ตามทะเบียนบ้าน</span>
                </div>
                <p class="text-slate-600 leading-relaxed">
                  เลขที่ 173 ถนนดินสอ แขวงเสาชิงช้า เขตพระนคร กรุงเทพมหานคร 10200
                </p>
                <div class="text-[11px] text-slate-400 pt-1">สถานะ: พักอาศัยเอง / เจ้าบ้าน</div>
              </div>

              <div class="border border-slate-200 rounded-xl p-4 bg-slate-50/30 space-y-2">
                <div class="flex items-center gap-2 font-bold text-slate-900">
                  <MapPin class="w-4 h-4 text-blue-900" />
                  <span>ที่อยู่ที่สามารถติดต่อได้ในปัจจุบัน</span>
                </div>
                <p class="text-slate-600 leading-relaxed">
                  เลขที่ 173 ถนนดินสอ แขวงเสาชิงช้า เขตพระนคร กรุงเทพมหานคร 10200
                </p>
                <div class="text-[11px] text-slate-400 pt-1">สถานะ: ตรงกับที่อยู่ตามทะเบียนบ้าน</div>
              </div>
            </div>
          </div>

          <!-- 4. ข้อมูลราชการ Section -->
          <div v-else-if="activeMainSection === 'official'" class="space-y-4 text-xs">
            <div class="border border-slate-200 rounded-xl overflow-hidden">
              <table class="w-full text-left">
                <thead class="bg-slate-50/80 border-b border-slate-200/90 text-[12px] font-semibold text-slate-600 tracking-tight select-none">
                  <tr>
                    <th class="py-2.5 px-4">วันที่แต่งตั้ง</th>
                    <th class="py-2.5 px-4">ตำแหน่งในสายงาน</th>
                    <th class="py-2.5 px-4">ตำแหน่งประเภท / ระดับ</th>
                    <th class="py-2.5 px-4">สังกัด / หน่วยงาน</th>
                    <th class="py-2.5 px-4">คำสั่ง กทม.</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr class="hover:bg-slate-50/50">
                    <td class="py-3 px-4 font-mono font-semibold text-blue-900">1 ต.ค. 2564</td>
                    <td class="py-3 px-4 font-semibold text-slate-900">รองผู้อำนวยการสำนัก</td>
                    <td class="py-3 px-4 text-slate-700">บริหาร / สูง</td>
                    <td class="py-3 px-4 text-slate-600">สำนักงานคณะกรรมการข้าราชการกรุงเทพมหานคร</td>
                    <td class="py-3 px-4 text-slate-500 font-mono">ที่ 1042/2564</td>
                  </tr>
                  <tr class="hover:bg-slate-50/50">
                    <td class="py-3 px-4 font-mono font-semibold text-slate-700">1 ต.ค. 2558</td>
                    <td class="py-3 px-4 font-semibold text-slate-900">ผู้อำนวยการกองพัฒนาระบบราชการ</td>
                    <td class="py-3 px-4 text-slate-700">อำนวยการ / สูง</td>
                    <td class="py-3 px-4 text-slate-600">สำนักงาน ก.ก.</td>
                    <td class="py-3 px-4 text-slate-500 font-mono">ที่ 820/2558</td>
                  </tr>
                  <tr class="hover:bg-slate-50/50">
                    <td class="py-3 px-4 font-mono font-semibold text-slate-700">1 ต.ค. 2548</td>
                    <td class="py-3 px-4 font-semibold text-slate-900">นักทรัพยากรบุคคล</td>
                    <td class="py-3 px-4 text-slate-700">วิชาการ / ปฏิบัติการ</td>
                    <td class="py-3 px-4 text-slate-600">สำนักปลัดกรุงเทพมหานคร</td>
                    <td class="py-3 px-4 text-slate-500 font-mono">ที่ 301/2548 (บรรจุใหม่)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 5. เงินเดือน Section -->
          <div v-else-if="activeMainSection === 'salary'" class="space-y-4 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div class="bg-blue-50/60 border border-blue-200/80 p-3.5 rounded-xl">
                <span class="text-blue-900/70 font-medium text-[11px] block">เงินเดือนปัจจุบัน</span>
                <span class="text-base sm:text-lg font-bold text-blue-950 font-mono">68,350 บาท</span>
              </div>
              <div class="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                <span class="text-slate-500 font-medium text-[11px] block">เงินประจำตำแหน่ง</span>
                <span class="text-base sm:text-lg font-bold text-slate-900 font-mono">14,500 บาท</span>
              </div>
              <div class="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                <span class="text-slate-500 font-medium text-[11px] block">เงินเพิ่มค่าครองชีพ / อื่นๆ</span>
                <span class="text-base sm:text-lg font-bold text-slate-900 font-mono">10,000 บาท</span>
              </div>
            </div>
            <p class="text-slate-500 text-[11px]">
              * บันทึกการเลื่อนเงินเดือนล่าสุด: เลื่อนร้อยละ 3.25 ตามผลการประเมินรอบที่ 1/2569
            </p>
          </div>

          <!-- 6. ข้อมูลผลงาน & รางวัล Section -->
          <div v-else-if="activeMainSection === 'performance'" class="space-y-3 text-xs">
            <div class="border border-slate-200 rounded-xl p-4 bg-amber-50/30 flex items-start gap-3">
              <Award class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 class="font-bold text-slate-900 text-xs sm:text-sm">
                  เครื่องราชอิสริยาภรณ์ชั้นสายสะพาย: มหาวชิรมงกุฎ (ม.ว.ม.)
                </h4>
                <p class="text-slate-600 mt-1 leading-relaxed">
                  ได้รับพระราชทานเนื่องในโอกาสพระราชพิธีเฉลิมพระชนมพรรษา ประจำปี 2565
                </p>
              </div>
            </div>
            <div class="border border-slate-200 rounded-xl p-4 bg-slate-50/40 flex items-start gap-3">
              <Medal class="w-5 h-5 text-blue-900 flex-shrink-0 mt-0.5" />
              <div>
                <h4 class="font-bold text-slate-900 text-xs sm:text-sm">
                  ข้าราชการกรุงเทพมหานครดีเด่น ประจำปี 2563
                </h4>
                <p class="text-slate-600 mt-1 leading-relaxed">
                  รางวัลผู้มีผลงานดีเด่นด้านการพัฒนานวัตกรรมการบริหารทรัพยากรบุคคลภาครัฐ
                </p>
              </div>
            </div>
          </div>

          <!-- 7. ข้อมูลอื่นๆ Section -->
          <div v-else class="space-y-3 text-xs">
            <div class="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <h4 class="font-bold text-slate-900 mb-2">สรุปสิทธิวันลาประจำปีงบประมาณ 2569</h4>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <span class="text-slate-400 text-[11px] block">ลาพักผ่อนคงเหลือ</span>
                  <strong class="text-blue-900 text-sm">8.5 วัน</strong>
                </div>
                <div class="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <span class="text-slate-400 text-[11px] block">ลาป่วยสะสม</span>
                  <strong class="text-slate-800 text-sm">2 วัน</strong>
                </div>
                <div class="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <span class="text-slate-400 text-[11px] block">ลากิจส่วนตัว</span>
                  <strong class="text-slate-800 text-sm">0 วัน</strong>
                </div>
                <div class="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
                  <span class="text-slate-400 text-[11px] block">การลงโทษทางวินัย</span>
                  <strong class="text-emerald-700 text-sm">ไม่พบประวัติ</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- END: Right Detail Content Container -->
    </div>
  </div>

    <!-- Edit Personnel Modal -->
    <UiModal
      :is-open="isEditModalOpen"
      max-width="max-w-xl sm:max-w-2xl"
      title="แก้ไขข้อมูลประวัติส่วนตัว"
      :subtitle="`${displayPerson.name} · เลขประจำตัวข้าราชการ: ${displayPerson.civilServantId || 'กทม. 09241'}`"
      @close="isEditModalOpen = false"
    >
      <template #icon>
        <Edit3 class="w-5 h-5 text-blue-900" />
      </template>

      <!-- Modal Body -->
      <div class="space-y-3.5 text-xs">
        <!-- เลขประจำตัวประชาชน (Locked) -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block font-medium text-slate-700">เลขประจำตัวประชาชน</label>
            <span class="text-[11px] text-slate-400 flex items-center gap-1">
              <Lock class="w-3 h-3" /> ล็อคระบบ (ไม่สามารถแก้ไขได้)
            </span>
          </div>
          <input
            type="text"
            :value="displayPerson.citizenId || '6607205846599'"
            disabled
            class="w-full text-xs h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 text-slate-600 font-mono cursor-not-allowed select-all"
          />
        </div>

        <!-- Row: คำนำหน้านาม & ชื่อ (ภาษาไทย) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="block font-medium text-slate-700">คำนำหน้านาม</label>
            <div class="relative">
              <select
                v-model="editForm.titlePrefix"
                class="w-full text-xs h-9 bg-white border border-slate-200 rounded-lg px-3 pr-8 text-slate-800 appearance-none cursor-pointer focus:border-blue-700 focus:ring-0"
              >
                <option value="นางสาว">นางสาว</option>
                <option value="นาง">นาง</option>
                <option value="นาย">นาย</option>
                <option value="ดร.">ดร.</option>
              </select>
              <ChevronDown class="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
          <div class="space-y-1">
            <label class="block font-medium text-slate-700">ชื่อ (ภาษาไทย)</label>
            <input
              v-model="editForm.firstName"
              type="text"
              class="w-full text-xs h-9 bg-white border border-slate-200 rounded-lg px-3 focus:border-blue-700 focus:ring-0 text-slate-800"
            />
          </div>
        </div>

        <!-- Row: นามสกุล (ภาษาไทย) & วันเกิด -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="block font-medium text-slate-700">นามสกุล (ภาษาไทย)</label>
            <input
              v-model="editForm.lastName"
              type="text"
              class="w-full text-xs h-9 bg-white border border-slate-200 rounded-lg px-3 focus:border-blue-700 focus:ring-0 text-slate-800"
            />
          </div>
          <div class="space-y-1">
            <label class="block font-medium text-slate-700">วันเกิด</label>
            <input
              v-model="editForm.birthDate"
              type="text"
              class="w-full text-xs h-9 bg-white border border-slate-200 rounded-lg px-3 focus:border-blue-700 focus:ring-0 text-slate-800"
            />
          </div>
        </div>

        <!-- Row: เพศ & หมู่เลือด -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="block font-medium text-slate-700">เพศ</label>
            <div class="relative">
              <select
                v-model="editForm.gender"
                class="w-full text-xs h-9 bg-white border border-slate-200 rounded-lg px-3 pr-8 text-slate-800 appearance-none cursor-pointer focus:border-blue-700 focus:ring-0"
              >
                <option value="หญิง">หญิง</option>
                <option value="ชาย">ชาย</option>
              </select>
              <ChevronDown class="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
          <div class="space-y-1">
            <label class="block font-medium text-slate-700">หมู่เลือด</label>
            <div class="relative">
              <select
                v-model="editForm.bloodGroup"
                class="w-full text-xs h-9 bg-white border border-slate-200 rounded-lg px-3 pr-8 text-slate-800 appearance-none cursor-pointer focus:border-blue-700 focus:ring-0"
              >
                <option value="AB">AB</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="O">O</option>
              </select>
              <ChevronDown class="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        <!-- Row: ศาสนา & สถานภาพ -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="block font-medium text-slate-700">ศาสนา</label>
            <div class="relative">
              <select
                v-model="editForm.religion"
                class="w-full text-xs h-9 bg-white border border-slate-200 rounded-lg px-3 pr-8 text-slate-800 appearance-none cursor-pointer focus:border-blue-700 focus:ring-0"
              >
                <option value="อิสลาม">อิสลาม</option>
                <option value="พุทธ">พุทธ</option>
                <option value="คริสต์">คริสต์</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
              <ChevronDown class="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
          <div class="space-y-1">
            <label class="block font-medium text-slate-700">สถานภาพ</label>
            <div class="relative">
              <select
                v-model="editForm.maritalStatus"
                class="w-full text-xs h-9 bg-white border border-slate-200 rounded-lg px-3 pr-8 text-slate-800 appearance-none cursor-pointer focus:border-blue-700 focus:ring-0"
              >
                <option value="โสด">โสด</option>
                <option value="สมรส">สมรส</option>
                <option value="หย่าร้าง">หย่าร้าง</option>
                <option value="หม้าย">หม้าย</option>
              </select>
              <ChevronDown class="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        <!-- Row: สัญชาติ / เชื้อชาติ & เบอร์โทรศัพท์ติดต่อ -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="block font-medium text-slate-700">สัญชาติ / เชื้อชาติ</label>
            <input
              v-model="editForm.nationality"
              type="text"
              class="w-full text-xs h-9 bg-white border border-slate-200 rounded-lg px-3 focus:border-blue-700 focus:ring-0 text-slate-800"
            />
          </div>
          <div class="space-y-1">
            <label class="block font-medium text-slate-700">เบอร์โทรศัพท์ติดต่อ</label>
            <input
              v-model="editForm.phone"
              type="text"
              class="w-full text-xs h-9 bg-white border border-slate-200 rounded-lg px-3 focus:border-blue-700 focus:ring-0 text-slate-800"
            />
          </div>
        </div>

        <!-- Row: อีเมลราชการ -->
        <div class="space-y-1">
          <label class="block font-medium text-slate-700">อีเมลราชการ</label>
          <input
            v-model="editForm.email"
            type="email"
            class="w-full text-xs h-9 bg-white border border-slate-200 rounded-lg px-3 focus:border-blue-700 focus:ring-0 text-slate-800"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-end gap-2">
          <button
            type="button"
            class="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
            @click="isEditModalOpen = false"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            class="px-4 py-1.5 text-xs font-semibold text-white bg-[#002B7F] hover:bg-blue-900 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
            @click="handleSaveEdit"
          >
            <Check class="w-3.5 h-3.5" />
            <span>บันทึกและส่งคำขอแก้ไข</span>
          </button>
        </div>
      </template>
    </UiModal>

    <!-- Edit History Logs Modal -->
    <UiModal
      :is-open="isHistoryModalOpen"
      max-width="max-w-5xl lg:max-w-6xl"
      @close="isHistoryModalOpen = false"
    >
      <template #header>
        <History class="w-4 h-4 text-blue-900" />
        <h3 class="font-bold text-sm text-slate-900">ประวัติการแก้ไขข้อมูล</h3>
      </template>

      <div class="space-y-3.5">
          <!-- Top Toolbar: Search & Column Button -->
          <div class="flex items-center justify-end gap-2.5">
            <div class="relative w-56 sm:w-64">
              <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                v-model="historySearchQuery"
                type="text"
                placeholder="ค้นหา..."
                class="w-full h-9 pl-9 pr-3 text-xs bg-white border border-slate-200 hover:border-slate-300 rounded-lg focus:border-blue-700 focus:ring-1 focus:ring-blue-700 text-slate-800 placeholder-slate-400 transition-colors"
              />
            </div>
            <button
              type="button"
              class="h-9 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg inline-flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            >
              <SlidersHorizontal class="w-3.5 h-3.5 text-slate-500" />
              <span>คอลัมน์</span>
            </button>
          </div>

          <!-- Table Container Card -->
          <div class="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50/80 border-b border-slate-200/90 text-[12px] font-semibold text-slate-600 tracking-tight select-none">
                    <th class="py-3.5 px-4 text-center w-12 whitespace-nowrap">ลำดับ</th>
                    <th class="py-3.5 px-4 whitespace-nowrap">เลขประจำตัวประชาชน</th>
                    <th class="py-3.5 px-4 whitespace-nowrap">ชื่อ - นามสกุล</th>
                    <th class="py-3.5 px-4 whitespace-nowrap">วัน/เดือน/ปี เกิด</th>
                    <th class="py-3.5 px-4 text-center whitespace-nowrap">เพศ</th>
                    <th class="py-3.5 px-4 text-center whitespace-nowrap">หมู่เลือด</th>
                    <th class="py-3.5 px-4 text-center whitespace-nowrap">สถานภาพ</th>
                    <th class="py-3.5 px-4 text-center whitespace-nowrap">สัญชาติ</th>
                    <th class="py-3.5 px-4 text-center whitespace-nowrap">เชื้อชาติ</th>
                    <th class="py-3.5 px-4 whitespace-nowrap">ผู้ดำเนินการ</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr
                    v-for="(log, idx) in filteredHistoryLogs"
                    :key="log.id"
                    class="hover:bg-slate-50/70 transition-colors"
                  >
                    <td class="py-3.5 px-3.5 text-center text-slate-500 font-medium whitespace-nowrap">
                      {{ idx + 1 }}
                    </td>
                    <td class="py-3.5 px-3.5 whitespace-nowrap">
                      <div class="flex items-center gap-1.5 font-mono text-slate-700">
                        <span>{{ log.citizenId }}</span>
                        <button
                          type="button"
                          class="p-1 text-slate-400 hover:text-blue-900 rounded hover:bg-slate-100 cursor-pointer transition-colors"
                          title="คัดลอกเลขประจำตัวประชาชน"
                          @click="copyCitizenId(log.citizenId)"
                        >
                          <Copy class="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td class="py-3.5 px-3.5 whitespace-nowrap">
                      <div class="font-bold text-slate-900 leading-snug">
                        {{ log.name }}
                      </div>
                      <div class="text-[11px] text-slate-400 font-normal mt-0.5">
                        {{ log.nameNote || 'ไม่มีระบุคำนำหน้าชื่อและยศ' }}
                      </div>
                    </td>
                    <td class="py-3.5 px-3.5 text-slate-700 whitespace-nowrap">
                      {{ log.birthDate }}
                    </td>
                    <td class="py-3.5 px-3.5 text-center text-slate-700 whitespace-nowrap">
                      {{ log.gender }}
                    </td>
                    <td class="py-3.5 px-3.5 text-center font-bold text-slate-800 whitespace-nowrap">
                      {{ log.bloodGroup }}
                    </td>
                    <td class="py-3.5 px-3.5 text-center text-slate-400 whitespace-nowrap">
                      {{ log.maritalStatus || '-' }}
                    </td>
                    <td class="py-3.5 px-3.5 text-center text-slate-400 whitespace-nowrap">
                      {{ log.nationality || '-' }}
                    </td>
                    <td class="py-3.5 px-3.5 text-center text-slate-400 whitespace-nowrap">
                      {{ log.ethnicity || '-' }}
                    </td>
                    <td class="py-3.5 px-3.5 whitespace-nowrap">
                      <div class="font-bold text-slate-900 leading-snug">
                        {{ log.operator }}
                      </div>
                      <div class="text-[11px] text-slate-400 font-normal mt-0.5">
                        {{ log.operatorRole }}
                      </div>
                    </td>
                  </tr>
                  <tr v-if="filteredHistoryLogs.length === 0">
                    <td colspan="10" class="py-8 text-center text-slate-400 text-xs">
                      ไม่พบข้อมูลประวัติการแก้ไขตามเงื่อนไขที่ค้นหา
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Bottom Pagination Bar Matching Screenshot -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 pt-1">
            <div>
              แสดง 1 ถึง {{ filteredHistoryLogs.length }} จากทั้งหมด {{ filteredHistoryLogs.length }} รายการ
            </div>
            <div class="flex items-center gap-3">
              <span class="text-slate-600">แถวต่อหน้า:</span>
              <div class="relative">
                <select
                  v-model="historyPageSize"
                  class="h-8 pl-3 pr-7 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 appearance-none cursor-pointer focus:border-blue-700 focus:ring-0"
                >
                  <option :value="10">10 แถวต่อหน้า</option>
                  <option :value="20">20 แถวต่อหน้า</option>
                  <option :value="50">50 แถวต่อหน้า</option>
                </select>
                <ChevronDown class="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  class="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled
                >
                  <ChevronLeft class="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  class="w-7 h-7 flex items-center justify-center rounded-lg bg-[#002B7F] text-white font-bold text-xs shadow-2xs cursor-pointer"
                >
                  1
                </button>
                <button
                  type="button"
                  class="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled
                >
                  <ChevronRight class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
    </UiModal>

    <!-- Modal: เพิ่มประวัติการเปลี่ยนชื่อ - นามสกุล -->
    <UiModal
      :is-open="isAddNameChangeModalOpen"
      title="เพิ่มประวัติการเปลี่ยนชื่อ - นามสกุล"
      @close="isAddNameChangeModalOpen = false"
    >
      <template #icon>
        <UserCheck class="w-5 h-5 text-blue-900" />
      </template>

      <form id="add-name-change-form" class="space-y-3.5 text-xs" @submit.prevent="submitAddNameChange">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">คำนำหน้าชื่อ</label>
            <select
              v-model="newNameChangeForm.titlePrefix"
              class="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 text-xs"
            >
              <option value="นางสาว">นางสาว</option>
              <option value="นาง">นาง</option>
              <option value="นาย">นาย</option>
              <option value="ดร.">ดร.</option>
            </select>
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">ยศ (ถ้ามี)</label>
            <input
              v-model="newNameChangeForm.rank"
              type="text"
              placeholder="-"
              class="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 text-xs"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">ชื่อ <span class="text-rose-500">*</span></label>
            <input
              v-model="newNameChangeForm.firstName"
              type="text"
              required
              placeholder="ชื่อ"
              class="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 text-xs"
            />
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">นามสกุล <span class="text-rose-500">*</span></label>
            <input
              v-model="newNameChangeForm.lastName"
              type="text"
              required
              placeholder="นามสกุล"
              class="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 text-xs"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">ผู้ดำเนินการ</label>
            <input
              v-model="newNameChangeForm.operator"
              type="text"
              placeholder="ชื่อผู้ดำเนินการ"
              class="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 text-xs"
            />
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">ตำแหน่ง / หน่วยงาน</label>
            <input
              v-model="newNameChangeForm.operatorRole"
              type="text"
              placeholder="เช่น เจ้าหน้าที่บุคคล"
              class="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 text-xs"
            />
          </div>
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">วันที่แก้ไข</label>
          <input
            v-model="newNameChangeForm.modifiedDate"
            type="text"
            placeholder="เช่น 21 ก.ย. 2569"
            class="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 text-xs"
          />
        </div>

        <div class="flex items-center gap-2 pt-1">
          <input
            id="is-current-checkbox"
            v-model="newNameChangeForm.isCurrent"
            type="checkbox"
            class="w-4 h-4 rounded text-blue-900 border-slate-300 focus:ring-blue-700 cursor-pointer"
          />
          <label for="is-current-checkbox" class="text-xs text-slate-700 cursor-pointer select-none">
            กำหนดเป็นชื่อ-นามสกุลปัจจุบัน
          </label>
        </div>

      </form>

      <template #footer>
        <div class="flex items-center justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
            @click="isAddNameChangeModalOpen = false"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            form="add-name-change-form"
            class="px-4 py-2 text-xs font-semibold text-white bg-bma-700 hover:bg-blue-900 rounded-lg shadow-xs cursor-pointer"
          >
            บันทึกรายการ
          </button>
        </div>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { PersonnelRecord } from '../../types';
import { AppTable, type AppTableColumn } from '../ui';
import { PageActionBar } from '../ui';
import { UiBadge, UiButton, UiModal, UiSideNav } from '../ui';
import {
  ArrowLeft,
  Download,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  UserCheck,
  Briefcase,
  Building2,
  Clock,
  Edit3,
  History,
  Printer,
  FileDown,
  FolderCheck,
  CreditCard,
  Award,
  FileText,
  Home,
  MapPin,
  Medal,
  Lock,
  Check,
  Search,
  Copy,
  SlidersHorizontal,
  Plus,
  Trash2,
  ChevronsUpDown,
} from 'lucide-vue-next';
import { useToast } from '../../composables/useToast';
const { show } = useToast();

interface PersonnelHistoryLog {
  id: number;
  citizenId: string;
  name: string;
  nameNote?: string;
  birthDate: string;
  gender: string;
  bloodGroup: string;
  maritalStatus: string;
  nationality: string;
  ethnicity: string;
  operator: string;
  operatorRole: string;
}

const props = defineProps<{
  person: PersonnelRecord;
}>();

const emit = defineEmits<{
  (e: 'back'): void;
}>();

const displayPerson = ref<PersonnelRecord>(props.person ? { ...props.person } : ({} as PersonnelRecord));

const isActionMenuOpen = ref(false);
const isEditModalOpen = ref(false);
const isHistoryModalOpen = ref(false);

const historySearchQuery = ref('');
const historyPage = ref(1);
const historyPageSize = ref(10);

const historyLogs = ref<PersonnelHistoryLog[]>([
  {
    id: 1,
    citizenId: '9051489274352',
    name: 'อภิรดี วงศ์สุวรรณ',
    nameNote: 'ไม่มีระบุคำนำหน้าชื่อและยศ',
    birthDate: '22 ก.พ. 2547',
    gender: 'หญิง',
    bloodGroup: 'A',
    maritalStatus: '-',
    nationality: '-',
    ethnicity: '-',
    operator: 'สมชาย ใจดี',
    operatorRole: 'จนท.บุคคลชำนาญการ',
  },
]);

const filteredHistoryLogs = computed(() => {
  if (!historySearchQuery.value.trim()) {
    return historyLogs.value;
  }
  const q = historySearchQuery.value.trim().toLowerCase();
  return historyLogs.value.filter(
    (item) =>
      item.citizenId.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.operator.toLowerCase().includes(q) ||
      item.bloodGroup.toLowerCase().includes(q) ||
      item.gender.toLowerCase().includes(q)
  );
});

const copyCitizenId = async (id: string) => {
  try {
    await navigator.clipboard.writeText(id);
    show(`คัดลอกเลขประจำตัวประชาชน ${id} เรียบร้อยแล้ว`);
  } catch {
    show(`เลขประจำตัวประชาชน: ${id}`);
  }
};

const activeMainSection = ref('personal');
const activeSubTab = ref('name_change');

interface NameChangeRecord {
  id: number;
  titlePrefix: string;
  rank: string;
  firstName: string;
  lastName: string;
  operator: string;
  operatorRole?: string;
  modifiedDate: string;
  isCurrent?: boolean;
}

const nameChangeColumns: AppTableColumn[] = [
  { key: 'titlePrefix', label: 'คำนำหน้าชื่อ' },
  { key: 'rank', label: 'ยศ' },
  { key: 'firstName', label: 'ชื่อ' },
  { key: 'lastName', label: 'นามสกุล' },
  { key: 'operator', label: 'ผู้ดำเนินการ' },
  { key: 'modifiedDate', label: 'วันที่แก้ไข', sortable: true },
  { key: 'actions', label: 'เอกสาร / การดำเนินการ', align: 'center' },
];

const nameChangeHistory = ref<NameChangeRecord[]>([
  {
    id: 1,
    titlePrefix: 'นางสาว',
    rank: '-',
    firstName: 'อรพินท์',
    lastName: 'จันทร์เจ้า',
    operator: 'สมชาย ใจดี',
    operatorRole: 'เจ้าหน้าที่บุคคล',
    modifiedDate: '15 พ.ค. 2565',
    isCurrent: true,
  },
  {
    id: 2,
    titlePrefix: 'นางสาว',
    rank: '-',
    firstName: 'วาสนา',
    lastName: 'จันทร์เจ้า',
    operator: 'กองการเจ้าหน้าที่ สำนักปลัด กทม.',
    operatorRole: '',
    modifiedDate: '10 มี.ค. 2558',
    isCurrent: false,
  },
]);

const nameChangeSearchQuery = ref('');
const nameChangeSortAsc = ref(false);

const filteredNameChangeHistory = computed(() => {
  let list = nameChangeHistory.value;
  if (nameChangeSearchQuery.value.trim()) {
    const q = nameChangeSearchQuery.value.trim().toLowerCase();
    list = list.filter(
      (item) =>
        item.titlePrefix.toLowerCase().includes(q) ||
        item.firstName.toLowerCase().includes(q) ||
        item.lastName.toLowerCase().includes(q) ||
        item.operator.toLowerCase().includes(q) ||
        item.modifiedDate.toLowerCase().includes(q)
    );
  }
  return [...list].sort((a, b) => {
    return nameChangeSortAsc.value ? a.id - b.id : b.id - a.id;
  });
});

const isAddNameChangeModalOpen = ref(false);
const newNameChangeForm = ref({
  titlePrefix: 'นางสาว',
  rank: '-',
  firstName: '',
  lastName: '',
  operator: 'สมชาย ใจดี',
  operatorRole: 'เจ้าหน้าที่บุคคล',
  modifiedDate: '21 ก.ย. 2569',
  isCurrent: true,
});

const openAddNameChangeModal = () => {
  newNameChangeForm.value = {
    titlePrefix: 'นางสาว',
    rank: '-',
    firstName: '',
    lastName: '',
    operator: 'สมชาย ใจดี',
    operatorRole: 'เจ้าหน้าที่บุคคล',
    modifiedDate: '21 ก.ย. 2569',
    isCurrent: true,
  };
  isAddNameChangeModalOpen.value = true;
};

const submitAddNameChange = () => {
  if (!newNameChangeForm.value.firstName.trim() || !newNameChangeForm.value.lastName.trim()) {
    show('กรุณากรอกชื่อและนามสกุล');
    return;
  }

  if (newNameChangeForm.value.isCurrent) {
    nameChangeHistory.value.forEach((item) => {
      item.isCurrent = false;
    });
    displayPerson.value.name = `${newNameChangeForm.value.titlePrefix}${newNameChangeForm.value.firstName} ${newNameChangeForm.value.lastName}`;
  }

  nameChangeHistory.value.unshift({
    id: Date.now(),
    titlePrefix: newNameChangeForm.value.titlePrefix,
    rank: newNameChangeForm.value.rank || '-',
    firstName: newNameChangeForm.value.firstName.trim(),
    lastName: newNameChangeForm.value.lastName.trim(),
    operator: newNameChangeForm.value.operator || 'สมชาย ใจดี',
    operatorRole: newNameChangeForm.value.operatorRole || '',
    modifiedDate: newNameChangeForm.value.modifiedDate || '21 ก.ย. 2569',
    isCurrent: newNameChangeForm.value.isCurrent,
  });

  isAddNameChangeModalOpen.value = false;
  show('บันทึกประวัติการเปลี่ยนชื่อ - นามสกุลเรียบร้อยแล้ว');
};

const deleteNameChangeItem = (id: number) => {
  nameChangeHistory.value = nameChangeHistory.value.filter((item) => item.id !== id);
  show('ลบรายการประวัติการเปลี่ยนชื่อเรียบร้อยแล้ว');
};

const downloadDocument = (item: NameChangeRecord) => {
  show(`กำลังเปิดเอกสารคำขอเปลี่ยนชื่อ: ${item.firstName} ${item.lastName}`);
};

const toggleNameChangeSort = () => {
  nameChangeSortAsc.value = !nameChangeSortAsc.value;
  show(`เรียงลำดับตามวันที่: ${nameChangeSortAsc.value ? 'เก่าไปใหม่' : 'ใหม่ไปเก่า'}`);
};

const handleNameChangeSort = (_key: string, order: 'asc' | 'desc') => {
  nameChangeSortAsc.value = order === 'asc';
  show(`เรียงลำดับตามวันที่: ${order === 'asc' ? 'เก่าไปใหม่' : 'ใหม่ไปเก่า'}`);
};

const editForm = ref({
  titlePrefix: 'นางสาว',
  firstName: 'อรพินท์',
  lastName: 'จันทร์เจ้า',
  birthDate: '12 ธันวาคม 2529',
  gender: 'หญิง',
  bloodGroup: 'AB',
  religion: 'อิสลาม',
  maritalStatus: 'โสด',
  nationality: 'ไทย / ไทย',
  phone: '081–892–XXXX',
  email: 'oraphin.c@bangkok.go.th',
});

// Left Sidebar sections matching screenshot
const mainSections = [
  { id: 'personal', label: 'ข้อมูลส่วนตัว', icon: UserCheck },
  { id: 'official', label: 'ข้อมูลราชการ', icon: Briefcase },
  { id: 'salary', label: 'เงินเดือน', icon: CreditCard },
  { id: 'performance', label: 'ข้อมูลผลงาน', icon: Award },
  { id: 'others', label: 'ข้อมูลอื่นๆ', icon: FileText },
];

const currentMainSectionLabel = computed(() => {
  return mainSections.find((s) => s.id === activeMainSection.value)?.label || 'ข้อมูลส่วนตัว';
});

const currentMainSectionIcon = computed(() => {
  return mainSections.find((s) => s.id === activeMainSection.value)?.icon || UserCheck;
});

// Subtabs per section
const currentSubTabs = computed(() => {
  switch (activeMainSection.value) {
    case 'personal':
      return [
        { id: 'personal_profile', label: 'ประวัติส่วนตัว' },
        { id: 'name_change', label: 'ประวัติการเปลี่ยนชื่อ - นามสกุล' },
        { id: 'address', label: 'ข้อมูลที่อยู่' },
        { id: 'family', label: 'ข้อมูลครอบครัว' },
        { id: 'education', label: 'ประวัติการศึกษา' },
        { id: 'special_skill', label: 'ความสามารถพิเศษ' },
      ];
    case 'official':
      return [
        { id: 'tenure_history', label: 'ประวัติการดำรงตำแหน่ง' },
        { id: 'rank_promotion', label: 'การเลื่อนระดับ' },
        { id: 'transfer_order', label: 'การโอนย้าย/ช่วยราชการ' },
        { id: 'evaluation', label: 'การประเมินผลการปฏิบัติงาน' },
      ];
    case 'salary':
      return [
        { id: 'salary_history', label: 'ประวัติการรับเงินเดือน' },
        { id: 'position_allowance', label: 'เงินประจำตำแหน่ง' },
        { id: 'special_bonus', label: 'ค่าตอบแทนพิเศษ' },
      ];
    case 'performance':
      return [
        { id: 'royal_decorations', label: 'เครื่องราชอิสริยาภรณ์' },
        { id: 'academic_work', label: 'ผลงานทางวิชาการ' },
        { id: 'honors_awards', label: 'รางวัล/การเชิดชูเกียรติ' },
      ];
    case 'others':
      return [
        { id: 'leave_record', label: 'ประวัติการลา' },
        { id: 'disciplinary', label: 'การลงโทษทางวินัย' },
        { id: 'training_abroad', label: 'การฝึกอบรม/ดูงาน' },
      ];
    default:
      return [{ id: 'general', label: 'ข้อมูลทั่วไป' }];
  }
});

watch(
  () => props.person,
  (newPerson) => {
    if (newPerson) {
      displayPerson.value = { ...newPerson };

      const fullName = newPerson.name || 'นางสาวอรพินท์ จันทร์เจ้า';
      let prefix = 'นางสาว';
      let rest = fullName;
      if (rest.startsWith('นางสาว')) {
        prefix = 'นางสาว';
        rest = rest.replace(/^นางสาว\s*/, '');
      } else if (rest.startsWith('นาง')) {
        prefix = 'นาง';
        rest = rest.replace(/^นาง\s*/, '');
      } else if (rest.startsWith('นาย')) {
        prefix = 'นาย';
        rest = rest.replace(/^นาย\s*/, '');
      } else if (rest.startsWith('ดร.')) {
        prefix = 'ดร.';
        rest = rest.replace(/^ดร\.\s*/, '');
      }

      const parts = rest.trim().split(/\s+/);
      const first = parts[0] || 'อรพินท์';
      const last = parts.slice(1).join(' ') || 'จันทร์เจ้า';

      const pAny = newPerson as any;
      editForm.value = {
        titlePrefix: prefix,
        firstName: first,
        lastName: last,
        birthDate: pAny.birthDate || '12 ธันวาคม 2529',
        gender: pAny.gender === 'male' || pAny.gender === 'ชาย' ? 'ชาย' : 'หญิง',
        bloodGroup: pAny.bloodType || 'AB',
        religion: pAny.religion || 'อิสลาม',
        maritalStatus: pAny.maritalStatus || 'โสด',
        nationality: (pAny.nationality && pAny.ethnicity)
          ? `${pAny.nationality} / ${pAny.ethnicity}`
          : 'ไทย / ไทย',
        phone: newPerson.phone || '081–892–XXXX',
        email: newPerson.email || 'oraphin.c@bangkok.go.th',
      };
    }
  },
  { deep: true, immediate: true }
);

watch(activeMainSection, () => {
  if (currentSubTabs.value && currentSubTabs.value.length > 0) {
    activeSubTab.value = currentSubTabs.value[0].id;
  }
});

const actionMenuItems = [
  'ช่วยราชการ',
  'แต่งตั้ง-เลื่อน-ย้าย',
  'ถึงแก่กรรม',
  'ให้ออกจากราชการ',
  'ขอโอน',
  'ขอลาออก',
];

const handleSelectAction = (item: string) => {
  isActionMenuOpen.value = false;
  show(`เลือกทำรายการ: ${item}`);
};

const handlePrintKp7 = () => {
  isActionMenuOpen.value = false;
  window.print();
};

const handleExportPDF = () => {
  isActionMenuOpen.value = false;
  show('กำลังส่งออกเอกสารทะเบียนประวัติ (ก.พ. 7) รูปแบบ PDF...');
};

const handleDownloadFile = () => {
  show('กำลังดาวน์โหลดไฟล์สำเนาทะเบียนประวัติ...');
};

const handleSaveEdit = () => {
  const newName = `${editForm.value.titlePrefix}${editForm.value.firstName} ${editForm.value.lastName}`.trim();
  displayPerson.value.name = newName;
  const pAny = displayPerson.value as any;
  pAny.birthDate = editForm.value.birthDate;
  pAny.gender = editForm.value.gender;
  pAny.bloodType = editForm.value.bloodGroup;
  pAny.religion = editForm.value.religion;
  pAny.maritalStatus = editForm.value.maritalStatus;

  if (editForm.value.nationality.includes('/')) {
    const [nat, eth] = editForm.value.nationality.split('/').map((s: string) => s.trim());
    pAny.nationality = nat;
    pAny.ethnicity = eth;
  } else {
    pAny.nationality = editForm.value.nationality;
  }

  displayPerson.value.phone = editForm.value.phone;
  displayPerson.value.email = editForm.value.email;
  isEditModalOpen.value = false;

  historyLogs.value.unshift({
    id: historyLogs.value.length + 1,
    citizenId: displayPerson.value.citizenId || '6607205846599',
    name: newName,
    nameNote: 'แก้ไขข้อมูลประวัติส่วนตัว',
    birthDate: editForm.value.birthDate || '12 ธ.ค. 2529',
    gender: editForm.value.gender || 'หญิง',
    bloodGroup: editForm.value.bloodGroup || 'AB',
    maritalStatus: editForm.value.maritalStatus || 'โสด',
    nationality: editForm.value.nationality.includes('/') ? editForm.value.nationality.split('/')[0].trim() : 'ไทย',
    ethnicity: editForm.value.nationality.includes('/') ? editForm.value.nationality.split('/')[1].trim() : 'ไทย',
    operator: 'สมชาย ใจดี',
    operatorRole: 'จนท.บุคคลชำนาญการ',
  });

  show('บันทึกและส่งคำขอแก้ไขข้อมูลเรียบร้อยแล้ว');
};
</script>
