import React, { useEffect } from 'react';

const IASBadge = () => {
  useEffect(() => {
    const scriptId = 'ias-badge-script';
    
    // Check if the script has already been added to avoid duplicates
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://www-cdn.icef.com/scripts/iasbadgeid.js';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="ias-badge-container flex items-center">
      <span id="iasBadge" data-account-id="7150"></span>
    </div>
  );
};

export default IASBadge;
