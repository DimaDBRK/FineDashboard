import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import u_router from "./routes/users.js";
import wbapi_router from "./routes/wbapi.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
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
    