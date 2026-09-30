import { reactive } from 'vue';

// ข้อมูลจำลอง "อัตรากำลังลูกจ้างประจำฯ" — ใช้โครงสร้างหน่วยงานร่วมกับ
// โครงสร้างอัตรากำลัง (ORG_UNITS) แต่มีชุดอัตราของลูกจ้างประจำแยกต่างหาก
// ใช้ reactive เพราะหน้าจอแก้ไข holderPersonId/orderNumber ของแถวโดยตรง

export interface EmployeeStaffPosition {
  id: string;
  unitId: string;
  orderNumber: number;
  /** เลขที่อัตรา เช่น ลจ. 12 */
  positionNumber: string;
  jobTitle: string;
  /** กลุ่มงาน/สายงานที่สังกัด */
  jobGroup: string;
  /** ระดับชั้นงาน เช่น ลจ. 1 */
  levelLabel: string;
  levelShort?: string;
  holderPersonId?: string;
}

export const EMPLOYEE_STAFF_POSITIONS = reactive<EmployeeStaffPosition[]>([
  {
    id: 'emp-staff-1',
    unitId: '10001',
    orderNumber: 1,
    positionNumber: 'ลจ. 3',
    jobTitle: 'ช่างงานทั่วไป',
    jobGroup: 'ช่าง',
    levelLabel: 'ลจ. 1/หัวหน้าช่าง',
    levelShort: 'ลจ. 1',
    holderPersonId: 'per-1',
  },
  {
    id: 'emp-staff-2',
    unitId: '10001',
    orderNumber: 2,
    positionNumber: 'ลจ. 4',
    jobTitle: 'พนักงานธุรการ',
    jobGroup: 'ทั่วไป',
    levelLabel: 'ลจ. 1',
    levelShort: 'ลจ. 1',
  },
  {
    id: 'emp-staff-3',
    unitId: '10001',
    orderNumber: 3,
    positionNumber: 'ลจ. 5',
    jobTitle: 'พนักงานพิมพ์ดีด',
    jobGroup: 'ทั่วไป',
    levelLabel: 'ลจ. 2',
    levelShort: 'ลจ. 2',
    holderPersonId: 'per-2',
  },
  {
    id: 'emp-staff-4',
    unitId: '10002',
    orderNumber: 4,
    positionNumber: 'ลจ. 11',
    jobTitle: 'ช่างไฟฟ้า',
    jobGroup: 'ช่าง',
    levelLabel: 'ลจ. 2',
    levelShort: 'ลจ. 2',
    holderPersonId: 'per-3',
  },
  {
    id: 'emp-staff-5',
    unitId: '10002',
    orderNumber: 5,
    positionNumber: 'ลจ. 12',
    jobTitle: 'พนักงานขับรถยนต์',
    jobGroup: 'ขับรถ',
    levelLabel: 'ลจ. 1',
    levelShort: 'ลจ. 1',
  },
  {
    id: 'emp-staff-6',
    unitId: '10021',
    orderNumber: 6,
    positionNumber: 'ลจ. 20',
    jobTitle: 'พนักงานทั่วไป',
    jobGroup: 'ทั่วไป',
    levelLabel: 'ลจ. 1',
    levelShort: 'ลจ. 1',
    holderPersonId: 'per-1',
  },
  {
    id: 'emp-staff-7',
    unitId: '10021',
    orderNumber: 7,
    positionNumber: 'ลจ. 21',
    jobTitle: 'ช่างสุขาภิบาล',
    jobGroup: 'ช่าง',
    levelLabel: 'ลจ. 2',
    levelShort: 'ลจ. 2',
  },
  {
    id: 'emp-staff-8',
    unitId: '2001',
    orderNumber: 8,
    positionNumber: 'ลจ. 31',
    jobTitle: 'พนักงานทั่วไป',
    jobGroup: 'ทั่วไป',
    levelLabel: 'ลจ. 1',
    levelShort: 'ลจ. 1',
    holderPersonId: 'per-2',
  },
  {
    id: 'emp-staff-9',
    unitId: '2001',
    orderNumber: 9,
    positionNumber: 'ลจ. 32',
    jobTitle: 'ช่างเครื่อง',
    jobGroup: 'ช่าง',
    levelLabel: 'ลจ. 3',
    levelShort: 'ลจ. 3',
  },
  {
    id: 'emp-staff-10',
    unitId: '3001',
    orderNumber: 10,
    positionNumber: 'ลจ. 45',
    jobTitle: 'ช่างประปา',
    jobGroup: 'ช่าง',
    levelLabel: 'ลจ. 2',
    levelShort: 'ลจ. 2',
    holderPersonId: 'per-3',
  },
  {
    id: 'emp-staff-11',
    unitId: '4001',
    orderNumber: 11,
    positionNumber: 'ลจ. 52',
    jobTitle: 'พนักงานช่วยเหลือคนพิการ',
    jobGroup: 'สังคม',
    levelLabel: 'ลจ. 1',
    levelShort: 'ลจ. 1',
  },
  {
    id: 'emp-staff-12',
    unitId: '5001',
    orderNumber: 12,
    positionNumber: 'ลจ. 60',
    jobTitle: 'พนักงานช่วยพยาบาล',
    jobGroup: 'สาธารณสุข',
    levelLabel: 'ลจ. 2',
    levelShort: 'ลจ. 2',
    holderPersonId: 'per-1',
  },
]);
