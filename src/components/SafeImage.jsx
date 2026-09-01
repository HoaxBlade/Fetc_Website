import React, { useState, useEffect } from 'react';

const SafeImage = ({ src, alt, className, fallback = null, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src || fallback);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    if (!src) {
      setImgSrc(fallback);
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
  }, [src, fallback]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      if (fallback) {
        setImgSrc(fallback);
      }
    }
  };

  if (hasError && !fallback) {
    return (
      <div className={`flex items-center justify-center bg-brand-50 text-brand-600 font-extrabold text-2xl rounded-2xl ${className || 'w-full h-full'}`}>
        {alt ? alt.charAt(0).toUpperCase() : "U"}
      </div>
    );
  }

  return (
    <img 
      src={imgSrc || fallback} 
      alt={alt || 'Image'} 
      className={className} 
      onError={handleError}
      {...props} 
    />
  );
};

export default SafeImage;
