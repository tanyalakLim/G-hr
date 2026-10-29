// ข้อมูลผู้สมัครสอบแข่งขันจำลอง (18 รายการ: ผ่าน 17 / ไม่ผ่าน 1)
// ใช้ร่วมกันระหว่างหน้า รายละเอียดรอบสอบแข่งขัน และหน้า รายละเอียดผู้สมัครสอบ

export interface ExamApplicant {
  examNo: string;
  citizenId: string;
  fullName: string;
  account: string;
  birthDate: string;
  gender: string;
  position: string;
  school: string;
  degree: string;
  major: string;
  screening: 'ผ่าน' | 'ไม่ผ่าน';
  /** ภาคความรู้ความสามารถที่ใช้เฉพาะตำแหน่ง (เต็ม 200) */
  partA: number;
  /** ภาคความเหมาะสมกับตำแหน่ง — ทดสอบสมรรถนะ และทดสอบจิตวิทยาฯ (เต็ม 50) */
  competency: number;
  /** ภาคความเหมาะสมกับตำแหน่ง — สัมภาษณ์ (เต็ม 50) */
  interview: number;
  totalScore: number;
  result: 'pass' | 'fail';
  rank: number | null;
  /** ครั้งที่ประกาศรับสมัคร */
  announceTimes: number;
  /** ใบอนุญาตประกอบวิชาชีพ ('-' = ไม่มี) */
  license: string;
  /** วันหมดอายุบัญชีสอบแข่งขัน */
  accountExpiry: string;
}

export const EXAM_APPLICANTS: ExamApplicant[] = [
  { examNo: '2569-0001', citizenId: '1103701234567', fullName: 'นางสาวธนพร ใจงาม', account: 'บัญชี 1', birthDate: '25/03/2538', gender: 'หญิง', position: 'นักประเมินราคา (ปฏิบัติการ)', school: 'มหาวิทยาลัยธรรมศาสตร์', degree: 'ปริญญาตรี', major: 'การจัดการที่ดินและอสังหาริมทรัพย์', screening: 'ผ่าน', partA: 185, competency: 44, interview: 47.5, totalScore: 276.5, result: 'pass', rank: 1, announceTimes: 1, license: '-', accountExpiry: '30 ต.ค. 2571' },
  { examNo: '2569-0002', citizenId: '1103702234568', fullName: 'นายณัฐพงษ์ ศรีสวัสดิ์', account: 'บัญชี 1', birthDate: '12/07/2537', gender: 'ชาย', position: 'นักประเมินราคา (ปฏิบัติการ)', school: 'มหาวิทยาลัยรังสิต', degree: 'วิทยาศาสตรบัณฑิต', major: 'วิทยาการคอมพิวเตอร์', screening: 'ผ่าน', partA: 182, competency: 43, interview: 48.33, totalScore: 273.33, result: 'pass', rank: 2, announceTimes: 1, license: '-', accountExpiry: '30 ต.ค. 2571' },
  { examNo: '2569-0003', citizenId: '1103703234569', fullName: 'นางสาวปิยะดา วงศ์สุวรรณ', account: 'บัญชี 1', birthDate: '03/11/2538', gender: 'หญิง', position: 'นักประเมินราคา (ปฏิบัติการ)', school: 'มหาวิทยาลัยเกษตรศาสตร์', degree: 'ปริญญาตรี', major: 'เศรษฐศาสตร์', screening: 'ผ่าน', partA: 178, competency: 45, interview: 46.0, totalScore: 269.0, result: 'pass', rank: 3, announceTimes: 1, license: '-', accountExpiry: '30 ต.ค. 2571' },
  { examNo: '2569-0004', citizenId: '1103704234560', fullName: 'นายกฤตภาส อินทโชติ', account: 'บัญชี 2', birthDate: '22/01/2536', gender: 'ชาย', position: 'นักประเมินราคา (ชำนาญการ)', school: 'มหาวิทยาลัยเชียงใหม่', degree: 'ปริญญาโท', major: 'การบริหารทรัพยากรมนุษย์', screening: 'ผ่าน', partA: 176, competency: 42, interview: 48.0, totalScore: 266.0, result: 'pass', rank: 4, announceTimes: 1, license: '-', accountExpiry: '30 ต.ค. 2571' },
  { examNo: '2569-0005', citizenId: '1103705234561', fullName: 'นางสาวศิริพร มั่นคง', account: 'บัญชี 1', birthDate: '17/05/2539', gender: 'หญิง', position: 'นักประเมินราคา (ปฏิบัติการ)', school: 'มหาวิทยาลัยธรรมศาสตร์', degree: 'ปริญญาตรี', major: 'การเงินและการธนาคาร', screening: 'ผ่าน', partA: 180, competency: 40, interview: 44.5, totalScore: 264.5, result: 'pass', rank: 5, announceTimes: 1, license: '-', accountExpiry: '30 ต.ค. 2571' },
  { examNo: '2569-0006', citizenId: '1103706234562', fullName: 'นายวรวิทย์ พัฒนกิจ', account: 'บัญชี 2', birthDate: '09/09/2535', gender: 'ชาย', position: 'นักประเมินราคา (ชำนาญการ)', school: 'สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง', degree: 'ปริญญาโท', major: 'วิศวกรรมเครื่องมือวัด', screening: 'ผ่าน', partA: 174, competency: 43, interview: 46.25, totalScore: 263.25, result: 'pass', rank: 6, announceTimes: 1, license: '-', accountExpiry: '30 ต.ค. 2571' },
  { examNo: '2569-0007', citizenId: '1103707234563', fullName: 'นางสาวอรพรรณ สุขเกษม', account: 'บัญชี 1', birthDate: '28/02/2540', gender: 'หญิง', position: 'นักประเมินราคา (ปฏิบัติการ)', school: 'มหาวิทยาลัยศรีปทุม', degree: 'ปริญญาตรี', major: 'นิติศาสตร์', screening: 'ผ่าน', partA: 175, competency: 41, interview: 45.5, totalScore: 261.5, result: 'pass', rank: 7, announceTimes: 1, license: '-', accountExpiry: '30 ต.ค. 2571' },
  { examNo: '2569-0008', citizenId: '1103708234564', fullName: 'นายสุรเชษฐ์ แสนทวีสุข', account: 'บัญชี 1', birthDate: '14/04/2537', gender: 'ชาย', position: 'นักประเมินราคา (ปฏิบัติการ)', school: 'มหาวิทยาลัยเกษตรศาสตร์', degree: 'ปริญญาตรี', major: 'สถาปัตยกรรมศาสตร์', screening: 'ผ่าน', partA: 170, competency: 44, interview: 46.5, totalScore: 260.5, result: 'pass', rank: 8, announceTimes: 1, license: '-', accountExpiry: '30 ต.ค. 2571' },
  { examNo: '2569-0009', citizenId: '1103709234565', fullName: 'นางสาวกัญญาณัฐ ทองใบ', account: 'บัญชี 1', birthDate: '30/06/2538', gender: 'หญิง', position: 'นักประเมินราคา (ปฏิบัติการ)', school: 'มหาวิทยาลัยราชภัฏสวนสุนันทา', degree: 'ปริญญาตรี', major: 'การบัญชี', screening: 'ผ่าน', partA: 172, competency: 42, interview: 45.25, totalScore: 259.25, result: 'pass', rank: 9, announceTimes: 1, license: '-', accountExpiry: '30 ต.ค. 2571' },
  { examNo: '2569-0010', citizenId: '1103710234566', fullName: 'นายภูริช เจริญพาณิชย์', account: 'บัญชี 2', birthDate: '05/12/2534', gender: 'ชาย', position: 'นักประเมินราคา (ชำนาญการ)', school: 'จุฬาลงกรณ์มหาวิทยาลัย', degree: 'ปริญญาโท', major: 'ทรัพย์สินทางปัญญา', screening: 'ผ่าน', partA: 169, competency: 43, interview: 46.5, totalScore: 258.5, result: 'pass', rank: 10, announceTimes: 1, license: '-', accountExpiry: '30 ต.ค. 2571' },
  { examNo: '2569-0011', citizenId: '1103711234567', fullName: 'นางสาวชนิดาภา เลิศประเสริฐ', account: 'บัญชี 1', birthDate: '19/08/2539', gender: 'หญิง', position: 'นักประเมินราคา (ปฏิบัติการ)', school: 'มหาวิทยาลัยธรรมศาสตร์', degree: 'ปริญญาตรี', major: 'รัฐประศาสนศาสตร์', screening: 'ผ่าน', partA: 168, competency: 41, interview: 47.0, totalScore: 256.0, result: 'pass', rank: 11, announceTimes: 1, license: '-', accountExpiry: '30 ต.ค. 2571' },
  { examNo: '2569-0012', citizenId: '1103712234568', fullName: 'นายธนกฤต ชูเกียรติ', account: 'บัญชี 1', birthDate: '25/10/2536', gender: 'ชาย', position: 'นักประเมินราคา (ปฏิบัติการ)', school: 'มหาวิทยาลัยเทคโนโลยีสุรนารี', degree: 'ปริญญาตรี', major: 'วิศวกรรมโยธา', screening: 'ผ่าน', partA: 165, competency: 43, interview: 46.0, totalScore: 254.0, result: 'pass', rank: 12, announceTimes: 1, license: '-', accountExpiry: '30 ต.ค. 2571' },
  { examNo: '2569-0013', citizenId: '1103713234569', fullName: 'นางสาวพิมพ์ลภัส เนตรนคร', account: 'บัญชี 1', birthDate: '08/03/2540', gender: 'หญิง', position: 'นักประเมินราคา (ปฏิบัติการ)', school: 'มหาวิทยาลัยศรีนครินทรวิโรฒ', degree: 'ปริญญาตรี', major: 'เศรษฐศาสตร์', screening: 'ผ่าน', partA: 166, competency: 40, interview: 45.5, totalScore: 251.5, result: 'pass', rank: 13, announceTimes: 1, license: '-', accountExpiry: '30 ต.ค. 2571' },
  { examNo: '2569-0014', citizenId: '1103714234570', fullName: 'นายเอกชัย บุญมาก', account: 'บัญชี 2', birthDate: '11/02/2533', gender: 'ชาย', position: 'นักประเมินราคา (ชำนาญการ)', school: 'มหาวิทยาลัยเชียงใหม่', degree: 'ปริญญาโท', major: 'การจัดการงานก่อสร้าง', screening: 'ผ่าน', partA: 162, competency: 42, interview: 45.25, totalScore: 249.25, result: 'pass', rank: 14, announceTimes: 1, license: '-', accountExpiry: '30 ต.ค. 2571' },
  { examNo: '2569-0015', citizenId: '1103715234571', fullName: 'นางสาวศศิกานต์ รุ่งเรือง', account: 'บัญชี 1', birthDate: '02/09/2538', gender: 'หญิง', position: 'นักประเมินราคา (ปฏิบัติการ)', school: 'มหาวิทยาลัยเกษตรศาสตร์', degree: 'ปริญญาตรี', major: 'สถาบันบริหารจัดการ', screening: 'ผ่าน', partA: 160, competency: 41, interview: 46.0, totalScore: 247.0, result: 'pass', rank: 15, announceTimes: 1, license: '-', accountExpiry: '30 ต.ค. 2571' },
  { examNo: '2569-0016', citizenId: '1103716234572', fullName: 'นายจิรายุ ปิ่นทอง', account: 'บัญชี 1', birthDate: '21/06/2537', gender: 'ชาย', position: 'นักประเมินราคา (ปฏิบัติการ)', school: 'มหาวิทยาลัยรามคำแหง', degree: 'ปริญญาตรี', major: 'นิติศาสตร์', screening: 'ผ่าน', partA: 158, competency: 42, interview: 44.75, totalScore: 244.75, result: 'pass', rank: 16, announceTimes: 1, license: '-', accountExpiry: '30 ต.ค. 2571' },
  { examNo: '2569-0017', citizenId: '1103717234573', fullName: 'นางสาวณัชพัชร สายสินธุ์', account: 'บัญชี 1', birthDate: '15/01/2541', gender: 'หญิง', position: 'นักประเมินราคา (ปฏิบัติการ)', school: 'มหาวิทยาลัยธรรมศาสตร์', degree: 'ปริญญาตรี', major: 'สถิติ', screening: 'ผ่าน', partA: 155, competency: 41, interview: 45.5, totalScore: 241.5, result: 'pass', rank: 17, announceTimes: 1, license: '-', accountExpiry: '30 ต.ค. 2571' },
  { examNo: '2569-0018', citizenId: '1103718234574', fullName: 'นายพัทธมน โชคชัย', account: 'บัญชี 1', birthDate: '07/10/2536', gender: 'ชาย', position: 'นักประเมินราคา (ปฏิบัติการ)', school: 'มหาวิทยาลัยราชภัฏพระนคร', degree: 'ปริญญาตรี', major: 'รัฐประศาสนศาสตร์', screening: 'ผ่าน', partA: 110, competency: 32, interview: 32.0, totalScore: 174.0, result: 'fail', rank: null, announceTimes: 1, license: '-', accountExpiry: '-' },
];

// จัดรูปแบบเลขประจำตัวประชาชน x-xxxx-xxxxx-xx-x
export const formatCitizenId = (id: string) =>
  `${id.slice(0, 1)}-${id.slice(1, 5)}-${id.slice(5, 10)}-${id.slice(10, 12)}-${id.slice(12)}`;
