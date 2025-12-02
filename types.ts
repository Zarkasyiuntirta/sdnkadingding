
export type User = {
  name: string;
  role: 'admin' | 'student';
};

export interface Student {
  id: string;
  name: string;
  nim: string;
  photo: string;
};

export const MATA_PELAJARAN = [
  'PAI', 'PPKn', 'B. Indonesia', 'Matematika', 'IPA', 'IPS', 'PJOK', 'Seni Budaya', 'Muatan Lokal'
] as const;

export type Subject = typeof MATA_PELAJARAN[number];

export const SEMESTERS = ['Mid Semester 1', 'Semester 1', 'Mid Semester 2', 'Semester 2'] as const;
export type Semester = typeof SEMESTERS[number];

export type ExamScores = { [key in Semester]?: number };

export interface ProactiveData {
  bertanya: number;
  menjawab: number;
  menambahkan: number;
};

export interface AssignmentData {
  selesai: number;
  tidakSelesai: number;
  jumlah: number;
};

export const ATTENDANCE_STATUS = ['Hadir', 'Izin', 'Sakit', 'Mangkir'] as const;
export type AttendanceStatus = typeof ATTENDANCE_STATUS[number];

export interface AttendanceData {
  hadir: number;
  totalPertemuan: number;
}

export interface StudentSubjectData {
  examScores: ExamScores;
  proactive: ProactiveData;
  assignment: AssignmentData;
};

export interface FullStudentData {
  studentInfo: Student;
  attendance: AttendanceData;
  subjects: { [key in Subject]?: StudentSubjectData };
};
