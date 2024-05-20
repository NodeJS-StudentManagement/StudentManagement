const { pool } = require("../config/db");

/*Bu fonksiyon, ilk olarak students tablosundaki öğrenci sayısını sorgular. 
Eğer öğrenci sayısı 0'dan büyükse, student_counter tablosundaki counter değerini var olan öğrenci sayısıyla günceller. 
Eğer öğrenci sayısı 0 ise, student_counter tablosuna counter değerini 0 olarak günceller. 
Son olarak student_counter tablosundaki verileri döndürür.
*/
const getStudentCounter = async (req, res) => {
  const studentCounterQuery = "SELECT * FROM student_counter"; // student_counter tablosundaki counter değerini döndürür
  const studentRowCountQuery = "SELECT COUNT(id) FROM students"; // students tablosundaki öğrenci sayısını döndürür
  const updateStudentCounterQuery = "UPDATE student_counter SET counter = $1"; // student_counter tablosundaki counter değerini günceller
  try {
    const studentRowCount = await pool.query(studentRowCountQuery);
    if (studentRowCount.rows[0].count > 0) {
      //const currentTime = new Date().toISOString();
      const updateStudentCounter = await pool.query(updateStudentCounterQuery, [
        studentRowCount.rows[0].count,
      ]);
    } else {
      const currentTime = new Date().toISOString();
      const insertCounterQuery =
        "INSERT INTO student_counter (counter, updated_at) VALUES ($1, $2)";
      await pool.query(insertCounterQuery, [0, currentTime]);
      console.log("Counter 0 olarak güncellendi");
    }

    const result = await pool.query(studentCounterQuery);

    res.status(200).json({
      Data: {
        counter: result.rows[0].counter,
        created_at: result.rows[0].created_at,
        updated_at: result.rows[0].updated_at,
      },
      message: "success",
      isSuccess: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message, isSuccess: false });
  }
};

module.exports = { getStudentCounter };
