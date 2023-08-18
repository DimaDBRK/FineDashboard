import React from 'react'
import { Box, Button, Typography, useTheme } from "@mui/material";
import { Alert, Grid, Link ,Avatar, TextField,  FormControlLabel, Checkbox } from "@mui/material";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid"
import { useContext, useEffect, useState }  from "react";
import axios from "axios";
import FlexBetween from 'components/FlexBetween';
import { AppContext } from "App";
import { useNavigate } from 'react-router-dom';

// Dialog
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// end dialog

const Users = (props) => {
  const theme = useTheme();
  const navigate = useNavigate();

  //get data
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState('');
  const { isLogin, setIsLogin, isDeveloper, setIsDeveloper, userinfo, setUserInfo, reports, setReports, setToken } = useContext(AppContext);
  const [id, setId] = useState(null);

  // confirm delete
  const [email, setEmail] = useState(userinfo? userinfo.email : null);
  const [password, setPassword] = useState("");
  const [isDeleteAlert, setIsDeleteAlert] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  //web page title for browser
  const title = props.title;
  useEffect(() => {
    document.title = title;
  },[]);
// get info
  // dialog
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = (id) => {
    setOpen(true);
    setId(id);
  };
  const handleClose = () => {
    setOpen(false);
    setId(null);
    setIsDeleteAlert(false);
    setConfirmDelete(false);
    setPassword("");
    setMsg("");
  };
//   delete token deleteUsersRefreshToken
  const deleteUsersRefreshToken = async (event) => {
    // event.preventDefault();
    console.log("Button delete");
    setIsDeleteAlert(true);
    if (confirmDelete && password?.length>1 && id) {
        console.log("delete start");
        // -> Login
        try {
            const res = await axios.post(`/users/user/deleterefreshtoken`, { email, password, id });
            if (res.status === 200) {
                console.log(res.data);
                setMsg(res.data.msg);
                         
         
                
            }
        } catch (err) {
        console.log(err);
        setMsg(err.response.data.msg || err.message); // to show in the same part
        }
    } else { return}
  }

  
  
  
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
      renderCell: (params) => {
        return (params.value != userinfo?.user_id)? (
      <Button variant="outlined" color="warning" size="small" onClick={()=>{console.log(params.value); handleClickOpen(params.value)}}>{params.value}</Button>
        )
      : <Button variant="outlined" color="success" size="small" onClick={()=>{navigate("/profile")}}> Me: {params.value} </Button>
      }
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
        {/* Dialog */}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">

            {`User ID: ${id} profile management`}
            
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Delete in DB refresh tokens for this user:
            </DialogContentText>
            <Typography>
              {msg}
            </Typography>
            {/* Confirm delete */}
            { isDeleteAlert && (
            
            <Grid item xs={12}>
               <Alert severity="warning">This is a warning alert — check it out!</Alert>
                <FormControlLabel onChange ={(e) => {setConfirmDelete(!confirmDelete)}}
                  control={
                <Checkbox value="on" checked={confirmDelete}  />}
                  label="I would like to delete refresh token for this user"
                />
                 {/* <Grid item xs={12}> */}
                <TextField
                  fullWidth
                  id="password"
                  label="password"
                  name="password"
                  autoComplete='off'
                  required={true}
                  value={password}
                  onChange ={(e) => setPassword(e.target.value)}
                />
              {/* </Grid> */}
                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={()=>{setConfirmDelete(false); setPassword(""); setIsDeleteAlert(false)}}
                    >
             Cancel
            </Button>
              </Grid>
            )}
            {/* End confirm */}
            <Button variant="outlined" color="warning" size="small" onClick={()=>{deleteUsersRefreshToken()}}>
             Delete Token
            </Button>
            {/* <DialogContentText id="alert-dialog-description">
              Delete User Profile:
            </DialogContentText>
            <Button variant="outlined" color="warning" size="small" onClick={()=>{handleClose()}}>
             Delete Profile
            </Button> */}
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="secondary" size="small" onClick={()=>{handleClose()}}>Close</Button>
           
          </DialogActions>
        </Dialog>
        {/* end Dialog */}
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