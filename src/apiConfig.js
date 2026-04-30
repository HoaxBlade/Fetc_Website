// Centralized API configuration
// This allows the frontend to point to a remote backend (like an Ngrok tunnel)
// even when the frontend is deployed on Vercel/Netlify.

const API_BASE = process.env.REACT_APP_API_URL || '';

// Helper to construct API URLs
export const getApiUrl = (path) => {
  // If path already starts with http, return as is
  if (path.startsWith('http')) return path;
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${API_BASE}${normalizedPath}`;
};

export default API_BASE;
