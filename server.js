const cors = require('cors');
const express = require("express")
const dotenv = require("dotenv")
const path = require("path") // ⬅️ add this

const app = express()

// Load environment variables
dotenv.config({ path: `${process.cwd()}/.env` })

// Middlewares
app.use(express.json())
app.use(cors())

// ✅ Serve static files from /uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))) // ⬅️ this line is important!

// Debug logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// Routes
const authRouter = require("./routes/authRoutes")
const clubRouter = require("./routes/clubRoutes")
const uploadRouter = require("./routes/uploadRoutes")
const cabinetRouter = require("./routes/cabinetRoutes")
const userRouter = require("./routes/userRoutes")
const adminRouter = require("./routes/adminRoutes")
const statsRouter = require("./routes/statsRoutes")
const webApiRouter = require("./routes/webApiRoutes")

app.use("/api/auth", authRouter)
app.use("/api/club", clubRouter)
app.use("/api/upload", uploadRouter)
app.use("/api/cabinet", cabinetRouter)
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/stats", statsRouter)
app.use("/api/webapi", webApiRouter)

// Fallback for undefined routes
const catchAsync = require("./utils/catchAsync")
const AppError = require("./utils/appError")
app.use("*", catchAsync(async (req, res, next) => {
    throw new AppError(`${req.originalUrl} Not Found`, 404)
}))

// Global error handler
const globalErrorController = require("./controllers/errorController")
app.use(globalErrorController)

// Start server
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log("Server running on " + PORT)
})
