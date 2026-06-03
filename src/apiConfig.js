// Centralized API configuration
// This allows the frontend to point to a remote backend (like an Ngrok tunnel)
// even when the frontend is deployed on Vercel/Netlify.

const API_BASE = (window.API_BASE || process.env.REACT_APP_API_URL || '').trim();

// Helper to construct API URLs
export const getApiUrl = (path) => {
  // If path already starts with http, return as is
  if (path.startsWith('http')) return path;
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${API_BASE}${normalizedPath}`;
};

// Helper to handle relative paths and dynamic ngrok/localhost hosts robustly
export const getProfileImageUrl = (url) => {
  if (!url) return '';
  
  // If it's a relative path, prepend API_BASE
  if (!url.startsWith('http')) {
    const normalized = url.startsWith('/') ? url : `/${url}`;
    return `${API_BASE}${normalized}`;
  }
  
  // If it's an absolute path, check if it points to a local or ngrok server
  // and rewrite its host/origin to match the active API_BASE.
  try {
    const parsedUrl = new URL(url);
    
    // Check if the URL hostname points to a local address or ngrok
    const isLocalOrTunnel = 
      parsedUrl.hostname === 'localhost' || 
      parsedUrl.hostname === '127.0.0.1' || 
      parsedUrl.hostname.includes('ngrok') ||
      parsedUrl.hostname.includes('ngrok-free.app');
      
    if (isLocalOrTunnel) {
      if (API_BASE && API_BASE.startsWith('http')) {
        const parsedBase = new URL(API_BASE);
        return `${parsedBase.origin}${parsedUrl.pathname}${parsedUrl.search}`;
      } else {
        // If API_BASE is relative or empty, fall back to relative path
        return `${parsedUrl.pathname}${parsedUrl.search}`;
      }
    }
  } catch (e) {
    // Fallback if URL parsing fails
  }
  
  return url;
};

export default API_BASE;
