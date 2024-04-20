const { pool } = require("../config/db");

/*Bu fonksiyon, ilk olarak students tablosundaki öğrenci sayısını sorgular. 
Eğer öğrenci sayısı 0'dan büyükse, student_counter tablosundaki counter değerini var olan öğrenci sayısıyla günceller. 
Eğer öğrenci sayısı 0 ise, student_counter tablosuna counter değerini 0 olarak günceller. 
Son olarak student_counter tablosundaki counter değerini döndürür.
*/
const getStudentCounter = async (req, res) => {
  const studentCounterQuery = "SELECT counter FROM student_counter"; // student_counter tablosundaki counter değerini döndürür
  const studentRowCountQuery = "SELECT COUNT(id) FROM students"; // students tablosundaki öğrenci sayısını döndürür
  const updateStudentCounterQuery = "UPDATE student_counter SET counter = $1"; // student_counter tablosundaki counter değerini günceller
  try {
    const studentRowCount = await pool.query(studentRowCountQuery);
    console.log(studentRowCount.rows[0].count);
    if (studentRowCount.rows[0].count > 0) {
      const updateStudentCounter = await pool.query(updateStudentCounterQuery, [
        studentRowCount.rows[0].count,
      ]);
    } else {
      const insertCounterQuery =
        "INSERT INTO student_counter (counter) VALUES ($1)";
      await pool.query(insertCounterQuery, [0]);
      console.log("Counter 0 olarak güncellendi");
    }

    const result = await pool.query(studentCounterQuery);

    res.status(200).json({
      counter: result.rows[0].counter,
      message: "success",
      isSuccess: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message, isSuccess: false });
  }
};

module.exports = { getStudentCounter };
