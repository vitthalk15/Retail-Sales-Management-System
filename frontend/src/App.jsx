import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SalesManagement from './pages/SalesManagement';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('token') !== null;
  });

  useEffect(() => {
    // Check authentication status on mount and when storage changes
    const checkAuth = () => {
      setIsAuthenticated(localStorage.getItem('token') !== null);
    };

    // Listen for storage changes (works for same-tab and cross-tab updates)
    window.addEventListener('storage', checkAuth);
    
    // Also listen for custom storage event (for same-tab updates)
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <SalesManagement />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
