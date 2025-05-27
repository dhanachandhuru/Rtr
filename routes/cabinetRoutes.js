const router = require("express").Router()
const { authentication } = require("../controllers/authController");
const { addReport, getAllreports, clubsUnderMe, clubStats, updateClubCapacity, getAllClubsCapacity, getAllEvents, getEventWithId, deleteEvent, addEvent, getAllCabinets } = require("../controllers/cabinetController");


// club controller
router.route("/add-report").post(authentication,addReport)
router.route("/get-all-reports").get(authentication,getAllreports)
router.route("/get-my-clubs").get(authentication,clubsUnderMe)
router.route("/get-club-stats").get(authentication,clubStats)
router.route("/update-club-capacity").post(authentication,updateClubCapacity)
router.route("/get-club-capacity").get(authentication,getAllClubsCapacity)
router.route("/get-all-events").get(authentication,getAllEvents)
router.route("/get-event-with-id").post(authentication,getEventWithId)
router.route("/delete-event").post(authentication,deleteEvent)
router.route("/add-event").post(authentication,addEvent)
router.route("/get-all-cabinets").get(authentication,getAllCabinets)
module.exports = router
