import { useState, type FormEvent, type ChangeEvent } from 'react';
import type { BookingQuestion } from '../lib/sanity';

interface BookingFormProps {
  questions: BookingQuestion[];
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  contact?: string;
  [key: string]: string | undefined;
}

// Group labels for display
const groupLabels: Record<string, string> = {
  'contact': 'Contact Details',
  'dog-info': 'Dog Information',
  'medical': 'Medical & Health',
  'behavior': 'Behavior & Personality',
  'care': 'Care Requirements',
  'emergency': 'Emergency & Vet',
  'other': 'Other Information',
};

function BookingForm({ questions }: BookingFormProps) {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState<Record<string, string | boolean | string[]>>({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Group questions by their group field
  const groupedQuestions = questions.reduce<Record<string, BookingQuestion[]>>((acc, q) => {
    const group = q.group || 'other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(q);
    return acc;
  }, {});

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name || String(formData.name).trim().length < 2) {
      newErrors.name = 'Name is required (at least 2 characters)';
    }

    if (formData.email && String(formData.email).trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(formData.email))) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (formData.phone && String(formData.phone).trim()) {
      const phoneRegex = /^[\d\s\-()+ ]{7,}$/;
      if (!phoneRegex.test(String(formData.phone))) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    if (!String(formData.email || '').trim() && !String(formData.phone || '').trim()) {
      newErrors.contact = 'Please provide an email or phone number';
    }

    // Validate required questions
    questions.forEach((q) => {
      if (q.required) {
        const value = formData[`q_${q._id}`];
        const isEmpty = 
          value === undefined || 
          value === '' || 
          value === false ||
          (Array.isArray(value) && value.length === 0);
        if (isEmpty) {
          newErrors[`q_${q._id}`] = 'This field is required';
        }
      }
    });

    return newErrors;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  };

  // Handler for multi-select checkboxes
  const handleCheckboxesChange = (fieldName: string, option: string, checked: boolean) => {
    setFormData((prev) => {
      const currentValues = Array.isArray(prev[fieldName]) ? prev[fieldName] as string[] : [];
      const newValues = checked
        ? [...currentValues, option]
        : currentValues.filter((v) => v !== option);
      return { ...prev, [fieldName]: newValues };
    });

    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      
      // Scroll to first error
      const firstErrorKey = Object.keys(formErrors)[0];
      // Map special error keys to actual element IDs
      const elementId = firstErrorKey === 'contact' ? 'email' : firstErrorKey;
      const errorElement = document.getElementById(elementId) || 
                          document.querySelector(`[name="${elementId}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Focus the element if it's focusable
        if (errorElement instanceof HTMLElement) {
          errorElement.focus({ preventScroll: true });
        }
      }
      return;
    }

    setFormState('submitting');

    const form = e.currentTarget;
    const formDataObj = new FormData(form);

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formDataObj as unknown as Record<string, string>).toString(),
      });

      if (response.ok) {
        setFormState('success');
      } else {
        setFormState('error');
      }
    } catch {
      setFormState('error');
    }
  };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    padding: 'var(--space-md)',
    fontSize: 'var(--text-base)',
    fontFamily: 'inherit',
    border: `2px solid ${hasError ? 'var(--color-error)' : 'var(--color-sand)'}`,
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-surface)',
    transition: 'border-color 150ms ease',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontWeight: 500,
    marginBottom: 'var(--space-sm)',
  };

  const fieldStyle: React.CSSProperties = {
    marginBottom: 'var(--space-lg)',
  };

  if (formState === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
        <span style={{ fontSize: '4rem' }}>🎉</span>
        <h3 style={{ marginTop: 'var(--space-md)' }}>Questionnaire Submitted!</h3>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Thanks for your interest! I'll review your answers and get back to you within 24 hours to arrange a meet & greet.
        </p>
      </div>
    );
  }

  const renderQuestion = (q: BookingQuestion) => {
    const fieldName = `q_${q._id}`;
    const hasError = !!errors[fieldName];
    const value = formData[fieldName] ?? '';

    switch (q.questionType) {
      case 'text':
        return (
          <input
            type="text"
            id={fieldName}
            name={fieldName}
            style={inputStyle(hasError)}
            value={String(value)}
            onChange={handleChange}
            disabled={formState === 'submitting'}
          />
        );

      case 'textarea':
        return (
          <textarea
            id={fieldName}
            name={fieldName}
            style={{ ...inputStyle(hasError), minHeight: '100px', resize: 'vertical' }}
            value={String(value)}
            onChange={handleChange}
            disabled={formState === 'submitting'}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={fieldName}
            name={fieldName}
            style={{ ...inputStyle(hasError), maxWidth: '150px' }}
            value={String(value)}
            onChange={handleChange}
            disabled={formState === 'submitting'}
          />
        );

      case 'checkbox':
        return (
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              id={fieldName}
              name={fieldName}
              checked={Boolean(value)}
              onChange={handleChange}
              disabled={formState === 'submitting'}
              style={{ width: '20px', height: '20px' }}
            />
            <span>Yes</span>
          </label>
        );

      case 'radio':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {q.options?.map((option, idx) => (
              <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name={fieldName}
                  value={option}
                  checked={value === option}
                  onChange={handleChange}
                  disabled={formState === 'submitting'}
                  style={{ width: '18px', height: '18px' }}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkboxes': {
        const selectedValues = Array.isArray(formData[fieldName]) ? formData[fieldName] as string[] : [];
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {q.options?.map((option, idx) => (
              <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name={`${fieldName}[]`}
                  value={option}
                  checked={selectedValues.includes(option)}
                  onChange={(e) => handleCheckboxesChange(fieldName, option, e.target.checked)}
                  disabled={formState === 'submitting'}
                  style={{ width: '18px', height: '18px' }}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      }

      case 'select':
        return (
          <select
            id={fieldName}
            name={fieldName}
            style={inputStyle(hasError)}
            value={String(value)}
            onChange={handleChange}
            disabled={formState === 'submitting'}
          >
            <option value="">Select an option...</option>
            {q.options?.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <form
      name="booking"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="form-name" value="booking" />
      <p style={{ display: 'none' }}>
        <label>
          Don't fill this out if you're human:
          <input name="bot-field" />
        </label>
      </p>

      {/* Fixed contact fields */}
      <div style={{ ...fieldStyle, padding: 'var(--space-lg)', background: 'var(--color-cream)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-xl)' }}>
        <h3 style={{ marginBottom: 'var(--space-lg)', fontSize: 'var(--text-lg)' }}>Your Details</h3>
        
        <div style={fieldStyle}>
          <label htmlFor="name" style={labelStyle}>
            Your Name <span style={{ color: 'var(--color-primary)' }}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            autoComplete="name"
            style={inputStyle(!!errors.name)}
            value={String(formData.name)}
            onChange={handleChange}
            disabled={formState === 'submitting'}
          />
          {errors.name && (
            <span style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)' }}>{errors.name}</span>
          )}
        </div>

        <div style={fieldStyle}>
          <label htmlFor="email" style={labelStyle}>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            style={inputStyle(!!errors.email || !!errors.contact)}
            value={String(formData.email)}
            onChange={handleChange}
            disabled={formState === 'submitting'}
          />
          {errors.email && (
            <span style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)' }}>{errors.email}</span>
          )}
        </div>

        <div style={fieldStyle}>
          <label htmlFor="phone" style={labelStyle}>
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            autoComplete="tel"
            style={inputStyle(!!errors.phone || !!errors.contact)}
            value={String(formData.phone)}
            onChange={handleChange}
            disabled={formState === 'submitting'}
          />
          {errors.phone && (
            <span style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)' }}>{errors.phone}</span>
          )}
        </div>

        {errors.contact && (
          <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)', marginTop: 'calc(-1 * var(--space-md))' }}>
            {errors.contact}
          </p>
        )}
      </div>

      {/* Dynamic questions grouped by section */}
      {Object.entries(groupedQuestions).map(([group, groupQuestions]) => (
        <div key={group} style={{ marginBottom: 'var(--space-xl)' }}>
          <h3 style={{ marginBottom: 'var(--space-lg)', fontSize: 'var(--text-lg)', color: 'var(--color-primary)' }}>
            {groupLabels[group] || group}
          </h3>
          
          {groupQuestions.map((q) => (
            <div key={q._id} style={fieldStyle}>
              <label htmlFor={`q_${q._id}`} style={labelStyle}>
                {q.questionText}
                {q.required && <span style={{ color: 'var(--color-primary)' }}> *</span>}
              </label>
              {q.description && (
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-sm)' }}>
                  {q.description}
                </p>
              )}
              {renderQuestion(q)}
              {errors[`q_${q._id}`] && (
                <span style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)' }}>
                  {errors[`q_${q._id}`]}
                </span>
              )}
            </div>
          ))}
        </div>
      ))}

      {formState === 'error' && (
        <div
          style={{
            padding: 'var(--space-md)',
            backgroundColor: 'var(--color-error-bg)',
            color: 'var(--color-error)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-lg)',
          }}
        >
          Oops! Something went wrong. Please try again or email me directly.
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        disabled={formState === 'submitting'}
        style={{ width: '100%' }}
      >
        {formState === 'submitting' ? 'Submitting...' : 'Submit Questionnaire'}
      </button>
    </form>
  );
}

export default BookingForm;

