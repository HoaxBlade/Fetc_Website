// Centralized API configuration
// This allows the frontend to point to a remote backend (like an Ngrok tunnel)
// even when the frontend is deployed on Vercel/Netlify.

export const getApiBase = () => {
  if (typeof window !== 'undefined' && window.API_BASE && window.API_BASE.trim()) {
    return window.API_BASE.trim();
  }
  if (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.trim()) {
    return process.env.REACT_APP_API_URL.trim();
  }
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:5001';
  }
  return '';
};

const API_BASE = getApiBase();

// Helper to construct API URLs
export const getApiUrl = (path) => {
  if (!path) return getApiBase();
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const base = getApiBase();
  return `${base}${normalizedPath}`;
};

// Helper to handle relative paths and dynamic ngrok/localhost hosts robustly
export const getProfileImageUrl = (url) => {
  if (!url) return '';
  
  const activeBase = getApiBase();

  // If it's a relative path (e.g. /uploads/fetc-123.jpg)
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    const normalized = url.startsWith('/') ? url : `/${url}`;
    return activeBase ? `${activeBase}${normalized}` : normalized;
  }
  
  // If it's an absolute URL (e.g. http://localhost:5001/uploads/fetc-123.jpg or ngrok)
  try {
    const parsedUrl = new URL(url);
    const isLocalOrTunnel = 
      parsedUrl.hostname === 'localhost' || 
      parsedUrl.hostname === '127.0.0.1' || 
      parsedUrl.hostname.includes('ngrok') ||
      parsedUrl.hostname.includes('ngrok-free.app');
      
    if (isLocalOrTunnel && activeBase) {
      const parsedBase = new URL(activeBase.startsWith('http') ? activeBase : `http://${activeBase}`);
      return `${parsedBase.origin}${parsedUrl.pathname}${parsedUrl.search}`;
    }
  } catch (e) {
    // Fallback if URL parsing fails
  }
  
  return url;
};

export const getAssetUrl = (url) => {
  return getProfileImageUrl(url);
};

export default API_BASE;
