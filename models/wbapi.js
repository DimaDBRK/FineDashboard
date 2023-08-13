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