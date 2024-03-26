const { pool } = require("../config/db");

//Tekil öğrenci oluşturma
const createStudent = async (req, res) => {
  const query =
    "INSERT INTO students (name, email, dept_id, counter) VALUES ($1, $2, $3, $4)";

  const getDepartmentByIdQuery = "SELECT * FROM departments WHERE id = $1";
  try {
    const { name, email, dept_id, counter } = req.body;

    const departmentResult = await pool.query(getDepartmentByIdQuery, [
      Number(dept_id),
    ]);
    if (departmentResult.rowCount === 0) {
      res.status(404).json({
        message: `Department with id ${dept_id} not found`,
        isSuccess: false,
      });
    } else {
      const result = await pool.query(query, [
        name,
        email,
        Number(dept_id),
        Number(counter),
      ]);

      res.status(201).json({ message: "success", isSuccess: true });
    }
  } catch (err) {
    res.status(500).json({ message: err.message, isSuccess: false });
    console.log(err);
  }
};

//Tüm öğrencilerin verisini getirme
const getStudents = async (req, res) => {
  const query = "SELECT * FROM students";
  try {
    const result = await pool.query(query);
    res
      .status(200)
      .json({ data: result.rows, message: "success", isSuccess: true });
  } catch (err) {
    res.status(500).json({ message: err.message, isSuccess: false });
    console.log(err);
  }
};

//Id'ye göre tekil öğrenci verisi getirme
const getStudentById = async (req, res) => {
  const query = "SELECT * FROM students WHERE id = $1";
  try {
    const { id } = req.params;

    const result = await pool.query(query, [Number(id)]);
    if (result.rowCount === 0) {
      res.status(404).json({
        message: `Student with id ${id} not found`,
        isSuccess: false,
      });
    } else {
      res
        .status(200)
        .json({ data: result.rows[0], message: "success", isSuccess: true });
    }
  } catch (err) {
    res.status(500).json({ message: err.message, isSuccess: false });
    console.log(err);
  }
};

//Öğrenci bilgisini güncelleme
const updateStudent = async (req, res) => {
  const query =
    "UPDATE students SET name = $1, email = $2, deptid = $3, counter = $4 WHERE id = $5";
  const getStudentByIdQuery = "SELECT * FROM students WHERE id = $1";
  try {
    const { id } = req.params;
    const { name, email, dept_id, counter } = req.body;

    const getStudentByIdResult = await pool.query(getStudentByIdQuery, [
      Number(id),
    ]);
    if (getStudentByIdResult.rowCount === 0) {
      res
        .status(404)
        .json({ message: `Student with id ${id} not found`, isSuccess: false });
    } else {
      const result = await pool.query(query, [
        name,
        email,
        Number(dept_id),
        Number(counter),
        Number(id),
      ]);
      res.status(200).json({ message: "success", isSuccess: true });
    }
  } catch (err) {
    res.status(500).json({ message: err.message, isSuccess: false });
    console.log(err);
  }
};

//Öğrenci Silme
const removeStudent = async (req, res) => {
  const query = "DELETE FROM students WHERE id = $1";
  const getStudentByIdQuery = "SELECT * FROM students WHERE id = $1";
  try {
    const { id } = req.params;
    const getStudentByIdResult = await pool.query(getStudentByIdQuery, [
      Number(id),
    ]);
    if (getStudentByIdResult.rowCount === 0) {
      res
        .status(404)
        .json({ message: `Student with id ${id} not found`, isSuccess: false });
    } else {
      const result = await pool.query(query, [Number(id)]);
      res.status(200).json({
        message: `Student with id ${id} successfully removed`,
        isSuccess: true,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message, isSuccess: false });
    console.log(err);
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  removeStudent,
};
