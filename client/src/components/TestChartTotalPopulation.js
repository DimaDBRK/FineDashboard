import { useContext, useEffect, useState }  from "react";
import { AppContext } from "App";
import Auth from "auth/Auth";
import FlexBetween from 'components/FlexBetween';
import jwt_token from 'jwt-decode';
import { IconButton, useTheme, InputBase, Button, Box, Typography, Menu, MenuItem} from '@mui/material';
import { testData } from "helpers/testWbApi";
import LoginIcon from '@mui/icons-material/Login';
import axios from "axios";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label
} from "recharts";

const TestChartTotalPopulation = (props) => {
    
  const { token } = useContext(AppContext);
  const [msg, setMsg] = useState("");
  const [data, setData] = useState([]);
  const deleteDataInDB = async (e) => {
   
    // -> delete
      try {
          const res = await axios.post(`/wbapi/updatedb`, { "command": "delete"  });
          if (res.status === 200) {
              console.log(res.data);
              setMsg(res.data.msg);
          }
      } catch (err) {
      console.log(err);
      setMsg(err.response.data.msg); // to show in the same part
      }
}

const updateDataInDB = async (e) => {
   
  // -> update
    try {
        const res = await axios.post(`/wbapi/updatedb`, { "command": "update"  });
        if (res.status === 200) {
            console.log(res.data);
            setMsg(res.data.msg);
        }
    } catch (err) {
    console.log(err);
    setMsg(err.response.data.msg); // to show in the same part
    }
}

const getDataFromDB = async (code) => {
   
  // -> delete
    try {
        const res = await axios.get(`/wbapi/data?code=${code}`);
        if (res.status === 200) {
          const info = res.data;
          setData(testTransform(info));
          // console.log(dataTransform(info));
          setMsg("");
        }
    } catch (err) {
    console.log(err);
    setMsg(err.response.data.msg); // to show in the same part
    }
}
 
const dataTransform = (data) => {
  const newData = [];
   data.toReversed().map((item)=>{
    
      const add = {"year" : item['year'], [item['country']]: item['total_population'] }
      newData.push(add);
  
   
   })

   return newData
}

const testTransform = (data) => {
 console.log("Test transform");
 const newData = []
 
// list of years
  const years = [...new Set(data.map(a => a.year))].sort();
  // list of countries
  const countries = [...new Set(data.map(a => a.country))].sort();

  // var myArray = [{myNumber: 1, name: 'one'}, {myNumber: 3, name: 'tree'}, {myNumber: 6, name: 'six'}, {myNumber: 8, name: 'eight'}];
  var result = data.filter((x) => { return (x["year"] === 2022 && x["country"]==='USA');})[0]['total_population'];
  console.log(result);

  const dataForChart = years.map((year)=>{
    const add = {"year" : year}
    const dataToAdd = countries.map((country)=>{
      const value = data.filter((x) => { return (x["year"] === year && x["country"]===country)})[0]['total_population'];
      add[country] = value;
    })
    newData.push(add);
    
  });
//  data.toReversed().map((item)=>{
//   const add = {"year" : item['year'], [item['country']]: item['total_population'] }
//   newData.push(add);
// })


console.log(years);
console.log(countries);
console.log(data);
console.log(newData);
return newData;
}



return(
  <Box component="div">
    {/* <Button variant="contained" size="large" endIcon={<LoginIcon />} onClick={()=>testTransform(data)}>Test</Button> */}
    <FlexBetween gap="0.5rem">
      <Typography variant="h4" fontWeight="bold">
        Collect data from Server:
      </Typography>
      <Typography component="p" variant="h6">
            {msg}
      </Typography>
    </FlexBetween>
    <Typography component="p" variant="h6">
            {msg}
    </Typography>
    <FlexBetween  gap="0.5rem">
      <Typography variant="h5" align="center"  paragraph>
          1. Delete data in DB (press 2 times)
      </Typography>
    </FlexBetween>
    <Button variant="contained" size="large" endIcon={<LoginIcon />} onClick={deleteDataInDB}>Delete data</Button>
    <FlexBetween  gap="0.5rem">
      <Typography variant="h5" align="center"  paragraph>
          2. Data Collection to DB from WB API
      </Typography>
    </FlexBetween>
    <Button variant="contained" size="large" endIcon={<LoginIcon />} onClick={updateDataInDB}>Get Data to DB</Button>
    <FlexBetween  gap="0.5rem">
      <Typography variant="h5" align="center"  paragraph>
          3. Get data from DB
      </Typography>
    </FlexBetween>
    <Button variant="contained" size="large" endIcon={<LoginIcon />} onClick={()=>{getDataFromDB("total_population")}}>Total Population</Button>
    {data.length > 1 && (<Button variant="contained" size="large" endIcon={<LoginIcon />} onClick={()=>{{setData({})}}}>Clear</Button>)}
    {data.length > 1 && (
      
    <LineChart
      
      width={500}
      height={400}
      data={data}
      margin={{
        top: 16,
        right: 16,
        bottom: 0,
        left: 24,
      }}
    >
      {/* <CartesianGrid strokeDasharray="3 3" /> */}
      <XAxis dataKey="year" />
      <YAxis/>
   
      <Tooltip />
      
      <Line
        type="monotone"
        dataKey="USA"
        stackId="1"
        stroke="#8884d8"
        fill="#8884d8"
      />
        <Line
        type="monotone"
        dataKey="India"
        stackId="1"
        stroke="red"
        fill="#8884d8"
      />
        <Line
        type="monotone"
        dataKey="China"
        stackId="1"
        stroke="green"
        fill="#8884d8"
      />
      {/* <Area
        type="monotone"
        dataKey="pv"
        stackId="1"
        stroke="#82ca9d"
        fill="#82ca9d"
      /> */}
      {/* <Area
        type="monotone"
        dataKey="amt"
        stackId="1"
        stroke="#ffc658"
        fill="#ffc658"
      /> */}
    </LineChart>
      )}
  </Box>
  
)
}

export default TestChartTotalPopulation;