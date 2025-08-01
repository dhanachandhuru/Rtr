const router = require("express").Router();
const { getAllusers, addDesignation, getAllDesignations, deleteUser, updateUser, getAllCabinetReports, getAllClubReports, createClubReportType, createCabinetReportType, getAllGrievances, updateGrievance, createGrievance, uploadResource, getAllResource, getAllEventRequests, ApproveRequests, RejectRequests,addEvent, getAllEvents, getEventWithId, deleteEvent, clubsUnderMe, createBloodRequest, getAllBloodRequests, getBloodRequestWithMatches, deleteBloodRequest,uploadResourceMiddleware,getimage,downloadResource} = require("../controllers/adminController");
const { authentication } = require("../controllers/authController")
const { approveUser, getUnapprovedUsers } = require("../controllers/authController");
const resources = require("../db/models/resources");

// auth controller 
router.route("/get-all-users").get( authentication,getAllusers)
router.route("/add-designation").post(authentication,addDesignation)
router.route("/get-designations").get(authentication,getAllDesignations)
router.route("/delete-user").post(authentication,deleteUser)
router.route("/update-user").post(authentication,updateUser)
router.route("/get-cabinet-reports").get(authentication,getAllCabinetReports)
router.route("/get-club-reports").get(authentication,getAllClubReports)
router.route("/create-club-reports-type").post(authentication,createClubReportType)
router.route("/create-cabinet-reports-type").post(authentication,createCabinetReportType)
router.route("/get-grievances").get(authentication,getAllGrievances)
router.route("/update-grievance").post(authentication,updateGrievance)
router.route("/create-grievance").post(authentication,createGrievance)
router.route("/upload-resource").post(authentication,uploadResourceMiddleware,uploadResource)
router.route("/get-all-resources").get(authentication,getAllResource)
router.route("/get-all-event-requests").get(authentication,getAllEventRequests)
router.route("/approve-event-requests").post(authentication,ApproveRequests)
router.route("/reject-event-requests").post(authentication,RejectRequests)
router.route("/add-event").post(authentication,addEvent)
router.route("/delete-event").post(authentication,deleteEvent)
router.route("/get-all-events").get(authentication,getAllEvents)
router.route("/get-event-with-id").get(authentication,getEventWithId)
router.route("/approveUser/:userId").patch(authentication,approveUser)
router.route("/unapproved-users").get(authentication,getUnapprovedUsers)
router.route("/get-my-clubs").get(authentication,clubsUnderMe)
router.route("/add-blood-request").post(createBloodRequest)
router.route("/get-all-blood-request").get(authentication,getAllBloodRequests)
router.route("/get-all-blood-matched-docs/:id").get(authentication,getBloodRequestWithMatches)
router.route("/delete-blood-request/:id").delete(authentication,deleteBloodRequest)
router.route("/resource/:id/image").get(authentication,getimage)
router.route("/resource/:id/download").get(authentication,downloadResource)

module.exports = router