import React, { useState } from 'react';
import { useScholarship } from '../contexts/ScholarshipContext';
import { useNotification } from '../contexts/NotificationContext';
import { Card, Input, Textarea, Button, Divider } from '../components/ui/index';
import { Modal } from '../components/ui/Modal';
import { calculateDaysLeft, formatDate } from '../utils/validation';
import '../styles/student-profile.css';

export const StudentProfile = () => {
  const { getAppliedScholarships, getApplicationStatus, scholarships } = useScholarship();
  const { addNotification } = useNotification();
  const appliedScholarships = getAppliedScholarships();

  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    major: 'Computer Science',
    gpa: '3.85',
    university: 'University of Technology',
    bio: 'Passionate about technology and innovation. Currently pursuing a degree in Computer Science with a focus on AI and Machine Learning.',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(profileData);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);

  const documents = [
    { id: 1, name: 'High School Transcript', date: '2024-01-15' },
    { id: 2, name: 'SAT Scores', date: '2024-02-20' },
    { id: 3, name: 'Letter of Recommendation', date: '2024-03-10' },
    { id: 4, name: 'Personal Statement', date: '2024-04-05' },
  ];

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    setProfileData(editData);
    setIsEditing(false);
    addNotification('Profile updated successfully', 'success');
  };

  const applicationHistory = appliedScholarships.map((scholarship) => {
    const application = getApplicationStatus(scholarship.id);
    return {
      ...scholarship,
      ...application,
      daysLeft: calculateDaysLeft(scholarship.deadline),
    };
  });

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <h1>Student Profile</h1>
        <p>Manage your personal information and application history</p>
      </div>

      <div className="profile-content">
        {/* Main Profile Card */}
        <Card className="profile-card">
          <div className="profile-header-card">
            <div className="profile-avatar">
              <span className="avatar-initial">
                {profileData.firstName[0]}
                {profileData.lastName[0]}
              </span>
            </div>
            <div className="profile-header-info">
              <h2>
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p>{profileData.email}</p>
            </div>
            {!isEditing && (
              <Button variant="primary" size="sm" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>

          {isEditing ? (
            // Edit Mode
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProfile();
              }}
              className="profile-form"
            >
              <div className="form-row">
                <Input
                  label="First Name"
                  type="text"
                  name="firstName"
                  value={editData.firstName}
                  onChange={handleEditChange}
                />
                <Input
                  label="Last Name"
                  type="text"
                  name="lastName"
                  value={editData.lastName}
                  onChange={handleEditChange}
                />
              </div>

              <Input
                label="Email"
                type="email"
                name="email"
                value={editData.email}
                onChange={handleEditChange}
              />

              <Input
                label="Phone"
                type="tel"
                name="phone"
                value={editData.phone}
                onChange={handleEditChange}
              />

              <Input
                label="University"
                type="text"
                name="university"
                value={editData.university}
                onChange={handleEditChange}
              />

              <div className="form-row">
                <Input
                  label="Major"
                  type="text"
                  name="major"
                  value={editData.major}
                  onChange={handleEditChange}
                />
                <Input
                  label="GPA"
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  name="gpa"
                  value={editData.gpa}
                  onChange={handleEditChange}
                />
              </div>

              <Textarea
                label="Bio"
                name="bio"
                value={editData.bio}
                onChange={handleEditChange}
                placeholder="Tell us about yourself..."
              />

              <div className="form-actions">
                <Button variant="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            // View Mode
            <div className="profile-info-grid">
              <div className="info-group">
                <label>University</label>
                <p>{profileData.university}</p>
              </div>
              <div className="info-group">
                <label>Major</label>
                <p>{profileData.major}</p>
              </div>
              <div className="info-group">
                <label>GPA</label>
                <p>{profileData.gpa}</p>
              </div>
              <div className="info-group">
                <label>Phone</label>
                <p>{profileData.phone}</p>
              </div>
            </div>
          )}

          {!isEditing && (
            <>
              <Divider />
              <div className="profile-bio">
                <h3>About</h3>
                <p>{profileData.bio}</p>
              </div>
            </>
          )}
        </Card>

        {/* Sidebar */}
        <aside className="profile-sidebar">
          {/* Documents Card */}
          <Card className="sidebar-card">
            <h3>📄 Documents</h3>
            <p className="card-subtitle">{documents.length} documents uploaded</p>
            <div className="documents-list">
              {documents.map((doc) => (
                <div key={doc.id} className="document-item">
                  <div className="document-icon">📋</div>
                  <div className="document-info">
                    <p className="document-name">{doc.name}</p>
                    <span className="document-date">{formatDate(doc.date)}</span>
                  </div>
                  <button className="document-action">↓</button>
                </div>
              ))}
            </div>
            <Button variant="secondary" block className="mt-lg">
              + Upload Document
            </Button>
          </Card>

          {/* Application Stats */}
          <Card className="sidebar-card">
            <h3>📊 Statistics</h3>
            <div className="stats-list">
              <div className="stat-row">
                <span>Applications</span>
                <span className="stat-value">{appliedScholarships.length}</span>
              </div>
              <div className="stat-row">
                <span>Pending</span>
                <span className="stat-value">
                  {
                    appliedScholarships.filter(
                      (s) => getApplicationStatus(s.id)?.status === 'pending'
                    ).length
                  }
                </span>
              </div>
              <div className="stat-row">
                <span>Approved</span>
                <span className="stat-value">0</span>
              </div>
              <div className="stat-row">
                <span>Total Amount</span>
                <span className="stat-value highlight">
                  ${appliedScholarships.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
        </aside>
      </div>

      {/* Application History */}
      {appliedScholarships.length > 0 && (
        <Card className="history-card">
          <h2>Application History</h2>
          <div className="timeline">
            {applicationHistory.map((app) => (
              <div key={app.id} className="timeline-item">
                <div className={`timeline-marker status-${app.status}`}></div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <h4>{app.title}</h4>
                    <span className={`status-badge status-${app.status}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="timeline-date">Applied: {app.appliedDate}</p>
                  <p className="timeline-details">
                    Award Amount: ${app.amount.toLocaleString()} • Deadline:{' '}
                    {formatDate(app.deadline)} ({app.daysLeft} days left)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default StudentProfile;
