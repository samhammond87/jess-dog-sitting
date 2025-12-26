import { useState, useEffect } from 'react';
import { getAboutContent, urlFor, type AboutContent } from '../lib/sanity';
import styles from './About.module.css';

// Fallback data
const fallbackHighlights = [
  { icon: '🎓', text: 'Pet First Aid Certified' },
  { icon: '⏰', text: '5+ Years Experience' },
  { icon: '🛡️', text: 'Insured & Background Checked' },
  { icon: '❤️', text: 'Genuine Love for Dogs' },
  { icon: '📱', text: '24/7 Photo Updates' },
  { icon: '🏡', text: 'Home Environment Care' },
];

const fallbackGallery = [
  { emoji: '🐕', caption: 'Playtime fun!' },
  { emoji: '🐶', caption: 'Cuddle sessions' },
  { emoji: '🦮', caption: 'Adventure walks' },
  { emoji: '🐾', caption: 'Happy pups' },
];

function About() {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const data = await getAboutContent();
        setAboutContent(data);
      } catch (error) {
        console.error('Error fetching about content:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAbout();
  }, []);

  const highlights = aboutContent?.highlights?.map((text, i) => ({
    icon: fallbackHighlights[i]?.icon || '✨',
    text,
  })) || fallbackHighlights;

  const bio = aboutContent?.bio || `Ever since I was a kid, I've had an unbreakable bond with dogs. 
    There's something magical about the way they greet you at the door 
    with unconditional love, wagging tails, and pure joy. That's the 
    energy I bring to every pup I care for!`;

  return (
    <div className={styles.about}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroImage}>
              {aboutContent?.profileImage ? (
                <img 
                  src={urlFor(aboutContent.profileImage).width(200).height(200).url()} 
                  alt="Jess"
                  className={styles.heroImg}
                />
              ) : (
                <div className={styles.heroImagePlaceholder}>
                  <span>🐾</span>
                </div>
              )}
            </div>
            <div className={styles.heroText}>
              <h1 className={styles.title}>About Me</h1>
              <p className={styles.subtitle}>
                I'm Jess, and I'm pretty great — just ask WizzieBear!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className={`section ${styles.bioSection}`}>
        <div className="container">
          <div className={styles.bioContent}>
            <div className={styles.bioText}>
              <h2 className={styles.bioTitle}>My Story</h2>
              <p>{bio}</p>
              <p>
                I started dog sitting as a way to spend more time with furry friends, 
                and it quickly became my passion. Now, I've turned that love into a 
                full-time commitment to keeping your four-legged family members happy, 
                healthy, and entertained while you're away.
              </p>
              <p>
                When your dog stays with me, they're not just getting a sitter — 
                they're getting a friend who genuinely cares. From long walks and 
                exciting playtime to cozy naps and endless belly rubs, your pup will 
                experience all the love and attention they deserve.
              </p>
            </div>
            <div className={styles.bioImage}>
              {aboutContent?.images && aboutContent.images.length > 0 ? (
                <img 
                  src={urlFor(aboutContent.images[0]).width(400).height(500).url()} 
                  alt="Jess with dogs"
                  className={styles.bioImg}
                />
              ) : (
                <div className={styles.bioImagePlaceholder}>
                  <span className={styles.bioEmoji}>🐕‍🦺</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className={styles.highlightsSection}>
        <div className="container">
          <h2 className="section-title" style={{ color: 'var(--color-white)' }}>
            Why Choose Me?
          </h2>
          <div className={styles.highlightsGrid}>
            {highlights.map((highlight, index) => (
              <div 
                key={index} 
                className={styles.highlightCard}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className={styles.highlightIcon}>{highlight.icon}</span>
                <span className={styles.highlightText}>{highlight.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className={`section ${styles.gallerySection}`}>
        <div className="container">
          <h2 className="section-title">Happy Moments</h2>
          <p className="section-subtitle">
            A glimpse into the fun times I have with my furry clients!
          </p>
          <div className={styles.gallery}>
            {aboutContent?.images && aboutContent.images.length > 0 ? (
              aboutContent.images.map((image, index) => (
                <div 
                  key={index} 
                  className={styles.galleryItem}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={styles.galleryImage}>
                    <img src={urlFor(image).width(300).height(300).url()} alt={`Happy moment ${index + 1}`} />
                  </div>
                </div>
              ))
            ) : (
              fallbackGallery.map((item, index) => (
                <div 
                  key={index} 
                  className={styles.galleryItem}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={styles.galleryImage}>
                    <span>{item.emoji}</span>
                  </div>
                  <p className={styles.galleryCaption}>{item.caption}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className={`section ${styles.philosophySection}`}>
        <div className="container">
          <div className={styles.philosophyContent}>
            <h2 className={styles.philosophyTitle}>My Care Philosophy</h2>
            <div className={styles.philosophyItems}>
              <div className={styles.philosophyItem}>
                <h3>🏠 Home Comfort</h3>
                <p>
                  I believe dogs are happiest in familiar environments. That's why 
                  I prioritize in-home care, keeping your pup's routine as normal 
                  as possible.
                </p>
              </div>
              <div className={styles.philosophyItem}>
                <h3>📸 Constant Updates</h3>
                <p>
                  Miss your furry friend? I send regular photos and updates so 
                  you always know how much fun they're having!
                </p>
              </div>
              <div className={styles.philosophyItem}>
                <h3>🎯 Personalized Care</h3>
                <p>
                  Every dog is unique. I take time to understand your pup's 
                  personality, preferences, and needs to provide tailored care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
