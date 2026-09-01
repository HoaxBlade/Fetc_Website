import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppWidget = () => {
  // Replace with your Cheerio WhatsApp Business Number (e.g. 919033347200)
  const phoneNumber = process.env.REACT_APP_WHATSAPP_NUMBER || "919033347200"; 
  
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
      <FaWhatsapp className="w-7 h-7 text-white" />
      {/* Tooltip / Label */}
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-medium text-sm pl-0 group-hover:pl-2">
        Chat with us
      </span>
    </a>
  );
};

export default WhatsAppWidget;
