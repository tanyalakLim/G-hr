import { reactive } from 'vue';

// ข้อมูลจำลองหน้า "จัดการตำแหน่งติดเงื่อนไข" — ตำแหน่งในสายงานรายหน่วยงาน
// พร้อมรายละเอียดตำแหน่งย่อย และสถานะ "ตำแหน่งติดเงื่อนไข" + หมายเหตุ (แก้ไขผ่าน modal)

export interface ConditionalPositionDetail {
  id: string;
  order: number;
  jobTitle: string;
  division: string;
  positionType: string;
  levelLabel: string;
  adminPosition: string;
  adminField: string;
  line: string;
}

export interface ConditionalPosition {
  id: string;
  unitId: string;
  order: number;
  positionNumber: string;
  jobTitle: string;
  positionType: string;
  levelLabel: string;
  isConditional: boolean;
  note: string;
  details: ConditionalPositionDetail[];
}

const detail = (
  id: string,
  order: number,
  jobTitle: string,
  division: string,
  positionType: string,
  levelLabel: string,
  adminPosition = '-',
  adminField = '-',
  line = '-'
): ConditionalPositionDetail => ({ id, order, jobTitle, division, positionType, levelLabel, adminPosition, adminField, line });

export const CONDITIONAL_POSITIONS = reactive<ConditionalPosition[]>([
  {
    id: 'pos-1',
    unitId: '1000',
    order: 1,
    positionNumber: 'ลน.งบ. 8',
    jobTitle: 'พนักงานภายนอก',
    positionType: 'วิชาการ',
    levelLabel: 'ปฏิบัติการ',
    isConditional: true,
    note: '',
    details: [
      detail('pos-1-d1', 1, 'พนักงานภายนอก', 'วิชาการ', 'วิชาการ', 'ปฏิบัติการ'),
    ],
  },
  {
    id: 'pos-2',
    unitId: '1000',
    order: 2,
    positionNumber: 'ลน.งบ. 10',
    jobTitle: 'พนักงานภายนอก',
    positionType: 'วิชาการ',
    levelLabel: 'ปฏิบัติการ',
    isConditional: true,
    note: '',
    details: [
      detail('pos-2-d1', 1, 'พนักงานภายนอก', 'วิชาการ', 'วิชาการ', 'ปฏิบัติการ'),
    ],
  },
  {
    id: 'pos-3',
    unitId: '1000',
    order: 3,
    positionNumber: 'ลน.งบ. 15',
    jobTitle: 'นักจัดการงานทั่วไป',
    positionType: 'อำนวยการ',
    levelLabel: 'ปฏิบัติการ',
    isConditional: true,
    note: 'เช่นตัวรับราชการฝ่าย',
    details: [
      detail('pos-3-d1', 1, 'นักจัดการงานทั่วไป', 'อำนวยการ', 'อำนวยการ', 'ชำนาญการ'),
    ],
  },
  {
    id: 'pos-4',
    unitId: '1000',
    order: 4,
    positionNumber: 'ลน.คณุ. 34',
    jobTitle: 'เจ้าพนักงานการคลัง',
    positionType: 'วิชาการ',
    levelLabel: 'ปฏิบัติการ',
    isConditional: true,
    note: '',
    details: [
      detail('pos-4-d1', 1, 'เจ้าพนักงานการคลัง', 'วิชาการ', 'วิชาการ', 'ปฏิบัติการ'),
    ],
  },
  {
    id: 'pos-5',
    unitId: '1001',
    order: 1,
    positionNumber: 'ลน.งบ. 21',
    jobTitle: 'นักวิเคราะห์นโยบายและแผน',
    positionType: 'วิชาการ',
    levelLabel: 'ชำนาญการ',
    isConditional: false,
    note: '',
    details: [
      detail('pos-5-d1', 1, 'นักวิเคราะห์นโยบายและแผน', 'วิชาการ', 'วิชาการ', 'ชำนาญการ'),
    ],
  },
  {
    id: 'pos-6',
    unitId: '1001',
    order: 2,
    positionNumber: 'ลน.งบ. 22',
    jobTitle: 'นักบริหารงานทั่วไป',
    positionType: 'อำนวยการ',
    levelLabel: 'ปฏิบัติการ',
    isConditional: true,
    note: 'ระหว่างรอผู้ดำรงตำแหน่งเดิมกลับ',
    details: [
      detail('pos-6-d1', 1, 'นักบริหารงานทั่วไป', 'อำนวยการ', 'อำนวยการ', 'ปฏิบัติการ'),
    ],
  },
  {
    id: 'pos-7',
    unitId: '1002',
    order: 1,
    positionNumber: 'ลน.งบ. 31',
    jobTitle: 'พนักงานทะเบียน',
    positionType: 'ทั่วไป',
    levelLabel: 'ปฏิบัติการ',
    isConditional: false,
    note: '',
    details: [
      detail('pos-7-d1', 1, 'พนักงานทะเบียน', 'ทั่วไป', 'ทั่วไป', 'ปฏิบัติการ'),
    ],
  },
  {
    id: 'pos-8',
    unitId: '2001',
    order: 1,
    positionNumber: 'ปก. 41',
    jobTitle: 'นักบริหารงานทั่วไป',
    positionType: 'อำนวยการ',
    levelLabel: 'ชำนาญการ',
    isConditional: true,
    note: '',
    details: [
      detail('pos-8-d1', 1, 'นักบริหารงานทั่วไป', 'อำนวยการ', 'อำนวยการ', 'ชำนาญการ'),
    ],
  },
  {
    id: 'pos-9',
    unitId: '3001',
    order: 1,
    positionNumber: 'บรน. 33',
    jobTitle: 'วิศวกร',
    positionType: 'วิชาการ',
    levelLabel: 'ชำนาญการ',
    isConditional: false,
    note: '',
    details: [
      detail('pos-9-d1', 1, 'วิศวกร', 'วิชาการ', 'วิชาการ', 'ชำนาญการ'),
    ],
  },
]);
