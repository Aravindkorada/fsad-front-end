import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useScholarship } from '../contexts/ScholarshipContext';
import { useNotification } from '../contexts/NotificationContext';
import { Button, Card, Input, Textarea, Checkbox, Alert } from '../components/ui/index';
import { Modal } from '../components/ui/Modal';
import { validateForm } from '../utils/validation';
import '../styles/scholarship-detail.css';

const validationSchema = {
  fullName: { required: true, label: 'Full Name', minLength: 2 },
  email: { required: true, label: 'Email', type: 'email' },
  phone: { required: true, label: 'Phone', type: 'phone' },
  gpa: { required: true, label: 'GPA', type: 'gpa' },
  essayTopic: { required: true, label: 'Essay Topic', minLength: 10 },
  documents: { required: true, label: 'Supporting Documents' },
  agreeToTerms: { required: true, label: 'Terms Agreement' },
};

export const ScholarshipDetail = () => {
  const { scholarshipId } = useParams();
  const navigate = useNavigate();
  const { scholarships, applyForScholarship, getApplicationStatus, isApplied } = useScholarship();
  const { addNotification } = useNotification();

  const scholarship = scholarships.find((s) => s.id.toString() === scholarshipId.toString());
  const applicationStatus = scholarship ? getApplicationStatus(scholarship.id) : null;
  const hasApplied = scholarship ? isApplied(scholarship.id) : false;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gpa: '',
    essayTopic: '',
    documents: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (!scholarship) {
    return (
      <div className="detail-container">
        <Alert variant="danger">
          <h4>Scholarship not found</h4>
          <p>The scholarship you're looking for doesn't exist.</p>
        </Alert>
        <Button variant="primary" onClick={() => navigate('/scholarships')}>
          Back to Scholarships
        </Button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm(formData, validationSchema);
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      addNotification('Please fix the errors in the form', 'error');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      try {
        applyForScholarship(scholarship.id, formData);
        addNotification('Application submitted successfully!', 'success');
        setShowModal(true);
        
        setTimeout(() => {
          setShowModal(false);
          navigate('/dashboard');
        }, 3000);
      } catch (error) {
        addNotification('Failed to submit application', 'error');
      } finally {
        setIsSubmitting(false);
      }
    }, 1000);
  };

  return (
    <div className="detail-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="detail-content">
        {/* Scholarship Info */}
        <Card className="detail-card">
          <div className="detail-header">
            <div>
              <h1 className="detail-title">{scholarship.title || scholarship.name}</h1>
              <p className="detail-description">{scholarship.fullDescription || scholarship.description}</p>
            </div>
            <div className="detail-amount">${scholarship.amount.toLocaleString()}</div>
          </div>

          <div className="detail-info-grid">
            <div className="info-item">
              <span className="info-label">Category</span>
              <span className="info-value">{scholarship.category}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Deadline</span>
              <span className="info-value">{new Date(scholarship.deadline).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Application Status</span>
              <span className={`info-value ${hasApplied ? 'applied' : 'available'}`}>
                {hasApplied ? '✓ Already Applied' : 'Open for Applications'}
              </span>
            </div>
          </div>
        </Card>

        {/* Eligibility & Requirements */}
        <Card className="detail-card">
          <h2>Eligibility & Requirements</h2>
          <ul className="requirements-list">
            {(Array.isArray(scholarship.eligibility) 
              ? scholarship.eligibility 
              : (scholarship.eligibility || '').split('\n').filter(r => r.trim())
            ).map((requirement, index) => (
              <li key={index}>{requirement}</li>
            ))}
          </ul>
        </Card>

        {/* Application Form */}
        {!hasApplied && (
          <Card className="detail-card">
            <h2>Submit Your Application</h2>
            <form onSubmit={handleSubmit} className="application-form">
              <Input
                label="Full Name"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.fullName ? errors.fullName : ''}
                placeholder="John Doe"
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email ? errors.email : ''}
                placeholder="your@email.com"
              />

              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone ? errors.phone : ''}
                placeholder="+1 (555) 123-4567"
              />

              <Input
                label="Current GPA"
                type="number"
                step="0.01"
                min="0"
                max="4"
                name="gpa"
                value={formData.gpa}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.gpa ? errors.gpa : ''}
                placeholder="3.8"
              />

              <Textarea
                label="Essay Topic / Application Statement"
                name="essayTopic"
                value={formData.essayTopic}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.essayTopic ? errors.essayTopic : ''}
                placeholder="Tell us why you deserve this scholarship..."
                hint="Minimum 10 characters"
              />

              <Input
                label="Supporting Documents"
                type="text"
                name="documents"
                value={formData.documents}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.documents ? errors.documents : ''}
                placeholder="PDF, DOCX file upload link or description"
              />

              <Checkbox
                label="I agree to the scholarship terms and conditions"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                error={touched.agreeToTerms ? errors.agreeToTerms : ''}
              />

              <div className="form-actions">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Already Applied */}
        {hasApplied && (
          <Card className="detail-card">
            <Alert variant="success" title="Application Already Submitted">
              <p>
                You have already applied for this scholarship on{' '}
                <strong>{applicationStatus?.appliedDate}</strong>. The status of your application is{' '}
                <strong>{applicationStatus?.status}</strong>.
              </p>
            </Alert>
          </Card>
        )}
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showModal}
        title="Application Submitted"
        size="md"
        closeOnEscape={false}
        closeOnBackdropClick={false}
      >
        <div className="success-modal-content">
          <div className="success-icon">✓</div>
          <h3>Application Submitted Successfully!</h3>
          <p>We've received your application for the {scholarship.title} scholarship.</p>
          <p>You will receive updates about your application status via email.</p>
          <div className="mt-lg">
            <Button variant="primary" block onClick={() => navigate('/dashboard')}>
              View My Dashboard
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ScholarshipDetail;
