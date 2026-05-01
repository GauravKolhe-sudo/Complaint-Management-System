import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import FileComplaint from './pages/FileComplaint';
import ManagerPanel from './pages/ManagerPanel';
import ComplaintDetails from './pages/ComplaintDetails';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Something went wrong.</h2>
          <pre style={{ color: 'red', marginTop: '1rem', fontSize: '0.85rem' }}>{this.state.error?.message}</pre>
          <button onClick={() => { this.setState({ hasError: false }); window.location.href = '/login'; }}
            style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
            Go to Login
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" replace />;
  if (role && userRole !== role) {
    return <Navigate to={userRole === 'manager' ? '/manager' : '/dashboard'} replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/dashboard" element={
            <ProtectedRoute role="user"><Dashboard /></ProtectedRoute>
          } />
          <Route path="/file-complaint" element={
            <ProtectedRoute role="user"><FileComplaint /></ProtectedRoute>
          } />
          <Route path="/complaint/:id" element={
            <ProtectedRoute role="user"><ComplaintDetails /></ProtectedRoute>
          } />
          <Route path="/manager" element={
            <ProtectedRoute role="manager"><ManagerPanel /></ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
