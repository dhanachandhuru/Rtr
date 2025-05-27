const { authentication } = require("../controllers/authController")
const { getUrl, getClubReportImageUrl, getCabinetReportImageUrl, getClubSignedurl, getCabinetSignedurl, getResourceUploadUrl, } = require("../controllers/UploadController")
const router = require("express").Router()

// club controller
router.route("/get-url").get(authentication,getUrl)
router.route("/club-report-url-get").get(authentication,getClubReportImageUrl)
router.route("/cabinet-report-url-get").get(authentication,getCabinetReportImageUrl)
router.route("/get-signedurls-club").post(authentication,getClubSignedurl)
router.route("/get-signedurls-cabinet").post(authentication,getCabinetSignedurl)
router.route("/get-resource-upload-url").get(authentication,getResourceUploadUrl)
module.exports = router