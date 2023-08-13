import { db } from "../config/db.js";

export const login = (email) => {
    return db("finelogins")
      .join("fineusers", { "fineusers.email": "finelogins.email" })
      .select(
        "finelogins.password",
        "finelogins.login_id",
        "fineusers.user_id",
        "fineusers.name",
        "fineusers.email",
        "fineusers.isdeveloper",
      )
      .where({ 'finelogins.email': email });
  };
  
  export const updateLastLogin = (email) => {
    return db("fineusers").update({ last_login: new Date() }).where({ email });
  };
  
  export const register = async ({
    name,
    email,
    isdeveloper,
    hash,
  }) => {
    const trx = await db.transaction();
    try {
      const user = await db("fineusers")
        .insert(
          {
            name,
            email,
            isdeveloper,
            last_login: new Date(),
          },
          ["user_id", "email", "name", "isdeveloper"]
        )
        .transacting(trx);
  
      console.log("user=>", user);
  
      const hashpwd = await db("finelogins")
        .insert(
          {
            email,
            password: hash,
          },
          ["login_id", "email", "password"]
        )
        .transacting(trx);
  
      console.log("hashpwd=>", hashpwd);
  
      await trx.commit();
      return user;
    } catch (err) {
      console.log("err=>", err);
      await trx.rollback();
      throw new Error(err.message);
    }
  };
  

  //get all users
  export const users = () => {
    return db('fineusers')
    .select('user_id','email','name', 'isdeveloper', 'last_login')
}