import { db } from "../config/db.js";

  //delet data from table
export const deleteDataCountry = async () => {
  const result = await db('countrydata')
    .del();
  console.log("res of delete", result);
  return result
    
}

export const insertDataCountry = async (data) => {

  const dataCountry = await  db('countrydata')
  .insert(data,
    ['id'])

  console.log("insertr=>", dataCountry.length);
  return dataCountry.length;
}

 //get data for code
export const data = (code) => {
  return db('countrydata')
  .select('year','country', code)
}

//get all geography
export const geography = (code, year) => {
  return db('countrydata')
  .where({'year': year})
  .select('country', code)
 
}

export const dataPages = () => {
  return db('countrydata')
  .select('id','total_population',
  'birth_rate',
  'death_rate',
  'compulsory_education',
  'employment_industry',
  'employment_agriculture',
  'unemployment',
  'gdp_usd',
  'national_income_capita',
  'net_income_abroad',
  'agriculture_value',
  'electric_power_consumption_capita',
  'renewable_energy_consumption',
  'fossil_fuel_consumption',
  'year',
  'country')
}


//wbapi/reports get all reports
export const reports = () => {
  return db('reports')
  .select('report_id',	'report',	'title',	'short',	'description', 'link')
}

//wbapi/reports get all users reports (is display or not)
export const allusersreports = () => {
  return db('usersreports')
  .select('user_id', 'report_id', 'isdisplay')
}

// insert user report to usersreports
export const insertUserReport = ({user_id, report_id}) => {
  // console.log('name',name, 'price', price);
  return db('usersreports')
  .insert ({user_id, report_id})
  .returning(['user_id', 'report_id', 'isdisplay'])
}


// delete user report from user report to usersreports

export const deleteUserReport = ({user_id, report_id}) => {
  return db('usersreports')
  .where({user_id, report_id})
  .del()
  .returning(['user_id', 'report_id', 'isdisplay'])
}

//wbapi/alluserreportsisdispaly/:id get all user reports and is dispaly (is display or not)
export const allUserReportsisDisplay = (user_id) => {
  return db('reports')
  .leftJoin('usersreports', function () {
    this.on('reports.report_id', '=', 'usersreports.report_id')
      .andOn('usersreports.user_id', '=', +user_id);
  })
  .select(
    'reports.report_id',
    'reports.report',
    'reports.title',
    'reports.short',
    'reports.description',
    'reports.link',
    'usersreports.id AS user_report_id',
    'usersreports.isdisplay',
    'usersreports.user_id'
  )
  
     
}

// putLiveData


export const putLiveData = async ({x, y}) => {
  // const data = await  db('livedata')
  // .insert({x, y},
  //   ['id'])

  // console.log("insert live data=>", data);
// Check the quantity of rows in the table
  const data = db('livedata')
  .count('id as rowCount')
  .first()
  .then(({ rowCount }) => {
    if (rowCount >= 10) {
     
      // Get the minimum id of the rows
      return db('livedata')
        .min('id as minId')
        .first()
        .then(({ minId }) => {
          // Delete the row with the minimum id
          return db('livedata')
            .where('id', minId)
            .del()
            .then(() => {
              // console.log('Row deleted');
            });
        });
    }
  })
    .then(() => {
      // Insert new data
      return db('livedata').insert({x, y}, ['id']);
    })
    .then(() => {
      // console.log('Data added successfully');
    })
    .catch((error) => {
      console.error('Error:', error);
      return false;
    })
 
}

 //get data for code
 export const liveData = () => {
  return db('livedata')
  .select('id as x','y')
}

 //get data for code
 export const clearLiveData = () => {
  return db('livedata')
  .del()
}