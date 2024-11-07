import React, { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import type { Teacher, TimeSlot } from '../types';
import { useAuthStore } from '../store/authStore';
import { useTeacherStore } from '../store/teacherStore';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher;
}

export default function BookingModal({ isOpen, onClose, teacher }: BookingModalProps) {
  const { user, isAuthenticated } = useAuthStore();
  const { bookTimeSlot } = useTeacherStore();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const availableSlots = teacher.availability?.filter(slot => !slot.isBooked) || [];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !selectedTimeSlot) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      bookTimeSlot(teacher.id, selectedTimeSlot);
      alert('Class booked successfully!');
      onClose();
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to book class. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold">Book a Class</h2>
          <div className="mt-2">
            <h3 className="font-semibold">{teacher.name}</h3>
            <p className="text-gray-600">{teacher.languages?.join(', ')}</p>
            <p className="text-gray-600">Timezone: {teacher.timezone}</p>
          </div>
        </div>

        <form onSubmit={handleBooking} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Date</label>
            <div className="mt-1 relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Available Time Slots</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedTimeSlot(slot)}
                  className={`p-2 rounded-lg border ${
                    selectedTimeSlot?.id === slot.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-500'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{slot.startTime} - {slot.endTime}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900">Booking Summary</h3>
            <div className="mt-2 space-y-2 text-sm text-gray-600">
              <p>Rate: ${teacher.hourlyRate}/hour</p>
              {selectedTimeSlot && (
                <p>Selected time: {selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !selectedTimeSlot}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}