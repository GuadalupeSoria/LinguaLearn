import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { GraduationCap, LogOut, User, Home, Calendar } from 'lucide-react';
import TeacherList from './components/TeacherList';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import UserProfile from './components/UserProfile';
import AuthModal from './components/AuthModal';
import { useAuthStore } from './store/authStore';

function App() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [authModal, setAuthModal] = React.useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link to="/" className="flex items-center">
                  <GraduationCap className="h-8 w-8 text-blue-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">LinguaLearn</span>
                </Link>
                
                {isAuthenticated && (
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/"
                      className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                    >
                      <Home className="h-5 w-5" />
                      <span>Find Teachers</span>
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                    >
                      <Calendar className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <>
                    <span className="text-gray-600">
                      Welcome, {user?.name}
                    </span>
                    <button
                      onClick={logout}
                      className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                      <LogOut className="h-5 w-5 mr-1" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setAuthModal({ isOpen: true, mode: 'register' })}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<TeacherList />} />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  user?.role === 'student' ? (
                    <StudentDashboard />
                  ) : (
                    <TeacherDashboard />
                  )
                ) : (
                  <div>Please sign in to view your dashboard</div>
                )
              }
            />
            <Route
              path="/profile"
              element={
                isAuthenticated ? (
                  <UserProfile />
                ) : (
                  <div>Please sign in to view your profile</div>
                )
              }
            />
          </Routes>
        </main>

        <AuthModal
          isOpen={authModal.isOpen}
          mode={authModal.mode}
          onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        />
      </div>
    </Router>
  );
}

export default App;