import React, { useState, useEffect } from 'react';

const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60";

const SafeImage = ({ src, alt, className, fallback = DEFAULT_FALLBACK, ...props }) => {
  const activeFallback = fallback || DEFAULT_FALLBACK;
  const [imgSrc, setImgSrc] = useState(src || activeFallback);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    if (!src) {
      setImgSrc(activeFallback);
      return;
    }

    const isNgrok = src.includes('ngrok-free.app') || src.includes('ngrok-free.dev') || src.includes('ngrok');
    if (!isNgrok) {
      setImgSrc(src);
      return;
    }

    let active = true;
    let objectUrl = null;

    const fetchImage = async () => {
      try {
        const response = await fetch(src, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        if (!response.ok) throw new Error('Failed to fetch safe image');
        const blob = await response.blob();
        if (active) {
          objectUrl = URL.createObjectURL(blob);
          setImgSrc(objectUrl);
        }
      } catch (err) {
        console.error("Error loading secure image:", err);
        if (active) {
          setImgSrc(src);
        }
      }
    };

    fetchImage();

    return () => {
      active = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src, activeFallback]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(activeFallback);
    }
  };

  return (
    <img 
      src={imgSrc || activeFallback} 
      alt={alt || 'Image'} 
      className={className} 
      onError={handleError}
      {...props} 
    />
  );
};

export default SafeImage;
