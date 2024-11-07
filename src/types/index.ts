export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  photoUrl?: string;
  languages?: string[];
  level?: string;
  country?: string;
  bio?: string;
  timezone?: string;
}

export interface Teacher extends User {
  hourlyRate: number;
  experience: number;
  rating: number;
  totalReviews: number;
  reviews?: Review[];
  availability?: TimeSlot[];
  workingHours?: {
    start: string;
    end: string;
  };
}

export interface Review {
  id: string;
  teacherId: string;
  studentId: string;
  studentName: string;
  studentPhotoUrl?: string;
  rating: number;
  comment: string;
  date: string;
  classId: string;
}

export interface TimeSlot {
  id: string;
  teacherId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Class {
  id: string;
  teacherId: string;
  studentId: string;
  studentName?: string;
  studentEmail?: string;
  teacherName?: string;
  teacherEmail?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  language: string;
  level: string;
  meetingUrl?: string;
  hasReview?: boolean;
}