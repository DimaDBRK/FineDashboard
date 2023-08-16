import express from "express";
import { _register, _login, _users, _logout } from "../controllers/users.js";
import { verifyToken } from '../middleware/VerifyToken.js';
import { refreshToken } from '../middleware/RefreshToken.js';

const u_router = express.Router();

u_router.post("/register", _register);
u_router.post('/login', _login);
u_router.post('/logout', _logout);
// tokens and auth
u_router.get('/verify', verifyToken, (req, res) => {
    //we create in verifyToken new token with new time and add add to cookies
    console.log("got on /verify get request");
    res.sendStatus(200);
});
u_router.post('/refresh', refreshToken);


// get all users only if verify - 
u_router.get('/users',  verifyToken, _users);

export default u_router;