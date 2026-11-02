import { ref } from 'vue';

// สถานะล็อกอิน "ผู้สมัคร" ของเว็บไซต์สรรหา (จำลอง ยังไม่มี backend) — แยกจาก useAuth ของระบบภายใน
// (useAuth มีเฉพาะ admin/user ซึ่งเป็นบุคลากรภายใน ไม่ใช่ผู้สมัครเข้ารับการคัดเลือก/สอบแข่งขัน)
// เก็บใน sessionStorage เช่นเดียวกับ useAuth: refresh ยังล็อกอินอยู่ แต่ปิด tab แล้วต้องล็อกอินใหม่

const STORAGE_KEY = 'ghr-recruit-authenticated';
const NAME_KEY = 'ghr-recruit-display-name';

const readInitialAuthed = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

const readInitialName = () => {
  try {
    return sessionStorage.getItem(NAME_KEY) ?? '';
  } catch {
    return '';
  }
};

export const isRecruitAuthenticated = ref(readInitialAuthed());
export const recruitDisplayName = ref(readInitialName());

const persist = (key: string, value: string | null) => {
  try {
    if (value === null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, value);
  } catch {
    /* sessionStorage ใช้ไม่ได้ (โหมดส่วนตัว ฯลฯ) — ถือว่าล็อกอินเฉพาะรอบนี้ */
  }
};

export function useRecruitmentAuth() {
  const signIn = (name: string) => {
    isRecruitAuthenticated.value = true;
    recruitDisplayName.value = name;
    persist(STORAGE_KEY, '1');
    persist(NAME_KEY, name);
  };

  const signOut = () => {
    isRecruitAuthenticated.value = false;
    recruitDisplayName.value = '';
    persist(STORAGE_KEY, null);
    persist(NAME_KEY, null);
  };

  return { isRecruitAuthenticated, recruitDisplayName, signIn, signOut };
}
