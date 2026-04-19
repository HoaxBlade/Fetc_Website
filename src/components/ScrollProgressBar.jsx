import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  
  // Apply a smooth spring animation to the scroll progress
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="fixed top-0 left-0 w-full h-1.5 z-[1000] pointer-events-none">
      <motion.div 
        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-r-full"
        style={{ scaleX, originX: 0 }}
      />
    </div>
  );
};

export default ScrollProgressBar;
