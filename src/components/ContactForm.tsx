import { useState, type FormEvent, type ChangeEvent } from 'react';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  contact?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  dogName: string;
  service: string;
  message: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  dogName: '',
  service: '',
  message: '',
};

function ContactForm() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (formData.phone.trim()) {
      const phoneRegex = /^[\d\s\-()+ ]{7,}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    if (!formData.email.trim() && !formData.phone.trim()) {
      newErrors.contact = 'Please provide an email or phone number';
    }

    return newErrors;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
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
        setFormData(initialFormData);
        setErrors({});
      } else {
        setFormState('error');
      }
    } catch {
      setFormState('error');
    }
  };

  const inputStyle = (hasError: boolean) => ({
    width: '100%',
    padding: 'var(--space-md)',
    fontSize: 'var(--text-base)',
    fontFamily: 'inherit',
    border: `2px solid ${hasError ? 'var(--color-error)' : 'var(--color-sand)'}`,
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--color-surface)',
    transition: 'border-color 150ms ease',
  });

  if (formState === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
        <span style={{ fontSize: '4rem' }}>🎉</span>
        <h3 style={{ marginTop: 'var(--space-md)' }}>Message Sent!</h3>
        <p style={{ color: 'var(--color-text-muted)' }}>Thanks for reaching out! I'll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form 
      name="contact" 
      method="POST" 
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="form-name" value="contact" />
      <p style={{ display: 'none' }}>
        <label>
          Don't fill this out if you're human: 
          <input name="bot-field" />
        </label>
      </p>

      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <label htmlFor="name" style={{ display: 'block', fontWeight: 500, marginBottom: 'var(--space-sm)' }}>
          Your Name <span style={{ color: 'var(--color-primary)' }}>*</span>
        </label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          autoComplete="name"
          style={inputStyle(!!errors.name)}
          value={formData.name}
          onChange={handleChange}
          disabled={formState === 'submitting'}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <span id="name-error" role="alert" style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)' }}>{errors.name}</span>
        )}
      </div>

      <fieldset style={{ border: 'none', padding: 0, marginBottom: 'var(--space-lg)' }}>
        <legend style={{ fontWeight: 500, marginBottom: 'var(--space-sm)' }}>
          How can we reach you? <span style={{ color: 'var(--color-primary)' }}>*</span>
        </legend>
        {errors.contact && (
          <p id="contact-error" role="alert" style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-sm)' }}>
            {errors.contact}
          </p>
        )}
        
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <label htmlFor="email" style={{ display: 'block', fontWeight: 500, marginBottom: 'var(--space-sm)' }}>
            Email Address
          </label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            autoComplete="email"
            style={inputStyle(!!errors.email || !!errors.contact)}
            value={formData.email}
            onChange={handleChange}
            disabled={formState === 'submitting'}
            aria-invalid={!!errors.email || !!errors.contact}
            aria-describedby={[errors.email && 'email-error', errors.contact && 'contact-error'].filter(Boolean).join(' ') || undefined}
          />
          {errors.email && (
            <span id="email-error" role="alert" style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)' }}>{errors.email}</span>
          )}
        </div>

        <div>
          <label htmlFor="phone" style={{ display: 'block', fontWeight: 500, marginBottom: 'var(--space-sm)' }}>
            Phone Number
          </label>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            autoComplete="tel"
            style={inputStyle(!!errors.phone || !!errors.contact)}
            value={formData.phone}
            onChange={handleChange}
            disabled={formState === 'submitting'}
            aria-invalid={!!errors.phone || !!errors.contact}
            aria-describedby={[errors.phone && 'phone-error', errors.contact && 'contact-error'].filter(Boolean).join(' ') || undefined}
          />
          {errors.phone && (
            <span id="phone-error" role="alert" style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)' }}>{errors.phone}</span>
          )}
        </div>
      </fieldset>

      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <label htmlFor="service" style={{ display: 'block', fontWeight: 500, marginBottom: 'var(--space-sm)' }}>
          Service Interested In
        </label>
        <select 
          id="service" 
          name="service" 
          style={inputStyle(false)}
          value={formData.service}
          onChange={handleChange}
          disabled={formState === 'submitting'}
        >
          <option value="">Select a service...</option>
          <option value="in-home">In-Home Dog Sitting</option>
          <option value="overnight">Overnight Stays</option>
          <option value="daily-visits">Daily Drop-In Visits</option>
          <option value="adventure-walks">Extended Adventure Walks</option>
          <option value="vacation">Vacation Care Package</option>
          <option value="puppy">Puppy Care</option>
          <option value="other">Other / Not Sure</option>
        </select>
      </div>

      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <label htmlFor="dogName" style={{ display: 'block', fontWeight: 500, marginBottom: 'var(--space-sm)' }}>
          Dog's Name
        </label>
        <input 
          type="text" 
          id="dogName" 
          name="dogName" 
          style={inputStyle(false)}
          value={formData.dogName}
          onChange={handleChange}
          disabled={formState === 'submitting'}
        />
      </div>

      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <label htmlFor="message" style={{ display: 'block', fontWeight: 500, marginBottom: 'var(--space-sm)' }}>
          Anything else we should know?
        </label>
        <textarea 
          id="message" 
          name="message" 
          style={{ ...inputStyle(false), minHeight: '150px', resize: 'vertical' }}
          placeholder="Special needs, preferred dates, questions..."
          value={formData.message}
          onChange={handleChange}
          disabled={formState === 'submitting'}
        />
      </div>

      {formState === 'error' && (
        <div style={{ 
          padding: 'var(--space-md)', 
          backgroundColor: 'var(--color-error-bg)', 
          color: 'var(--color-error)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-lg)'
        }}>
          Oops! Something went wrong. Please try again or email me directly.
        </div>
      )}

      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={formState === 'submitting'}
        style={{ width: '100%' }}
      >
        {formState === 'submitting' ? 'Sending...' : 'Request a Callback'}
      </button>
    </form>
  );
}

export default ContactForm;

