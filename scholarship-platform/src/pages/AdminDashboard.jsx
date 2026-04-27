import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useScholarship } from '../contexts/ScholarshipContext';
import { useNotification } from '../contexts/NotificationContext';
import { Button, Card, Input, Modal, Badge } from '../components/ui';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { scholarships, applications, addScholarship, updateScholarship, deleteScholarship, approveApplication, rejectApplication } = useScholarship();
  const { addNotification } = useNotification();

  const [activeTab, setActiveTab] = useState('scholarships');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    provider: '',
    amount: '',
    deadline: '',
    description: '',
    requirements: '',
    status: 'active',
    category: '',
    eligibility: ''
  });

  // Filter and sort scholarships
  const filteredScholarships = scholarships
    .filter(scholarship => {
      const matchesSearch = scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          scholarship.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          scholarship.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || scholarship.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'amount') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (sortBy === 'deadline') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Filter applications
  const filteredApplications = applications
    .filter(application => {
      const matchesSearch = application.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          application.scholarshipName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          application.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || application.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.provider || !formData.amount) {
      addNotification('Please fill in all required fields', 'error');
      return;
    }

    const scholarshipData = {
      ...formData,
      title: formData.name,
      fullDescription: formData.description,
      id: editingScholarship ? editingScholarship.id : Date.now().toString(),
      amount: parseFloat(formData.amount),
      createdAt: editingScholarship ? editingScholarship.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingScholarship) {
      updateScholarship(scholarshipData);
      addNotification('Scholarship updated successfully', 'success');
    } else {
      addScholarship(scholarshipData);
      addNotification('Scholarship added successfully', 'success');
    }

    setIsModalOpen(false);
    setEditingScholarship(null);
    resetForm();
  };

  const handleEdit = (scholarship) => {
    setEditingScholarship(scholarship);
    setFormData({
      name: scholarship.name,
      provider: scholarship.provider,
      amount: scholarship.amount.toString(),
      deadline: scholarship.deadline,
      description: scholarship.description,
      requirements: scholarship.requirements,
      status: scholarship.status,
      category: scholarship.category,
      eligibility: scholarship.eligibility
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this scholarship?')) {
      deleteScholarship(id);
      addNotification('Scholarship deleted successfully', 'success');
    }
  };

  const handleApproveApplication = (applicationId) => {
    if (window.confirm('Are you sure you want to approve this application?')) {
      approveApplication(applicationId);
      addNotification('Application approved successfully', 'success');
    }
  };

  const handleRejectApplication = (applicationId) => {
    if (window.confirm('Are you sure you want to reject this application?')) {
      rejectApplication(applicationId);
      addNotification('Application rejected successfully', 'success');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      provider: '',
      amount: '',
      deadline: '',
      description: '',
      requirements: '',
      status: 'active',
      category: '',
      eligibility: ''
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { variant: 'success', label: 'Active' },
      inactive: { variant: 'secondary', label: 'Inactive' },
      expired: { variant: 'danger', label: 'Expired' },
      draft: { variant: 'warning', label: 'Draft' },
      pending: { variant: 'warning', label: 'Pending' },
      approved: { variant: 'success', label: 'Approved' },
      rejected: { variant: 'danger', label: 'Rejected' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-title">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user?.name || 'Admin'}</p>
          </div>
          <div className="admin-actions">
            <Button
              variant="outline"
              onClick={logout}
              className="logout-btn"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="admin-content">
        {/* Tab Navigation */}
        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === 'scholarships' ? 'active' : ''}`}
            onClick={() => setActiveTab('scholarships')}
          >
            Scholarship Management
          </button>
          <button
            className={`tab-button ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            Application Review
          </button>
        </div>

        {activeTab === 'scholarships' && (
          <>
            <div className="dashboard-stats">
              <Card className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">{scholarships.length}</div>
                  <div className="stat-label">Total Scholarships</div>
                </div>
                <div className="stat-icon">📚</div>
              </Card>
              <Card className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">
                    {scholarships.filter(s => s.status === 'active').length}
                  </div>
                  <div className="stat-label">Active Scholarships</div>
                </div>
                <div className="stat-icon">✅</div>
              </Card>
              <Card className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">
                    {scholarships.filter(s => new Date(s.deadline) < new Date()).length}
                  </div>
                  <div className="stat-label">Expired Scholarships</div>
                </div>
                <div className="stat-icon">⏰</div>
              </Card>
              <Card className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">
                    {scholarships.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0).toLocaleString()}
                  </div>
                  <div className="stat-label">Total Value</div>
                </div>
                <div className="stat-icon">💰</div>
              </Card>
            </div>

            <Card className="scholarships-management">
              <div className="management-header">
                <h2>Scholarship Management</h2>
                <Button
                  onClick={() => {
                    setEditingScholarship(null);
                    resetForm();
                    setIsModalOpen(true);
                  }}
                  className="add-scholarship-btn"
                >
                  Add Scholarship
                </Button>
              </div>

              <div className="filters-section">
                <div className="search-filter">
                  <Input
                    type="text"
                    placeholder="Search scholarships..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                <div className="status-filter">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="expired">Expired</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="scholarships-table-container">
                <table className="scholarships-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('name')} className="sortable">
                        Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => handleSort('provider')} className="sortable">
                        Provider {sortBy === 'provider' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => handleSort('amount')} className="sortable">
                        Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th onClick={() => handleSort('deadline')} className="sortable">
                        Deadline {sortBy === 'deadline' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredScholarships.map(scholarship => (
                      <tr key={scholarship.id}>
                        <td className="scholarship-name">
                          <div className="name-content">
                            <strong>{scholarship.name}</strong>
                            <small>{scholarship.category}</small>
                          </div>
                        </td>
                        <td>{scholarship.provider}</td>
                        <td>{formatCurrency(scholarship.amount)}</td>
                        <td>{formatDate(scholarship.deadline)}</td>
                        <td>{getStatusBadge(scholarship.status)}</td>
                        <td>
                          <div className="action-buttons">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(scholarship)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(scholarship.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredScholarships.length === 0 && (
                  <div className="no-results">
                    <p>No scholarships found matching your criteria.</p>
                  </div>
                )}
              </div>
            </Card>
          </>
        )}

        {activeTab === 'applications' && (
          <>
            <div className="dashboard-stats">
              <Card className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">{applications.length}</div>
                  <div className="stat-label">Total Applications</div>
                </div>
                <div className="stat-icon">📋</div>
              </Card>
              <Card className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">
                    {applications.filter(app => app.status === 'pending').length}
                  </div>
                  <div className="stat-label">Pending Review</div>
                </div>
                <div className="stat-icon">⏳</div>
              </Card>
              <Card className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">
                    {applications.filter(app => app.status === 'approved').length}
                  </div>
                  <div className="stat-label">Approved</div>
                </div>
                <div className="stat-icon">✅</div>
              </Card>
              <Card className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">
                    {applications.filter(app => app.status === 'rejected').length}
                  </div>
                  <div className="stat-label">Rejected</div>
                </div>
                <div className="stat-icon">❌</div>
              </Card>
            </div>

            <Card className="applications-management">
              <div className="management-header">
                <h2>Application Review</h2>
              </div>

              <div className="filters-section">
                <div className="search-filter">
                  <Input
                    type="text"
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                <div className="status-filter">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="applications-table-container">
                <table className="applications-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Scholarship</th>
                      <th>Applied Date</th>
                      <th>GPA</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map(application => (
                      <tr key={application.id}>
                        <td className="student-info">
                          <div className="student-content">
                            <strong>{application.studentName}</strong>
                            <small>{application.studentEmail}</small>
                            <small>{application.major}</small>
                          </div>
                        </td>
                        <td>{application.scholarshipName}</td>
                        <td>{formatDate(application.appliedDate)}</td>
                        <td>{application.gpa}</td>
                        <td>{getStatusBadge(application.status)}</td>
                        <td>
                          <div className="action-buttons">
                            {application.status === 'pending' && (
                              <>
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => handleApproveApplication(application.id)}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleRejectApplication(application.id)}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            {application.status !== 'pending' && (
                              <span className="status-text">
                                {application.status === 'approved' ? 'Approved' : 'Rejected'}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredApplications.length === 0 && (
                  <div className="no-results">
                    <p>No applications found matching your criteria.</p>
                  </div>
                )}
              </div>
            </Card>
          </>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingScholarship(null);
          resetForm();
        }}
        title={editingScholarship ? 'Edit Scholarship' : 'Add New Scholarship'}
      >
        <form onSubmit={handleSubmit} className="scholarship-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Scholarship Name *</label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="provider">Provider *</label>
              <Input
                id="provider"
                type="text"
                value={formData.provider}
                onChange={(e) => setFormData({...formData, provider: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Amount *</label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                placeholder="0.00"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="deadline">Deadline</label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <Input
                id="category"
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="e.g., Academic, Sports, Arts"
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="form-select"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              placeholder="Brief description of the scholarship..."
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="requirements">Requirements</label>
            <textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              rows={3}
              placeholder="Eligibility requirements and application criteria..."
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="eligibility">Eligibility</label>
            <textarea
              id="eligibility"
              value={formData.eligibility}
              onChange={(e) => setFormData({...formData, eligibility: e.target.value})}
              rows={2}
              placeholder="Who can apply for this scholarship..."
              className="form-textarea"
            />
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingScholarship(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingScholarship ? 'Update Scholarship' : 'Add Scholarship'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
