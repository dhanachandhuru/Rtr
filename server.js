const express = require("express")
const dotenv = require("dotenv")
const app = express()
const authRouter = require("./routes/authRoutes")
const clubRouter = require("./routes/clubRoutes")
const uploadRouter = require("./routes/uploadRoutes")
const cabinetRouter = require("./routes/cabinetRoutes")
const userRouter = require("./routes/userRoutes")
const adminRouter = require("./routes/adminRoutes")
const statsRouter = require("./routes/statsRoutes")
const catchAsync = require("./utils/catchAsync")
const AppError = require("./utils/appError")
const globalErrorController = require("./controllers/errorController")
const cors = require("cors")
// configs
dotenv.config({path:`${process.cwd()}/.env`})

// middlewares
app.use(express.json())
app.use(cors())

// Add request logging for debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// routes
app.use("/api/auth",authRouter)
app.use("/api/club",clubRouter)
app.use("/api/upload",uploadRouter)
app.use("/api/cabinet",cabinetRouter)
app.use("/api/user",userRouter)
app.use("/api/admin",adminRouter)
app.use("/api/stats",statsRouter)

// wrong route handler
app.use("*" ,catchAsync(
    async (req,res,next)=>{
        throw new AppError(`${req.originalUrl} Not Found`,404)
    })
)

// global error handler
app.use(globalErrorController)

PORT = process.env.PORT || 4000

app.listen(PORT,()=>{
    console.log("Server running on " + PORT)
})
