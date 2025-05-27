const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const cabinet_reports = require("../db/models/cabinet_reports");
const club_details = require("../db/models/club_details");
const sequelize_db = require("../config/db_connection");
const cabinet_events = require("../db/models/cabinet_events")
const addReport = catchAsync(
    async(req,res,next)=>{
        const body = req.body
        if(!body){
          return  next(new AppError("bad request try again",401))
        }
        if(!body.reportName || !body.gDriveFolder || !body.description || !body.reportType || !body.month || !body.venue || (body.rotractorsAttended < 0) || (body.rotariansAttended < 0) || (body.beneficiaries < 0) || (body.visitingRotractors < 0) || !body.guests || body.hoursSpend < 0){
          return  next(new AppError("bad request try again",401))
        }
        const newReport = await cabinet_reports.create({
            year:body.year,
            reportName:body.reportName,
            description:body.description,
            rotractorsAttended:body.rotractorsAttended,
            rotariansAttended:body.rotariansAttended,
            visitingRotractors:body.visitingRotractors,
            guests:body.guests,
            hoursSpend:body.hoursSpend,
            beneficiaries:body.beneficiaries,
            reportType:body.reportType,
            month:body.month,
            gDriveFolder: body.gDriveFolder,
            venue:body.venue,
            userId:req.tokenDetail.userId
        })
        if(!newReport){
            next(new AppError("failed to add report",401))
        }
        res.status(201).json({
            message:"success"
        })
    }
)

const getAllreports = catchAsync(async(req,res,next)=>{
    const resp = await cabinet_reports.findAll({where:{userId:req.tokenDetail.userId}})
    if(!resp){
        return next(new AppError("Failed Fetching Reports",400))
    }
    res.status(200).json(resp)
})

const clubsUnderMe = catchAsync(async(req,res,next)=>{
    const userId = String(req.tokenDetail.userId)
    const resp = await club_details.findAll({where:{cabinetMentor:userId},attributes:['id','clubName']})
    if(!resp){
        return next(new AppError("Failed Fetching Reports",400))
    }
    res.status(200).json(resp)
})

const clubStats = catchAsync(async(req,res,next)=>{
    if(req.query["clubId"] === undefined){
        return next(new AppError("Club Id required", 400))
    }
    const clubId = req.query["clubId"]
    const [result1, metadata] = await sequelize_db.query(`SELECT COUNT(*) as totalMembers
        FROM user_details ud 
        WHERE ud."clubId" = ${clubId}`
        )
        const totalMembers = result1[0]["totalmembers"]
        const [result2, metadata1] = await sequelize_db.query(`
        SELECT COUNT(*) as activeMembers
        FROM user_details ud 
        WHERE ud."clubId" = ${clubId} AND
        ud."isActive" = 1
        `)
        const activeMembers = result2[0]["activemembers"]
        const inactiveMembers = Number(totalMembers) - Number(activeMembers)
        const [result3, metadata2] = await sequelize_db.query(`
        SELECT COUNT(*) as totalProjects
        FROM club_reports cr
        WHERE cr."clubId" = ${clubId}
        `)
        const totalProjects = result3[0]["totalprojects"]

        const [result4, meta] = await sequelize_db.query(`SELECT
        cr."avenue",
        cr."year",
        cr."month",
        COUNT(*) AS report_count
        FROM
            public.club_reports cr
        WHERE
            TO_DATE(cr."year" || '-' || cr."month" || '-01', 'YYYY-MM-DD') >= (CURRENT_DATE - INTERVAL '6 months') and cr."clubId" = ${clubId}
        GROUP BY
            cr.avenue , cr."year", cr."month"
        ORDER BY
            cr."year" DESC, cr."month" DESC, cr."avenue";`)
        
        res.status(200).json({
            totalMembers,
            activeMembers,
            inactiveMembers,
            totalProjects,
            graphData:result4
        })
})

const updateClubCapacity = catchAsync(async(req,res,next)=>{
    const cabinetDesignation = req.tokenDetail.cabinetDesignation
    if(cabinetDesignation != 18){
        return next(new AppError("User Not Authorized",400))
    }
    const body = req.body
    if(!body.clubId || !body.capacity){
        return next(new AppError("All fields are required",400))
    }
    const resp = await club_details.update(
        {
            capacity:body.capacity
        }
        ,{where:{id:body.clubId}})
        if(!resp){
            next(new AppError("failed to add report",401))
        }
        res.status(201).json({
            message:"success"
        })
})

const getAllClubsCapacity = catchAsync(async(req,res,next)=>{
    const resp = await club_details.findAll({attributes:["capacity","clubName","id","clubLogo"],order:[["id","ASC"]]})
    if(!resp){
        return next(new AppError("Failed Fetching Reports",400))
    }
    res.status(200).json(resp)
})

const getAllEvents = catchAsync(async (req, res, next) => {
    const userId = req.tokenDetail.userId
    const que = `select ce.*,cd."clubName",'club' AS "table" from club_events ce 
    join club_details cd on cd."id" = ce."clubId"
    where ce."eventType" = 2`
    const [resp, metadata] = await sequelize_db.query(que)
    const que2 = `select ce.*,ud."userName",'cabinet' AS "table" from cabinet_events ce 
    join user_details ud on ud."id" = ce."userId"`
    const [resp2, metadata2] = await sequelize_db.query(que2)
    const finalData = [...resp,...resp2]
    // if (!resp) {
    //     return next(new AppError("Failed Fetching Events", 400))
    // }
    res.status(200).json(finalData)
})

const getEventWithId = catchAsync(async (req, res, next) => {
    const body = req.body
    if(!body.id){
        return next(new AppError("Bad request try again",400))
    }
    const que = `select ce.*,cd."userName" as createdUserName,cd."id" as createdUserId,'cabinet' as "table" from cabinet_events ce
    join user_details cd on ce."userId" = cd.id
    where ce.id = ${body.id}
    limit 1;`
    const [resp, metadata] = await sequelize_db.query(que)
    if (!resp) {
        return next(new AppError("Failed Fetching Event", 400))
    }
    res.status(200).json(resp)
})

// add events
const addEvent = catchAsync(async (req, res, next) => {
    const body = req.body
    const userId = req.tokenDetail.userId
    if (!body.eventName || !body.eventDate || !body.eventDescription || !body.eventTimeFrom || !body.eventTimeTo) {
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
    
    // if there are district event
    if (districtEvents.length > 0 && body.eventType == 2){
        return next(new AppError("Date is blocked for another district event", 400))
    }
    if (districtEventsByCabinets.length > 0 && body.eventType == 2){
        return next(new AppError("Date is blocked for another district event", 400))
    }
    const resp = await cabinet_events.create({
        eventName: body.eventName,
        eventDate: body.eventDate,
        eventDescription: body.eventDescription,
        eventTimeFrom: body.eventTimeFrom,
        eventTimeTo: body.eventTimeTo,
        eventType: 2, // all the district events needs approval
        userId: userId,
        isApproved:0
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
    if(body.table != "cabinet"){
        return next(new AppError("Bad Request", 401))
    }
    const resp = await cabinet_events.destroy({ where: { id: body.id , userId: req.tokenDetail.userId} })
    if (!resp) {
        return next(new AppError("Failed Deleting Event", 400))
    }
    res.status(200).json({
        message: "success"
    })
})

const getAllCabinets = catchAsync(async (req, res, next) => {
    const [resp, metadata] = await sequelize_db.query(`
    Select ud.id,ud."userName" from user_details ud
    join login_details ld on ld."userId" = ud.id
    where ld."userType" = '2' and ld."clubId" is NULL
    `)
    if (!resp) {
        return next(new AppError("Failed Fetching Events", 400))
    }
    res.status(200).json(resp)
})


module.exports = {getAllCabinets,deleteEvent,addEvent,getAllEvents,getEventWithId,getAllClubsCapacity,updateClubCapacity,clubStats,addReport , getAllreports, clubsUnderMe}
