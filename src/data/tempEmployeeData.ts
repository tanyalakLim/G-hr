export interface TempEmployee {
  id: string;
  orderNumber: number;
  citizenId: string;
  fullName: string;
  positionDept: string;
  serviceYears: number;
  hireDate: string;
  appointDate: string;
  ageText: string;
}

const THAI_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

// 10 รายการแรกตรงตามต้นฉบับ
const SEED_ROWS: Omit<TempEmployee, 'id' | 'orderNumber'>[] = [
  { citizenId: '3934032700997', fullName: 'นายสมบัติ ศรีทอง', positionDept: '-', serviceYears: 0, hireDate: '01 ก.ค. 2569', appointDate: '-', ageText: '36 ปี 11 เดือน 5 วัน' },
  { citizenId: '5324455332110', fullName: 'นายอริบ พูลสุข', positionDept: '-', serviceYears: 0, hireDate: '-', appointDate: '-', ageText: '34 ปี 9 เดือน 12 วัน' },
  { citizenId: '7218148301552', fullName: 'นายอนุชิต ทองจี', positionDept: '-', serviceYears: 0, hireDate: '-', appointDate: '-', ageText: '33 ปี 8 เดือน 3 วัน' },
  { citizenId: '8608570955073', fullName: 'นายโรจน์ เรืองฤทธิ์', positionDept: '-', serviceYears: 0, hireDate: '-', appointDate: '-', ageText: '31 ปี 6 เดือน 20 วัน' },
  { citizenId: '9998993567391', fullName: 'นายสุรชัย แท่งทอง', positionDept: '-', serviceYears: 0, hireDate: '-', appointDate: '-', ageText: '29 ปี 4 เดือน 8 วัน' },
  { citizenId: '1389416105550', fullName: 'นายประเสริฐ โพธิ์ทอง', positionDept: '-', serviceYears: 0, hireDate: '-', appointDate: '-', ageText: '27 ปี 2 เดือน 14 วัน' },
  { citizenId: '3283109177873', fullName: 'นายธนทัต ศรีปุณ', positionDept: '-', serviceYears: 0, hireDate: '-', appointDate: '-', ageText: '25 ปี 0 เดือน 27 วัน' },
  { citizenId: '4673531742598', fullName: 'นายวรวิทย์ จันทร์ศรี', positionDept: '-', serviceYears: 0, hireDate: '-', appointDate: '-', ageText: '22 ปี 10 เดือน 9 วัน' },
  { citizenId: '6063954352833', fullName: 'นายกฤตเดช วรวรรณ', positionDept: '-', serviceYears: 0, hireDate: '-', appointDate: '-', ageText: '59 ปี 8 เดือน 18 วัน' },
  { citizenId: '7454376950673', fullName: 'นายวังยาว ศรีวิไล', positionDept: '-', serviceYears: 0, hireDate: '-', appointDate: '-', ageText: '57 ปี 6 เดือน 22 วัน' },
];

const FIRST_MALE = ['สมชาย', 'วิชัย', 'ประเสริฐ', 'อำนาจ', 'กิตติ', 'สมพงษ์', 'ธนา', 'ศักดา', 'อดิศร', 'ชนาธิป', 'พีระพงษ์', 'ณัฐวุฒิ', 'สุรเชษฐ์', 'ภูมิพัฒน์', 'จิรายุ', 'อธิป', 'วีระชัย', 'ธีรภัทร'];
const FIRST_FEMALE = ['สมจิตร', 'จันทร์เพ็ญ', 'วรรณา', 'สุพัตรา', 'มาลี', 'ปิ่นแก้ว', 'ธนพร', 'อรุณี', 'กนกวรรณ', 'พัชรี', 'นภัสสร', 'กัลยา', 'ศิริพร', 'จิดาภา', 'ปวีณา', 'รัตนา'];
const LAST_NAMES = ['ศรีสุข', 'ใจดี', 'ทองคำ', 'แก้วมณี', 'บุญมาก', 'วังยาว', 'โพธิ์แก้ว', 'จันทบูร', 'พูลสุข', 'ศรีทอง', 'มณีรัตน์', 'รักไทย', 'อินทร์แปลง', 'สายบัว', 'คงคาวรรณ', 'เจริญสุข'];

// deterministic pseudo-random (คงที่ทุกครั้งที่โหลด)
let seed = 987654321;
const rand = () => {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed / 2147483648;
};

const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

const makeCitizenId = (): string => {
  let digits = String(1 + Math.floor(rand() * 9));
  for (let i = 0; i < 12; i++) digits += String(Math.floor(rand() * 10));
  return digits;
};

const makeHireDate = (): string => {
  if (rand() < 0.7) return '-';
  const day = String(1 + Math.floor(rand() * 28)).padStart(2, '0');
  return `${day} ${pick(THAI_MONTHS)} ${rand() < 0.6 ? '2569' : '2568'}`;
};

const TOTAL = 166;

export const TEMP_EMPLOYEES: TempEmployee[] = [
  ...SEED_ROWS.map((row, i) => ({ ...row, id: `temp-${i + 1}`, orderNumber: i + 1 })),
  ...Array.from({ length: TOTAL - SEED_ROWS.length }, (_, i) => {
    const orderNumber = SEED_ROWS.length + i + 1;
    const isMale = rand() < 0.55;
    const fullName = isMale
      ? `นาย${pick(FIRST_MALE)} ${pick(LAST_NAMES)}`
      : rand() < 0.5
      ? `นาง${pick(FIRST_FEMALE)} ${pick(LAST_NAMES)}`
      : `นางสาว${pick(FIRST_FEMALE)} ${pick(LAST_NAMES)}`;
    const years = 20 + Math.floor(rand() * 40);
    const months = Math.floor(rand() * 12);
    const days = Math.floor(rand() * 30);
    return {
      id: `temp-${orderNumber}`,
      orderNumber,
      citizenId: makeCitizenId(),
      fullName,
      positionDept: rand() < 0.85 ? '-' : `สังกัด${pick(['สำนักงานเขตพระนคร', 'สำนักงานเขตดินแดง', 'สำนักงานเขตบางกอกใหญ่', 'สำนักงานเขตห้วยขวาง'])}`,
      serviceYears: 0,
      hireDate: makeHireDate(),
      appointDate: '-',
      ageText: `${years} ปี ${months} เดือน ${days} วัน`,
    };
  }),
];
