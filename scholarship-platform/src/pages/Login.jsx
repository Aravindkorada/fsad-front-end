import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Button, Input, Card } from '../components/ui/index';
import '../styles/login.css';

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isLoading } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(formData.email, formData.password, formData.role);

      if (result.success) {
        addNotification(`Welcome back, ${formData.role === 'admin' ? 'Admin' : 'Student'}!`, 'success');
        navigate(formData.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        addNotification(result.error || 'Login failed', 'error');
      }
    } catch (error) {
      addNotification('An error occurred during login', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="login-container">
        <div className="login-loading">
          <div className="spinner spinner-lg"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-overlay"></div>
        <div className="login-pattern"></div>
      </div>

      <div className="login-content">
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-icon">🎓</div>
            <h1>ScholarHub</h1>
          </div>
          <p className="login-subtitle">Student Scholarship & Financial Aid Management</p>
        </div>

        <Card className="login-card">
          <div className="login-card-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="role-selector">
              <label className="role-label">I am a:</label>
              <div className="role-buttons">
                <button
                  type="button"
                  className={`role-btn ${formData.role === 'student' ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, role: 'student' }))}
                >
                  👨‍🎓 Student
                </button>
                <button
                  type="button"
                  className={`role-btn ${formData.role === 'admin' ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, role: 'admin' }))}
                >
                  👨‍💼 Admin
                </button>
              </div>
            </div>

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="your@email.com"
              disabled={isSubmitting}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
              disabled={isSubmitting}
            />

            <div className="login-actions">
              <Button
                variant="primary"
                type="submit"
                block
                disabled={isSubmitting}
                className="login-btn"
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>
          </form>

          <div className="login-footer">
            <div className="demo-accounts">
              <p className="demo-title">Demo Accounts:</p>
              <div className="demo-account">
                <strong>Admin:</strong> admin@scholarship.com / password
              </div>
              <div className="demo-account">
                <strong>Student:</strong> student@scholarship.com / password
              </div>
            </div>
          </div>
        </Card>

        <div className="login-features">
          <div className="feature-item">
            <div className="feature-icon">🔒</div>
            <span>Secure & Private</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📱</div>
            <span>Mobile Friendly</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">⚡</div>
            <span>Fast & Reliable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
