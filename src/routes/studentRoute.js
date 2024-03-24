const { Router } = require("express");
const router = new Router();

const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  removeStudent,
} = require("../controllers/studentController");

router.route("/").get(getStudents).post(createStudent);
router
  .route("/:id")
  .get(getStudentById)
  .put(updateStudent)
  .delete(removeStudent);

module.exports = router;
