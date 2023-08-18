import React from "react";
import { useTheme } from "@mui/material";
import Header from "components/Header";
import { ResponsiveLine } from "@nivo/line";
import { useContext, useEffect, useState, useMemo }  from "react";
import { AppContext } from "App";
import { Typography, FormControl, MenuItem, InputLabel, Box, Button, Select, Checkbox, FormControlLabel } from "@mui/material";
import axios from "axios";
import FlexBetween from 'components/FlexBetween';


import LoginIcon from '@mui/icons-material/Login';


const Live = () => {
  const isDashboard = false;
  const theme = useTheme();
  //get data
  const [data, setData] = useState([]);
  const [newData, setNewData] = useState([]);
  const [msg, setMsg] = useState('');

  const [intervalId, setIntervalId] = useState(false);
  const [isServerCorn, setIsServerCorn] = useState(false);

  const handleClick = () => {
    console.log("click", intervalId)
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(false);
      return;
    }

    const newIntervalId = setInterval(() => {
     console.log("update");
     getData();
    }, 3000);
    setIntervalId(newIntervalId);
    
  };

  const serverCornJob = async (command) => {
    try {
      const res = await axios.post(`/wbapi/cornjobdata`, {"command":command});
      console.log('res=>',res.data);
      setMsg(res.data.msg);
      if (command !="clear") {
        setIsServerCorn(!isServerCorn);
        // timer to stop
        setTimeout(function(){
          console.log("corn job stop");
          setIsServerCorn(false);
          setMsg("");
        }, 60000);
    }
  } catch (err) {
      setMsg(err.response.data.msg);
      console.log(err.response.data.msg);
  }
    
  

  }

  useEffect(()=>{
    getData();
  }, [])



  
 
  const getData = async () =>{
    try {
        const res = await axios.get(`/wbapi/cornjobdata?code=livedata`);
        console.log('res=>',res.data);
        setData(res.data);
        setNewData([{
          "id": "ETHBTC",
          "color": "hsl(98, 70%, 50%)",
          "data": res.data
          }
        ]);
        
    } catch (err) {
        setMsg(err.response.data.msg);
        console.log(err.response.data.msg);
    }
  } 




  if (!data) return <p>Loading...</p>;

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="LIVE DATA"
        subtitle="Ethereum / Bitcoin - binance.com ETHBTC quoteVolume"
      />
      <Typography component="p" variant="h6">
            {msg}
      </Typography>
     <Box dispaly="flex" justifyContent="flex-end" >
          
      <Box sx={{ display:"flex",
        justifyContent: "start",
        alignItems: "center",
        gap:"1rem"}} >
        { !isServerCorn? 
        (<>
          <Button color="success" variant="contained" size="small" endIcon={<LoginIcon />} onClick={()=>{serverCornJob("start")}}>Start server - Corn Job</Button>
          <Button color="error" variant="contained" size="small" endIcon={<LoginIcon />} onClick={()=>{serverCornJob("clear")}}>Clear data in DB table</Button>
        </>
        ) 
        :(<Button color="error" variant="contained" size="small" endIcon={<LoginIcon />} onClick={()=>{serverCornJob("stop")}}>Stop server - Corn Job</Button>)}
           
        <Button variant="contained" size="large" endIcon={<LoginIcon />} onClick={()=>{handleClick()}}>{intervalId? "STOP": "START"} Live Data update</Button>
      </Box>
    </Box>
    
    <Box height="70vh">
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
              legend: isDashboard ? "" : "Time",
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


export default Live;