import React, { useMemo } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { useContext, useEffect, useState }  from "react";
import { AppContext } from "App";
import axios from "axios";
import { IconButton, useTheme, InputBase, Button, Box, Typography, Menu, MenuItem} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

const YearlyChart = ({ isDashboard = false, view, startDate, endDate }) => {
  const theme = useTheme();
  //get data
  const [data, setData] = useState([]);
  const [msg, setMsg] = useState('');
  const [formattedData, setFormatedData] = useState([]);

  const formatData =(data) => {
    const newData = [];
    // format data
    data.forEach(element => {
      const  newArray = element.data.filter(function (el) { return el["y"] >=startDate && el["y"] <= endDate});
      console.log(newArray);
      newData.push({...element, "data": newArray})
    });

    return newData;
  }


  console.log(endDate);
  useEffect(()=>{
    getData();
    console.log('res=>', data);
  }, [])




  const getData = async () =>{
    
    try {
        const res = await axios.get(`/wbapi/datachart?code=${view}`);
        console.log('res=>',res.data);
        setData(formatData(res.data));
        
      
    }catch (err) {
        setMsg(err.response.data.msg);
        console.log(err.response.data.msg);
    }
  } 



  if (!data || data.length < 1) return <p>Loading...</p>;

  return ( //<p>{view}</p>
    <Box>
    
    <ResponsiveLine
      data={formattedData}
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
  );
};

export default YearlyChart;