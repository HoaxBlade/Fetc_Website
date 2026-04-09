import australiaImg from "../assets/countries/australia.png";
import dubaiImg from "../assets/countries/dubai.png";
import europeImg from "../assets/countries/europe.png";
import irelandImg from "../assets/countries/ireland.png";
import newZealandImg from "../assets/countries/new-zealand.png";
import ukImg from "../assets/countries/uk.png";
import usaImg from "../assets/countries/usa.png";

export const countryData = {
  "united-kingdom": {
    name: "United Kingdom",
    image: ukImg,
    description:
      "Study in globally recognized UK institutions with excellent academic support, scholarships, and post-study work opportunities.",
  },
  europe: {
    name: "Europe",
    image: europeImg,
    description:
      "Explore affordable and high-quality education options across Europe with multicultural learning environments and career pathways.",
  },
  usa: {
    name: "USA",
    image: usaImg,
    description:
      "Access world-class universities, cutting-edge research opportunities, and diverse campus experiences in the United States.",
  },
  australia: {
    name: "Australia",
    image: australiaImg,
    description:
      "Choose from top-ranked Australian universities known for practical learning, innovation, and student-friendly cities.",
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
  },
  dubai: {
    name: "Dubai",
    image: dubaiImg,
    description:
      "Pursue modern education programs in Dubai with strong global links and a fast-growing professional ecosystem.",
  },
};

export const examData = {
  psi: {
    name: "PSI",
    shortLabel: "PSI",
    description:
      "Get expert support for PSI exam preparation with test strategy, practice modules, and performance feedback.",
  },
  "idp-for-ielts": {
    name: "IDP for IELTS",
    shortLabel: "IELTS (IDP)",
    description:
      "Comprehensive IELTS coaching by experienced mentors with speaking practice, writing correction, and mock tests.",
  },
  toefl: {
    name: "TOEFL",
    shortLabel: "TOEFL",
    description:
      "Target your TOEFL score through skill-based training sessions for reading, listening, writing, and speaking.",
  },
  pte: {
    name: "PTE",
    shortLabel: "PTE",
    description:
      "Prepare for PTE with AI-driven patterns, timed practice, and structured guidance to improve your score quickly.",
  },
};

export const navMenus = [
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
      { label: "Australia", path: "/study-abroad/australia" },
      { label: "New Zealand", path: "/study-abroad/new-zealand" },
      { label: "Ireland", path: "/study-abroad/ireland" },
      { label: "Dubai", path: "/study-abroad/dubai" },
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
    ],
  },
];
