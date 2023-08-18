import { useContext, useEffect, useState }  from "react";
import { AppContext } from "App";
import { Alert, Grid, Link ,Avatar, TextField, Box, FormControlLabel, Checkbox, Button, Typography, useTheme } from "@mui/material";
import Header from "components/Header";
import Auth from "auth/Auth";
import Container from '@mui/material/Container';
import jwt_token from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';

import axios from "axios";

const Profile = (props) => {
    
    const [msg, setMsg] = useState("");
    const { isLogin, setIsLogin, isDeveloper, setIsDeveloper, userinfo, setUserInfo, reports, setReports, setToken } = useContext(AppContext);
    const [id, setId] = useState(userinfo? userinfo.user_id : null);
    const { token } = useContext(AppContext);
    const [name, setName] = useState(userinfo? userinfo.name : null);
    const [email, setEmail] = useState(userinfo? userinfo.email : null);
    const [profileIsDeveloper, setProfileIsDeveloper]= useState(isDeveloper? isDeveloper : false);
    const [password, setPassword] = useState("");
    const [isDeleteAlert, setIsDeleteAlert] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    //web page title for browser
    const title = props.title;
    useEffect(() => {
      document.title = title;
    },[]);
// get info
    //theme
    const theme = useTheme();
  
    const navigate = useNavigate();
    
    const getUserInfoById = async (id) => {
 
    console.log("Button get info by id")
    // -> request by id
      try {
          const res = await axios.get(`/users/user/${id}`);
          if (res.status === 200) {
              console.log(res.data);
              setName(res.data.name);
              setProfileIsDeveloper(res.data.isdeveloper);
              setMsg("");
          
          }
      } catch (err) {
      console.log(err);
      setMsg(err.response.data.msg); // to show in the same part
      }
    }
    
    const handleClick = async (event) => {
        event.preventDefault();
       
        console.log("Button update");
        try {
            const res = await axios.put(`/users/user/${id}`, {name, isdeveloper: profileIsDeveloper});
            if (res.status === 200) {
                console.log(res.data);
                // setName(res.data.name);
                // setProfileIsDeveloper(res.data.isdeveloper);
                // setMsg("");
            
            }
        } catch (err) {
        console.log(err);
        setMsg(err.response.data.msg); // to show in the same part
        }
    }


    const deleteUserProfile = async (event) => {
        // event.preventDefault();
        console.log("Button delete");
        setIsDeleteAlert(true);
        if (confirmDelete && password?.length>1) {
            console.log("delete start");
            // -> Login
            try {
                const res = await axios.post(`/users/user/deleteprofile`, { email, password });
                if (res.status === 200) {
                    console.log(res.data);
                   
                    // // clear and exit
                    setToken(null);
                    setIsLogin(false);
                    setUserInfo({});
                    setIsDeveloper(false);
                    // delete from local storage
                    localStorage.removeItem('refreshToken');
                    navigate("/");
                    
                }
            } catch (err) {
            console.log(err);
            setMsg(err.response.data.msg); // to show in the same part
            }
        } else { return}
   
    }





    useEffect(()=>{
        // if (token) {
        //     const payload = jwt_token(token);
        //     console.log("payload=>", payload);
        //     setEmail(payload.userinfo.email);
        //     setId(payload.userinfo.user_id);
        console.log("useEffect")
        // }
    },[]);



    return(
        <Box m="1.5rem 2.5rem">
            <Header title="PROFILE" subtitle="Information" />
            <Typography>
                {msg}
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={()=>{getUserInfoById(id)}}
            >
              Update Profile info from DB
            </Button>
            <Box
          sx={{
            marginTop: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: 450,
                px: 2,
                py: 1,
                width: '100%'
          }}
        >
           <Typography component="p" variant="h6">
            {msg}
          </Typography>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          {/* <Grid container spacing={2}>
            <Grid item xs={12}> */}
                <Typography>
                    User ID: {id}
                </Typography> 
            {/* </Grid>
            <Grid item xs={12}> */}
                <Typography>
                    E-mail: {email}
                </Typography> 
            {/* </Grid>
          </Grid> */}
          {/* Change name */}
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOpenOutlinedIcon />
          </Avatar>
          <Typography variant="h5">
            Change Name and Role
          </Typography>
          { email != "demo@demo.com" ? (
           <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange ={(e) => setName(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
               
                <FormControlLabel onChange ={(e) => setProfileIsDeveloper(!profileIsDeveloper)}
                  control={
                <Checkbox value="on" checked={profileIsDeveloper} color="primary" />}
                  label="I am developer"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleClick}
            >
              Save changes
            </Button>
            
          </Box>     
          )
        : (
          <Typography>
                Register to use this functions
          </Typography> 
        )
        }
           {/* Delete user */}
           <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOpenOutlinedIcon />
          </Avatar>
           <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              
             
              
              <Grid item xs={12}>
                <Typography variant="h5">
                  Delete account  
                </Typography>
              </Grid>
            </Grid>
            { isDeleteAlert && (
            
            <Grid item xs={12}>
               <Alert severity="warning">This is a warning alert — check it out!</Alert>
                <FormControlLabel onChange ={(e) => {setConfirmDelete(!confirmDelete)}}
                  control={
                <Checkbox value="on" checked={confirmDelete}  />}
                  label="I would like to delete account"
                />
                 {/* <Grid item xs={12}> */}
                <TextField
                  fullWidth
                  id="password"
                  label="password"
                  name="password"
                  required={true}
                  value={password}
                  autoComplete='off'
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
            {email != "demo@demo.com" ? (
            <Button
              
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={()=>deleteUserProfile()}
            >
              Delete account
            </Button>
            ) : (
              <Typography>
                    Register to use this functions
              </Typography> 
            )
          }
          </Box>          

        </Box>
      
                
          
        </Box>
    )
}

export default Profile;