import { reactive } from 'vue';

// ข้อมูลจำลอง "อัตรากำลังลูกจ้างชั่วคราว" — ใช้โครงสร้างหน่วยงานร่วมกับ
// โครงสร้างอัตรากำลัง (ORG_UNITS) แต่มีชุดอัตราของลูกจ้างชั่วคราวแยกต่างหาก
// ผู้ปฏิบัติงานเก็บเป็นชื่อ (holderName) ไม่อ้างอิงทะเบียนบุคคล เพราะเป็นแบบรายงานภาพรวม
// ใช้ reactive เพราะหน้าจอแก้ไข unitId/orderNumber ของแถวโดยตรง

export interface TemporaryStaffPosition {
  id: string;
  unitId: string;
  orderNumber: number;
  /** เลขที่อัตรา (ใช้ภายใน เช่น ตอนย้ายตำแหน่ง) */
  positionNumber: string;
  jobTitle: string;
  /** กลุ่มงาน/สายงานที่สังกัด */
  jobGroup: string;
  /** ผู้ปฏิบัติงาน (ชื่อจากภายนอกทะเบียนบุคคล) */
  holderName?: string;
  /** สายงาน */
  lineOfWork?: string;
  /** ค่าจ้าง */
  wage?: string;
  /** เงินเพิ่มการครองชีพชั่วคราว */
  extraLivingAllowance?: string;
  /** เงินช่วยเหลือการครองชีพชั่วคราว */
  livingAssistance?: string;
  /** เงินสมทบประกันสังคม (ลูกจ้าง) */
  ssoEmployee?: string;
  /** เงินสมทบประกันสังคม (นายจ้าง) */
  ssoEmployer?: string;
  // --- ข้อมูลส่วนตัวผู้ปฏิบัติงาน (จำลอง)
  citizenId?: string;
  gender?: 'male' | 'female';
  birthDate?: string;
  exactAge?: string;
  appointedDate?: string;
}

export const TEMP_STAFF_POSITIONS = reactive<TemporaryStaffPosition[]>([
  {
    id: 'temp-staff-1',
    unitId: '10001',
    orderNumber: 1,
    positionNumber: 'ชค. 1',
    jobTitle: 'พนักงานรักษาความปลอดภัย',
    jobGroup: 'บริการพื้นฐาน',
    holderName: 'นายอุทุเรียง ทองใบ',
    lineOfWork: 'งานบริการ',
    wage: '12,500 บาท',
    extraLivingAllowance: '-',
    livingAssistance: '-',
    ssoEmployee: '750 บาท',
    ssoEmployer: '1,500 บาท',
    citizenId: '3-1007-00123-45-6',
    gender: 'male',
    birthDate: '12 มี.ค. 2530',
    exactAge: '39 ปี',
    appointedDate: '1 ต.ค. 2562',
  },
  {
    id: 'temp-staff-2',
    unitId: '10001',
    orderNumber: 2,
    positionNumber: 'ชค. 2',
    jobTitle: 'พนักงานสถานที่',
    jobGroup: 'บริการพื้นฐาน',
    holderName: 'นายธรรศพล คำแสน',
    lineOfWork: 'งานบริการ',
    wage: '11,500 บาท',
    extraLivingAllowance: '-',
    livingAssistance: '-',
    ssoEmployee: '690 บาท',
    ssoEmployer: '1,380 บาท',
    citizenId: '5-2101-00234-56-7',
    gender: 'male',
    birthDate: '8 ก.ค. 2532',
    exactAge: '37 ปี',
    appointedDate: '16 ก.ย. 2564',
  },
  {
    id: 'temp-staff-3',
    unitId: '10001',
    orderNumber: 3,
    positionNumber: 'ชค. 3',
    jobTitle: 'พนักงานขับรถฟิค',
    jobGroup: 'บริการพื้นฐาน',
    holderName: 'นายเอกชัย อ่องฉิ้ง',
    lineOfWork: 'งานขับรถ',
    wage: '12,000 บาท',
    extraLivingAllowance: '-',
    livingAssistance: '-',
    ssoEmployee: '720 บาท',
    ssoEmployer: '1,440 บาท',
    citizenId: '1-1014-00987-65-4',
    gender: 'male',
    birthDate: '25 ม.ค. 2535',
    exactAge: '34 ปี',
    appointedDate: '3 ก.พ. 2566',
  },
  {
    id: 'temp-staff-4',
    unitId: '10021',
    orderNumber: 4,
    positionNumber: 'ชค. 4',
    jobTitle: 'พนักงานสวนและภูมิทัศน์',
    jobGroup: 'บริการพื้นฐาน',
  },
]);
