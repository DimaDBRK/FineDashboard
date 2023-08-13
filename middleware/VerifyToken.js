import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {login} from '../models/users.js'

dotenv.config();

export const verifyToken =  (req, res, next) => {
    //test
    console.log("verify token test:");
    // console.log("cookies.token=>", req.cookies.token);
    console.log("req.headers x-access=>", req.headers["x-access-token"]);
    const acsessToken = req.cookies.token || req.headers["x-access-token"]; 
   
    // or from cookies or from header, it could be only from header and any name:
    //const acsessToken = req.headers["auth"]; 

    // if name without - , it could be with .  : const refreshToken = req.cookies.refreshtoken || req.headers.refreshtoken
   

    if (!acsessToken) {
        return res.status(401).json({ msg: 'unauthorized - no token found'})
    }
    // return - not go to next
   

    // VERIFY TOKEN
    jwt.verify(acsessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      
        if (err) {
            console.log("err verify", err);
            return res.status(403).json({ msg: 'verify token failed'});
            
        }
            //make more secure -> check username in DB
      
        const email = decoded.userinfo.email;
        console.log("for req to DB email=>", email)
        login(email)
        .then(row => {
            if (row.length > 0) return next();
            // also we can check if username and id in one row!!!
        })
        .catch(e=>{
            return res.status(401).json({ msg: 'unauthorized'})
        });
        
    });
};