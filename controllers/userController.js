const { compareSync, hashSync } = require("bcrypt");
const sequelize_db = require("../config/db_connection");
const user_details = require("../db/models/user_details");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const login_details = require("../db/models/login_details");

const getUserDetails = catchAsync(async (req, res, next) => {
    const userId = req.tokenDetail.userId;
    const query = `select ud.* , ld."userEmail"  from user_details ud 
    join login_details ld on ud.id = ld."userId" 
    where ud.id = `+ userId +`;`;
    const [results,metadata]= await sequelize_db.query(query);
    if(!results[0]){
        return next(new AppError("No Designations Found Add some",400))
    }
    res.status(200).json(results[0])
})

const updateUserDetails = catchAsync(async (req, res, next) => {
    const userId = req.tokenDetail.userId;
    const body = req.body
    if (body.userPassword != "")
    {
        if( !body.oldPassword || !body.userPassword || !body.confirmPassword){
            return next(new AppError("All fields are required",401))
        }

        if(body.userPassword != body.confirmPassword){
            return next(new AppError("Passwords don't match",401))
        }
        if(body.oldPassword == body.userPassword){
            return next(new AppError("Old and new password cannot be same",401))
        }
        const oldPassword = body.oldPassword
        const userPassword = body.userPassword
        const user = await login_details.findOne({where:{userId:userId}})
        if(!user){
            return next(new AppError("User not found",401))
        }
        if(!compareSync(oldPassword,user.userPassword)){
            return next(new AppError("Old Password doesn't match",401))
        }
        const hashedPassword = hashSync(body.userPassword, 10)
        const updated = login_details.update({
            userPassword:hashedPassword
        },{where:{userId:userId}})
        if(!updated){
            return next(new AppError("Couldn't update password",400))
        }
    }

    const updated = user_details.update({
        userMobile:body.userMobile,
        bloodGroup:body.bloodGroup,
        address:body.address,
        instaHandle:body.instaHandle,
        linkedinHandle:body.linkedinHandle,
        facebookHandle:body.facebookHandle,
    },{where:{id:userId}})
    if(!updated){
        return next(new AppError("Couldn't update user details",400))
    }
    res.status(201).json({
        message:"updated"
    })
})

const updateProfile = catchAsync(async(req,res,next)=>{
    const userID = req.tokenDetail.userId
    const body = req.body
    const updated = user_details.update({
        profilePhoto:body.profilePhoto
    },{where:{id:userID}})
    if(!updated){
        return next(new AppError("Couldn't update profile",400))
    }
    res.status(201).json({
        message:"updated"
})
})
module.exports = {getUserDetails,updateUserDetails,updateProfile}