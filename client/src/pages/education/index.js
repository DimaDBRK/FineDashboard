import React from "react";
import { useTheme } from "@mui/material";
import Header from "components/Header";
import { ResponsiveLine } from "@nivo/line";
import { useContext, useEffect, useState, useMemo }  from "react";
import { AppContext } from "App";
import { FormControl, MenuItem, InputLabel, Box, Button, Select, Checkbox, FormControlLabel } from "@mui/material";
import axios from "axios";
import FlexBetween from 'components/FlexBetween';
// import YearlyChart from "components/PopulationChart";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs, { Dayjs } from 'dayjs';

import LoginIcon from '@mui/icons-material/Login';
import { yearCalendarClasses } from "@mui/x-date-pickers";

const Education = () => {
  const [view, setView] = useState("compulsory_education");
  const [years, setYears] = useState([2022,1960]);
  const [countries, setCountries] = useState([]);
  const [countriesShow, setCountriesShow] = useState({});
  const [startDate, setStartDate] = useState(2002);
  const [endDate, setEndDate] = useState(2022);

  const isDashboard = false;

  const theme = useTheme();
  //get data
  const [data, setData] = useState([]);
  const [newData, setNewData] = useState([]);
  const [msg, setMsg] = useState('');

  const formatData =(data) => {
    const newData = [];
    // format data
    const countryFilterData = data.filter(function (el) {return countriesShow[el["id"]]["checked"]})

    countryFilterData.map(element => {
      const  newArray = element.data.filter(function (el) { return el["x"] >=startDate && el["x"] <= endDate});
      console.log(newArray);
      newData.push({...element, "data": newArray})
    });

    return newData;
  }

  const formatCountriesShowData = (arr) => {
    const result = {};
      arr.forEach((country, index)=>{
      result[country] = {"id": index, "checked": true };
    })
    console.log(result);
    return result;
  }

  console.log(endDate);
  
  useEffect(()=>{
    getData();
  
   
    // setYears([...new Set(data[0].data.map(a => a.x))].sort());
  }, [])

  useMemo(()=>{
    setNewData(formatData(data));
    
    console.log('useeffect2=>', data);
    console.log('useeffect=>', countriesShow);
  }, [startDate, endDate, view, data, countriesShow])

// rests filters
const resetFilters =() =>{
  setStartDate(2002);
  setEndDate(2022);
  setCountriesShow(formatCountriesShowData(countries));

}
  // const years =[2022,2020,2010];

  const getData = async () =>{
    
    try {
        const res = await axios.get(`/wbapi/datachart?code=${view}`);
        console.log('res=>',res.data);
        setData(res.data);
        setYears([...new Set(res.data[0].data.map(a => a.x))]);
        setCountries([...new Set(res.data.map(a => a.id))]);
        setCountriesShow(formatCountriesShowData([...new Set(res.data.map(a => a.id))]));
        // console.log('countr=>', formatCountriesShowData([...new Set(res.data.map(a => a.id))]));   
        // setData(formatData(res.data));

    }catch (err) {
        setMsg(err.response.data.msg);
        console.log(err.response.data.msg);
    }
  } 



  if (!data || data.length < 1) return <p>Loading...</p>;

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Education"
        subtitle="Compulsory education, duration (years)"
      />
     <Box dispaly="flex" justifyContent="flex-end" >
          
          <Box sx={{ display:"flex",
            justifyContent: "start",
            alignItems: "center",
            gap:"1rem"}} >
        <Button variant="contained" size="large" endIcon={<LoginIcon />} onClick={()=>{resetFilters()}}>Reset Filters</Button>
            <InputLabel>Start Date</InputLabel>
            <Select
              value={startDate}
              label="startDate"
              onChange={(e) => setStartDate(e.target.value)}
            > 
              {
                years.map((year)=> {return (<MenuItem value={year}>{year}</MenuItem>)})
              }
              
            </Select>
            <InputLabel>End Date</InputLabel>
            <Select
              value={endDate}
              label="endDate"
              onChange={(e) => setEndDate(e.target.value)}
            > 
              {
                years.map((year)=> {return (<MenuItem value={year}>{year}</MenuItem>)})
              }
              
            </Select>
      
            <Box height="10vh" sx={{ display:"flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "top",
              flexWrap: 'wrap'
              }}>
                        
              { countries.length > 0 && (
                countries.map((country)=> 
                 <div>
                <FormControlLabel
                  control={ <Checkbox 
                  checked={countriesShow[country].checked}
                  /> }
                  label={country}
                  onChange={()=>{setCountriesShow(
                    (prevState=>({
                      ...prevState,[country]:{...prevState[country], "checked":!prevState[country].checked}
                    }))
                  )}}
                />
                </div>
                )                
                )
              }
              
            </Box>
            
          </Box>
          
          
        </Box>
    
      <Box height="70vh">
        {/* <FormControl sx={{ mt: "1rem" }}> */}
          {/* <InputLabel>View</InputLabel>
          <Select
            value={view}
            label="View"
            onChange={(e) => setView(e.target.value)}
          >
            <MenuItem value="total_population">Total population</MenuItem>
            <MenuItem value="gdp_usd">GDP</MenuItem>
          </Select>
        </FormControl> */}
        
        {/* <YearlyChart view={view} startDate={startDate}  endDate={endDate} /> */}
        
          <ResponsiveLine
            data={newData}
            theme={{
              axis: {
                domain: {
                  line: {
                    stroke: theme.palette.secondary[200],
                  },  
                },
                legend: {
                  text: {
                    fill: theme.palette.secondary[200],
                  },
                },
                ticks: {
                  line: {
                    stroke: theme.palette.secondary[200],
                    strokeWidth: 1,
                  },
                  text: {
                    fill: theme.palette.secondary[200],
                  },
                },
              },
              legends: {
                text: {
                  fill: theme.palette.secondary[200],
                },
              },
              tooltip: {
                container: {
                  color: theme.palette.primary.main,
                },
              },
            }}
            margin={{ top: 20, right: 50, bottom: 50, left: 70 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            yFormat=" >-.2f"
            curve="catmullRom"
            enableArea={isDashboard}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              format: (v) => {
                if (isDashboard) return v.slice(0, 3);
                return v;
              },
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: isDashboard ? "" : "Year",
              legendOffset: 36,
              legendPosition: "middle",
            }}
            axisLeft={{
              orient: "left",
              tickValues: 5,
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: isDashboard
                ? ""
                : "",//`Total ${view === "sales" ? "Revenue" : "Units"} for Year`,
              legendOffset: -60,
              legendPosition: "middle",
            }}
            enableGridX={false}
            enableGridY={false}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={
              !isDashboard
                ? [
                    {
                      anchor: "bottom-right",
                      direction: "column",
                      justify: false,
                      translateX: 80,
                      translateY: -40,
                      itemsSpacing: 0,
                      itemDirection: "left-to-right",
                      itemWidth: 80,
                      itemHeight: 20,
                      itemOpacity: 0.75,
                      symbolSize: 12,
                      symbolShape: "circle",
                      symbolBorderColor: "rgba(0, 0, 0, .5)",
                      effects: [
                        {
                          on: "hover",
                          style: {
                            itemBackground: "rgba(0, 0, 0, .03)",
                            itemOpacity: 1,
                          },
                        },
                      ],
                    },
                  ]
                : undefined
            }
          />
  
      </Box>
    </Box>
  );
};


export default Education;