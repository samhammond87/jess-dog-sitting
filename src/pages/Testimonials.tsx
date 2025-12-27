import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTestimonials, urlFor, type Testimonial } from '../lib/sanity';
import styles from './Testimonials.module.css';

// Fallback data
const fallbackTestimonials: Testimonial[] = [
  {
    _id: '1',
    name: 'Sarah M.',
    dogName: 'WizzieBear',
    quote: "Jess is absolutely amazing with WizzieBear! She sends us the sweetest photos throughout the day, and our pup is always so happy when we get home. It's clear she genuinely loves what she does.",
    rating: 5,
  },
  {
    _id: '2',
    name: 'Mike & Lisa T.',
    dogName: 'Cooper',
    quote: "We've tried several dog sitters before, but none compare to Jess. Cooper gets anxious around new people, but he warmed up to her immediately. Now he gets excited when he sees her car pull up!",
    rating: 5,
  },
  {
    _id: '3',
    name: 'Emma R.',
    dogName: 'Luna & Max',
    quote: 'Having two high-energy dogs can be challenging, but Jess handles them like a pro. She takes them on the best adventures and they come home perfectly tired and happy. Highly recommend!',
    rating: 5,
  },
  {
    _id: '4',
    name: 'David K.',
    dogName: 'Biscuit',
    quote: "Biscuit has special dietary needs and requires medication twice a day. Jess follows our routine perfectly and always makes sure he's comfortable. We couldn't ask for better care!",
    rating: 5,
  },
];

function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const data = await getTestimonials();
        setTestimonials(data.length > 0 ? data : fallbackTestimonials);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setTestimonials(fallbackTestimonials);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  const renderStars = (rating: number = 5) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? styles.starFilled : styles.starEmpty}>
        ★
      </span>
    ));
  };

  return (
    <div className={styles.testimonials}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Testimonials</h1>
          <p className={styles.subtitle}>
            Dogs love me, just ask them! Here's what pet parents have to say.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>100+</span>
              <span className={styles.statLabel}>Happy Pups</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>5.0</span>
              <span className={styles.statLabel}>Average Rating</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>5+</span>
              <span className={styles.statLabel}>Years Experience</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className={`section ${styles.testimonialsSection}`}>
        <div className="container">
          <div className={styles.testimonialsGrid}>
            {!loading && testimonials.map((testimonial, index) => (
              <div 
                key={testimonial._id} 
                className={`card ${styles.testimonialCard}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={styles.stars}>
                  {renderStars(testimonial.rating)}
                </div>
                <blockquote className={styles.quote}>
                  "{testimonial.quote}"
                </blockquote>
                <div className={styles.author}>
                  <div className={styles.avatar}>
                    {testimonial.image ? (
                      <img src={urlFor(testimonial.image).width(50).height(50).url()} alt={testimonial.dogName} />
                    ) : '🐕'}
                  </div>
                  <div className={styles.authorInfo}>
                    <strong>{testimonial.name}</strong>
                    <span>& {testimonial.dogName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Want Your Pup to Be This Happy?
            </h2>
            <p className={styles.ctaSubtitle}>
              Join our growing family of satisfied pet parents!
            </p>
            <Link to="/contact" className="btn btn-primary">
              Book Your First Stay
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Testimonials;
