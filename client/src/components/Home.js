
import SignUp from '../registerlogin/Register';
import { useState, useContext, useEffect,  } from 'react';
//MUI
import DashboardIcon from '@mui/icons-material/Dashboard';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import LoginIcon from '@mui/icons-material/Login';
import { Link } from "react-router-dom";
import { AppContext } from "../App";
import { useTheme } from '@mui/material'

const Home = (props) => {
    const { token, setToken } = useContext(AppContext);
    const { isLogin, setIsLogin } = useContext(AppContext);
    //theme
    const theme = useTheme();
    return(
        <main>
        {/* Hero unit */}
        <Box
          sx={{
            pt: 8,
            pb: 6,
          }}
        >
            <Container maxWidth="md">
                <Typography
                component="h1"
                variant="h2"
                align="center"
                gutterBottom
                >
                    What is Fine Dashboard?      
                </Typography>
                <Typography variant="h5" align="center"  paragraph>
                    Fine Dashboard is a visual analytics application transforming the way we use data
                    to solve problems — empowering people and organizations to make the most of their data.
                </Typography>
                <Stack
                    sx={{ pt: 4 }}
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                >
                    {!isLogin ?     
                    <Button variant="contained" color="secondary" size="large" endIcon={<LoginIcon />} component={Link} to='/login'>Login</Button>
                    : <Button variant="contained" color="secondary" size="large" endIcon={<DashboardIcon />} component={Link} to='/dashboard'>Dashboard</Button>
                    }
                    </Stack>
            </Container>
            <Container maxWidth="md">
                <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
                >
                    Fine Dashboard helps people drive change with data      
                </Typography>
                <Typography variant="h5" align="center" color="text.secondary" paragraph>
                    Everything we do is driven by our mission to help people see and understand data, 
                    which is why our products are designed to put the user first—whether they’re an analyst, 
                    data scientist, student, teacher, executive, or business user. 
                    
                </Typography>
                {!isLogin && (   
                <Stack
                    sx={{ pt: 4 }}
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                >
                    {/* <Button variant="contained" color="secondary" size="large">Demo</Button> */}
                    <Button variant="contained"  size="large" endIcon={<LoginIcon />} component={Link} to='/register'>Register</Button>
                </Stack>
                )}
            </Container>
        </Box>
        
     
        
           
        </main>
    )
}

export default Home;