import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import bannerImg from "../assets/logo/fetc banner.png";

function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#F8F9FA] text-slate-900">
      <div className="absolute inset-0">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.8 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={bannerImg} 
          alt="FETC Banner" 
          className="h-full w-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA]/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#F8F9FA] via-[#F8F9FA]/20 to-transparent"></div>
        {/* Lava Lamp Blob Start */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-500/10 blur-[120px]"
        ></motion.div>
      </div>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative mx-auto flex max-w-7xl flex-col px-4 py-20 md:py-32 md:px-6"
      >
        <motion.p 
          variants={itemVariants}
          className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 shadow-sm backdrop-blur-md"
        >
          IELTS • Study Abroad • Career Guidance
        </motion.p>
        <motion.h1 
          variants={itemVariants}
          className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 md:text-6xl"
        >
          Your Gateway to <br/> <span className="bg-gradient-to-r from-brand-600 to-teal-500 bg-clip-text text-transparent">Global Education</span>
        </motion.h1>
        <motion.p 
          variants={itemVariants}
          className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-slate-600 md:text-lg"
        >
          Build your international future with trusted experts for exam
          preparation, admissions, and career direction.
        </motion.p>
        <motion.div variants={itemVariants} className="mt-8 flex">
          <Link
            to="/about/company-profile"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:bg-slate-800 active:scale-95"
          >
            Get Free Consultation
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Hero;
