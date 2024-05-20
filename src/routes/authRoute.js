const { Router } = require("express");
const router = new Router();

const { login, registerUser } = require("../controllers/authController");

router.route("/register").post(registerUser);
router.route("/login").post(login);

module.exports = router;
