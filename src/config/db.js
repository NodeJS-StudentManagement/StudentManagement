require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const createTables = async () => {
  const studentTableQuery = `CREATE TABLE IF NOT EXISTS students(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50),
    deptid INT REFERENCES departments(id) ON DELETE SET NULL ON UPDATE CASCADE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`;

  const departmentTableQuery = `CREATE TABLE IF NOT EXISTS departments(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    dept_std_id INT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`;

  const studentCounterTableQuery = `CREATE TABLE IF NOT EXISTS student_counter(
    counter INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`;

  const insertCounterQuery =
    "INSERT INTO student_counter (counter) VALUES ($1)";

  const studentCounterQuery = "SELECT counter FROM student_counter";

  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    var timezoneResult = await client.query("SHOW timezone");
    console.log(timezoneResult.rows[0]);
    if (timezoneResult.rows[0].TimeZone !== "Europe/Istanbul") {
      await client.query("SET timezone = 'Europe/Istanbul'");
    }
    await client.query(departmentTableQuery);
    await client.query(studentTableQuery);
    await client.query(studentCounterTableQuery);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.log(err);
  } finally {
    if (client) client.release();
  }
  // Eğer student_counter tablosunda counter değeri ilk tablo oluşturulduğunda bulunmuyorsa, 0 olarak ekliyoruz
  var result = await pool.query(studentCounterQuery);
  if (result.rowCount === 0) {
    await pool.query(insertCounterQuery, [0]);
  }
};

module.exports = { pool, createTables };
