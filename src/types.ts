export interface MessageReply {
  id: string;
  sender: string;
  senderRole: string;
  timestamp: string;
  content: string;
  isCurrentUser?: boolean;
}

export interface MessageDetailData {
  requestId: string;
  requestedTime: string;
  approver: string;
  department?: string;
  remarks?: string;
}

export type MessageStatus = 'approved' | 'pending' | 'rejected' | 'info';

export interface MessageItem {
  id: string;
  title: string;
  snippet: string;
  sender: string;
  senderRole: string;
  date: string;
  time: string;
  timestamp: string;
  status: MessageStatus;
  statusLabel: string;
  type: 'time_request' | 'system' | 'evaluation' | 'general';
  isRead: boolean;
  content: string;
  details: MessageDetailData;
  replies?: MessageReply[];
}

export interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string;
  type: string;
  location: string;
  status: 'approved' | 'pending' | 'regular';
  statusText: string;
}

export type InboxFilterType = 'all' | 'unread' | 'system';

export type PersonnelCategory = 'civil_servant' | 'permanent_employee' | 'temporary_employee';

export interface PersonnelRecord {
  id: string;
  orderNumber: number;
  name: string;
  nameEn?: string;
  citizenId: string;
  civilServantId?: string;
  officialRegId?: string;
  positionNumber: string;
  jobTitle: string;
  jobTitleSub?: string;
  positionType: string;
  positionLevel: string;
  department: string;
  departmentSub?: string;
  appointedDate: string;
  serviceYears: string;
  retirementYear?: string;
  retirementDate?: string;
  birthDate?: string;
  exactAge?: string;
  bloodType?: string;
  nationality?: string;
  ethnicity?: string;
  religion?: string;
  phone?: string;
  email?: string;
  status: 'regular' | 'probation';
  statusText: string;
  registryStatus?: string;
  probationDaysLeft?: number;
  avatarUrl: string;
  category: PersonnelCategory;
  fieldOrBranch?: string;
  gender?: 'male' | 'female';
  maritalStatus?: string;
  educationLevel?: string;
  degree?: string;
  major?: string;
  adminPosition?: string;
  tenureStatus?: string;
  age?: number;
}

export interface AppTableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  width?: string;
  headerClass?: string;
  cellClass?: string;
  hidden?: boolean;
}

