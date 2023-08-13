import React, { useMemo } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { useContext, useEffect, useState }  from "react";
import { AppContext } from "App";
import axios from "axios";

const PopulationChart = ({ isDashboard = false, view }) => {
  const theme = useTheme();
  //get data
  const [data, setData] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(()=>{
    getData();
      console.log('res=>', data);
  }, [view])


  const getData = async () =>{
    
    try {
        const res = await axios.get(`/wbapi/datachart?code=${view}`);
        console.log('res=>',res.data);
        setData(res.data);
      
    }catch (err) {
        setMsg(err.response.data.msg);
        console.log(err.response.data.msg);
    }
  } 

  // const [totalSalesLine, totalUnitsLine] = useMemo(() => {
  //   if (!data) return [];

  //   const { monthlyData } = data;
    
  //   const totalSalesLine = {
  //     id: "totalSales",
  //     color: theme.palette.secondary.main,
  //     data: [],
  //   };
  //   const totalUnitsLine = {
  //     id: "totalUnits",
  //     color: theme.palette.secondary[600],
  //     data: [],
  //   };

  //   Object.values(monthlyData).reduce(
  //     (acc, { month, totalSales, totalUnits }) => {
  //       const curSales = acc.sales + totalSales;
  //       const curUnits = acc.units + totalUnits;

  //       totalSalesLine.data = [
  //         ...totalSalesLine.data,
  //         { x: month, y: curSales },
  //       ];
  //       totalUnitsLine.data = [
  //         ...totalUnitsLine.data,
  //         { x: month, y: curUnits },
  //       ];

  //       return { sales: curSales, units: curUnits };
  //     },
  //     { sales: 0, units: 0 }
  //   );

  //   return [[totalSalesLine], [totalUnitsLine]];
  // }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!data || data.length < 1) return <p>Loading...</p>;

  return ( //<p>{view}</p>
//   <ResponsiveLine
//   data={data}
//   margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
//   xScale={{ type: 'point' }}
//   yScale={{
//       type: 'linear',
//       min: 'auto',
//       max: 'auto',
//       stacked: true,
//       reverse: false
//   }}
//   yFormat=" >-.2f"
//   axisTop={null}
//   axisRight={null}
//   axisBottom={{
//       tickSize: 5,
//       tickPadding: 5,
//       tickRotation: 0,
//       legend: 'transportation',
//       legendOffset: 36,
//       legendPosition: 'middle'
//   }}
//   axisLeft={{
//       tickSize: 5,
//       tickPadding: 5,
//       tickRotation: 0,
//       legend: 'count',
//       legendOffset: -40,
//       legendPosition: 'middle'
//   }}
//   pointSize={10}
//   pointColor={{ theme: 'background' }}
//   pointBorderWidth={2}
//   pointBorderColor={{ from: 'serieColor' }}
//   pointLabelYOffset={-12}
//   useMesh={true}
//   legends={[
//       {
//           anchor: 'bottom-right',
//           direction: 'column',
//           justify: false,
//           translateX: 100,
//           translateY: 0,
//           itemsSpacing: 0,
//           itemDirection: 'left-to-right',
//           itemWidth: 80,
//           itemHeight: 20,
//           itemOpacity: 0.75,
//           symbolSize: 12,
//           symbolShape: 'circle',
//           symbolBorderColor: 'rgba(0, 0, 0, .5)',
//           effects: [
//               {
//                   on: 'hover',
//                   style: {
//                       itemBackground: 'rgba(0, 0, 0, .03)',
//                       itemOpacity: 1
//                   }
//               }
//           ]
//       }
//   ]}
// />
    <ResponsiveLine
      data={data}
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
      margin={{ top: 20, right: 100, bottom: 50, left: 100 }}
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
        legendOffset: -70,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={3}
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
                translateX: 100,
                translateY: -40,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 10,
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
  );
};

export default PopulationChart;