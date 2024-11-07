import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  updateUser: (userData: User) => Promise<void>;
}

// Mock user data
const mockUsers = {
  student: {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'student',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
    languages: ['English', 'Spanish'],
    level: 'Intermediate',
    country: 'United States',
    bio: 'Passionate language learner',
  },
  teacher: {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'teacher',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
    languages: ['English', 'French'],
    country: 'France',
    bio: 'Experienced language teacher',
    hourlyRate: 25,
  },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Mock login - in reality, this would validate credentials
    const mockUser = email.includes('teacher') ? mockUsers.teacher : mockUsers.student;
    set({ user: mockUser, isAuthenticated: true });
  },
  register: async (userData: Partial<User>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const mockUser = userData.role === 'teacher' ? mockUsers.teacher : mockUsers.student;
    set({ user: { ...mockUser, ...userData }, isAuthenticated: true });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  updateUser: async (userData: User) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({ user: userData });
  },
}));