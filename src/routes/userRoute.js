const { Router } = require("express");
const router = new Router();

const { getUsers } = require("../controllers/userController");

router.route("/").get(getUsers);

module.exports = router;
