import React from 'react';
import TeacherCard from './TeacherCard';
import SearchFilters from './SearchFilters';
import BookingModal from './BookingModal';
import { useTeacherStore } from '../store/teacherStore';
import { useAuthStore } from '../store/authStore';

export default function TeacherList() {
  const { filteredTeachers } = useTeacherStore();
  const { isAuthenticated } = useAuthStore();
  const [bookingModal, setBookingModal] = React.useState<{
    isOpen: boolean;
    teacherId: string | null;
  }>({
    isOpen: false,
    teacherId: null,
  });

  const handleTeacherSelect = (teacherId: string) => {
    if (!isAuthenticated) {
      alert('Please sign in to book a class');
      return;
    }
    setBookingModal({ isOpen: true, teacherId });
  };

  const selectedTeacher = bookingModal.teacherId
    ? filteredTeachers.find((t) => t.id === bookingModal.teacherId)
    : null;

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Perfect Language Teacher
        </h1>
        <p className="text-xl text-gray-600">
          Connect with expert language teachers for personalized online lessons
        </p>
      </div>

      <SearchFilters />

      <div className="space-y-6">
        {filteredTeachers.map((teacher) => (
          <TeacherCard
            key={teacher.id}
            teacher={teacher}
            onSelect={handleTeacherSelect}
          />
        ))}
      </div>

      {selectedTeacher && (
        <BookingModal
          isOpen={bookingModal.isOpen}
          teacher={selectedTeacher}
          onClose={() => setBookingModal({ isOpen: false, teacherId: null })}
        />
      )}
    </div>
  );
}