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

export const userInfoByUserId = (user_id) => {
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
    .where({ 'fineusers.user_id': user_id });
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

export const addUpdateRefreshToken = (user_id, refreshTokenNew) => {
  db('userstokens')
  .where('user_id', user_id)
  .first()
  .then((existingRow) => {
    if (existingRow) {
      // Row exists, update the refresh_token
      return db('userstokens')
        .where('user_id', user_id)
        .update('refresh_token', refreshTokenNew);
    } else {
      // Row doesn't exist, insert a new row
      return db('userstokens').insert({
        user_id: user_id,
        refresh_token: refreshTokenNew,
      });
    }
  })
  .then(() => {
    console.log('Row(s) updated or inserted successfully');
  })
  .catch((error) => {
    console.error('Error:', error);
  })
  // .finally(() => {
  //   db.destroy();
  // });

};

// delete token on logout

// Delete the row with the specified user_id
export const deleteRefreshToken = (user_id) => {
  db('userstokens')
    .where('user_id', user_id)
    .del()
    .then((numRowsDeleted) => {
      if (numRowsDeleted > 0) {
        console.log(`Deleted ${numRowsDeleted} row(s) successfully`);
      } else {
        console.log(`No rows deleted for user_id ${user_id}`);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    })
  }

  // get Refresh Token by user_id

export const getRefreshToken = (user_id) => {   
  db('userstokens')
  .where('user_id', user_id)
  .select('refresh_token')
  .first()
  .then((result) => {
    if (result) {
      const refresh_token = result.refresh_token;
      console.log(`Refresh Token for user_id ${user_id}:`, refresh_token);
    } else {
      console.log(`No refresh token found for user_id ${user_id}`);
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

  // get user_id by Refresh Token 

  export const getUserIdByRefreshToken = (refreshToken) => {   
    return db('userstokens')
    .select('user_id')
    .where({'refresh_token' : refreshToken})
    .first()
    // .then((result) => {
    //   if (result) {
    //     const user_id = result.user_id;
    //     console.log(`User Id for refreshToken :`, user_id);
    //   } else {
    //     console.log(`No User Id found for refreshToken...`);
    //   }
    // })
    // .catch((error) => {
    //   console.error('Error:', error);
    // });
   
  }