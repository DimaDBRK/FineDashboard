import { 
  deleteDataCountry, 
  insertDataCountry, 
  data, 
  geography, 
  dataPages, 
  reports, 
  allusersreports,
  insertUserReport,
  deleteUserReport,
  allUserReportsisDisplay,
  putLiveData,
  liveData,
  clearLiveData
} from "../models/wbapi.js";
import { WbApiDataGet } from "../helpers/WbApiDataGet.js"
import { GetLiveData } from "../helpers/GetLiveDataTest.js"
import { convertDataForChart } from "../helpers/convertDataForChart.js";
import { job } from "../server.js"
let counter = 0;

const keys = ['total_population',
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
'country']




// mapping of country codes to their actual names
const countryCode={
  "USA": "USA",
  "India":"IND",
  "China":"CHN",
  "Japan":"JPN",
  "Canada":"CAN",
  "Great Britain":"GBR",
  "South Africa":"ZAF"
}

export const _updateWbApi = async (req, res) => {

  const { command } = req.body;

  console.log("command recived", command);
  if (command ===  "update") {
    console.log("command for update recived");
    // for each country try get data from external api
    //send data to 
    try { 
    // get data from API
    // console.log(WbApiDataGet());

      const valuesToInsert = await WbApiDataGet();
      console.log(valuesToInsert.length);

        const dataToInsert = [];
        valuesToInsert.map((row)=>{
          const rowToInsert = row.reduce(( acc, value, i ) => {
            acc[keys[i]] = value;
            return acc}, {})
            dataToInsert.push(rowToInsert);
          })
          
      
        
      const rowsQty = await insertDataCountry(dataToInsert);
      console.log(rowsQty);
      return res.json({ msg: `Ok. ${rowsQty} Data rows inserted` });
    } catch (err) {
      console.log("Error=>", err);
      return res.status(404).json({ msg: "something went wrong" });
    }


    
  } else if (command === "delete") {
    counter += 1;
    console.log("command for clear data recived", counter);
    
    
    if (counter >= 2) {
      console.log("start clear data", counter);
      counter = 0;
      try { 
        const rowsDel = await deleteDataCountry();
        res.json({ msg: `Ok. ${rowsDel} Data rows deleted` });
      } catch (err) {
        console.log(err);
        return res.status(404).json({ msg: "something went wrong" });
      }
    } else {
      res.json({msg:"To delete data press button again"});
    }
  } else {
    res.status(500).json({ msg: "wrong command" });
  }  


};


  // get all data
export const _data = async (req, res) => {
    try {
        const code = req.query.code;
        const rows = await data(req.query.code);
        res.json(rows);

    } catch (err) {
        console.log(err);
        res.status(404).json({msg: 'something went wrong!'})
    }
  }

  // _geography
export const _geography = async (req, res) => {
    try {
        const code = req.query.code;
        const year = req.query.year;
        if (code && year) {
          console.log(year, code);
          const rows = await geography(req.query.code, req.query.year);
          console.log(rows);
          //convert format
          const geoData =  []
          rows.map((row, index)=>{
            geoData[index]={"id":countryCode[row["country"]], "value":row[code]}
          })
          console.log(geoData);
          res.json(geoData);

        } else {
          res.status(500).json({ msg: "wrong request" });
        }
        // const rows = await geography(req.query.code, req.query.year);
        console.log(year, code);
        // res.json(rows);

    } catch (err) {
        console.log(err);
        res.status(404).json({msg: 'something went wrong!'})
    }
  }

    // get data for Chart
export const _dataChart = async (req, res) => {
  try {
      const code = req.query.code;
      const rows = await data(req.query.code);
  
      console.log(rows);
      //convert to format for chart
      const data1 = convertDataForChart(rows, code);
      res.json(data1);
      // res.status(200).json({msg: 'recive!'})

  } catch (err) {
      console.log(err);
      res.status(404).json({msg: 'something went wrong!'})
  }
}

  // get all data
  export const _dataPages = async (req, res) => {
    try {
        const page = req.query.page;
        const pageSize = req.query.pageSize;
        const sort = req.query.sort;
        const search = req.query.search;
        console.log("params=>", page, pageSize, sort, search);
        const rows = await dataPages();
        // Calculate the start and end indexes for the requested page
        const startIndex = (page -1) * pageSize;
        const endIndex = (page) * pageSize;
        const total = rows.length;
        
        // Slice the products array based on the indexes
        const paginatedRows = rows.slice(startIndex, endIndex);
        console.log(startIndex, endIndex, paginatedRows.length);
        // Calculate the total number of pages
        const totalPages = Math.ceil(rows.length / pageSize);
        
        // Send the paginated products and total pages as the API response
          res.json({ data: paginatedRows, totalPages, total });
        
    } catch (err) {
        console.log(err);
        res.status(404).json({msg: 'something went wrong!'})
    }
  }

    // get all reports
  
export const _reports = async (req, res) => {
  try {
      const rows = await reports();
      res.json(rows);

  } catch (err) {
      console.log(err);
      res.status(404).json({msg: 'something went wrong!'})
  }
}


    // get all usersreports
  
    export const _allusersreports = async (req, res) => {
      try {
          const rows = await allusersreports();
          res.json(rows);
    
      } catch (err) {
          console.log(err);
          res.status(404).json({msg: 'something went wrong!'})
      }
    }
    

    //insert user report to usersreports
    
    export const _insertUserReport = (req, res) => {
      // console.log("body", req.body);
      insertUserReport(req.body)
        .then((data) => {
          // res.json(data);
          allUserReportsisDisplay(req.body.user_id)
          .then((data) => {
            res.json(data);
          })
          .catch((e) => {
            console.log(e);
            res.status(404).json({ msg: e.message });
          });
        })
        .catch((e) => {
          console.log(e);
          res.status(404).json({ msg: e.message });
        });
    };

    // delete user report from usersreports
    export const _deleteUserReport = (req, res) => {
      deleteUserReport(req.body)
        .then((data) => {
          console.log(req.body);
          // res.json(data);
          allUserReportsisDisplay(req.body.user_id)
          .then((data) => {
            res.json(data);
          })
          .catch((e) => {
            console.log(e);
            res.status(404).json({ msg: e.message });
          });
        })
        .catch((e) => {
          console.log(e);
          res.status(404).json({ msg: e.message });
        });
    };
    

    //wbapi/alluserreportsisdispaly/:id get all user reports and is dispaly (is display or not)
    //  _allUserReportsisDisplay
    export const _allUserReportsisDisplay = (req, res) => {
      console.log("all params=>", req.params);
      allUserReportsisDisplay(req.params.user_id)
        .then((data) => {
          res.json(data);
        })
        .catch((e) => {
          console.log(e);
          res.status(404).json({ msg: e.message });
        });
    };

    //_cronJobData management
    export const _cronJobData = async (req, res) => {
      try {
        const { command } = req.body;
      
        console.log("Cron Job data: command recived", command);
        if (command ===  "start") {
          console.log("start recived");
          //corn
          job.start();//starts the job
          // stop in 5 min = 90000
          setTimeout(function(){
            console.log("corn job stop");
            job.stop()//starts the job
          }, 60000);


          res.status(200).json({msg:'job started successfully'})
          
          
        } else if (command === "stop") {
          console.log("command stop");
          //corn
          job.stop()//starts the job
          res.status(200).json({msg:'job stopped successfully'})
        
        }  else if (command === "clear") {
          console.log("command clear");
          //clear table
          clearLiveData()
          .then((data) => {
            console.log("clear", data);
            res.status(200).json({msg:'clear successfully'})
            })
            .catch((e) => {
              console.log(e);
              res.status(404).json({ msg: e.message });
            });
        

        } else {
          res.status(404).json({msg: 'wrong command!'})
        }

      } catch (err) {
        console.log(err);
        res.status(404).json({msg: 'something went wrong!'})
      }
    };
    
    // _liveData
export const _liveData = async (req, res) => {
  try {
    const code = req.query.code;
    console.log(code);
    if (code === "livedata") {
      const rows = await liveData(req.query.code);
      res.json(rows); }
    else {
        res.status(401).json({msg: 'wrong data code!'})
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({msg: 'something went wrong!'})
  }
};