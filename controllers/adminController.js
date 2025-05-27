const sequelize_db = require("../config/db_connection");
const designations = require("../db/models/designations");
const user_details = require("../db/models/user_details");
const login_details = require("../db/models/login_details");
const cabinet_reports = require("../db/models/cabinet_reports");
const club_reports = require("../db/models/club_reports");
const club_report_types = require("../db/models/club_report_types");
const resources = require("../db/models/resources");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const cabinet_report_types = require("../db/models/cabinet_report_types");
const grievances = require("../db/models/grievances");
const cabinet_events = require("../db/models/cabinet_events");
const club_events = require("../db/models/club_events");

const getAllusers = catchAsync(async(req,res,next)=>{
    const query = `select ud.* , ld."userEmail" , d.designation ,d.id as designationId from user_details ud
    join login_details ld on ud.id = ld."userId"
    left join designations d on ud."designation" = d."id"
    where ld."userType" != '1';`;
    const [results,metadata]= await sequelize_db.query(query);
    if(!results){
        return next(new AppError("No Designations Found Add some",400))
    }
    res.status(200).json(results)
})


const updateUser = catchAsync(async(req,res,next) =>{
    const body = req.body
    const resp = await user_details.update({
        userName: body.userName,
        designation: body.designation,
        riId:body.riId,
        yearOfRotraction:body.yearOfRotraction
    }, {
        where: {
            id: body.userId,
        }
    })
    const resp2 = await login_details.update({
        userEmail: body.userEmail
    }, {
        where: {
            userId: body.userId,
        }
    })
    if (!resp || !resp2) {
        return next(new AppError("User updation failed", 401))
    }
    res.status(201).json({
        status: "success",
        message: "User updated"
    })
}
)

const deleteUser = catchAsync(async(req,res,next)=>{
    const body = req.body
    const resp = await user_details.destroy({where:{id:body.userId}})
    const resp2 = await login_details.destroy({where:{userId:body.userId}})
    if (!resp || !resp2) {
        return next(new AppError("User deletion failed", 401))
    }
    res.status(201).json({
        status: "success",
        message: "User deleted"
    })
})

const addDesignation = catchAsync(async(req,res,next)=>{
    const body = req.body
    const resp = await designations.create(body)
    if (!resp) {
        return next(new AppError("Failed Creating Designation", 400))
    }
    res.status(200).json({
        message: "success"
    })
})

const getAllDesignations = catchAsync(async(req,res,next)=>{
    const resp = await designations.findAll()
    if (!resp) {
        return next(new AppError("Failed Fetching Designations", 400))
    }
    res.status(200).json(resp)
})

const getAllCabinetReports = catchAsync(async(req,res,next)=>{
    let que = `select Concat('dro04car',cr.id) as id,cr."reportName",cr."venue",cr."description",CONCAT(
        CASE cr."month"
            WHEN 1 THEN 'January'
            WHEN 2 THEN 'February'
            WHEN 3 THEN 'March'
            WHEN 4 THEN 'April'
            WHEN 5 THEN 'May'
            WHEN 6 THEN 'June'
            WHEN 7 THEN 'July'
            WHEN 8 THEN 'August'
            WHEN 9 THEN 'September'
            WHEN 10 THEN 'October'
            WHEN 11 THEN 'November'
            WHEN 12 THEN 'December'
        END
    ) as month,cr."year",cr."createdAt",cd."userName",crt."reportType",cd."id" as userId
    ,cr."rotractorsAttended",cr."rotariansAttended",cr."beneficiaries",cr."visitingRotractors",cr."guests",cr."hoursSpend",cr."gDriveFolder"
    from cabinet_reports cr
    join user_details cd on cr."userId" = cd."id"
    join cabinet_report_types crt on cr."reportType" = crt.id`
    que += ` ORDER BY cr."createdAt" DESC;`
    const [resp,metadata] = await sequelize_db.query(que)
    if (!resp) {
        return next(new AppError("Failed Fetching Reports", 400))
    }
    res.status(200).json(resp)
})

const getAllClubReports = catchAsync(async(req,res,next)=>{
    const cabinetDesignation = req.tokenDetail.cabinetDesignation
    let que = `select Concat('dro04clr',cr.id) as id,cr."reportName",cr."description",cr."rotractorsAttended",cr."rotariansAttended",a."avenue",cr."createdAt",cr."year",cr."gDriveFolder",cr."visitingRotractors",cr."guests",cr."beneficiaries",CONCAT(
        CASE cr."month"
            WHEN '1' THEN 'January'
            WHEN '2' THEN 'February'
            WHEN '3' THEN 'March'
            WHEN '4' THEN 'April'
            WHEN '5' THEN 'May'
            WHEN '6' THEN 'June'
            WHEN '7' THEN 'July'
            WHEN '8' THEN 'August'
            WHEN '9' THEN 'September'
            WHEN '10' THEN 'October'
            WHEN '11' THEN 'November'
            WHEN '12' THEN 'December'
        END
    ) as month,cd."clubName",crt."reportType" from club_reports cr
    join club_details cd on cr."clubId" = cd.id
    join avenues a on cr.avenue = a.id
    join club_report_types crt on cr."reportType" = crt.id `
    if(cabinetDesignation == 5) // district priority chair
    {
        que += `where cr.avenue = 6 or cr.avenue = 7 ` // have only access to the  district priorities and rotary priorities
    }
    if(cabinetDesignation == 11) // club service director
    {
        que += `where cr.avenue = 1 ` // have only access to club service
    }
    if(cabinetDesignation == 8) // international service director
    {
        que += `where cr.avenue = 4 `// have only access to international Service
    }
    if(cabinetDesignation == 9) // community service director
    {
        que += `where cr.avenue = 3 ` // have only access to community service
    }
    if(cabinetDesignation == 3) // professional service director  
    {
        que += `where cr.avenue = 2 ` // have only access to professional service
    }
    que +=` ORDER BY cr."createdAt" DESC;`
    const [resp,metadata] = await sequelize_db.query(que)
    if (!resp) {
        return next(new AppError("Failed Fetching Reports", 400))
    }
    res.status(200).json(resp) 
})

const createClubReportType = catchAsync(async(req,res,next)=>{
    const body = req.body
    const resp = await club_report_types.create(body)
    if (!resp) {
        return next(new AppError("Failed Creating Report", 400))
    }
    res.status(200).json({
        message: "success"
    })
})

const createCabinetReportType = catchAsync(async(req,res,next)=>{
    const que = `select cr.*,ud."userName",crt."reportType" from cabinet_reports cr
    join user_details ud on cr."userId" = ud.id
    join cabinet_report_types crt on cr."reportType" = crt.id
    ORDER BY cr."createdAt" DESC;`
    const [resp,metadata] = await sequelize_db.query(que)
    if (!resp) {
        return next(new AppError("Failed Creating Report", 400))
    }
    res.status(200).json({
        message: "success"
    })
})

const getAllGrievances = catchAsync(async(req,res,next)=>{
    const userId = req.tokenDetail.userId
    let que = `select gr.*,ud."userName",cd."clubName" from grievances gr
    join user_details ud on gr."createdBy" = ud."id"
    join club_details cd on ud."clubId" = cd."id"`
    if(req.tokenDetail.userType != 1){
        que += ` where ud."id" = ${userId};`
    }
    else
    {
    	que += ` where gr."isViewed" != 1;`
    }
    const [resp,metadata] = await sequelize_db.query(que)
    if (!resp) {
        return next(new AppError("Failed Creating Report", 400))
    }
    res.status(200).json({
        message: "success",
        grievances:resp
    })
})

const createGrievance = catchAsync(async(req,res,next)=>{
    const body = req.body
    if( !body || !body.name || !body.description){
        return next(new AppError("Please provide name and description", 400))
    }
    const resp = await grievances.create({
        name:body.name,
        description:body.description,
        file:"",
        isViewed:0,
        response:"",
        createdBy:req.tokenDetail.userId
    })
    if (!resp) {
        return next(new AppError("Failed Creating Report", 400))
    }
    res.status(200).json({  response:body.response,
        message: "success",
    })
})

const updateGrievance = catchAsync(async(req,res,next)=>{
    const body = req.body
    const resp = await grievances.update({
        response:body.response,
        isViewed:1
    }, {
        where: {
            id: body.id
        }
    })
    if (!resp) {
        return next(new AppError("Grievance updation failed", 401))
    }
    res.status(201).json({
        status: "success",
        message: "Grievance updated"
    })
})

const getAllResource = catchAsync(async(req,res,next)=>{
    const resp = await resources.findAll()
    if (!resp) {
        return next(new AppError("Failed Fetching Reports", 400))
    }
    res.status(200).json(resp)
})

const uploadResource = catchAsync(async(req,res,next)=>{
    const body = req.body
    const userType = req.tokenDetail.userType
    if(userType != 1){
        return next(new AppError("Only Admins can upload resources", 401))
    }
    if(!body.name || !body.description || !body.filelink){
        return next(new AppError("Please provide name, description and filelink", 400))
    }
    const resp = await resources.create({
        name:body.name,
        description:body.description,
        filelink:body.filelink,
        uploadedBy:req.tokenDetail.userId
    })
    if (!resp) {
        return next(new AppError("Failed Creating Report", 400))
    }
    res.status(200).json({
        message: "success"
    })
})

const getAllEventRequests = catchAsync(async(req,res,next)=>{
    const [clubEvents,meta] = await sequelize_db.query(`
    select ce.*,cae."clubName" as creatorName,'club' as "table" from club_events ce
    join club_details cae on ce."clubId" = cae."id"
    where ce."isApproved" = 0
    `)
    const [cabinetEvents,meta1] = await sequelize_db.query(`
    select ce.*,ud."userName" as creatorName,'cabinet' as "table" from cabinet_events ce
    join user_details ud on ce."userId" = ud."id"
    where ce."isApproved" = 0
    `)
    const finalData = [...clubEvents,...cabinetEvents]
    res.status(200).json(finalData)
})

const ApproveRequests = catchAsync(async(req,res,next)=>{
    const body = req.body
    let resp
    const userType = req.tokenDetail.userType
    if(!(body.table == "club" || body.table == "cabinet")){
        return next(new AppError("Bad Request", 401))
    }
    if(userType != 1){
        return next(new AppError("Only Admins can approve requests", 401))
    }
    if(body.table == "club"){
        resp = await club_events.update({
            isApproved:1
        }, {
            where: {
                id: body.id
            }
        })
    }
    else
    {
        resp = await cabinet_events.update({
            isApproved:1
        }, {
            where: {
                id: body.id
            }
        })
    }
    if (!resp) {
        return next(new AppError("Request updation failed", 401))
    }
    res.status(201).json({
        status: "success",
        message: "Request updated"
    })
})

const RejectRequests = catchAsync(async(req,res,next)=>{
    const body = req.body
    let resp
    const userType = req.tokenDetail.userType
    if(!(body.table == "club" || body.table == "cabinet")){
        return next(new AppError("Bad Request", 401))
    }
    if(userType != 1){
        return next(new AppError("Only Admins can reject requests", 401))
    }
    if(body.table == "club"){
        resp = await club_events.update({
            isApproved:2
        }, {
            where: {
                id: body.id
            }
        })
    }
    else
    {
        resp = await cabinet_events.update({
            isApproved:2
        }, {
            where: {
                id: body.id
            }
        })
    }
    if (!resp) {
        return next(new AppError("Request updation failed", 401))
    }
    res.status(201).json({
        status: "success",
        message: "Request updated"
    })
})

module.exports = {RejectRequests,ApproveRequests,getAllEventRequests,getAllResource,uploadResource,createGrievance,updateGrievance,getAllGrievances,createCabinetReportType,createClubReportType,getAllClubReports,getAllCabinetReports,updateUser,deleteUser,getAllusers,addDesignation,getAllDesignations}
