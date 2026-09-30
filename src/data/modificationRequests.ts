import { ref } from 'vue';

export interface RequestRow {
  id: string;
  requestNumber: string;
  submittedAt: string;
  personName: string;
  title: string;
  detail: string;
  status: 'pending' | 'approved' | 'rejected';
  remark?: string;
  photoUrl?: string;
}

// ใช้ร่วมระหว่างหน้ารายการและหน้ารายละเอียด (detail route ค้นหาด้วย id)
export const modificationRequests = ref<RequestRow[]>([
  {
    id: 'req-1',
    requestNumber: 'MOD-2569-001',
    submittedAt: '22 ก.ย. 2569 10:04 น.',
    personName: 'นางจิดาภา พุ่มรัตน์',
    title: 'ขอแก้ไขประวัติประจำตัว',
    detail: 'เนื่องจากได้การรายงานพิธีด้วยตนเอง ต้องการแก้ไขบันทึกปฏิบัติงาน',
    status: 'pending',
  },
  {
    id: 'req-2',
    requestNumber: 'MOD-2569-002',
    submittedAt: '19 ก.ย. 2569 14:37 น.',
    personName: 'นายสัจจวัตร สัจจวัตร',
    title: 'ขอแก้ไขข้อมูลส่วนตัว',
    detail: 'แก้ไขคำนำหน้าชื่อและวันเดือนปีเกิดให้ตรงตามบัตรประชาชน',
    status: 'approved',
    remark: 'ตรวจสอบเอกสารแล้ว',
  },
  {
    id: 'req-3',
    requestNumber: 'MOD-2569-003',
    submittedAt: '15 ก.ย. 2569 09:12 น.',
    personName: 'นางสาวอรพินท์ ทองใบ',
    title: 'ขอแก้ไขประวัติการศึกษา',
    detail: 'เพิ่มวุฒิการศึกษาระดับปริญญาโท สาขาการจัดการงบประมาณ',
    status: 'pending',
  },
]);
