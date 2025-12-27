import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

function NotFound() {
  return (
    <div className={styles.notFound}>
      <div className={`container ${styles.content}`}>
        <span className={styles.emoji}>🐕</span>
        <h1 className={styles.title}>Oops! Page Not Found</h1>
        <p className={styles.message}>
          Looks like this page ran off to chase a squirrel! 
          Let's get you back on track.
        </p>
        <div className={styles.actions}>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
          <Link to="/contact" className="btn btn-outline">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;

