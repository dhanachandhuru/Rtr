const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const { generateUploadUrl, generateClubReportUploadUrl, getSignedUrlClubReports, getSignedUrlCabinetReports, generateCabinetReportUploadUrl, generateResourceUploadUrl } = require("../utils/secureUrl")

const getUrl = catchAsync(
    async (req, res, next) => {
        const imagename = req.tokenDetail.userId + "_" + req.tokenDetail.userType
        const { uploadURL, imageName } = await generateUploadUrl(imagename)
        if (!uploadURL || !imageName) {
            next(new AppError("Something went wrong", 400))
        }
        res.status(200).json({
            status: "success",
            uploadURL,
            imageName
        })
    }
)

const getClubReportImageUrl = catchAsync(
    async (req, res, next) => {
        const { uploadURL, imageName } = await generateClubReportUploadUrl()
        if (!uploadURL || !imageName) {
            next(new AppError("Something went wrong", 400))
        }
        res.status(200).json({
            status: "success",
            uploadURL,
            imageName
        })
    }
)

const getCabinetReportImageUrl = catchAsync(
    async (req, res, next) => {
        const { uploadURL, imageName } = await generateCabinetReportUploadUrl()
        if (!uploadURL || !imageName) {
            next(new AppError("Something went wrong", 400))
        }
        res.status(200).json({
            status: "success",
            uploadURL,
            imageName
        })
    }
)

const getCabinetSignedurl = catchAsync(
    async (req, res, next) => {
        const signedUrls = await getSignedUrlCabinetReports(req.body.imageNames)
        if (!signedUrls) {
            next(new AppError("Something went wrong", 400))
        }
        res.status(200).json({
            status: "success",
            signedUrls
        })
    }
)

const getClubSignedurl = catchAsync(
    async (req, res, next) => {
        const signedUrls = await getSignedUrlClubReports(req.body.imageNames)
        if (!signedUrls) {
            next(new AppError("Something went wrong", 400))
        }
        res.status(200).json({
            status: "success",
            signedUrls
        })
    }
)

const getResourceUploadUrl = catchAsync(
    async (req, res, next) => {
        console.log(req)
        if(req.query["extension"] === undefined){
            return next(new AppError("Extension required", 400))
        }
        if(req.query["extension"][0] != "."){
            return next(new AppError("Extension should start with .", 400))
        }
        const timestamp = Date.now().toString(36);
        const randomChars = Math.random().toString(36).slice(2, 5);
        let randomString = timestamp + randomChars;
        const extension = req.query["extension"]
        const { uploadURL, fileFullName } = await generateResourceUploadUrl(randomString,extension)
        if (!uploadURL || !fileFullName) {
            next(new AppError("Something went wrong", 400))
        }
        res.status(200).json({
            status: "success",
            uploadURL,
            fileFullName
        })
})

module.exports = { getResourceUploadUrl,getUrl, getClubReportImageUrl , getCabinetReportImageUrl ,getCabinetSignedurl, getClubSignedurl}