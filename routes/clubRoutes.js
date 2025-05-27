const router = require("express").Router()
const { getAllClubs, getMemberDetails, updateMember,getAllClubDesignations , CreateDesignationAndAssign, deleteDesignation, editDesignation, getClubData, updateClub, addAsset, getAllAssets, updateClubAsset, addReport, getAllReport, addEvent, deleteEvent, getAllEvents, getAllCabinets, activateUser, getEventWithId } = require("../controllers/ClubController");
const { authentication } = require("../controllers/authController");


// club controller
router.route("/get-all-clubs").get(authentication,getAllClubs)
router.route("/get-all-members").get(authentication,getMemberDetails)
router.route("/update-member-detail").post(authentication,updateMember)
router.route("/get-all-designations").get(authentication,getAllClubDesignations)
router.route("/create-designation").post(authentication,CreateDesignationAndAssign)
router.route("/delete-designation").post(authentication,deleteDesignation)
router.route("/edit-designation").post(authentication,editDesignation)
router.route("/get-club-data").get(authentication,getClubData)
router.route("/update-club").post(authentication,updateClub)
router.route("/add-asset").post(authentication,addAsset)
router.route("/get-assets").get(authentication,getAllAssets)
router.route("/update-club-assets").post(authentication,updateClubAsset)
router.route("/add-report").post(authentication,addReport)
router.route("/get-all-reports").get(authentication,getAllReport)
router.route("/add-event").post(authentication,addEvent)
router.route("/delete-event").post(authentication,deleteEvent)
router.route("/get-all-events").get(authentication,getAllEvents)
router.route("/get-all-cabinets").get(authentication,getAllCabinets)
router.route("/activate-user").post(authentication,activateUser)
router.route("/get-event-with-id").post(authentication,getEventWithId)
module.exports = router