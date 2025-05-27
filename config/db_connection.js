const { Sequelize } = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require("./config.js");

const sequelize_db = new Sequelize(config[env]);

// Better error handling and sync order
async function initializeDatabase() {
  try {
    // First authenticate
    await sequelize_db.authenticate();
    console.log("✅ Database connected");
    
    // Then sync with proper options
    await sequelize_db.sync({ 
      // alter: true,
      // logging: console.log // This helps debug SQL issues
    });
    console.log("✅ All models synchronized");
    
  } catch (error) {
    console.error("❌ Database initialization error:", error);
    
    // If it's an ENUM error, provide specific guidance
    if (error.name === 'SequelizeDatabaseError' && error.original.code === '42601') {
      console.error("💡 ENUM Syntax Error: Check that all ENUM values are strings, not numbers");
    }
    
    process.exit(1);
  }
}

// Initialize database
initializeDatabase();

module.exports = sequelize_db;