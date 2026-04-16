import React, { useState, useEffect } from 'react';

import img1 from "../assets/officeImages/biggest-centre.jpeg";
import img2 from "../assets/officeImages/exterior-roongta-vesu.jpeg";
import img3 from "../assets/officeImages/IMG_2426.JPG";
import img4 from "../assets/officeImages/testing-lab.jpg";
import img5 from "../assets/officeImages/vip-conference.jpg";
import img6 from "../assets/officeImages/vip-exam-centre.jpg";
import img7 from "../assets/officeImages/_DSC1619.JPG";
import img8 from "../assets/officeImages/_DSC1638.JPG";
import img9 from "../assets/officeImages/admin-pc.jpeg";
import img10 from "../assets/officeImages/directors-cabin.jpeg";
import img11 from "../assets/officeImages/ext.2.jpeg";
import img12 from "../assets/officeImages/exterior-varachha-prime.jpeg";
import img13 from "../assets/officeImages/signage.jpeg";
import img14 from "../assets/officeImages/waiting-area-washroom.jpeg";
import img15 from "../assets/officeImages/p1.jpeg";
import img16 from "../assets/officeImages/p2.jpeg";
import img17 from "../assets/officeImages/p3.jpeg";
import img18 from "../assets/officeImages/p4.jpeg";
import img19 from "../assets/officeImages/p5.jpeg";
import img20 from "../assets/officeImages/p6.jpeg";
import img21 from "../assets/officeImages/p7.jpeg";
import img22 from "../assets/officeImages/p8.jpeg";
import img23 from "../assets/officeImages/p9.jpeg";
import img24 from "../assets/officeImages/p10.jpeg";
import img25 from "../assets/officeImages/p11.jpeg";
import img26 from "../assets/officeImages/p12.jpeg";
import img27 from "../assets/officeImages/p13.jpeg";
import img28 from "../assets/officeImages/p14.jpeg";
import img29 from "../assets/officeImages/p15.jpeg";

const images = [
  { src: img1, alt: "Biggest Centre" },
  { src: img2, alt: "Exterior Roongta Vesu" },
  { src: img3, alt: "Office Interior" },
  { src: img4, alt: "Testing Lab" },
  { src: img5, alt: "VIP Conference" },
  { src: img6, alt: "VIP Exam Centre" },
  { src: img7, alt: "Office Space" },
  { src: img8, alt: "Office View" },
  { src: img9, alt: "Admin PC" },
  { src: img10, alt: "Director's Cabin" },
  { src: img11, alt: "Exterior 2" },
  { src: img12, alt: "Exterior Varachha Prime" },
  { src: img13, alt: "Signage" },
  { src: img14, alt: "Waiting Area & Washroom" },
  { src: img15, alt: "Gallery Moment 1" },
  { src: img16, alt: "Gallery Moment 2" },
  { src: img17, alt: "Gallery Moment 3" },
  { src: img18, alt: "Gallery Moment 4" },
  { src: img19, alt: "Gallery Moment 5" },
  { src: img20, alt: "Gallery Moment 6" },
  { src: img21, alt: "Gallery Moment 7" },
  { src: img22, alt: "Gallery Moment 8" },
  { src: img23, alt: "Gallery Moment 9" },
  { src: img24, alt: "Gallery Moment 10" },
  { src: img25, alt: "Gallery Moment 11" },
  { src: img26, alt: "Gallery Moment 12" },
  { src: img27, alt: "Gallery Moment 13" },
  { src: img28, alt: "Gallery Moment 14" },
  { src: img29, alt: "Gallery Moment 15" },
];

function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState(null);

  // Close lightbox on escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    if (selectedImage) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  return (
    <main className="min-h-screen py-16 px-4 md:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-700 mb-6 tracking-tight">
             Our <span className="text-blue-500">Gallery</span>
          </h1>
          <div className="w-24 h-1.5 bg-blue-500 mx-auto rounded-full mb-6"></div>
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
             Take a visual tour of our state-of-the-art facilities, modern classrooms, and vibrant professional environment designed for your success.
          </p>
        </div>

        {/* Uniform Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              className="relative overflow-hidden rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 group cursor-pointer border border-slate-200/60 bg-white aspect-[4/3]"
              onClick={() => setSelectedImage(img)}
            >
              <div className="w-full h-full relative overflow-hidden bg-slate-100">
                <img 
                  src={img.src} 
                  alt={img.alt} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                 <p className="text-white font-semibold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    {img.alt}
                 </p>
                 <div className="w-8 h-1 bg-blue-400 mt-2 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 delay-100"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Lightbox Modal */}
      <div 
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-8 backdrop-blur-sm transition-all duration-300 ${
          selectedImage ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSelectedImage(null)}
      >
        <button 
          className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white p-3 bg-white/5 hover:bg-white/20 rounded-full transition-all duration-200 z-[101] group"
          onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:rotate-90 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {selectedImage && (
          <div className="relative max-w-5xl w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedImage.src} 
              alt={selectedImage.alt} 
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl ring-1 ring-white/10"
            />
            <div className="mt-4 text-center">
              <p className="text-white/90 text-lg font-medium">{selectedImage.alt}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default GalleryPage;
