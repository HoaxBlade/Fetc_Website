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
    sopLinks: [
      { label: "Download UK SOP", url: "https://drive.google.com/file/d/1B8woekjA86ypLvtVr9OMYXRWCktk-4F1/view?usp=sharing" },
      { label: "Download Birmingham SOP", url: "https://drive.google.com/file/d/1UPXSyf1pQCDwig2wLHoc-3chCZpb929g/view?usp=sharing" }
    ],
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
    sopLink: "https://drive.google.com/file/d/1KVCqKaaMkmR3f6AntE6ozke8Q6KMgi8p/view?usp=sharing",
    universities: allUniversities.usa,
  },
  australia: {
    name: "Australia",
    image: australiaImg,
    description:
      "Choose from top-ranked Australian universities known for practical learning, innovation, and student-friendly cities.",
    sopLink: "https://drive.google.com/file/d/1O7WaRkNDy0jJVvixXTuWiGorXHSliZZu/view?usp=sharing",
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
    sopLink: "https://drive.google.com/file/d/15uyRlYmQJiU6fv4YFnSaja3yplxaic2j/view?usp=sharing",
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
  selt: {
    name: "SELT",
    shortLabel: "SELT",
    description: "Essential English proficiency tests for UK visa and immigration applications, including IELTS for UKVI and PTE Academic UKVI.",
    fullDescription: "The Secure English Language Test (SELT) is a recognized English language proficiency exam required for visa and immigration purposes, particularly in the UK. It is mandated by the UK Visas and Immigration (UKVI) department for individuals seeking to study, work, or settle in the UK. The SELT is designed to assess your English language skills across key areas essential for everyday communication.\n\nExam Format and Structure\nThe SELT exam is offered at various levels—A1, A2, B1, and B2—each corresponding to different visa and immigration requirements. The levels indicate the complexity of the language skills being tested, from basic (A1, A2) to more advanced (B1, B2) proficiency. The exam comprises four sections: Listening, Reading, Writing, and Speaking. It is conducted only in a computer-based format, and results are securely transmitted to the relevant authorities.\n\nWho Needs to Take SELT?\nSELT is required for individuals applying for specific UK visas, including work, study, and settlement visas. Depending on the visa type, candidates must achieve a qualifying score at the required level (A1, A2, B1, or B2). Whether you are looking to work, study, or live in the UK, achieving the appropriate SELT level is a crucial step in the process.\n\nAccepted Countries and Cost\nThe SELT is specifically required for UK immigration purposes and is a prerequisite for entry to the UK. The cost of the exam varies depending on the test provider and location but generally falls within INR 10,000. This investment is crucial for those pursuing opportunities in the UK.",
    metadata: [
      { label: "Cost", value: "Approx. INR 10,000" },
      { label: "Frequency", value: "Weekly / On-demand" },
      { label: "Duration", value: "15m - 3h" },
      { label: "Validity", value: "2 Years" }
    ],
    features: [
      { highlight: "UKVI", label: "Approved" },
      { highlight: "Fast", label: "Booking" },
      { highlight: "Global", label: "Recognition" },
      { highlight: "Expert", label: "Guidance" }
    ]
  },
  "gre-gmat": {
    name: "GRE & GMAT",
    shortLabel: "GRE/GMAT",
    description: "Advanced standardized tests for graduate school and business school admissions worldwide, measuring verbal, quantitative, and analytical skills.",
    fullDescription: "The Graduate Record Examination (GRE) and the Graduate Management Admission Test (GMAT) are two of the most recognized standardized tests for admission to graduate and business schools worldwide. While the GRE is broadly accepted by various graduate programs, the GMAT is specifically designed for business school admissions. Both exams assess your readiness for advanced academic and professional studies.\n\nExam Format and Structure\nThe GRE consists of three sections: Verbal Reasoning, Quantitative Reasoning, and Analytical Writing. It evaluates your critical thinking, analytical writing, and problem-solving abilities.\nThe GMAT includes four sections: Analytical Writing Assessment, Integrated Reasoning, Quantitative Reasoning, and Verbal Reasoning. It focuses on skills relevant to business and management studies.\nBoth tests are computer-based and adaptive, meaning the difficulty of questions adjusts based on your performance.\n\nWho Needs to Take GRE/GMAT?\nThe GRE is required for admission to a wide range of graduate programs, including master’s and doctoral degrees across various disciplines. The GMAT is essential for students applying to MBA programs and other business-related graduate degrees. These exams are critical steps for anyone pursuing advanced education in their chosen field.\n\nAccepted Countries and Cost\nBoth the GRE and GMAT are accepted by universities and business schools in the USA, Canada, the UK, Australia, and many other countries. The cost of the GRE is approximately INR 19,000, while the GMAT costs around INR 25,000. These exams are significant investments in your future, opening doors to prestigious programs and career opportunities worldwide.",
    metadata: [
      { label: "Cost", value: "INR 19k - 25k" },
      { label: "Frequency", value: "Flexible" },
      { label: "Duration", value: "2h - 2.5h" },
      { label: "Validity", value: "5 Years" }
    ],
    features: [
      { highlight: "Global", label: "Admissions" },
      { highlight: "High", label: "Target Scores" },
      { highlight: "Advanced", label: "Analytics" },
      { highlight: "Full", label: "Support" }
    ]
  },
  "sat": {
    name: "SAT",
    shortLabel: "SAT",
    description: "A standardized test widely used for college admissions in the USA and other countries, assessing readiness for undergraduate education.",
    fullDescription: "The Scholastic Assessment Test (SAT) is a standardized test widely used for college admissions in the USA and other countries. It assesses a student's readiness for college and provides colleges with a common data point for comparing applicants. The SAT is a key component of the college application process for students aiming to pursue undergraduate education.\n\nExam Format and Structure\nThe SAT consists of two main sections: Evidence-Based Reading and Writing, and Math. There is also an optional Essay section, which some colleges may require. The exam is paper-based, and it measures skills that are essential for academic success in college.\n\nWho Needs to Take SAT?\nThe SAT is required for students applying to undergraduate programs in the USA and other countries. It is used by colleges to evaluate a student's academic abilities and potential for success in higher education. The SAT is crucial for students aiming to secure admission to top universities worldwide.\n\nAccepted Countries and Cost\nThe SAT is accepted primarily in the USA but is also recognized by universities in Canada, the UK, Australia, and other countries. The cost of the SAT exam is approximately INR 7,000 to INR 8,000, depending on the location and whether the Essay section is included. This investment is essential for students aiming to pursue higher education abroad.",
    metadata: [
      { label: "Cost", value: "Approx. INR 8,000" },
      { label: "Frequency", value: "7 Times / Year" },
      { label: "Duration", value: "3 Hours" },
      { label: "Validity", value: "5 Years" }
    ],
    features: [
      { highlight: "USA", label: "Undergraduate" },
      { highlight: "1500+", label: "Target Score" },
      { highlight: "Math/Eng", label: "Focus" },
      { highlight: "Expert", label: "Training" }
    ]
  },
  "idp-for-ielts": {
    name: "IELTS",
    shortLabel: "IELTS (IDP)",
    description:
      "Comprehensive IELTS coaching by experienced mentors with speaking practice, writing correction, and mock tests.",
    fullDescription: "The International English Language Testing System (IELTS) is a widely recognized English language proficiency exam required for study, work, and immigration purposes. It is accepted by educational institutions, employers, and immigration authorities in countries like the UK, USA, Australia, Canada, and New Zealand. IELTS assesses your ability to communicate effectively in English across all key skills.\n\nExam Format and Structure\nThe IELTS exam comprises four sections: Listening, Reading, Writing, and Speaking. Each section is designed to evaluate your English language proficiency in academic or general contexts. The test is available in both pen-and-paper and computer-based formats, providing flexibility to candidates.\n\nWho Needs to Take IELTS?\nIELTS is essential for individuals seeking to study, work, or migrate to English-speaking countries. It is required by universities for admission, by employers for job applications, and by immigration authorities for visa processing. The test is a key step for anyone planning to pursue opportunities abroad.\n\nAccepted Countries and Cost\nIELTS is accepted in the UK, USA, Australia, Canada, New Zealand, and other countries for educational, professional, and immigration purposes. The cost of the exam is INR 17,000, making it a crucial investment for your future abroad.",
    metadata: [
      { label: "Cost", value: "INR 17,000" },
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
    fullDescription: "The Test of English as a Foreign Language (TOEFL) is a globally recognized English proficiency test that is essential for students, professionals, and immigrants. It is widely accepted by universities, colleges, and institutions in the USA, Canada, Australia, and other English-speaking countries. TOEFL assesses your ability to use and understand English in academic settings.\n\nExam Format and Structure\nTOEFL consists of four sections: Reading, Listening, Speaking, and Writing. Each section measures a different aspect of your academic English proficiency. The test is available only in a computer-based format, ensuring a standardized and secure testing experience for all candidates.\n\nWho Needs to Take TOEFL?\nTOEFL is required for non-native English speakers seeking admission to English-speaking universities and colleges. It is also often needed for professional certifications and immigration purposes. Whether you are pursuing higher education or professional opportunities, TOEFL is a vital step in demonstrating your English proficiency.\n\nAccepted Countries and Cost\nTOEFL is accepted by institutions in the USA, Canada, Australia, and more, making it a preferred choice for students and professionals. The cost of the TOEFL exam is approximately INR 16,000, reflecting its importance in achieving your educational and career goals.",
    metadata: [
      { label: "Cost", value: "Approx. INR 16,000" },
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
    fullDescription: "The Pearson Test of English Academic (PTE-A) is a computer-based English language proficiency exam designed for non-native English speakers. It is widely accepted by universities, colleges, and governments for study, work, and migration purposes. PTE-A is recognized for its accurate and unbiased assessment, making it a preferred choice for students and professionals alike.\n\nExam Format and Structure\nThe PTE-A exam comprises three main sections: Speaking & Writing, Reading, and Listening. Each section is designed to evaluate your ability to use English in academic and real-life settings. The test is conducted entirely on a computer, and the results are typically available within a few days, making it one of the fastest options for English proficiency testing.\n\nWho Needs to Take PTE-A?\nPTE-A is ideal for individuals seeking to study, work, or migrate to English-speaking countries such as the UK, USA, Australia, Canada, and New Zealand. It is required by universities for admissions, by employers for job applications, and by immigration authorities for visa processing. Achieving a qualifying score on the PTE-A is a key step toward pursuing your goals abroad.\n\nAccepted Countries and Cost\nPTE-A is accepted by universities, colleges, and governments in the UK, USA, Australia, Canada, New Zealand, and other countries. The cost of the PTE-A exam is approximately INR 15,900. This investment is crucial for those aiming to advance their education, career, or settlement opportunities in an English-speaking environment.",
    metadata: [
      { label: "Cost", value: "Approx. INR 15,900" },
      { label: "Frequency", value: "Almost Daily" },
      { label: "Duration", value: "2 Hours" },
      { label: "Validity", value: "2 Years" }
    ],
    features: [
      { highlight: "AI-Driven", label: "Pattern Mastery" },
      { highlight: "Instant", label: "Scoring" },
      { highlight: "550+", label: "Efficiency and Quality" },
      { highlight: "300+", label: "Objective Scoring" }
    ]
  },
/*
  "pearson-versant": {
    name: "Pearson Versant Test",
    shortLabel: "Pearson Versant",
    description:
      "Whether you're an individual aiming to measure your English skills or an organization seeking reliable language assessments, the Pearson Versant Test is your go-to solution.",
    fullDescription: "At FETC, we offer the Pearson Versant Test, a leading exam that provides a swift and accurate assessment of your English proficiency across key areas: Listening, Speaking, Writing, and Reading. Whether you're an individual aiming to measure your English skills or an organization seeking reliable language assessments, the Pearson Versant Test is your go-to solution.\n\nChoosing FETC as your testing center ensures a smooth and professional experience. Our well-equipped facilities and dedicated staff are here to support you at every step, making sure your assessment is conducted in a stress-free environment. The Pearson Versant Test is designed to deliver precise results quickly, helping you make informed decisions for personal growth or organizational excellence.",
    metadata: [
      { label: "Cost", value: "Approx. INR 4,000" },
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
  psi: {
    name: "PSI",
    shortLabel: "PSI",
    description:
      "Get expert support for PSI exam preparation with test strategy, practice modules, and performance feedback.",
    fullDescription: "At FETC, we offer expert coaching for the PSI exam, providing a comprehensive and structured path to mastering your English proficiency. Our preparation courses cover all vital areas—from advanced test strategies to rigorous practice modules and detailed performance feedback. Whether you are aiming to navigate professional or academic landscapes, our PSI training is tailored to build your confidence and linguistic capabilities.\n\nChoosing FETC as your preparation partner ensures a supportive and professional learning environment. Our specialized mentors guide you through every step of the curriculum, offering targeted insights that mirror the actual testing experience. We are dedicated to delivering an unparalleled educational journey, helping you secure top PSI results and unlock global opportunities.",
    metadata: [
      { label: "Cost", value: "Approx. INR 17,000" },
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
*/
};

export const navMenus = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "About Us",
    path: "/about/company-profile",
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
    path: "/career-assessment/behaviour-and-career-analysis",
  },
  {
    label: "Exam & Training",
    items: [
      { label: "SELT", path: "/exam-training/selt" },
      { label: "GRE & GMAT", path: "/exam-training/gre-gmat" },
      { label: "SAT", path: "/exam-training/sat" },
      { label: "IDP for IELTS", path: "/exam-training/idp-for-ielts" },
      { label: "TOEFL", path: "/exam-training/toefl" },
      { label: "PTE", path: "/exam-training/pte" },
      // { label: "Pearson Versant Test", path: "/exam-training/pearson-versant" },
      // { label: "PSI", path: "/exam-training/psi" },
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
