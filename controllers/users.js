import { register, login, updateLastLogin, users } from "../models/users.js";
import bcrypt from "bcrypt";
// tokens -> code in .env ACCESS_TOKEN_SECRET
import jwt from "jsonwebtoken";

export const _login = async (req, res) => {
    const { email, password } = req.body;
    // token life time
    const acsessTokenExpiresIn = 600;

    try {
      // try to get password with username
      const userinfo = await login(email);
  
      // if username does not exist
      if (userinfo.length === 0)
        return res.status(404).json({ msg: "email not found" });
  
      // check password
      const match = bcrypt.compareSync(password + "", userinfo[0].password);
  
      // if password not match
      if (!match) return res.status(401).json({ msg: "wrong password" });
  
      // update last login time
      await updateLastLogin(email);
    // success login
    const secret = process.env.ACCESS_TOKEN_SECRET;
 
    const acsessToken = jwt.sign({ userinfo: { ...userinfo[0], password: "" } }, secret,{
        expiresIn:`${acsessTokenExpiresIn}s`,
    });
    // save this in the session of the server
        // to put in the coockie - just for the connection, time in ms = token
        res.cookie("token", acsessToken, {
            httpOnly: true,
            maxAge: acsessTokenExpiresIn * 1000
        });
    // response with user data without the password
    //   res.status(200).json({ userinfo: { ...userinfo[0], password: "" } });
    //sent it back
        res.json({ token: acsessToken});

} catch (err) {
      console.log(err);
      return res.status(404).json({ msg: "something went wrong" });
    }
  };
  
  export const _register = async (req, res) => {
    const { name, email, password, isdeveloper } = req.body;
  
    // encrypt the password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password + "", salt);
  
    try {
      // save to db
      const rows = await register({
        name: name,
        email: email.toLowerCase(),
        hash,
        isdeveloper
      });
  
      // response with user info
      res.json(rows);
    } catch (err) {
      console.log(err);
      res.status(404).json({ msg: err.message }); //{msg: "user already exist!"}
    }
  };
  

  // logout
  export const _logout = (req, res) => {
    console.log("controller _logout");
    req.headers['x-access-token'] = null;
    // clear cookie
    res.clearCookie('token');
    return res.sendStatus(200);
}

  // get all users
  
export const _users = async (req, res) => {
    try {
        const rows = await users();
        res.json(rows);

    } catch (err) {
        console.log(err);
        res.status(404).json({msg: 'something went wrong!'})
    }
}