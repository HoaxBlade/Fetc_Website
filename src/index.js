import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Disable right-click context menu
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

// Disable common inspect and source-view keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (
    e.key === "F12" ||
    (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")) ||
    (e.ctrlKey && (e.key === "U" || e.key === "u"))
  ) {
    e.preventDefault();
  }
});


window.API_BASE = (process.env.REACT_APP_API_URL || '').trim().replace(/\/$/, '');

// Global fetch interceptor to bypass Ngrok browser warning
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  let [resource, config] = args;
  
  // If hitting the ngrok tunnel, add the bypass header
  if (typeof resource === 'string' && (resource.includes('ngrok-free.app') || resource.includes('ngrok-free.dev'))) {
    config = config || {};
    config.headers = {
      ...config.headers,
      'ngrok-skip-browser-warning': 'true'
    };
  }
  
  return originalFetch(resource, config);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
