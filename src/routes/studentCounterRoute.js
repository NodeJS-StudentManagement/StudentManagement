const { Router } = require("express");
const router = new Router();
const {
  getStudentCounter,
} = require("../controllers/studentCounterController");

router.route("/").get(getStudentCounter);

module.exports = router;
