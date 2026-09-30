import { reactive } from 'vue';

export type IndicatorType = 'plan' | 'position' | 'assigned';

export interface IndicatorRow {
  id: string;
  type: IndicatorType;
  /** รหัสตัวชี้วัด เช่น HR-KPI-01 */
  code: string;
  /** ลำดับ/หัวข้อตัวชี้วัด */
  title: string;
  /** หน่วยงานเจ้าของตัวชี้วัด (อ้างอิง id ระดับบนสุดของ ORG_UNITS) */
  unitId: string;
  /** ปีงบประมาณ (พ.ศ.) */
  fiscalYear: number;
  /** รอบการประเมิน */
  round: string;
  /** กลุ่มแหน่ง (เฉพาะตัวชี้วัดตำแหน่ง) */
  positionGroup?: string;
  /** ข้อมูลจากฟอร์มเพิ่มตัวชี้วัด */
  prefix?: string;
  measureUnit?: string;
  weight?: string;
  definition?: string;
  formula?: string;
  evidence?: string;
  /** คำอธิบายระดับคะแนน เรียงจากมากไปน้อย */
  levels?: string[];
}

export const INDICATOR_POSITION_GROUPS = ['ทั้งหมด', 'บริหาร', 'วิชาการ', 'ชำนาญการ', 'ทั่วไป'];

export const INDICATOR_TYPE_LABELS: Record<IndicatorType, string> = {
  plan: 'ตัวชี้วัดตามแผน',
  position: 'ตัวชี้วัดตำแหน่ง',
  assigned: 'ตัวชี้วัดงานอื่นๆ ที่ได้รับมอบหมาย',
};

export const INDICATOR_FISCAL_YEARS = [2569, 2568, 2567];

export const INDICATOR_ROUNDS = ['ทั้งหมด', 'ไตรมาส 1', 'ไตรมาส 2', 'ไตรมาส 3', 'ไตรมาส 4'];

export const INDICATORS = reactive<IndicatorRow[]>([
  { id: 'ind-1', type: 'plan', code: 'HR-KPI-01', title: '1', unitId: '1000', fiscalYear: 2569, round: 'ทั้งหมด' },
  { id: 'ind-2', type: 'position', code: '1', title: 'KPI นักวิชาการเพื่อแบบบูชิ', unitId: '1000', fiscalYear: 2569, round: 'ทั้งหมด', positionGroup: 'วิชาการ' },
  { id: 'ind-3', type: 'assigned', code: 'KPI-01', title: 'การพัฒนาตนเอง', unitId: '1000', fiscalYear: 2569, round: 'ทั้งหมด' },
]);
