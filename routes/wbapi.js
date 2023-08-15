import express from "express";
import { 
  _updateWbApi, 
  _data, _geography, 
  _dataChart, _dataPages, 
  _reports,
  _allusersreports,
  _insertUserReport,
  _deleteUserReport,
  _allUserReportsisDisplay
} from "../controllers/wbapi.js";
import { verifyToken } from '../middleware/VerifyToken.js';

const wbapi_router = express.Router();

// update DB
wbapi_router.post('/updatedb', verifyToken, _updateWbApi);
wbapi_router.get('/data', _data);
wbapi_router.get('/datachart', _dataChart);
wbapi_router.get('/geography', _geography);
wbapi_router.get('/datapages', _dataPages);
wbapi_router.get('/reports', _reports);
wbapi_router.get('/allusersreports', _allusersreports);
wbapi_router.post("/allusersreports", verifyToken, _insertUserReport);
wbapi_router.post("/deleteuserreport", verifyToken, _deleteUserReport);
wbapi_router.get("/alluserreportsisdispaly/:user_id", _allUserReportsisDisplay);
export default wbapi_router;