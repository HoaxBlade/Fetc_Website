const { Client } = require('pg');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const pathPrefix = "/assets/study-abroad/university-logos/";

const exams = {
  "selt": {
    title: "SELT - Secure English Language Test",
    description: "Essential English proficiency tests for UK visa and immigration applications, including IELTS for UKVI and PTE Academic UKVI.",
    fullDescription: "The Secure English Language Test (SELT) is a recognized English language proficiency exam required for visa and immigration purposes, particularly in the UK. It is mandated by the UK Visas and Immigration (UKVI) department for individuals seeking to study, work, or settle in the UK. The SELT is designed to assess your English language skills across key areas essential for everyday communication.\n\nExam Format and Structure\nThe SELT exam is offered at various levels—A1, A2, B1, and B2—each corresponding to different visa and immigration requirements. The levels indicate the complexity of the language skills being tested, from basic (A1, A2) to more advanced (B1, B2) proficiency. The exam comprises four sections: Listening, Reading, Writing, and Speaking. It is conducted only in a computer-based format, and results are securely transmitted to the relevant authorities.\n\nWho Needs to Take SELT?\nSELT is required for individuals applying for specific UK visas, including work, study, and settlement visas. Depending on the visa type, candidates must achieve a qualifying score at the required level (A1, A2, B1, or B2). Whether you are looking to work, study, or live in the UK, achieving the appropriate SELT level is a crucial step in the process.\n\nAccepted Countries and Cost\nThe SELT is specifically required for UK immigration purposes and is a prerequisite for entry to the UK. The cost of the exam varies depending on the test provider and location but generally falls within INR 10,000. This investment is crucial for those pursuing opportunities in the UK.",
    features: [
      { highlight: "UKVI", label: "Approved" },
      { highlight: "Fast", label: "Booking" },
      { highlight: "Global", label: "Recognition" },
      { highlight: "Expert", label: "Guidance" }
    ]
  },
  "gre-gmat": {
    title: "GRE & GMAT - Graduate Admissions",
    description: "Advanced standardized tests for graduate school and business school admissions worldwide, measuring verbal, quantitative, and analytical skills.",
    fullDescription: "The Graduate Record Examination (GRE) and the Graduate Management Admission Test (GMAT) are two of the most recognized standardized tests for admission to graduate and business schools worldwide. While the GRE is broadly accepted by various graduate programs, the GMAT is specifically designed for business school admissions. Both exams assess your readiness for advanced academic and professional studies.\n\nExam Format and Structure\nThe GRE consists of three sections: Verbal Reasoning, Quantitative Reasoning, and Analytical Writing. It evaluates your critical thinking, analytical writing, and problem-solving abilities.\nThe GMAT includes four sections: Analytical Writing Assessment, Integrated Reasoning, Quantitative Reasoning, and Verbal Reasoning. It focuses on skills relevant to business and management studies.\nBoth tests are computer-based and adaptive, meaning the difficulty of questions adjusts based on your performance.\n\nWho Needs to Take GRE/GMAT?\nThe GRE is required for admission to a wide range of graduate programs, including master’s and doctoral degrees across various disciplines. The GMAT is essential for students applying to MBA programs and other business-related graduate degrees. These exams are critical steps for anyone pursuing advanced education in their chosen field.\n\nAccepted Countries and Cost\nBoth the GRE and GMAT are accepted by universities and business schools in the USA, Canada, the UK, Australia, and many other countries. The cost of the GRE is approximately INR 19,000, while the GMAT costs around INR 25,000. These exams are significant investments in your future, opening doors to prestigious programs and career opportunities worldwide.",
    features: [
      { highlight: "Global", label: "Admissions" },
      { highlight: "High", label: "Target Scores" },
      { highlight: "Advanced", label: "Analytics" },
      { highlight: "Full", label: "Support" }
    ]
  },
  "sat": {
    title: "SAT - Scholastic Assessment Test",
    description: "A standardized test widely used for college admissions in the USA and other countries, assessing readiness for undergraduate education.",
    fullDescription: "The Scholastic Assessment Test (SAT) is a standardized test widely used for college admissions in the USA and other countries. It assesses a student's readiness for college and provides colleges with a common data point for comparing applicants. The SAT is a key component of the college application process for students aiming to pursue undergraduate education.\n\nExam Format and Structure\nThe SAT consists of two main sections: Evidence-Based Reading and Writing, and Math. There is also an optional Essay section, which some colleges may require. The exam is paper-based, and it measures skills that are essential for academic success in college.\n\nWho Needs to Take SAT?\nThe SAT is required for students applying to undergraduate programs in the USA and other countries. It is used by colleges to evaluate a student's academic abilities and potential for success in higher education. The SAT is crucial for students aiming to secure admission to top universities worldwide.\n\nAccepted Countries and Cost\nThe SAT is accepted primarily in the USA but is also recognized by universities in Canada, the UK, Australia, and other countries. The cost of the SAT exam is approximately INR 7,000 to INR 8,000, depending on the location and whether the Essay section is included. This investment is essential for students aiming to pursue higher education abroad.",
    features: [
      { highlight: "USA", label: "Undergraduate" },
      { highlight: "1500+", label: "Target Score" },
      { highlight: "Math/Eng", label: "Focus" },
      { highlight: "Expert", label: "Training" }
    ]
  },
  "idp-for-ielts": {
    title: "IDP IELTS - Academic & General",
    description: "The International English Language Testing System (IELTS) is a widely recognized English language proficiency exam required for study, work, and immigration purposes.",
    fullDescription: "The International English Language Testing System (IELTS) is a widely recognized English language proficiency exam required for study, work, and immigration purposes. It is accepted by educational institutions, employers, and immigration authorities in countries like the UK, USA, Australia, Canada, and New Zealand. IELTS assesses your ability to communicate effectively in English across all key skills.\n\nExam Format and Structure\nThe IELTS exam comprises four sections: Listening, Reading, Writing, and Speaking. Each section is designed to evaluate your English language proficiency in academic or general contexts. The test is available in both pen-and-paper and computer-based formats, providing flexibility to candidates.\n\nWho Needs to Take IELTS?\nIELTS is essential for individuals seeking to study, work, or migrate to English-speaking countries. It is required by universities for admission, by employers for job applications, and by immigration authorities for visa processing. The test is a key step for anyone planning to pursue opportunities abroad.\n\nAccepted Countries and Cost\nIELTS is accepted in the UK, USA, Australia, Canada, New Zealand, and other countries for educational, professional, and immigration purposes. The cost of the exam is INR 17,000, making it a crucial investment for your future abroad.",
    features: [
      { highlight: "8.0+", label: "Average Band Score" },
      { highlight: "Weekly", label: "Mock Tests" },
      { highlight: "550+", label: "Comprehensive Assessment" },
      { highlight: "100%", label: "Success Rate" }
    ]
  },
  "toefl": {
    title: "TOEFL - English Proficiency",
    description: "The Test of English as a Foreign Language (TOEFL) is a globally recognized English proficiency test that is essential for students, professionals, and immigrants.",
    fullDescription: "The Test of English as a Foreign Language (TOEFL) is a globally recognized English proficiency test that is essential for students, professionals, and immigrants. It is widely accepted by universities, colleges, and institutions in the USA, Canada, Australia, and other English-speaking countries. TOEFL assesses your ability to use and understand English in academic settings.\n\nExam Format and Structure\nTOEFL consists of four sections: Reading, Listening, Speaking, and Writing. Each section measures a different aspect of your academic English proficiency. The test is available only in a computer-based format, ensuring a standardized and secure testing experience for all candidates.\n\nWho Needs to Take TOEFL?\nTOEFL is required for non-native English speakers seeking admission to English-speaking universities and colleges. It is also often needed for professional certifications and immigration purposes. Whether you are pursuing higher education or professional opportunities, TOEFL is a vital step in demonstrating your English proficiency.\n\nAccepted Countries and Cost\nTOEFL is accepted by institutions in the USA, Canada, Australia, and more, making it a preferred choice for students and professionals. The cost of the TOEFL exam is approximately INR 16,000, reflecting its importance in achieving your educational and career goals.",
    features: [
      { highlight: "100%", label: "Rapid Results" },
      { highlight: "500+", label: "Elite Mentors" },
      { highlight: "550+", label: "Efficiency and Quality" },
      { highlight: "300+", label: "Objective Scoring" }
    ]
  },
  "pte": {
    title: "PTE - Pearson Test of English",
    description: "The Pearson Test of English Academic (PTE-A) is a computer-based English language proficiency exam designed for non-native English speakers.",
    fullDescription: "The Pearson Test of English Academic (PTE-A) is a computer-based English language proficiency exam designed for non-native English speakers. It is widely accepted by universities, colleges, and governments for study, work, and migration purposes. PTE-A is recognized for its accurate and unbiased assessment, making it a preferred choice for students and professionals alike.\n\nExam Format and Structure\nThe PTE-A exam comprises three main sections: Speaking & Writing, Reading, and Listening. Each section is designed to evaluate your ability to use English in academic and real-life settings. The test is conducted entirely on a computer, and the results are typically available within a few days, making it one of the fastest options for English proficiency testing.\n\nWho Needs to Take PTE-A?\nPTE-A is ideal for individuals seeking to study, work, or migrate to English-speaking countries such as the UK, USA, Australia, Canada, and New Zealand. It is required by universities for admissions, by employers for job applications, and by immigration authorities for visa processing. Achieving a qualifying score on the PTE-A is a key step toward pursuing your goals abroad.\n\nAccepted Countries and Cost\nPTE-A is accepted by universities, colleges, and governments in the UK, USA, Australia, Canada, New Zealand, and other countries. The cost of the PTE-A exam is approximately INR 15,900. This investment is crucial for those aiming to advance their education, career, or settlement opportunities in an English-speaking environment.",
    features: [
      { highlight: "AI-Driven", label: "Pattern Mastery" },
      { highlight: "Instant", label: "Scoring" },
      { highlight: "550+", label: "Efficiency and Quality" },
      { highlight: "300+", label: "Objective Scoring" }
    ]
  },
  "pearson-versant": {
    title: "Pearson Versant - Language Assessment",
    description: "Measure your automated language proficiency with the world's most trusted AI-driven assessment tool.",
    features: [
      { highlight: "Instant", label: "Score Delivery" },
      { highlight: "Global", label: "Industry Standard" },
      { highlight: "AI-Driven", label: "Scoring" },
      { highlight: "Fast", label: "Results" }
    ]
  },
  "psi": {
    title: "PSI - Global Testing Leader",
    description: "Prepare for your PSI examinations with our expert-led modules and comprehensive practice materials used by thousands worldwide.",
    features: [
      { highlight: "Expert Led", label: "Professional Training" },
      { highlight: "100%", label: "Real Exam Simulation" },
      { highlight: "Expert", label: "Coaching" },
      { highlight: "Targeted", label: "Strategy" }
    ]
  }
};

const countries = {
  "united-kingdom": {
    name: "United Kingdom",
    image: "/assets/countries/uk.png",
    description: "Study in globally recognized UK institutions with excellent academic support, scholarships, and post-study work opportunities.",
    sopLinks: [
      { label: "Download UK SOP", url: "https://drive.google.com/file/d/1B8woekjA86ypLvtVr9OMYXRWCktk-4F1/view?usp=sharing" },
      { label: "Download Birmingham SOP", url: "https://drive.google.com/file/d/1UPXSyf1pQCDwig2wLHoc-3chCZpb929g/view?usp=sharing" }
    ],
    universities: [
      { name: "UWS UK", link: "https://www.uws.ac.uk/", image: pathPrefix + "exclusive-logos/UWS UK.png", exclusive: true },
      { name: "Bangor University", link: "http://www.bangor.ac.uk/", image: pathPrefix + "UK/Bangor University_UK.png", exclusive: false },
      { name: "Buckinghamshire New University", link: "https://www.bucks.ac.uk/", image: pathPrefix + "UK/Buckingham New Hampshire University_UK.png", exclusive: false },
      { name: "Canterbury Christ Church University", link: "http://www.canterbury.ac.uk/", image: pathPrefix + "UK/Canterbury Christ Church University_UK.png", exclusive: false },
      { name: "De Montfort university", link: "http://www.dmu.ac.uk/", image: pathPrefix + "UK/De Montfort university_UK.png", exclusive: false },
      { name: "European School of Economics", link: "http://www.eselondon.ac.uk/", image: pathPrefix + "UK/European School of Economics_UK.png", exclusive: false },
      { name: "Leeds Beckett University", link: "https://www.leedsbeckett.ac.uk/", image: pathPrefix + "UK/Leeds Beckett University_UK.png", exclusive: false },
      { name: "London Metropolitan University", link: "http://www.londonmet.ac.uk/", image: pathPrefix + "UK/London Metropolitan University_UK.png", exclusive: false },
      { name: "LSBU", link: "https://www.lsbu.ac.uk/", image: pathPrefix + "UK/LSBU_UK.jpg", exclusive: false },
      { name: "Middlesex University London", link: "https://www.mdx.ac.uk/", image: pathPrefix + "UK/Middlesex University London_UK.png", exclusive: false },
      { name: "Northumbria University", link: "https://www.northumbria.ac.uk/", image: pathPrefix + "UK/Northumbria University_UK.png", exclusive: false },
      { name: "Ravensbourne University", link: "https://www.ravensbourne.ac.uk/", image: pathPrefix + "UK/Ravensbourne University_UK.png", exclusive: false },
      { name: "Teesside University", link: "http://www.tees.ac.uk/", image: pathPrefix + "UK/Teesside University_UK.png", exclusive: false },
      { name: "Ulster University", link: "https://www.ulster.ac.uk/", image: pathPrefix + "UK/Ulster University_UK.png", exclusive: false },
      { name: "University College Birmingham", link: "http://www.ucb.ac.uk/", image: pathPrefix + "UK/University College Birmingham_UK.jpg", exclusive: false },
      { name: "University of Brighton", link: "http://www.bton.ac.uk/", image: pathPrefix + "UK/University of Brighton_UK.png", exclusive: false },
      { name: "University of Chester", link: "http://www.chester.ac.uk/", image: pathPrefix + "UK/University of Chester_UK.png", exclusive: false },
      { name: "University of Cumbria", link: "https://www.cumbria.ac.uk/", image: pathPrefix + "UK/University of Cumbria_UK.png", exclusive: false },
      { name: "University of East London", link: "http://www.uel.ac.uk/", image: pathPrefix + "UK/University of East London -uk.png", exclusive: false },
      { name: "University of Greenwich", link: "http://www.gre.ac.uk/", image: pathPrefix + "UK/University of Greenwich_UK.png", exclusive: false },
      { name: "University of Portsmouth", link: "http://www.port.ac.uk/", image: pathPrefix + "UK/University of Portsmouth_UK.png", exclusive: false },
      { name: "University of Wales Trinity Saint David (UWTSD)", link: "https://www.uwtsd.ac.uk/", image: pathPrefix + "UK/University of Wales Trinity Saint David (UWTSD)_UK.png", exclusive: false },
      { name: "University of West London", link: "http://www.uwl.ac.uk/", image: pathPrefix + "UK/University of West London_UK.png", exclusive: false },
      { name: "QA Universities", link: "https://highereducation.qa.com/", image: null, exclusive: true }
    ],
  },
  "usa": {
    name: "USA",
    image: "/assets/countries/usa.png",
    description: "Access world-class universities, cutting-edge research opportunities, and diverse campus experiences in the United States.",
    sopLink: "https://drive.google.com/file/d/1KVCqKaaMkmR3f6AntE6ozke8Q6KMgi8p/view?usp=sharing",
    universities: [
      { name: "LIM College", link: "https://www.limcollege.edu/", image: pathPrefix + "exclusive-logos/LIM College_USA.png", exclusive: true },
      { name: "Texas A&M San Antonio", link: "https://www.tamusa.edu/", image: pathPrefix + "exclusive-logos/University Texas a&m USA.png", exclusive: true },
      { name: "Adelphi University", link: "http://www.adelphi.edu/", image: pathPrefix + "USA/Adelphi University_USA.png", exclusive: false },
      { name: "American Collegiate", link: "https://www.american.edu/", image: pathPrefix + "USA/American Collegiate_USA.png", exclusive: false },
      { name: "American University", link: "http://www.aubih.ba/", image: pathPrefix + "USA/American University_USA.png", exclusive: false },
      { name: "Auburn University at Montgomery", link: "http://www.aum.edu/", image: pathPrefix + "USA/Auburn University at Montgomery_USA.png", exclusive: false },
      { name: "Auburn University", link: "http://www.auburn.edu/", image: pathPrefix + "USA/Auburn University_USA.png", exclusive: false },
      { name: "Avila University", link: "https://www.avila.edu/", image: pathPrefix + "USA/Avila University_USA.png", exclusive: true },
      { name: "California State University Monterey Bay", link: "https://csumb.edu/", image: pathPrefix + "USA/California State University Monterey Bay_USA.png", exclusive: false },
      { name: "Concordia University", link: "http://cinema.concordia.ca/", image: pathPrefix + "USA/Concordia University - St Paul_USA.png", exclusive: false },
      { name: "DePaul University", link: "http://www.depaul.edu/", image: pathPrefix + "USA/DePaul University_USA.png", exclusive: false },
      { name: "Florida International University", link: "http://www.fiu.edu/", image: pathPrefix + "USA/Florida International University_USA.png", exclusive: false },
      { name: "Foothill Deanza", link: "https://www.fhda.edu/", image: pathPrefix + "USA/Foothill Deanza_USA.png", exclusive: false },
      { name: "Full Sail University", link: "http://www.fullsail.edu/", image: pathPrefix + "USA/Full Sail University_USA.png", exclusive: false },
      { name: "Hawai Pacific University", link: "https://www.hpu.edu/", image: pathPrefix + "USA/Hawai Pacific University_USA.png", exclusive: false },
      { name: "Long Island University Brooklyn", link: "https://liu.edu/brooklyn", image: pathPrefix + "USA/Long Island University Brooklyn_USA.png", exclusive: false },
      { name: "Louisiana State University", link: "http://www.lsu.edu/", image: pathPrefix + "USA/Louisiana State University_USA.png", exclusive: false },
      { name: "Rowan University", link: "http://www.rowan.edu/", image: pathPrefix + "USA/Rowan University_USA.png", exclusive: false },
      { name: "Texas A&M University-Corpus Christi", link: "https://www.tamucc.edu/", image: pathPrefix + "USA/Texas A&M University-Corpus Christi_USA.jpg", exclusive: false },
      { name: "Tiffin University", link: "http://www.tiffin.edu/", image: pathPrefix + "USA/Tiffin University_USA.png", exclusive: false },
      { name: "University of Alabama at Birmingham", link: "http://www.uab.edu/", image: pathPrefix + "USA/University of Alabama at Birmingham - UAB_USA.png", exclusive: false },
      { name: "University of Central Florida", link: "http://www.ucf.edu/", image: pathPrefix + "USA/University of Central Florida_USA.png", exclusive: false },
      { name: "University of Dayton", link: "http://www.udayton.edu/", image: pathPrefix + "USA/University of Dayton_USA.png", exclusive: false },
      { name: "University of Hartford", link: "http://www.hartford.edu/", image: pathPrefix + "USA/University of Hartford_USA.png", exclusive: false },
      { name: "University of Kansas", link: "http://www.ku.edu", image: pathPrefix + "USA/University of Kansas_USA.png", exclusive: false },
      { name: "University of Massachusetts Boston", link: "https://www.umb.edu/", image: pathPrefix + "USA/University of Massachusetts Boston_USA.png", exclusive: false },
      { name: "University of Mississippi", link: "http://www.olemiss.edu/", image: pathPrefix + "USA/University of Mississippi_USA.png", exclusive: false },
      { name: "University of South Carolina", link: "http://www.sc.edu/", image: pathPrefix + "USA/University of South Carolina_USA.png", exclusive: false },
      { name: "University of the Pacific", link: "http://www.uop.edu/", image: pathPrefix + "USA/University of the Pacific_USA.png", exclusive: false },
      { name: "University of Utah", link: "http://www.utah.edu/", image: pathPrefix + "USA/University of Utah_USA.png", exclusive: false }
    ],
  },
  "canada": {
    name: "Canada",
    image: "/assets/study-abroad/Canada.png",
    description: "Explore world-class academic institutions, diverse culture, and vast post-study opportunities in Canada.",
    universities: [
      { name: "Algoma University", link: "https://algomau.ca/", image: pathPrefix + "CANADA/Algoma University_Canada.png", exclusive: false },
      { name: "College Avalon", link: "https://collegeavalon.com/", image: pathPrefix + "CANADA/College Avalon_Canada.png", exclusive: false },
      { name: "Cypress College", link: "https://www.cypresscollege.edu/", image: pathPrefix + "CANADA/Cypress College_Canada.png", exclusive: false },
      { name: "International Business University", link: "https://ibu.ca/", image: pathPrefix + "CANADA/International Business University_Canada.png", exclusive: false },
      { name: "Laurentian University", link: "https://laurentian.ca/", image: pathPrefix + "CANADA/Laurentian University_Canada.png", exclusive: false },
      { name: "PLC", link: "https://plvan.com/", image: pathPrefix + "CANADA/PLC_Canada.png", exclusive: false },
      { name: "Red Deer Polytechnic", link: "https://rdpolytech.ca/", image: pathPrefix + "CANADA/Red Deer Polytechnic_Canada.png", exclusive: false },
      { name: "Western Community College", link: "https://westerncommunitycollege.ca/", image: pathPrefix + "CANADA/Western Community College_Canada.png", exclusive: false },
      { name: "York College of Applied Science", link: "https://yorkcas.ca/", image: pathPrefix + "CANADA/York College of Applied Science_Canada.png", exclusive: false },
      { name: "Yorkville University", link: "https://www.yorkvilleu.ca/", image: pathPrefix + "CANADA/Yorkville University_Canada.png", exclusive: false }
    ],
  },
  "australia": {
    name: "Australia",
    image: "/assets/countries/australia.png",
    description: "Choose from top-ranked Australian universities known for practical learning, innovation, and student-friendly cities.",
    sopLink: "https://drive.google.com/file/d/1O7WaRkNDy0jJVvixXTuWiGorXHSliZZu/view?usp=sharing",
    universities: [
      { name: "Bond University", link: "http://www.bond.edu.au/", image: pathPrefix + "AUSTRALIA/Bond University_Australia.png", exclusive: false },
      { name: "Charles Darwin University", link: "http://www.cdu.edu.au/", image: pathPrefix + "AUSTRALIA/Charles Darwin University_Australia.png", exclusive: false },
      { name: "Deakin University", link: "http://www.deakin.edu.au/", image: pathPrefix + "AUSTRALIA/Deakin University_Australia.png", exclusive: false },
      { name: "Federation University Australia", link: "http://federation.edu.au/", image: pathPrefix + "AUSTRALIA/Federation University Australia_Australia.png", exclusive: false },
      { name: "Flinders University", link: "http://www.flinders.edu.au/", image: pathPrefix + "AUSTRALIA/Flinders University_Australia.png", exclusive: false },
      { name: "Griffith University", link: "https://www.griffith.edu.au/", image: pathPrefix + "AUSTRALIA/Griffith University_Australia.png", exclusive: false },
      { name: "La Trobe University", link: "http://www.latrobe.edu.au/", image: pathPrefix + "AUSTRALIA/La Trobe University_Australia.jpg", exclusive: false },
      { name: "RMIT", link: "http://www.rmit.edu.au/", image: pathPrefix + "AUSTRALIA/RMIT_Australia.png", exclusive: false },
      { name: "Swinburne University of Technology", link: "http://www.swin.edu.au/", image: pathPrefix + "AUSTRALIA/Swinburne University of Technology - Sydney_Australia.png", exclusive: false },
      { name: "The University of Newcastle Australia", link: "https://www.newcastle.edu.au/", image: pathPrefix + "AUSTRALIA/The University of Newcastle Australia_Australia.png", exclusive: false },
      { name: "University of Canberra", link: "http://www.canberra.edu.au/", image: pathPrefix + "AUSTRALIA/University of Canberra_Australia.png", exclusive: false },
      { name: "University of Melbourne", link: "http://www.unimelb.edu.au/", image: pathPrefix + "AUSTRALIA/University of Melbourne_Australia.png", exclusive: false },
      { name: "University of New South Wales", link: "http://www.unsw.edu.au/", image: pathPrefix + "AUSTRALIA/University of New South Wales_Australia.png", exclusive: false },
      { name: "University of Queensland", link: "http://www.uq.edu.au/", image: pathPrefix + "AUSTRALIA/University of Queensland_Australia.png", exclusive: false },
      { name: "University of South Australia", link: "http://www.unisa.edu.au/", image: pathPrefix + "AUSTRALIA/University of South Australia_Australia.png", exclusive: false },
      { name: "University of Southern Queensland", link: "http://www.usq.edu.au/", image: pathPrefix + "AUSTRALIA/University of Southern Queensland_Australia.jpg", exclusive: false },
      { name: "University of Technology Sydney", link: "http://www.uts.edu.au/", image: pathPrefix + "AUSTRALIA/University of Technology Sydney_Australia.png", exclusive: false },
      { name: "University of Wollongong", link: "http://www.uow.edu.au/", image: pathPrefix + "AUSTRALIA/University of Wollongong_Australia.png", exclusive: false },
      { name: "Victoria University", link: "http://www.vu.edu.au/", image: pathPrefix + "AUSTRALIA/Victoria University_Australia.png", exclusive: false },
      { name: "Western Sydney University", link: "https://www.westernsydney.edu.au/", image: pathPrefix + "AUSTRALIA/Western Sydney University_Australia.png", exclusive: false }
    ],
  },
  "europe": {
    name: "Europe",
    image: "/assets/countries/europe.png",
    description: "Explore affordable and high-quality education options across Europe with multicultural learning environments and career pathways.",
    universities: [
      { name: "Aix Marseille Universite", link: "https://www.univ-amu.fr/", image: pathPrefix + "EUROPE/Aix Marseille Universite, France.jpg", exclusive: false },
      { name: "Berlin School of Business and Innovation", link: "https://www.berlinsbi.com/", image: pathPrefix + "EUROPE/Berlin School of Business and Innovation_Germany.png", exclusive: false },
      { name: "Burgundy School of Business", link: "https://www.bsb-education.com/", image: pathPrefix + "EUROPE/Burgundy School of Business_France.jpg", exclusive: false },
      { name: "College De Paris", link: "https://www.collegedeparis.fr/", image: pathPrefix + "EUROPE/College De Paris, France.png", exclusive: false },
      { name: "De Vinci University", link: "https://www.devinci.fr/", image: pathPrefix + "EUROPE/De Vinci University_France.jpg", exclusive: false },
      { name: "EADA Business School", link: "https://www.eada.edu/", image: pathPrefix + "EUROPE/EADA Business School_Spain.png", exclusive: false },
      { name: "EU Business School", link: "https://www.euruni.edu/", image: pathPrefix + "EUROPE/EU Business School_Spain.png", exclusive: false },
      { name: "GISMA University of Applied Sciences", link: "https://www.gisma.com/", image: pathPrefix + "EUROPE/GISMA University of Applied Sciences_Germany.png", exclusive: false },
      { name: "IBAT College Dublin", link: "https://www.ibat.ie/", image: pathPrefix + "EUROPE/IBAT College Dublin_Ireland.png", exclusive: false },
      { name: "ICN Business School", link: "https://www.icn-artem.com/", image: pathPrefix + "EUROPE/ICN Business School_France.png", exclusive: false },
      { name: "ILA", link: "https://www.ilamilan.com/", image: pathPrefix + "EUROPE/ILA_Italy.jpg", exclusive: true },
      { name: "Maynooth university", link: "https://www.maynoothuniversity.ie/", image: pathPrefix + "EUROPE/Maynooth university_Ireland.png", exclusive: false },
      { name: "National College of Ireland", link: "https://www.ncirl.ie/", image: pathPrefix + "EUROPE/National College of Ireland_Ireland.png", exclusive: false },
      { name: "Schiller International University", link: "https://schiller.edu/", image: pathPrefix + "EUROPE/Schiller International University, France.png", exclusive: false },
      { name: "Trinity College Dublin", link: "https://www.tcd.ie/", image: pathPrefix + "EUROPE/Trinity College Dublin_Ireland.png", exclusive: false },
      { name: "TU Dublin", link: "https://www.tudublin.ie/", image: pathPrefix + "EUROPE/TU Dublin_Ireland.png", exclusive: false },
      { name: "University of Europe for Applied Sciences", link: "https://www.ue-germany.com/", image: pathPrefix + "EUROPE/University of Europe for Applied Sciences_Germany.png", exclusive: false },
      { name: "University of Ireland Galway", link: "https://www.universityofgalway.ie/", image: pathPrefix + "EUROPE/University of Ireland Galway_Ireland.png", exclusive: false },
      { name: "University of Lyon", link: "https://www.universite-lyon.fr/", image: pathPrefix + "EUROPE/University of Lyon_France.png", exclusive: false }
    ],
  },
  "dubai": {
    name: "Dubai",
    image: "/assets/countries/dubai.png",
    description: "Access international quality education in a vibrant, multicultural global business hub with excellent career prospects.",
    universities: [
      { name: "De Montfort University (DMU)", link: "https://www.dmu.ac.uk/dubai/", image: pathPrefix + "UAE/De Montfort University (DMU) - Dubai.jpg", exclusive: false },
      { name: "GBS", link: "https://gbs.ac.ae/", image: pathPrefix + "UAE/GBS_Dubai.png", exclusive: false },
      { name: "Middlesex University", link: "https://www.mdx.ac.ae/", image: pathPrefix + "UAE/Middlesex University_Dubai.png", exclusive: false },
      { name: "RIT", link: "https://www.rit.edu/dubai/", image: pathPrefix + "UAE/RIT_Dubai.png", exclusive: false }
    ],
  },
  "new-zealand": {
    name: "New Zealand",
    image: "/assets/countries/new-zealand.png",
    description: "Experience high-quality education and a stunning natural environment in New Zealand, known for its innovation and welcoming culture.",
    universities: [
      { name: "University of Auckland", link: "https://www.auckland.ac.nz/", image: null, exclusive: false }
    ],
  },
  "ireland": {
    name: "Ireland",
    image: "/assets/countries/ireland.png",
    description: "Study in Ireland, a hub for technology and innovation with world-class academic institutions and a rich cultural heritage.",
    sopLink: "https://drive.google.com/file/d/15uyRlYmQJiU6fv4YFnSaja3yplxaic2j/view?usp=sharing",
    universities: [
      { name: "Griffith College", link: "https://www.griffith.ie/", image: pathPrefix + "exclusive-logos/Griffith Logo Ireland.jpg", exclusive: true },
      { name: "Trinity College Dublin", link: "https://www.tcd.ie/", image: pathPrefix + "EUROPE/Trinity College Dublin_Ireland.png", exclusive: false },
      { name: "National College of Ireland", link: "https://www.ncirl.ie/", image: pathPrefix + "EUROPE/National College of Ireland_Ireland.png", exclusive: false }
    ],
  },
  "singapore": {
    name: "Singapore",
    image: "/assets/countries/dubai.png",
    description: "Learn in a world-leading global hub for education, research, and innovation with safe and beautiful city life.",
    universities: [
      { name: "LSBF Singapore", link: "https://www.lsbf.edu.sg/", image: pathPrefix + "exclusive-logos/LSBF Singapore.png", exclusive: true }
    ],
  }
};

const mainPages = {
  "/": {
    title: "Home",
    content: {
       hero: {
         badge: "Your Global Education Partner",
         titleMain: "Shape Your Future with",
         titleHighlight: "Global Education",
         subtitle: "We provide comprehensive behavioral analysis and expert guidance to help you find the perfect university and career path abroad.",
         buttonText: "Start Assessment",
         bgImage: "https://images.unsplash.com/photo-1523050335192-ce67a27662ad?q=80&w=2000"
       },
       trustBar: {
         message: "Trusted by 100+ Global Universities & 10k+ Students Worldwide"
       },
       careerAssessment: {
         title: "Career Assessment",
         description: "Align your natural strengths with the perfect professional or academic trajectory. We help you discover what you are meant to do.",
         linkText: "Get Assessed",
         secondTitle: "Helpful Resources",
         secondDescription: "Access essential documents and guides to help you navigate your journey abroad with confidence.",
         items: [
           {
             title: "Behaviour and Career Analysis",
             description: "Discover your perfect professional path with our highly tailored behavioral and occupational analysis.",
             path: "/career-assessment/behaviour-and-career-analysis"
           },
           {
             title: "Helpful Resources",
             links: [
               { label: "Financial Planning Checklist", url: "https://drive.google.com/file/d/1wX99-y42WJNS8U8uAiS3xQzUrpiivcUM/view?usp=drive_link" },
               { label: "Part time job and internships", url: "https://drive.google.com/file/d/1iXz--uNuiuBBHnNv8yX3khWjzBhUspyG/view?usp=drive_link" },
               { label: "Road Map Study Abroad", url: "https://drive.google.com/file/d/139BsYSsVSIPziOebKWNL8StFU7LGs6P3/view?usp=drive_link" },
               { label: "Service Provider Agreement", url: "https://drive.google.com/file/d/16RCN90tqMDusAexTX6L2fKCLu92XSZYh/view?usp=drive_link" }
             ]
           }
         ]
       }
    }
  },
  "/about/company-profile": {
    title: "Company Profile",
    content: {
       hero: {
         title: "Our",
         titleHighlight: "Story",
         description: "FETC (Foreign English Tests Capital) is a premier educational consultancy dedicated to bridging the gap between local talent and global opportunities."
       },
       directorsNote: {
         quote: "Education is the most powerful weapon which you can use to change the world.",
         content: "At FETC, we believe every student has a unique potential that deserves a global stage. Our mission is to guide you with honesty, data, and passion."
       }
    }
  }
};

const db = require('./db');

async function seed(externalDb) {
  const database = externalDb || db;
  console.log('Starting seeding process...');

  // Seed Main Pages
  for (const [slug, page] of Object.entries(mainPages)) {
    const query = `
      INSERT INTO pages (title, slug, content, status) 
      VALUES ($1, $2, $3, 'PUBLISHED') 
      ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, title = EXCLUDED.title;
    `;
    await database.query(query, [page.title, slug, JSON.stringify(page.content)]);
    console.log(`Seeded Main Page: ${slug}`);
  }

  // Seed Countries
  for (const [slug, content] of Object.entries(countries)) {
    const fullSlug = `/study-abroad/${slug}`;
    const query = `
      INSERT INTO pages (title, slug, content, status) 
      VALUES ($1, $2, $3, 'PUBLISHED') 
      ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, title = EXCLUDED.title;
    `;
    await database.query(query, [content.name, fullSlug, JSON.stringify(content)]);
    console.log(`Seeded Country: ${fullSlug}`);
  }

  // Seed Exams
  for (const [slug, content] of Object.entries(exams)) {
    const fullSlug = `/exam-training/${slug}`;
    const query = `
      INSERT INTO pages (title, slug, content, status) 
      VALUES ($1, $2, $3, 'PUBLISHED') 
      ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, title = EXCLUDED.title;
    `;
    await database.query(query, [content.title, fullSlug, JSON.stringify(content)]);
    console.log(`Seeded Exam: ${fullSlug}`);
  }

  // --- Gallery Auto Seeding ---
  try {
    const officeImagesDir = path.join(__dirname, '..', 'public', 'assets', 'office-images');
    if (fs.existsSync(officeImagesDir)) {
      const files = fs.readdirSync(officeImagesDir);
      const galleryImages = files
        .filter(file => file.match(/\.(jpg|jpeg|png|gif|webp)$/i))
        .map(file => {
          const title = file
            .replace(/\.[^/.]+$/, "")
            .split(/[-_ ]+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          return {
            src: `/assets/office-images/${file}`,
            title: title,
            category: "Infrastructure"
          };
        });

      // Special sorting: keep some recognizable ones at the start
      galleryImages.sort((a, b) => {
        if (a.src.includes('exterior')) return -1;
        if (b.src.includes('exterior')) return 1;
        return 0;
      });

      const galleryContent = { images: galleryImages };
      const galleryQuery = `
        INSERT INTO pages (title, slug, content, status) 
        VALUES ($1, $2, $3, 'PUBLISHED') 
        ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, title = EXCLUDED.title;
      `;
      await database.query(galleryQuery, ['Gallery', '/gallery', JSON.stringify(galleryContent)]);
      console.log(`Seeded: /gallery with ${galleryImages.length} images (Auto-scanned)`);
    }
  } catch (err) {
    console.warn('Gallery auto-seeding skipped or failed:', err.message);
  }

  console.log('Seeding completed successfully!');
  return { success: true };
}

module.exports = { seed };

if (require.main === module) {
  seed().catch(err => {
    console.error(err);
    process.exit(1);
  }).then(() => process.exit(0));
}
