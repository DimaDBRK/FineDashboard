import axios from "axios";

//const and vars
const indicatorCodes=[
  'SP.POP.TOTL', 
  // 'SP.POP.TOTL.FE.IN', 
  // 'SP.POP.TOTL.MA.IN',
  'SP.DYN.CBRT.IN', 
  'SP.DYN.CDRT.IN',  
  'SE.COM.DURS',
  'SL.IND.EMPL.ZS', 
  'SL.AGR.EMPL.ZS', 
  // 'SL.AGR.EMPL.FE.ZS', 
  // 'SL.IND.EMPL.FE.ZS', 
  'SL.UEM.TOTL.ZS',
  'NY.GDP.MKTP.CD',
  'NY.ADJ.NNTY.PC.KD.ZG', 
  'NY.GSR.NFCY.CD', 
  'NV.AGR.TOTL.CD',
  'EG.USE.ELEC.KH.PC', 
  'EG.FEC.RNEW.ZS', 
  'EG.USE.COMM.FO.ZS'
]


const countryList=['USA', 'India', 'China', 'Japan', 'Canada', 'Great Britain', 'South Africa']

// mapping of feature codes to more meaningful names
const featureMap={
  "SP.POP.TOTL": "Total Population",
  // "SP.POP.TOTL.FE.IN": "Female Population",
  // "SP.POP.TOTL.MA.IN": "Male Population",
  "SP.DYN.CBRT.IN": "Birth Rate",
  "SP.DYN.CDRT.IN": "Death Rate",
  "SE.COM.DURS": "Compulsory Education Dur.",
  "SL.IND.EMPL.ZS":"Employment in Industry(%)",
  "SL.AGR.EMPL.ZS": "Employment in Agriculture(%)",
  // "SL.AGR.EMPL.FE.ZS": "Female Employment in Agriculture(%)",
  // "SL.IND.EMPL.FE.ZS": "Female Employment in Industry(%)",
  "SL.UEM.TOTL.ZS": "Unemployment(%)",
  "NY.GDP.MKTP.CD": "GDP in USD",
  "NY.ADJ.NNTY.PC.KD.ZG":"National Income per Capita",
  "NY.GSR.NFCY.CD":"Net income from Abroad",
  "NV.AGR.TOTL.CD":"Agriculture value added(in USD)",
  "EG.USE.ELEC.KH.PC":"Electric Power Consumption(kWH per capita)",
  "EG.FEC.RNEW.ZS":"Renewable Energy Consumption (%)",
  "EG.USE.COMM.FO.ZS":"Fossil Fuel Consumption (%)"
}


// mapping of country codes to their actual names
const countryMap={
  "USA": "US",
  "India":"IN",
  "China":"CN",
  "Japan":"JP",
  "Canada":"CA",
  "Great Britain":"GB",
  "South Africa":"ZA"
}
// API http://api.worldbank.org/v2/countries/${country.toLowerCase()}/indicators/${indicatorCode}?format=json&per_page=200&date=1960:2023`
// format=json - to receive a JSON response
// per_page=200 - data fo 63 years, change the default page size of 50 to 200 to ensure we need only one API call per feature.
// date=1960:2022 - Range of years for which the data is needed

//  get JSON data from the endpoint for one country
const fromYear= 1960;
const toYear= 2022;

export const testData = () => {
  console.log("Test data start");
  const print= [];
  // arr of years
  const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
  // transpose matrix
  const transpose = (arr) => {
    return arr.reduce((prev, next) =>
      next.map((item, i) =>
        (prev[i] || []).concat(next[i])
      ), []);
  }
  // convert to fixed-point
  function financial(x) {
    return Number.parseFloat(x).toFixed(1);
  }
  

  // Function to get JSON data from the endpoint
  const getJsonData = async (countryName) => {
    let dataList = [];
    const country = countryMap[countryName];
    
    // Function to get JSON data from the endpoint
    const getInfo = async (country, indicatorCode) => {
        try {
          const res = await axios.get(`http://api.worldbank.org/v2/countries/${country.toLowerCase()}/indicators/${indicatorCode}?format=json&per_page=200&date=${fromYear}:${toYear}`);
   
          // console.log('res=>',res.data[1][0]['country']['id']);
        
          if (res.status===200 && !Object.keys(res.data[0]).includes('message')) {
            // console.log("Get from API for: ", country, featureMap[indicatorCode])
                          
            //  list of values for one feature
            const indicatorVals=[];
       
            // the response is an array containing two arrays - [[{page: 1, ...}], [{year: 2018, SP.POP.TOTL: 123455}, ...]]
            // hence we check if the length of the response is >1
            if (res.data.length > 1) {
              // if yes, iterate over each object in the response
              // each object gives one single value for each year
              res.data[1].map((item)=>{
                // check for empty values
                // console.log(item['value']);
                if ([null,""].includes(item['value'])) {
                  indicatorVals.push(null);
                } else {
                  //  if a value is present, add it to the list of indicator values
                  indicatorVals.push(+financial(item['value']));
                }
               
              })
             
              //add country
              // indicatorVals.unshift(res.data[1][0]['country']['value'])
              return indicatorVals;

            }
          } else {
            throw new Error('Problem with Word Bank API');
          }
      } catch (err) {
          console.log(err.message);
      }
    }


    const promises = indicatorCodes.map(async (code)=>{
      const indicatorVals = await getInfo(country,code);
      // console.log(indicatorVals);
      return indicatorVals
      
    })
  // Once all the features have been obtained, add the values for the "Year"
  // The API returns the indicator values from the most recent year. Hence, we create a list of years in reverse order
  // console.log(range(2022, 1960, -1));
    

  //return the list of lists of feature values [[val1,val2,val3...], [val1,val2,val3...], [val1,val2,val3...], ...]
  const indicatorVals = await Promise.all(promises);
  dataList.push(indicatorVals); 
  //Add year
  dataList[0].push(range(toYear, fromYear, -1));
  dataList[0].push(Array(toYear-fromYear+1).fill(countryName));
  

  // console.log(country, "=>");
  // console.log("dataList", dataList[0]);

  const result = transpose(dataList[0]);
  console.log(countryName, "data collection finish", result);
  print.push(`${country} data collection finish, rows: ${result.length}`)
  return result;

}

   // # function to make final DataFrame for each country
  const  getCountryDF = (country) => {
    // The resulting dataframe needs to have meaningful column names =  table col names in DB
    // create a list of column names from the map defined above

    const colList = Object.values(featureMap);
    // console.log("col List=>",colList);
    colList.push("Year");
    console.log("col List=>",colList);
    // for each country call function and get data from the API
    const dataList = getJsonData(country);
    // console.log("dataList=>", dataList);
  
    // console.log("Transpose dataList=>", dataList);
  }



//Driver

countryList.map(country=>{
  console.log(country, "data collection start");
  getJsonData(country);

})

return print;
}