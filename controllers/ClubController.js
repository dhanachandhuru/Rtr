const { Op, Sequelize, where } = require("sequelize");
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
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const club_report_pdfs = require("../db/models/club_report_submission_pdf");
const { report } = require("../routes/adminRoutes");


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
    // if (!resp) {
        // return next(new AppError("Failed Fetching Events", 400))
    // }
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



////// this section to till below closed ********* is a report downlading section
////// GET ALL CLUB REPORTS //////
const getAllClubReports = catchAsync(async (req, res, next) => {
    const clubId = req.tokenDetail.userId;
    // console.log("Token Detail:", clubId);

    try {
        // Get all club reports
        const reports = await club_reports.findAll({ 
            where: { clubId: clubId },
            order: [['createdAt', 'DESC']]
        });

        // console.log("reports:", reports);
        
        if (!reports || reports.length === 0) {
            return next(new AppError("No reports found", 404));
        }

        res.status(200).json(reports);

    } catch (error) {
        console.error('Get all club reports error:', error);
        return next(new AppError("Failed to get reports", 500));
    }
});


const downloadClubReportPDF = catchAsync(async (req, res, next) => {
    const clubId = req.tokenDetail.userId;

    try {
        // ✅ Check if models exist
        if (!club_reports) {
            return next(new AppError("Club reports model not available", 500));
        }

        // ✅ Fetch all reports
        const reports = await club_reports.findAll({ 
            where: { clubId },
            order: [['createdAt', 'ASC']]
        });
        
        // console.log("reports found:", reports.length);

        if (!reports || reports.length === 0) {
            return next(new AppError("No reports found", 404));
        }

        if (!club_details) {
            return next(new AppError("Club details model not available", 500));
        }

        // ✅ Fetch club details
        const clubInfo = await club_details.findByPk(clubId, {
            attributes: ['clubName', 'parentRotaryName', 'charterId', 'charterDate']
        });

        console.log("clubInfo", clubInfo);
        if (!clubInfo) {
            return next(new AppError("Club details not found", 404));
        }

        // ✅ Generate SINGLE PDF for ALL reports
        const pdfResult = await generateAndStorePDFFromAllReports(reports, clubInfo);
        // console.log("pdfResult", pdfResult);

        // ✅ Store PDF in DB
        try {
            await club_report_pdfs.create({
                reportId: null,
                clubId,
                pdfFileName: pdfResult.fileName,
                pdfPath: pdfResult.filePath,
                pdfBuffer: pdfResult.buffer,
                fileSize: pdfResult.fileSize,
                generatedAt: new Date(),
                isMultiReport: true
            });
            console.log("PDF successfully stored in database");
        } catch (dbError) {
            console.error("Database storage failed, continuing with download:", dbError.message);
            // Continue without failing the request
        }

        // ✅ Send PDF file in response
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${pdfResult.fileName}"`);
        res.setHeader("Content-Length", pdfResult.fileSize);
        res.send(pdfResult.buffer);

    } catch (error) {
        console.error("PDF generation error:", error);
        return next(new AppError("Error generating PDF", 500));
    }
});


////// GENERATE AND STORE PDF FROM ALL REPORTS DATA //////
const generateAndStorePDFFromAllReports = async (reports, clubInfo = null) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ 
                size: 'A4', 
                margins: { top: 50, bottom: 50, left: 50, right: 50 } 
            });

            // Create filename for multiple reports
            const currentDate = new Date().toISOString().split('T')[0];
            const fileName = `club_reports_${clubInfo?.clubName?.replace(/[^a-zA-Z0-9]/g, '_') || 'club'}_${currentDate}.pdf`;
            
            const pdfDir = path.join(__dirname, '..', 'uploads', 'pdfs');
            
            // Create PDF directory if it doesn't exist
            if (!fs.existsSync(pdfDir)) {
                fs.mkdirSync(pdfDir, { recursive: true });
            }
            
            const filePath = path.join(pdfDir, fileName);
            
            // Create write stream
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // Collect PDF buffer
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            
            // Generate PDF content for ALL reports
            generatePDFContentForAllReports(doc, reports, clubInfo);
            
            // Finalize PDF
            doc.end();

            stream.on('finish', () => {
                try {
                    const buffer = Buffer.concat(buffers);
                    const fileSize = fs.statSync(filePath).size;
                    
                    resolve({
                        fileName,
                        filePath,
                        buffer,
                        fileSize
                    });
                } catch (error) {
                    console.error('Error in stream finish:', error);
                    reject(error);
                }
            });

            stream.on('error', (error) => {
                console.error('Stream error:', error);
                reject(error);
            });
            
            doc.on('error', (error) => {
                console.error('PDF doc error:', error);
                reject(error);
            });

        } catch (error) {
            console.error('Error in generateAndStorePDFFromAllReports:', error);
            reject(error);
        }
    });
};

////// PDF CONTENT GENERATION FOR ALL REPORTS //////
const generatePDFContentForAllReports = async (doc, reports, clubInfo) => {
    const pageWidth = doc.page.width - 100; // Account for margins

    // Header section (once)
    generateHeader(doc, pageWidth);

    // Club details section (once)
    generateClubDetails(doc, reports, clubInfo, pageWidth);

    // Monthly summary section (once)
    generateMonthlyReportSummary(doc, reports, pageWidth);

    // Combined section for each report (projects + photos + descriptions)
    generateAllReportSections(doc, reports, pageWidth);
};

// ✅ NEW FUNCTION — Single loop for all sections
const generateAllReportSections = (doc, reports, pageWidth) => {
    let currentY = doc.y + 20;
    // console.log("reports", reports);

    reports.forEach((report, index) => {
        const colHeights = 25;
        const labelWidth = 100;
        const valueWidth = 150;

        // Page break check
        if (currentY > 650) {
            doc.addPage();
            currentY = 80;
        }

        doc.rect(50, currentY, pageWidth, 25).fill('#E91E63');
        doc.fillColor('white')
           .fontSize(14)
           .font('Helvetica-Bold')
           .text(`REPORT ${index + 1}`, 50, currentY + 8, { 
             width: pageWidth, 
             align: 'center' 
           });
        
        doc.fillColor('black');
        currentY += 40;

        // === Row 1: S. No + Date ===
        doc.rect(50, currentY, labelWidth, colHeights).stroke();
        doc.font('Helvetica-Bold').fontSize(9).text('S. No', 52, currentY + 8);

        doc.rect(50 + labelWidth, currentY, valueWidth, colHeights).stroke();
        doc.font('Helvetica').text(index + 1, 52 + labelWidth, currentY + 8);

        doc.rect(50 + labelWidth + valueWidth, currentY, labelWidth, colHeights).stroke();
        doc.font('Helvetica-Bold').text('Date', 52 + labelWidth + valueWidth, currentY + 8);

        doc.rect(50 + (labelWidth + valueWidth) * 1.5, currentY, valueWidth, colHeights).stroke();
        doc.font('Helvetica').text(
            report.createdAt ? new Date(report.createdAt).toLocaleDateString('en-GB') : 'N/A',
            0 + (labelWidth + valueWidth) * 1.5,
            currentY + 8
        );
        currentY += colHeights;

        // === Row 2: Project Name ===
        doc.rect(50, currentY, labelWidth, colHeights).stroke();
        doc.font('Helvetica-Bold').text('Project Name', 52, currentY + 8);

        doc.rect(50 + labelWidth, currentY, (labelWidth + valueWidth) * 1.5, colHeights).stroke();
        doc.font('Helvetica').text(report.reportName || 'N/A', 52 + labelWidth, currentY + 8);
        currentY += colHeights;

        // === Row 3: Attendance header ===
        const attendanceWidth = (labelWidth + valueWidth) * 1.5;
        doc.rect(50, currentY, labelWidth, colHeights * 2).stroke(); // Avenue col spans 2 rows
        doc.font('Helvetica-Bold').text('Avenue', 52, currentY + colHeights / 2);

        doc.rect(50 + labelWidth, currentY, 80, colHeights * 2).stroke(); // Beneficiary col spans 2 rows
        doc.font('Helvetica-Bold').text('No. of Beneficiary', 52 + labelWidth, currentY + colHeights / 2, {
            width: 78,
            align: 'center'
        });

        doc.rect(50 + labelWidth + 80, currentY, attendanceWidth - 80, colHeights).stroke(); // Attendance merged header
        doc.font('Helvetica-Bold').text('Attendance', 52 + labelWidth + 80, currentY + 8, {
            width: attendanceWidth - 82,
            align: 'center'
        });

        currentY += colHeights;

        // === Row 4: Attendance sub-headers ===
        const attendanceCols = ['Rotaractors Attended', 'Rotarians Attended', 'Guests', 'Visiting Rtr'];
        const attColWidth = (attendanceWidth - 80) / attendanceCols.length;

        attendanceCols.forEach((header, i) => {
            const x = 50 + labelWidth + 80 + i * attColWidth;
            doc.rect(x, currentY, attColWidth, colHeights).stroke();
            doc.font('Helvetica-Bold').fontSize(8).text(header, x + 2, currentY + 8, {
                width: attColWidth - 4,
                align: 'center'
            });
        });

        currentY += colHeights;

        // === Row 5: Data row ===
        doc.rect(50, currentY, labelWidth, colHeights).stroke();
        doc.font('Helvetica').text(report.avenue || 'CLUB', 52, currentY + 8);

        doc.rect(50 + labelWidth, currentY, 80, colHeights).stroke();
        doc.font('Helvetica').text((report.beneficiaries || 0).toString(), 52 + labelWidth, currentY + 8, {
            width: 78,
            align: 'center'
        });

        const attendanceValues = [
            report.rotractorsAttended || 0,
            report.rotariansAttended || 0,
            report.guests || 0,
            report.visitingRotractors || 0
        ];

        attendanceValues.forEach((val, i) => {
            const x = 50 + labelWidth + 80 + i * attColWidth;
            doc.rect(x, currentY, attColWidth, colHeights).stroke();
            doc.font('Helvetica').text(val.toString(), x, currentY + 8, {
                width: attColWidth,
                align: 'center'
            });
        });

        currentY += colHeights + 20;

        // === Photographs Section ===
        if (report.gDriveFolder) {
            if (currentY > 650) {
                doc.addPage();
                currentY = 80;
            }
            doc.fontSize(12).font('Helvetica-Bold').text('Photographs:', 50, currentY);
            currentY += 15;
            doc.fontSize(10).font('Helvetica').fillColor('blue').text(report.gDriveFolder, 50, currentY, {
                width: pageWidth,
                link: report.gDriveFolder
            });
            currentY += 20;
        }

        // === Description Section ===
        if (report.description) {
            if (currentY > 650) {
                doc.addPage();
                currentY = 80;
            }
            doc.fillColor('black').fontSize(12).font('Helvetica-Bold').text('Description:', 50, currentY);
            currentY += 15;
            doc.fontSize(10).font('Helvetica').text(report.description, 50, currentY, {
                width: pageWidth,
                align: 'justify'
            });
            currentY += doc.heightOfString(report.description, { width: pageWidth }) + 20;
        }
    });

    doc.y = currentY;
};

// Generate header section (UNCHANGED - runs once)
const generateHeader = (doc, pageWidth) => {
    // Header background colors
    doc.rect(50, 30, pageWidth / 2, 30).fill('#F4B942'); // Yellow
    doc.rect(50 + pageWidth / 2, 30, pageWidth / 2, 30).fill('#4A90E2'); // Blue
    
    // Reset fill color
    doc.fillColor('black');
    
    // Title section
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .text('DISTRICT ROTARACT COUNCIL 2025-26', 50, 80, { 
         width: pageWidth, 
         align: 'center' 
       });
    
    doc.fontSize(12)
       .font('Helvetica')
       .text('ROTARY INTERNATIONAL DISTRICT 3203', 50, 100, { 
         width: pageWidth, 
         align: 'center' 
       });
    
    doc.text('Coimbatore - Rural | Erode | Nilgiris | Tirupur', 50, 115, { 
      width: pageWidth, 
      align: 'center' 
    });
    
    doc.text('Email: 3203district@rotaractcouncil@gmail.com', 50, 130, { 
      width: pageWidth, 
      align: 'center' 
    });
    
    // Club details header
    doc.rect(50, 160, pageWidth, 25).fill('#E91E63'); // Pink header
    doc.fillColor('white')
       .fontSize(14)
       .font('Helvetica-Bold')
       .text('CLUB DETAILS', 50, 170, { 
         width: pageWidth, 
         align: 'center' 
       });
    
    doc.fillColor('black'); // Reset color
};

// Generate club details section (UPDATED - runs once)
const generateClubDetails = (doc, reports, clubInfo, pageWidth) => {
    let currentY = 200;
    
    const clubName = clubInfo && clubInfo.clubName ? clubInfo.clubName.toUpperCase() : 'CLUB NAME NOT AVAILABLE';
    const parentRotaryName = clubInfo && clubInfo.parentRotaryName ? clubInfo.parentRotaryName.toUpperCase() : 'PARENT ROTARY CLUB NOT AVAILABLE';
    const report = reports.length > 0 && reports[0].month ? reports[0].month.toUpperCase() : 'Month';
    console.log("in report list", reports);
    
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('ROTARACT CLUB OF', 50, currentY, { 
         width: pageWidth, 
         align: 'center' 
       });
    
    currentY += 25;
    doc.fontSize(12)
       .font('Helvetica')
       .text(clubName, 50, currentY, { 
         width: pageWidth, 
         align: 'center' 
       });
    
    currentY += 25;
    doc.fontSize(10)
       .font('Helvetica')
       .text(`Charter ID: ${clubInfo?.charterId || 'N/A'}`, 50, currentY);
    
    doc.text(`Charter Date: ${clubInfo?.charterDate || 'N/A'}`, 300, currentY);
    
    currentY += 20;
    doc.text(`Parent Rotary Club: ${parentRotaryName}`, 50, currentY);
    doc.text(`REPORT FOR THE MONTH: ${report}`, 300, currentY);
    
    doc.y = currentY + 30;
};

// Generate monthly report SUMMARY section (NEW - runs once, summarizes all reports)
const generateMonthlyReportSummary = (doc, reports, pageWidth) => {
    let currentY = doc.y + 20;
    
    // Check if we need a new page
    if (currentY > 650) {
        doc.addPage();
        currentY = 80;
    }
    
    // Monthly report header
    doc.rect(50, currentY, pageWidth, 25).fill('#E91E63');
    doc.fillColor('white')
       .fontSize(14)
       .font('Helvetica-Bold')
       .text('REPORTS SUMMARY', 50, currentY + 8, { 
         width: pageWidth, 
         align: 'center' 
       });
    
    doc.fillColor('black');
    currentY += 40;
    
    // Calculate totals from all reports
    const totalBeneficiaries = reports.reduce((sum, report) => sum + (report.beneficiaries || 0), 0);
    const totalRotractors = reports.reduce((sum, report) => sum + (report.rotractorsAttended || 0), 0);
    const totalRotarians = reports.reduce((sum, report) => sum + (report.rotariansAttended || 0), 0);
    const totalVisitingRotractors = reports.reduce((sum, report) => sum + (report.visitingRotractors || 0), 0);
    
    // Summary table
    const summaryData = [
        ['Total Reports', reports.length.toString()],
        ['Total Beneficiaries', totalBeneficiaries.toString()],
        ['Total Rotractors Attended', totalRotractors.toString()],
        ['Total Rotarians Attended', totalRotarians.toString()],
        ['Total Visiting Rotractors', totalVisitingRotractors.toString()]
    ];
    
    generateTable(doc, summaryData, 50, currentY, pageWidth);
    doc.y = currentY + (summaryData.length * 25) + 20;
};

// Helper function to generate simple tables (UNCHANGED)
const generateTable = (doc, data, x, y, width) => {
    const rowHeight = 25;
    const colWidth = width / 2;
    
    data.forEach((row, index) => {
        const currentY = y + (index * rowHeight);
        
        // Draw cells
        doc.rect(x, currentY, colWidth, rowHeight).stroke();
        doc.rect(x + colWidth, currentY, colWidth, rowHeight).stroke();
        
        // Add text
        doc.fontSize(10)
           .font('Helvetica-Bold')
           .text(row[0], x + 5, currentY + 8, { width: colWidth - 10 });
        
        doc.font('Helvetica')
           .text(row[1], x + colWidth + 5, currentY + 8, { width: colWidth - 10 });
    });
};

const getAllPdfReports = catchAsync(async (req, res, next) => {
    const clubId = req.tokenDetail.userId;

    const pdfs = await club_report_pdfs.findAll({
        where: { clubId },
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'pdfFileName', 'fileSize', 'generatedAt', 'isMultiReport', 'createdAt']
    });

    if (!pdfs.length) {
        return next(new AppError("No PDF reports found", 404));
    }

    res.status(200).json({
        status: "success",
        results: pdfs.length,
        data: pdfs
    });
});

const getAllPdfReportsForAdmin = catchAsync(async (req, res, next) => {
    const adminId = req.tokenDetail.userId;

    const pdfs = await club_report_pdfs.findAll({
        order: [['createdAt', 'DESC']],
        attributes: ['id','clubId', 'pdfFileName', 'fileSize', 'generatedAt', 'isMultiReport', 'createdAt']
    });

    if (!pdfs.length) {
        return next(new AppError("No PDF reports found", 404));
    }

    res.status(200).json({
        status: "success",
        results: pdfs.length,
        data: pdfs
    });
});

// ✅ 2. Get/download a single PDF report by ID
const getPdfReportById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const clubId = req.tokenDetail.userId;

    const pdf = await club_report_pdfs.findOne({
        where: { id, clubId }
    });

    if (!pdf) {
        return next(new AppError("PDF report not found", 404));
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${pdf.pdfFileName}"`);
    res.setHeader("Content-Length", pdf.fileSize || pdf.pdfBuffer.length);
    res.send(pdf.pdfBuffer);
});

// ✅ 3. Delete a PDF report by ID
// Delete a stored PDF

const deletePdfReportById = catchAsync(async (req, res, next) => {
    const pdfId = req.params.pdfId; // match the route param name
    // console.log("pdfId", pdfId);
    const clubId = req.tokenDetail.userId; // If you need it for validation

    if (!pdfId) {
        return next(new AppError("PDF ID is required", 400));
    }

    const deleted = await club_report_pdfs.destroy({
        where: { id: pdfId }
    });

    if (!deleted) {
        return next(new AppError("PDF report not found or already deleted", 404));
    }

    res.status(200).json({
        status: "success",
        message: "PDF report deleted successfully"
    });
});



// Controller
const downloadReportByIdV2 = catchAsync(async (req, res) => {
  try {
    const reportId = req.params.reportId; // match the route param name
    // console.log("reportId", reportId);

    if (!reportId) {
      return res.status(400).json({
        status: "error",
        message: "Report ID is required"
      });
    }

    const reportPdf = await club_report_pdfs.findOne({
      where: { id: reportId }
    });

    if (!reportPdf) {
      return res.status(404).json({
        status: "error",
        message: "PDF not found"
      });
    }

    // If you're storing file path in pdfPath
    return res.download(reportPdf.pdfPath);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Server error"
    });
  }
});

// Route







// [Include all the PDF generation helper functions from previous artifact here]
// generateHeader, generateClubDetails, generateMonthlyReportSection, etc.

module.exports = { getEventWithId,activateUser,getAllCabinets, getAllEvents, deleteEvent, addEvent, getAllReport, addReport, updateClubAsset, getAllAssets, addAsset, updateClub, getClubData, getAllClubs, getMemberDetails, updateMember, getAllClubDesignations, CreateDesignationAndAssign, deleteDesignation, editDesignation, getAllClubReports, downloadClubReportPDF,
    generateAndStorePDFFromAllReports,
    generatePDFContentForAllReports,
    generateAllReportSections,
    generateHeader,
    generateClubDetails,
    generateMonthlyReportSummary,
    generateTable,
    getAllPdfReports,
    getPdfReportById,
    deletePdfReportById,
    downloadReportByIdV2,
    getAllPdfReportsForAdmin
}
