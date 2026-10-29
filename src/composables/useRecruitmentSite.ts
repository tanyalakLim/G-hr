import { ref } from 'vue';

// สถานะกลางของเว็บไซต์สรรหา (/recruitment_site) — ฝั่ง "ตั้งค่าเว็บสรรหา" เป็นผู้บันทึก
// และหน้าเว็บ public อ่านไปแสดงผล
// รูปจะถูกย่อขนาดและเก็บเป็น data URL ใน localStorage เพื่อจำค่าไว้ข้ามการ reload

/** โลโก้เว็บไซต์ (data URL) — '' = ยังไม่ได้ตั้งค่า ใช้โลโก้เริ่มต้น */
const siteLogo = ref('');

/** แบนเนอร์หน้าหลัก (data URL) — '' = ยังไม่ได้ตั้งค่า ใช้ hero กราเดียนต์ของระบบ */
const siteBanner = ref('');

const STORAGE_KEY = 'g-hr:recruitment-site-images';

// ขนาดสูงสุดก่อนเก็บ (พอดีกับจุดแสดงผล: แบนเนอร์ ~1920px, โลโก้ ~512px)
const MAX_DIMENSION = { logo: 512, banner: 1920 } as const;

interface StoredImages {
  logo?: string;
  banner?: string;
}

const loadStored = (): StoredImages => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as StoredImages;
  } catch {
    return {};
  }
};

const saved = loadStored();
siteLogo.value = saved.logo ?? '';
siteBanner.value = saved.banner ?? '';

const persist = (patch: StoredImages) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...loadStored(), ...patch }));
  } catch {
    // localStorage เต็ม (quota เกิน) — ยังแสดงผลใน session นี้ได้ แต่จะไม่จำค่าข้าม reload
  }
};

/**
 * อ่านไฟล์รูป ย่อให้ไม่เกิน max ด้านยาวสุด แล้วแปลงเป็น data URL
 * - logo: PNG (คงความโปร่งใส) / banner: JPEG (ไฟล์เล็ก)
 */
const fileToScaledDataUrl = (file: File, target: 'logo' | 'banner') =>
  new Promise<string>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_DIMENSION[target] / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('canvas ใช้งานไม่ได้'));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL(target === 'logo' ? 'image/png' : 'image/jpeg', 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('อ่านไฟล์รูปไม่สำเร็จ'));
    };
    img.src = url;
  });

export function useRecruitmentSite() {
  /** บันทึกรูปที่อัปโหลด (ส่ง null = ไม่เปลี่ยนรูปนั้น) */
  const setImages = async (logo?: File | null, banner?: File | null) => {
    const patch: StoredImages = {};
    if (logo) {
      siteLogo.value = await fileToScaledDataUrl(logo, 'logo');
      patch.logo = siteLogo.value;
    }
    if (banner) {
      siteBanner.value = await fileToScaledDataUrl(banner, 'banner');
      patch.banner = siteBanner.value;
    }
    if (Object.keys(patch).length) persist(patch);
  };

  /** คืนค่าโลโก้/แบนเนอร์เป็นค่าเริ่มต้น (ลบรูปที่บันทึกไว้) */
  const resetImages = () => {
    siteLogo.value = '';
    siteBanner.value = '';
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ไม่มีผลต่อการแสดงผล */
    }
  };

  return { siteLogo, siteBanner, setImages, resetImages };
}
