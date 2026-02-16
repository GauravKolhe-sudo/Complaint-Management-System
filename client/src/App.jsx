import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import FileComplaint from './pages/FileComplaint';
import ManagerDashboard from './pages/ManagerDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Protected Route Wrapper
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="user">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/file-complaint"
          element={
            <ProtectedRoute role="user">
              <FileComplaint />
            </ProtectedRoute>
          }
        />

        {/* Manager Dashboard */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute role="manager">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
