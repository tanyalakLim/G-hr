import { ref } from 'vue';

// สถานะล็อกอินจำลอง (ยังไม่มี backend) — เก็บใน sessionStorage
// ให้ tab นี้ยังล็อกอินอยู่หลัง refresh แต่ปิด tab แล้วต้องล็อกอินใหม่
// ระบบมี 2 ฝั่ง: admin (เจ้าหน้าที่ ก.พ.) และ user (บุคลากรทั่วไป)

const STORAGE_KEY = 'ghr-authenticated';
const ROLE_KEY = 'ghr-role';
const NAME_KEY = 'ghr-display-name';

export type AuthRole = 'admin' | 'user';

const readInitialAuthed = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

const readInitialRole = (): AuthRole => {
  try {
    return sessionStorage.getItem(ROLE_KEY) === 'user' ? 'user' : 'admin';
  } catch {
    return 'admin';
  }
};

const readInitialName = () => {
  try {
    return sessionStorage.getItem(NAME_KEY) ?? '';
  } catch {
    return '';
  }
};

export const isAuthenticated = ref(readInitialAuthed());
export const authRole = ref<AuthRole>(readInitialRole());
export const displayName = ref(readInitialName());

const persist = (key: string, value: string | null) => {
  try {
    if (value === null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, value);
  } catch {
    /* sessionStorage ใช้ไม่ได้ (โหมดส่วนตัว ฯลฯ) — ถือว่าล็อกอินเฉพาะรอบนี้ */
  }
};

export function useAuth() {
  const signIn = (role: AuthRole, name?: string) => {
    isAuthenticated.value = true;
    authRole.value = role;
    if (name) displayName.value = name;
    persist(STORAGE_KEY, '1');
    persist(ROLE_KEY, role);
    persist(NAME_KEY, name ?? null);
  };

  const signOut = () => {
    isAuthenticated.value = false;
    displayName.value = '';
    persist(STORAGE_KEY, null);
    persist(ROLE_KEY, null);
    persist(NAME_KEY, null);
  };

  return { isAuthenticated, authRole, displayName, signIn, signOut };
}
