const { pool } = require("../config/db");

// Tekil departman oluşturma
const createDepartment = async (req, res) => {
  const query = "INSERT INTO departments (name) VALUES ($1)";
  try {
    const { name } = req.body;
    const result = await pool.query(query, [name]);
    res.status(201).json({ message: "success", isSuccess: true });
  } catch (err) {
    res.status(500).json({ message: err.message, isSuccess: false });
    console.log(err);
  }
};

//Tüm departmanları getirme
const getDepartments = async (req, res) => {
  const query = "SELECT * FROM departments";
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

// Tekil Departman Getirme
const getDepartmentById = async (req, res) => {
  const query = "SELECT * FROM departments WHERE id = $1";
  try {
    const { id } = req.params;
    const result = await pool.query(query, [id]);
    if (result.rowCount === 0) {
      res.status(404).json({
        message: `Department with id ${id} not found`,
        isSuccess: true,
      });
    } else {
      res
        .status(200)
        .json({ data: result.rows, message: "success", isSuccess: true });
    }
  } catch (err) {
    res.status(500).json({ message: err.message, isSuccess: false });
    console.log(err);
  }
};

// Tekil departman silme
const removeDepartment = async (req, res) => {
  const getDepartmentByIdQuery = "SELECT * FROM departments WHERE id = $1";
  const query = "DELETE FROM departments WHERE id = $1";
  try {
    const { id } = req.params;
    const getDepartmentByIdResult = await pool.query(getDepartmentByIdQuery, [
      Number(id),
    ]);
    if (getDepartmentByIdResult.rowCount === 0) {
      res.status(404).json({
        message: `Department with id ${id} not found`,
        isSuccess: false,
      });
    } else {
      const result = await pool.query(query, [Number(id)]);
      res.status(200).json({
        message: `Department with id ${id} successfully removed`,
        isSuccess: true,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message, isSuccess: false });
    console.log(err);
  }
};

const updateDepartment = async (req, res) => {
  const query = "UPDATE departments SET name = $1 WHERE id = $2";
  const getDepartmentByIdQuery = "SELECT * FROM departments WHERE id = $1";
  try {
    const { id } = req.params;
    const { name } = req.body;

    const getDepartmentByIdResult = await pool.query(getDepartmentByIdQuery, [
      Number(id),
    ]);
    if (getDepartmentByIdResult.rowCount === 0) {
      res.status(404).json({
        message: `Department with id ${id} not found`,
        isSuccess: false,
      });
    } else {
      const result = await pool.query(query, [name, Number(id)]);
      res.status(200).json({
        message: "success",
        isSuccess: true,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message, isSuccess: false });
    console.log(err);
  }
};

module.exports = {
  getDepartmentById,
  getDepartments,
  removeDepartment,
  createDepartment,
  updateDepartment,
};
