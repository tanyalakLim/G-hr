import type { PersonnelRecord } from '../../types';
import { INITIAL_PERSONNEL } from '../../data/personnelData';
import { ORG_UNITS } from '../../data/organizationData';
import type { OrgPosition, OrgUnit } from '../../data/organizationData';

// --- ชนิดตำแหน่งแบบ minimal สำหรับ modal/drawer ตัวหลักที่ใช้ร่วมกันทุกหน้า
// (OrgPosition, EmployeeStaffPosition และชุดข้อมูลอัตราใหม่ในอนาคต ต้องมีฟิลด์เหล่านี้)
export interface SharedPosition {
  id: string;
  unitId: string;
  positionNumber: string;
  jobTitle: string;
  orderNumber: number;
  positionType?: string;
  levelLabel?: string;
  levelShort?: string;
  lineOfWork?: string;
  adminPosition?: string;
  isKeyPosition?: boolean;
  holderPersonId?: string;
}

// --- ผู้ครองตำแหน่ง
const personnelById = new Map<string, PersonnelRecord>(INITIAL_PERSONNEL.map((p) => [p.id, p]));

// รับทุกชนิดอัตราที่มี holderPersonId (OrgPosition, EmployeeStaffPosition, ...)
export const holderOf = (pos: { holderPersonId?: string }): PersonnelRecord | undefined =>
  pos.holderPersonId ? personnelById.get(pos.holderPersonId) : undefined;

export const levelBadge = (pos: { levelLabel?: string; levelShort?: string }) =>
  pos.levelShort ?? pos.levelLabel ?? '-';

// --- ค้นหาหน่วยงาน / ขยาย-ยุบต้นไม้
export const findUnit = (nodes: OrgUnit[], id: string): OrgUnit | undefined => {
  for (const node of nodes) {
    if (node.id === id) return node;
    const found = node.children ? findUnit(node.children, id) : undefined;
    if (found) return found;
  }
  return undefined;
};

export const collectAllParentIds = (): string[] => {
  const ids: string[] = [];
  const walk = (node: OrgUnit) => {
    if (node.children?.length) {
      ids.push(node.id);
      node.children.forEach(walk);
    }
  };
  ORG_UNITS.forEach(walk);
  return ids;
};

export const unitSubtreeMatches = (node: OrgUnit, q: string): boolean => {
  const self = node.name.toLowerCase().includes(q) || node.code.includes(q) || (node.shortName ?? '').toLowerCase().includes(q);
  return self || (node.children ?? []).some((c) => unitSubtreeMatches(c, q));
};

// --- ตำแหน่งทั้งหมดใต้หน่วยงาน (รวมหน่วยงานลูก)
export const descendantMap = new Map<string, string[]>();
const walkDescendants = (node: OrgUnit): string[] => {
  const ids = [node.id];
  for (const child of node.children ?? []) ids.push(...walkDescendants(child));
  descendantMap.set(node.id, ids);
  return ids;
};
ORG_UNITS.forEach(walkDescendants);

// --- unitId → หน่วยงานราก (สำนัก) และหน่วยงานแม่ทันที
const unitRootMap = new Map<string, OrgUnit>();
const unitParentMap = new Map<string, OrgUnit>();
const walkUnitAncestry = (node: OrgUnit, root: OrgUnit, parent?: OrgUnit) => {
  unitRootMap.set(node.id, root);
  if (parent) unitParentMap.set(node.id, parent);
  for (const child of node.children ?? []) walkUnitAncestry(child, root, node);
};
ORG_UNITS.forEach((root) => walkUnitAncestry(root, root));

export const unitRootName = (unitId: string) => unitRootMap.get(unitId)?.name ?? '-';
export const unitParentName = (unitId: string) => unitParentMap.get(unitId)?.name ?? '-';

// --- สรุปข้อมูลแต่ละสำนักสำหรับผังองค์กร
export interface ChartGroupChild {
  id: string;
  name: string;
  code: string;
  count: number;
}

export interface ChartGroup extends ChartGroupChild {
  children: ChartGroupChild[];
}

export const chartGroups: ChartGroup[] = ORG_UNITS.map((root) => ({
  id: root.id,
  name: root.name,
  code: root.code,
  count: root.count ?? 0,
  children: (root.children ?? []).map((child) => ({
    id: child.id,
    name: child.name,
    code: child.code,
    count: child.count ?? 0,
  })),
}));

export const totalPeople = chartGroups.reduce((sum, g) => sum + g.count, 0);
