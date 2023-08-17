import { useState, useContext, useEffect } from "react";


import LogIn from 'registerlogin/LogIn'; //New version

import ChartDemo from 'components/ChartDemo';
import FlexBetween from 'components/FlexBetween';
//MUI
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useTheme } from '@mui/material';

const LoginFine = (props) => {
   
   const theme = useTheme();
   
   //web page title for browser
   const title = props.title;
   useEffect(() => {
    document.title = title;
    }, []);

    
    return(
    <>
        <Grid container component="main" sx={{ height: '85vh' }} >
            <CssBaseline />
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                display="flex" justifyContent="center" alignItems="center"
                sx={{
                backgroundColor: theme.palette.secondary[900],
                }}
            >
            <FlexBetween sx={{ display: { xs: 'none', md: 'flex'  }}}>
                <ChartDemo />
             </FlexBetween>
       
            
            </Grid> 
            <Grid item xs={12} sm={8} md={5}  elevation={6} square="true" display="flex" justifyContent="center" alignItems="center" >
                <LogIn />
            </Grid>   
        </Grid>
    </>
    )
}

export default LoginFine;