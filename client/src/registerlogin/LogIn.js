import * as React from 'react';
import { useState, useContext } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import { AppContext } from "../App";
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';

const LogIn = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const {setToken} = useContext(AppContext);
  const {setRefreshToken} =  useContext(AppContext);
  const { isLogin, setIsLogin } = useContext(AppContext);
  
  //theme
  const theme = useTheme();

  const navigate = useNavigate();
  const location = useLocation();
  const handleClick = async (e) => {
    e.preventDefault();
    // -> Login
      try {
          const res = await axios.post(`/users/login`, { email, password });
          if (res.status === 200) {
              console.log(res.data);
              // store refresh token to local storage
              // localStorage.setItem('refreshToken', res.data.refreshToken);
              
              setToken(res.data.token);
              setMsg("");
              setIsLogin(true);
              const origin = location.state?.from?.pathname || '/';
              console.log("origin=>", origin)
              navigate(origin); //to origin or dashboard
          }
      } catch (err) {
      console.log(err);
      setMsg(err.response.data.msg); // to show in the same part
      }
}



  return (
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
          <Typography component="h1" variant="h5">
            Login
          </Typography>
       

          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange ={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange ={(e) => setPassword(e.target.value)}
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
              Login
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link  sx={{color:theme.palette.secondary[200]}} variant="body3" onClick={()=>{ navigate("/register")}}>
                  Don't have an account? Register
                </Link>
              </Grid>
            </Grid>
          </Box> 
          <Button
            variant="contained"
            sx={{ mt: 5, mb: 2 }}
            onClick={()=>{console.log("Demo")}}
            >
              Demo
            </Button> 
               
        </Box>

  );
}

export default LogIn;