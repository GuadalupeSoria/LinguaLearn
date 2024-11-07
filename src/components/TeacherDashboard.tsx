import React, { useState } from 'react';
import { Calendar, Video, Link as LinkIcon, Clock } from 'lucide-react';
import type { Class, TimeSlot } from '../types';
import { useAuthStore } from '../store/authStore';
import { useTeacherStore } from '../store/teacherStore';

export default function TeacherDashboard() {
  const { user } = useAuthStore();
  const { updateTeacherAvailability } = useTeacherStore();
  const [workingHours, setWorkingHours] = useState({
    start: '09:00',
    end: '17:00',
  });
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [classes, setClasses] = useState<Class[]>([
    {
      id: '1',
      teacherId: user?.id || '',
      studentId: '2',
      studentName: 'John Doe',
      studentEmail: 'john@example.com',
      date: '2024-03-20',
      startTime: '10:00',
      endTime: '11:00',
      status: 'scheduled',
      language: 'English',
      level: 'Intermediate',
      meetingUrl: ''
    }
  ]);

  const handleAddMeetingLink = (classId: string, meetingUrl: string) => {
    setClasses(classes.map(classItem => 
      classItem.id === classId 
        ? { ...classItem, meetingUrl } 
        : classItem
    ));
  };

  const handleWorkingHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWorkingHours(prev => ({ ...prev, [name]: value }));
  };

  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    const [startHour] = workingHours.start.split(':').map(Number);
    const [endHour] = workingHours.end.split(':').map(Number);
    
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push({
        id: `slot-${hour}`,
        teacherId: user?.id || '',
        date: new Date().toISOString().split('T')[0],
        startTime: `${hour.toString().padStart(2, '0')}:00`,
        endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
        isBooked: false
      });
    }
    
    if (user?.id) {
      updateTeacherAvailability(user.id, slots);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Set Your Availability</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Working Hours</label>
            <div className="flex items-center space-x-2 mt-1">
              <input
                type="time"
                name="start"
                value={workingHours.start}
                onChange={handleWorkingHoursChange}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span>to</span>
              <input
                type="time"
                name="end"
                value={workingHours.end}
                onChange={handleWorkingHoursChange}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {Intl.supportedValuesOf('timeZone').map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>
        
        <button
          onClick={generateTimeSlots}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Update Availability
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6">My Teaching Schedule</h2>
      
      <div className="space-y-4">
        {classes.map((classItem) => (
          <div
            key={classItem.id}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold">{classItem.language} Class</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(classItem.date).toLocaleDateString()} at{' '}
                    {classItem.startTime}
                  </p>
                  <p className="text-sm text-gray-600">Level: {classItem.level}</p>
                  <div className="mt-2 text-sm text-gray-600">
                    <p><strong>Student:</strong> {classItem.studentName}</p>
                    <p><strong>Email:</strong> {classItem.studentEmail}</p>
                  </div>
                </div>
              </div>
              
              <span className={`px-2 py-1 rounded-full text-sm ${
                classItem.status === 'scheduled'
                  ? 'bg-green-100 text-green-800'
                  : classItem.status === 'completed'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
              </span>
            </div>

            {classItem.status === 'scheduled' && (
              <div className="mt-4 border-t pt-4">
                {classItem.meetingUrl ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <LinkIcon className="h-4 w-4" />
                      <span>{classItem.meetingUrl}</span>
                    </div>
                    <a
                      href={classItem.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Video className="h-4 w-4" />
                      <span>Join Class</span>
                    </a>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const input = form.elements.namedItem('meetingUrl') as HTMLInputElement;
                      handleAddMeetingLink(classItem.id, input.value);
                    }}
                    className="flex space-x-2"
                  >
                    <input
                      type="url"
                      name="meetingUrl"
                      placeholder="Enter meeting URL..."
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Add Link
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}