require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const DUMPS_DIR = path.join(__dirname, 'dumps');

async function dbDumps() {  
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
    const files = fs.readdirSync(DUMPS_DIR)
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const filePath = path.join(DUMPS_DIR, file);

      console.log(`Loading dump: ${file}`);

      const sql = fs.readFileSync(filePath, 'utf8');

      await con.query(sql);

      console.log(`Loaded: ${file}`);
    }

    console.log('All dumps loaded successfully!');
  } catch (err) {
    console.error('Error loading dumps:', err);
  } finally {
    await con.end();
  }
}

// Allow running standalone
if (require.main === module) {
  dbDumps();
}

module.exports = {dbDumps};