const router = require("express").Router();
const { login , signup, authentication } = require("../controllers/authController")

// auth controller 
router.route("/login").post(login)
router.route("/signup").post( authentication , signup)


module.exports = router