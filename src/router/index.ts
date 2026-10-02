import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { isAuthenticated, authRole } from '../composables/useAuth';

// หมวด placeholder แบบ accordion: /<menu> → redirect เข้า submenu แรก
// และ /<menu>/:subId → PlaceholderView (Sidebar ไฮไลต์จาก params.subId)
const accordionPlaceholder = (menu: string, firstSub: string): RouteRecordRaw[] => [
  { path: `/${menu}`, redirect: `/${menu}/${firstSub}` },
  {
    path: `/${menu}/:subId`,
    component: () => import('../views/PlaceholderView.vue'),
    meta: { menu },
  },
];

// ชุด submenu ที่มีระดับ 3 (nested): /<menu>/<subId>/:nestedId
const nestedPlaceholder = (menu: string, subId: string): RouteRecordRaw => ({
  path: `/${menu}/${subId}/:nestedId`,
  component: () => import('../views/PlaceholderView.vue'),
  meta: { menu },
});

// meta.menu / meta.submenu ใช้ id เมนูเดิม (รวม id ซ้ำระหว่าง records/retired_records)
// เพื่อให้ Sidebar และ Header ใช้ logic highlight/breadcrumb เดิมได้กับทุกหน้า
const routes: RouteRecordRaw[] = [
  // หน้าล็อกอิน (ยังไม่ผ่านการยืนยันตัวตนจะถูก guard ส่งกลับมาที่นี่เสมอ)
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: 'เข้าสู่ระบบ' },
  },

  // หน้าแรก (กล่องข้อความและการแจ้งเตือน) เป็นหน้าเริ่มต้นของระบบ
  { path: '/', redirect: '/home' },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { menu: 'home', title: 'หน้าแรก' },
  },

  // --- ฝั่งบุคลากร (User) — layout แยกจากฝั่ง Admin ---
  {
    path: '/user',
    component: () => import('../layouts/UserLayout.vue'),
    children: [
      {
        path: 'home',
        name: 'user-home',
        component: () => import('../views/UserHomeView.vue'),
        meta: { title: 'หน้าแรก' },
      },
      {
        path: 'check-in',
        name: 'user-check-in',
        component: () => import('../views/UserCheckInView.vue'),
        meta: { title: 'เช็คอินเวลาลงงาน' },
      },
    ],
  },

  // --- ทะเบียนประวัติ (records) ---
  { path: '/records', redirect: '/records/civil_servant' },
  {
    path: '/records/:category(civil_servant|permanent_employee)',
    name: 'records-list',
    component: () => import('../views/PersonnelListView.vue'),
    meta: { menu: 'records', title: 'ทะเบียนประวัติ' },
  },
  {
    path: '/records/temporary_employee',
    name: 'records-temporary',
    component: () => import('../components/personnel/TemporaryEmployeeList.vue'),
    meta: { menu: 'records', submenu: 'temporary_employee', title: 'ลูกจ้างชั่วคราว' },
  },
  {
    path: '/records/advanced_search',
    name: 'records-advanced-search',
    component: () => import('../views/AdvancedSearchView.vue'),
    meta: { menu: 'records', submenu: 'advanced_search', title: 'รายงานการค้นหาขั้นสูง' },
  },
  {
    path: '/records/modification_requests',
    name: 'modification-requests',
    component: () => import('../views/ModificationRequestsView.vue'),
    meta: { menu: 'records', submenu: 'modification_requests', title: 'รายการขอแก้ไขข้อมูล' },
  },
  {
    path: '/records/modification_requests/:requestId',
    name: 'modification-request-detail',
    component: () => import('../views/ModificationRequestDetailView.vue'),
    props: true,
    meta: { menu: 'records', submenu: 'modification_requests', title: 'รายละเอียดคำร้องขอแก้ไข' },
  },
  {
    path: '/records/:category(civil_servant|permanent_employee)/person/:id',
    name: 'person-detail',
    component: () => import('../views/PersonDetailView.vue'),
    props: true,
    meta: { menu: 'records', title: 'ทะเบียนประวัติ' },
  },

  // --- ทะเบียนประวัติผู้พ้นจากราชการ (retired_records) ---
  { path: '/retired_records', redirect: '/retired_records/civil_servant' },
  {
    path: '/retired_records/:category(civil_servant|permanent_employee)',
    name: 'retired-records-list',
    component: () => import('../views/RetiredPersonnelListView.vue'),
    meta: { menu: 'retired_records', title: 'ทะเบียนประวัติผู้พ้นจากราชการ' },
  },

  // --- แก้ไขทะเบียนประวัติ ตำแหน่ง/เงินเดือน ---
  {
    path: '/edit_records',
    name: 'edit-records',
    component: () => import('../views/RegistryEditView.vue'),
    meta: { menu: 'edit_records', title: 'แก้ไขทะเบียนประวัติ ตำแหน่ง/เงินเดือน' },
  },
  {
    path: '/edit_records/:citizenId',
    name: 'edit-records-detail',
    component: () => import('../views/RegistryEditDetailView.vue'),
    props: true,
    meta: { menu: 'edit_records', title: 'แก้ไขทะเบียนประวัติ ตำแหน่ง/เงินเดือน' },
  },

  {
    path: '/organization',
    name: 'organization',
    component: () => import('../components/organization/OrganizationStructure.vue'),
    meta: { menu: 'organization', title: 'โครงสร้างอัตรากำลัง' },
  },
  {
    path: '/ui_kit',
    name: 'ui-kit',
    component: () => import('../components/ui/UiShowcase.vue'),
    meta: { menu: 'ui_kit', title: 'ตัวอย่าง UI' },
  },

  // --- หมวดที่ยังไม่เปิดใช้งาน (placeholder) — เมนู leaf ---
  {
    path: '/acting',
    name: 'acting',
    component: () => import('../views/ActingPositionView.vue'),
    meta: { menu: 'acting', title: 'รักษาการในตำแหน่ง' },
  },
  {
    path: '/permanent_staff',
    name: 'permanent-staff',
    component: () => import('../components/organization/PermanentStaffStructure.vue'),
    meta: { menu: 'permanent_staff', title: 'อัตรากำลังลูกจ้างประจำฯ' },
  },
  {
    path: '/temporary_staff',
    name: 'temporary-staff',
    component: () => import('../components/organization/TemporaryStaffStructure.vue'),
    meta: { menu: 'temporary_staff', title: 'อัตรากำลังลูกจ้างชั่วคราว' },
  },
  {
    path: '/conditional_roles',
    name: 'conditional-roles',
    component: () => import('../views/ConditionalRolesView.vue'),
    meta: { menu: 'conditional_roles', title: 'จัดการตำแหน่งติดเงื่อนไข' },
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('../views/PlaceholderView.vue'),
    meta: { menu: 'orders', title: 'ออกคำสั่ง' },
  },
  {
    path: '/probation',
    name: 'probation',
    component: () => import('../views/PlaceholderView.vue'),
    meta: { menu: 'probation', title: 'ทดลองปฏิบัติหน้าที่ราชการ' },
  },

  // --- หมวด placeholder แบบ accordion ---
  ...accordionPlaceholder('recruitment', 'recruitment_website'),
  ...accordionPlaceholder('placement', 'placement_pass'),
  ...accordionPlaceholder('dismissal', 'dismissal_retirement'),
  ...accordionPlaceholder('insignia', 'insignia_round'),
  ...accordionPlaceholder('leave', 'leave_work_round'),

  // วินัย — มีระดับ 3 (ข้อมูลพื้นฐาน)
  { path: '/discipline', redirect: '/discipline/discipline_complain' },
  nestedPlaceholder('discipline', 'discipline_info'),
  {
    path: '/discipline/:subId',
    component: () => import('../views/PlaceholderView.vue'),
    meta: { menu: 'discipline' },
  },

  // ประเมินบุคคล — มีระดับ 3 (กรรมการและการประชุม)
  { path: '/personnel_evaluation', redirect: '/personnel_evaluation/personnel_eval_request' },
  nestedPlaceholder('personnel_evaluation', 'personnel_eval_info'),
  {
    path: '/personnel_evaluation/:subId',
    component: () => import('../views/PlaceholderView.vue'),
    meta: { menu: 'personnel_evaluation' },
  },

  ...accordionPlaceholder('salary', 'salary_chart_officer'),
  ...accordionPlaceholder('kpi', 'kpi_round'),
  ...accordionPlaceholder('development', 'development_project'),
  ...accordionPlaceholder('dashboard', 'dashboard_org'),
  ...accordionPlaceholder('report', 'report_org'),

  // --- ข้อมูลการประเมิน (evaluations) — placeholder ทั้งหมด ---
  { path: '/evaluations', redirect: '/evaluations/indicators/indicator_by_plan' },
  { path: '/evaluations/indicators', redirect: '/evaluations/indicators/indicator_by_plan' },
  {
    path: '/evaluations/indicators/:nestedId(indicator_by_plan|indicator_by_role|indicator_assigned_tasks)',
    name: 'evaluations-indicator',
    component: () => import('../views/EvaluationIndicatorsView.vue'),
    meta: { menu: 'evaluations', submenu: 'indicators', title: 'ตัวชี้วัด' },
  },
  {
    path: '/evaluations/indicators/new',
    name: 'evaluations-indicator-new',
    component: () => import('../views/EvaluationIndicatorFormView.vue'),
    meta: { menu: 'evaluations', submenu: 'indicators', title: 'เพิ่มตัวชี้วัด' },
  },
  {
    path: '/evaluations/competency',
    name: 'evaluations-competency',
    component: () => import('../views/PlaceholderView.vue'),
    meta: { menu: 'evaluations', submenu: 'competency', title: 'สมรรถนะ' },
  },
  {
    path: '/evaluations/strategy',
    name: 'evaluations-strategy',
    component: () => import('../views/PlaceholderView.vue'),
    meta: { menu: 'evaluations', submenu: 'strategy', title: 'ยุทธศาสตร์' },
  },

  // --- ไม่พบหน้า ---
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/PlaceholderView.vue'),
    meta: { title: 'ไม่พบหน้าที่ต้องการ' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// --- Guard: ยังไม่ล็อกอินให้ไป /login เสมอ (ยกเว้นหน้า /login เอง)
// และถ้าล็อกอินแล้วให้พ้นหน้า /login ไปหน้าแรกตาม role
// ฝั่ง user (บุคลากร) เข้าได้เฉพาะ /user/* ส่วน admin เข้าเฉพาะส่วนจัดการ
router.beforeEach((to) => {
  const authed = isAuthenticated.value;
  const isUserArea = to.path.startsWith('/user');
  const homePath = authRole.value === 'user' ? '/user/home' : '/home';

  if (!authed) {
    // ยังไม่ล็อกอิน: ไป /login ได้เสมอ (กติกา role ใช้เฉพาะตอนล็อกอินแล้ว)
    if (to.path === '/login') return;
    return { path: '/login' };
  }
  if (to.path === '/login') return { path: homePath };
  if (authRole.value === 'user' && !isUserArea) return { path: '/user/home' };
  if (authRole.value === 'admin' && isUserArea) return { path: '/home' };
});

export default router;

declare module 'vue-router' {
  interface RouteMeta {
    menu?: string;
    submenu?: string;
    nestedSubmenu?: string;
    title?: string;
  }
}
