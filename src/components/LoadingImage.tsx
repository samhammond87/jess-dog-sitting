import { useState, useRef, useEffect } from 'react';

interface LoadingImageProps {
  src: string | null;
  alt: string;
  lqip?: string | null;
  /** Width in pixels. Use with height for non-square images. */
  width?: number;
  /** Height in pixels. Use with width for non-square images. */
  height?: number;
  /** Shorthand for square images (sets both width and height). */
  size?: number;
  aspectRatio?: string;
  rounded?: boolean;
  /** Set to "eager" for above-the-fold images (hero, LCP). Default: "lazy" */
  loading?: 'lazy' | 'eager';
  /** Set to "high" for LCP images to prioritize fetching. */
  fetchPriority?: 'high' | 'low' | 'auto';
}

function LoadingImage({ 
  src, 
  alt, 
  lqip,
  width,
  height,
  size, 
  aspectRatio,
  rounded = true,
  loading = 'lazy',
  fetchPriority
}: LoadingImageProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Support both size (square) and explicit width/height
  const imgWidth = width ?? size;
  const imgHeight = height ?? size;

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
    background: 'var(--color-secondary)',
    width: '100%',
    maxWidth: imgWidth, 
    aspectRatio: aspectRatio ?? (imgWidth && imgHeight ? `${imgWidth}/${imgHeight}` : '1/1')
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
          width={imgWidth}
          height={imgHeight}
          loading={loading}
          decoding="async"
          fetchPriority={fetchPriority}
          style={imageStyle}
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  );
}

export default LoadingImage;

