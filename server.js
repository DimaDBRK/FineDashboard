import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import u_router from "./routes/users.js";
import wbapi_router from "./routes/wbapi.js";
import cookieParser from "cookie-parser";
import cron from 'node-cron'
import { putLiveData } from "./models/wbapi.js";
import { GetLiveData } from "./helpers/GetLiveDataTest.js"

import { fileURLToPath } from 'url';

dotenv.config();

// corn job config
const cronExpression = '*/3 * * * * *';
export const action = async () => {
  const data = await GetLiveData();
  // console.log(data);
  putLiveData(data);
  // console.log('This cron job will run every 5 seconds')
}
export const job = cron.schedule(cronExpression, action, {scheduled:false})
// corn end

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());

// add parser
app.use(express.urlencoded({extended:true})); // ql
app.use(express.json());

// const __dirname = path.resolve();
// app.use("/", express.static(__dirname + "/public"));
app.use(cookieParser());

app.use("/users", u_router);
app.use("/wbapi", wbapi_router);




app.listen(process.env.PORT, () => {
    console.log(`run on port ${process.env.PORT}`);
    });
    

// for deploy
// Have Node serve the files for our built React app
// app.use(express.static(path.resolve(__dirname, "./client/build")));
app.use(express.static(path.join(__dirname, "client/build")));

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});