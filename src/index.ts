import bodyParser from "body-parser";
import dotenv from "dotenv";
import express, { Express } from "express";
import fs from "fs";
import path from "path";
import router from "./app/router";
import DateUtils from "./resources/utils/Date";
import Logger from "./resources/utils/Logger";
import cors from "cors";

dotenv.config();

fs.mkdirSync(path.join(process.cwd(), "uploads/challenges"), { recursive: true });

const app: Express = express();
app.use(cors());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
const API_PORT = process.env.API_PORT ?? "3002";
const REPORTING_FOLDER = process.env.REPORTING_FOLDER ?? "data/";
const dateStamp = DateUtils.obtainCurrentDateString().replace(/[/:]/g, "_");

Logger.logFileName = `${REPORTING_FOLDER}logs/${dateStamp}.csv`;
Logger.errorFileName = `${REPORTING_FOLDER}errors/${dateStamp}.csv`;
Logger.init();

app.use(bodyParser.json());
app.use("/api", router);

app.listen(API_PORT, () => Logger.write(`Api started at ${API_PORT}`));
