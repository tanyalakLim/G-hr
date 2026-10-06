// แหล่งกลางของโครงสร้างเมนู sidebar — ใช้ร่วมกันระหว่าง Sidebar, Header (breadcrumb)
// และ PlaceholderView เพื่อให้ id/ป้ายกำกับตรงกันทั้งระบบ
import type { Component } from 'vue';
import {
  Home,
  FileText,
  PenLine,
  FileBadge2,
  Users,
  Contact,
  UserPlus,
  UserCheck,
  UserX,
  ArrowLeftRight,
  FolderCheck,
  Award,
  Search,
  BadgeCheck,
  Hourglass,
  Medal,
  CalendarDays,
  Scale,
  ClipboardCheck,
  Banknote,
  Target,
  GraduationCap,
  LayoutDashboard,
  BarChart3,
  Palette,
} from 'lucide-vue-next';

export interface NestedSubMenuItem {
  id: string;
  label: string;
}

export interface SubMenuItem {
  id: string;
  label: string;
  subItems?: NestedSubMenuItem[];
}

export interface MenuItem {
  id: string;
  label: string;
  icon: Component;
  isAccordion?: boolean;
  hasArrow?: boolean;
  subItems?: SubMenuItem[];
}

export const menuItems: MenuItem[] = [

  // หน้าแรก (กล่องข้อความและการแจ้งเตือน) — หน้าเริ่มต้นของระบบ
  { id: 'home', label: 'หน้าแรก', icon: Home },

  // 1. ทะเบียนประวัติ
  {
    id: 'records',
    label: 'ทะเบียนประวัติ',
    icon: FileText,
    isAccordion: true,
    subItems: [
      { id: 'civil_servant', label: 'ข้าราชการ กทม. สามัญ' },
      { id: 'permanent_employee', label: 'ลูกจ้างประจำ กทม.' },
      { id: 'temporary_employee', label: 'ลูกจ้างชั่วคราว' },
    ],
  },

  // 2. แก้ไขทะเบียนประวัติ ตำแหน่ง/เงินเดือน
  { id: 'edit_records', label: 'แก้ไขทะเบียนประวัติ ตำแหน่ง/เงินเดือน', icon: PenLine },

  // 3. ทะเบียนประวัติผู้พ้นจากราชการ
  {
    id: 'retired_records',
    label: 'ทะเบียนประวัติผู้พ้นจากราชการ',
    icon: FileBadge2,
    isAccordion: true,
    subItems: [
      { id: 'civil_servant', label: 'ข้าราชการ กทม. สามัญ' },
      { id: 'permanent_employee', label: 'ลูกจ้างประจำ กทม.' },
    ],
  },

  // 4-6. โครงสร้าง / อัตรากำลัง
  { id: 'organization', label: 'โครงสร้างอัตรากำลัง', icon: Users },
  { id: 'permanent_staff', label: 'อัตรากำลังลูกจ้างประจำฯ', icon: Contact },
  { id: 'temporary_staff', label: 'อัตรากำลังลูกจ้างชั่วคราว', icon: UserPlus },

  // 7-8. รักษาการ / ตำแหน่งติดเงื่อนไข
  { id: 'acting', label: 'รักษาการในตำแหน่ง', icon: ArrowLeftRight },
  { id: 'conditional_roles', label: 'จัดการตำแหน่งติดเงื่อนไข', icon: UserCheck },

 // 9. ข้อมูลการประเมิน
  {
    id: 'evaluations',
    label: 'ข้อมูลการประเมิน',
    icon: FolderCheck,
    isAccordion: true,
    subItems: [
      {
        id: 'indicators',
        label: 'ตัวชี้วัด',
        subItems: [
          { id: 'indicator_by_plan', label: 'ตามแผน' },
          { id: 'indicator_by_role', label: 'ตามตำแหน่ง' },
          { id: 'indicator_assigned_tasks', label: 'งานอื่นๆ ที่ได้รับมอบหมาย' },
        ],
      },
      { id: 'competency', label: 'สมรรถนะ' },
      { id: 'strategy', label: 'ยุทธศาสตร์' },
    ],
  },

 // 10. ออกคำสั่ง
  { id: 'orders', label: 'ออกคำสั่ง', icon: Award },

 /*   // 11. สรรหา
  {
    id: 'recruitment',
    label: 'สรรหา',
    icon: Search,
    isAccordion: true,
    subItems: [
      { id: 'recruitment_website', label: 'ตั้งค่าเว็บสรรหา' },
      { id: 'recruitment_exam_round', label: 'จัดการรอบสอบแข่งขัน' },
      { id: 'recruitment_exam_stat', label: 'สถิติสมัครสอบแข่งขัน' },
      { id: 'recruitment_exam_report', label: 'รายงานสอบแข่งขัน' },
      { id: 'recruitment_select_round', label: 'จัดการรอบคัดเลือก' },
      { id: 'recruitment_select_list', label: 'จัดการรายชื่อคัดเลือก' },
      { id: 'recruitment_select_stat', label: 'สถิติสมัครคัดเลือก' },
      { id: 'recruitment_other_round', label: 'จัดการรอบคัดเลือกอื่นๆ' },
      { id: 'recruitment_other_stat', label: 'สถิติสมัครคัดเลือกอื่นๆ' },
    ],
  },

  // 12. บรรจุ แต่งตั้ง ย้าย โอน
  {
    id: 'placement',
    label: 'บรรจุ แต่งตั้ง ย้าย โอน',
    icon: BadgeCheck,
    isAccordion: true,
    subItems: [
      { id: 'placement_pass', label: 'รายชื่อผู้สอบผ่าน' },
      { id: 'placement_transfer_req', label: 'รายการขอโอน' },
      { id: 'placement_transfer_receive', label: 'รายการรับโอน' },
      { id: 'placement_temp_duty', label: 'รายการช่วยราชการ' },
      { id: 'placement_repatriate', label: 'รายการส่งตัวกลับ' },
      { id: 'placement_promote_officer', label: 'รายการแต่งตั้ง-เลื่อน-ย้าย' },
      { id: 'placement_promote_emp', label: 'ปรับระดับชั้นงาน-ย้ายลูกจ้าง' },
      { id: 'placement_other', label: 'รายการอื่นๆ' },
      { id: 'placement_report', label: 'รายงาน' },
    ],
  },

  // 13. ทดลองปฏิบัติหน้าที่ราชการ
  { id: 'probation', label: 'ทดลองปฏิบัติหน้าที่ราชการ', icon: Hourglass },

  // 14. พ้นจากราชการ
  {
    id: 'dismissal',
    label: 'พ้นจากราชการ',
    icon: UserX,
    isAccordion: true,
    subItems: [
      { id: 'dismissal_retirement', label: 'ประกาศเกษียณ' },
      { id: 'dismissal_resign', label: 'รายการลาออก' },
      { id: 'dismissal_resign_emp', label: 'รายการลาออก (ลูกจ้าง)' },
      { id: 'dismissal_exit_interview', label: 'Exit interview' },
      { id: 'dismissal_passaway', label: 'รายการบันทึกการถึงแก่กรรม' },
      { id: 'dismissal_dismiss', label: 'รายการให้ออก' },
      { id: 'dismissal_dismiss_emp', label: 'รายการให้ออก (ลูกจ้าง)' },
      { id: 'dismissal_report', label: 'รายงาน' },
    ],
  },

  // 15. เครื่องราชฯ
  {
    id: 'insignia',
    label: 'เครื่องราชฯ',
    icon: Medal,
    isAccordion: true,
    subItems: [
      { id: 'insignia_round', label: 'รอบการเสนอขอ' },
      { id: 'insignia_manage', label: 'จัดการคำขอ' },
      { id: 'insignia_record', label: 'บันทึกผลการเสนอขอ' },
      { id: 'insignia_allocate', label: 'จัดสรรเครื่องราชฯ' },
      { id: 'insignia_borrow', label: 'ยืม-คืนเครื่องราชฯ' },
      { id: 'insignia_reclaim', label: 'เรียกคืนเครื่องราชฯ' },
      { id: 'insignia_report', label: 'รายงาน' },
    ],
  },

  // 16. การลาและลงเวลาฯ
  {
    id: 'leave',
    label: 'การลาและลงเวลาฯ',
    icon: CalendarDays,
    isAccordion: true,
    subItems: [
      { id: 'leave_work_round', label: 'รอบการปฏิบัติงาน' },
      { id: 'leave_checkin', label: 'รายการลงเวลาปฏิบัติงาน' },
      { id: 'leave_work_round_edit', label: 'แก้ไขรอบการปฎิบัติงาน' },
      { id: 'leave_work_round_edit_emp', label: 'แก้ไขรอบการปฎิบัติงาน (ลูกจ้าง)' },
      { id: 'leave_checkin_special', label: 'ลงเวลากรณีพิเศษ' },
      { id: 'leave_checkin_report', label: 'รายงานสถิติการลงเวลา' },
      { id: 'leave_list', label: 'รายการลา' },
      { id: 'leave_history', label: 'จำนวนสิทธิ์และวันลาที่ใช้ไป' },
      { id: 'leave_report', label: 'รายงานสถิติการลา' },
    ],
  },

  // 17. วินัย
  {
    id: 'discipline',
    label: 'วินัย',
    icon: Scale,
    isAccordion: true,
    subItems: [
      { id: 'discipline_complain', label: 'เรื่องร้องเรียน' },
      { id: 'discipline_investigate', label: 'สืบสวนข้อเท็จจริง' },
      { id: 'discipline_interrogate', label: 'สอบสวนความผิดทางวินัย' },
      { id: 'discipline_result', label: 'สรุปผลการพิจารณาความผิดทางวินัย' },
      { id: 'discipline_suspended', label: 'รายชื่อผู้ถูกพักราชการ' },
      { id: 'discipline_appeal', label: 'อุทธรณ์/ร้องทุกข์' },
      {
        id: 'discipline_info',
        label: 'ข้อมูลพื้นฐาน',
        subItems: [
          { id: 'discipline_info_director', label: 'กรรมการ' },
          { id: 'discipline_info_channel', label: 'ช่องทางการร้องเรียน' },
        ],
      },
      { id: 'discipline_report', label: 'รายงาน' },
    ],
  },

  // 18. ประเมินบุคคล
  {
    id: 'personnel_evaluation',
    label: 'ประเมินบุคคล',
    icon: ClipboardCheck,
    isAccordion: true,
    subItems: [
      { id: 'personnel_eval_request', label: 'คำขอประเมิน' },
      {
        id: 'personnel_eval_info',
        label: 'กรรมการและการประชุม',
        subItems: [
          { id: 'personnel_eval_committee', label: 'กรรมการ' },
          { id: 'personnel_eval_meeting', label: 'การประชุม' },
        ],
      },
    ],
  },

  // 19. เงินเดือน/ค่าจ้าง
  {
    id: 'salary',
    label: 'เงินเดือน/ค่าจ้าง',
    icon: Banknote,
    isAccordion: true,
    subItems: [
      { id: 'salary_chart_officer', label: 'ผังบัญชีเงินเดือนข้าราชการฯ' },
      { id: 'salary_chart_emp', label: 'ผังบัญชีค่าจ้างลูกจ้างประจำ' },
      { id: 'salary_round', label: 'รอบการเลื่อนเงินเดือน' },
      { id: 'salary_officer', label: 'เลื่อนเงินเดือนข้าราชการฯ' },
      { id: 'salary_emp', label: 'เลื่อนค่าจ้างลูกจ้างประจำ' },
    ],
  },

  // 20. ประเมินผลการปฏิบัติราชการระดับบุคคล
  {
    id: 'kpi',
    label: 'ประเมินผลการปฏิบัติราชการระดับบุคคล',
    icon: Target,
    isAccordion: true,
    subItems: [
      { id: 'kpi_round', label: 'รอบการประเมิน' },
      { id: 'kpi_list', label: 'รายการการประเมินผล' },
      { id: 'kpi_result', label: 'ประกาศผล' },
      { id: 'kpi_report', label: 'จัดทำประกาศผู้มีผลการปฏิบัติราชการระดับดีเด่นและดีมาก' },
    ],
  },

  // 21. พัฒนาบุคลากร
  {
    id: 'development',
    label: 'พัฒนาบุคลากร',
    icon: GraduationCap,
    isAccordion: true,
    subItems: [
      { id: 'development_project', label: 'โครงการ/หลักสูตรการฝึกอบรม' },
      { id: 'development_history_officer', label: 'ประวัติฝึกอบรม/ดูงาน ขรก.' },
      { id: 'development_history_emp', label: 'ประวัติฝึกอบรม/ดูงานลูกจ้าง' },
      { id: 'development_scholarship', label: 'ทุนการศึกษา/ฝึกอบรม' },
    ],
  },

  // 22. Dashboard
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    isAccordion: true,
    subItems: [
      { id: 'dashboard_org', label: 'โครงสร้างและกรอบอัตรากำลัง' },
      { id: 'dashboard_registry', label: 'ทะเบียนประวัติ' },
      { id: 'dashboard_compete', label: 'สรรหาสอบแข่งขัน' },
      { id: 'dashboard_qualify', label: 'สรรหาคัดเลือก' },
      { id: 'dashboard_qualify_dis', label: 'สรรหาคัดเลือกอื่นๆ' },
      { id: 'dashboard_placement', label: 'การบรรจุ แต่งตั้ง ย้าย โอน' },
      { id: 'dashboard_retire', label: 'การพ้นจากราชการ' },
      { id: 'dashboard_leave', label: 'บันทึกเวลาและการลา' },
      { id: 'dashboard_discipline', label: 'การดำเนินการทางวินัย' },
      { id: 'dashboard_salary', label: 'เงินเดือน/ค่าจ้าง' },
      { id: 'dashboard_kpi', label: 'การประเมินผลฯ ระดับบุคคล' },
      { id: 'dashboard_develop', label: 'การพัฒนาบุคลากร/ศึกษาต่อ' },
    ],
  },

  // 23. รายงาน
  {
    id: 'report',
    label: 'รายงาน',
    icon: BarChart3,
    isAccordion: true,
    subItems: [
      { id: 'report_org', label: 'โครงสร้างและกรอบอัตรากำลัง' },
      { id: 'report_registry', label: 'ทะเบียนประวัติ' },
      { id: 'report_leave', label: 'บันทึกเวลาและการลา' },
      { id: 'report_placement', label: 'การบรรจุ แต่งตั้ง ย้าย โอน' },
      { id: 'report_retire', label: 'การพ้นจากราชการ' },
      { id: 'report_discipline', label: 'การดำเนินการทางวินัย' },
      { id: 'report_develop', label: 'การพัฒนาบุคลากร/ศึกษาต่อ' },
      { id: 'report_kpi', label: 'การประเมินผลฯ ระดับบุคคล' },
      { id: 'report_insignia', label: 'เครื่องราชฯ' },
      { id: 'report_exam', label: 'สรรหา' },
      { id: 'report_evaluate', label: 'ระบบประเมินบุคคล' },
      { id: 'report_salary', label: 'ระบบเงินเดือน' },
    ],
  }, */
    // ตัวอย่าง UI (dev-only)
  { id: 'ui_kit', label: 'ตัวอย่าง UI', icon: Palette },
];

// id → ป้ายภาษาไทย (flatten ทุกระดับ) บวก id เสมือนที่ไม่อยู่ในเมนูแต่มี route ของตัวเอง
export const MENU_LABELS: Record<string, string> = (() => {
  const labels: Record<string, string> = {
    advanced_search: 'รายงานการค้นหาขั้นสูง',
    modification_requests: 'รายการขอแก้ไขข้อมูล',
  };
  menuItems.forEach((item) => {
    labels[item.id] = item.label;
    item.subItems?.forEach((sub) => {
      labels[sub.id] = sub.label;
      sub.subItems?.forEach((child) => {
        labels[child.id] = child.label;
      });
    });
  });
  return labels;
})();

// --- สร้าง path จาก id (ระบุ parent เสมอ เพราะ id submenu ซ้ำกันระหว่าง records/retired_records)
export const pathForMenu = (menuId: string) => `/${menuId}`;
export const pathForSubmenu = (menuId: string, subId: string) => `/${menuId}/${subId}`;
export const pathForNested = (menuId: string, subId: string, nestedId: string) =>
  `/${menuId}/${subId}/${nestedId}`;
