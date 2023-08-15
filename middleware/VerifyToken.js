import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {login} from '../models/users.js'

dotenv.config();

export const verifyToken =  (req, res, next) => {
    // token life time
    const acsessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN;
    //test
    console.log("verify token test starts");
    // console.log("cookies.token=>", req.cookies.token);
    console.log("req.headers x-access=>", req.headers["x-access-token"]);
    const acsessToken = req.cookies.token || req.headers["x-access-token"]; 
   
    // or from cookies or from header, it could be only from header and any name:
    //const acsessToken = req.headers["auth"]; 

    // if name without - , it could be with .  : const refreshToken = req.cookies.refreshtoken || req.headers.refreshtoken
   
    // if no token in cookies => return no auth
    if (!acsessToken) {
        return res.status(401).json({ msg: 'unauthorized - no token found'})
    }
    

    // VERIFY TOKEN
    jwt.verify(acsessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        // if error in verify - res error
        if (err) {
            console.log("err verify", err);
            return res.status(403).json({ msg: 'verify token failed'});
            
        }
        
        //make more secure -> check username in DB
        const email = decoded.userinfo.email;
        console.log("for req to DB email=>", email)
        login(email)
        .then(row => {
            if (row.length > 0) {
                const userinfo = row
                //update token
                const secret = process.env.ACCESS_TOKEN_SECRET;
                const acsessToken = jwt.sign({ userinfo: { ...userinfo[0], password: "" } }, secret,{
                    expiresIn:`${acsessTokenExpiresIn}s`,
                });
                console.log("set cookies", acsessToken);
                res.cookie("token", acsessToken, {
                    httpOnly: true,
                    maxAge: acsessTokenExpiresIn * 1000
                  });
                //sent it back ???
                console.log("no sent token back in res");
                // res.json({ token: acsessToken});
                // go to nex 
                return next();}
            // also we can check if username and id in one row!!!
        })
        .catch(e=>{
            return res.status(401).json({ msg: 'unauthorized'})
        });
        
    });
};