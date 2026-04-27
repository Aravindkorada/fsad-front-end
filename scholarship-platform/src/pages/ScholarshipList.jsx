import React, { useState, useMemo } from 'react';
import { useScholarship } from '../contexts/ScholarshipContext';
import { useNotification } from '../contexts/NotificationContext';
import ScholarshipCard from '../components/ScholarshipCard';
import { Input, Button } from '../components/ui/index';
import { filterAndSearch, filterByCategory, filterByAmount, sortByDeadline, sortByAmount } from '../utils/validation';
import '../styles/scholarship-list.css';

const CATEGORIES = ['All', 'Technology', 'STEM', 'Arts', 'Leadership', 'Engineering', 'Medical', 'Business', 'Environment', 'Community Service', 'Education'];

export const ScholarshipList = () => {
  const { scholarships } = useScholarship();
  const { addNotification } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(['All']);
  const [amountRange, setAmountRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('deadline');

  const filteredScholarships = useMemo(() => {
    let result = [...scholarships];

    // Search
    result = filterAndSearch(result, searchTerm, ['title', 'description', 'category']);

    // Category filter
    const validCategories = selectedCategories.filter((cat) => cat !== 'All');
    if (validCategories.length > 0) {
      result = filterByCategory(result, validCategories);
    }

    // Amount filter
    result = filterByAmount(result, amountRange[0], amountRange[1]);

    // Sort
    if (sortBy === 'deadline') {
      result = sortByDeadline(result);
    } else if (sortBy === 'amount-asc') {
      result = sortByAmount(result, 'asc');
    } else if (sortBy === 'amount-desc') {
      result = sortByAmount(result, 'desc');
    }

    return result;
  }, [scholarships, searchTerm, selectedCategories, amountRange, sortBy]);

  const handleCategoryToggle = (category) => {
    if (category === 'All') {
      setSelectedCategories(['All']);
    } else {
      let updated = selectedCategories.filter((cat) => cat !== 'All');
      if (updated.includes(category)) {
        updated = updated.filter((cat) => cat !== category);
      } else {
        updated = [...updated, category];
      }
      setSelectedCategories(updated.length === 0 ? ['All'] : updated);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategories(['All']);
    setAmountRange([0, 10000]);
    setSortBy('deadline');
    addNotification('Filters reset successfully', 'info');
  };

  return (
    <div className="scholarship-list-container">
      <div className="list-header">
        <div>
          <h1>Scholarships</h1>
          <p>Explore and apply for scholarships that match your profile</p>
        </div>
        <div className="result-count">
          {filteredScholarships.length} scholarship{filteredScholarships.length !== 1 ? 's' : ''} found
        </div>
      </div>

      <div className="list-content">
        {/* Sidebar - Filters */}
        <aside className="list-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Search</h3>
            <Input
              type="text"
              placeholder="Search scholarships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Categories</h3>
            <div className="category-filter">
              {CATEGORIES.map((category) => (
                <label key={category} className="category-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                  />
                  <span>{category}</span>
                  <span className="category-count">
                    ({scholarships.filter((s) => !category || s.category === category).length})
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Amount Range</h3>
            <div className="amount-range">
              <div className="range-input">
                <label>Min: ${amountRange[0].toLocaleString()}</label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  value={amountRange[0]}
                  onChange={(e) => setAmountRange([parseInt(e.target.value), amountRange[1]])}
                />
              </div>
              <div className="range-input">
                <label>Max: ${amountRange[1].toLocaleString()}</label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  value={amountRange[1]}
                  onChange={(e) => setAmountRange([amountRange[0], parseInt(e.target.value)])}
                />
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Sort By</h3>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="deadline">Deadline (Nearest First)</option>
              <option value="amount-desc">Amount (Highest First)</option>
              <option value="amount-asc">Amount (Lowest First)</option>
            </select>
          </div>

          <Button variant="secondary" block onClick={handleResetFilters}>
            Reset Filters
          </Button>
        </aside>

        {/* Main Content - Scholarships Grid */}
        <main className="list-main">
          {filteredScholarships.length === 0 ? (
            <div className="empty-state">
              <h3>No scholarships found</h3>
              <p>Try adjusting your filters or search term to find more scholarships.</p>
              <Button variant="primary" onClick={handleResetFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="scholarships-grid">
              {filteredScholarships.map((scholarship) => (
                <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ScholarshipList;
