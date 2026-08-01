import React from 'react';

const WhatsAppWidget = () => {
  // Replace with your Cheerio WhatsApp Business Number (e.g. 919033347209 or 919876543210)
  const phoneNumber = process.env.REACT_APP_WHATSAPP_NUMBER || "919033347209"; 
  
  // Trigger text set in Cheerio AI Workflow
  const triggerMessage = encodeURIComponent("Hi, I want more details");

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${triggerMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center z-50 transition-all duration-300 transform hover:scale-110 group cursor-pointer border-2 border-white/20"
      title="Chat on WhatsApp"
      aria-label="Chat on WhatsApp"
    >
      {/* WhatsApp Icon */}
      <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
      </svg>
      {/* Tooltip / Label */}
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-medium text-sm pl-0 group-hover:pl-2">
        Chat with us
      </span>
    </a>
  );
};

export default WhatsAppWidget;
