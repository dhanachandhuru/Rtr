// auth controllers
const club_details = require("../db/models/club_details")
const login_details = require("../db/models/login_details")
const bcrypt = require("bcrypt") 
const jwt = require("jsonwebtoken")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const user_details = require("../db/models/user_details")


const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.EXPIRES_IN
    })
}

// login
const login = catchAsync(async (req, res, next) => {
    const { userEmail, userPassword } = req.body

    if (!userEmail || !userPassword) {
        next(new AppError("Email and password required", 400))
    }
    const dataValues = await login_details.findOne({ where: { userEmail } })
    if (!dataValues) {
        next(new AppError("Email not registered", 400))
    }
    else {
        const result = dataValues.dataValues
        const isPasswordMatch = await bcrypt.compare(userPassword, result.userPassword)
        if (!isPasswordMatch) {
            next(new AppError("Password is incorrect", 400))
        }
        else {
            // fetch the user data from the table
            // if club  profile. get the club id 
            let userData
            if (result.userType == 3) {
                userData = await club_details.findOne({ where: { id: result.clubId, } })
            }
            // else get the user id
            else {
                userData = await user_details.findOne({ where: { id: result.userId, } })
            }
            if (!userData) {
                next(new AppError("User data not found", 401))
            }
            const token = generateToken({
                userId: userData.id,
                userType: result.userType,
                cabinetDesignation: userData.designation != undefined ? userData.designation : null
            })
            userData.userEmail = result.userEmail
            res.status(200).json({
                status: "success",
                token: token,
            })
        }
    }

})

// create user 
const signup = catchAsync(async (req, res, next) => {
    const body = req.body
    // console.log(!body)
    // console.log(!((body.userType == 1) || (body.userType == 2) || (body.userType == 3) || (body.userType == 4)) )
    // necessary validations
    if (
        // if body is not present
        !body ||
        // user type should be any of the 4 types (1,2,3,4)
        !((body.userType == 1) || (body.userType == 2) || (body.userType == 3) || (body.userType == 4)) ||
        // password should be 8 chars long
        body.userPassword.length < 8
    ) {

        return next(new AppError("Bad request Try again", 400))
    }
    email = body.userEmail
    // check if the email is already registered
    const result = await login_details.findOne({where:{ userEmail:email }})
    if(result){
        return next(new AppError("Email already registered",401))
    }
    
    // create new club if it is a club account (type 3)
    if (body.userType == 3) {
        const new_club = await club_details.create({
            clubName: body.clubName,
            charterId: body.charterId,
            charterDate: body.charterDate,
            groupId: body.groupId,
            clubLogo: body.clubLogo,
            presidentId: body.presidentId,
            clubType: body.clubType,
            secretaryId: body.secretaryId,
            installationDate: body.installationDate,
            parentRotaryName: body.parentRotaryName,
            staffCoordinator: body.staffCoordinator,
            staffCoordinatorNumber: body.staffCoordinatorNumber,
            cabinetMentor: body.cabinetMentor,
            assets: body.assets,
            facebookHandle: body.facebookHandle,
            instagramHandle: body.instagramHandle,
            linkedinHandle: body.linkedinHandle,
            clubCapacity:0
        })
        if (new_club) {
            // encrypt the password
            const hashedPassword = bcrypt.hashSync(body.userPassword, 10)

            // create a login data in login_details table
            const newlogin_detail = await login_details.create({
                userType: body.userType,
                userEmail: body.userEmail,
                userPassword: hashedPassword,
                clubId: new_club.id,
            })
            // send error if no login created
            if (!newlogin_detail) {
                return next(new AppError("Account creation failed", 400))
            }
            else {
                // new user data will not have email of the user
                new_club.email = newlogin_detail.userEmail
                return res.status(201).json({
                    status: "success",
                    data: new_club,
                })
            }
        }
        else {
            return next(new AppError("Account Creation failed", 400))
        }

    }
    // create a new user detail if it is a user account
    else {
        const new_user = await user_details.create({
            userName: body.userName,
            riId: body.riId,
            isBoardMember: body.isBoardMember,
            designation: body.designation,
            clubId: body.clubId,
            userMobile: body.userMobile,
            bloodGroup: body.bloodGroup,
            yearOfRotraction: body.yearOfRotraction,
            address: body.address,
            profilePhoto: body.profilePhoto,
            instaHandle: body.instaHandle,
            linkedinHandle: body.linkedinHandle,
            facebookHandle: body.facebookHandle,
        })
        // encrypt the password
        const hashedPassword = bcrypt.hashSync(body.userPassword, 10)

        // create only if the userdetails are inserted
        if (new_user) {
            // create a login data in login_details table
            const newlogin_detail = await login_details.create({
                userType: body.userType,
                userEmail: body.userEmail,
                userPassword: hashedPassword,
                userId: new_user.id,
            })
            // send error if no login created
            if (!newlogin_detail) {
                return next(new AppError("Account Creation failed", 400))
            }
            else {
                // new user data will not have email of the user
                new_user.email = newlogin_detail.userEmail
                return res.status(201).json({
                    status: "success",
                    data: new_user
                })
            }
        }
        else {
            return next(new AppError("Account Creation failed", 400))
        }

    }
})

const authentication = catchAsync(async (req, res, next) => {
    let idToken = "";
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        idToken = req.headers.authorization.split(" ")[1];
    }
    if (!idToken) {
        return next(new AppError('Please login to get access', 400))
    }
    const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET)
    let freshUser
    if(tokenDetail.userType == "3"){
        freshUser = await club_details.findByPk(tokenDetail.userId);
    }
    else
    {
        freshUser = await user_details.findByPk(tokenDetail.userId);
    }

if (!freshUser) {
    return next(new AppError("User No longer exists", 400))
}
req.user = freshUser
req.tokenDetail = tokenDetail
return next()
})

module.exports = { login, signup, authentication }