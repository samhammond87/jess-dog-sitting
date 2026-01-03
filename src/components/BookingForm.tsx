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

// Canonical group order and labels
const GROUP_ORDER = ['contact', 'dog-info', 'medical', 'behavior', 'care', 'emergency', 'other'] as const;

const groupLabels: Record<string, string> = {
  'contact': 'Contact Details',
  'dog-info': 'Dog Information',
  'medical': 'Medical & Health',
  'behavior': 'Behavior & Personality',
  'care': 'Care Requirements',
  'emergency': 'Emergency & Vet',
  'other': 'Other Information',
};

// Helper to combine class names
function cx(...classes: (string | false | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Slugify question text for readable form field names
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50); // Keep it reasonable length
}

// Generate a readable field name from question text (with short ID suffix for uniqueness)
function getFieldName(q: BookingQuestion): string {
  const slug = slugify(q.questionText);
  const shortId = q._id.slice(0, 6); // First 6 chars of ID for uniqueness
  return `${slug}-${shortId}`;
}

function BookingForm({ questions }: BookingFormProps) {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState<Record<string, string | boolean | string[]>>({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Group questions by their group field, maintaining canonical order
  const groupedQuestions = questions.reduce<Record<string, BookingQuestion[]>>((acc, q) => {
    const group = q.group || 'other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(q);
    return acc;
  }, {});

  // Sort groups by canonical order, sort questions within each group by order
  const sortedGroups = GROUP_ORDER
    .filter((g) => groupedQuestions[g]?.length > 0)
    .map((g) => [g, groupedQuestions[g].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))] as const);

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
    // Note: For checkbox (yes/no), false is a valid answer ("No"), only undefined is empty
    questions.forEach((q) => {
      if (q.required) {
        const value = formData[getFieldName(q)];
        const isEmpty = 
          value === undefined || 
          value === '' ||
          (Array.isArray(value) && value.length === 0);
        if (isEmpty) {
          newErrors[getFieldName(q)] = 'This field is required';
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

    // Clear only the specific field's error (and contact error for email/phone)
    if (errors[name] || (name === 'email' || name === 'phone') && errors.contact) {
      setErrors((prev) => {
        const next = { ...prev, [name]: undefined };
        if (name === 'email' || name === 'phone') {
          next.contact = undefined;
        }
        return next;
      });
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

    // Clear only this field's error
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
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
      // Try: direct ID, wrapper ID (for radio/checkboxes), or name attribute
      const errorElement = document.getElementById(elementId) || 
                          document.getElementById(`${elementId}-wrapper`) ||
                          document.querySelector(`[name="${elementId}"]`) ||
                          document.querySelector(`[name="${elementId}[]"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Focus the first input within the wrapper if it's a wrapper, otherwise focus directly
        const focusTarget = errorElement.querySelector('input, textarea, select') || errorElement;
        if (focusTarget instanceof HTMLElement) {
          focusTarget.focus({ preventScroll: true });
        }
      }
      return;
    }

    setFormState('submitting');

    const form = e.currentTarget;
    const formDataObj = new FormData(form);

    try {
      // Build params safely - handles repeated keys (multi-select) correctly
      const params = new URLSearchParams();
      formDataObj.forEach((value, key) => params.append(key, String(value)));

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
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

  if (formState === 'success') {
    return (
      <div className="booking-form__success">
        <span className="booking-form__success-icon">🎉</span>
        <h3 className="booking-form__success-title">Questionnaire Submitted!</h3>
        <p className="booking-form__success-text">
          Thanks for your interest! I'll review your answers and get back to you within 24 hours to arrange a meet & greet.
        </p>
      </div>
    );
  }

  const renderQuestion = (q: BookingQuestion) => {
    const fieldName = getFieldName(q);
    const hasError = !!errors[fieldName];
    const value = formData[fieldName] ?? '';
    const isDisabled = formState === 'submitting';

    switch (q.questionType) {
      case 'text':
        return (
          <input
            type="text"
            id={fieldName}
            name={fieldName}
            className={cx('booking-form__input', hasError && 'booking-form__input--error')}
            value={String(value)}
            onChange={handleChange}
            disabled={isDisabled}
          />
        );

      case 'textarea':
        return (
          <textarea
            id={fieldName}
            name={fieldName}
            className={cx('booking-form__textarea', hasError && 'booking-form__textarea--error')}
            value={String(value)}
            onChange={handleChange}
            disabled={isDisabled}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={fieldName}
            name={fieldName}
            className={cx('booking-form__input', 'booking-form__input--number', hasError && 'booking-form__input--error')}
            value={String(value)}
            onChange={handleChange}
            disabled={isDisabled}
          />
        );

      case 'checkbox':
        return (
          <div id={`${fieldName}-wrapper`} className="booking-form__option-group booking-form__option-group--inline" role="radiogroup">
            <label className="booking-form__option-label">
              <input
                type="radio"
                name={fieldName}
                value="Yes"
                className="booking-form__radio"
                checked={value === 'Yes'}
                onChange={handleChange}
                disabled={isDisabled}
              />
              <span>Yes</span>
            </label>
            <label className="booking-form__option-label">
              <input
                type="radio"
                name={fieldName}
                value="No"
                className="booking-form__radio"
                checked={value === 'No'}
                onChange={handleChange}
                disabled={isDisabled}
              />
              <span>No</span>
            </label>
          </div>
        );

      case 'radio':
        return (
          <div id={`${fieldName}-wrapper`} className="booking-form__option-group" role="radiogroup">
            {q.options?.map((option, idx) => {
              const optionId = `${fieldName}_${idx}`;
              return (
                <label key={idx} className="booking-form__option-label" htmlFor={optionId}>
                  <input
                    id={optionId}
                    type="radio"
                    name={fieldName}
                    value={option}
                    className="booking-form__radio"
                    checked={value === option}
                    onChange={handleChange}
                    disabled={isDisabled}
                  />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
        );

      case 'checkboxes': {
        const selectedValues = Array.isArray(formData[fieldName]) ? formData[fieldName] as string[] : [];
        return (
          <div id={`${fieldName}-wrapper`} className="booking-form__option-group" role="group">
            {q.options?.map((option, idx) => {
              const optionId = `${fieldName}_${idx}`;
              return (
                <label key={idx} className="booking-form__option-label" htmlFor={optionId}>
                  <input
                    id={optionId}
                    type="checkbox"
                    name={`${fieldName}[]`}
                    value={option}
                    className="booking-form__checkbox"
                    checked={selectedValues.includes(option)}
                    onChange={(e) => handleCheckboxesChange(fieldName, option, e.target.checked)}
                    disabled={isDisabled}
                  />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
        );
      }

      case 'select':
        return (
          <select
            id={fieldName}
            name={fieldName}
            className={cx('booking-form__select', hasError && 'booking-form__select--error')}
            value={String(value)}
            onChange={handleChange}
            disabled={isDisabled}
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

  const isDisabled = formState === 'submitting';

  return (
    <form
      name="booking"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="form-name" value="booking" />
      <p className="booking-form__honeypot">
        <label>
          Don't fill this out if you're human:
          <input name="bot-field" />
        </label>
      </p>

      {/* Fixed contact fields */}
      <div className="booking-form__contact-section">
        <h3 className="booking-form__section-title">Your Details</h3>
        
        <div className="booking-form__field">
          <label htmlFor="name" className="booking-form__label">
            Your Name <span className="booking-form__required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            autoComplete="name"
            className={cx('booking-form__input', errors.name && 'booking-form__input--error')}
            value={String(formData.name)}
            onChange={handleChange}
            disabled={isDisabled}
          />
          {errors.name && <span className="booking-form__error">{errors.name}</span>}
        </div>

        <div className="booking-form__field">
          <label htmlFor="email" className="booking-form__label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            className={cx('booking-form__input', (errors.email || errors.contact) && 'booking-form__input--error')}
            value={String(formData.email)}
            onChange={handleChange}
            disabled={isDisabled}
          />
          {errors.email && <span className="booking-form__error">{errors.email}</span>}
        </div>

        <div className="booking-form__field">
          <label htmlFor="phone" className="booking-form__label">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            autoComplete="tel"
            className={cx('booking-form__input', (errors.phone || errors.contact) && 'booking-form__input--error')}
            value={String(formData.phone)}
            onChange={handleChange}
            disabled={isDisabled}
          />
          {errors.phone && <span className="booking-form__error">{errors.phone}</span>}
        </div>

        {errors.contact && <p className="booking-form__contact-error">{errors.contact}</p>}
      </div>

      {/* Dynamic questions grouped by section */}
      {sortedGroups.map(([group, groupQuestions]) => (
        <div key={group} className="booking-form__group">
          <h3 className="booking-form__group-title">
            {groupLabels[group] || group}
          </h3>
          
          {groupQuestions.map((q) => {
            const fieldName = getFieldName(q);
            const isGroupedInput = q.questionType === 'radio' || q.questionType === 'checkboxes';
            
            return (
              <div key={q._id} className="booking-form__field">
                {/* Use span for grouped inputs (no single target ID), label for others */}
                {isGroupedInput ? (
                  <span className="booking-form__label">
                    {q.questionText}
                    {q.required && <span className="booking-form__required"> *</span>}
                  </span>
                ) : (
                  <label htmlFor={fieldName} className="booking-form__label">
                    {q.questionText}
                    {q.required && <span className="booking-form__required"> *</span>}
                  </label>
                )}
                {q.description && <p className="booking-form__helper">{q.description}</p>}
                {renderQuestion(q)}
                {errors[fieldName] && (
                  <span className="booking-form__error">{errors[fieldName]}</span>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {formState === 'error' && (
        <div className="booking-form__error-banner">
          Oops! Something went wrong. Please try again or email me directly.
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary booking-form__submit"
        disabled={isDisabled}
      >
        {isDisabled ? 'Submitting...' : 'Submit Questionnaire'}
      </button>
    </form>
  );
}

export default BookingForm;
