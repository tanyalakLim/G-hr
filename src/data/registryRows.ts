import { ref } from 'vue';

export interface RegistryRow {
  positionNumber: string;
  editStatus: string;
  citizenId: string;
  fullName: string;
  jobTitle: string;
  positionType: string;
  level: string;
  department: string;
}

// ใช้ร่วมระหว่างหน้ารายการและหน้ารายละเอียด (detail route ค้นหาด้วย citizenId)
// Mock data ตามหน้าจอ (88 รายการทั้งหมดในระบบจริง — จำลอง 10 รายการแรก)
export const registryRows = ref<RegistryRow[]>([
  { positionNumber: 'สนบ. 1', citizenId: '1164945325631',
    editStatus: 'ยังไม่ได้แก้ไข', fullName: 'นายวิชาย เจริญสุข', jobTitle: 'กัดฝ่ายช่าง', positionType: 'วิชาการ', level: 'ทรงคุณวุฒิ', department: 'สำนักการระบายน้ำ' },
  { positionNumber: 'สนบ. 2', citizenId: '2554052333235',
    editStatus: 'แก้ไขแล้ว', fullName: 'นางจิราภาณ โพธิ์ศรี', jobTitle: 'ผู้อำนวยการสำนัก', positionType: 'บริหาร', level: 'ต้น', department: 'สำนักการระบายน้ำ' },
  { positionNumber: 'สนบ. 3', citizenId: '7727955402112',
    editStatus: 'ยังไม่ได้แก้ไข', fullName: 'นางพิมพ์พรรณ วังครเว่า', jobTitle: 'รองผู้อำนวยการสำนัก', positionType: 'บริหาร', level: 'สูง', department: 'สำนักการระบายน้ำ' },
  { positionNumber: 'สนบ. 4', citizenId: '6069175478756',
    editStatus: 'ยังไม่ได้แก้ไข', fullName: 'นางสาวมุกดาพร สีจันทร์', jobTitle: 'รองผู้อำนวยการสำนัก', positionType: 'บริหาร', level: 'สูง', department: 'สำนักการระบายน้ำ' },
  { positionNumber: 'สนบ. 5', citizenId: '1243078540118',
    editStatus: 'แก้ไขแล้ว', fullName: 'นายธรรมรพล สีจันทร์', jobTitle: 'กัดฝ่ายช่าง', positionType: 'วิชาการ', level: 'ปฏิบัติการ', department: 'สำนักการระบายน้ำ' },
  { positionNumber: 'ก.ลก. 6', citizenId: '5329676461391',
    editStatus: 'ยังไม่ได้แก้ไข', fullName: 'นางสนหญิง สุนทายน', jobTitle: 'นักวิจัตการงานทั่วไป', positionType: 'อำนวยการ', level: 'สูง', department: 'กองโยธราและระดาเลือด สำนักการระบายน้ำ' },
  { positionNumber: 'ก.ลก. 7', citizenId: '6568540384439',
    editStatus: 'ยังไม่ได้แก้ไข', fullName: 'นายสุธรรมน อินทรวรรณ', jobTitle: 'นักบริหาร', positionType: 'อำนวยการ', level: 'ต้น', department: 'กองโยธราและระดาเลือด สำนักการระบายน้ำ' },
  { positionNumber: 'ก.ลก. 8', citizenId: '6489091531954',
    editStatus: 'ยังไม่ได้แก้ไข', fullName: 'นายวรรณธนา อยู่สมาย', jobTitle: 'นักบริหาร', positionType: 'อำนวยการ', level: 'ต้น', department: 'กองโยธราและระดาเลือด สำนักการระบายน้ำ' },
  { positionNumber: 'พ.ทน. 9', citizenId: '9241713455953',
    editStatus: 'ยังไม่ได้แก้ไข', fullName: 'นางบันทักขา จันทเกตุ', jobTitle: 'นักวิชาการสิ่งแวดล้อม', positionType: 'วิชาการ', level: 'เชี่ยวชาญ', department: 'ฝ่ายชีวภาพและประเมินผล กองโยธราและระดาเลือด สำนักการระบายน้ำ' },
  { positionNumber: 'พ.ทน. 10', citizenId: '9914323633870',
    editStatus: 'ยังไม่ได้แก้ไข', fullName: 'นางกดุทิตา เลอมณฑุ', jobTitle: 'นักวิชาการชั่วและบัญชี', positionType: 'วิชาการ', level: 'อำนาจภูมิรพีเยช', department: 'ฝ่ายชีวภาพและประเมินผล กองโยธราและระดาเลือด สำนักการระบายน้ำ' },
]);
