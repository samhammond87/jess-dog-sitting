import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getServices, getTestimonials, getSiteSettings, urlFor, type Service, type Testimonial, type SiteSettings } from '../lib/sanity';
import styles from './Home.module.css';

// Fallback data in case Sanity isn't configured yet
const fallbackServices = [
  {
    _id: '1',
    icon: '🏠',
    title: 'In-Home Sitting',
    description: 'Your pup stays comfortable in their own home while I provide love, walks, and care.',
  },
  {
    _id: '2',
    icon: '🌙',
    title: 'Overnight Stays',
    description: 'Sleepovers with cuddles! I stay the night to ensure your dog is never alone.',
  },
  {
    _id: '3',
    icon: '🚶',
    title: 'Daily Visits',
    description: 'Perfect for busy days. I pop in for walks, feeding, and playtime.',
  },
];

const fallbackTestimonials = [
  {
    _id: '1',
    name: 'Sarah M.',
    dogName: 'WizzieBear',
    quote: "Jess is absolutely amazing! WizzieBear can't wait to see her every time.",
  },
  {
    _id: '2',
    name: 'Mike T.',
    dogName: 'Cooper',
    quote: 'Finally found someone I trust completely with my fur baby. Highly recommend!',
  },
];

function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [servicesData, testimonialsData, settingsData] = await Promise.all([
          getServices(),
          getTestimonials(),
          getSiteSettings(),
        ]);
        setServices(servicesData.length > 0 ? servicesData.slice(0, 3) : fallbackServices as Service[]);
        setTestimonials(testimonialsData.length > 0 ? testimonialsData.slice(0, 2) : fallbackTestimonials as Testimonial[]);
        setSettings(settingsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setServices(fallbackServices as Service[]);
        setTestimonials(fallbackTestimonials as Testimonial[]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const tagline = settings?.tagline || "Your Pup's Home Away From Home";

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroPattern}></div>
        </div>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroText}>
            <span className={styles.heroTag}>Professional Dog Sitting</span>
            <h1 className={styles.heroTitle}>
              {tagline.split(' ').slice(0, 2).join(' ')} <span className={styles.highlight}>{tagline.split(' ').slice(2).join(' ')}</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Dogs love me, just ask them! Professional, caring dog sitting services 
              with all the belly rubs, walks, and adventures they deserve.
            </p>
            <div className={styles.heroCta}>
              <Link to="/contact" className="btn btn-primary">
                Book a Stay
              </Link>
              <Link to="/services" className="btn btn-outline">
                View Services
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.heroImageWrapper}>
              {settings?.heroImage ? (
                <img 
                  src={urlFor(settings.heroImage).width(400).height(400).url()} 
                  alt="Happy dog"
                  className={styles.heroImg}
                />
              ) : (
                <div className={styles.heroImagePlaceholder}>
                  <span className={styles.heroEmoji}>🐕</span>
                </div>
              )}
              <div className={styles.floatingBadge}>
                <span>⭐ 5-Star Rated</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.heroWave}>
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path
              fill="var(--color-background)"
              d="M0,64 C480,150 960,0 1440,64 L1440,120 L0,120 Z"
            />
          </svg>
        </div>
      </section>

      {/* Services Preview */}
      <section className={`section ${styles.servicesPreview}`}>
        <div className="container">
          <h2 className="section-title">What I Offer</h2>
          <p className="section-subtitle">
            Every dog deserves personalized care. Here's how I can help!
          </p>
          
          <div className={styles.servicesGrid}>
            {!loading && services.map((service, index) => (
              <div 
                key={service._id} 
                className={`card ${styles.serviceCard} animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className={styles.serviceIcon}>{service.icon || '🐕'}</span>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDescription}>{service.description}</p>
              </div>
            ))}
          </div>
          
          <div className={styles.seeAll}>
            <Link to="/services" className="btn btn-secondary">
              See All Services
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className={styles.aboutPreview}>
        <div className="container">
          <div className={styles.aboutContent}>
            <div className={styles.aboutImage}>
              <div className={styles.aboutImageWrapper}>
                <div className={styles.aboutImagePlaceholder}>
                  <span>🐾</span>
                </div>
              </div>
            </div>
            <div className={styles.aboutText}>
              <h2 className={styles.aboutTitle}>Hi, I'm Jess!</h2>
              <p className={styles.aboutDescription}>
                I'm pretty great, just ask WizzieBear! With a genuine love for dogs 
                and years of experience, I treat every pup like family. Whether it's 
                long walks, cozy cuddles, or exciting playtime, your furry friend 
                will have the best time with me.
              </p>
              <ul className={styles.aboutHighlights}>
                <li>✨ Pet First Aid Certified</li>
                <li>✨ 5+ Years Experience</li>
                <li>✨ Insured & Background Checked</li>
              </ul>
              <Link to="/about" className="btn btn-primary">
                Learn More About Me
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className={`section ${styles.testimonialsPreview}`}>
        <div className="container">
          <h2 className="section-title">What Pet Parents Say</h2>
          <p className="section-subtitle">
            Don't just take my word for it - hear from happy clients!
          </p>
          
          <div className={styles.testimonialsGrid}>
            {!loading && testimonials.map((testimonial, index) => (
              <div 
                key={testimonial._id} 
                className={`card ${styles.testimonialCard}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={styles.testimonialQuote}>
                  <span className={styles.quoteIcon}>"</span>
                  <p>{testimonial.quote}</p>
                </div>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>
                    {testimonial.image ? (
                      <img src={urlFor(testimonial.image).width(48).height(48).url()} alt={testimonial.dogName} />
                    ) : '🐕'}
                  </div>
                  <div>
                    <strong>{testimonial.name}</strong>
                    <span>& {testimonial.dogName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.seeAll}>
            <Link to="/testimonials" className="btn btn-outline">
              Read All Testimonials
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready for Your Pup's Best Stay?</h2>
            <p className={styles.ctaSubtitle}>
              Let's chat about how I can help care for your furry family member!
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

export default Home;
