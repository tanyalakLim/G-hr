<template>
  <div class="flex flex-col min-h-full w-full">
    <!-- Top Action / Navigation Bar (component ui กลาง) -->
    <PageActionBar
      back-label="ทะเบียนประวัติ"
      back-title="กลับไปหน้าทะเบียนประวัติแบบย่อ"
      badge="การค้นหาขั้นสูง"
      subtitle="รายงานทะเบียนประวัติและสถิติกำลังพล กทม."
      @back="$emit('backToDossier')"
    >
      <template #actions>
        <div class="relative">
          <select
            id="top-position-category-select"
            v-model="topPositionClass"
            class="h-8 pl-3 pr-8 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs focus:border-blue-700 focus:ring-1 focus:ring-blue-700 appearance-none cursor-pointer"
          >
            <option value="civilian">ข้าราชการ กทม. สามัญ</option>
            <option value="regular_worker">ลูกจ้างประจำ กทม.</option>
            <option value="temp_worker">ลูกจ้างชั่วคราว</option>
          </select>
          <ChevronDown class="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>

        <UiButton
          id="btn-export-advanced-report"
          variant="outline"
          size="xs"
          class="font-semibold shadow-2xs"
          title="ส่งออกรายงาน (Export Excel / CSV)"
          @click="handleExport"
        >
          <template #icon>
            <Download class="w-3.5 h-3.5 text-slate-500" />
          </template>
          ส่งออกรายงาน
        </UiButton>
      </template>
    </PageActionBar>

    <!-- Main Content Container with Background -->
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-4 flex flex-col flex-1">
      <!-- Main Content Body: Unified Card (Advanced Filter + Data Table) -->
    <div
      class="flex-1 min-w-0 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col lg:flex-row items-stretch"
      data-purpose="advanced-search-unified-card"
    >
      <!-- BEGIN: AdvancedFilterPanel (Left Sidebar inside unified card) -->
      <div
        class="w-full lg:w-80 xl:w-88 flex-shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 bg-white"
        data-purpose="advanced-filter-sidebar"
      >
        <!-- Filter Header: Navy blue background #003380 -->
        <div class="h-12 bg-[#003380] text-white px-4 flex items-center justify-between flex-shrink-0">
          <div class="flex items-center gap-2 font-semibold text-sm">
            <Filter class="w-4 h-4 text-blue-200" />
            <span>ตัวกรองขั้นสูง</span>
          </div>
          <button
            type="button"
            class="text-xs text-blue-200 hover:text-white underline font-medium hover:opacity-90 transition-opacity cursor-pointer"
            @click="handleResetFilters"
          >
            ล้างทั้งหมด
          </button>
        </div>

        <!-- Filter Scrollable Form Container -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs max-h-[calc(100vh-280px)] lg:max-h-none">
          <!-- 1. สังกัด -->
          <div class="space-y-1">
            <label class="block font-medium text-slate-700">สังกัด</label>
            <div class="relative">
              <select
                v-model="filterDepartment"
                class="w-full text-xs h-9 bg-slate-50/50 border border-slate-200 rounded-md px-3 pr-8 focus:bg-white focus:border-blue-700 focus:ring-0 cursor-pointer text-slate-800"
              >
                <option value="all">ทั้งหมด</option>
                <option value="สำนักปลัดกรุงเทพมหานคร">สำนักปลัดกรุงเทพมหานคร</option>
                <option value="สำนักการแพทย์">สำนักการแพทย์</option>
                <option value="สำนักการคลัง">สำนักการคลัง</option>
                <option value="สำนักงานคณะกรรมการข้าราชการกรุงเทพมหานคร">สำนักงาน ก.ก.</option>
                <option value="สำนักงานเขตพระนคร">สำนักงานเขตพระนคร</option>
                <option value="สำนักการระบายน้ำ">สำนักการระบายน้ำ</option>
                <option value="สำนักการศึกษา">สำนักการศึกษา</option>
                <option value="สำนักยุทธศาสตร์และประเมินผล">สำนักยุทธศาสตร์และประเมินผล</option>
              </select>
            </div>
          </div>

          <!-- 2. ประเภทตำแหน่ง -->
          <div class="space-y-1">
            <label class="block font-medium text-slate-700">ประเภทตำแหน่ง</label>
            <div class="relative">
              <select
                v-model="filterPositionType"
                class="w-full text-xs h-9 bg-slate-50/50 border border-slate-200 rounded-md px-3 pr-8 focus:bg-white focus:border-blue-700 focus:ring-0 cursor-pointer text-slate-800"
              >
                <option value="all">ทั้งหมด</option>
                <option value="บริหาร">ตำแหน่งประเภทบริหาร</option>
                <option value="อำนวยการ">ตำแหน่งประเภทอำนวยการ</option>
                <option value="วิชาการ">ตำแหน่งประเภทวิชาการ</option>
                <option value="ทั่วไป">ตำแหน่งประเภททั่วไป</option>
              </select>
            </div>
          </div>

          <!-- 3. ระดับตำแหน่ง -->
          <div class="space-y-1">
            <label class="block font-medium text-slate-700">ระดับตำแหน่ง</label>
            <div class="relative">
              <select
                v-model="filterPositionLevel"
                class="w-full text-xs h-9 bg-slate-50/50 border border-slate-200 rounded-md px-3 pr-8 focus:bg-white focus:border-blue-700 focus:ring-0 cursor-pointer text-slate-800"
              >
                <option value="all">ทั้งหมด</option>
                <option value="ทรงคุณวุฒิ">ระดับทรงคุณวุฒิ</option>
                <option value="เชี่ยวชาญ">ระดับเชี่ยวชาญ</option>
                <option value="ชำนาญการพิเศษ">ระดับชำนาญการพิเศษ</option>
                <option value="ชำนาญการ">ระดับชำนาญการ</option>
                <option value="ปฏิบัติการ">ระดับปฏิบัติการ</option>
                <option value="สูง">ระดับสูง</option>
                <option value="ต้น">ระดับต้น</option>
              </select>
            </div>
          </div>

          <!-- 4. ตำแหน่งในสายงาน -->
          <div class="space-y-1">
            <label class="block font-medium text-slate-700">ตำแหน่งในสายงาน</label>
            <div class="relative">
              <select
                v-model="filterJobTitle"
                class="w-full text-xs h-9 bg-slate-50/50 border border-slate-200 rounded-md px-3 pr-8 focus:bg-white focus:border-blue-700 focus:ring-0 cursor-pointer text-slate-800"
              >
                <option value="all">ทั้งหมด</option>
                <option value="นักทรัพยากรบุคคล">นักทรัพยากรบุคคล</option>
                <option value="นักวิเคราะห์นโยบายและแผน">นักวิเคราะห์นโยบายและแผน</option>
                <option value="เจ้าพนักงานธุรการ">เจ้าพนักงานธุรการ</option>
                <option value="นิติกร">นิติกร</option>
                <option value="ผู้อำนวยการสำนัก">ผู้อำนวยการสำนัก</option>
                <option value="รองผู้อำนวยการสำนัก">รองผู้อำนวยการสำนัก</option>
                <option value="นักจัดการงานทั่วไป">นักจัดการงานทั่วไป</option>
              </select>
            </div>
          </div>

          <!-- 5. ตำแหน่งทางการบริหาร -->
          <div class="space-y-1">
            <label class="block font-medium text-slate-700">ตำแหน่งทางการบริหาร</label>
            <div class="relative">
              <select
                v-model="filterAdminPosition"
                class="w-full text-xs h-9 bg-slate-50/50 border border-slate-200 rounded-md px-3 pr-8 focus:bg-white focus:border-blue-700 focus:ring-0 cursor-pointer text-slate-800"
              >
                <option value="all">ทั้งหมด</option>
                <option value="ผู้อำนวยการสำนัก">ผู้อำนวยการสำนัก</option>
                <option value="รองผู้อำนวยการสำนัก">รองผู้อำนวยการสำนัก</option>
                <option value="ผู้อำนวยการกอง">ผู้อำนวยการกอง</option>
                <option value="หัวหน้าฝ่าย">หัวหน้าฝ่าย</option>
                <option value="หัวหน้ากลุ่มงาน">หัวหน้ากลุ่มงาน</option>
              </select>
            </div>
          </div>

          <!-- 6. การครองตำแหน่ง -->
          <div class="space-y-1">
            <label class="block font-medium text-slate-700">การครองตำแหน่ง</label>
            <div class="relative">
              <select
                v-model="filterTenureStatus"
                class="w-full text-xs h-9 bg-slate-50/50 border border-slate-200 rounded-md px-3 pr-8 focus:bg-white focus:border-blue-700 focus:ring-0 cursor-pointer text-slate-800"
              >
                <option value="all">ทั้งหมด</option>
                <option value="ตัวจริง (ครองตำแหน่ง)">ตัวจริง (ครองตำแหน่ง)</option>
                <option value="รักษาการแทน">รักษาการแทน</option>
                <option value="ว่าง">ว่าง</option>
              </select>
            </div>
          </div>

          <!-- 7. ด้าน/สาขา -->
          <div class="space-y-1">
            <label class="block font-medium text-slate-700">ด้าน/สาขา</label>
            <input
              v-model="filterBranch"
              type="text"
              class="w-full text-xs h-9 bg-slate-50/50 border border-slate-200 rounded-md px-3 placeholder-slate-400 focus:bg-white focus:border-blue-700 focus:ring-0 text-slate-800"
              placeholder="ระบุด้านหรือสาขาที่ต้องการ"
            />
          </div>

          <!-- 8. เพศ & สถานภาพ (Grid 2 Cols) -->
          <div class="grid grid-cols-2 gap-2">
            <div class="space-y-1">
              <label class="block font-medium text-slate-700">เพศ</label>
              <div class="relative">
                <select
                  v-model="filterGender"
                  class="w-full text-xs h-9 bg-slate-50/50 border border-slate-200 rounded-md px-2.5 pr-7 focus:bg-white focus:border-blue-700 focus:ring-0 cursor-pointer text-slate-800"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="male">ชาย</option>
                  <option value="female">หญิง</option>
                </select>
              </div>
            </div>
            <div class="space-y-1">
              <label class="block font-medium text-slate-700">สถานภาพ</label>
              <div class="relative">
                <select
                  v-model="filterMaritalStatus"
                  class="w-full text-xs h-9 bg-slate-50/50 border border-slate-200 rounded-md px-2.5 pr-7 focus:bg-white focus:border-blue-700 focus:ring-0 cursor-pointer text-slate-800"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="โสด">โสด</option>
                  <option value="สมรส">สมรส</option>
                  <option value="หย่า">หย่า</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 9. ระดับการศึกษา -->
          <div class="space-y-1">
            <label class="block font-medium text-slate-700">ระดับการศึกษา</label>
            <div class="relative">
              <select
                v-model="filterEducationLevel"
                class="w-full text-xs h-9 bg-slate-50/50 border border-slate-200 rounded-md px-3 pr-8 focus:bg-white focus:border-blue-700 focus:ring-0 cursor-pointer text-slate-800"
              >
                <option value="all">ทั้งหมด</option>
                <option value="ปริญญาเอก">ปริญญาเอก</option>
                <option value="ปริญญาโท">ปริญญาโท</option>
                <option value="ปริญญาตรี">ปริญญาตรี</option>
                <option value="ปวส. / อนุปริญญา">ปวส. / อนุปริญญา</option>
              </select>
            </div>
          </div>

          <!-- 10. วุฒิการศึกษา -->
          <div class="space-y-1">
            <label class="block font-medium text-slate-700">วุฒิการศึกษา</label>
            <input
              v-model="filterDegree"
              type="text"
              class="w-full text-xs h-9 bg-slate-50/50 border border-slate-200 rounded-md px-3 placeholder-slate-400 focus:bg-white focus:border-blue-700 focus:ring-0 text-slate-800"
              placeholder="ระบุวุฒิการศึกษา"
            />
          </div>

          <!-- 11. สาขาวิชา -->
          <div class="space-y-1">
            <label class="block font-medium text-slate-700">สาขา</label>
            <input
              v-model="filterMajor"
              type="text"
              class="w-full text-xs h-9 bg-slate-50/50 border border-slate-200 rounded-md px-3 placeholder-slate-400 focus:bg-white focus:border-blue-700 focus:ring-0 text-slate-800"
              placeholder="ระบุสาขาวิชา"
            />
          </div>

          <!-- 12. ช่วงเวลาบรรจุ -->
          <div class="pt-2 border-t border-slate-100 space-y-2">
            <label class="block font-semibold text-slate-800">ช่วงเวลาบรรจุ</label>
            <div class="grid grid-cols-1 gap-2">
              <div class="space-y-1">
                <span class="text-[11px] text-slate-500">ตั้งแต่วันที่</span>
                <div class="relative">
                  <input
                    v-model="startDate"
                    type="date"
                    class="w-full text-xs h-9 bg-slate-50/50 border border-slate-200 rounded-md pl-9 pr-3 focus:bg-white focus:border-blue-700 focus:ring-0 text-slate-800"
                  />
                  <Calendar class="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
              <div class="space-y-1">
                <span class="text-[11px] text-slate-500">ถึงวันที่</span>
                <div class="relative">
                  <input
                    v-model="endDate"
                    type="date"
                    class="w-full text-xs h-9 bg-slate-50/50 border border-slate-200 rounded-md pl-9 pr-3 focus:bg-white focus:border-blue-700 focus:ring-0 text-slate-800"
                  />
                  <Calendar class="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <!-- 13. ช่วงอายุ -->
          <div class="pt-2 border-t border-slate-100 space-y-1">
            <label class="block font-semibold text-slate-800">ช่วงอายุ (ปี)</label>
            <div class="flex items-center gap-2">
              <input
                v-model.number="minAge"
                type="number"
                placeholder="ต่ำสุด"
                class="w-1/2 text-xs h-9 bg-slate-50/50 border border-slate-200 rounded-md px-3 focus:bg-white focus:border-blue-700 focus:ring-0 text-slate-800"
              />
              <span class="text-slate-400">-</span>
              <input
                v-model.number="maxAge"
                type="number"
                placeholder="สูงสุด"
                class="w-1/2 text-xs h-9 bg-slate-50/50 border border-slate-200 rounded-md px-3 focus:bg-white focus:border-blue-700 focus:ring-0 text-slate-800"
              />
            </div>
          </div>
        </div>

        <!-- Filter Bottom Action Buttons -->
        <div class="p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-2 flex-shrink-0">
          <UiButton
            id="btn-execute-advanced-search"
            variant="accent"
            class="flex-1 h-9 font-semibold"
            @click="handleApplySearch"
          >
            <template #icon>
              <Search class="w-3.5 h-3.5" />
            </template>
            ค้นหาข้อมูล
          </UiButton>
          <UiButton
            id="btn-reset-advanced-filter"
            variant="outline"
            class="h-9"
            @click="handleResetFilters"
          >
            รีเซ็ต
          </UiButton>
        </div>
      </div>
      <!-- END: AdvancedFilterPanel -->

      <!-- BEGIN: ResultsArea (Right Table Section inside unified card) -->
      <div
        class="flex-1 min-w-0 flex flex-col bg-white overflow-hidden"
        data-purpose="search-results-container"
      >
        <!-- Results Summary & Sorter Bar -->
        <div
          class="min-h-12 border-b border-slate-200 px-4 sm:px-5 py-2.5 sm:py-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-white flex-shrink-0"
        >
          <!-- Found records count -->
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-slate-600">จำนวนที่พบทั้งหมด :</span>
            <UiBadge :tone="displayResults.length > 0 ? 'blue' : 'slate'" size="sm">
              {{ displayResults.length }} รายการ
            </UiBadge>
          </div>

          <!-- Sorting Controls & Customize Column Button -->
          <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div class="flex items-center gap-1.5 text-xs text-slate-600">
              <span class="font-medium text-slate-500">เรียงตามวันที่บรรจุแต่งตั้ง :</span>
              <button
                type="button"
                class="flex items-center gap-1.5 font-semibold text-blue-900 hover:text-blue-800 transition-colors cursor-pointer"
                @click="toggleSortOrder"
              >
                <span>{{ isSortAsc ? '(เก่าสุด - ล่าสุด)' : '(ล่าสุด - เก่าสุด)' }}</span>
                <ChevronsUpDown class="w-3.5 h-3.5 text-blue-900" />
              </button>
            </div>

            <div class="h-4 w-px bg-slate-200" />

            <button
              type="button"
              class="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 transition-colors cursor-pointer"
              title="ปรับแต่งคอลัมน์"
              @click="show('หน้าต่างปรับแต่งคอลัมน์การแสดงผล')"
            >
              <SlidersHorizontal class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Table View: Horizontal scrollable for all screen sizes -->
        <div class="flex-1 overflow-auto flex flex-col justify-between">
          <table class="w-full border-collapse text-left text-xs min-w-[900px]">
            <!-- Table Header -->
            <thead class="bg-slate-50/80 sticky top-0 z-10 border-b border-slate-200/90 text-[12px] font-semibold text-slate-600 tracking-tight select-none">
              <tr>
                <th class="py-3.5 px-4 w-14 text-center" scope="col">ลำดับ</th>
                <th class="py-3 px-4 min-w-[180px]" scope="col">ชื่อ-นามสกุล</th>
                <th class="py-3 px-4 min-w-[120px]" scope="col">ตำแหน่งเลขที่</th>
                <th class="py-3 px-4 min-w-[160px]" scope="col">ตำแหน่งในสายงาน</th>
                <th class="py-3 px-4 min-w-[130px]" scope="col">ตำแหน่งประเภท</th>
                <th class="py-3 px-4 min-w-[110px]" scope="col">ระดับ</th>
                <th class="py-3 px-4 min-w-[140px]" scope="col">ด้าน/สาขา</th>
                <th class="py-3 px-4 min-w-[170px]" scope="col">สังกัด</th>
                <th class="py-3.5 px-4 w-20 text-center" scope="col">จัดการ</th>
              </tr>
            </thead>

            <!-- Table Body -->
            <tbody class="divide-y divide-slate-100">
              <!-- When No Data Found (Matching Screenshot) -->
              <tr v-if="displayResults.length === 0">
                <td class="py-16 sm:py-20 text-center bg-white px-4" colspan="9">
                  <div class="max-w-sm mx-auto flex flex-col items-center justify-center text-center">
                    <!-- Modern Alert Icon -->
                    <div
                      class="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3 shadow-xs"
                    >
                      <AlertTriangle class="w-7 h-7" />
                    </div>
                    <h3 class="text-sm font-bold text-slate-800 mb-1">ไม่มีข้อมูล</h3>
                    <p class="text-xs text-slate-500 leading-relaxed max-w-xs mb-4">
                      ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหาขั้นสูง โปรดลองปรับเปลี่ยนตัวกรอง หรือกดปุ่มล้างตัวกรอง
                    </p>
                    <button
                      type="button"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors cursor-pointer"
                      @click="handleResetFilters"
                    >
                      <RotateCcw class="w-3.5 h-3.5" />
                      <span>ล้างเงื่อนไขทั้งหมด</span>
                    </button>
                  </div>
                </td>
              </tr>

              <!-- When Data Exists -->
              <tr
                v-for="person in paginatedResults"
                :key="person.id"
                class="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                @click="$emit('openDetail', person)"
              >
                <td class="py-3.5 px-4 text-center text-slate-400 font-mono text-[11px]">
                  {{ person.orderNumber }}
                </td>
                <td class="py-3 px-4">
                  <div class="font-semibold text-slate-900 group-hover:text-blue-900 transition-colors">
                    {{ person.name }}
                  </div>
                  <div class="text-[11px] text-slate-400 font-mono mt-0.5">
                    ID: {{ person.citizenId }}
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span class="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-mono inline-block">
                    {{ person.positionNumber }}
                  </span>
                </td>
                <td class="py-3 px-4 font-semibold text-blue-950">
                  {{ person.jobTitle }}
                </td>
                <td class="py-3 px-4 text-slate-700">
                  {{ person.positionType }}
                </td>
                <td class="py-3 px-4 text-slate-700">
                  {{ person.positionLevel }}
                </td>
                <td class="py-3 px-4 text-slate-600">
                  {{ person.fieldOrBranch || '-' }}
                </td>
                <td class="py-3 px-4 text-slate-600 leading-tight">
                  {{ person.department }}
                </td>
                <td class="py-3.5 px-4 text-center">
                  <button
                    type="button"
                    class="p-1.5 text-slate-400 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                    title="ดูรายละเอียดประวัติ ก.พ. 7"
                    @click.stop="$emit('openDetail', person)"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Table Footer / Pagination Placeholder (Matching Screenshot) -->
        <div
          class="h-auto sm:h-12 border-t border-slate-200 px-4 py-3 sm:py-0 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/60 text-xs text-slate-500 flex-shrink-0"
        >
          <!-- Rows per page selector -->
          <div class="flex items-center gap-2 order-2 sm:order-1">
            <span>แสดง</span>
            <select
              v-model.number="pageSize"
              class="text-xs bg-white border border-slate-300 rounded px-2 py-1 pr-6 focus:ring-0 cursor-pointer font-medium text-slate-700"
            >
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
            <span>รายการต่อหน้า</span>
          </div>

          <!-- Page Navigation -->
          <div class="flex items-center gap-1 order-1 sm:order-2">
            <button
              type="button"
              :disabled="currentPage <= 1 || totalPages === 0"
              class="p-1 rounded border border-slate-200 bg-white transition-colors"
              :class="
                currentPage <= 1 || totalPages === 0
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
              "
              @click="handlePrevPage"
            >
              <ChevronLeft class="w-4 h-4" />
            </button>
            <span class="px-2 font-medium text-slate-600">
              หน้า {{ totalPages === 0 ? 0 : currentPage }} จาก {{ totalPages }}
            </span>
            <button
              type="button"
              :disabled="currentPage >= totalPages || totalPages === 0"
              class="p-1 rounded border border-slate-200 bg-white transition-colors"
              :class="
                currentPage >= totalPages || totalPages === 0
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
              "
              @click="handleNextPage"
            >
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <!-- END: ResultsArea -->
    </div>
  </div>

    <!-- Personnel Detail Modal (Quick View) -->
    <div
      v-if="selectedPerson"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
    >
      <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div class="flex items-center gap-2.5">
            <UserCheck class="w-5 h-5 text-blue-900" />
            <h3 class="font-bold text-sm text-slate-900">
              รายละเอียดทะเบียนประวัติ (ก.พ. 7)
            </h3>
          </div>
          <button
            type="button"
            class="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
            @click="selectedPerson = null"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="p-5 space-y-4 text-xs">
          <div class="flex items-center gap-4">
            <img
              :src="selectedPerson.avatarUrl"
              :alt="selectedPerson.name"
              class="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs"
              referrerPolicy="no-referrer"
            />
            <div>
              <h4 class="font-bold text-base text-slate-900">
                {{ selectedPerson.name }}
              </h4>
              <p class="text-xs text-slate-500 font-mono mt-0.5">
                เลขประจำตัว: {{ selectedPerson.citizenId }}
              </p>
              <div class="flex items-center gap-2 mt-1.5">
                <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                  {{ selectedPerson.positionType }} / {{ selectedPerson.positionLevel }}
                </span>
                <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {{ selectedPerson.statusText }}
                </span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 pt-2">
            <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span class="text-slate-400 text-[11px] block">ตำแหน่งเลขที่</span>
              <span class="font-semibold text-slate-800 font-mono">
                {{ selectedPerson.positionNumber }}
              </span>
            </div>
            <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span class="text-slate-400 text-[11px] block">ตำแหน่งในสายงาน</span>
              <span class="font-semibold text-slate-800">
                {{ selectedPerson.jobTitle }}
              </span>
            </div>
            <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span class="text-slate-400 text-[11px] block">ด้าน/สาขา</span>
              <span class="font-semibold text-slate-800">
                {{ selectedPerson.fieldOrBranch || '-' }}
              </span>
            </div>
            <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span class="text-slate-400 text-[11px] block">การศึกษา</span>
              <span class="font-semibold text-slate-800">
                {{ selectedPerson.educationLevel || '-' }}
              </span>
            </div>
          </div>

          <div class="space-y-1.5 pt-2 border-t border-slate-100 text-slate-600">
            <p><strong>สังกัด:</strong> {{ selectedPerson.department }}</p>
            <p><strong>วันบรรจุแต่งตั้ง:</strong> {{ selectedPerson.appointedDate }} (อายุราชการ {{ selectedPerson.serviceYears }})</p>
            <p v-if="selectedPerson.degree"><strong>วุฒิการศึกษา:</strong> {{ selectedPerson.degree }} ({{ selectedPerson.major }})</p>
          </div>
        </div>

        <div class="p-3.5 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
          <button
            type="button"
            class="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer"
            @click="selectedPerson = null"
          >
            ปิด
          </button>
          <button
            type="button"
            class="px-4 py-1.5 text-xs font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-800 shadow-xs cursor-pointer"
            @click="handlePrint"
          >
            พิมพ์ ก.พ. 7
          </button>
          <button
            type="button"
            class="px-4 py-1.5 text-xs font-semibold text-white bg-[#002B7F] rounded-lg hover:bg-blue-900 shadow-xs cursor-pointer flex items-center gap-1.5"
            @click="$emit('openDetail', selectedPerson!); selectedPerson = null"
          >
            <UserCheck class="w-3.5 h-3.5" />
            <span>ดูรายละเอียดประวัติ</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { PageTitle } from '../common';
import { PageActionBar } from '../ui';
import { UiBadge, UiButton } from '../ui';
import { INITIAL_PERSONNEL } from '../../data/personnelData';
import type { PersonnelRecord } from '../../types';
import {
  Download,
  Filter,
  ChevronDown,
  Calendar,
  Search,
  ChevronsUpDown,
  SlidersHorizontal,
  AlertTriangle,
  RotateCcw,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  UserCheck,
  X,
} from 'lucide-vue-next';
import { useToast } from '../../composables/useToast';
const { show } = useToast();

const emit = defineEmits<{
  (e: 'backToDossier'): void;
  (e: 'openDetail', person: PersonnelRecord): void;
}>();

// Top controls
const topPositionClass = ref('civilian');

// Filters state
const filterDepartment = ref('all');
const filterPositionType = ref('all');
const filterPositionLevel = ref('all');
const filterJobTitle = ref('all');
const filterAdminPosition = ref('all');
const filterTenureStatus = ref('all');
const filterBranch = ref('');
const filterGender = ref('all');
const filterMaritalStatus = ref('all');
const filterEducationLevel = ref('all');
const filterDegree = ref('');
const filterMajor = ref('');
const startDate = ref('');
const endDate = ref('');
const minAge = ref<number | null>(null);
const maxAge = ref<number | null>(null);

// Active search trigger (defaults to false so initial state shows the empty state as in the screenshot, or true when searched)
const hasSearched = ref(false);
const isSortAsc = ref(false);
const pageSize = ref(20);
const currentPage = ref(1);
const selectedPerson = ref<PersonnelRecord | null>(null);

const handleApplySearch = () => {
  hasSearched.value = true;
  currentPage.value = 1;
  show('ดำเนินการค้นหาตามตัวกรองขั้นสูงแล้ว');
};

const handleResetFilters = () => {
  filterDepartment.value = 'all';
  filterPositionType.value = 'all';
  filterPositionLevel.value = 'all';
  filterJobTitle.value = 'all';
  filterAdminPosition.value = 'all';
  filterTenureStatus.value = 'all';
  filterBranch.value = '';
  filterGender.value = 'all';
  filterMaritalStatus.value = 'all';
  filterEducationLevel.value = 'all';
  filterDegree.value = '';
  filterMajor.value = '';
  startDate.value = '';
  endDate.value = '';
  minAge.value = null;
  maxAge.value = null;
  hasSearched.value = false;
  currentPage.value = 1;
  show('ล้างเงื่อนไขตัวกรองขั้นสูงทั้งหมดแล้ว');
};

const toggleSortOrder = () => {
  isSortAsc.value = !isSortAsc.value;
};

const handleExport = () => {
  show('กำลังส่งออกรายงานทะเบียนประวัติ (Excel / CSV)...');
};

const handlePrint = () => {
  window.print();
};

const handlePrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const handleNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// Filtered Results
const displayResults = computed(() => {
  // If user has not triggered search yet, or reset, show empty state matching the screenshot
  if (!hasSearched.value) {
    return [];
  }

  let list = [...INITIAL_PERSONNEL];

  if (filterDepartment.value !== 'all') {
    list = list.filter((p) => p.department.includes(filterDepartment.value));
  }

  if (filterPositionType.value !== 'all') {
    list = list.filter((p) => p.positionType === filterPositionType.value);
  }

  if (filterPositionLevel.value !== 'all') {
    list = list.filter((p) => p.positionLevel === filterPositionLevel.value);
  }

  if (filterJobTitle.value !== 'all') {
    list = list.filter((p) => p.jobTitle.includes(filterJobTitle.value));
  }

  if (filterAdminPosition.value !== 'all') {
    list = list.filter((p) => p.adminPosition?.includes(filterAdminPosition.value));
  }

  if (filterTenureStatus.value !== 'all') {
    list = list.filter((p) => p.tenureStatus === filterTenureStatus.value);
  }

  if (filterBranch.value.trim()) {
    const q = filterBranch.value.trim().toLowerCase();
    list = list.filter((p) => p.fieldOrBranch?.toLowerCase().includes(q));
  }

  if (filterGender.value !== 'all') {
    list = list.filter((p) => p.gender === filterGender.value);
  }

  if (filterMaritalStatus.value !== 'all') {
    list = list.filter((p) => p.maritalStatus === filterMaritalStatus.value);
  }

  if (filterEducationLevel.value !== 'all') {
    list = list.filter((p) => p.educationLevel === filterEducationLevel.value);
  }

  if (filterDegree.value.trim()) {
    const q = filterDegree.value.trim().toLowerCase();
    list = list.filter((p) => p.degree?.toLowerCase().includes(q));
  }

  if (filterMajor.value.trim()) {
    const q = filterMajor.value.trim().toLowerCase();
    list = list.filter((p) => p.major?.toLowerCase().includes(q));
  }

  if (minAge.value !== null && minAge.value > 0) {
    list = list.filter((p) => (p.age || 0) >= (minAge.value || 0));
  }

  if (maxAge.value !== null && maxAge.value > 0) {
    list = list.filter((p) => (p.age || 0) <= (maxAge.value || 0));
  }

  // Sort
  if (isSortAsc.value) {
    list.reverse();
  }

  return list;
});

const totalPages = computed(() => {
  if (displayResults.value.length === 0) return 0;
  return Math.ceil(displayResults.value.length / pageSize.value);
});

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return displayResults.value.slice(start, start + pageSize.value);
});
</script>
