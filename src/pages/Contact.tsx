import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
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

function Contact() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

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

  const scrollToFirstError = (formErrors: FormErrors) => {
    const errorFields = ['name', 'email', 'phone', 'contact'] as const;
    for (const field of errorFields) {
      if (formErrors[field]) {
        const element = document.getElementById(field === 'contact' ? 'email' : field);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
          break;
        }
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  };

  const businessEmail = settings?.email || 'hello@jessdogsitting.com';
  const businessPhone = settings?.phone || '(123) 456-7890';
  const serviceArea = settings?.location || 'Your Local Area & Surroundings';
  const instagramUrl = settings?.socialLinks?.instagram || 'https://instagram.com';
  const facebookUrl = settings?.socialLinks?.facebook || 'https://facebook.com';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      scrollToFirstError(formErrors);
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

                  <div className={`form-group ${errors.name ? styles.hasError : ''}`}>
                    <label htmlFor="name" className="form-label">Your Name <span className={styles.requiredHint}>*</span></label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      autoComplete="name"
                      className={`form-input ${errors.name ? styles.inputError : ''}`}
                      value={formData.name}
                      onChange={handleChange}
                      disabled={formState === 'submitting'}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && (
                      <span id="name-error" className={styles.fieldError}>{errors.name}</span>
                    )}
                  </div>

                  <fieldset className={`${styles.contactFieldset} ${errors.contact ? styles.hasError : ''}`}>
                    <legend className={styles.contactLegend}>
                      How can we reach you? <span className={styles.requiredHint}>*</span>
                    </legend>
                    {errors.contact && (
                      <p className={styles.contactHintError}>{errors.contact}</p>
                    )}
                    
                    <div className={`form-group ${errors.email ? styles.hasError : ''}`}>
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        autoComplete="email"
                        className={`form-input ${errors.email || errors.contact ? styles.inputError : ''}`}
                        value={formData.email}
                        onChange={handleChange}
                        disabled={formState === 'submitting'}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                      />
                      {errors.email && (
                        <span id="email-error" className={styles.fieldError}>{errors.email}</span>
                      )}
                    </div>

                    <div className={`form-group ${errors.phone ? styles.hasError : ''}`}>
                      <label htmlFor="phone" className="form-label">Phone Number</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        autoComplete="tel"
                        className={`form-input ${errors.phone || errors.contact ? styles.inputError : ''}`}
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={formState === 'submitting'}
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                      />
                      {errors.phone && (
                        <span id="phone-error" className={styles.fieldError}>{errors.phone}</span>
                      )}
                    </div>
                  </fieldset>

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

                  <div className="form-group">
                    <label htmlFor="message" className="form-label">Anything else we should know?</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      className="form-textarea"
                      placeholder="Special needs, preferred dates, questions..."
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
                    {formState === 'submitting' ? 'Sending...' : 'Request a Callback'}
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
                    <a href={`mailto:${businessEmail}`}>{businessEmail}</a>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📞</span>
                  <div>
                    <strong>Phone</strong>
                    <a href={`tel:${businessPhone.replace(/\D/g, '')}`}>{businessPhone}</a>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📍</span>
                  <div>
                    <strong>Service Area</strong>
                    <span>{serviceArea}</span>
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
                    href={instagramUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    📸 Instagram
                  </a>
                  <a 
                    href={facebookUrl}
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
