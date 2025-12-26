import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getServices, getTermsPolicies, urlFor, type Service, type TermsPolicy } from '../lib/sanity';
import styles from './Pricing.module.css';

// Fallback data if Sanity isn't configured
const fallbackServices = [
  {
    _id: 'drop-in',
    icon: '🐕',
    title: 'Drop-In Visit',
    price: '$130/visit',
    description: '30-minute check-in for potty breaks, feeding, and quick play',
    features: [
      '30-minute visit',
      'Feeding & fresh water',
      'Potty break or short walk',
      'Playtime & cuddles',
      'Photo update',
    ],
  },
  {
    _id: 'day-sitting',
    icon: '☀️',
    title: 'Day Sitting',
    price: '$145/day',
    description: "Full daytime care while you're at work or running errands",
    features: [
      'Up to 10 hours of care',
      'Two walks included',
      'Feeding on schedule',
      'Enrichment activities',
      'Multiple photo updates',
    ],
  },
  {
    _id: 'overnight',
    icon: '🌙',
    title: 'Overnight Stay',
    price: '$175/night',
    description: 'I stay at your home overnight for round-the-clock care',
    features: [
      'Evening to morning care',
      'Bedtime routine maintained',
      'Morning & evening walks',
      'All meals included',
      'Overnight companionship',
    ],
  },
];

const addOns = [
  { name: 'Extended Walk (60 min)', price: '+$15' },
  { name: 'Additional Pet (same household)', price: '+$10/day' },
  { name: 'Bath & Brush', price: '+$25' },
  { name: 'Holiday Rate', price: '+50%' },
  { name: 'Last-Minute Booking (<24hrs)', price: '+$15' },
  { name: 'Puppy Care (under 1 year)', price: '+$10/day' },
];

const fallbackTerms: TermsPolicy[] = [
  {
    _id: '1',
    title: 'Booking Policy',
    icon: '📅',
    items: [
      'A free meet & greet is required before the first booking',
      'Bookings are confirmed upon receipt of a 50% deposit',
      'Remaining balance is due on the first day of service',
      'Holiday bookings require full payment in advance',
    ],
  },
  {
    _id: '2',
    title: 'Cancellation Policy',
    icon: '❌',
    items: [
      '7+ days notice: Full refund',
      '3-6 days notice: 50% refund',
      'Less than 48 hours: No refund',
      'No-shows: Full charge applies',
    ],
  },
  {
    _id: '3',
    title: 'Pet Requirements',
    icon: '🐕',
    items: [
      'Dogs must be up-to-date on vaccinations',
      'Proof of vaccination required before first visit',
      'Dogs must be flea/tick treated',
      'Please inform me of any behavioral issues',
    ],
  },
];

function Pricing() {
  const [services, setServices] = useState<Service[]>([]);
  const [terms, setTerms] = useState<TermsPolicy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [servicesData, termsData] = await Promise.all([
          getServices(),
          getTermsPolicies(),
        ]);
        setServices(servicesData.length > 0 ? servicesData : fallbackServices as Service[]);
        setTerms(termsData.length > 0 ? termsData : fallbackTerms);
      } catch (error) {
        console.error('Error fetching data:', error);
        setServices(fallbackServices as Service[]);
        setTerms(fallbackTerms);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className={styles.pricing}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Pricing & Terms</h1>
          <p className={styles.subtitle}>
            Transparent pricing with no hidden fees. Your pup deserves the best!
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className={`section ${styles.pricingSection}`}>
        <div className="container">
          <h2 className="section-title">Service Rates</h2>
          <p className="section-subtitle">
            All prices are for one dog. Multi-pet discounts available!
          </p>
          
          <div className={styles.pricingGrid}>
            {!loading && services.map((service, index) => (
              <div 
                key={service._id} 
                className={`${styles.pricingCard} ${index === 0 ? styles.popular : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {index === 0 && <span className={styles.popularBadge}>Most Popular</span>}
                <div className={styles.cardHeader}>
                  {service.image ? (
                    <img 
                      src={urlFor(service.image).width(80).height(80).url()} 
                      alt={service.title}
                      className={styles.serviceImage}
                    />
                  ) : (
                    <span className={styles.serviceIcon}>{service.icon || '🐕'}</span>
                  )}
                  <h3 className={styles.tierName}>{service.title}</h3>
                </div>
                {service.price && (
                  <div className={styles.priceWrapper}>
                    <span className={styles.price}>{service.price}</span>
                  </div>
                )}
                <p className={styles.tierDescription}>{service.description}</p>
                {service.features && service.features.length > 0 && (
                  <ul className={styles.featureList}>
                    {service.features.map((feature, i) => (
                      <li key={i}>
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

      {/* Add-Ons */}
      <section className={styles.addOnsSection}>
        <div className="container">
          <h2 className="section-title" style={{ color: 'var(--color-white)' }}>
            Add-Ons & Extras
          </h2>
          <div className={styles.addOnsGrid}>
            {addOns.map((addon, index) => (
              <div key={index} className={styles.addOnItem}>
                <span className={styles.addOnName}>{addon.name}</span>
                <span className={styles.addOnPrice}>{addon.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Terms & Conditions */}
      <section className={`section ${styles.termsSection}`}>
        <div className="container">
          <div className={styles.termsContent}>
            <h2 className={styles.termsTitle}>Terms & Conditions</h2>
            
            <div className={styles.termsGrid}>
              {terms.map((policy) => (
                <div key={policy._id} className={styles.termsCard}>
                  <h3>{policy.icon || '📋'} {policy.title}</h3>
                  {policy.items && policy.items.length > 0 && (
                    <ul>
                      {policy.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.termsFooter}>
              <p>
                By booking my services, you agree to these terms and conditions. 
                If you have any questions, please don't hesitate to <Link to="/contact">get in touch</Link>!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2>Ready to Book?</h2>
            <p>Let's schedule that meet & greet!</p>
            <Link to="/contact" className="btn btn-primary">
              Contact Me
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Pricing;
