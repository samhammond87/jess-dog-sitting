import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getServices, urlFor, type Service } from '../lib/sanity';
import styles from './Services.module.css';

// Fallback data
const fallbackServices: Service[] = [
  {
    _id: '1',
    icon: '🏠',
    title: 'In-Home Dog Sitting',
    description: 'Your pup stays comfortable in their own home while I provide personalized love, walks, and care. Perfect for dogs who prefer their familiar environment.',
    price: 'From $45/visit',
    features: [
      'Feeding & fresh water',
      '30-minute walk included',
      'Playtime & enrichment',
      'Medication administration',
      'Photo updates',
    ],
  },
  {
    _id: '2',
    icon: '🌙',
    title: 'Overnight Stays',
    description: "Sleepovers with cuddles! I stay the night at your home to ensure your dog is never alone. They'll wake up to breakfast and belly rubs.",
    price: 'From $75/night',
    features: [
      'Evening & morning care',
      'Two walks daily',
      'Overnight companionship',
      'Feeding on schedule',
      'Bedtime routine maintained',
    ],
  },
  {
    _id: '3',
    icon: '🚶',
    title: 'Daily Drop-In Visits',
    description: "Perfect for busy days when you need a helping hand. I'll pop in for walks, feeding, playtime, and lots of love.",
    price: 'From $30/visit',
    features: [
      '30-minute visit',
      'Walk or potty break',
      'Fresh food & water',
      'Quick play session',
      'Status updates',
    ],
  },
];

function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await getServices();
        setServices(data.length > 0 ? data : fallbackServices);
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices(fallbackServices);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  return (
    <div className={styles.services}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Dog Sitting Services</h1>
          <p className={styles.subtitle}>
            They'll have the best time! Every service is tailored with love and attention.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className={`section ${styles.servicesSection}`}>
        <div className="container">
          <div className={styles.servicesGrid}>
            {!loading && services.map((service, index) => (
              <div 
                key={service._id} 
                className={`card ${styles.serviceCard}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={styles.serviceHeader}>
                  {service.image ? (
                    <img 
                      src={urlFor(service.image).width(80).height(80).url()} 
                      alt={service.title}
                      className={styles.serviceImage}
                    />
                  ) : (
                    <span className={styles.serviceIcon}>{service.icon || '🐕'}</span>
                  )}
                  <div>
                    <h2 className={styles.serviceTitle}>{service.title}</h2>
                    {service.price && <span className={styles.servicePrice}>{service.price}</span>}
                  </div>
                </div>
                <p className={styles.serviceDescription}>{service.description}</p>
                {service.features && service.features.length > 0 && (
                  <ul className={styles.featureList}>
                    {service.features.map((feature, i) => (
                      <li key={i} className={styles.featureItem}>
                        <span className={styles.checkmark}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
                <Link to="/contact" className="btn btn-primary">
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className={styles.expectSection}>
        <div className="container">
          <h2 className="section-title" style={{ color: 'var(--color-white)' }}>
            What to Expect
          </h2>
          <div className={styles.expectGrid}>
            <div className={styles.expectCard}>
              <span className={styles.expectNumber}>1</span>
              <h3>Meet & Greet</h3>
              <p>Free initial meeting to learn about your pup and discuss your needs.</p>
            </div>
            <div className={styles.expectCard}>
              <span className={styles.expectNumber}>2</span>
              <h3>Personalized Plan</h3>
              <p>We create a care plan that fits your dog's routine and personality.</p>
            </div>
            <div className={styles.expectCard}>
              <span className={styles.expectNumber}>3</span>
              <h3>Care & Updates</h3>
              <p>Your pup gets the best care while you receive photos and updates.</p>
            </div>
            <div className={styles.expectCard}>
              <span className={styles.expectNumber}>4</span>
              <h3>Happy Reunion</h3>
              <p>Pick up a happy, tired pup who can't wait for their next visit!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`section ${styles.ctaSection}`}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Book?</h2>
            <p className={styles.ctaSubtitle}>
              Let's schedule a free meet & greet with your furry friend!
            </p>
            <Link to="/contact" className="btn btn-primary">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;
