// Form validation utilities
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) ? '' : 'Invalid email address';
};

export const validateRequired = (value, fieldName) => {
  return value.trim() ? '' : `${fieldName} is required`;
};

export const validateMinLength = (value, length, fieldName) => {
  return value.length >= length ? '' : `${fieldName} must be at least ${length} characters`;
};

export const validatePhone = (phone) => {
  const regex = /^[\d\s\-\+\(\)]+$/;
  return regex.test(phone) && phone.replace(/\D/g, '').length >= 10 ? '' : 'Invalid phone number';
};

export const validateGPA = (gpa) => {
  const value = parseFloat(gpa);
  return value >= 0 && value <= 4 ? '' : 'GPA must be between 0 and 4';
};

export const validateURL = (url) => {
  try {
    new URL(url);
    return '';
  } catch {
    return 'Invalid URL';
  }
};

// Form validation function
export const validateForm = (values, schema) => {
  const errors = {};

  Object.keys(schema).forEach((field) => {
    const value = values[field];
    const rules = schema[field];

    if (rules.required) {
      const error = validateRequired(String(value || ''), rules.label || field);
      if (error) {
        errors[field] = error;
        return;
      }
    }

    if (rules.type === 'email') {
      const error = validateEmail(value);
      if (error) errors[field] = error;
    }

    if (rules.type === 'phone') {
      const error = validatePhone(value);
      if (error) errors[field] = error;
    }

    if (rules.type === 'gpa') {
      const error = validateGPA(value);
      if (error) errors[field] = error;
    }

    if (rules.minLength) {
      const error = validateMinLength(String(value || ''), rules.minLength, rules.label || field);
      if (error) errors[field] = error;
    }
  });

  return errors;
};

// Date utilities
export const calculateDaysLeft = (deadline) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getDeadlineStatus = (deadline) => {
  const daysLeft = calculateDaysLeft(deadline);
  if (daysLeft <= 0) return { status: 'closed', color: 'danger' };
  if (daysLeft <= 7) return { status: 'urgent', color: 'warning' };
  return { status: 'open', color: 'success' };
};

// Array utilities
export const filterAndSearch = (items, searchTerm, searchFields) => {
  if (!searchTerm) return items;

  const lowerSearchTerm = searchTerm.toLowerCase();
  return items.filter((item) =>
    searchFields.some(
      (field) =>
        item[field]?.toString().toLowerCase().includes(lowerSearchTerm)
    )
  );
};

export const filterByCategory = (items, categories) => {
  if (!categories || categories.length === 0) return items;
  return items.filter((item) => categories.includes(item.category));
};

export const filterByAmount = (items, minAmount, maxAmount) => {
  return items.filter((item) => item.amount >= minAmount && item.amount <= maxAmount);
};

export const sortByDeadline = (items) => {
  return [...items].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
};

export const sortByAmount = (items, order = 'asc') => {
  return [...items].sort((a, b) => (order === 'asc' ? a.amount - b.amount : b.amount - a.amount));
};
