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
  'selt': { 
    name: 'SELT', 
    description: 'Essential English proficiency tests for UK visa and immigration applications, including IELTS for UKVI and PTE Academic UKVI.', 
    fullDescription: 'The Secure English Language Test (SELT) is a highly specialized English proficiency examination officially mandated by UK Visas and Immigration (UKVI). It serves as a foundational requirement for individuals intending to study, work, or establish permanent residency in the United Kingdom. Meticulously designed to evaluate practical language capabilities, the SELT ensures candidates possess the essential communication skills required to thrive in an English-speaking environment.\n\nExam Format & Structural Overview\nThe SELT is strategically tiered across multiple proficiency levels—A1, A2, B1, and B2—tailored to specific visa classifications. These tiers range from foundational linguistic competence (A1, A2) to advanced operational proficiency (B1, B2). The comprehensive assessment encompasses four core modules: Listening, Reading, Writing, and Speaking. Delivered exclusively through a secure computer-based platform, test results are expedited and transmitted directly to the relevant immigration authorities.\n\nWho Should Take the SELT?\nThe SELT is an obligatory prerequisite for applicants seeking specific UK visas, encompassing skilled worker routes, academic study programs, and family settlement pathways. Candidates are required to attain a strictly defined qualifying score corresponding to their visa category. Securing the appropriate SELT certification is a non-negotiable and critical milestone in your UK immigration journey.\n\nGlobal Recognition & Investment\nExclusively tailored for UK immigration protocols, the SELT acts as your primary gateway to the United Kingdom. The examination requires an investment of INR 15,900/-. This is a foundational investment toward unlocking transformative academic and professional opportunities in the UK.', 
    metadata: [
      {label:'Cost', value:'INR 15,900/-'}, 
      {label:'Frequency', value:'Weekly / On-demand'}, 
      {label:'Duration', value:'15m - 3h'}, 
      {label:'Validity', value:'2 Years'}
    ], 
    features: [
      {highlight:'UKVI', label:'Approved'}, 
      {highlight:'Fast', label:'Booking'},
      {highlight:'Global', label:'Recognition'},
      {highlight:'Expert', label:'Guidance'}
    ] 
  },
  'gre-gmat': { 
    name: 'GRE & GMAT', 
    description: 'Advanced standardized tests for graduate school and business school admissions worldwide, measuring verbal, quantitative, and analytical skills.', 
    fullDescription: 'The Graduate Record Examination (GRE) and the Graduate Management Admission Test (GMAT) stand as the premier global benchmarks for admission into elite graduate and business schools. While the GRE offers broad utility across a vast spectrum of master\'s and doctoral disciplines, the GMAT is highly specialized and rigorously tailored for top-tier business school admissions. Both assessments rigorously evaluate your cognitive readiness and analytical prowess for advanced academic and professional endeavors.\n\nExam Format & Structural Overview\nThe GRE is systematically divided into three core domains: Verbal Reasoning, Quantitative Reasoning, and Analytical Writing, engineered to test complex problem-solving and critical thinking under pressure.\nConversely, the GMAT features four rigorous sections: the Analytical Writing Assessment, Integrated Reasoning, Quantitative Reasoning, and Verbal Reasoning, heavily emphasizing executive-level management competencies.\nBoth examinations employ sophisticated, computer-adaptive algorithms where the difficulty of subsequent questions dynamically scales based on your real-time performance.\n\nWho Should Take the GRE/GMAT?\nThe GRE is an indispensable credential for candidates pursuing advanced degrees—from the humanities to STEM fields—across global institutions. The GMAT is the gold standard for prospective MBA candidates and those targeting elite finance and management programs. Achieving a competitive score on either test is often the defining factor in securing admission to competitive, world-renowned academic institutions.\n\nGlobal Recognition & Investment\nRecognized universally, the GRE and GMAT are pivotal for admission to premier universities across the USA, Canada, the UK, Europe, and Australia. The examination fee ranges between INR 22,000/- to 25,000/-. These examinations represent a strategic and high-yield investment in your long-term career trajectory, unlocking access to prestigious alumni networks and global opportunities.', 
    metadata: [
      {label:'Cost', value:'INR 22,000/- to 25,000/-'}, 
      {label:'Frequency', value:'Flexible'}, 
      {label:'Duration', value:'2h - 2.5h'}, 
      {label:'Validity', value:'5 Years'}
    ], 
    features: [
      {highlight:'Global', label:'Admissions'}, 
      {highlight:'High', label:'Target Scores'},
      {highlight:'Advanced', label:'Analytics'},
      {highlight:'Full', label:'Support'}
    ] 
  },
  'sat': { 
    name: 'SAT', 
    description: 'A standardized test widely used for college admissions in the USA and other countries, assessing readiness for undergraduate education.', 
    fullDescription: 'The Scholastic Assessment Test (SAT) is the universally recognized cornerstone of the undergraduate college admissions process, primarily utilized by institutions across the United States. Designed to accurately gauge a student\'s academic readiness for rigorous university coursework, the SAT provides admissions committees with a standardized metric to evaluate a highly diverse global applicant pool. Exceptional performance on this exam is often a deciding factor for scholarships and acceptances into top-tier universities.\n\nExam Format & Structural Overview\nThe SAT is meticulously divided into two primary disciplines: Evidence-Based Reading & Writing, and Mathematics. The assessment focuses heavily on real-world problem-solving, data analysis, and reading comprehension. Now fully transitioned to a digital, computer-adaptive format in many regions, the exam offers a streamlined and secure testing experience that measures the precise skills required for collegiate academic success.\n\nWho Should Take the SAT?\nThe SAT is highly recommended—and often mandatory—for high school students aspiring to enroll in prestigious undergraduate degree programs in the USA and select global universities. It serves as a critical benchmark for colleges to assess your intellectual aptitude, ensuring you are adequately prepared for the academic demands of higher education.\n\nGlobal Recognition & Investment\nWhile the SAT is fundamentally deeply rooted in the US higher education system, its scores are highly respected and accepted by leading universities in Canada, the UK, Australia, and Europe. The exam requires an investment of INR 12,300/-. This is a foundational investment that paves the way toward your international undergraduate aspirations.', 
    metadata: [
      {label:'Cost', value:'INR 12,300/-'}, 
      {label:'Frequency', value:'7 Times / Year'}, 
      {label:'Duration', value:'3 Hours'}, 
      {label:'Validity', value:'5 Years'}
    ], 
    features: [
      {highlight:'USA', label:'Undergraduate'}, 
      {highlight:'1500+', label:'Target Score'},
      {highlight:'Math/Eng', label:'Focus'},
      {highlight:'Expert', label:'Training'}
    ] 
  },
  'idp-for-ielts': { 
    name: 'IELTS', 
    description: 'Comprehensive IELTS coaching by experienced mentors with speaking practice, writing correction, and mock tests.', 
    fullDescription: 'The International English Language Testing System (IELTS) is the world’s most proven and widely respected English language proficiency examination. Functioning as a global passport for international mobility, it is universally trusted by elite educational institutions, multinational employers, and strict immigration authorities. The IELTS provides a comprehensive and highly accurate assessment of your practical ability to communicate across all fundamental linguistic domains.\n\nExam Format & Structural Overview\nThe examination is rigorously structured into four distinct modules: Listening, Reading, Writing, and Speaking. Depending on your specific objectives, you may opt for the Academic module (for higher education) or the General Training module (for migration and work). The test is offered in both traditional paper-based and modern computer-delivered formats, ensuring maximum accessibility and candidate comfort.\n\nWho Should Take the IELTS?\nThe IELTS is an indispensable requirement for ambitious individuals aiming to study, work, or establish residency in major English-speaking territories. It serves as a mandatory benchmark for university admissions, professional licensing boards, and global visa processing. Securing a high Band Score is a vital prerequisite for unlocking a world of international opportunities.\n\nGlobal Recognition & Investment\nCommanding unparalleled global acceptance, the IELTS is the preferred English proficiency standard in the UK, USA, Australia, Canada, and New Zealand. The examination requires an investment of INR 18,000/-. Achieving a competitive IELTS score is a transformative step toward realizing your global educational and professional ambitions.', 
    metadata: [
      {label:'Cost', value:'INR 18,000/-'}, 
      {label:'Frequency', value:'Weekly'}, 
      {label:'Duration', value:'2 Hrs 45 Mins'}, 
      {label:'Validity', value:'2 Years'}
    ], 
    features: [
      {highlight:'550+', label:'Comprehensive Assessment'}, 
      {highlight:'100%', label:'Success Rate'},
      {highlight:'8.0+', label:'Average Band Score'},
      {highlight:'Weekly', label:'Mock Tests'}
    ] 
  },
  'toefl': { 
    name: 'TOEFL', 
    description: 'Target your TOEFL score through skill-based training sessions for reading, listening, writing, and speaking.', 
    fullDescription: 'The Test of English as a Foreign Language (TOEFL) is an internationally acclaimed benchmark for measuring academic English proficiency. It is overwhelmingly favored by prestigious universities and institutions across North America and beyond. The TOEFL iBT specifically evaluates how well non-native speakers can combine their listening, reading, speaking, and writing skills to perform complex academic tasks in a university environment.\n\nExam Format & Structural Overview\nThe TOEFL is systematically divided into four rigorous sections: Reading, Listening, Speaking, and Writing. Designed specifically to simulate authentic university-level communication, the tasks often require candidates to integrate multiple skills simultaneously—such as reading a passage, listening to a lecture, and then speaking or writing a response. The examination is conducted entirely on a secure, computer-based platform.\n\nWho Should Take the TOEFL?\nThe TOEFL is primarily tailored for international students applying for undergraduate, graduate, or doctoral programs at elite English-speaking institutions. Beyond academia, it is also highly sought after by medical and licensing agencies for professional certification, as well as for specialized visa applications requiring robust proof of advanced English fluency.\n\nGlobal Recognition & Investment\nWhile the TOEFL is the undisputed leader for academic admissions in the USA and Canada, it is also widely accepted in Australia, New Zealand, and across Europe. The examination requires an investment of INR 18,000/-. An exceptional TOEFL score acts as a powerful catalyst, distinguishing your academic profile in highly competitive global applicant pools.', 
    metadata: [
      {label:'Cost', value:'INR 18,000/-'}, 
      {label:'Frequency', value:'60+ times/year'}, 
      {label:'Duration', value:'1 Hr 56 Mins'}, 
      {label:'Validity', value:'2 Years'}
    ], 
    features: [
      {highlight:'100%', label:'Rapid Results'}, 
      {highlight:'500+', label:'Elite Mentors'},
      {highlight:'550%', label:'Efficiency and Quality'}, 
      {highlight:'300%', label:'Objective Scoring'}
    ] 
  },
  'pte': { 
    name: 'PTE', 
    description: 'Prepare for PTE with AI-driven patterns, timed practice, and structured guidance to improve your score quickly.', 
    fullDescription: 'The Pearson Test of English Academic (PTE-A) is a cutting-edge, fully computerized English language proficiency examination. Renowned for its rapid turnaround times and AI-driven, objective scoring algorithms, the PTE-A delivers a highly accurate and entirely unbiased assessment. It has rapidly become a preferred choice for global students and professionals aiming for seamless international mobility.\n\nExam Format & Structural Overview\nThe PTE-A is uniquely structured into three integrated modules: Speaking & Writing (combined), Reading, and Listening. Unlike traditional exams, the PTE heavily utilizes integrated questioning, testing two skills simultaneously (e.g., listening and reading) to accurately mimic real-life academic scenarios. Administered exclusively via a highly secure digital interface, candidates often receive their verified results within a mere 48 hours.\n\nWho Should Take the PTE-A?\nPTE-A is an excellent and highly efficient option for individuals urgently requiring proof of English proficiency for university admissions, professional registrations, or skilled migration pathways. Its rapid result delivery makes it particularly advantageous for candidates facing strict, fast-approaching application deadlines.\n\nGlobal Recognition & Investment\nPTE-A scores are universally trusted by governments and leading academic institutions across the UK, Australia, New Zealand, Canada, and increasingly in the USA. The registration cost is INR 18,900/-. By leveraging advanced AI technology, the PTE-A provides a streamlined, stress-free testing experience that accelerates your journey abroad.', 
    metadata: [
      {label:'Cost', value:'INR 18,900/-'}, 
      {label:'Frequency', value:'Almost Daily'}, 
      {label:'Duration', value:'2 Hours'}, 
      {label:'Validity', value:'2 Years'}
    ], 
    features: [
      {highlight:'AI-Driven', label:'Pattern Mastery'}, 
      {highlight:'Instant', label:'Scoring'},
      {highlight:'550%', label:'Efficiency and Quality'}, 
      {highlight:'300%', label:'Objective Scoring'}
    ] 
  },
  'pearson-versant': { 
    name: 'Pearson Versant Test', 
    description: 'Fast and accurate assessment of English proficiency across all key areas.', 
    fullDescription: 'At FETC, we offer the Pearson Versant Test, an advanced, AI-driven examination that provides a remarkably swift and highly accurate assessment of your overall English proficiency.', 
    metadata: [
      {label:'Cost', value:'Approx. INR 4,000'}, 
      {label:'Frequency', value:'On-demand'}, 
      {label:'Duration', value:'15-50 Mins'}, 
      {label:'Validity', value:'Inst. Dependant'}
    ], 
    features: [
      {highlight:'Real-time', label:'Feedback'}, 
      {highlight:'Global', label:'Recognition'},
      {highlight:'AI-Driven', label:'Scoring'},
      {highlight:'Fast', label:'Results'}
    ] 
  },
  'psi': { 
    name: 'PSI', 
    description: 'Get expert support for PSI exam preparation with test strategy, practice modules, and performance feedback.', 
    fullDescription: 'At FETC, we offer elite, expert coaching for the PSI exam, delivering a comprehensive and meticulously structured pathway to mastering your English language proficiency. Our specialized preparation courses cover all vital areas—from advanced test strategies to rigorous practice modules and deeply detailed performance feedback.', 
    metadata: [
      {label:'Cost', value:'Approx. INR 17,000'}, 
      {label:'Frequency', value:'Flexible'}, 
      {label:'Duration', value:'Up to 2 Hours'}, 
      {label:'Validity', value:'2 Years'}
    ], 
    features: [
      {highlight:'550+', label:'Assessments'}, 
      {highlight:'100%', label:'Rapid Results'},
      {highlight:'Expert', label:'Coaching'},
      {highlight:'Targeted', label:'Strategy'}
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
    await database.query(query, [content.name || content.title, fullSlug, JSON.stringify(content)]);
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
