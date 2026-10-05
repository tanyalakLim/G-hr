<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-3">
    <!-- Page Title -->
    <div class="pb-2">
      <PageTitle title="สมรรถนะ" subtitle="จัดการข้อมูลสมรรถนะสำหรับการประเมินบุคลากร" />
    </div>

    <!-- Main Card -->
    <div class="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      <!-- Tabs -->
      <div class="border-b border-slate-200/90 px-2 flex items-center gap-1 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="px-4 py-3.5 text-xs sm:text-sm whitespace-nowrap border-b-2 -mb-px transition-colors cursor-pointer"
          :class="activeTab === tab.key
            ? 'border-bma-700 text-bma-700 font-semibold'
            : 'border-transparent text-slate-400 hover:text-slate-600'"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="p-3 sm:p-4 space-y-4">
        <!-- ===== แท็บ: ระยะการลงมือปฏิบัติ ===== -->
        <template v-if="activeTab === 'list'">
        <!-- การ์ดสรุปจำนวนสมรรถนะแต่ละประเภท (คลิกเพื่อกรอง) — UiStatCard เดียวกับทั้งระบบ -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button
            v-for="card in categoryCards"
            :key="card.key"
            type="button"
            class="text-left rounded-xl transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-bma-300 [&>div]:h-full"
            :class="filterCategory === card.key
              ? 'ring-1 ring-bma-500 ring-offset-1'
              : 'hover:-translate-y-0.5 hover:shadow-sm'"
            @click="filterCategory = card.key"
          >
            <UiStatCard
              :title="card.label"
              :value="card.count"
              unit="รายการ"
              :tone="card.tone"
              :icon="card.icon"
              layout="horizontal"
              wrap-title
              :hint="filterCategory === card.key ? '● กำลังแสดงอยู่' : 'คลิกเพื่อกรอง'"
              :hint-accent="filterCategory === card.key"
            />
          </button>
        </div>

        <!-- Toolbar -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <UiSelect
              id="competency-type-select"
              v-model="filterCategory"
              :options="categoryOptions"
              size="sm"
              select-class="max-w-[280px]"
            />
            <UiButton
              id="btn-add-competency"
              size="sm"
              title="เพิ่มสมรรถนะ"
              @click="show('เพิ่มสมรรถนะ ยังไม่เปิดใช้งาน')"
            >
              <template #icon>
                <Plus class="w-4 h-4" />
              </template>
              เพิ่มข้อมูล
            </UiButton>
          </div>

          <div class="flex items-center gap-2">
            <div class="relative flex-1 lg:flex-none">
              <UiSearchInput
                id="competency-search-input"
                v-model="search"
                placeholder="ค้นหา"
                class="w-full lg:w-56"
              />
            </div>
            <UiSelect
              id="competency-page-size-select"
              v-model="pageSize"
              :options="pageSizeOptions"
              size="sm"
              select-class="max-w-[130px]"
            />
          </div>
        </div>

        <!-- Table -->
        <div class="rounded-xl border border-slate-200/90 overflow-hidden">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-100/80 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th class="py-3 px-4 w-[1%]"></th>
                <th class="py-3 px-4">ชื่อสมรรถนะ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
              <tr
                v-for="(item, i) in pagedItems"
                :key="item.id"
                class="transition-colors group"
                :class="i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'"
              >
                <td class="py-3 px-4">
                  <div class="flex items-center gap-1.5">
                    <button
                      type="button"
                      class="p-1.5 rounded-md text-sky-500 hover:text-sky-700 hover:bg-sky-50 transition-colors cursor-pointer"
                      title="ดูรายละเอียด"
                      @click="show(`ดูรายละเอียด: ${item.name}`)"
                    >
                      <Eye class="w-4.5 h-4.5" />
                    </button>
                    <button
                      type="button"
                      class="p-1.5 rounded-md text-sky-700 hover:text-sky-700 hover:bg-sky-50 transition-colors cursor-pointer"
                      title="แก้ไข"
                      @click="show(`แก้ไข: ${item.name}`)"
                    >
                      <Pencil class="w-4.5 h-4.5" />
                    </button>
                    <button
                      type="button"
                      class="p-1.5 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                      title="ลบ"
                      @click="show(`ลบ: ${item.name}`)"
                    >
                      <Trash2 class="w-4.5 h-4.5" />
                    </button>
                  </div>
                </td>
                <td class="py-3 px-4 font-medium text-slate-800">{{ item.name }}</td>
              </tr>
              <tr v-if="pagedItems.length === 0">
                <td colspan="2">
                  <UiEmptyState message="ไม่พบข้อมูลสมรรถนะตามเงื่อนไขที่ระบุ" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <UiPagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="filteredItems.length"
          :page-size-options="[10, 20, 50]"
        />
        </template>

        <!-- ===== แท็บ: กลุ่มงาน ===== -->
        <template v-else-if="activeTab === 'group'">
          <!-- Toolbar -->
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            
             <UiButton
              id="btn-add-competency"
              size="sm"
              title="เพิ่มสมรรถนะ"
             @click="show('เพิ่มกลุ่มงาน ยังไม่เปิดใช้งาน')"
            >
              <template #icon>
                <Plus class="w-4 h-4" />
              </template>
              เพิ่มข้อมูล
            </UiButton>

            <div class="flex items-center gap-2">
              <div class="relative flex-1 lg:flex-none">
                <UiSearchInput
                  id="workgroup-search-input"
                  v-model="groupSearch"
                  placeholder="ค้นหา"
                  class="w-full lg:w-56"
                />
              </div>
              <UiSelect
                id="workgroup-page-size-select"
                v-model="groupPageSize"
                :options="pageSizeOptions"
                size="sm"
                select-class="max-w-[130px]"
              />
            </div>
          </div>

          <!-- Table -->
          <div class="rounded-xl border border-slate-200/90 overflow-hidden">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-100/80 border-b border-slate-200 text-xs font-semibold text-slate-600">
                  <th class="py-3 px-4 w-[1%]"></th>
                  <th class="py-3 px-4">รายการกลุ่มงาน</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
                <tr
                  v-for="(item, i) in pagedWorkgroups"
                  :key="item.id"
                  class="transition-colors group"
                  :class="i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'"
                >
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-1.5">
                      <button
                        type="button"
                        class="p-1.5 rounded-md text-sky-700 hover:text-sky-700 hover:bg-sky-50 transition-colors cursor-pointer"
                        title="แก้ไข"
                        @click="show(`แก้ไขกลุ่มงาน: ${item.name}`)"
                      >
                        <Pencil class="w-4.5 h-4.5" />
                      </button>
                      <button
                        type="button"
                        class="p-1.5 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                        title="ลบ"
                        @click="show(`ลบกลุ่มงาน: ${item.name}`)"
                      >
                        <Trash2 class="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                  <td class="py-3 px-4 font-medium text-slate-800">{{ item.name }}</td>
                </tr>
                <tr v-if="pagedWorkgroups.length === 0">
                  <td colspan="2">
                    <UiEmptyState message="ไม่พบข้อมูลกลุ่มงานตามเงื่อนไขที่ระบุ" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <UiPagination
            v-model:current-page="groupPage"
            v-model:page-size="groupPageSize"
            :total="filteredWorkgroups.length"
            :page-size-options="[10, 20, 50]"
          />
        </template>

        <!-- ===== แท็บ: เชื่อมโยงกับคลังงานและตำแหน่ง ===== -->
        <template v-else-if="activeTab === 'link'">
          <!-- Toolbar -->
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <UiButton
              id="btn-add-competency"
              size="sm"
              title="เพิ่มการเชื่อมโยง"
            @click="show('เพิ่มการเชื่อมโยง ยังไม่เปิดใช้งาน')"
            >
              <template #icon>
                <Plus class="w-4 h-4" />
              </template>
              เพิ่มข้อมูล
            </UiButton>

            <div class="flex items-center gap-2">
              <div class="relative flex-1 lg:flex-none">
                <UiSearchInput
                  id="link-search-input"
                  v-model="linkSearch"
                  placeholder="ค้นหา"
                  class="w-full lg:w-56"
                />
              </div>
              <UiSelect
                id="link-page-size-select"
                v-model="linkPageSize"
                :options="pageSizeOptions"
                size="sm"
                select-class="max-w-[130px]"
              />
            </div>
          </div>

          <!-- Table -->
          <div class="rounded-xl border border-slate-200/90 overflow-hidden">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-100/80 border-b border-slate-200 text-xs font-semibold text-slate-600">
                  <th class="py-3 px-4 w-[1%]"></th>
                  <th class="py-3 px-4 min-w-[180px]">กลุ่มงาน</th>
                  <th class="py-3 px-4 min-w-[240px]">ตำแหน่ง</th>
                  <th class="py-3 px-4 min-w-[260px]">สมรรถนะประจำกลุ่มงาน</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
                <tr
                  v-for="(item, i) in pagedLinks"
                  :key="item.id"
                  class="transition-colors align-top"
                  :class="i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'"
                >
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-1.5">
                      <button
                        type="button"
                        class="p-1.5 rounded-md text-sky-700 hover:text-sky-700 hover:bg-sky-50 transition-colors cursor-pointer"
                        title="แก้ไข"
                        @click="show(`แก้ไขการเชื่อมโยง: ${item.group}`)"
                      >
                        <Pencil class="w-4.5 h-4.5" />
                      </button>
                      <button
                        type="button"
                        class="p-1.5 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                        title="ลบ"
                        @click="show(`ลบการเชื่อมโยง: ${item.group}`)"
                      >
                        <Trash2 class="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                  <td class="py-3 px-4 font-medium text-slate-800">{{ item.group }}</td>
                  <td class="py-3 px-4 leading-relaxed">
                    <template v-if="item.positions.length">
                      <span v-for="p in item.positions" :key="p" class="block">- {{ p }}</span>
                    </template>
                    <template v-else>-</template>
                  </td>
                  <td class="py-3 px-4 leading-relaxed">
                    <template v-if="item.competencies.length">
                      <span v-for="c in item.competencies" :key="c" class="block">- {{ c }}</span>
                    </template>
                    <template v-else>-</template>
                  </td>
                </tr>
                <tr v-if="pagedLinks.length === 0">
                  <td colspan="4">
                    <UiEmptyState message="ไม่พบข้อมูลการเชื่อมโยงตามเงื่อนไขที่ระบุ" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <UiPagination
            v-model:current-page="linkPage"
            v-model:page-size="linkPageSize"
            :total="filteredLinks.length"
            :page-size-options="[10, 20, 50]"
          />
        </template>

        <!-- ===== แท็บ: แผนการประเมิน (เกณฑ์การประเมิน) ===== -->
        <template v-else-if="activeTab === 'plan'">
          <!-- ส่วนหัวคำอธิบาย -->
          <div class="flex items-center justify-between gap-3 flex-wrap">
            <p class="text-xs text-slate-400">
              กำหนดเกณฑ์การประเมินสมรรถนะในแต่ละระดับคะแนน (5 = ดีเยี่ยม → 1 = ต่ำสุด)
            </p>
            <button
              type="button"
              class="text-[11px] font-semibold text-bma-700 hover:text-bma-900 transition-colors cursor-pointer inline-flex items-center gap-1"
              @click="show('บันทึกเกณฑ์การประเมินเรียบร้อยแล้ว')"
            >
              <Save class="w-3.5 h-3.5" />
              บันทึกทั้งหมด
            </button>
          </div>

          <!-- การ์ดเกณฑ์รายระดับ -->
          <div class="space-y-3.5">
            <div
              v-for="item in criteria"
              :key="item.level"
              class="flex items-center gap-3.5"
            >
              <!-- วงกลมระดับคะแนน (กว้างคงที่เพื่อให้กล่องเกณฑ์ทุกแถวเท่ากัน) -->
              <div class="w-18 flex flex-col items-center gap-1 shrink-0 pt-1">
                <span
                  class="w-11 h-11 rounded-full flex items-center justify-center text-lg font-black text-white tabular-nums shadow-sm ring-4"
                  :class="levelTones[item.level]"
                >
                  {{ item.level }}
                </span>
                <span class="text-[10px] font-semibold text-slate-400">{{ levelLabels[item.level] }}</span>
              </div>

              <!-- กล่องเกณฑ์ -->
              <div class="flex-1 min-w-0 rounded-xl border border-slate-200/90 bg-white overflow-hidden transition-colors focus-within:border-bma-400 focus-within:ring-2 focus-within:ring-bma-500/15">
                <!-- แถบเครื่องมือจัดรูปแบบข้อความ -->
                <div class="flex items-center gap-0.5 px-2 py-1.5 border-b border-slate-100 bg-slate-50/60">
                  <button
                    v-for="tool in formatTools"
                    :key="tool.label"
                    type="button"
                    class="p-1.5 rounded text-slate-500 hover:text-slate-800 hover:bg-white transition-colors cursor-pointer shadow-xs"
                    :title="tool.label"
                    @click="show(`เครื่องมือ ${tool.label} ใช้ได้เมื่อเปิดหน้าแก้ไข`)"
                  >
                    <component :is="tool.icon" class="w-3.5 h-3.5" />
                  </button>
                  <span class="w-px h-4 bg-slate-200 mx-1" />
                  <button
                    v-for="tool in listTools"
                    :key="tool.label"
                    type="button"
                    class="p-1.5 rounded text-slate-500 hover:text-slate-800 hover:bg-white transition-colors cursor-pointer shadow-xs"
                    :title="tool.label"
                    @click="show(`เครื่องมือ ${tool.label} ใช้ได้เมื่อเปิดหน้าแก้ไข`)"
                  >
                    <component :is="tool.icon" class="w-3.5 h-3.5" />
                  </button>

                  <span class="ml-auto text-[10px] font-semibold text-slate-300 tracking-wide uppercase">
                    ระดับคะแนน {{ item.level }}
                  </span>
                </div>
                <!-- เนื้อหาเกณฑ์ (แก้ไขได้) -->
                <textarea
                  v-model="item.text"
                  rows="3"
                  class="w-full block text-xs text-slate-700 leading-relaxed px-3.5 py-3 resize-y focus:outline-none"
                />
              </div>
            </div>
          </div>

          <!-- บันทึก -->
          <div class="flex justify-end">
            <UiButton size="sm" @click="show('บันทึกเกณฑ์การประเมินเรียบร้อยแล้ว')">
              บันทึก
            </UiButton>
          </div>
        </template>


        <!-- ===== แท็บ: การประเมินผลติดตามการปฏิบัติราชการ ===== -->
        <template v-else-if="activeTab === 'followup'">
          <!-- 1) ประเมินสมรรถนะ -->
          <section class="space-y-2.5">
            <h4 class="text-sm font-bold text-slate-900">ประเมินสมรรถนะ</h4>
            <p class="text-[11px] text-slate-400">
              ให้ประเมินจากสมรรถนะที่เกี่ยวข้องกับการปฏิบัติราชการตามที่ ก.ก. กำหนด บรรยายเฉพาะด้าน
            </p>

            <div class="rounded-xl border border-slate-200/90 overflow-x-auto">
              <table class="w-full border-collapse text-xs">
                <thead>
                  <tr>
                    <th rowspan="2" class="border border-slate-300 bg-indigo-50 py-3 px-4 text-center font-bold text-slate-700 w-[23%]">ประเภทสมรรถนะ</th>
                    <th :colspan="checkColumns[0].children.length" class="border border-slate-300 bg-indigo-50 py-2 px-4 text-center font-bold text-slate-700">ประเมินและระดับตำแหน่ง</th>
                    <th :colspan="checkColumns[1].children.length" class="border border-slate-300 bg-indigo-50 py-2 px-4 text-center font-bold text-slate-700">ผู้ตรวจราชการกำกับ</th>
                  </tr>
                  <tr>
                    <template v-for="col in checkColumns" :key="col.group">
                      <th
                        v-for="child in col.children"
                        :key="child"
                        class="border border-slate-300 bg-indigo-50/60 py-2 px-2 text-center font-medium text-slate-600 leading-snug whitespace-pre-line"
                      >{{ child }}</th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, i) in checkRows"
                    :key="row.label"
                    :class="i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'"
                  >
                    <td class="border border-slate-300 py-3 px-4">
                      <span class="block font-bold text-slate-800">{{ row.label }}</span>
                      <span class="block text-[11px] text-slate-400 mt-0.5">({{ row.sub }})</span>
                    </td>
                    <td
                      v-for="(checked, ci) in row.checks"
                      :key="ci"
                      class="border border-slate-300 py-3 text-center"
                    >
                      <Check
                        v-if="checked"
                        class="w-5 h-5 text-slate-700 mx-auto"
                        stroke-width="2.5"
                      />
                    </td>
                  </tr>
                  <tr class="bg-white">
                    <td class="border border-slate-300 py-3 px-4 text-right font-bold text-slate-800">รวมสมรรถนะ</td>
                    <td
                      v-for="(total, ti) in checkTotals"
                      :key="ti"
                      class="border border-slate-300 py-3 text-center font-bold text-slate-900 tabular-nums"
                    >
                      {{ total }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- 2) ระดับสมรรถนะ -->
          <section class="space-y-2.5">
            <h4 class="text-sm font-bold text-slate-900">ระดับสมรรถนะ</h4>
            <p class="text-[11px] text-slate-400">
              สมรรถนะหลักและสมรรถนะประจำกลุ่มงาน กำหนดระดับสมรรถนะที่กำหนดจึงแตกต่างประเภทและระดับตำแหน่งของนักราชการกรุงเทพมหานครสามัญ บริบทเฉพาะด้าน
            </p>

            <div class="rounded-xl border border-slate-200/90 overflow-x-auto">
              <table class="w-full border-collapse text-xs">
                <thead>
                  <tr>
                    <th class="border border-slate-300 bg-blue-100/70 py-2.5 px-4 text-center font-bold text-slate-700 w-[25%]">ประเภทตำแหน่ง</th>
                    <th class="border border-slate-300 bg-blue-100/70 py-2.5 px-4 text-center font-bold text-slate-700 w-[25%]">ระดับตำแหน่ง</th>
                    <th class="border border-slate-300 bg-blue-100/70 py-2.5 px-4 text-center font-bold text-slate-700">สมรรถนะหลัก</th>
                    <th class="border border-slate-300 bg-blue-100/70 py-2.5 px-4 text-center font-bold text-slate-700">สมรรถนะประจำกลุ่มงาน</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="pt in positionLevels" :key="pt.type">
                    <tr
                      v-for="(lv, li) in pt.levels"
                      :key="`${pt.type}-${lv.level}`"
                      :class="li % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'"
                    >
                      <td v-if="li === 0" :rowspan="pt.levels.length" class="border border-slate-300 py-2.5 px-4 text-center font-bold text-slate-800">{{ pt.type }}</td>
                      <td class="border border-slate-300 py-2 px-4 text-center">{{ lv.level }}</td>
                      <td class="border border-slate-300 py-2 px-4 text-center tabular-nums">{{ lv.core }}</td>
                      <td class="border border-slate-300 py-2 px-4 text-center tabular-nums" :class="lv.group == null ? 'bg-slate-200/70' : ''">
                        {{ lv.group ?? '' }}
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </section>

          <!-- 3) องค์ประกอบการประเมิน -->
          <section class="space-y-2.5">
            <h4 class="text-sm font-bold text-slate-900">
              องค์ประกอบการประเมิน และแนวทางการประเมินของผู้รับการประเมินแต่ละกลุ่ม
            </h4>

            <div class="rounded-xl border border-slate-200/90 overflow-x-auto">
              <table class="w-full border-collapse text-xs">
                <thead>
                  <tr>
                    <th rowspan="3" class="border border-slate-300 bg-indigo-50 py-2.5 px-4 text-center font-bold text-slate-700 w-[26%]">ผู้รับการประเมิน</th>
                    <th colspan="3" class="border border-slate-300 bg-indigo-50 py-2 px-4 text-center font-bold text-slate-700">องค์ประกอบการประเมิน</th>
                  </tr>
                  <tr>
                    <th rowspan="2" class="border border-slate-300 bg-indigo-50/60 py-2 px-4 text-center font-bold text-slate-700 w-[30%]">ผลสัมฤทธิ์ของงาน</th>
                    <th colspan="2" class="border border-slate-300 bg-indigo-50/60 py-2 px-4 text-center font-bold text-slate-700">พฤติกรรมการปฏิบัติราชการ</th>
                  </tr>
                  <tr>
                    <th class="border border-slate-300 bg-indigo-50/60 py-2 px-4 text-center font-bold text-slate-700">สมรรถนะ</th>
                    <th class="border border-slate-300 bg-indigo-50/60 py-2 px-4 text-center font-bold text-slate-700 w-[14%]">การพัฒนา</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(g, i) in evaluationGroups"
                    :key="g.name"
                    class="align-top"
                    :class="i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'"
                  >
                    <td class="border border-slate-300 py-3 px-4">
                      <span class="block font-bold text-slate-900">{{ g.name }}</span>
                      <span class="block text-slate-600 mt-0.5">{{ g.detail }}</span>
                    </td>
                    <td class="border border-slate-300 py-3 px-4 leading-relaxed">
                      <span class="block">น้ำหนักคะแนน</span>
                      <span class="block font-bold text-slate-900">ร้อยละ: {{ g.achievement.weight }}</span>
                      <span v-for="it in g.achievement.items" :key="it" class="block">- {{ it }}</span>
                    </td>
                    <td class="border border-slate-300 py-3 px-4 leading-relaxed">
                      <span class="block">น้ำหนักคะแนน</span>
                      <span class="block font-bold text-slate-900">ร้อยละ: {{ g.competency.weight }}</span>
                      <span v-for="it in g.competency.items" :key="it" class="block">- {{ it }}</span>
                    </td>
                    <td class="border border-slate-300 py-3 px-4 leading-relaxed">
                      <template v-if="g.development">
                        <span class="block">น้ำหนักคะแนน</span>
                        <span class="block font-bold text-slate-900">ร้อยละ: {{ g.development.weight }}</span>
                        <span v-for="it in g.development.items" :key="it" class="block">- {{ it }}</span>
                      </template>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </template>

        <!-- ===== แท็บอื่น ๆ: ยังไม่เปิดใช้งาน ===== -->
        <UiEmptyState v-else message="เนื้อหาส่วนนี้ยังไม่เปิดใช้งาน" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { PageTitle } from '../common';
import {
  UiButton,
  UiEmptyState,
  UiPagination,
  UiSearchInput,
  UiSelect,
  UiStatCard,
  UiBadge,
} from '../ui';
import {
  ArrowDownToLine,
  Bold,
  Check,
  Eye,
  FolderOpen,
  IdCard,
  Italic,
  Layers,
  List,
  ListOrdered,
  Pencil,
  Plus,
  Scale,
  Save,
  Star,
  Strikethrough,
  Trash2,
  Type,
  Underline,
  UserCheck,
} from 'lucide-vue-next';
import { useToast } from '../../composables/useToast';

const { show } = useToast();

// --- Tabs
const activeTab = ref('list');
const tabs = [
  { key: 'list', label: 'ระยะการลงมือปฏิบัติ' },
  { key: 'group', label: 'กลุ่มงาน' },
  { key: 'link', label: 'เชื่อมโยงกับคลังงานและตำแหน่ง' },
  { key: 'plan', label: 'แผนการประเมิน' },
  { key: 'followup', label: 'การประเมินผลติดตามการปฏิบัติราชการ' },
];

// --- ประเภทสมรรถนะ (tone ตาม UiStatCard: blue | emerald | teal | amber)
type CategoryKey = 'all' | 'core' | 'group' | 'exec' | 'director' | 'gov';
const categoryCards: {
  key: CategoryKey;
  label: string;
  count: number;
  tone: 'blue' | 'emerald' | 'teal' | 'amber';
  icon: typeof Layers;
}[] = [
  { key: 'all', label: 'ทั้งหมด', count: 37, tone: 'blue', icon: Layers },
  { key: 'core', label: 'สมรรถนะหลัก', count: 5, tone: 'emerald', icon: Star },
  { key: 'group', label: 'สมรรถนะประจำกลุ่มงาน', count: 20, tone: 'teal', icon: FolderOpen },
  { key: 'exec', label: 'สมรรถนะประจำผู้บริหารระดับพื้นฐาน', count: 6, tone: 'blue', icon: UserCheck },
  {
    key: 'director',
    label: 'สมรรถนะเฉพาะสำหรับตำแหน่ง ผอ.ศธ ผอ.ทอ.ศธ และหัวหน้าฝ่ายในสังกัด สบ.ศธ',
    count: 4, tone: 'amber', icon: IdCard,
  },
  {
    key: 'gov',
    label: 'สมรรถนะเฉพาะสำหรับตำแหน่งชั้นธรรมาภิบาล ศก.น. และชั้นธรรมาภิบาล',
    count: 2, tone: 'amber', icon: Scale,
  },
];

const filterCategory = ref<CategoryKey>('core');

const categoryOptions = categoryCards.map((c) => ({ value: c.key, label: c.label }));

// --- ข้อมูลสมรรถนะจำลอง (ฝั่งตัวอย่าง: สมรรถนะหลัก)
interface Competency {
  id: string;
  name: string;
  category: Exclude<CategoryKey, 'all'>;
}

const competencies: Competency[] = [
  { id: '1', name: 'การบริการที่ดี', category: 'core' },
  { id: '2', name: 'การเป็นพลเมืองดี', category: 'core' },
  { id: '3', name: 'การทำงานเป็นทีม', category: 'core' },
  { id: '4', name: 'การสร้างความเชื่อมั่นในงานวิชาชีพ', category: 'core' },
  { id: '5', name: 'สมรรถนะด้านการสร้างความเป็นธรรมและระเบียบธรรม', category: 'core' },
  { id: '6', name: 'การวิเคราะห์เชิงระบบ', category: 'group' },
  { id: '7', name: 'การวางแผนกลยุทธ์', category: 'group' },
  { id: '8', name: 'การบริหารความเสี่ยง', category: 'group' },
  { id: '9', name: 'ภาวะผู้นำพื้นฐาน', category: 'exec' },
  { id: '10', name: 'การบริหารทรัพยากรบุคคล', category: 'exec' },
];

// --- ค้นหา + แบ่งหน้า
const search = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const pageSizeOptions = [
  { value: '10', label: '10 รายการ' },
  { value: '20', label: '20 รายการ' },
  { value: '50', label: '50 รายการ' },
];

const filteredItems = computed(() => {
  const q = search.value.trim().toLowerCase();
  return competencies.filter((item) => {
    if (filterCategory.value !== 'all' && item.category !== filterCategory.value) return false;
    if (!q) return true;
    return item.name.toLowerCase().includes(q);
  });
});

const pagedItems = computed(() => {
  const size = Number(pageSize.value);
  const start = (currentPage.value - 1) * size;
  return filteredItems.value.slice(start, start + size);
});

// --- แท็บกลุ่มงาน
const groupSearch = ref('');
const groupPage = ref(1);
const groupPageSize = ref(10);

const workgroups: { id: string; name: string }[] = [
  'กล่องงานสนับสนุนทั่วไป',
  'กล่องงานคอมพิวเตอร์',
  'กล่องงานบริการ',
  'กล่องงานบริหารทั่วไป',
  'กล่องงานปกครองและทะเบียน',
  'กล่องงานเศรษฐกิจ',
  'กล่องงานวิเทศสัมพันธ์และแผน',
  'กล่องงานวิทยาศาสตร์',
  'กล่องงานส่งเสริมสวัสดิการ',
  'กล่องงานการท้องถิ่น',
  'กล่องงานการเงินและบัญชี',
  'กล่องงานพัสดุ',
  'กล่องงานอาคารสถานที่',
  'กล่องงานยานพาหนะและขนส่ง',
  'กล่องงานสาธารณสุข',
  'กล่องงานการศึกษา',
  'กล่องงานระบายน้ำ',
  'กล่องงานวิศวกรรม',
  'กล่องงานโยธา',
  'กล่องงานสิ่งแวดล้อม',
  'กล่องงานสังคมพัฒนา',
  'กล่องงานการจัดงานประเพณี',
  'กล่องงานตลาดและการพาณิชย์',
  'กล่องงานปศุสัตว์',
  'กล่องงานทะเบียนพาณิชย์',
  'กล่องงานประชาสัมพันธ์',
  'กล่องงานยุติธรรม',
  'กล่องงานป้องกันภัย',
  'กล่องงานการเจ้าหน้าที่',
  'กล่องงานแผนงานและงบประมาณ',
  'กล่องงานตรวจสอบภายใน',
  'กล่องงานเทคโนโลยีสารสนเทศ',
  'กล่องงานการท่องเที่ยว',
  'กล่องงานก่อสร้างและซ่อมบำรุง',
  'กล่องงานขนส่งและโลจิสติกส์',
].map((name, i) => ({ id: String(i + 1), name }));

const filteredWorkgroups = computed(() => {
  const q = groupSearch.value.trim().toLowerCase();
  if (!q) return workgroups;
  return workgroups.filter((w) => w.name.toLowerCase().includes(q));
});

const pagedWorkgroups = computed(() => {
  const size = Number(groupPageSize.value);
  const start = (groupPage.value - 1) * size;
  return filteredWorkgroups.value.slice(start, start + size);
});

// --- แท็บเชื่อมโยงกับคลังงานและตำแหน่ง
const linkSearch = ref('');
const linkPage = ref(1);
const linkPageSize = ref(10);

interface WorkgroupLink {
  id: string;
  group: string;
  positions: string[];
  competencies: string[];
}

const links: WorkgroupLink[] = [
  {
    id: '1', group: 'กล่องงานสนับสนุนทั่วไป',
    positions: ['ช่างไฟฟ้า', 'ทันตแพทย์', 'นักจัดการงานโยธา', 'นักวิชาการศึกษา', 'นักทรัพยากรบุคคล', 'นักจัดการงานเคลื่อนที่และโลจิสติกส์'],
    competencies: ['ความซื่อสัตย์สุจริต', 'การดำเนินการเชิงรุก', 'การบริหารความเสี่ยงด้านการใช้ทรัพยากรสาธารณะ'],
  },
  {
    id: '2', group: 'กล่องงานสาธารณสุข',
    positions: ['นักประเมินราคา'],
    competencies: ['การคิดวิเคราะห์', 'การดำเนินการเชิงรุก', 'การบริการที่ดี'],
  },
  {
    id: '3', group: 'กล่องงานคอมพิวเตอร์',
    positions: ['นักประเมินราคา', 'นักวิชาการคอมพิวเตอร์'],
    competencies: ['การดำเนินการเชิงรุก', 'การบริการที่ดี', 'ความคิดสร้างสรรค์', 'ความเข้าใจเทคโนโลยีสารสนเทศ'],
  },
  {
    id: '4', group: 'กล่องงานบริการ',
    positions: [],
    competencies: [],
  },
  {
    id: '5', group: 'กล่องงานบริหารทั่วไป',
    positions: ['นักจัดการงานบริหารทั่วไป'],
    competencies: ['การเรียนรู้และพัฒนาตนเอง', 'ความซื่อสัตย์สุจริต'],
  },
  {
    id: '6', group: 'กล่องงานปกครองและทะเบียน',
    positions: ['นักวิเคราะห์นโยบายและแผน'],
    competencies: ['การคิดวิเคราะห์', 'การบริการที่ดี'],
  },
  {
    id: '7', group: 'กล่องงานการเงินและบัญชี',
    positions: ['นักวิชาการการคลัง', 'นักบัญชี'],
    competencies: ['ความซื่อสัตย์สุจริต', 'การบริหารความเสี่ยงด้านการใช้ทรัพยากรสาธารณะ'],
  },
  {
    id: '8', group: 'กล่องงานพัสดุ',
    positions: ['นักวิชาการพัสดุ'],
    competencies: ['การบริการที่ดี', 'การบริหารความเสี่ยงด้านการใช้ทรัพยากรสาธารณะ'],
  },
];

const filteredLinks = computed(() => {
  const q = linkSearch.value.trim().toLowerCase();
  if (!q) return links;
  return links.filter(
    (l) =>
      l.group.toLowerCase().includes(q) ||
      l.positions.some((p) => p.toLowerCase().includes(q)) ||
      l.competencies.some((c) => c.toLowerCase().includes(q))
  );
});

const pagedLinks = computed(() => {
  const size = Number(linkPageSize.value);
  const start = (linkPage.value - 1) * size;
  return filteredLinks.value.slice(start, start + size);
});

// --- แท็บแผนการประเมิน: เกณฑ์การประเมินและระดับคะแนน
import type { Component } from 'vue';
const formatTools: { label: string; icon: Component }[] = [
  { label: 'ตัวหนา', icon: Bold },
  { label: 'ตัวเอียง', icon: Italic },
  { label: 'ขีดฆ่า', icon: Strikethrough },
  { label: 'ขีดเส้นใต้', icon: Underline },
  { label: 'ขึ้นบรรทัดใหม่', icon: ArrowDownToLine },
  { label: 'ตัวอักษร', icon: Type },
];
const listTools: { label: string; icon: Component }[] = [
  { label: 'รายการแบบหัวข้อ', icon: List },
  { label: 'รายการแบบลำดับ', icon: ListOrdered },
];

// สี/ชื่อของแต่ละระดับคะแนน
const levelTones: Record<number, string> = {
  5: 'bg-emerald-500 ring-emerald-100',
  4: 'bg-teal-500 ring-teal-100',
  3: 'bg-blue-500 ring-blue-100',
  2: 'bg-amber-500 ring-amber-100',
  1: 'bg-red-500 ring-red-100',
};
const levelLabels: Record<number, string> = {
  5: 'ดีเยี่ยม',
  4: 'ดีมาก',
  3: 'ดี',
  2: 'พอใช้',
  1: 'ต้องปรับปรุง',
};

const criteria = ref([
  {
    level: 5,
    text: 'เป็นแบบอย่างที่ดีให้กับผู้อื่น ชั้นการประเมินสามารถแสดงออกให้เห็นจิตพฤติกรรมของการปฏิบัติงานอย่างที่ดีให้กับผู้อื่น รายละเอียดสมรรถนะที่ใช้ประเมินตามที่มากำหนดของเป็นแบบอย่างที่ดีให้กับผู้อื่น',
  },
  {
    level: 4,
    text: 'อยู่ในระดับสูงกว่าที่กำหนด ชั้นการประเมินสามารถแสดงออกให้เห็นจิตพฤติกรรมมากกว่าที่กำหนด ตามที่ประใช้ในคำอธิบายรายละเอียดสมรรถนะได้',
  },
  {
    level: 3,
    text: 'อยู่ในระดับที่กำหนด ชั้นการประเมินสามารถแสดงออกให้เห็นจิตพฤติกรรมที่กำหนด ตามที่ประใช้ในคำอธิบายรายละเอียดสมรรถนะได้',
  },
  {
    level: 2,
    text: 'ต่ำกว่าระดับที่กำหนด ชั้นการประเมินแสดงออกให้เห็นจิตพฤติกรรมน้อยกว่าระดับที่กำหนด ตามที่ประใช้ในคำอธิบายรายละเอียดสมรรถนะ',
  },
  {
    level: 1,
    text: 'ต่ำกว่าระดับที่กำหนดมาก ชั้นการประเมินไม่แสดงออกให้เห็นจิตพฤติกรรมใด ๆ ตามที่ประใช้ในคำอธิบายรายละเอียดสมรรถนะ',
  },
]);

// --- แท็บการประเมินผลติดตามการปฏิบัติราชการ

// 1) ตารางประเมินสมรรถนะ: คอลัมน์ผู้ประเมิน
const checkColumns: { group: string; children: string[] }[] = [
  {
    group: 'ประเมินและระดับตำแหน่ง',
    children: [
      'ที่เป็น\nปฏิบัติงาน\nชำนาญการ\nอวิชา',
      'ที่เป็น\n(ที่กำลังดำรงตำแหน่ง\nการบริหาร)',
      'วิชาการ\nปฏิบัติงาน\nชำนาญการพิเศษ\nเชี่ยวชาญ\nกรณีคุณวุฒิ',
      'ปฏิบัติการ -\nกรณีคุณวุฒิ\n(ที่กำลังดำรงตำแหน่ง\nการบริหาร)',
      'อำนวยการ\nดน สญ',
      'บริหาร\nดน สญ',
    ],
  },
  {
    group: 'ผู้ตรวจราชการกำกับ',
    children: [
      'ผู้ตรวจราชการ\nระดับพื้นฐานและ\nผู้ตรวจราชการ',
      'ผู้อำนวยการ\nเทศกิจ',
    ],
  },
];

// แถวประเภทสมรรถนะ (checks ตามลำดับคอลัมน์ 8 ช่อง)
const checkRows: { label: string; sub: string; checks: boolean[] }[] = [
  { label: 'สมรรถนะหลัก', sub: '5 สมรรถนะ', checks: [true, true, true, true, true, true, true, true] },
  { label: 'สมรรถนะประจำกลุ่มงาน', sub: '3 สมรรถนะ ตามกลุ่มงาน', checks: [true, false, true, false, false, false, false, false] },
  { label: 'สมรรถนะประจำผู้บริหารระดับพื้นฐาน', sub: '7 สมรรถนะ', checks: [false, true, false, true, true, true, false, false] },
  { label: 'สมรรถนะเฉพาะสำหรับตำแหน่งชั้นธรรมาภิบาล', sub: '2 สมรรถนะ', checks: [false, false, false, false, false, false, false, true] },
  { label: 'สมรรถนะเฉพาะสำหรับตำแหน่งผู้ตรวจราชการระดับพื้นฐานและผู้ตรวจราชการ', sub: '2 สมรรถนะ', checks: [false, false, false, false, false, false, true, false] },
];

const checkTotals: number[] = [8, 12, 8, 12, 12, 12, 7, 9];

// 2) ระดับสมรรถนะตามประเภท/ระดับตำแหน่ง (group: null = ไม่ใช้)
const positionLevels: { type: string; levels: { level: string; core: number; group: number | null }[] }[] = [
  {
    type: 'บริหาร',
    levels: [
      { level: 'สูง', core: 5, group: null },
      { level: 'ดน', core: 4, group: null },
    ],
  },
  {
    type: 'อำนวยการ',
    levels: [
      { level: 'สูง', core: 4, group: null },
      { level: 'ดน', core: 3, group: null },
    ],
  },
  {
    type: 'วิชาการ',
    levels: [
      { level: 'กรณีคุณวุฒิ', core: 5, group: 5 },
      { level: 'เชี่ยวชาญ', core: 4, group: 4 },
      { level: 'ชำนาญการพิเศษ', core: 3, group: 4 },
      { level: 'ชำนาญการ', core: 2, group: 3 },
      { level: 'ปฏิบัติการ', core: 1, group: 2 },
    ],
  },
  {
    type: 'ทั่วไป',
    levels: [
      { level: 'ทักษะพิเศษ', core: 4, group: 4 },
      { level: 'อวิชา', core: 3, group: 3 },
      { level: 'ชำนาญงาน', core: 2, group: 2 },
      { level: 'ปฏิบัติงาน', core: 1, group: 1 },
    ],
  },
];

// 3) องค์ประกอบการประเมินของแต่ละกลุ่มผู้รับการประเมิน
const evaluationGroups = [
  {
    name: 'กลุ่มที่ 1',
    detail: 'ผู้ตรวจราชการเมือง ชื่อ',
    achievement: {
      weight: 80,
      items: ['ข้อที่ 1 การคัดสรรบุคลากรให้เหมาะสมกับ กทม.', 'ข้อที่ 2 การเร่งรัดอำนวยความเป็นธรรมแก่ประชาชน (ถ้ามี)'],
    },
    competency: {
      weight: 20,
      items: ['สมรรถนะหลัก', 'สมรรถนะประจำผู้บริหารระดับพื้นฐาน'],
    },
    development: null,
  },
  {
    name: 'กลุ่มที่ 2',
    detail: 'ผู้ตรวจราชการเมือง ชื่อ — ประเภทบริหาร อำนวยการ วิชาการ',
    achievement: {
      weight: 80,
      items: ['งานตามแผนปฏิบัติราชการประจำปี', 'งานตามที่ได้รับมอบหมายจากหัวหน้า', 'งานอื่นๆ ที่ได้รับมอบหมาย'],
    },
    competency: {
      weight: 20,
      items: ['สมรรถนะหลัก', 'สมรรถนะประจำผู้บริหารระดับพื้นฐาน'],
    },
    development: null,
  },
  {
    name: 'กลุ่มที่ 3',
    detail: 'ผู้ตรวจราชการเมือง ชื่อ — ประเภทวิชาการ ทั่วไป',
    achievement: {
      weight: 70,
      items: ['งานตามแผนปฏิบัติราชการประจำปี', 'งานตามที่ได้รับมอบหมายจากหัวหน้า', 'งานอื่นๆ ที่ได้รับมอบหมาย'],
    },
    competency: {
      weight: 20,
      items: ['สมรรถนะหลัก', 'สมรรถนะประจำกลุ่มงาน'],
    },
    development: { weight: 10, items: [] },
  },
  {
    name: 'กลุ่มอื่นของงานการประเมิน',
    detail: 'ทุกตำแหน่ง',
    achievement: {
      weight: 50,
      items: ['งานตามแผนปฏิบัติราชการประจำปี', 'งานตามที่ได้รับมอบหมายจากหัวหน้า', 'งานอื่นๆ ที่ได้รับมอบหมาย'],
    },
    competency: {
      weight: 40,
      items: ['สมรรถนะหลัก', 'สมรรถนะประจำกลุ่มงาน'],
    },
    development: { weight: 10, items: [] },
  },
];

</script>
