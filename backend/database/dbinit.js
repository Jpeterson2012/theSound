//node database/dbinit.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function dbInit() {  
  const con = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DBUSER,
    password: process.env.PASSWORD,
    database: process.env.DB,
    waitForConnections: true,
    connectionLimit: 10,
    multipleStatements: true,
  });

  try {    
    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      console.log(`Running migration: ${file}`);
      await con.query(sql);
    }

    console.log('All migrations executed successfully!');
  } catch (e) {
    console.error('Error running migrations:', e);
  } finally {
    await con.end();
  }
}

// Allow running standalone
if (require.main === module) {
  dbInit();
}

module.exports = {dbInit};