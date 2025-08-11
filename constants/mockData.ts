import { 
  Student, 
  Subject, 
  AttendanceRecord, 
  TimetableSlot, 
  Homework, 
  Exam, 
  Fee, 
  Notice, 
  StudyMaterial, 
  Message, 
  LibraryBook, 
  TransportInfo, 
  Event, 
  HostelInfo 
} from '../types';

export const mockStudent: Student = {
  id: 'STU001',
  name: 'Alex Johnson',
  rollNumber: '2024001',
  class: '10th',
  section: 'A',
  admissionNumber: 'ADM2024001',
  dateOfBirth: '2008-05-15',
  bloodGroup: 'A+',
  address: '123 Oak Street, Springfield, IL 62701',
  phoneNumber: '+1-555-0123',
  email: 'alex.johnson@email.com',
  profileImage: 'https://via.placeholder.com/150',
  parentName: 'Robert Johnson',
  parentPhone: '+1-555-0124',
  parentEmail: 'robert.johnson@email.com',
};

export const mockSubjects: Subject[] = [
  { id: '1', name: 'Mathematics', code: 'MATH', teacher: 'Dr. Smith', color: '#3b82f6' },
  { id: '2', name: 'English', code: 'ENG', teacher: 'Ms. Johnson', color: '#ef4444' },
  { id: '3', name: 'Science', code: 'SCI', teacher: 'Mr. Brown', color: '#22c55e' },
  { id: '4', name: 'History', code: 'HIST', teacher: 'Mrs. Davis', color: '#f59e0b' },
  { id: '5', name: 'Geography', code: 'GEO', teacher: 'Mr. Wilson', color: '#ec4899' },
  { id: '6', name: 'Computer Science', code: 'CS', teacher: 'Ms. Taylor', color: '#8b5cf6' },
];

export const mockAttendance: AttendanceRecord[] = [
  { date: '2024-01-15', status: 'present' },
  { date: '2024-01-16', status: 'present' },
  { date: '2024-01-17', status: 'absent' },
  { date: '2024-01-18', status: 'present' },
  { date: '2024-01-19', status: 'late' },
  { date: '2024-01-22', status: 'present' },
  { date: '2024-01-23', status: 'present' },
];

export const mockTimetable: TimetableSlot[] = [
  { id: '1', day: 'Monday', startTime: '09:00', endTime: '10:00', subject: 'Mathematics', teacher: 'Dr. Smith', room: 'Room 101' },
  { id: '2', day: 'Monday', startTime: '10:00', endTime: '11:00', subject: 'English', teacher: 'Ms. Johnson', room: 'Room 102' },
  { id: '3', day: 'Monday', startTime: '11:30', endTime: '12:30', subject: 'Science', teacher: 'Mr. Brown', room: 'Lab 1' },
  { id: '4', day: 'Tuesday', startTime: '09:00', endTime: '10:00', subject: 'History', teacher: 'Mrs. Davis', room: 'Room 103' },
  { id: '5', day: 'Tuesday', startTime: '10:00', endTime: '11:00', subject: 'Geography', teacher: 'Mr. Wilson', room: 'Room 104' },
];

export const mockHomework: Homework[] = [
  {
    id: '1',
    subject: 'Mathematics',
    title: 'Quadratic Equations',
    description: 'Solve problems 1-20 from Chapter 5',
    dueDate: '2024-01-25',
    assignedDate: '2024-01-20',
    status: 'pending',
  },
  {
    id: '2',
    subject: 'English',
    title: 'Essay Writing',
    description: 'Write a 500-word essay on "Environmental Conservation"',
    dueDate: '2024-01-26',
    assignedDate: '2024-01-21',
    status: 'submitted',
    grade: 85,
  },
];

export const mockExams: Exam[] = [
  {
    id: '1',
    subject: 'Mathematics',
    title: 'Mid-term Exam',
    date: '2024-02-15',
    startTime: '09:00',
    endTime: '12:00',
    totalMarks: 100,
    obtainedMarks: 85,
    grade: 'A',
    term: 'Mid-term',
  },
  {
    id: '2',
    subject: 'English',
    title: 'Unit Test',
    date: '2024-01-30',
    startTime: '10:00',
    endTime: '11:30',
    totalMarks: 50,
    term: 'Unit Test',
  },
];

export const mockFees: Fee[] = [
  {
    id: '1',
    title: 'Tuition Fee - Term 1',
    amount: 5000,
    dueDate: '2024-01-31',
    status: 'paid',
    paymentDate: '2024-01-15',
    receiptNumber: 'RCP001',
  },
  {
    id: '2',
    title: 'Transport Fee - Term 1',
    amount: 1200,
    dueDate: '2024-01-31',
    status: 'pending',
  },
];

export const mockNotices: Notice[] = [
  {
    id: '1',
    title: 'Parent-Teacher Meeting',
    content: 'Dear parents, we are pleased to invite you to the parent-teacher meeting scheduled for January 30th, 2024.',
    date: '2024-01-20',
    category: 'general',
    isRead: false,
  },
  {
    id: '2',
    title: 'Holiday Notice',
    content: 'School will remain closed on January 26th due to Republic Day.',
    date: '2024-01-22',
    category: 'general',
    isRead: true,
  },
];

export const mockStudyMaterials: StudyMaterial[] = [
  {
    id: '1',
    title: 'Algebra Fundamentals',
    subject: 'Mathematics',
    type: 'pdf',
    url: 'https://example.com/algebra.pdf',
    uploadDate: '2024-01-15',
    size: '2.5 MB',
  },
  {
    id: '2',
    title: 'Photosynthesis Video',
    subject: 'Science',
    type: 'video',
    url: 'https://example.com/photosynthesis.mp4',
    uploadDate: '2024-01-16',
    size: '45 MB',
  },
];

export const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'Dr. Smith',
    receiver: 'Alex Johnson',
    content: 'Please submit your mathematics assignment by tomorrow.',
    timestamp: '2024-01-20T10:30:00Z',
    isRead: false,
    type: 'text',
  },
  {
    id: '2',
    sender: 'Alex Johnson',
    receiver: 'Dr. Smith',
    content: 'Sure, I will submit it by end of day.',
    timestamp: '2024-01-20T11:00:00Z',
    isRead: true,
    type: 'text',
  },
];

export const mockLibraryBooks: LibraryBook[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0-7432-7356-5',
    issueDate: '2024-01-10',
    dueDate: '2024-01-24',
    status: 'issued',
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0-06-112008-4',
    status: 'available',
  },
];

export const mockTransportInfo: TransportInfo = {
  routeNumber: 'RT-05',
  routeName: 'Downtown Route',
  driverName: 'Mike Wilson',
  driverPhone: '+1-555-0199',
  vehicleNumber: 'BUS-2024-05',
  pickupTime: '07:30 AM',
  dropTime: '03:30 PM',
  pickupPoint: 'Main Street Stop',
  fee: 1200,
};

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Annual Sports Day',
    description: 'Inter-house sports competition',
    date: '2024-02-10',
    startTime: '08:00',
    endTime: '17:00',
    type: 'event',
    location: 'School Grounds',
  },
  {
    id: '2',
    title: 'Mid-term Exams',
    description: 'Mid-term examinations for all classes',
    date: '2024-02-15',
    type: 'exam',
  },
];

export const mockHostelInfo: HostelInfo = {
  roomNumber: '301A',
  floor: '3rd Floor',
  building: 'East Wing',
  roommates: ['John Doe', 'Mike Smith'],
  warden: 'Mrs. Anderson',
  wardenPhone: '+1-555-0177',
  checkInTime: '19:00',
  checkOutTime: '06:00',
};
