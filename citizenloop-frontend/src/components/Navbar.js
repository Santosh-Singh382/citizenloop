import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const role = localStorage.getItem('role');
  const userName = localStorage.getItem('name');
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    navigate('/');
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h2 style={{ margin: 0, cursor: 'pointer' }} onClick={() => handleNavClick('/')}>
          🌍 Citizen Loop
        </h2>
      </div>

      <div className="nav-links" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {role === 'ADMIN' ? (
          <>
            <Link to="/" className={`nav-link ${isActive('/')}`}>🏠 Home</Link>
            <Link to="/admin-dashboard" className={`nav-link ${isActive('/admin-dashboard')}`}>📊 Dashboard</Link>
          </>
        ) : role === 'CITIZEN' ? (
          <>
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>📋 My Complaints</Link>
            <Link to="/complaint-form" className={`nav-link ${isActive('/complaint-form')}`}>➕ Report Issue</Link>
            <Link to="/profile" className={`nav-link ${isActive('/profile')}`}>👤 Profile</Link>
          </>
        ) : null}

        <Link to="/public-map" className={`nav-link ${isActive('/public-map')}`}>🗺️ Public Map</Link>

        {role ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem' }}>{userName || 'User'}</span>
            <button 
              className="btn btn-secondary" 
              onClick={logout}
              style={{ padding: '6px 12px', fontSize: '0.9rem' }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/" className="btn btn-primary">Sign In</Link>
        )}
      </div>
    </nav>
  );
}

