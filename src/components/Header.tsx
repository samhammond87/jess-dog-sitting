import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.headerContent}`}>
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          <span className={styles.logoIcon}>🐕</span>
          <span className={styles.logoText}>Jess Dog Sitting</span>
        </Link>

        <button
          className={`${styles.menuToggle} ${isMenuOpen ? styles.active : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span className={styles.hamburger}></span>
        </button>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}>
          <NavLink
            to="/"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={closeMenu}
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={closeMenu}
          >
            About Me
          </NavLink>
          <NavLink
            to="/services"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={closeMenu}
          >
            Dog Sitting
          </NavLink>
          <NavLink
            to="/pricing"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={closeMenu}
          >
            Pricing
          </NavLink>
          <NavLink
            to="/testimonials"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={closeMenu}
          >
            Testimonials
          </NavLink>
          <NavLink
            to="/contact"
            className={`${styles.navLink} ${styles.ctaButton}`}
            onClick={closeMenu}
          >
            Contact
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;

