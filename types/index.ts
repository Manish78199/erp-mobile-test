export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  section: string;
  admissionNumber: string;
  dateOfBirth: string;
  bloodGroup: string;
  address: string;
  phoneNumber: string;
  email: string;
  profileImage?: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  teacher: string;
  color: string;
}

export interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  subject?: string;
}

export interface TimetableSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  room: string;
}

export interface Homework {
  id: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  assignedDate: string;
  status: 'pending' | 'submitted' | 'graded';
  attachments?: string[];
  grade?: number;
}

export interface Exam {
  id: string;
  subject: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  totalMarks: number;
  obtainedMarks?: number;
  grade?: string;
  term: string;
}

export interface Fee {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paymentDate?: string;
  receiptNumber?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'general' | 'class' | 'personal';
  isRead: boolean;
  attachments?: string[];
}

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  type: 'pdf' | 'video' | 'ppt' | 'doc';
  url: string;
  uploadDate: string;
  size: string;
}

export interface Message {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'image' | 'file';
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  issueDate?: string;
  dueDate?: string;
  status: 'available' | 'issued' | 'reserved';
}

export interface TransportInfo {
  routeNumber: string;
  routeName: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  pickupTime: string;
  dropTime: string;
  pickupPoint: string;
  fee: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime?: string;
  endTime?: string;
  type: 'exam' | 'holiday' | 'event' | 'meeting';
  location?: string;
}

export interface HostelInfo {
  roomNumber: string;
  floor: string;
  building: string;
  roommates: string[];
  warden: string;
  wardenPhone: string;
  checkInTime: string;
  checkOutTime: string;
}
