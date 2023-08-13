import express from "express";
import { _updateWbApi, _data, _geography, _dataChart, _dataPages } from "../controllers/wbapi.js";
import { verifyToken } from '../middleware/VerifyToken.js';

const wbapi_router = express.Router();

// update DB
wbapi_router.post('/updatedb', _updateWbApi);
wbapi_router.get('/data', _data);
wbapi_router.get('/datachart', _dataChart);
wbapi_router.get('/geography', _geography);
wbapi_router.get('/datapages', _dataPages);

export default wbapi_router;