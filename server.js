import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import u_router from "./routes/users.js";
import wbapi_router from "./routes/wbapi.js";
import cookieParser from "cookie-parser";

import { fileURLToPath } from 'url';

dotenv.config();

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