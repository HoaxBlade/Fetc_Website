const { Client } = require('pg');
const path = require('path');
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
  "psi": {
    title: "PSI - Global Testing Leader",
    description: "Prepare for your PSI examinations with our expert-led modules and comprehensive practice materials used by thousands worldwide.",
    features: [
      { highlight: "Expert Led", label: "Professional Training" },
      { highlight: "100%", label: "Real Exam Simulation" }
    ]
  },
  "idp-for-ielts": {
    title: "IDP IELTS - Academic & General",
    description: "Master the IELTS exam with our specialized training focusing on all four bands: Listening, Reading, Writing, and Speaking.",
    features: [
      { highlight: "8.0+", label: "Average Band Score" },
      { highlight: "Weekly", label: "Mock Tests" }
    ]
  },
  "toefl": {
    title: "TOEFL - English Proficiency",
    description: "Ace your TOEFL iBT with our focused training modules and exclusive access to official prep resources.",
    features: [
      { highlight: "100+", label: "Target Score Success" },
      { highlight: "24/7", label: "Adaptive Learning Hub" }
    ]
  },
  "pte": {
    title: "PTE - Pearson Test of English",
    description: "Achieve your desired PTE score with our AI-powered scoring simulations and intensive practice sessions.",
    features: [
      { highlight: "Fast", label: "Results in 48h" },
      { highlight: "95%", label: "First Attempt Pass" }
    ]
  },
  "pearson-versant": {
    title: "Pearson Versant - Language Assessment",
    description: "Measure your automated language proficiency with the world's most trusted AI-driven assessment tool.",
    features: [
      { highlight: "Instant", label: "Score Delivery" },
      { highlight: "Global", label: "Industry Standard" }
    ]
  }
};

const countries = {
  "united-kingdom": {
    name: "United Kingdom",
    image: "/assets/countries/uk.png",
    description: "Study in globally recognized UK institutions with excellent academic support, scholarships, and post-study work opportunities.",
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
