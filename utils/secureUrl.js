const aws = require("aws-sdk")

const region = "eu-north-1"
const bucketName = "rotract3203profileimages"
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
const accessKeyId = process.env.S3_ACCESS_KEY

const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    bucketName,
    signatureVersion:"v4"
})

const getSignedUrlClubReports = async(imageNames) => {
    try {
        const signedUrls = []
        for (let i = 0; i < imageNames.length; i++) {
            const imageName =  "club/"+imageNames[i]
            const params = ({
                Bucket : bucketName,
                Key : imageName,
                Expires : 300
            })
            const signedurl = s3.getSignedUrl("getObject",params)
            signedUrls.push(signedurl)
        }
        return signedUrls
    } catch (error) {
        console.log(error)
    }
}

const getSignedUrlCabinetReports = async(imageNames) => {
    try {
        const signedUrls = []
        for (let i = 0; i < imageNames.length; i++) {
            const imageName =  "cabinet/"+imageNames[i]+".jpg"
            const params = ({
                Bucket : bucketName,
                Key : imageName,
                Expires : 300
            })
            const uploadURL = s3.getSignedUrl("getObject",params)
            signedUrls.push(uploadURL)
        }
        return signedUrls
    } catch (error) {
        console.log(error)
    }
}

const generateUploadUrl = async(imagename) => {
    // code to generate random name for image using current time and seconds
        // const timestamp = Date.now().toString(36)
        // const randomChars = Math.random().toString(36).slice(2, 5)
        // let randomString = timestamp + randomChars
    const imageName = "profile/"+imagename+".jpg"
    const params = ({
        Bucket : bucketName,
        Key : imageName,
        Expires : 60
    })

    const uploadURL = await s3.getSignedUrlPromise("putObject", params)
    return {uploadURL,imageName}
}

const generateResourceUploadUrl = async(fileName,extension) => {
    // code to generate random name for image using current time and seconds
        // const timestamp = Date.now().toString(36)
        // const randomChars = Math.random().toString(36).slice(2, 5)
        // let randomString = timestamp + randomChars
    const fileFullName = "resources/"+ fileName+ extension
    const params = ({
        Bucket : bucketName,
        Key : fileFullName,
        Expires : 60
    })

    const uploadURL = await s3.getSignedUrlPromise("putObject", params)
    return {uploadURL,fileFullName}
}

const generateClubReportUploadUrl = async () => {
    const timestamp = Date.now().toString(36);
    const randomChars = Math.random().toString(36).slice(2, 5);
    let randomString = timestamp + randomChars;
    const imageName = `club/${randomString}.jpg`;
    const params = {
        Bucket: bucketName,
        Key: imageName,
        Expires: 60
    };
    const uploadURL = await s3.getSignedUrlPromise("putObject", params);
    randomImageName = randomString+".jpg"
    return { uploadURL, imageName:randomImageName };
};

const generateCabinetReportUploadUrl = async () => {
    const timestamp = Date.now().toString(36);
    const randomChars = Math.random().toString(36).slice(2, 5);
    let randomString = timestamp + randomChars;
    const imageName = `cabinet/${randomString}.jpg`;
    const params = {
        Bucket: bucketName,
        Key: imageName,
        Expires: 60
    };
    const uploadURL = await s3.getSignedUrlPromise("putObject", params);
    randomImageName = randomString+".jpg"
    return { uploadURL, imageName:randomImageName };
};


module.exports = {generateResourceUploadUrl,generateUploadUrl,generateClubReportUploadUrl,getSignedUrlClubReports,getSignedUrlCabinetReports,generateCabinetReportUploadUrl}
