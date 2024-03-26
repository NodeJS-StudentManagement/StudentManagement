const { Router } = require("express");
const router = new Router();

const {
  getDepartmentById,
  getDepartments,
  removeDepartment,
  createDepartment,
  updateDepartment,
} = require("../controllers/departmentController");

router.route("/").get(getDepartments).post(createDepartment);
router
  .route("/:id")
  .get(getDepartmentById)
  .put(updateDepartment)
  .delete(removeDepartment);

module.exports = router;
