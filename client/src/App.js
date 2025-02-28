import React, { useState, useEffect } from 'react';
import {  Route, Routes, Navigate } from 'react-router-dom';
import LectureDashboard from './Lecturers/lecturersDashboard';
import StudentDashboard from './students/studentDashboard';
import RegisterForm from './components/userRegister';
import LoginForm from './components/usersLogin';

// Protected Route Component
const ProtectedRoute = ({ element, allowedRole }) => {
  const userRole = localStorage.getItem('userRole');

  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  return userRole === allowedRole ? element : <Navigate to="/" replace />;
};

function App() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginForm setUserRole={setUserRole} />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/sign-in" element={<LoginForm />} />

        {/* Protected Routes */}
        <Route
        path="/student-dashboard/*"
        element={<ProtectedRoute element={<StudentDashboard />} allowedRole="student" />}
        />

        <Route
          path="/lecturer-dashboard"
          element={<ProtectedRoute element={<LectureDashboard />} allowedRole="lecturer" />}
        />
        
      </Routes>
    </div>
  );
}

export default App
