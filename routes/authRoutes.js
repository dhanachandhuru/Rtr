const router = require("express").Router();
const { login , signup, authentication } = require("../controllers/authController")

// auth controller 
router.route("/login").post(login)
router.route("/signup").post(signup)


module.exports = router