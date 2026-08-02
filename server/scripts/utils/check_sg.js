const { Client } = require('pg');
require('dotenv').config({ path: __dirname + '/.env' });
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
client.connect().then(() => {
  return client.query("SELECT content FROM pages WHERE slug = '/study-abroad/singapore'");
}).then(res => {
  console.log(JSON.stringify(res.rows[0].content, null, 2));
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
