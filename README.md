
## ภาพรวมโปรเจกต์
G-hr (ระบบบริหารทรัพยากรบุคคล) — ระบบ HR สำหรับของหน่วยงานภาครัฐ
 ให้บริการทะเบียนประวัติข้าราชการอิเล็กทรอนิกส์ (ก.พ. 7 อิเล็กทรอนิกส์) 

**นี่คือแอป Vue 3** — จุดเริ่มต้น `src/main.ts` ใช้ `createApp` ของ Vue และ vite.config.ts ใช้ `@vitejs/plugin-vue` ใช้ `lucide-vue-next` สำหรับไอคอน และเขียน SFC แบบ `<script setup lang="ts">`

## คำสั่งหลัก

```bash
npm run dev      # Vite dev server พอร์ต 3000 (bind 0.0.0.0)
npm run build    # build ขึ้น dist/
npm run lint     # type check เท่านั้น (tsc --noEmit) — ไม่มี ESLint config
npm run preview  # preview build โปรดักชัน
```

ไม่มีเฟรมเวิร์กทดสอบ `npm run lint` (type checking) เป็นการตรวจสอบอัตโนมัติเพียงช่องทางเดียว

## สถาปัตยกรรม

**Vue Router 4 + ไม่มี state library (Pinia ฯลฯ) + ไม่มี backend** ข้อมูลทั้งหมด hardcoded ใน `src/data/` เป็น demo/prototype ฝั่ง frontend เท่านั้น

- **Routing**: `src/router/index.ts` — ตาราง route แบบ flat กับ `createWebHistory` route เป็น lazy-load และมี `meta.menu` / `meta.submenu` / `meta.nestedSubmenu` / `meta.title` เก็บ **id เมนูแบบเดิมของ sidebar** (เช่น `records`, `civil_servant`) เพื่อให้ Sidebar และ Header ใช้ state highlight/breadcrumb จาก `route.meta` + `route.params` แทนการส่ง props หมวดที่ยังไม่เปิดใช้งาน render `PlaceholderView` (มีตัวช่วย `accordionPlaceholder` สำหรับ redirect เข้า submenu แรก และ `nestedPlaceholder` สำหรับเมนู 3 ระดับ) รูปแบบ URL ใช้ snake_case menu id (`/records/civil_servant`, `/edit_records/:citizenId`, `/records/modification_requests/:requestId`, `/records/:category/person/:id`)
- **Auth**: `src/composables/useAuth.ts` — สถานะล็อกอินจำลองเก็บใน sessionStorage (singleton `isAuthenticated` ref + `signIn`/`signOut`) Router guard ใน `src/router/index.ts` บังคับ: ยังไม่ล็อกอิน → `/login` เสมอ (ยกเว้นหน้า login เอง) และถ้าล็อกอินแล้วห้ามกลับไป `/login` `LoginView.vue` เป็นหน้าล็อกอินจำลอง (ไม่มี backend)
- **Menu config**: `src/router/menu.ts` เป็นแหล่งความจริงเดียวของต้นไม้เมนู sidebar (`menuItems`, types) และ `MENU_LABELS` (id → ป้ายไทย รวม virtual id `advanced_search`/`modification_requests`) พร้อม helper `pathForMenu`/`pathForSubmenu`/`pathForNested` — ต้องส่ง parent menu id เสมอเวลาสร้าง path ของ submenu เพราะ `civil_servant`/`permanent_employee` อยู่ทั้งใต้ `records` และ `retired_records`
- **Views**: `src/views/` เป็นคอมโพเนนต์ระดับ route หน้าหนักๆ อยู่ใน `src/components/` และ **ไม่ผูกกับ router** (รับ props / ส่ง emit) view แบบบางจะแปลง navigation emit เป็น `router.push` (เช่น `PersonnelListView` ครอบ `PersonnelDossier` โดย map `@open-detail` → route `person-detail` โดย resolve record จาก `INITIAL_PERSONNEL`) `useGoBack(fallback)` จะย้อนผ่าน history ถ้ามี ไม่งั้นใช้ `router.replace(fallback)` (กรณี deep link)
- **Shared state**: composable แบบ module-scoped singleton ไม่ใช่ Pinia — `useInbox()` (messages + markRead/markAllAsRead/removeMessage/sendReply, ใช้ทั้ง `Header` และ `HomeView`; selected message อยู่ที่ query param `?selected=`) และ `useToast()` (`show(msg)`, auto-dismiss 3 วินาที; `App.vue` render `<Toast>` เพียงตัวเดียว) **ห้าม emit `showToast` ขึ้นไปตามต้นไม้ — เรียก `useToast().show()` ตรงๆ**
- **Mock data**: `src/data/personnelData.ts` export `INITIAL_PERSONNEL`; `src/data/mockData.ts` export `INITIAL_MESSAGES`; `modificationRequests.ts`, `registryRows.ts`, `actingData.ts`, `conditionalRolesData.ts`, `permanentStaffData.ts`, `temporaryStaffData.ts` เก็บ reactive row lists ที่แชร์ระหว่าง list view กับ detail route (resolve ด้วย `id` / `citizenId`) รูปทรงข้อมูลรวมอยู่ที่ `src/types.ts` (`PersonnelRecord`, `MessageItem`, `AppTableColumn`, ...) field ใน `PersonnelRecord` จำนวนมากเป็น optional และ mock record ตั้งใจให้ข้อมูลไม่ครบ — อย่าสมมติว่า field มีค่าเสมอ

## โครงสร้างคอมโพเนนต์

`src/components/` แยกตามโดเมน แต่ละโฟลเดอร์มี barrel `index.ts` และ re-export รวมที่ `src/components/index.ts`

- `ui/` — **UI library กลางที่ทุกหน้าใช้ร่วมกัน** (ดูหัวข้อ UI Library)
- `layout/` — `Sidebar` (เมนู accordion; สถานะ navigation มาจาก `route.meta`, คลิก `router.push`, emit เดียวคือ `closeMobile`), `Header` (breadcrumb + การแจ้งเตือน จาก `route.meta` + `useInbox()`)
- `personnel/` — `PersonnelDossier` (รายการทะเบียนตามหมวด, โหมดการ์ด/ตาราง, กรอง/แบ่งหน้าฝั่ง client), `DischargedPersonnelDossier`, `AdvancedSearch`, `PersonnelDetailView` (หน้าประวัติขนาดใหญ่), `TemporaryEmployeeList`, `ModificationRequestDetail`, `RegistryPositionEditDetail`, `ActingPositionManager` + `ActingUnitTree` (รักษาการในตำแหน่ง), `ConditionalPositionManager` (ตำแหน่งติดเงื่อนไข)
- `organization/` — `OrganizationStructure` (โครงสร้างอัตรากำลัง: ตาราง + tree sidebar, มุมมอง org-chart, chart รายบุคคล), `PermanentStaffStructure`, `TemporaryStaffStructure`, `orgHelpers.ts`
- `inbox/` — `InboxList`, `MessageDetail`, `ReplyModal`, `AttendanceHistoryModal` (ประกอบกันใน `src/views/HomeView.vue`)
- `common/` — `PageTitle`, `Toast`

`src/views/` เป็นหน้าที่ถูก route: `HomeView` (กล่องข้อความ; selected message ผ่าน `?selected=`), `LoginView`, `PersonnelListView`, `RetiredPersonnelListView`, `AdvancedSearchView`, `PersonDetailView`, `ModificationRequestsView` + `ModificationRequestDetailView`, `RegistryEditView` + `RegistryEditDetailView`, `ActingPositionView`, `ConditionalRolesView`, `PlaceholderView`

## UI Library (`src/components/ui/`)

Primitive ที่ใช้ร่วมกัน นำหน้าด้วย `Ui`: `UiButton` (variants `primary`/`success`/`accent`/`outline`/`ghost`, sizes `xs`/`sm`/`md`, ไอคอนผ่าน slot `#icon`), `UiIconButton`, `UiBadge` (tones `slate`/`blue`/`emerald`/`amber`/`red`/`teal`/`outline`, shapes `pill`/`chip`, มี `dot`/`mono`), `UiCard`, `UiStatCard`, `UiSearchInput`, `UiInput`, `UiSelect`, `UiCheckbox`, `UiToggleGroup` (segmented control), `UiPagination` (v-model:current-page / v-model:page-size + `total`), `UiEmptyState`, `UiModal` (`isOpen`, `max-width`, `panel-class`, slot `#header`, ปุ่มปิด X ในตัว, body scrollable `p-5`, slot `#footer`), `UiToolbar`, `PageActionBar`, `UiTabs`, `UiSplitter`, `UiBreadcrumbs` (`@select`), `UiDropdownButton` (menu items + `@select`), `UiList`/`UiListItem` (slots `leading`/`title`/`subtitle`/`trailing`), `UiTree` (node แบบ recursive `{id,label,count?,children?}`), `UiUploader` (v-model `File[]`, drag & drop)

**`AppTable`** (อยู่ใน `ui/` เช่นกัน ไม่มี prefix) — data table มาตรฐาน: config แบบ `AppTableColumn[]` (มี `hidden`/`sortable`/`align`/`width`), scoped slots `cell-{key}`, pagination ในตัว (ใช้ `UiPagination`; ผู้เรียกต้อง slice data เองแล้วส่ง `data` ที่ slice แล้ว + `totalItems`), row-click, empty state หน้าตา default ของมันคือดีไซน์ตารางของระบบ (container `rounded-xl border-slate-200/90`, header `bg-slate-50/80 text-[12px] font-semibold text-slate-600`, rows `text-xs text-slate-700 hover:bg-slate-50/70`, cell `py-3.5 px-4`) — อย่าจัดสไตล์ตารางให้ดูต่างไป ตารางที่เขียนเองที่อื่นใช้ class ชุดเดียวกันนี้

**หน้าตัวอย่างสด**: `ui/UiShowcase.vue` — demo dev-only ของ UI ทุกตัวที่ `/ui_kit` (ลง route แต่**ไม่อยู่ในเมนู sidebar**) มี Typography, Theme Builder, Shadows และ demo ต่อคอมโพเนนต์ เมื่อเพิ่มคอมโพเนนต์ใหม่ให้เพิ่ม demo ที่นี่ด้วย

**ห้ามเขียน class ของ button/badge/input/select เองในหน้า** — import จาก `../ui` (หรือ `./components`) class default ในคอมโพเนนต์เหล่านี้คือ styling ต้นแบบที่คัดลอกจากหน้าตาเดิมของแอป ถ้าดีไซน์ซิสเทมเปลี่ยน ให้แก้ที่นี่จุดเดียว สิ่งที่เขียน inline เฉพาะตัวคงเหลืออยู่บ้างเป็นเจตนา (เช่น selector หน่วยงานใน people-view, form field ใน filter panel ของ AdvancedSearch, filter chip แบบ compact ใน `InboxList`, ปุ่มลิงก์ข้อความอย่าง "ล้างตัวกรอง")

id หมวดบุคลากร (`civil_servant` | `permanent_employee` | `temporary_employee`) ทำหน้าที่ซ้ำสองบทเป็นทั้ง submenu id ใน sidebar และ prop `category` ของ `PersonnelDossier` ผ่าน route param `:category` (`/records/:category`, `props: true`)

## Styling

Tailwind CSS v4 ผ่าน `@tailwindcss/vite` พาเลตแบรนด์ BMA (`bma-50` … `bma-900`) และฟอนต์ (Prompt สำหรับไทย, Plus Jakarta Sans) นิยามใน block `@theme` ของ `src/index.css` — ใช้ utility class `bma-*` แทนค่า hex ดิบสำหรับสีแบรนด์ Vite config ปิด HMR/file-watching เมื่อ `DISABLE_HMR=true` (AI Studio ตั้งค่าไว้) ห้ามลบพฤติกรรมนี้
