const AppError = require("../utils/appError");

const sendErrorDev = (error, res) => {
    res.status(error.statusCode || 500).json({
        status: error.status || "error",
        message: error.message,
        error,
        stack: error.stack
    });
};

const sendErrorProd = (error, res) => {
    // Operational error: trusted error
    if (error.isOperational) {
        return res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        });
    }

    // Programming or unknown error: don't leak details
    console.error("ERROR 💥:", error); // Log the error for the server

    return res.status(500).json({
        status: "error",
        message: "Something went wrong"
    });
};

const globalErrorController = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    // Specific known errors
    if (err.name === "JsonWebTokenError") {
        err = new AppError("Invalid token. Please log in again.", 401);
    }

    if (err.name === "TokenExpiredError") {
        err = new AppError("Your token has expired. Please log in again.", 401);
    }

    if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
        const message = err.errors[0]?.message || "Database validation error";
        err = new AppError(message, 400);
    }

    if (process.env.NODE_ENV === "development") {
        return sendErrorDev(err, res);
    }

    sendErrorProd(err, res);
};

module.exports = globalErrorController;