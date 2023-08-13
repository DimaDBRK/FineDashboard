import express from "express";
import { _register, _login, _users, _logout } from "../controllers/users.js";
import { verifyToken } from '../middleware/VerifyToken.js';

const u_router = express.Router();

u_router.post("/register", _register);
u_router.post('/login', _login);
u_router.delete('/logout', _logout);
u_router.get('/verify', verifyToken, (req, res) => {
    //we can create new token with new time and add
    console.log("/verify");
    res.sendStatus(200);
});

// get all users only if verify - 
u_router.get('/users',  verifyToken, _users);

export default u_router;