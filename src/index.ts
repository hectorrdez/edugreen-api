import bodyParser from "body-parser";
import dotenv from "dotenv";
import express, { Express } from "express";
import router from "./app/router";
import DateUtils from "./resources/utils/Date";
import Logger from "./resources/utils/Logger";

dotenv.config();

const app: Express = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
const { API_PORT } = process.env;

Logger.logFileName =
  "./src/data/logs/" +
  DateUtils.obtainCurrentDateString().replace(/[/:]/g, "_") +
  ".csv";
Logger.errorFileName =
  "./src/data/errors/" +
  DateUtils.obtainCurrentDateString().replace(/[/:]/g, "_") +
  ".csv";
Logger.init();

app.use(bodyParser.json());
app.use(router);

app.listen(API_PORT, () => Logger.write(`Api started at ${API_PORT}`));
