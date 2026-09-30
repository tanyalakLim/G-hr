import { reactive } from 'vue';

export interface OrgUnit {
  id: string;
  name: string;
  code: string;
  /** อักษรย่อหน่วยงาน เช่น สกบ., ก.สร. */
  shortName?: string;
  quotaText: string;
  count?: number;
  children?: OrgUnit[];
}

export interface OrgPosition {
  id: string;
  unitId: string;
  orderNumber: number;
  positionNumber: string;
  jobTitle: string;
  positionType: string;
  levelLabel: string;
  levelShort?: string;
  lineOfWork: string;
  adminPosition: string;
  academicPosition: string;
  isKeyPosition?: boolean;
  holderPersonId?: string;
}

export const ORG_UNITS: OrgUnit[] = [
  {
    id: '1000',
    name: 'สำนักงานบริหารราชการ',
    code: '1000',
    shortName: 'สกบ.',
    quotaText: '1000 อัตรา',
    count: 145,
    children: [
      {
        id: '1001',
        name: 'กองสารบรรณ',
        code: '1001',
        shortName: 'ก.สร.',
        quotaText: '1001 · 1 กลุ่ม',
        count: 62,
        children: [
          { id: '10001', name: 'แผนงานบริหาร', code: '10001', shortName: 'ผ.จ้.', quotaText: '10001 · 6 ตำแหน่ง' },
          { id: '10002', name: 'การสนเทศโลจิสติกส์', code: '10002', shortName: 'ผ.ทส.', quotaText: '10002 · 3 ตำแหน่ง' },
        ],
      },
      {
        id: '1002',
        name: 'สำนักการเงินหน่วยที่ (สถง.)',
        code: '1002',
        shortName: 'ก.งบ.',
        quotaText: '1002 · 1 กลุ่ม',
        count: 48,
        children: [
          { id: '10021', name: 'แผนวิชาและพัฒนา', code: '10021', shortName: 'ผ.วพ.', quotaText: '10021 · 4 ตำแหน่ง' },
          { id: '10022', name: 'แผนพัศดุ', code: '10022', shortName: 'ผ.พศ.', quotaText: '10022 · 2 ตำแหน่ง' },
        ],
      },
      {
        id: '1003',
        name: 'กองแผนงานและสารสนเทศ',
        code: '1003',
        shortName: 'ก.ผส.',
        quotaText: '1003 · 6 กลุ่ม',
        count: 35,
        children: [
          { id: '10031', name: 'กลุ่มพัฒนาชุมชนเมือง', code: '10031', shortName: 'กพช.', quotaText: '10031 · 5 ตำแหน่ง' },
          { id: '10032', name: 'กลุ่มส่งเสริมสังคมท้องถิ่น', code: '10032', shortName: 'กสท.', quotaText: '10032 · 4 ตำแหน่ง' },
        ],
      },
    ],
  },
  {
    id: '2000',
    name: 'สำนักปลัดกรุงเทพมหานคร',
    code: '2000',
    shortName: 'สปก.',
    quotaText: '2000 อัตรา',
    count: 168,
    children: [
      { id: '2001', name: 'กองบริหารงานทั่วไป', code: '2001', shortName: 'กท่.', quotaText: '2001 · 4 กลุ่ม', count: 78 },
      { id: '2002', name: 'กองการเงินและบัญชี', code: '2002', shortName: 'กง.', quotaText: '2002 · 3 กลุ่ม', count: 90 },
    ],
  },
  {
    id: '3000',
    name: 'สำนักการระบายน้ำ',
    code: '3000',
    shortName: 'สคส.',
    quotaText: '3000 อัตรา',
    count: 152,
    children: [
      { id: '3001', name: 'กองบำรุงรักษาระบบระบายน้ำ', code: '3001', shortName: 'บรน.', quotaText: '3001 · 2 กลุ่ม', count: 84 },
      { id: '3002', name: 'กองพัฒนาระบบระบายน้ำ', code: '3002', shortName: 'พรน.', quotaText: '3002 · 2 กลุ่ม', count: 68 },
    ],
  },
  {
    id: '4000',
    name: 'สำนักสวัสดิการและสังคมชุมชน',
    code: '4000',
    shortName: 'สสส.',
    quotaText: '4000 อัตรา',
    count: 110,
    children: [
      { id: '4001', name: 'กองพัฒนาสังคมชุมชน', code: '4001', shortName: 'พสช.', quotaText: '4001 · 3 กลุ่ม', count: 58 },
      { id: '4002', name: 'กองส่งเสริมและสวัสดิการสังคม', code: '4002', shortName: 'สสก.', quotaText: '4002 · 2 กลุ่ม', count: 52 },
    ],
  },
  {
    id: '5000',
    name: 'สำนักการสาธารณสุข',
    code: '5000',
    shortName: 'สสส.',
    quotaText: '5000 อัตรา',
    count: 110,
    children: [
      { id: '5001', name: 'กองควบคุมโรค', code: '5001', shortName: 'กคร.', quotaText: '5001 · 3 กลุ่ม', count: 62 },
      { id: '5002', name: 'กองทันตสาธารณสุข', code: '5002', shortName: 'ทสส.', quotaText: '5002 · 2 กลุ่ม', count: 48 },
    ],
  },
];

// ตำแหน่งในโครงสร้าง — ผู้ครองตำแหน่งอ้างอิง id จาก personnelData (INITIAL_PERSONNEL)
// ใช้ reactive เพราะหน้าจอแก้ไข holderPersonId/unitId/orderNumber ของแถวโดยตรง
export const ORG_POSITIONS = reactive<OrgPosition[]>([
  {
    id: 'pos-1',
    unitId: '10001',
    orderNumber: 1,
    positionNumber: 'สนบ. 399',
    jobTitle: 'ผู้อำนวยการสำนัก',
    positionType: 'บริหาร',
    levelLabel: 'หัวหน้า',
    lineOfWork: 'สายงานบริหารและแผนงาน',
    adminPosition: '-',
    academicPosition: 'ว่าง',
    isKeyPosition: true,
    holderPersonId: 'per-3',
  },
  {
    id: 'pos-2',
    unitId: '10001',
    orderNumber: 2,
    positionNumber: 'สนศ. 598',
    jobTitle: 'รองผู้อำนวยการสำนัก',
    positionType: 'บริหาร',
    levelLabel: 'ชำนาญการพิเศษ',
    levelShort: 'ช.',
    lineOfWork: 'สายงานการศึกษาและพัฒนาเยาวชน',
    adminPosition: '-',
    academicPosition: '-',
    isKeyPosition: true,
  },
  {
    id: 'pos-3',
    unitId: '10001',
    orderNumber: 3,
    positionNumber: 'สนม. 96',
    jobTitle: 'รองผู้อำนวยการสำนัก',
    positionType: 'บริหาร',
    levelLabel: 'ชำนาญการพิเศษ',
    levelShort: 'ช.',
    lineOfWork: 'สายงานการบริหารงานบุคคล',
    adminPosition: 'รองผู้อำนวยการสำนัก',
    academicPosition: '-',
    isKeyPosition: true,
    holderPersonId: 'per-1',
  },
  {
    id: 'pos-4',
    unitId: '10002',
    orderNumber: 4,
    positionNumber: 'สนบ. 200',
    jobTitle: 'รองผู้อำนวยการสำนัก',
    positionType: 'บริหาร',
    levelLabel: 'ชำนาญการ',
    levelShort: 'ช.',
    lineOfWork: 'สายงานบริหารและยุทธศาสตร์',
    adminPosition: '-',
    academicPosition: '-',
    isKeyPosition: true,
    holderPersonId: 'per-2',
  },
  {
    id: 'pos-5',
    unitId: '10001',
    orderNumber: 5,
    positionNumber: 'สนท. 108',
    jobTitle: 'นักจัดการงานทั่วไป',
    positionType: 'ทั่วไป',
    levelLabel: 'ปฏิบัติการ',
    lineOfWork: 'สายงานการบริหารงานทั่วไป',
    adminPosition: '-',
    academicPosition: '-',
  },
  {
    id: 'pos-6',
    unitId: '10021',
    orderNumber: 6,
    positionNumber: 'สนท. 109',
    jobTitle: 'นักวิชาการศึกษา',
    positionType: 'วิชาการ',
    levelLabel: 'ปฏิบัติการ',
    lineOfWork: 'สายงานการศึกษาและพัฒนาเยาวชน',
    adminPosition: '-',
    academicPosition: 'นักวิชาการศึกษา',
  },
]);
