import { useState, type FormEvent } from 'react';
import styles from './Contact.module.css';

function Contact() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('submitting');
    
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      // Netlify Forms handles the submission
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
      });

      if (response.ok) {
        setFormState('success');
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
                  netlify-honeypot="bot-field"
                  onSubmit={handleSubmit}
                  className={styles.form}
                >
                  {/* Netlify hidden fields */}
                  <input type="hidden" name="form-name" value="contact" />
                  <p className={styles.hidden}>
                    <label>
                      Don't fill this out if you're human: 
                      <input name="bot-field" />
                    </label>
                  </p>

                  <div className={styles.formRow}>
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">Your Name *</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        className="form-input"
                        required 
                        disabled={formState === 'submitting'}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">Email Address *</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        className="form-input"
                        required 
                        disabled={formState === 'submitting'}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">Phone Number</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        className="form-input"
                        disabled={formState === 'submitting'}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="dogName" className="form-label">Dog's Name *</label>
                      <input 
                        type="text" 
                        id="dogName" 
                        name="dogName" 
                        className="form-input"
                        required 
                        disabled={formState === 'submitting'}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="service" className="form-label">Service Interested In</label>
                    <select 
                      id="service" 
                      name="service" 
                      className="form-input"
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
                    <label htmlFor="message" className="form-label">Tell Me About Your Pup *</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      className="form-textarea"
                      placeholder="Tell me about your dog's personality, any special needs, and what dates you're looking for..."
                      required 
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
                    <a href="mailto:hello@jessdogsitting.com">hello@jessdogsitting.com</a>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📞</span>
                  <div>
                    <strong>Phone</strong>
                    <a href="tel:+1234567890">(123) 456-7890</a>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📍</span>
                  <div>
                    <strong>Service Area</strong>
                    <span>Your Local Area & Surroundings</span>
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
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    📸 Instagram
                  </a>
                  <a 
                    href="https://facebook.com" 
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

