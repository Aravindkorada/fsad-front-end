import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useScholarship } from '../contexts/ScholarshipContext';
import { Card, Badge, Button } from '../components/ui/index';
import { calculateDaysLeft, getDeadlineStatus, formatDate } from '../utils/validation';
import '../styles/student-dashboard.css';

export const StudentDashboard = () => {
  const { getAppliedScholarships, getApplicationStatus, scholarships } = useScholarship();
  const appliedScholarships = getAppliedScholarships();

  const stats = useMemo(() => {
    const applications = appliedScholarships.length;
    const pending = appliedScholarships.filter(
      (s) => getApplicationStatus(s.id)?.status === 'pending'
    ).length;
    const upcomingDeadlines = scholarships.filter((s) => calculateDaysLeft(s.deadline) <= 14).length;
    const totalAmount = appliedScholarships.reduce((sum, s) => sum + s.amount, 0);

    return { applications, pending, upcomingDeadlines, totalAmount };
  }, [appliedScholarships, getApplicationStatus, scholarships]);

  const upcomingDeadlines = scholarships
    .filter((s) => calculateDaysLeft(s.deadline) > 0)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome Back!</h1>
          <p>Here's your scholarship application status and upcoming deadlines</p>
        </div>
        <Link to="/scholarships">
          <Button variant="primary">🔍 Browse Scholarships</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-number">{stats.applications}</div>
          <div className="stat-label">Applications Submitted</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending Review</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-number">{stats.upcomingDeadlines}</div>
          <div className="stat-label">Upcoming Deadlines</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-amount">${stats.totalAmount.toLocaleString()}</div>
          <div className="stat-label">Total Amount Applied</div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Applied Scholarships */}
        <Card className="dashboard-card">
          <div className="card-header-custom">
            <h2>Your Applications</h2>
            <span className="badge-count">{appliedScholarships.length}</span>
          </div>

          {appliedScholarships.length === 0 ? (
            <div className="empty-state">
              <p>You haven't applied for any scholarships yet.</p>
              <Link to="/scholarships">
                <Button variant="primary" className="mt-lg">
                  Start Exploring Scholarships
                </Button>
              </Link>
            </div>
          ) : (
            <div className="applications-list">
              {appliedScholarships.map((scholarship) => {
                const application = getApplicationStatus(scholarship.id);
                const daysLeft = calculateDaysLeft(scholarship.deadline);
                const deadlineStatus = getDeadlineStatus(scholarship.deadline);

                return (
                  <div key={scholarship.id} className="application-item">
                    <div className="application-header">
                      <div>
                        <h4>{scholarship.title || scholarship.name}</h4>
                        <p className="application-date">
                          Applied on: {application?.appliedDate}
                        </p>
                      </div>
                      <div className="application-status">
                        <Badge variant={application?.status === 'pending' ? 'warning' : 'success'}>
                          {application?.status || 'pending'}
                        </Badge>
                      </div>
                    </div>

                    <div className="application-details">
                      <div className="detail-item">
                        <span className="label">Amount:</span>
                        <span className="value">${scholarship.amount.toLocaleString()}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Deadline:</span>
                        <span className="value">{formatDate(scholarship.deadline)}</span>
                      </div>
                      <div className="detail-item">
                        <span className={`label days-left ${daysLeft <= 7 ? 'urgent' : ''}`}>
                          {daysLeft} days remaining
                        </span>
                      </div>
                    </div>

                    <Link to={`/scholarship/${scholarship.id}`} className="view-link">
                      View Application →
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="dashboard-card">
          <div className="card-header-custom">
            <h2>⏰ Upcoming Deadlines</h2>
          </div>

          {upcomingDeadlines.length === 0 ? (
            <p className="text-secondary">No upcoming deadlines</p>
          ) : (
            <div className="deadlines-list">
              {upcomingDeadlines.map((scholarship) => {
                const daysLeft = calculateDaysLeft(scholarship.deadline);
                const isUrgent = daysLeft <= 7;

                return (
                  <div
                    key={scholarship.id}
                    className={`deadline-item ${isUrgent ? 'urgent' : ''}`}
                  >
                    <div className="deadline-date">
                      <span className="days">{daysLeft}</span>
                      <span className="days-label">days</span>
                    </div>
                    <div className="deadline-info">
                      <h5>{scholarship.title || scholarship.name}</h5>
                      <p>{formatDate(scholarship.deadline)}</p>
                    </div>
                    <Link to={`/scholarship/${scholarship.id}`}>
                      <Button size="sm" variant="ghost">
                        Apply
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="quick-actions-card">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <Link to="/scholarships">
            <div className="action-item">
              <div className="action-icon">🔍</div>
              <div className="action-label">Browse All Scholarships</div>
            </div>
          </Link>
          <Link to="/profile">
            <div className="action-item">
              <div className="action-icon">👤</div>
              <div className="action-label">View My Profile</div>
            </div>
          </Link>
          <Link to="/scholarships">
            <div className="action-item">
              <div className="action-icon">⭐</div>
              <div className="action-label">Explore More Opportunities</div>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default StudentDashboard;
