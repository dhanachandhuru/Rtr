const router = require("express").Router()
const { authentication } = require("../controllers/authController");
const { getStatsClub, getStatsAdmin, getStatsCabinet } = require("../controllers/statsController");

// club controller
router.route("/get-club-stats").get(authentication,getStatsClub)
router.route("/get-admin-stats").get(authentication,getStatsAdmin)
router.route("/get-cabinet-stats").get(authentication,getStatsCabinet)

module.exports = router
