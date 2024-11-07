import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useTeacherStore } from '../store/teacherStore';

export default function SearchFilters() {
  const { filters, setFilters, applyFilters } = useTeacherStore();
  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Italian'];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Native'];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value });
    applyFilters();
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ [key]: value });
    applyFilters();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearch}
            placeholder="Search teachers by name or language..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.language}
            onChange={(e) => handleFilterChange('language', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Language</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>

          <select
            value={filters.level}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Level</option>
            {levels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          <select
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Price Range</option>
            <option value="0-20">$0 - $20</option>
            <option value="20-40">$20 - $40</option>
            <option value="40-60">$40 - $60</option>
            <option value="60-1000">$60+</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            onClick={applyFilters}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Filter className="h-4 w-4" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
}