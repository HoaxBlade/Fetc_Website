const { Client } = require('pg');
require('dotenv').config({ path: __dirname + '/.env' });
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
client.connect().then(async () => {
  // Update Singapore
  const resSg = await client.query("SELECT content FROM pages WHERE slug = '/study-abroad/singapore'");
  if (resSg.rows.length > 0) {
    let contentSg = resSg.rows[0].content;
    contentSg.image = "/assets/countries/Singapore.png";
    await client.query("UPDATE pages SET content = $1 WHERE slug = '/study-abroad/singapore'", [JSON.stringify(contentSg)]);
    console.log("Singapore DB updated successfully.");
  }

  // Update Canada
  const resCa = await client.query("SELECT content FROM pages WHERE slug = '/study-abroad/canada'");
  if (resCa.rows.length > 0) {
    let contentCa = resCa.rows[0].content;
    contentCa.image = "/assets/study-abroad/Canada.png";
    await client.query("UPDATE pages SET content = $1 WHERE slug = '/study-abroad/canada'", [JSON.stringify(contentCa)]);
    console.log("Canada DB updated successfully.");
  }

  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
