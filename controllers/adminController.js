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
const admin_events= require("../db/models/admin_events");
const club_details = require("../db/models/club_details");
const blood_request = require("../db/models/blood_request");
const { Parser } = require("json2csv");

const getAllusers = catchAsync(async (req, res, next) => {
  const query = `
    SELECT 
      ud.*, 
      ld."userEmail", 
      d.designation, 
      d.id AS "designationId"
    FROM user_details ud
    JOIN login_details ld ON ud.id = ld."userId"
    LEFT JOIN designations d 
  ON (
    CASE 
      WHEN ud."designation" ~ '^[0-9]+$' THEN ud."designation"::integer
      ELSE NULL
    END
  ) = d."id"

    WHERE ld."userType" != '1';
  `;

  const [results, metadata] = await sequelize_db.query(query);

  if (!results || results.length === 0) {
    return next(new AppError("No users found", 400));
  }

  res.status(200).json(results);
});


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

const getAllClubReports = catchAsync(async (req, res, next) => {
    console.log("Token Detail:", req.tokenDetail);

let resp;

    // Admin — get all club reports
    resp = await club_reports.findAll();

if (!resp || resp.length === 0) {
    return next(new AppError("No reports found", 404));
}

res.status(200).json(resp);

});


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

const addEvent = catchAsync(async (req, res, next) => {
    const body = req.body
    const clubId = req.tokenDetail.userId

    if (!body.eventName || !body.eventDate || !body.eventDescription || !body.eventTimeFrom || !body.eventTimeTo || !body.eventType) {
        return next(new AppError("Bad Request: All fields are required", 401))
    }

    // Check district events (club)
    const [districtEvents, metadata] = await sequelize_db.query(`
        SELECT * FROM club_events ce
        WHERE ce."eventDate" = '${body.eventDate}'
        AND (
            (ce."eventTimeFrom" <= '${body.eventTimeFrom}' AND ce."eventTimeTo" >= '${body.eventTimeTo}')
            OR
            (ce."eventTimeFrom" <= '${body.eventTimeTo}' AND ce."eventTimeTo" >= '${body.eventTimeFrom}')
        )
        AND ce."eventType" = 2
        AND (ce."isApproved" = 0 OR ce."isApproved" = 1)
        LIMIT 1;
    `)

    // Check district events (cabinet)
    const [districtEventsByCabinets, metadata2] = await sequelize_db.query(`
        SELECT * FROM cabinet_events ce
        WHERE ce."eventDate" = '${body.eventDate}'
        AND (
            (ce."eventTimeFrom" <= '${body.eventTimeFrom}' AND ce."eventTimeTo" >= '${body.eventTimeTo}')
            OR
            (ce."eventTimeFrom" <= '${body.eventTimeTo}' AND ce."eventTimeTo" >= '${body.eventTimeFrom}')
        )
        AND ce."eventType" = 2
        AND (ce."isApproved" = 0 OR ce."isApproved" = 1)
        LIMIT 1;
    `)

    // Check district events (admin)
    const [adminEvents, metadata3] = await sequelize_db.query(`
        SELECT * FROM admin_events ae
        WHERE ae."eventDate" = '${body.eventDate}'
        AND (
            (ae."eventTimeFrom" <= '${body.eventTimeFrom}' AND ae."eventTimeTo" >= '${body.eventTimeTo}')
            OR
            (ae."eventTimeFrom" <= '${body.eventTimeTo}' AND ae."eventTimeTo" >= '${body.eventTimeFrom}')
        )
        AND ae."eventType" = 1
        AND (ae."isApproved" = 0 OR ae."isApproved" = 1)
        LIMIT 1;
    `)

    // Check club event conflicts
    const [myClubEvents, metadata1] = await sequelize_db.query(`
        SELECT * FROM club_events ce
        WHERE ce."eventDate" = '${body.eventDate}'
        AND (
            (ce."eventTimeFrom" <= '${body.eventTimeFrom}' AND ce."eventTimeTo" >= '${body.eventTimeTo}')
            OR
            (ce."eventTimeFrom" <= '${body.eventTimeTo}' AND ce."eventTimeTo" >= '${body.eventTimeFrom}')
        )
        AND ce."eventType" = 1
        AND ce."clubId" = ${clubId}
        LIMIT 1;
    `)

    if ((districtEvents.length > 0 || districtEventsByCabinets.length > 0 || adminEvents.length > 0) && body.eventType == 2) {
        return next(new AppError("Date is blocked for another district or admin event", 400))
    }

    if (myClubEvents.length > 0) {
        return next(new AppError("Date is Blocked for a club event", 400))
    }

    let isApproved
    if (body.eventType == 1) {
        isApproved = 1
    } else if (body.eventType == 2) {
        isApproved = 0
    } else {
        return next(new AppError("Bad request: Invalid event type", 400))
    }

    const resp = await admin_events.create({
        eventName: body.eventName,
        eventDate: body.eventDate,
        eventDescription: body.eventDescription,
        eventTimeFrom: body.eventTimeFrom,
        eventTimeTo: body.eventTimeTo,
        eventType: body.eventType,
        createdBy: req.tokenDetail.userId,
        clubId: req.tokenDetail.userId,
        isApproved:1
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

const getAllEvents = catchAsync(async (req, res, next) => {
    const adminId = req.tokenDetail.userId;
    console.log("User ID:", adminId);

    try {
        // 1. Club Events
        const clubQuery = `
            SELECT ce.*, cd."clubName", 'club' AS "table"
            FROM club_events ce
            JOIN club_details cd ON cd."id" = ce."clubId"
        `;
        const [clubEvents] = await sequelize_db.query(clubQuery);

        // 2. Cabinet Events
        const cabinetQuery = `
            SELECT ce.*, ud."userName", 'cabinet' AS "table"
            FROM cabinet_events ce
            JOIN user_details ud ON ud."id" = ce."userId"
        `;
        const [cabinetEvents] = await sequelize_db.query(cabinetQuery);

        // 3. Admin Events
        const adminQuery = `
            SELECT ce.*, ud."userName", 'admin' AS "table"
            FROM admin_events ce
            JOIN user_details ud ON ud."id" = ce."createdBy"
        `;
        const [adminEvents] = await sequelize_db.query(adminQuery);

        // Combine all results
        const finalData = [...clubEvents, ...cabinetEvents, ...adminEvents];
        console.log("Final Events:", finalData.length);

        res.status(200).json(finalData);
    } catch (err) {
        console.error("Error fetching events:", err);
        return next(new AppError("Failed fetching events", 500));
    }
});


const getEventWithId = catchAsync(async (req, res, next) => {
    const { id, table } = req.body;

    if (!id || !table) {
        return next(new AppError("Bad request: 'id' and 'table' are required", 400));
    }

    let query = '';
    let replacements = [id];

    if (table === 'club') {
        query = `
            SELECT ce.*, cd."clubName" AS "createdUserName", cd."id" AS "createdUserId", 'club' AS "table"
            FROM club_events ce
            JOIN club_details cd ON ce."createdBy" = cd.id
            WHERE ce.id = ?
            LIMIT 1;
        `;
    } else if (table === 'admin') {
        query = `
            SELECT ae.*, ud."userName" AS "createdUserName", ud."id" AS "createdUserId", 'admin' AS "table"
            FROM admin_events ae
            JOIN user_details ud ON ae."createdBy" = ud.id
            WHERE ae.id = ?
            LIMIT 1;
        `;
    } else if (table === 'cabinet') {
        query = `
            SELECT ce.*, ud."userName" AS "createdUserName", ud."id" AS "createdUserId", 'cabinet' AS "table"
            FROM cabinet_events ce
            JOIN user_details ud ON ce."createdBy" = ud.id
            WHERE ce.id = ?
            LIMIT 1;
        `;
    } else {
        return next(new AppError("Bad request: Invalid table name", 400));
    }

    const [result] = await sequelize_db.query(query, { replacements });

    if (!result || result.length === 0) {
        return next(new AppError("No event found with the given ID", 404));
    }

    res.status(200).json(result[0]);
});

const clubsUnderMe = catchAsync(async (req, res, next) => {
  try {
    const clubs = await club_details.findAll({
      attributes: ['id', 'clubName'],
    });

    res.status(200).json({
      status: 'success',
      data: clubs,
    });
  } catch (err) {
    return next(new AppError('Failed to fetch clubs', 500));
  }
});

// Model: blood_requests (id, name, phone, email, bloodType)
const createBloodRequest = catchAsync(async (req, res, next) => {
  const { name, phone, email, bloodType } = req.body;

  const request = await blood_request.create({
    name,
    phone,
    email,
    bloodType,
  });

  res.status(201).json({
    status: "success",
    data: request,
  });
});


const getAllBloodRequests = catchAsync(async (req, res, next) => {
  const requests = await blood_request.findAll();

  res.status(200).json({
    status: "success",
    data: requests,
  });
});


const getBloodRequestWithMatches = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const request = await blood_request.findByPk(id);
  if (!request) return next(new AppError("Request not found", 404));

  const matchedUsers = await user_details.findAll({
    where: { bloodGroup: request.bloodType },
  });

  // Convert to CSV
  const fields = ["userName", "userMobile", "bloodGroup"];
  const parser = new Parser({ fields });
  const csv = parser.parse(matchedUsers);

  res.header("Content-Type", "text/csv");
  res.attachment(`matched_users_${request.bloodType}.csv`);
  return res.send(csv);
});


const deleteBloodRequest = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const deleted = await blood_request.destroy({ where: { id } });
  if (!deleted) return next(new AppError("Request not found", 404));

  res.status(200).json({ status: "success", message: "Request deleted." });
});



module.exports = {addEvent,getAllEvents,getEventWithId, deleteEvent,RejectRequests,ApproveRequests,getAllEventRequests,getAllResource,uploadResource,createGrievance,updateGrievance,getAllGrievances,createCabinetReportType,createClubReportType,getAllClubReports,getAllCabinetReports,updateUser,deleteUser,getAllusers,addDesignation,getAllDesignations, clubsUnderMe, createBloodRequest,getAllBloodRequests, getBloodRequestWithMatches, deleteBloodRequest}
