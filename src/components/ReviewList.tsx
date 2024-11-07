import React from 'react';
import { Star } from 'lucide-react';
import type { Review } from '../types';

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div className="p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Student Reviews</h3>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="flex space-x-4">
            <img
              src={review.studentPhotoUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=50&h=50'}
              alt={review.studentName}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{review.studentName}</h4>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'text-amber-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-gray-600">{review.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}