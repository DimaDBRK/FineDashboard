import React from 'react'
import { Box, Button, Typography, useTheme } from "@mui/material";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid"
import { useState, useEffect } from "react";
import axios from "axios";
import FlexBetween from 'components/FlexBetween';
const Users = () => {
  const theme = useTheme();
  
  //get data
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(()=>{
      getUsers();
      console.log('res=>',users);
  }, [])

  const getUsers = async () =>{
     
      try {
          const res = await axios.get(`/users/users`);
          console.log('res=>',res.data);
          setUsers(res.data);
         
      }catch (err) {
          setMsg(err.response.data.msg);
          console.log(err.response.data.msg);
      }
  }

  //start 
  const columns = [
    {
      field: "user_id",
      headerName: "ID",
      flex: 0.3,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "isdeveloper",
      headerName: "Role",
      flex: 0.5,
      renderCell: (params) => {
        return (
          <FlexBetween gap="10px">
          {params.value? <p>Developer</p> : <p>User</p>}
          <Button variant="outlined" color="warning" size="small" >Edit</Button>
         
          </FlexBetween>)
      }

    },
  
  ]
 
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="USERS" subtitle="List of Users" />
      <Typography>
        {msg}
      </Typography>
      <Box
        mt="40px"
        height="75vh"
        >
        <DataGrid
          loading={users.length < 1}
          getRowId={(row) => row.user_id}
          rows={users || []}
          columns={columns}
        />

        

      </Box>
    </Box>
   
  )
}

export default Users;