const router = require("express").Router();
const { getAllusers, addDesignation, getAllDesignations, deleteUser, updateUser, getAllCabinetReports, getAllClubReports, createClubReportType, createCabinetReportType, getAllGrievances, updateGrievance, createGrievance, uploadResource, getAllResource, getAllEventRequests, ApproveRequests, RejectRequests} = require("../controllers/adminController");
const { authentication } = require("../controllers/authController")

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
router.route("/upload-resource").post(authentication,uploadResource)
router.route("/get-all-resources").get(authentication,getAllResource)
router.route("/get-all-event-requests").get(authentication,getAllEventRequests)
router.route("/approve-event-requests").post(authentication,ApproveRequests)
router.route("/reject-event-requests").post(authentication,RejectRequests)
module.exports = router