const { authentication } = require("../controllers/authController")
const { getUserDetails, updateUserDetails, updateProfile } = require("../controllers/userController")
const router = require("express").Router()

// club controller
router.route("/get-user").get(authentication,getUserDetails)
router.route("/update-user").post(authentication,updateUserDetails)
router.route("/update-user-profile").post(authentication,updateProfile)

module.exports = router