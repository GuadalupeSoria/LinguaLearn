import { create } from 'zustand';
import type { Teacher, TimeSlot, Review } from '../types';

interface TeacherState {
  teachers: Teacher[];
  filteredTeachers: Teacher[];
  filters: {
    search: string;
    language: string;
    level: string;
    priceRange: string;
  };
  setFilters: (filters: Partial<TeacherState['filters']>) => void;
  applyFilters: () => void;
  updateTeacherAvailability: (teacherId: string, availability: TimeSlot[]) => void;
  bookTimeSlot: (teacherId: string, timeSlot: TimeSlot) => void;
  addReview: (teacherId: string, review: Review) => void;
}

const mockTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'teacher',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
    languages: ['English', 'Spanish'],
    country: 'United States',
    hourlyRate: 25,
    experience: 5,
    rating: 4.8,
    totalReviews: 127,
    bio: 'Certified English and Spanish teacher with 5+ years of experience.',
    timezone: 'America/New_York',
    workingHours: {
      start: '09:00',
      end: '17:00'
    },
    reviews: [
      {
        id: '1',
        teacherId: '1',
        studentId: '2',
        studentName: 'John Doe',
        studentPhotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=50&h=50',
        rating: 5,
        comment: 'Sarah is an excellent teacher! Her lessons are well-structured and she explains everything clearly.',
        date: '2024-03-15',
        classId: '1'
      },
      {
        id: '2',
        teacherId: '1',
        studentId: '3',
        studentName: 'Emma Wilson',
        rating: 4,
        comment: 'Very patient and knowledgeable. Helped me improve my pronunciation significantly.',
        date: '2024-03-10',
        classId: '2'
      }
    ],
    availability: [
      {
        id: '1',
        teacherId: '1',
        date: '2024-03-20',
        startTime: '09:00',
        endTime: '10:00',
        isBooked: false
      },
      {
        id: '2',
        teacherId: '1',
        date: '2024-03-20',
        startTime: '10:00',
        endTime: '11:00',
        isBooked: true
      }
    ]
  }
  // ... other teachers
];

export const useTeacherStore = create<TeacherState>((set, get) => ({
  teachers: mockTeachers,
  filteredTeachers: mockTeachers,
  filters: {
    search: '',
    language: '',
    level: '',
    priceRange: '',
  },
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },
  applyFilters: () => {
    const { teachers, filters } = get();
    let filtered = [...teachers];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(searchLower) ||
          teacher.languages?.some((lang) => lang.toLowerCase().includes(searchLower))
      );
    }

    if (filters.language) {
      filtered = filtered.filter((teacher) =>
        teacher.languages?.includes(filters.language)
      );
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(
        (teacher) =>
          teacher.hourlyRate >= min &&
          (max ? teacher.hourlyRate <= max : true)
      );
    }

    set({ filteredTeachers: filtered });
  },
  updateTeacherAvailability: (teacherId: string, availability: TimeSlot[]) => {
    set((state) => ({
      teachers: state.teachers.map((teacher) =>
        teacher.id === teacherId
          ? { ...teacher, availability }
          : teacher
      ),
      filteredTeachers: state.filteredTeachers.map((teacher) =>
        teacher.id === teacherId
          ? { ...teacher, availability }
          : teacher
      )
    }));
  },
  bookTimeSlot: (teacherId: string, timeSlot: TimeSlot) => {
    set((state) => ({
      teachers: state.teachers.map((teacher) =>
        teacher.id === teacherId
          ? {
              ...teacher,
              availability: teacher.availability?.map((slot) =>
                slot.id === timeSlot.id
                  ? { ...slot, isBooked: true }
                  : slot
              )
            }
          : teacher
      ),
      filteredTeachers: state.filteredTeachers.map((teacher) =>
        teacher.id === teacherId
          ? {
              ...teacher,
              availability: teacher.availability?.map((slot) =>
                slot.id === timeSlot.id
                  ? { ...slot, isBooked: true }
                  : slot
              )
            }
          : teacher
      )
    }));
  },
  addReview: (teacherId: string, review: Review) => {
    set((state) => ({
      teachers: state.teachers.map((teacher) =>
        teacher.id === teacherId
          ? {
              ...teacher,
              reviews: [...(teacher.reviews || []), review],
              totalReviews: teacher.totalReviews + 1,
              rating: 
                ((teacher.rating * teacher.totalReviews) + review.rating) / 
                (teacher.totalReviews + 1)
            }
          : teacher
      ),
      filteredTeachers: state.filteredTeachers.map((teacher) =>
        teacher.id === teacherId
          ? {
              ...teacher,
              reviews: [...(teacher.reviews || []), review],
              totalReviews: teacher.totalReviews + 1,
              rating: 
                ((teacher.rating * teacher.totalReviews) + review.rating) / 
                (teacher.totalReviews + 1)
            }
          : teacher
      )
    }));
  }
}));