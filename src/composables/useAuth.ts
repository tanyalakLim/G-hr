import { ref } from 'vue';

// สถานะล็อกอินจำลอง (ยังไม่มี backend) — เก็บใน sessionStorage
// ให้ tab นี้ยังล็อกอินอยู่หลัง refresh แต่ปิด tab แล้วต้องล็อกอินใหม่

const STORAGE_KEY = 'ghr-authenticated';

const readInitial = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

export const isAuthenticated = ref(readInitial());

export function useAuth() {
  const signIn = () => {
    isAuthenticated.value = true;
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* sessionStorage ใช้ไม่ได้ (โหมดส่วนตัว ฯลฯ) — ถือว่าล็อกอินเฉพาะรอบนี้ */
    }
  };

  const signOut = () => {
    isAuthenticated.value = false;
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* เช่นเดียวกับ signIn */
    }
  };

  return { isAuthenticated, signIn, signOut };
}
