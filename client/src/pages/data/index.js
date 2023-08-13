import React from 'react'
import { Box, Button, Typography, useTheme } from "@mui/material";
import Header from "components/Header";
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { useState, useEffect } from "react";
import axios from "axios";
import FlexBetween from 'components/FlexBetween';

const Data = () => {
  const theme = useTheme();
  
  //get data
  const [data, setData] = useState([]);
  const [msg, setMsg] = useState('');

  //values for request
   const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10,
  });
  // const [rows, setRows] = React.useState<GridRowsProp>([]);

  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");

  useEffect(()=>{
      getUsers();
      console.log('res=>',data);
  }, [paginationModel, search, sort])

  const getUsers = async () =>{
     
      try {
          const res = await axios.get(`/wbapi/datapages?page=${paginationModel.page}&pageSize=${paginationModel.pageSize}&sort=${JSON.stringify(sort)}&search=${search}`);
          console.log('res=>',res.data);
          setData(res.data);
         
      }catch (err) {
          setMsg(err.response.data.msg);
          console.log(err.response.data.msg);
      }
  }

  //start 
  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.3,
    },
    {
      field: "total_population",
      headerName: "total_population",
      flex: 0.5,
    },
    {
      field: "birth_rate",
      headerName: "birth_rate",
      flex: 0.3,
    },
    {
      field: "death_rate",
      headerName: "death_rate",
      flex: 0.3,
    },
    {
      field: "compulsory_education",
      headerName: "compulsory_education",
      flex: 0.3,
    },
    {
      field: "employment_industry",
      headerName: "employment_industry",
      flex: 0.3,
    },
    {
      field: "employment_agriculture",
      headerName: "employment_agriculture",
      flex: 0.3,
    },
    {
      field: "unemployment",
      headerName: "unemployment",
      flex: 0.3,
    },
    {
      field: "gdp_usd",
      headerName: "gdp_usd",
      flex: 0.3,
    },
    {
      field: "national_income_capita",
      headerName: "national_income_capita",
      flex: 0.3,
    },
    {
      field: "net_income_abroad",
      headerName: "net_income_abroad",
      flex: 0.3,
    },
    {
      field: "agriculture_value",
      headerName: "agriculture_value",
      flex: 0.3,
    },
    {
      field: "electric_power_consumption_capita",
      headerName: "electric_power_consumption_capita",
      flex: 0.3,
    },
    {
      field: "renewable_energy_consumption",
      headerName: "renewable_energy_consumption",
      flex: 0.3,
    },
    {
      field: "fossil_fuel_consumption",
      headerName: "fossil_fuel_consumption",
      flex: 0.3,
    },
    {
      field: "year",
      headerName: "year",
      flex: 0.3,
    },
    {
      field: "country",
      headerName: "country",
      flex: 0.5,
    },





  
  ]
 
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Data Countries Info" subtitle="Server side pagination" />
      <Typography>
        {msg}
      </Typography>
      <Box
        mt="40px"
        height="75vh"
        width="250gh"
        >
        <DataGrid
          loading={data.length < 1}
          getRowId={(row) => row.id}
          rows={data.data || []}
          rowCount={data.total || 0}
          columns={columns}
          pageSizeOptions={[10, 50, 100]}
          pagination
          page={paginationModel.page}
          pageSize={paginationModel.pageSize}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          slots={{ toolbar: GridToolbar }}
      
         
        />

        

      </Box>
    </Box>
   
  )
}

export default Data;