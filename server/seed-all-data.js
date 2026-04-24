const { Client } = require('pg');

const client = new Client({
  user: 'ayushranjan',
  host: 'localhost',
  database: 'fetc_db',
  password: '',
  port: 5432,
});

// Data extracted from siteData.js and allUniversitiesData.js
const countries = {
  "united-kingdom": {
    name: "United Kingdom",
    image: "/assets/countries/uk.png",
    description: "Study in globally recognized UK institutions with excellent academic support, scholarships, and post-study work opportunities.",
    universities: [
      { name: "UWS UK", link: "https://www.uws.ac.uk/", exclusive: true },
      { name: "Bangor University", link: "http://www.bangor.ac.uk/", exclusive: false },
      { name: "Buckinghamshire New University", link: "https://www.bucks.ac.uk/", exclusive: false },
      { name: "Canterbury Christ Church University", link: "http://www.canterbury.ac.uk/", exclusive: false },
      { name: "De Montfort university", link: "http://www.dmu.ac.uk/", exclusive: false },
      { name: "European School of Economics", link: "http://www.eselondon.ac.uk/", exclusive: false },
      { name: "Leeds Beckett University", link: "https://www.leedsbeckett.ac.uk/", exclusive: false },
      { name: "London Metropolitan University", link: "http://www.londonmet.ac.uk/", exclusive: false },
      { name: "LSBU", link: "https://www.lsbu.ac.uk/", exclusive: false },
      { name: "Middlesex University London", link: "https://www.mdx.ac.uk/", exclusive: false },
      { name: "Northumbria University", link: "https://www.northumbria.ac.uk/", exclusive: false },
      { name: "Ravensbourne University", link: "https://www.ravensbourne.ac.uk/", exclusive: false },
      { name: "Teesside University", link: "http://www.tees.ac.uk/", exclusive: false },
      { name: "Ulster University", link: "https://www.ulster.ac.uk/", exclusive: false },
      { name: "University College Birmingham", link: "http://www.ucb.ac.uk/", exclusive: false },
      { name: "University of Brighton", link: "http://www.bton.ac.uk/", exclusive: false },
      { name: "University of Chester", link: "http://www.chester.ac.uk/", exclusive: false },
      { name: "University of Cumbria", link: "https://www.cumbria.ac.uk/", exclusive: false },
      { name: "University of East London", link: "http://www.uel.ac.uk/", exclusive: false },
      { name: "University of Greenwich", link: "http://www.gre.ac.uk/", exclusive: false },
      { name: "University of Portsmouth", link: "http://www.port.ac.uk/", exclusive: false },
      { name: "University of Wales Trinity Saint David (UWTSD)", link: "https://www.uwtsd.ac.uk/", exclusive: false },
      { name: "University of West London", link: "http://www.uwl.ac.uk/", exclusive: false },
      { name: "QA Universities", link: "https://highereducation.qa.com/", exclusive: true }
    ],
  },
  "usa": {
    name: "USA",
    image: "/assets/countries/usa.png",
    description: "Access world-class universities, cutting-edge research opportunities, and diverse campus experiences in the United States.",
    universities: [
      { name: "LIM College", link: "https://www.limcollege.edu/", exclusive: true },
      { name: "Texas A&M San Antonio", link: "https://www.tamusa.edu/", exclusive: true },
      { name: "Adelphi University", link: "http://www.adelphi.edu/", exclusive: false },
      { name: "American Collegiate", link: "https://www.american.edu/", exclusive: false },
      { name: "American University", link: "http://www.aubih.ba/", exclusive: false },
      { name: "Auburn University at Montgomery", link: "http://www.aum.edu/", exclusive: false },
      { name: "Auburn University", link: "http://www.auburn.edu/", exclusive: false },
      { name: "Avila University", link: "https://www.avila.edu/", exclusive: true },
      { name: "California State University Monterey Bay", link: "https://csumb.edu/", exclusive: false },
      { name: "Concordia University", link: "http://cinema.concordia.ca/", exclusive: false },
      { name: "DePaul University", link: "http://www.depaul.edu/", exclusive: false },
      { name: "Florida International University", link: "http://www.fiu.edu/", exclusive: false },
      { name: "Foothill Deanza", link: "https://www.fhda.edu/", exclusive: false },
      { name: "Full Sail University", link: "http://www.fullsail.edu/", exclusive: false },
      { name: "Hawai Pacific University", link: "https://www.hpu.edu/", exclusive: false },
      { name: "Long Island University Brooklyn", link: "https://liu.edu/brooklyn", exclusive: false },
      { name: "Louisiana State University", link: "http://www.lsu.edu/", exclusive: false },
      { name: "Rowan University", link: "http://www.rowan.edu/", exclusive: false },
      { name: "Texas A&M University-Corpus Christi", link: "https://www.tamucc.edu/", exclusive: false },
      { name: "Tiffin University", link: "http://www.tiffin.edu/", exclusive: false },
      { name: "University of Alabama at Birmingham", link: "http://www.uab.edu/", exclusive: false },
      { name: "University of Central Florida", link: "http://www.ucf.edu/", exclusive: false },
      { name: "University of Dayton", link: "http://www.udayton.edu/", exclusive: false },
      { name: "University of Hartford", link: "http://www.hartford.edu/", exclusive: false },
      { name: "University of Kansas", link: "http://www.ku.edu", exclusive: false },
      { name: "University of Massachusetts Boston", link: "https://www.umb.edu/", exclusive: false },
      { name: "University of Mississippi", link: "http://www.olemiss.edu/", exclusive: false },
      { name: "University of South Carolina", link: "http://www.sc.edu/", exclusive: false },
      { name: "University of the Pacific", link: "http://www.uop.edu/", exclusive: false },
      { name: "University of Utah", link: "http://www.utah.edu/", exclusive: false }
    ],
  },
  "canada": {
    name: "Canada",
    image: "/assets/study-abroad/Canada.png",
    description: "Explore world-class academic institutions, diverse culture, and vast post-study opportunities in Canada.",
    universities: [
      { name: "Algoma University", link: "https://algomau.ca/", exclusive: false },
      { name: "College Avalon", link: "https://collegeavalon.com/", exclusive: false },
      { name: "Cypress College", link: "https://www.cypresscollege.edu/", exclusive: false },
      { name: "International Business University", link: "https://ibu.ca/", exclusive: false },
      { name: "Laurentian University", link: "https://laurentian.ca/", exclusive: false },
      { name: "PLC", link: "https://plvan.com/", exclusive: false },
      { name: "Red Deer Polytechnic", link: "https://rdpolytech.ca/", exclusive: false },
      { name: "Western Community College", link: "https://westerncommunitycollege.ca/", exclusive: false },
      { name: "York College of Applied Science", link: "https://yorkcas.ca/", exclusive: false },
      { name: "Yorkville University", link: "https://www.yorkvilleu.ca/", exclusive: false }
    ],
  },
  "australia": {
    name: "Australia",
    image: "/assets/countries/australia.png",
    description: "Choose from top-ranked Australian universities known for practical learning, innovation, and student-friendly cities.",
    universities: [
      { name: "Bond University", link: "http://www.bond.edu.au/", exclusive: false },
      { name: "Charles Darwin University", link: "http://www.cdu.edu.au/", exclusive: false },
      { name: "Deakin University", link: "http://www.deakin.edu.au/", exclusive: false },
      { name: "Federation University Australia", link: "http://federation.edu.au/", exclusive: false },
      { name: "Flinders University", link: "http://www.flinders.edu.au/", exclusive: false },
      { name: "Griffith University", link: "https://www.griffith.edu.au/", exclusive: false },
      { name: "La Trobe University", link: "http://www.latrobe.edu.au/", exclusive: false },
      { name: "RMIT", link: "http://www.rmit.edu.au/", exclusive: false },
      { name: "Swinburne University of Technology", link: "http://www.swin.edu.au/", exclusive: false },
      { name: "The University of Newcastle Australia", link: "https://www.newcastle.edu.au/", exclusive: false },
      { name: "University of Canberra", link: "http://www.canberra.edu.au/", exclusive: false },
      { name: "University of Melbourne", link: "http://www.unimelb.edu.au/", exclusive: false },
      { name: "University of New South Wales", link: "http://www.unsw.edu.au/", exclusive: false },
      { name: "University of Queensland", link: "http://www.uq.edu.au/", exclusive: false },
      { name: "University of South Australia", link: "http://www.unisa.edu.au/", exclusive: false },
      { name: "University of Southern Queensland", link: "http://www.usq.edu.au/", exclusive: false },
      { name: "University of Technology Sydney", link: "http://www.uts.edu.au/", exclusive: false },
      { name: "University of Wollongong", link: "http://www.uow.edu.au/", exclusive: false },
      { name: "Victoria University", link: "http://www.vu.edu.au/", exclusive: false },
      { name: "Western Sydney University", link: "https://www.westernsydney.edu.au/", exclusive: false }
    ],
  },
  "europe": {
    name: "Europe",
    image: "/assets/countries/europe.png",
    description: "Explore affordable and high-quality education options across Europe with multicultural learning environments and career pathways.",
    universities: [
      { name: "Aix Marseille Universite", link: "https://www.univ-amu.fr/", exclusive: false },
      { name: "Berlin School of Business and Innovation", link: "https://www.berlinsbi.com/", exclusive: false },
      { name: "Burgundy School of Business", link: "https://www.bsb-education.com/", exclusive: false },
      { name: "College De Paris", link: "https://www.collegedeparis.fr/", exclusive: false },
      { name: "De Vinci University", link: "https://www.devinci.fr/", exclusive: false },
      { name: "EADA Business School", link: "https://www.eada.edu/", exclusive: false },
      { name: "EU Business School", link: "https://www.euruni.edu/", exclusive: false },
      { name: "GISMA University of Applied Sciences", link: "https://www.gisma.com/", exclusive: false },
      { name: "IBAT College Dublin", link: "https://www.ibat.ie/", exclusive: false },
      { name: "ICN Business School", link: "https://www.icn-artem.com/", exclusive: false },
      { name: "ILA", link: "https://www.ilamilan.com/", exclusive: true },
      { name: "Maynooth university", link: "https://www.maynoothuniversity.ie/", exclusive: false },
      { name: "National College of Ireland", link: "https://www.ncirl.ie/", exclusive: false },
      { name: "Schiller International University", link: "https://schiller.edu/", exclusive: false },
      { name: "Trinity College Dublin", link: "https://www.tcd.ie/", exclusive: false },
      { name: "TU Dublin", link: "https://www.tudublin.ie/", exclusive: false },
      { name: "University of Europe for Applied Sciences", link: "https://www.ue-germany.com/", exclusive: false },
      { name: "University of Ireland Galway", link: "https://www.universityofgalway.ie/", exclusive: false },
      { name: "University of Lyon", link: "https://www.universite-lyon.fr/", exclusive: false }
    ],
  },
  "dubai": {
    name: "Dubai",
    image: "/assets/countries/dubai.png",
    description: "Access international quality education in a vibrant, multicultural global business hub with excellent career prospects.",
    universities: [
      { name: "De Montfort University (DMU)", link: "https://www.dmu.ac.uk/dubai/", exclusive: false },
      { name: "GBS", link: "https://gbs.ac.ae/", exclusive: false },
      { name: "Middlesex University", link: "https://www.mdx.ac.ae/", exclusive: false },
      { name: "RIT", link: "https://www.rit.edu/dubai/", exclusive: false }
    ],
  },
  "new-zealand": {
    name: "New Zealand",
    image: "/assets/countries/new-zealand.png",
    description: "Experience high-quality education and a stunning natural environment in New Zealand, known for its innovation and welcoming culture.",
    universities: [
      { name: "University of Auckland", link: "https://www.auckland.ac.nz/", exclusive: false }
    ],
  },
  "ireland": {
    name: "Ireland",
    image: "/assets/countries/ireland.png",
    description: "Study in Ireland, a hub for technology and innovation with world-class academic institutions and a rich cultural heritage.",
    universities: [
      { name: "Griffith College", link: "https://www.griffith.ie/", exclusive: true },
      { name: "Trinity College Dublin", link: "https://www.tcd.ie/", exclusive: false },
      { name: "National College of Ireland", link: "https://www.ncirl.ie/", exclusive: false }
    ],
  },
  "singapore": {
    name: "Singapore",
    image: "/assets/countries/dubai.png",
    description: "Learn in a world-leading global hub for education, research, and innovation with safe and beautiful city life.",
    universities: [
      { name: "LSBF Singapore", link: "https://www.lsbf.edu.sg/", exclusive: true }
    ],
  }
};

async function seed() {
  await client.connect();
  console.log('Connected to database');

  for (const [slug, content] of Object.entries(countries)) {
    const fullSlug = `/study-abroad/${slug}`;
    const query = `
      INSERT INTO pages (title, slug, content, status) 
      VALUES ($1, $2, $3, 'PUBLISHED') 
      ON CONFLICT (slug) DO UPDATE SET content = EXCLUDED.content, title = EXCLUDED.title;
    `;
    await client.query(query, [content.name, fullSlug, JSON.stringify(content)]);
    console.log(`Seeded: ${fullSlug}`);
  }

  await client.end();
  console.log('Seeding completed!');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
