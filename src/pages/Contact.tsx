import { useState, useEffect, type FormEvent, type FocusEvent, type ChangeEvent } from 'react';
import { getSiteSettings, type SiteSettings } from '../lib/sanity';
import styles from './Contact.module.css';

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

const validateName = (value: string): string | undefined => {
  if (!value.trim()) return 'Name is required';
  if (value.trim().length < 2) return 'Name must be at least 2 characters';
  return undefined;
};

const validateEmail = (value: string): string | undefined => {
  if (!value.trim()) return undefined;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return 'Please enter a valid email address';
  return undefined;
};

const validatePhone = (value: string): string | undefined => {
  if (!value.trim()) return undefined;
  const phoneRegex = /^[\d\s\-()+ ]{7,}$/;
  if (!phoneRegex.test(value)) return 'Please enter a valid phone number';
  return undefined;
};

const validateContact = (email: string, phone: string): string | undefined => {
  if (!email.trim() && !phone.trim()) {
    return 'Please provide an email or phone number so we can reach you';
  }
  return undefined;
};

function Contact() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getSiteSettings();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    }
    fetchSettings();
  }, []);

  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'name': return validateName(value);
      case 'email': return validateEmail(value);
      case 'phone': return validatePhone(value);
      default: return undefined;
    }
  };

  const validateAllFields = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormData>).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field as keyof FormErrors] = error;
        isValid = false;
      }
    });

    const contactError = validateContact(formData.email, formData.phone);
    if (contactError) {
      newErrors.contact = contactError;
      isValid = false;
    }

    setErrors(newErrors);
    setTouched({ name: true, email: true, phone: true });
    return isValid;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    
    if (touched[name] && errors[name as keyof FormErrors]) {
      const error = validateField(name as keyof FormData, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
    
    if ((name === 'email' || name === 'phone') && errors.contact) {
      const contactError = validateContact(
        name === 'email' ? value : newFormData.email,
        name === 'phone' ? value : newFormData.phone
      );
      setErrors((prev) => ({ ...prev, contact: contactError }));
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    const error = validateField(name as keyof FormData, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    
    if (name === 'email' || name === 'phone') {
      const contactError = validateContact(
        name === 'email' ? value : formData.email,
        name === 'phone' ? value : formData.phone
      );
      setErrors((prev) => ({ ...prev, contact: contactError }));
    }
  };

  const email = settings?.email || 'hello@jessdogsitting.com';
  const phone = settings?.phone || '(123) 456-7890';
  const location = settings?.location || 'Your Local Area & Surroundings';
  const instagram = settings?.socialLinks?.instagram || 'https://instagram.com';
  const facebook = settings?.socialLinks?.facebook || 'https://facebook.com';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate all fields before submitting
    if (!validateAllFields()) {
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
        setTouched({});
        form.reset();
      } else {
        setFormState('error');
      }
    } catch {
      setFormState('error');
    }
  };

  return (
    <div className={styles.contact}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Get in Touch</h1>
          <p className={styles.subtitle}>
            Ready to give your pup the best care? Let's chat!
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className={`section ${styles.contactSection}`}>
        <div className="container">
          <div className={styles.contactGrid}>
            {/* Contact Form */}
            <div className={styles.formWrapper}>
              <h2 className={styles.formTitle}>Send a Message</h2>
              <p className={styles.formSubtitle}>
                Fill out the form below and I'll get back to you within 24 hours!
              </p>

              {formState === 'success' ? (
                <div className={styles.successMessage}>
                  <span className={styles.successIcon}>🎉</span>
                  <h3>Message Sent!</h3>
                  <p>Thanks for reaching out! I'll get back to you soon.</p>
                </div>
              ) : (
                <form 
                  name="contact" 
                  method="POST" 
                  data-netlify="true"
                  data-netlify-honeypot="bot-field"
                  onSubmit={handleSubmit}
                  className={styles.form}
                >
                  <input type="hidden" name="form-name" value="contact" />
                  <p className={styles.hidden}>
                    <label>
                      Don't fill this out if you're human: 
                      <input name="bot-field" />
                    </label>
                  </p>

                  <div className={styles.formRow}>
                    <div className={`form-group ${touched.name && errors.name ? styles.hasError : ''}`}>
                      <label htmlFor="name" className="form-label">Your Name *</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        className={`form-input ${touched.name && errors.name ? styles.inputError : ''}`}
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={formState === 'submitting'}
                        aria-invalid={touched.name && !!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                      />
                      {touched.name && errors.name && (
                        <span id="name-error" className={styles.fieldError}>{errors.name}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="dogName" className="form-label">Dog's Name</label>
                      <input 
                        type="text" 
                        id="dogName" 
                        name="dogName" 
                        className="form-input"
                        value={formData.dogName}
                        onChange={handleChange}
                        disabled={formState === 'submitting'}
                      />
                    </div>
                  </div>

                  <div className={styles.contactFieldsWrapper}>
                    <p className={styles.contactFieldsLabel}>
                      How can we reach you? <span className={styles.requiredNote}>(email or phone required)</span>
                    </p>
                    <div className={styles.formRow}>
                      <div className={`form-group ${touched.email && errors.email ? styles.hasError : ''}`}>
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input 
                          type="email" 
                          id="email" 
                          name="email" 
                          className={`form-input ${(touched.email && errors.email) || errors.contact ? styles.inputError : ''}`}
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={formState === 'submitting'}
                          aria-invalid={touched.email && !!errors.email}
                          aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                        {touched.email && errors.email && (
                          <span id="email-error" className={styles.fieldError}>{errors.email}</span>
                        )}
                      </div>
                      <div className={`form-group ${touched.phone && errors.phone ? styles.hasError : ''}`}>
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <input 
                          type="tel" 
                          id="phone" 
                          name="phone" 
                          className={`form-input ${(touched.phone && errors.phone) || errors.contact ? styles.inputError : ''}`}
                          value={formData.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={formState === 'submitting'}
                          aria-invalid={touched.phone && !!errors.phone}
                          aria-describedby={errors.phone ? 'phone-error' : undefined}
                        />
                        {touched.phone && errors.phone && (
                          <span id="phone-error" className={styles.fieldError}>{errors.phone}</span>
                        )}
                      </div>
                    </div>
                    {errors.contact && (
                      <span className={styles.fieldError}>{errors.contact}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="service" className="form-label">Service Interested In</label>
                    <select 
                      id="service" 
                      name="service" 
                      className="form-input"
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

                  <div className="form-group">
                    <label htmlFor="message" className="form-label">
                      Anything else you'd like to share? <span className={styles.optionalNote}>(optional)</span>
                    </label>
                    <textarea 
                      id="message" 
                      name="message" 
                      className="form-textarea"
                      placeholder="Tell me about your dog's personality, any special needs, dates you're looking for..."
                      value={formData.message}
                      onChange={handleChange}
                      disabled={formState === 'submitting'}
                    />
                  </div>

                  {formState === 'error' && (
                    <div className={styles.errorMessage}>
                      Oops! Something went wrong. Please try again or email me directly.
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={formState === 'submitting'}
                  >
                    {formState === 'submitting' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className={styles.infoWrapper}>
              <div className={styles.infoCard}>
                <h3 className={styles.infoTitle}>Other Ways to Reach Me</h3>
                
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📧</span>
                  <div>
                    <strong>Email</strong>
                    <a href={`mailto:${email}`}>{email}</a>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📞</span>
                  <div>
                    <strong>Phone</strong>
                    <a href={`tel:${phone.replace(/\D/g, '')}`}>{phone}</a>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📍</span>
                  <div>
                    <strong>Service Area</strong>
                    <span>{location}</span>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>⏰</span>
                  <div>
                    <strong>Response Time</strong>
                    <span>Usually within 24 hours</span>
                  </div>
                </div>
              </div>

              <div className={styles.socialCard}>
                <h3 className={styles.infoTitle}>Follow Along!</h3>
                <p>See daily adventures and happy pups on social media.</p>
                <div className={styles.socialLinks}>
                  <a 
                    href={instagram}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    📸 Instagram
                  </a>
                  <a 
                    href={facebook}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    👍 Facebook
                  </a>
                </div>
              </div>

              <div className={styles.faqCard}>
                <h3 className={styles.infoTitle}>Quick FAQs</h3>
                <div className={styles.faqItem}>
                  <strong>Do you offer meet & greets?</strong>
                  <p>Yes! Free initial meetings are included so we can all get acquainted.</p>
                </div>
                <div className={styles.faqItem}>
                  <strong>What if my dog has special needs?</strong>
                  <p>No problem! I'm experienced with medication, dietary restrictions, and more.</p>
                </div>
                <div className={styles.faqItem}>
                  <strong>How far in advance should I book?</strong>
                  <p>For regular visits, a few days is fine. For holidays, book 2-4 weeks ahead.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
