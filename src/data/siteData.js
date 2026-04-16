import australiaImg from "../assets/countries/australia.png";
import dubaiImg from "../assets/countries/dubai.png";
import europeImg from "../assets/countries/europe.png";
import irelandImg from "../assets/countries/ireland.png";
import newZealandImg from "../assets/countries/new-zealand.png";
import ukImg from "../assets/countries/uk.png";
import usaImg from "../assets/countries/usa.png";
import { allUniversities } from "./allUniversitiesData";

export const countryData = {
  "united-kingdom": {
    name: "United Kingdom",
    image: ukImg,
    description:
      "Study in globally recognized UK institutions with excellent academic support, scholarships, and post-study work opportunities.",
    universities: [
      ...allUniversities["united-kingdom"],
      { name: "QA Universities", image: null, link: "https://highereducation.qa.com/", exclusive: true }
    ],
  },
  europe: {
    name: "Europe",
    image: europeImg,
    description:
      "Explore affordable and high-quality education options across Europe with multicultural learning environments and career pathways.",
    universities: [
      ...allUniversities.europe.filter(u => !u.name.includes("Ireland")),
      { name: "ILA", image: null, link: "https://www.ilamilan.com/", exclusive: true }
    ],
  },
  usa: {
    name: "USA",
    image: usaImg,
    description:
      "Access world-class universities, cutting-edge research opportunities, and diverse campus experiences in the United States.",
    universities: allUniversities.usa,
  },
  australia: {
    name: "Australia",
    image: australiaImg,
    description:
      "Choose from top-ranked Australian universities known for practical learning, innovation, and student-friendly cities.",
    universities: allUniversities.australia,
  },
  canada: {
    name: "Canada",
    image: usaImg, // Placeholder for Canada image
    description:
      "Explore world-class academic institutions, diverse culture, and vast post-study opportunities in Canada.",
    universities: allUniversities.canada,
  },
  "new-zealand": {
    name: "New Zealand",
    image: newZealandImg,
    description:
      "Build your future in New Zealand with globally valued qualifications and a safe, welcoming student lifestyle.",
  },
  ireland: {
    name: "Ireland",
    image: irelandImg,
    description:
      "Study in Ireland for strong industry connections, international exposure, and a vibrant academic atmosphere.",
    universities: [
      ...allUniversities.ireland,
      ...allUniversities.europe.filter(u => u.name.includes("Ireland"))
    ],
  },
  dubai: {
    name: "Dubai",
    image: dubaiImg,
    description:
      "Pursue modern education programs in Dubai with strong global links and a fast-growing professional ecosystem.",
    universities: allUniversities.dubai,
  },
  singapore: {
    name: "Singapore",
    image: dubaiImg, // Placeholder for Singapore image
    description:
      "Experience modern education in Singapore with unparalleled technological and business advancements.",
    universities: allUniversities.other, // Contains LSBF Singapore
  },
};

export const examData = {
  psi: {
    name: "PSI",
    shortLabel: "PSI",
    description:
      "Get expert support for PSI exam preparation with test strategy, practice modules, and performance feedback.",
    fullDescription: "At FETC, we offer expert coaching for the PSI exam, providing a comprehensive and structured path to mastering your English proficiency. Our preparation courses cover all vital areas—from advanced test strategies to rigorous practice modules and detailed performance feedback. Whether you are aiming to navigate professional or academic landscapes, our PSI training is tailored to build your confidence and linguistic capabilities.\n\nChoosing FETC as your preparation partner ensures a supportive and professional learning environment. Our specialized mentors guide you through every step of the curriculum, offering targeted insights that mirror the actual testing experience. We are dedicated to delivering an unparalleled educational journey, helping you secure top PSI results and unlock global opportunities.",
    metadata: [
      { label: "Cost", value: "Approx. ₹17,000" },
      { label: "Frequency", value: "Flexible / Year-Round" },
      { label: "Duration", value: "Up to 2 Hours" },
      { label: "Validity", value: "2 Years" }
    ],
    features: [
      { highlight: "550+", label: "Comprehensive Assessment" },
      { highlight: "100%", label: "Rapid Results" },
      { highlight: "550+", label: "Efficiency and Quality" },
      { highlight: "300+", label: "Objective Scoring" }
    ]
  },
  "idp-for-ielts": {
    name: "IDP for IELTS",
    shortLabel: "IELTS (IDP)",
    description:
      "Comprehensive IELTS coaching by experienced mentors with speaking practice, writing correction, and mock tests.",
    fullDescription: "At FETC, we provide specialized IDP IELTS coaching designed to rigorously elevate your English skills across Speaking, Writing, Reading, and Listening. Recognized globally by leading universities and major employers, the IELTS exam is a critical stepping stone for fulfilling your international ambitions. Our elite program is engineered to equip you with the precise strategies needed to excel on test day.\n\nOpting for FETC means your preparation is handled by incredibly experienced mentors within a highly supportive, modern facility. Our rigorous mock tests, real-time writing corrections, and intensive speaking sessions are structured to perfectly mirror the real exam. We are entirely committed to refining your proficiency and helping you achieve the high band score essential for your growth.",
    metadata: [
      { label: "Cost", value: "Approx. ₹16,250" },
      { label: "Frequency", value: "Weekly / 48 times a year" },
      { label: "Duration", value: "2 Hrs 45 Mins" },
      { label: "Validity", value: "2 Years" }
    ],
    features: [
      { highlight: "550+", label: "Comprehensive Assessment" },
      { highlight: "100%", label: "Rapid Results" },
      { highlight: "550+", label: "Efficiency and Quality" },
      { highlight: "300+", label: "Objective Scoring" }
    ]
  },
  toefl: {
    name: "TOEFL",
    shortLabel: "TOEFL",
    description:
      "Target your TOEFL score through skill-based training sessions for reading, listening, writing, and speaking.",
    fullDescription: "At FETC, we offer a deeply focused TOEFL training curriculum designed to accurately assess and improve your academic English communication. Essential for admissions into top-tier universities worldwide, our TOEFL sessions target skill-based development across Reading, Listening, Speaking, and Writing. We ensure that you approach the exam with clarity, speed, and advanced vocabulary mastery.\n\nBy selecting FETC as your instructional core, you benefit from a professional and highly resourced training experience. Our specialized coaches lead dynamic sessions that simplify complex academic passages and conversational audio elements. Through continuous assessment and stress-free simulated exams, we help you secure the decisive scores required by elite institutions globally.",
    metadata: [
      { label: "Cost", value: "Approx. ₹16,900" },
      { label: "Frequency", value: "Over 60 times a year" },
      { label: "Duration", value: "1 Hr 56 Mins" },
      { label: "Validity", value: "2 Years" }
    ],
    features: [
      { highlight: "550+", label: "Comprehensive Assessment" },
      { highlight: "100%", label: "Rapid Results" },
      { highlight: "550+", label: "Efficiency and Quality" },
      { highlight: "300+", label: "Objective Scoring" }
    ]
  },
  pte: {
    name: "PTE",
    shortLabel: "PTE",
    description:
      "Prepare for PTE with AI-driven patterns, timed practice, and structured guidance to improve your score quickly.",
    fullDescription: "At FETC, we deliver advanced preparation for the PTE (Pearson Test of English), leveraging modern techniques to provide a swift and accurate boost to your language proficiency. Perfect for individuals seeking immediate and completely unbiased language assessments, our PTE training exploits AI-driven patterns, timed practices, and incredibly structured guidance to surge your scores quickly.\n\nPreparing with FETC ensures a seamless, high-tech professional experience. Our lab facilities and dedicated coaching staff simulate the computer-based testing environment at every step, making sure your assessment preparations are conducted under stress-free, accurate conditions. Our PTE curriculum is built to foster quick decision-making and rapid results, ensuring you excel.",
    metadata: [
      { label: "Cost", value: "Approx. ₹17,000" },
      { label: "Frequency", value: "Almost Daily" },
      { label: "Duration", value: "2 Hours" },
      { label: "Validity", value: "2 Years" }
    ],
    features: [
      { highlight: "550+", label: "Comprehensive Assessment" },
      { highlight: "100%", label: "Rapid Results" },
      { highlight: "550+", label: "Efficiency and Quality" },
      { highlight: "300+", label: "Objective Scoring" }
    ]
  },
  "pearson-versant": {
    name: "Pearson Versant Test",
    shortLabel: "Pearson Versant",
    description:
      "Whether you're an individual aiming to measure your English skills or an organization seeking reliable language assessments, the Pearson Versant Test is your go-to solution.",
    fullDescription: "At FETC, we offer the Pearson Versant Test, a leading exam that provides a swift and accurate assessment of your English proficiency across key areas: Listening, Speaking, Writing, and Reading. Whether you're an individual aiming to measure your English skills or an organization seeking reliable language assessments, the Pearson Versant Test is your go-to solution.\n\nChoosing FETC as your testing center ensures a smooth and professional experience. Our well-equipped facilities and dedicated staff are here to support you at every step, making sure your assessment is conducted in a stress-free environment. The Pearson Versant Test is designed to deliver precise results quickly, helping you make informed decisions for personal growth or organizational excellence.",
    metadata: [
      { label: "Cost", value: "Approx. ₹4,000" },
      { label: "Frequency", value: "On-demand" },
      { label: "Duration", value: "15 to 50 Mins" },
      { label: "Validity", value: "Institution Dependant" }
    ],
    features: [
      { highlight: "550+", label: "Comprehensive Assessment" },
      { highlight: "100%", label: "Rapid Results" },
      { highlight: "550+", label: "Efficiency and Quality" },
      { highlight: "300+", label: "Objective Scoring" }
    ]
  },
};

export const navMenus = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "About",
    items: [{ label: "Company Profile", path: "/about/company-profile" }],
  },
  {
    label: "Study Abroad",
    items: [
      { label: "United Kingdom", path: "/study-abroad/united-kingdom" },
      { label: "Europe", path: "/study-abroad/europe" },
      { label: "USA", path: "/study-abroad/usa" },
      { label: "Canada", path: "/study-abroad/canada" },
      { label: "Australia", path: "/study-abroad/australia" },
      { label: "New Zealand", path: "/study-abroad/new-zealand" },
      { label: "Ireland", path: "/study-abroad/ireland" },
      { label: "Dubai", path: "/study-abroad/dubai" },
      { label: "Singapore", path: "/study-abroad/singapore" },
    ],
  },
  {
    label: "Career Assessment",
    items: [
      {
        label: "Behaviour and Career Analysis",
        path: "/career-assessment/behaviour-and-career-analysis",
      },
    ],
  },
  {
    label: "Exam & Training",
    items: [
      { label: "PSI", path: "/exam-training/psi" },
      { label: "IDP for IELTS", path: "/exam-training/idp-for-ielts" },
      { label: "TOEFL", path: "/exam-training/toefl" },
      { label: "PTE", path: "/exam-training/pte" },
      { label: "Pearson Versant Test", path: "/exam-training/pearson-versant" },
    ],
  },
  {
    label: "Gallery",
    path: "/gallery",
  },
  {
    label: "My Account",
    path: "/my-account",
  },
];
