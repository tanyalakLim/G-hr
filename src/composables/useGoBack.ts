import { useRouter } from 'vue-router';

// ปุ่มย้อนกลับ: ใช้ history ถ้ามี (เข้าจากหน้าอื่นในแอป) แต่ถ้าเข้าจาก deep link
// ที่ไม่มีประวัติ ให้ replace ไปยัง fallback แทน
export function useGoBack(fallback: string) {
  const router = useRouter();
  return () => {
    if (window.history.state?.back) {
      router.back();
    } else {
      router.replace(fallback);
    }
  };
}
