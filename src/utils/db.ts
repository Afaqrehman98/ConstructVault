import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const { DATABASE_URL, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } =
  process.env;

const databaseUrl = DATABASE_URL || "";
const host = DB_HOST || "localhost";
const username = DB_USERNAME || "your_username";
const password = DB_PASSWORD || "your_password";
const database = DB_NAME || "your_database";

export const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  host,
  username,
  password,
  database,
  logging: false,
});

export const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // Adjust as necessary
    console.log("Database synchronized successfully");
  } catch (error) {
    console.error("Error synchronizing the database:", error);
  }
};

syncDatabase();

export default sequelize;
