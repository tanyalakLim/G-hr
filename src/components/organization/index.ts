// Modal/Drawer ตัวหลักอยู่ในโฟลเดอร์ modals/ (ทุกหน้าเรียกใช้ร่วมกันผ่าน barrel นี้ได้)
export * from './modals';
import OrganizationStructure from './OrganizationStructure.vue';
import PermanentStaffStructure from './PermanentStaffStructure.vue';
import TemporaryStaffStructure from './TemporaryStaffStructure.vue';

export { OrganizationStructure, PermanentStaffStructure, TemporaryStaffStructure };
