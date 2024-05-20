const { pool } = require("../config/db");

//Tekil öğrenci oluşturma
const createStudent = async (req, res) => {
  const query =
    "INSERT INTO students (name, email, deptid, updated_at) VALUES ($1, $2, $3, $4) RETURNING *";

  const getStudentByDepartmentIdQuery =
    "SELECT * FROM students WHERE deptid = $1";
  const getDepartmentByIdQuery = "SELECT * FROM departments WHERE id = $1";

  try {
    const { name, email, deptid } = req.body;
    const getStudentByDepartmentIdResult = await pool.query(
      getStudentByDepartmentIdQuery,
      [Number(deptid)]
    );
    const departmentResult = await pool.query(getDepartmentByIdQuery, [
      Number(deptid),
    ]);
    if (departmentResult.rowCount === 0) {
      res.status(404).json({
        message: `Department with id ${deptid} not found`,
        isSuccess: false,
      });
    } else if (getStudentByDepartmentIdResult.rowCount !== 0) {
      res.status(404).json({
        message: `Department with id ${deptid} already has a student`,
        isSuccess: false,
      });
    } else {
      const currentTime = new Date().toISOString();
      const result = await pool.query(query, [
        name,
        email,
        Number(deptid),
        currentTime,
      ]);

      const updateDepartmentQuery = `
      UPDATE departments
      SET dept_std_id = $1, updated_at = $2
      WHERE id = $3
    `;

      await pool.query(updateDepartmentQuery, [
        result?.rows[0].id,
        currentTime,
        Number(deptid),
      ]);

      res.status(201).json({
        Data: { created_at: result.rows[0].created_at },
        message: "success",
        isSuccess: true,
      });
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
    "UPDATE students SET name = $1, email = $2, deptid = $3, updated_at = $4 WHERE id = $5 RETURNING *";

  const updateNewDepartmentTableQuery = `UPDATE departments SET updated_at = $1, dept_std_id = $2 WHERE id = $3`;
  const updateOldDepartmentTableQuery = `UPDATE departments SET updated_at = $1, dept_std_id = NULL WHERE dept_std_id = $2`;
  const getStudentByIdQuery = "SELECT * FROM students WHERE id = $1";
  const getDepartmentByIdQuery = "SELECT * FROM departments WHERE id = $1";
  const isDepartmentHasStudentQuery =
    "SELECT dept_std_id FROM departments WHERE id = $1";

  try {
    const { id } = req.params;
    const { name, email, deptid } = req.body;

    const getStudentByIdResult = await pool.query(getStudentByIdQuery, [
      Number(id),
    ]);

    const getDepartmentByIdResult = await pool.query(getDepartmentByIdQuery, [
      Number(deptid),
    ]);

    const isDepartmentHasStudent = await pool.query(
      isDepartmentHasStudentQuery,
      [Number(deptid)]
    );

    if (getStudentByIdResult.rowCount === 0) {
      res
        .status(404)
        .json({ message: `Student with id ${id} not found`, isSuccess: false });
    } else if (getDepartmentByIdResult.rowCount === 0) {
      res.status(404).json({
        message: `Department with id ${deptid} not found`,
        isSuccess: false,
      });
    } else if (isDepartmentHasStudent.rows[0].dept_std_id !== null) {
      res.status(404).json({
        message: `Department with id ${deptid} already has a student`,
        isSuccess: false,
      });
    } else {
      const currentTime = new Date().toISOString();

      const result = await pool.query(query, [
        name,
        email,
        Number(deptid),
        currentTime,
        Number(id),
      ]);
      // Eski departmanda dept_std_id'yi null yap
      await pool.query(updateOldDepartmentTableQuery, [
        currentTime,
        Number(id),
      ]);

      // Yeni departmanda dept_std_id'yi güncelle
      await pool.query(updateNewDepartmentTableQuery, [
        currentTime,
        Number(id),
        Number(deptid),
      ]);
      res.status(200).json({
        updated_at: result.rows[0].updated_at,
        message: "success",
        isSuccess: true,
      });
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
  const updateDepartmentTableQuery =
    "UPDATE departments SET updated_at = $1, dept_std_id = NULL WHERE dept_std_id = $2";

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
      const currentTime = new Date().toISOString();
      await pool.query(updateDepartmentTableQuery, [currentTime, Number(id)]);
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
