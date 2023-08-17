import express from "express";
import { 
    _register, 
    _login, 
    _users, 
    _logout, 
    _getUserInfoById, 
    _updateUserInfoById, 
    _deleteProfile, 
    _deleteRefreshToken 
} from "../controllers/users.js";
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
u_router.get('/users', verifyToken, _users);

// get user info by user id only if verify - 
u_router.get('/user/:user_id',  _getUserInfoById);
u_router.put('/user/:user_id', verifyToken,  _updateUserInfoById);

// delete user
u_router.post('/user/deleteprofile', verifyToken,  _deleteProfile);


//delete refresh tokens for user by id
u_router.post('/user/deleterefreshtoken', verifyToken,  _deleteRefreshToken);

export default u_router;