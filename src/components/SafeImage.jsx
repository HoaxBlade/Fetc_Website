import React, { useState, useEffect } from 'react';

const SafeImage = ({ src, alt, className, fallback = '', ...props }) => {
  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
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
          setImgSrc(src); // Fallback to raw URL if fetch fails
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

  return (
    <img 
      src={imgSrc || fallback || src} 
      alt={alt} 
      className={className} 
      onError={(e) => {
        if (fallback && imgSrc !== fallback) {
          setImgSrc(fallback);
        }
      }}
      {...props} 
    />
  );
};

export default SafeImage;
