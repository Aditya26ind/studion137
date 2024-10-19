require("dotenv").config();
const { neon } = require("@neondatabase/serverless");

// Export the NeonDB connection instance using the connection string from environment variables
const sql = neon(process.env.DATABASE_URL);

module.exports = sql;