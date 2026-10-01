const router = require("express").Router();
const { signup, login } = require("../controllers/authController");
const validators = require("../middleware/validators");

router.post("/signup", validators.signup, signup);
router.post("/login", validators.login, login);

module.exports = router;
