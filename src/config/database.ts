import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import moment from "moment-timezone";

dotenv.config();
const timezoneOffset = moment.tz("Australia/Sydney").format("Z");

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    timezone: timezoneOffset, // Dynamically adjusts for DST
    logging: false,
  }
);

export default sequelize;
