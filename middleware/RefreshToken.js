import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getUserIdByRefreshToken, userInfoByUserId} from '../models/users.js'

dotenv.config();

export const refreshToken =  async (req, res) => {
   //tests
   console.log("refresh token starts!");
  //  console.log("req refresh token=>", req.body.refreshToken);
  
  // token life time for new token
  const acsessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN;
  
 
  // const refreshToken
  const refreshToken = req.body.refreshToken; 

  // if no refreshToken in request => return no auth
  if (!refreshToken) {
      return res.status(401).json({ msg: 'unauthorized - no token found'})
  }
  
  // check refreshToken and update access token
  // get info from users tokens table:
  getUserIdByRefreshToken(refreshToken)
    .then(row => {
      // if ref token exist 
      if (row) {
                const userIdForRefreshToken = row.user_id;
                console.log("userId=>", userIdForRefreshToken);
                // get user ID and check info in users table
                userInfoByUserId(userIdForRefreshToken)
                .then(row => {
                  // if user exist -> update token in cookies
                  if (row.length > 0 ) {
                    const userinfo = row
                    //update token
                    const secret = process.env.ACCESS_TOKEN_SECRET;
                    const acsessToken = jwt.sign({ userinfo: { ...userinfo[0], password: "" } }, secret,{
                        expiresIn:`${acsessTokenExpiresIn}s`,
                    });
                    console.log("New acsessToken=> ", acsessToken);

                    // to put in the cookie - just for the connection, time in ms = token
                    res.cookie("token", acsessToken, {
                      httpOnly: true,
                      maxAge: acsessTokenExpiresIn * 1000
                    });
                    return res.status(200).json({ msg: 'token updated'})
                    
                  } else {
                    return res.status(401).json({ msg: 'no user info'})
                  }

                })
                .catch(e=>{
                  return res.status(401).json({ msg: 'unauthorized'})
                });
            




       
          } else {
            return res.status(401).json({ msg: 'refresh token wrong'})
          }
           
    })
    .catch(e=>{
        return res.status(401).json({ msg: 'unauthorized'})
    });



 
 

  
  // // VERIFY refreshToken 
  // jwt.verify(acsessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
  //     // if error in verify - res error
  //     if (err) {
  //         console.log("err verify", err);
  //         return res.status(403).json({ msg: 'verify token failed'});
  //     }
  //     // verify if token in databse
      

  //     //make more secure -> check username in DB
  //     const email = decoded.userinfo.email;
  //     console.log("for req to DB email=>", email)
  //     login(email)
  //     .then(row => {
  //         if (row.length > 0) {
  //             const userinfo = row
  //             //update token
  //             const secret = process.env.ACCESS_TOKEN_SECRET;
  //             const acsessToken = jwt.sign({ userinfo: { ...userinfo[0], password: "" } }, secret,{
  //                 expiresIn:`${acsessTokenExpiresIn}s`,
  //             });
  //             console.log("set cookies", acsessToken);
  //             res.cookie("token", acsessToken, {
  //                 httpOnly: true,
  //                 maxAge: acsessTokenExpiresIn * 1000
  //               });
  //             //sent it back ???
  //             console.log("no sent token back in res");
  //             // res.json({ token: acsessToken});
  //             // go to nex 
  //             return next();}
  //         // also we can check if username and id in one row!!!
  //     })
  //     .catch(e=>{
  //         return res.status(401).json({ msg: 'unauthorized'})
  //     });
      
  // });
};