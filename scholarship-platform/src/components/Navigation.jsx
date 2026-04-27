import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/index';
import '../styles/navigation.css';

export const Navigation = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Don't show navigation on login page
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        {/* Logo */}
        <Link to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/dashboard') : '/login'} className="navbar-logo">
          🎓 ScholarHub
        </Link>

        {/* Navigation Links - Only show if authenticated */}
        {isAuthenticated && (
          <ul className="navbar-menu">
            {user?.role === 'admin' ? (
              <>
                <li>
                  <Link to="/admin" className={`navbar-link ${isActive('/admin') ? 'active' : ''}`}>
                    Admin Dashboard
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/dashboard" className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/scholarships"
                    className={`navbar-link ${isActive('/scholarships') ? 'active' : ''}`}
                  >
                    Scholarships
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className={`navbar-link ${isActive('/profile') ? 'active' : ''}`}>
                    Profile
                  </Link>
                </li>
              </>
            )}
          </ul>
        )}

        {/* Actions */}
        <div className="navbar-actions">
          {isAuthenticated && (
            <div className="user-info">
              <span className="user-role">
                {user?.role === 'admin' ? 'Admin' : 'Student'}
              </span>
              <span className="user-name">{user?.name}</span>
            </div>
          )}

          <button
            className="theme-toggle"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            title={isDarkMode ? 'Light mode' : 'Dark mode'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          {isAuthenticated && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="logout-btn"
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
