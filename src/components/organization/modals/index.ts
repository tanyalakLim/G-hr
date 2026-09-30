// Modal/Drawer ตัวหลักของระบบอัตรากำลัง — ทุกหน้า (โครงสร้างอัตรากำลัง, ลูกจ้างประจำฯ,
// ลูกจ้างชั่วคราวฯ ฯลฯ) เรียกใช้จากที่นี่ได้เลย โดย props รับ SharedPosition (orgHelpers)
export { default as AddStructureModal } from './AddStructureModal.vue';
export { default as AddPositionModal } from './AddPositionModal.vue';
export { default as ReorderPositionModal } from './ReorderPositionModal.vue';
export { default as MovePositionModal } from './MovePositionModal.vue';
export { default as HolderRegistryDrawer } from './HolderRegistryDrawer.vue';
export { default as SelectHolderModal } from './SelectHolderModal.vue';
export { default as UnitInfoModal } from './UnitInfoModal.vue';
