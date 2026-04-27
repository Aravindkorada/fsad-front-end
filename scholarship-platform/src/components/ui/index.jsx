import React from 'react';
import { Modal } from './Modal';
import '../../styles/components.css';

export const Button = React.forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      disabled = false,
      block = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const btnClass = `btn btn-${variant} btn-${size} ${block ? 'btn-block' : ''} ${className}`.trim();
    return (
      <button ref={ref} className={btnClass} disabled={disabled} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export const Card = ({ className = '', children, ...props }) => (
  <div className={`card ${className}`.trim()} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ className = '', children, ...props }) => (
  <div className={`card-header ${className}`.trim()} {...props}>
    {children}
  </div>
);

export const CardBody = ({ className = '', children, ...props }) => (
  <div className={`card-body ${className}`.trim()} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className = '', children, ...props }) => (
  <div className={`card-footer ${className}`.trim()} {...props}>
    {children}
  </div>
);

export const Badge = ({ variant = 'default', children, className = '', ...props }) => (
  <span className={`badge badge-${variant} ${className}`.trim()} {...props}>
    {children}
  </span>
);

export const Input = React.forwardRef(
  ({ error = false, label, hint, className = '', ...props }, ref) => (
    <div className="form-group">
      {label && <label className="form-label required">{label}</label>}
      <input
        ref={ref}
        className={`form-input ${error ? 'error' : ''} ${className}`.trim()}
        {...props}
      />
      {error && <div className="form-error">{error}</div>}
      {hint && <div className="form-hint">{hint}</div>}
    </div>
  )
);

Input.displayName = 'Input';

export const Textarea = React.forwardRef(
  ({ error = false, label, hint, className = '', ...props }, ref) => (
    <div className="form-group">
      {label && <label className="form-label required">{label}</label>}
      <textarea
        ref={ref}
        className={`form-textarea ${error ? 'error' : ''} ${className}`.trim()}
        {...props}
      />
      {error && <div className="form-error">{error}</div>}
      {hint && <div className="form-hint">{hint}</div>}
    </div>
  )
);

Textarea.displayName = 'Textarea';

export const Select = React.forwardRef(
  ({ error = false, label, hint, options = [], className = '', ...props }, ref) => (
    <div className="form-group">
      {label && <label className="form-label required">{label}</label>}
      <select
        ref={ref}
        className={`form-select ${error ? 'error' : ''} ${className}`.trim()}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <div className="form-error">{error}</div>}
      {hint && <div className="form-hint">{hint}</div>}
    </div>
  )
);

Select.displayName = 'Select';

export const Checkbox = React.forwardRef(
  ({ label, error = false, className = '', ...props }, ref) => (
    <div className="form-group">
      <label className="form-checkbox">
        <input
          ref={ref}
          type="checkbox"
          className={`form-checkbox-input ${className}`.trim()}
          {...props}
        />
        <span>{label}</span>
      </label>
      {error && <div className="form-error">{error}</div>}
    </div>
  )
);

Checkbox.displayName = 'Checkbox';

export const Spinner = ({ size = 'md' }) => (
  <div className={`spinner spinner-${size}`} role="status">
    <span className="sr-only">Loading...</span>
  </div>
);

export const Alert = ({ variant = 'info', title, children, onClose, className = '' }) => (
  <div className={`alert alert-${variant} ${className}`.trim()} role="alert">
    <div className="alert-content">
      {title && <h4 className="alert-title">{title}</h4>}
      <div className="alert-message">{children}</div>
    </div>
    {onClose && (
      <button className="alert-close" onClick={onClose}>
        ✕
      </button>
    )}
  </div>
);

export const Divider = () => <hr className="divider" />;

export const Tag = ({ children, variant = 'default', onRemove, className = '' }) => (
  <span className={`tag tag-${variant} ${className}`.trim()}>
    {children}
    {onRemove && (
      <button className="tag-remove" onClick={onRemove}>
        ✕
      </button>
    )}
  </span>
);

export { Modal };
