const { Router } = require("express");
const router = new Router();
const { sendStudentList } = require("../controllers/emailController");

router.route("/").get(sendStudentList);

module.exports = router;
