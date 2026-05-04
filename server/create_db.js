const { Client } = require("pg");
require("dotenv").config();

async function createDatabase() {
  // Extract connection details but connect to the default 'postgres' database
  const connectionString = process.env.DATABASE_URL;
  const dbName = connectionString.split("/").pop();
  const baseConnectionString = connectionString.replace(`/${dbName}`, "/postgres");

  const client = new Client({
    connectionString: baseConnectionString,
  });

  try {
    await client.connect();
    
    // Check if database exists
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    
    if (res.rowCount === 0) {
      console.log(`Database "${dbName}" does not exist. Creating...`);
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database "${dbName}" created successfully.`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
  } catch (err) {
    console.error("Error creating database:", err);
  } finally {
    await client.end();
  }
}

createDatabase();
