import React, { useState } from 'react';
import { Calendar, Video, Star } from 'lucide-react';
import type { Class } from '../types';
import { useAuthStore } from '../store/authStore';
import { useTeacherStore } from '../store/teacherStore';

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { addReview } = useTeacherStore();
  const [classes, setClasses] = React.useState<Class[]>([
    {
      id: '1',
      teacherId: '1',
      studentId: user?.id || '',
      teacherName: 'Sarah Johnson',
      date: '2024-03-20',
      startTime: '10:00',
      endTime: '11:00',
      status: 'completed',
      language: 'English',
      level: 'Intermediate',
      meetingUrl: 'https://meet.google.com/abc-defg-hij',
      hasReview: false
    }
  ]);

  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    classId: string;
    teacherId: string;
  }>({
    isOpen: false,
    classId: '',
    teacherId: ''
  });

  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const review = {
      id: Date.now().toString(),
      teacherId: reviewModal.teacherId,
      studentId: user.id,
      studentName: user.name,
      studentPhotoUrl: user.photoUrl,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toISOString(),
      classId: reviewModal.classId
    };

    addReview(reviewModal.teacherId, review);
    setClasses(classes.map(c => 
      c.id === reviewModal.classId 
        ? { ...c, hasReview: true }
        : c
    ));
    setReviewModal({ isOpen: false, classId: '', teacherId: '' });
    setReviewData({ rating: 5, comment: '' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Classes</h2>
      
      <div className="space-y-4">
        {classes.map((classItem) => (
          <div
            key={classItem.id}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold">{classItem.language} Class</h3>
                  <p className="text-sm text-gray-600">
                    with {classItem.teacherName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(classItem.date).toLocaleDateString()} at{' '}
                    {classItem.startTime}
                  </p>
                  <p className="text-sm text-gray-600">Level: {classItem.level}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 rounded-full text-sm ${
                  classItem.status === 'scheduled'
                    ? 'bg-green-100 text-green-800'
                    : classItem.status === 'completed'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
                </span>
                
                {classItem.meetingUrl && classItem.status === 'scheduled' && (
                  <a
                    href={classItem.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Video className="h-4 w-4" />
                    <span>Join Class</span>
                  </a>
                )}

                {classItem.status === 'completed' && !classItem.hasReview && (
                  <button
                    onClick={() => setReviewModal({
                      isOpen: true,
                      classId: classItem.id,
                      teacherId: classItem.teacherId
                    })}
                    className="flex items-center space-x-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors duration-200"
                  >
                    <Star className="h-4 w-4" />
                    <span>Leave Review</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {reviewModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= reviewData.rating
                            ? 'text-amber-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  rows={4}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setReviewModal({ isOpen: false, classId: '', teacherId: '' })}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}