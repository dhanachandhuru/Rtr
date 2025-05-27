const sequelize_db = require("../config/db_connection");
const user_details = require("../db/models/user_details")
const club_reports = require("../db/models/club_reports")
const catchAsync = require("../utils/catchAsync");

const getStatsClub = catchAsync(
    async (req, res, next) => {
        const clubId = req.tokenDetail.userId
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

        const [result5, m] = await sequelize_db.query(`select ud."userName" ,ld."userEmail" ,cd."clubName"  from user_details ud 
        join club_details cd on cd.id = ud."clubId" 
        join login_details ld on ld."userId"  = ud."id"
        where (ud."isActive" is null or ud."isActive" != 1) and ud."clubId" = ${clubId};`)
        res.status(200).json({
            totalMembers,
            activeMembers,
            inactiveMembers,
            totalProjects,
            graphData: result4,
            inactiveusers: result5
        })
    })

const getStatsAdmin = catchAsync(async (req, res, next) => {
    const userId = req.tokenDetail.userId
    // total rotractors in district
    const total = await user_details.count()
    const active = await user_details.count({ where: { isActive: 1 } })
    const reports = await club_reports.count()
    const [result4, meta] = await sequelize_db.query(`SELECT
        cr."avenue",
        cr."year",
        cr."month",
        COUNT(*) AS report_count
        FROM
            public.club_reports cr
        WHERE
            TO_DATE(cr."year" || '-' || cr."month" || '-01', 'YYYY-MM-DD') >= (CURRENT_DATE - INTERVAL '6 months')
        GROUP BY
            cr.avenue , cr."year", cr."month"
        ORDER BY
            cr."year" DESC, cr."month" DESC, cr."avenue";`)

    const [result, meta1] = await sequelize_db.query(`
    SELECT
    cd."groupId" AS groupId,
    TO_CHAR(ud."createdAt", 'FMMonth') AS Month,
    COUNT(ud.id) AS UsersCount
    FROM
        user_details ud
    JOIN
        club_details cd ON ud."clubId" = cd.id
    WHERE
        ud."createdAt" >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '6 months'
    GROUP BY
        cd."groupId",
        TO_CHAR(ud."createdAt", 'FMMonth')
    ORDER BY
        cd."groupId",
        Month;
    `)

    res.status(200).json({
        total,
        active,
        reports,
        graphData:result4,
        graphData2:result
    })
})

const getStatsCabinet = catchAsync(async (req, res, next) => {
    const userId = req.tokenDetail.userId
    const [result, meta1] = await sequelize_db.query(`
    SELECT
    cd."groupId" AS groupId,
    TO_CHAR(ud."createdAt", 'FMMonth') AS Month,
    COUNT(ud.id) AS UsersCount
    FROM
        user_details ud
    JOIN
        club_details cd ON ud."clubId" = cd.id
    WHERE
        ud."createdAt" >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '6 months'
    GROUP BY
        cd."groupId",
        TO_CHAR(ud."createdAt", 'FMMonth')
    ORDER BY
        cd."groupId",
        Month;
    `)

    res.status(200).json({
        result
    })
})

module.exports = {
    getStatsClub,
    getStatsAdmin,
    getStatsCabinet
}