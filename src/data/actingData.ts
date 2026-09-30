import { reactive } from 'vue';
import { ORG_UNITS, type OrgUnit } from './organizationData';

// ข้อมูลจำลองหน้า "รักษาการในตำแหน่ง" — ผู้ที่อยู่ในหน่วยงาน (รายชื่อ)
// และรายชื่อผู้ปฏิบัติราชการรักษาการแทนตำแหน่ง (เรียงลำดับได้)

export interface ActingCandidate {
  id: string;
  unitId: string;
  citizenId: string;
  fullName: string;
  positionNumber: string;
  jobTitle: string;
  positionType: string;
  levelLabel: string;
  /** มาตามใบสั่งย้ายหรือไม่ (ใช้กับ checkbox แสดงทั้งหมดตามใบสั่งย้าย) */
  fromTransferOrder?: boolean;
  /** ตำแหน่งปลายทางว่างหรือไม่ (ใช้กับ checkbox แสดงตำแหน่งที่ว่าง) */
  hasVacantPosition?: boolean;
}

export interface ActingAssignment {
  id: string;
  citizenId: string;
  fullName: string;
  positionNumber: string;
  jobTitle: string;
  positionType: string;
}

const candidate = (
  id: string,
  unitId: string,
  citizenId: string,
  fullName: string,
  positionNumber: string,
  jobTitle: string,
  positionType: string,
  levelLabel: string,
  flags: Partial<Pick<ActingCandidate, 'fromTransferOrder' | 'hasVacantPosition'>> = {}
): ActingCandidate => ({
  id,
  unitId,
  citizenId,
  fullName,
  positionNumber,
  jobTitle,
  positionType,
  levelLabel,
  ...flags,
});

export const ACTING_CANDIDATES: ActingCandidate[] = [
  candidate('cand-1', '10001', '9231271275076', 'นางธาริณี สีลาชุม', 'สนง. 14', 'นักวิเคราะห์งานที่โอน', 'อำนวยการ', 'สูง', { fromTransferOrder: true, hasVacantPosition: true }),
  candidate('cand-2', '10001', '9151822402592', 'นางพรเพ็ญ อรุณรัตน์', 'สนง. 15', 'นักวิเคราะห์งานที่โอน', 'อำนวยการ', 'สูง', { fromTransferOrder: true, hasVacantPosition: true }),
  candidate('cand-3', '10001', '4726558302841', 'นายสุรชัญ พรหมมา', 'สนง. 13', 'นักบริหาร', 'อำนวยการ', 'สูง', { fromTransferOrder: true }),
  candidate('cand-4', '10002', '2790280956274', 'นายไพศาล กัทกิมกลอง', 'สนง. 12', 'พนักงานบันฉ่าง', 'ทั่วไป', 'ปฏิบัติการ', { hasVacantPosition: true }),
  candidate('cand-5', '10002', '1399858373312', 'นายสรวิช สาครสุข', 'สนคร. 20', 'นักวิเคราะห์นโยบายและแผน', 'วิชาการ', 'ชำนาญการ', {}),
  candidate('cand-6', '10021', '5953158271594', 'นางสาวเพ็ญยมลา วรลัมรบ', 'สนง. 6', 'พนักงานทะเบียน', 'ทั่วไป', 'ปฏิบัติการ', { fromTransferOrder: true, hasVacantPosition: true }),
  candidate('cand-7', '10021', '3101200456781', 'นางสาวกมลวรรณ ศรีสวัสดิ์', 'สนท. 109', 'นักวิชาการศึกษา', 'วิชาการ', 'ปฏิบัติการ', { hasVacantPosition: true }),
  candidate('cand-8', '10031', '1100700987654', 'นายปรเมศวร์ วงศ์สุวรรณ', 'สนผ. 22', 'นักจัดการงานกลุ่มพัฒนาชุมชนเมือง', 'อำนวยการ', 'ปฏิบัติการ', {}),
  candidate('cand-9', '2001', '5100501234567', 'นางจุฑาทิพย์ มั่นคง', 'ปก. 41', 'นักบริหารงานทั่วไป', 'อำนวยการ', 'ชำนาญการ', { fromTransferOrder: true }),
  candidate('cand-10', '2002', '6201809876543', 'นายอนันตชัย แสงทอง', 'กง. 08', 'นักบัญชี', 'วิชาการ', 'ปฏิบัติการ', { hasVacantPosition: true }),
  candidate('cand-11', '3001', '7302205558889', 'นายวีระชัญ คงสำราญ', 'บรน. 33', 'วิศวกร ปปง.', 'วิชาการ', 'ชำนาญการ', {}),
  candidate('cand-12', '4001', '8501102345678', 'นางสาวปุณยวีร์ เจริญชัย', 'พสช. 17', 'นักพัฒนาสังคม', 'อำนวยการ', 'ปฏิบัติการ', { fromTransferOrder: true }),
];

export const ACTING_ASSIGNMENTS = reactive<ActingAssignment[]>([
  {
    id: 'act-1',
    citizenId: '4726558302841',
    fullName: 'นายสุรชัญ พรหมมา',
    positionNumber: 'สนง. 13',
    jobTitle: 'นักบริหาร',
    positionType: 'อำนวยการ',
  },
  {
    id: 'act-2',
    citizenId: '2790280956274',
    fullName: 'นายไพศาล กัทกิมกลอง',
    positionNumber: 'สนง. 12',
    jobTitle: 'พนักงานบันฉ่าง',
    positionType: 'ทั่วไป',
  },
  {
    id: 'act-3',
    citizenId: '1399858373312',
    fullName: 'นายสรวิช สาครสุข',
    positionNumber: 'สนคร. 20',
    jobTitle: 'นักวิเคราะห์นโยบายและแผน',
    positionType: 'วิชาการ',
  },
  {
    id: 'act-4',
    citizenId: '5953158271594',
    fullName: 'นางสาวเพ็ญยมลา วรลัมรบ',
    positionNumber: 'สนง. 6',
    jobTitle: 'พนักงานทะเบียน',
    positionType: 'ทั่วไป',
  },
]);

// --- ตำแหน่งและผู้ถือครอง (โหนดใบของ tree หน้ารักษาการในตำแหน่ง)
export interface ActingUnitPosition {
  id: string;
  unitId: string;
  positionNumber: string;
  holderName: string;
}

export const ACTING_UNIT_POSITIONS: ActingUnitPosition[] = [
  { id: 'apos-1', unitId: '10001', positionNumber: 'สน. 1', holderName: 'นายเกียรติศักดิ์ สื่อวัฒนา' },
  { id: 'apos-2', unitId: '10001', positionNumber: 'สน. 2', holderName: 'นางสาวปาณิสรา จันทร์โสม' },
  { id: 'apos-3', unitId: '10002', positionNumber: 'สน.ทส. 4', holderName: 'นายวีรยุทธ โชติกเศรษฐ์' },
  { id: 'apos-4', unitId: '10021', positionNumber: 'สน.วพ. 16', holderName: 'นางสาวนิ่มวา อารีรักษ์' },
  { id: 'apos-5', unitId: '10022', positionNumber: 'สน.พศ. 7', holderName: 'นายสมชาย พูลสวัสดิ์' },
  { id: 'apos-6', unitId: '10031', positionNumber: 'สน.ผส. 9', holderName: 'นางกมลชนก ทองอยู่' },
  { id: 'apos-7', unitId: '10032', positionNumber: 'สน.ผส. 12', holderName: 'นายธนกร ศรีสุข' },
  { id: 'apos-8', unitId: '2001', positionNumber: 'ปก. 3', holderName: 'นางสาวชลิตา วัฒนกิจ' },
  { id: 'apos-9', unitId: '2002', positionNumber: 'กง. 5', holderName: 'นายพีรพัฒน์ เงินงาม' },
  { id: 'apos-10', unitId: '3001', positionNumber: 'บรน. 21', holderName: 'นายอธิป น้ำใส' },
  { id: 'apos-11', unitId: '3002', positionNumber: 'พรน. 8', holderName: 'นางปิยะรัตน์ แสงสุวรรณ' },
  { id: 'apos-12', unitId: '4001', positionNumber: 'พสช. 11', holderName: 'นางสาวณัฐกานต์ บุญมา' },
  { id: 'apos-13', unitId: '4002', positionNumber: 'สสก. 4', holderName: 'นายจิรายุ ประเสริฐ' },
];

export interface ActingTreeNode {
  id: string;
  label: string;
  desc?: string;
  /** โหนดตำแหน่ง (ใบ) — แสดง "เลขตำแหน่ง (ชื่อผู้ถือครอง)" */
  isPosition?: boolean;
  unitId: string;
  children?: ActingTreeNode[];
}

// สร้างต้นไม้: ทุกหน่วยงานที่ไม่มีหน่วยลูก จะมีโหนดตำแหน่งผู้ถือครองเป็นใบ
export const buildActingTree = (): ActingTreeNode[] => {
  const positionsByUnit = new Map<string, ActingUnitPosition[]>();
  ACTING_UNIT_POSITIONS.forEach((p) => {
    const list = positionsByUnit.get(p.unitId) ?? [];
    list.push(p);
    positionsByUnit.set(p.unitId, list);
  });

  const toNode = (unit: OrgUnit): ActingTreeNode => {
    const children = unit.children?.map(toNode);
    const positions = positionsByUnit.get(unit.id)?.map((p) => ({
      id: p.id,
      label: `${p.positionNumber} (${p.holderName})`,
      isPosition: true,
      unitId: unit.id,
    }));
    const leafChildren = children?.length ? children : positions;
    return {
      id: unit.id,
      label: unit.name,
      desc: unit.quotaText,
      unitId: unit.id,
      children: leafChildren,
    };
  };

  return ORG_UNITS.map(toNode);
};
