import { useState, useRef, useEffect } from 'react';

interface LoadingImageProps {
  src: string | null;
  alt: string;
  lqip?: string | null;
  size?: number;
  aspectRatio?: string;
  rounded?: boolean;
}

function LoadingImage({ 
  src, 
  alt, 
  lqip,
  size, 
  aspectRatio,
  rounded = true 
}: LoadingImageProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setLoaded(true);
    }
  }, []);

  const containerStyle: React.CSSProperties = { 
    position: 'relative',
    overflow: 'hidden',
    borderRadius: rounded ? '50%' : 'var(--radius-xl)',
    boxShadow: 'var(--shadow-xl)',
    background: 'var(--color-cream)',
    width: size, 
    height: size,
    aspectRatio
  };

  const lqipStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'blur(20px)',
    transform: 'scale(1.1)'
  };

  const imageStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'opacity 0.3s ease-out',
    opacity: loaded ? 1 : 0
  };

  return (
    <div style={containerStyle}>
      {lqip && (
        <img 
          src={lqip}
          alt=""
          aria-hidden="true"
          style={lqipStyle}
        />
      )}
      
      {src && (
        <img 
          ref={imgRef}
          src={src}
          alt={alt}
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          style={imageStyle}
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  );
}

export default LoadingImage;

