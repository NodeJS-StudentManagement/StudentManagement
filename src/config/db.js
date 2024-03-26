require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const createTables = async () => {
  const studentTableQuery = `CREATE TABLE IF NOT EXISTS students(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50),
    dept_id INT,
    counter INT DEFAULT 0, 
  )`;

  const departmentTableQuery = `CREATE TABLE IF NOT EXISTS departments(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    std_id INT,
  )`;
  try {
    const client = await pool.connect();
    await client.query("BEGIN");

    await client.query(studentTableQuery);
    await client.query(departmentTableQuery);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.log(err);
  } finally {
    client.release();
  }
};

module.exports = { pool, createTables };
