import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { AppContext } from "../App";
import { useState } from "react";
import axios from "axios";

const Register = (props) => {
  const [name, setName] = useState("");
  const [isdeveloper, setIsDeveloper] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  
    //theme
  const theme = useTheme();

  const navigate = useNavigate();
  const handleClick = async (event) => {
      event.preventDefault();
      // -> Register
        try {
            const res = await axios.post(`/users/register`, { name, email, password, isdeveloper });
            if (res.status === 200) {
                console.log(res.data);
                // setToken(res.data.token);
                setMsg("");
                navigate("/login"); //to Home
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
            Register
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="name"
                  onChange ={(e) => setName(e.target.value)}
                />
              </Grid>
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
              <Grid item xs={12}>
                <FormControlLabel onChange ={(e) => setIsDeveloper(!isdeveloper)}
                  control={<Checkbox value="isdeveloper" color="primary" />}
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
              Register
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link  sx={{color:theme.palette.secondary[200]}} variant="body2" onClick={()=>{ navigate("/login")}}>
                  Already have an account? Login
                </Link>
              </Grid>
            </Grid>
          </Box>          
        </Box>
      
  );
}

export default  Register;