<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-3">
    <!-- Page Title & Header Actions -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
      <PageTitle
        :title="categoryLabels[category].title"
        :subtitle="categoryLabels[category].subtitle"
      />

      <div class="flex flex-wrap items-center gap-2 self-start md:self-auto flex-shrink-0">
        <UiButton
          id="btn-refresh-personnel"
          variant="outline"
          @click="show('รีเฟรชข้อมูลทะเบียนประวัติผู้พ้นจากราชการล่าสุดแล้ว')"
        >
          <template #icon>
            <RotateCw class="w-4 h-4 text-slate-500" />
          </template>
          รีเฟรชข้อมูล
        </UiButton>

        <UiButton
          id="btn-advanced-search"
          title="เข้าสู่หน้าการค้นหาขั้นสูงและรายงานทะเบียนประวัติผู้พ้นจากราชการ"
          @click="$emit('openAdvancedSearch')"
        >
          <template #icon>
            <SlidersHorizontal class="w-4 h-4" />
          </template>
          การค้นหาขั้นสูง
        </UiButton>
      </div>
    </div>

    <!-- Search & Filter Card -->
    <div class="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
      <!-- Search Input Form -->
      <form class="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-3 items-end" @submit.prevent="handleSearchSubmit">
        <div class="md:col-span-4 lg:col-span-3">
          <UiSelect
            id="search-condition-select"
            v-model="searchCondition"
            label="ค้นหาตามเงื่อนไข"
            :options="searchConditionOptions"
            size="lg"
          />
        </div>

        <div class="md:col-span-5 lg:col-span-7">
          <label class="block text-[11px] font-medium text-slate-500 mb-1">
            คำค้นหา
          </label>
          <UiSearchInput
            id="personnel-search-query-input"
            v-model="searchQuery"
            placeholder="ระบุคำค้น เช่น สัจจวัตร, อรพินท์, สนบ..."
            size="lg"
          />
        </div>

        <div class="md:col-span-3 lg:col-span-2">
          <UiButton
            id="btn-execute-personnel-search"
            type="submit"
            variant="accent"
            class="w-full h-10"
          >
            <template #icon>
              <Search class="w-4 h-4" />
            </template>
            ค้นหาข้อมูล
          </UiButton>
        </div>
      </form>

      <!-- Filter Controls Row -->
      <div class="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:flex lg:flex-wrap items-center gap-2.5 sm:gap-3">
        <!-- เหตุผลการพ้นจากราชการ (เพิ่มใหม่) -->
        <div class="w-full lg:flex-1 min-w-[160px]">
          <UiSelect
            v-model="selectedReason"
            :options="reasonOptions"
            select-class="bg-slate-50 border-slate-200 focus:ring-0 focus:border-blue-500 font-medium text-slate-700"
          />
        </div>

        <!-- สังกัด -->
        <div class="w-full lg:flex-1 min-w-[160px]">
          <UiSelect
            v-model="selectedDepartment"
            :options="departmentOptions"
            select-class="bg-slate-50 border-slate-200 focus:ring-0 focus:border-blue-500"
          />
        </div>

        <!-- ประเภทตำแหน่ง -->
        <div class="w-full lg:flex-1 min-w-[140px]">
          <UiSelect
            v-model="selectedPositionType"
            :options="positionTypeOptions"
            select-class="bg-slate-50 border-slate-200 focus:ring-0 focus:border-blue-500"
          />
        </div>

        <!-- ระดับตำแหน่ง -->
        <div class="w-full lg:flex-1 min-w-[140px]">
          <UiSelect
            v-model="selectedLevel"
            :options="levelOptions"
            select-class="bg-slate-50 border-slate-200 focus:ring-0 focus:border-blue-500"
          />
        </div>
        <!-- Checkbox เฉพาะทดลองงาน -->
        <UiCheckbox class="py-1.5 px-2 rounded hover:bg-slate-50 sm:col-span-2 md:col-span-3 lg:col-span-auto">
          เฉพาะทดลองปฏิบัติงาน
        </UiCheckbox>
        <!-- Right Side Clear Filter Button -->
        <div class="sm:col-span-2 md:col-span-4 lg:ml-auto flex items-center justify-end gap-2 pt-1 lg:pt-0">
          <button
            type="button"
            class="text-xs text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
            @click="handleClearFilters"
          >
            ล้างตัวกรอง
          </button>
        </div>
      </div>

      <!-- Active Filter Chips Row -->
      <div class="pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
        <span class="text-slate-400 text-[11px] font-medium">เงื่อนไขที่เลือก:</span>

        <span
          v-if="activeQueryChip"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50/90 text-blue-900 border border-blue-200 text-xs font-medium"
        >
          <span>
            คำค้นหา: <strong>{{ activeQueryChip }}</strong>
          </span>
          <button
            type="button"
            class="hover:text-red-600 transition-colors cursor-pointer"
            @click="handleRemoveSearchChip"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </span>

        <!-- Chip แสดงเหตุผลการพ้นจากราชการ -->
        <span
          v-if="selectedReason !== 'all'"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-xs font-medium"
        >
          <span>เหตุผลการพ้นฯ: {{ selectedReason }}</span>
          <button
            type="button"
            class="hover:text-red-600 transition-colors cursor-pointer"
            @click="selectedReason = 'all'"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </span>

        <span
          v-if="selectedDepartment !== 'all'"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-xs"
        >
          <span>สังกัด: {{ selectedDepartment }}</span>
          <button
            type="button"
            class="hover:text-red-600 transition-colors cursor-pointer"
            @click="selectedDepartment = 'all'"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </span>
      </div>
    </div>

    <!-- Results Card with View Mode Switcher -->
    <div class="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
      <!-- Card Header: Results Status Bar & Controls (ตัดปุ่มรายการคำร้องขอแก้ไขออกแล้ว) -->
      <div class="px-4 py-3 sm:py-3.5 border-b border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 bg-white">
        <div class="flex items-center gap-1.5 text-xs sm:text-sm text-slate-700">
          <span>พบข้อมูลผู้พ้นจากราชการ</span>
          <span class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 font-bold text-sm sm:text-base font-mono border border-blue-200/60">
            {{ filteredPersonnel.length }}
          </span>
          <span>รายการ</span>
        </div>

        <div class="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <!-- Sort Dropdown -->
          <UiSelect
            v-model="sortBy"
            :options="sortByOptions"
            select-class="hover:bg-white shadow-2xs border-slate-300 bg-slate-50 focus:ring-0 focus:border-blue-600 pl-3 pr-7"
          />

          <!-- View Mode Toggle Button Group -->
          <UiToggleGroup v-model="viewMode" :items="viewToggleItems" size="sm" />
        </div>
      </div>

      <!-- Card Body: Personnel Dossier Cards Grid (When in 'card' view) -->
      <div v-if="viewMode === 'card'" class="p-5 sm:p-6 bg-slate-50/50">
        <UiEmptyState
          v-if="filteredPersonnel.length === 0"
          message="ไม่พบข้อมูลผู้พ้นจากราชการตามเงื่อนไขที่ระบุ"
        />

        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          <div
            v-for="person in pagedPersonnel"
            :key="person.id"
            :id="`personnel-card-${person.id}`"
            class="bg-white rounded-xl transition-all flex flex-col justify-between overflow-hidden group shadow-sm hover:shadow-md cursor-pointer border border-slate-200/90 hover:border-blue-400"
            @click="$emit('openDetail', person)"
          >
            <div>
              <!-- Top Card Header -->
              <div class="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/70 to-white flex items-start justify-between gap-3">
                <div class="flex items-center gap-3.5 min-w-0">
                  <div class="relative flex-shrink-0">
                    <img
                      :alt="person.name"
                      class="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                      :src="person.avatarUrl"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-1.5">
                      <div class="text-base font-semibold text-slate-900 leading-snug truncate group-hover:text-blue-900 transition-colors">
                        {{ person.name }}
                      </div>
                    </div>
                    <div class="text-[11px] sm:text-xs text-slate-500 font-mono flex items-center gap-1.5 mt-1 flex-wrap">
                      <span class="truncate">ID: {{ person.citizenId }}</span>
                      <button
                        type="button"
                        class="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0 cursor-pointer"
                        title="คัดลอกเลขประจำตัว"
                        @click="handleCopyCitizenId(person.citizenId, person.name)"
                      >
                        <Copy class="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  class="text-slate-400 hover:text-blue-900 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                  title="ดูรายละเอียดประวัติ ก.พ. 7"
                  @click.stop="$emit('openDetail', person)"
                >
                  <Eye class="w-4 h-4" />
                </button>
              </div>

              <!-- Card Meta Content -->
              <div class="p-5 space-y-3 text-xs">
                <div class="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span class="text-slate-400 block text-[11px] mb-1">
                      เลขที่ตำแหน่งเดิม
                    </span>
                    <span class="font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded text-[11px] font-mono inline-block">
                      {{ person.positionNumber }}
                    </span>
                  </div>
                  <div class="text-right">
                    <span class="text-slate-400 block text-[11px] mb-1">
                      ประเภท/ระดับ
                    </span>
                    <span class="font-medium text-slate-800 inline-block pt-0.5">
                      {{ person.positionType }} / {{ person.positionLevel }}
                    </span>
                  </div>
                </div>

                <div class="flex items-start justify-between gap-3 pt-0.5">
                  <span class="text-slate-400 flex-shrink-0">
                    ตำแหน่งก่อนพ้นฯ
                  </span>
                  <span class="font-semibold text-blue-950 text-right truncate">
                    {{ person.jobTitle }}
                  </span>
                </div>

                <div class="flex items-start justify-between gap-3">
                  <span class="text-slate-400 flex-shrink-0">สังกัดเดิม</span>
                  <span class="font-normal text-slate-600 text-right leading-tight line-clamp-2">
                    {{ person.department }}
                  </span>
                </div>

                <div class="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span class="text-slate-400">เหตุผลการพ้นฯ</span>
                  <div class="text-right">
                    <UiBadge tone="amber">
                      {{ (person as any).dischargeReason || 'เกษียณอายุราชการ' }}
                    </UiBadge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table View: ตารางรายชื่อบุคลากรผู้พ้นจากราชการ (When in 'table' view) -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200/90 text-[12px] font-semibold text-slate-600 tracking-tight select-none">
              <th class="py-3.5 px-4 text-center w-12">#</th>
              <th class="py-3.5 px-4 min-w-[240px]">บุคลากร / เลขประจำตัว</th>
              <th class="py-3.5 px-3 min-w-[110px]">เลขที่ตำแหน่งเดิม</th>
              <th class="py-3.5 px-4 min-w-[160px]">ตำแหน่งสายงานเดิม</th>
              <th class="py-3.5 px-3 min-w-[130px]">ประเภท / ระดับ</th>
              <th class="py-3.5 px-4 min-w-[210px]">สังกัดเดิม</th>
              <th class="py-3.5 px-4 min-w-[150px]">เหตุผลการพ้นจากราชการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
            <tr
              v-for="person in pagedPersonnel"
              :key="person.id"
              class="hover:bg-slate-50/70 transition-colors group cursor-pointer"
              @click="$emit('openDetail', person)"
            >
              <td class="py-3.5 px-4 text-center text-slate-400 font-mono text-[11px]">
                {{ person.orderNumber }}
              </td>
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-3">
                  <div class="relative flex-shrink-0">
                    <img
                      :alt="person.name"
                      class="w-9 h-9 rounded-lg object-cover border border-slate-200 shadow-2xs"
                      :src="person.avatarUrl"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div class="min-w-0">
                    <div class="font-semibold text-slate-900 group-hover:text-blue-900 transition-colors truncate">
                      {{ person.name }}
                    </div>
                    <div class="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                      <span>ID: {{ person.citizenId }}</span>
                      <button
                        type="button"
                        class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        title="คัดลอกเลขประจำตัว"
                        @click.stop="handleCopyCitizenId(person.citizenId, person.name)"
                      >
                        <Copy class="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </td>
              <td class="py-3.5 px-3">
                <span class="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-mono inline-block">
                  {{ person.positionNumber }}
                </span>
              </td>
              <td class="py-3.5 px-4 font-semibold text-blue-950 truncate">
                {{ person.jobTitle }}
              </td>
              <td class="py-3.5 px-3 font-medium text-slate-800">
                {{ person.positionType }} / {{ person.positionLevel }}
              </td>
              <td class="py-3.5 px-4 text-slate-600 leading-tight">
                {{ person.department }}
              </td>
              <td class="py-3.5 px-4">
                <UiBadge tone="amber">
                  {{ (person as any).dischargeReason || 'เกษียณอายุราชการ' }}
                </UiBadge>
              </td>
            </tr>
            <tr v-if="filteredPersonnel.length === 0">
              <td colspan="7">
                <UiEmptyState message="ไม่พบข้อมูลผู้พ้นจากราชการตามเงื่อนไขที่ระบุ" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Card Footer: Pagination Controls -->
      <UiPagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="filteredPersonnel.length"
        :page-size-options="[6, 12, 24, 48]"
        class="p-3.5 sm:p-4 border-t border-slate-200/90 bg-white"
      />
    </div>

    <!-- Personnel Detail Modal (ประวัติผู้พ้นจากราชการ) -->
    <UiModal :is-open="!!selectedPersonnel" @close="selectedPersonnel = null">
      <template #header>
        <div class="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-medium">
          <UserCheck class="w-4 h-4" />
        </div>
        <h3 class="font-bold text-sm text-slate-900">
          ทะเบียนประวัติผู้พ้นจากราชการ
        </h3>
      </template>

      <div v-if="selectedPersonnel" class="space-y-4">
        <div class="flex items-center gap-4">
          <img
            :src="selectedPersonnel.avatarUrl"
            :alt="selectedPersonnel.name"
            class="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs"
            referrerPolicy="no-referrer"
          />
          <div>
            <h4 class="font-bold text-base text-slate-900">
              {{ selectedPersonnel.name }}
            </h4>
            <p class="text-xs text-slate-500 font-mono mt-0.5">
              ID: {{ selectedPersonnel.citizenId }}
            </p>
            <UiBadge tone="amber" class="mt-1.5">
              {{ (selectedPersonnel as any).dischargeReason || 'เกษียณอายุราชการ' }}
            </UiBadge>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 pt-2 text-xs">
          <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <span class="text-slate-400 text-[11px] block">เลขที่ตำแหน่งเดิม</span>
            <span class="font-semibold text-slate-800 font-mono">
              {{ selectedPersonnel.positionNumber }}
            </span>
          </div>
          <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <span class="text-slate-400 text-[11px] block">ประเภท / ระดับ</span>
            <span class="font-semibold text-slate-800">
              {{ selectedPersonnel.positionType }} / {{ selectedPersonnel.positionLevel }}
            </span>
          </div>
        </div>

        <div class="text-xs space-y-2 pt-1 border-t border-slate-100">
          <div class="flex items-center gap-2">
            <Building class="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span class="text-slate-500">สังกัดเดิม:</span>
            <span class="font-medium text-slate-800">
              {{ selectedPersonnel.department }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <Calendar class="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span class="text-slate-500">วันบรรจุแต่งตั้ง:</span>
            <span class="font-medium text-slate-800">
              {{ selectedPersonnel.appointedDate }} ({{ selectedPersonnel.serviceYears }})
            </span>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton variant="outline" size="xs" @click="selectedPersonnel = null">
            ปิด
          </UiButton>
          <UiButton size="xs" @click="handlePrint">
            พิมพ์ประวัติ
          </UiButton>
          <UiButton
            size="xs"
            class="bg-[#002B7F] hover:bg-blue-900 font-semibold"
            @click="$emit('openDetail', selectedPersonnel!); selectedPersonnel = null"
          >
            <template #icon>
              <UserCheck class="w-3.5 h-3.5" />
            </template>
            ดูรายละเอียดประวัติ
          </UiButton>
        </div>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { PageTitle } from '../common';
import {
  UiBadge,
  UiButton,
  UiEmptyState,
  UiModal,
  UiPagination,
  UiSearchInput,
  UiSelect,
  UiToggleGroup,
UiCheckbox,
} from '../ui';
import {
  Search,
  RotateCw,
  SlidersHorizontal,
  X,
  Copy,
  LayoutGrid,
  List,
  UserCheck,
  Building,
  Calendar,
  Eye,
} from 'lucide-vue-next';
import type { PersonnelRecord, PersonnelCategory } from '../../types';
import { INITIAL_PERSONNEL } from '../../data/personnelData';
import { useToast } from '../../composables/useToast';
const { show } = useToast();

const props = defineProps<{
  category: PersonnelCategory;
}>();

const emit = defineEmits<{
  (e: 'openAdvancedSearch'): void;
  (e: 'openDetail', person: PersonnelRecord): void;
}>();

const viewMode = ref<'card' | 'table'>('card');
const searchCondition = ref('name');
const searchQuery = ref('สัจจวัตร');
const activeQueryChip = ref('สัจจวัตร');

// ตัวกรองเหตุผลการพ้นจากราชการ (เพิ่มใหม่)
const selectedReason = ref('all');
const selectedDepartment = ref('all');
const selectedPositionType = ref('all');
const selectedLevel = ref('all');
const sortBy = ref('date_desc');
const currentPage = ref(1);
const pageSize = ref(6);
const selectedPersonnel = ref<PersonnelRecord | null>(null);

const searchConditionOptions = [
  { value: 'name', label: 'ชื่อ - นามสกุล บุคลากร' },
  { value: 'citizen_id', label: 'เลขประจำตัวประชาชน (13 หลัก)' },
  { value: 'position_no', label: 'เลขที่ตำแหน่งเดิม' },
  { value: 'job_title', label: 'ตำแหน่งในสายงานเดิม' },
];

// ตัวเลือกเหตุผลการพ้นจากราชการ
const reasonOptions = [
  { value: 'all', label: 'เหตุผลการพ้นจากราชการ (ทั้งหมด)' },
  { value: 'เกษียณอายุราชการ', label: 'เกษียณอายุราชการ' },
  { value: 'ลาออกจากราชการ', label: 'ลาออกจากราชการ' },
  { value: 'ให้ออกจากราชการ', label: 'ให้ออกจากราชการ' },
  { value: 'พ้นจากราชการตามสัญญา', label: 'พ้นจากราชการตามสัญญา' },
  { value: 'เสียชีวิต', label: 'เสียชีวิต' },
];

const departmentOptions = [
  { value: 'all', label: 'สังกัด/ส่วนราชการ (ทั้งหมด)' },
  { value: 'สำนักปลัด', label: 'สำนักปลัดกรุงเทพมหานคร' },
  { value: 'สำนักงานคณะกรรมการข้าราชการกรุงเทพมหานคร', label: 'สำนักงานคณะกรรมการข้าราชการกรุงเทพมหานคร' },
  { value: 'สำนักการระบายน้ำ', label: 'สำนักการระบายน้ำ' },
  { value: 'สำนักการศึกษา', label: 'สำนักการศึกษา' },
  { value: 'สำนักยุทธศาสตร์', label: 'สำนักยุทธศาสตร์และประเมินผล' },
  { value: 'สำนักการคลัง', label: 'สำนักการคลัง' },
];

const positionTypeOptions = [
  { value: 'all', label: 'ประเภทตำแหน่ง (ทั้งหมด)' },
  { value: 'บริหาร', label: 'บริหาร' },
  { value: 'อำนวยการ', label: 'อำนวยการ' },
  { value: 'วิชาการ', label: 'วิชาการ' },
  { value: 'ทั่วไป', label: 'ทั่วไป' },
];

const levelOptions = [
  { value: 'all', label: 'ระดับตำแหน่ง (ทั้งหมด)' },
  { value: 'สูง', label: 'สูง' },
  { value: 'ต้น', label: 'ต้น' },
  { value: 'เชี่ยวชาญ', label: 'เชี่ยวชาญ' },
  { value: 'ชำนาญการพิเศษ', label: 'ชำนาญการพิเศษ' },
  { value: 'ชำนาญการ', label: 'ชำนาญการ' },
  { value: 'ปฏิบัติการ', label: 'ปฏิบัติการ' },
];

const sortByOptions = [
  { value: 'date_desc', label: 'เรียงตาม: วันที่บรรจุแต่งตั้ง (ล่าสุด - เก่าสุด)' },
  { value: 'pos_no', label: 'เรียงตาม: เลขที่ตำแหน่ง (น้อย - มาก)' },
  { value: 'name', label: 'เรียงตาม: ชื่อ - นามสกุล (ก - ฮ)' },
  { value: 'level', label: 'เรียงตาม: ระดับตำแหน่ง (สูง - ต่ำ)' },
];

const viewToggleItems = [
  { value: 'card', icon: LayoutGrid, title: 'มุมมองแบบการ์ด' },
  { value: 'table', icon: List, title: 'มุมมองแบบตาราง' },
];

const pagedPersonnel = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredPersonnel.value.slice(start, start + pageSize.value);
});

// ปรับแต่งข้อความสำหรับทะเบียนประวัติผู้พ้นจากราชการ
const categoryLabels: Record<PersonnelCategory, { title: string; subtitle: string }> = {
  civil_servant: {
    title: 'ค้นหาข้อมูลทะเบียนประวัติผู้พ้นจากราชการ (ข้าราชการ กทม. สามัญ)',
    subtitle: 'ระบบตรวจสอบและบริหารประวัติข้าราชการกรุงเทพมหานครผู้พ้นจากราชการ',
  },
  permanent_employee: {
    title: 'ค้นหาข้อมูลทะเบียนประวัติผู้พ้นจากราชการ (ลูกจ้างประจำ กทม.)',
    subtitle: 'ระบบตรวจสอบและบริหารประวัติลูกจ้างประจำกรุงเทพมหานครผู้พ้นจากราชการ',
  },
  temporary_employee: {
    title: 'ค้นหาข้อมูลทะเบียนประวัติผู้พ้นจากราชการ (ลูกจ้างชั่วคราว กทม.)',
    subtitle: 'ระบบตรวจสอบและบริหารประวัติลูกจ้างชั่วคราวกทม. ผู้พ้นจากราชการ',
  },
};

const handleCopyCitizenId = (id: string, name: string) => {
  navigator.clipboard?.writeText(id);
  show(`คัดลอกเลขประจำตัวประชาชนของ ${name} เรียบร้อยแล้ว`);
};

const handleSearchSubmit = () => {
  activeQueryChip.value = searchQuery.value.trim();
};

const handleRemoveSearchChip = () => {
  activeQueryChip.value = '';
  searchQuery.value = '';
};

const handleClearFilters = () => {
  searchQuery.value = '';
  activeQueryChip.value = '';
  selectedReason.value = 'all';
  selectedDepartment.value = 'all';
  selectedPositionType.value = 'all';
  selectedLevel.value = 'all';
  show('ล้างเงื่อนไขตัวกรองทั้งหมดแล้ว');
};

const handlePrint = () => {
  window.print();
};

const filteredPersonnel = computed(() => {
  let result = [...INITIAL_PERSONNEL];

  // กรองตามเหตุผลการพ้นจากราชการ
  if (selectedReason.value !== 'all') {
    result = result.filter((p) => {
      const reason = (p as any).dischargeReason || 'เกษียณอายุราชการ';
      return reason === selectedReason.value;
    });
  }

  if (selectedDepartment.value !== 'all') {
    result = result.filter((p) => p.department.includes(selectedDepartment.value));
  }

  if (selectedPositionType.value !== 'all') {
    result = result.filter((p) => p.positionType === selectedPositionType.value);
  }

  if (selectedLevel.value !== 'all') {
    result = result.filter((p) => p.positionLevel === selectedLevel.value);
  }

  if (activeQueryChip.value.trim()) {
    const q = activeQueryChip.value.toLowerCase();
    result = result.filter((p) => {
      if (searchCondition.value === 'name') {
        return p.name.toLowerCase().includes(q);
      } else if (searchCondition.value === 'citizen_id') {
        return p.citizenId.includes(q);
      } else if (searchCondition.value === 'position_no') {
        return p.positionNumber.toLowerCase().includes(q);
      } else if (searchCondition.value === 'job_title') {
        return p.jobTitle.toLowerCase().includes(q);
      }
      return (
        p.name.toLowerCase().includes(q) ||
        p.citizenId.includes(q) ||
        p.positionNumber.toLowerCase().includes(q)
      );
    });
  }

  // Sort
  if (sortBy.value === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name, 'th'));
  } else if (sortBy.value === 'pos_no') {
    result.sort((a, b) => a.positionNumber.localeCompare(b.positionNumber));
  }

  return result;
});
</script>