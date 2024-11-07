import React, { useState } from 'react';
import { Star, Clock, Globe2, ChevronDown, ChevronUp } from 'lucide-react';
import type { Teacher, Review } from '../types';
import ReviewList from './ReviewList';

interface TeacherCardProps {
  teacher: Teacher;
  onSelect: (teacherId: string) => void;
}

export default function TeacherCard({ teacher, onSelect }: TeacherCardProps) {
  const [showReviews, setShowReviews] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="md:flex">
        <div className="md:shrink-0">
          <img
            className="h-48 w-full object-cover md:h-full md:w-48"
            src={teacher.photoUrl || 'https://images.unsplash.com/photo-1544168190-79c17527004f?auto=format&fit=crop&q=80&w=200&h=200'}
            alt={teacher.name}
          />
        </div>
        <div className="p-6 flex-grow">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">{teacher.name}</h2>
            <span className="inline-flex items-center bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              ${teacher.hourlyRate}/hr
            </span>
          </div>
          
          <div className="mt-2 flex items-center gap-4">
            <div className="flex items-center text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="ml-1 text-sm">{teacher.rating.toFixed(1)}</span>
              <span className="ml-1 text-sm text-gray-500">({teacher.totalReviews})</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Clock className="h-4 w-4" />
              <span className="ml-1 text-sm">{teacher.experience}+ years</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Globe2 className="h-4 w-4" />
              <span className="ml-1 text-sm">{teacher.country}</span>
            </div>
          </div>

          <p className="mt-4 text-gray-600 line-clamp-2">{teacher.bio}</p>

          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {teacher.languages?.map((lang) => (
                <span
                  key={lang}
                  className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => onSelect(teacher.id)}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Book a Class
            </button>
            
            <button
              onClick={() => setShowReviews(!showReviews)}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              {showReviews ? (
                <>
                  Hide Reviews
                  <ChevronUp className="ml-1 h-4 w-4" />
                </>
              ) : (
                <>
                  Show Reviews
                  <ChevronDown className="ml-1 h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {showReviews && teacher.reviews && (
        <div className="border-t border-gray-200">
          <ReviewList reviews={teacher.reviews} />
        </div>
      )}
    </div>
  );
}