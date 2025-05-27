const { Op, Sequelize } = require("sequelize");
const user_details = require("../db/models/user_details");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const login_details = require("../db/models/login_details");
const { compareSync } = require("bcrypt");
const club_designations = require("../db/models/club_designations");
const user_club_designations = require("../db/models/user_club_designations");
const sequelize_db = require("../config/db_connection");
const club_details = require("../db/models/club_details");
const assets = require("../db/models/assets");
const club_reports = require("../db/models/club_reports");
const club_events = require("../db/models/club_events");

const getAllClubs = catchAsync(async (req, res, next) => {
    // select all the clubs from the table
    const response = await club_details.findAll();
    if (!response) {
        return next(new AppError("No Clubs Found", 400))
    }
    res.status(200).json(response)
})

const updateMember = catchAsync(async (req, res, next) => {
    // Update the user details
    const body = req.body
    const updates1 = login_details.update({userEmail:body.userEmail}, { where: { userId: body.userId } })
    const updates = user_details.update({
        userName: body.userName,
        riId:body.riId,
        yearsOfRotraction:body.yearsOfRotraction
    }, { where: { id: body.userId } })
    if (!updates || !updates) {
        return next(new AppError("Update failed", 401))
    }
    res.status(201).json({
        status: "success",
        message: "details updated"
    })
})

const getMemberDetails = catchAsync(async (req, res, next) => {
    // Here user id is club id
    const ClubId = req.tokenDetail.userId;
    const [result, metadata] = await sequelize_db.query(`
    select ud.*,ld."userEmail"  from user_details ud 
    join login_details ld on ld."userId" = ud.id
    where ud."clubId"  = ${ClubId}
    `)
    res.status(200).json({
        status: "success",
        data: result
    })
})

const activateUser = catchAsync(async (req,res,next)=>{
    const body = req.body
    clubId = req.tokenDetail.userId
    let isActive = body.isActive
    if(!body.userId){
        return next(new AppError("User Id required", 401))
    }
    if(isActive === undefined){
        isActive = null
    }
    // check the activation validity
    const {capacity} = await club_details.findOne({where:{id:clubId},attributes:["capacity"]})
    const totalActiveClubMembers = await user_details.count({where:{clubId:clubId,isActive:1}})
    if(totalActiveClubMembers >= capacity && isActive === 1){
        return next(new AppError("Club capacity reached", 401))
    }
    const updated = await user_details.update({
        isActive
    }, {
        where: {
            id: body.userId
        }
    })
    if(!updated){
        return next(new AppError("User updation failed", 401))
    }
    res.status(201).json({
        status: "success",
        message: "Member Status Changed"
})
})


// create designation
const CreateDesignationAndAssign = catchAsync(async (req, res, next) => {
    const body = req.body
    if (!body.designationName) {
        return next(new AppError("Designation name required", 401))
    }
    if (!body.member) {
        return next(new AppError("Select any one member required", 401))
    }
    const ClubId = req.tokenDetail.userId;
    const newDesignation = await club_designations.create({
        clubId: ClubId,
        designationName: body.designationName
    })
    if (!newDesignation) {
        return next(new AppError("Designation creation failed", 401))
    }
    const newDesignationId = newDesignation.id
    const newMember = await user_club_designations.create({
        userId: body.member,
        clubDesignationId: newDesignationId,
    })
    res.status(201).json({
        status: "success",
        message: "Designation created",
        newMembermetadata: {
            designationName: newDesignation.designationName,
            id: newDesignation.id,
            userid: newMember.userId
        }
    })
})

// delete designations
const deleteDesignation = catchAsync(async (req, res, next) => {
    const body = req.body
    if (!body.clubDesignationsId) {
        return next(new AppError("Designation Id required", 401))
    }
    const ClubId = req.tokenDetail.userId;
    const deleted = await club_designations.destroy({
        where: {
            id: body.clubDesignationsId
        }
    })
    if (!deleted) {
        return next(new AppError("Designation deletion failed", 401))
    }
    // remove the realationship
    const user_club_designations_deleted = await user_club_designations.destroy({
        where: {
            clubDesignationId: body.clubDesignationsId
        }
    })

    if (!user_club_designations_deleted) {
        return next(new AppError("Designation deletion failed", 401))
    }
    res.status(201).json({
        status: "success",
        message: "Designation deleted"
    })
})

const editDesignation = catchAsync(async (req, res, next) => {
    const body = req.body
    if (!body.designationId) {
        return next(new AppError("Designation Id required", 401))
    }
    if (!body.designationName) {
        return next(new AppError("Designation name required", 401))
    }
    const ClubId = req.tokenDetail.userId;
    const updated = await club_designations.update({
        designationName: body.designationName
    }, {
        where: {
            id: body.designationId,
        }
    })
    const user_club_designations_updated = await user_club_designations.update({
        userId: body.member
    },
        {
            where: {
                clubDesignationId: body.designationId,
            }
        }
    )
    if (!updated) {
        return next(new AppError("Designation updation failed", 401))
    }
    res.status(201).json({
        status: "success",
        message: "Designation updated"
    })
})

// get all club designations
const getAllClubDesignations = catchAsync(async (req, res, next) => {
    const ClubId = req.tokenDetail.userId;
    const query = `SELECT cd.id , cd."designationName", ud."userName"  , ud.id as userId
    FROM club_designations cd
    JOIN user_club_designations ucd ON cd.id = ucd."clubDesignationId"
    JOIN user_details ud ON ucd."userId"= ud.id
    where ud."clubId"=`+ ClubId + `;`;

    const [results, metadata] = await sequelize_db.query(query);
    if (!results) {
        return next(new AppError("No Designations Found Add some", 400))
    }
    res.status(200).json(results)
});

const getClubData = catchAsync(async (req, res, next) => {
    const ClubId = req.tokenDetail.userId;
    const query = `select CD.* , LD."userEmail" from login_details as LD 
    join club_details CD on CD."id" = LD."clubId"
    where  CD."id" = ${ClubId}`;
    const [results, metadata] = await sequelize_db.query(query);
    if (!results) {
        return next(new AppError("No Club Data found, Contact Admin", 400))
    }
    res.status(200).json(results)
})
const updateClub = catchAsync(async (req, res, next) => {
    const ClubId = req.tokenDetail.userId;
    const body = req.body
    const updated = club_details.update({
        ...body,
    }, {
        where: {
            id: ClubId,
        }
    })
    if (!updated) {
        return next(new AppError("Club updation failed", 401))
    }
    res.status(201).json({
        status: "success",
        message: "Club updated"
    })
})

const addAsset = catchAsync(async (req, res, next) => {
    const body = req.body
    const resp = await assets.create(body)
    if (!resp) {
        return next(new AppError("Failed Creating Asset", 400))
    }
    res.status(200).json({
        message: "success"
    })
})
const getAllAssets = catchAsync(async (req, res, next) => {
    const resp = await assets.findAll()
    if (!resp) {
        return next(new AppError("Failed Fetching Assets", 400))
    }
    res.status(200).json(resp)
})

const updateClubAsset = catchAsync(async (req, res, next) => {
    const clubId = req.tokenDetail.userId;
    const resp = await club_details.update(req.body, { where: { id: clubId } })
    if (!resp) {
        return next(new AppError("Couldn't update assets", 400))
    }
    res.status(201).json({
        message: "updated"
    })
})

const addReport = catchAsync(async (req, res, next) => {
    // get details from the body and verify
    const body = req.body
    const currentYear = new Date().getFullYear();
    const ClubId = req.tokenDetail.userId;
    if (!body.reportName || !body.description || body.rotractorsAttended == undefined || body.rotariansAttended == undefined || body.visitingRotractors == undefined || body.guests == undefined || body.beneficiaries == undefined || !body.reportType || !body.month || !body.avenue || !body.gDriveFolder || !body.year) {
        return next(new AppError(" All the fields are required", 401))
    }
    const newReport = await club_reports.create({
        reportName: body.reportName,
        description: body.description,
        rotractorsAttended: body.rotractorsAttended,
        rotariansAttended: body.rotariansAttended,
        visitingRotractors: body.visitingRotractors,
        guests: body.guests,
        beneficiaries: body.beneficiaries,
        reportType: body.reportType,
        month: body.month,
        avenue: body.avenue,
        year: body.year,
        clubId: ClubId,
        gDriveFolder: body.gDriveFolder
        
    })
    if (!newReport) {
        return next(new AppError("Failed to add report", 401))
    }
    res.status(201).json({
        message: "success"
    })
})

const getAllReport = catchAsync(async (req, res, next) => {
    console.log(req.tokenDetail.userId)
    const resp = await club_reports.findAll({ where: { clubId: req.tokenDetail.userId } })
    if (!resp) {
        return next(new AppError("Failed Fetching Reports", 400))
    }
    res.status(200).json(resp)
})

// add events
// note to the developer
//club event and district events are stored in club_events
const addEvent = catchAsync(async (req, res, next) => {
    const body = req.body
    const clubId = req.tokenDetail.userId
    if (!body.eventName || !body.eventDate || !body.eventDescription || !body.eventTimeFrom || !body.eventTimeTo || !body.eventType) {
        return next(new AppError("Bad Request All the fields are required", 401))
    }
    const [districtEvents, metadata] = await sequelize_db.query(`SELECT *
    FROM club_events ce
    WHERE ce."eventDate" = '${body.eventDate}'
    AND (
        (ce."eventTimeFrom"<= '${body.eventTimeFrom}' AND ce."eventTimeTo" >= '${body.eventTimeTo}') OR
        (ce."eventTimeFrom" <= '${body.eventTimeTo}' AND ce."eventTimeTo" >= '${body.eventTimeFrom}')
    )
    AND ce."eventType" = 2
    AND (ce."isApproved" = 0 or ce."isApproved" = 1)
    LIMIT 1
    ;`)

    const [districtEventsByCabinets, metadata2] = await sequelize_db.query(`SELECT *
    FROM cabinet_events ce
    WHERE ce."eventDate" = '${body.eventDate}'
    AND (
        (ce."eventTimeFrom"<= '${body.eventTimeFrom}' AND ce."eventTimeTo" >= '${body.eventTimeTo}') OR
        (ce."eventTimeFrom" <= '${body.eventTimeTo}' AND ce."eventTimeTo" >= '${body.eventTimeFrom}')
    )
    AND ce."eventType" = 2
    AND (ce."isApproved" = 0 or ce."isApproved" = 1)
    LIMIT 1
    ;`)
    const [myClubEvents, metadata1] = await sequelize_db.query(`SELECT *
    FROM club_events ce
    WHERE ce."eventDate" = '${body.eventDate}'
    AND (
        (ce."eventTimeFrom"<= '${body.eventTimeFrom}' AND ce."eventTimeTo" >= '${body.eventTimeTo}') OR
        (ce."eventTimeFrom" <= '${body.eventTimeTo}' AND ce."eventTimeTo" >= '${body.eventTimeFrom}')
    )
    AND ce."eventType" = 1
    AND ce."clubId" = ${clubId}
    LIMIT 1
    ;`)
    
    // if there are district event
    if (districtEvents.length > 0 && body.eventType == 2){
        return next(new AppError("Date is blocked for another district event", 400))
    }
    if (districtEventsByCabinets.length > 0 && body.eventType == 2){
        return next(new AppError("Date is blocked for another district event", 400))
    }

    if(myClubEvents.length > 0){
        return next(new AppError("Date is Blocked", 400))
    }

    // isApproved logic
    // 1 ==> club event
    // 2 ==> District Event 
    let isApproved
    if(body.eventType == 1) {
        isApproved = 1
    }
    else if(body.eventType == 2){
        isApproved = 0
    }
    else
    {
        return next(new AppError("Bad request Try Again",400))
    }
    const resp = await club_events.create({
        eventName: body.eventName,
        eventDate: body.eventDate,
        eventDescription: body.eventDescription,
        eventTimeFrom: body.eventTimeFrom,
        eventTimeTo: body.eventTimeTo,
        eventType: body.eventType,
        createdBy: req.tokenDetail.userId,
        clubId: req.tokenDetail.userId,
        isApproved:isApproved
    })
    if (!resp) {
        return next(new AppError("Failed Creating Event", 400))
    }
    res.status(200).json({
        message: "success",
        resp
    })
})

const deleteEvent = catchAsync(async (req, res, next) => {
    const body = req.body
    if(body.id == undefined) {
        return next(new AppError("Bad Request", 401))
    }
    if(body.table != "club"){
        return next(new AppError("Bad Request", 401))
    }
    const resp = await club_events.destroy({ where: { id: body.id , createdBy: req.tokenDetail.userId} })
    if (!resp) {
        return next(new AppError("Failed Deleting Event", 400))
    }
    res.status(200).json({
        message: "success"
    })
})

const getAllEvents = catchAsync(async (req, res, next) => {
    const clubId = req.tokenDetail.userId
    const que = `select ce.*,cd."clubName",'club' AS "table" from club_events ce 
    join club_details cd on cd."id" = ce."clubId"
    where ce."createdBy" = ${clubId} or ce."eventType" = 2`
    const [resp, metadata] = await sequelize_db.query(que)
    const que2 = `select ce.*,ud."userName",'cabinet' AS "table" from cabinet_events ce 
    join user_details ud on ud."id" = ce."userId"`
    const [resp2, metadata2] = await sequelize_db.query(que2)
    const finalData = [...resp,...resp2]
    console.log(finalData)
    if (!resp) {
        return next(new AppError("Failed Fetching Events", 400))
    }
    res.status(200).json(finalData)
})

const getEventWithId = catchAsync(async (req, res, next) => {
    const body = req.body
    if(!body.id){
        return next(new AppError("Bad request try again",400))
    }
    const que = `select ce.*,cd."clubName" as createdUserName,cd."id" as createdUserId,'club' as "table" from club_events ce
    join club_details cd on ce."createdBy" = cd.id
    where ce.id = ${body.id}
    limit 1;`
    const [resp, metadata] = await sequelize_db.query(que)
    if (!resp) {
        return next(new AppError("Failed Fetching Event", 400))
    }
    res.status(200).json(resp)
})

const getAllCabinets = catchAsync(async (req, res, next) => {
    const query = `select ud.* , ld."userEmail" , d.designation ,d.id as designationId from user_details ud
    join login_details ld on ud.id = ld."userId"
    left join designations d on ud."designation" = d."id"
    where ld."userType" = '2';`;
    const [results, metadata] = await sequelize_db.query(query);
    if (!results) {
        return next(new AppError("No Designations Found Add some", 400))
    }
    res.status(200).json(results)
})



module.exports = { getEventWithId,activateUser,getAllCabinets, getAllEvents, deleteEvent, addEvent, getAllReport, addReport, updateClubAsset, getAllAssets, addAsset, updateClub, getClubData, getAllClubs, getMemberDetails, updateMember, getAllClubDesignations, CreateDesignationAndAssign, deleteDesignation, editDesignation }
