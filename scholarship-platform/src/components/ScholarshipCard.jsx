import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge, Button } from './ui/index';
import { useScholarship } from '../contexts/ScholarshipContext';
import { getDeadlineStatus, calculateDaysLeft, formatDate } from '../utils/validation';
import '../styles/scholarship-card.css';

export const ScholarshipCard = ({ scholarship, showFullDesc = false }) => {
  const { isApplied } = useScholarship();
  const applied = isApplied(scholarship.id);
  const deadlineStatus = getDeadlineStatus(scholarship.deadline);
  const daysLeft = calculateDaysLeft(scholarship.deadline);

  return (
    <Card className="scholarship-card animate-fade">
      <div className="scholarship-card-header">
        <div>
          <h3 className="scholarship-card-title">{scholarship.title || scholarship.name}</h3>
          <Badge variant={deadlineStatus.color} className="mt-sm">
            {daysLeft} days left
          </Badge>
        </div>
        <div className="scholarship-amount">${scholarship.amount.toLocaleString()}</div>
      </div>

      <div className="scholarship-card-body">
        <div className="scholarship-category">
          <span className="category-badge">{scholarship.category}</span>
        </div>
        
        <p className="scholarship-description">
          {showFullDesc ? (scholarship.fullDescription || scholarship.description) : scholarship.description}
        </p>

        <div className="scholarship-deadline">
          <span className="label">Deadline:</span>
          <span className="value">{formatDate(scholarship.deadline)}</span>
        </div>
      </div>

      <div className="scholarship-card-footer">
        <Link to={`/scholarship/${scholarship.id}`} className="flex-1">
          <Button variant="secondary" block className="scholarship-view-btn">
            View Details
          </Button>
        </Link>
        <Link to={`/scholarship/${scholarship.id}`} className="flex-1">
          <Button
            variant={applied ? 'secondary' : 'primary'}
            block
            disabled={applied}
            className="scholarship-apply-btn"
          >
            {applied ? 'Applied' : 'Apply Now'}
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default ScholarshipCard;
