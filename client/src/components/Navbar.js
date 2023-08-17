import React, { useState, useContext} from 'react';
import { 
    LightModeOutlined, 
    DarkModeOutlined, 
    Menu as MenuIcon, 
    Search, 
    SettingsOutlined, 
    ArrowDropDownOutlined,
    ConstructionOutlined,
   
} from '@mui/icons-material';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import FlexBetween from 'components/FlexBetween';
import { useDispatch } from 'react-redux';
import { setMode } from "state";
import { AppBar, IconButton, Toolbar, useTheme, InputBase, Button, Box, Typography, Menu, MenuItem} from '@mui/material';
import { Link, Navigate } from "react-router-dom";
// import profileImage from "asset/profile.jpg"
import { AppContext } from "App";
import { useNavigate } from "react-router-dom";
import jwt_token from 'jwt-decode';
import axios from "axios";
import MenuOpenOutlinedIcon from '@mui/icons-material/MenuOpenOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';

import { logoutClearInfo } from 'helpers/logoutClearInfo';

const Navbar = ({
    user,
    isSidebarOpen,
    setIsSidebarOpen,

}) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    // status
    const { isLogin, setIsLogin, isDeveloper, setIsDeveloper, userinfo, setUserInfo, reports, setReports } = useContext(AppContext);
    //right button user info
    const [anchorEl, setAnchorEl] = useState(null);
    const isOpen = Boolean(anchorEl);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const imageLink = `https://robohash.org/${userinfo.name}`
    
//  App logic
    const { token, setToken } = useContext(AppContext);
  
    const navigate = useNavigate();

    const logout = async () => {
        try {
            const res = await axios.post(`/users/logout`, {user_id: userinfo.user_id, refreshToken: ""});
            if (res.status === 200) {
            setToken(null);
            setIsLogin(false);
            setUserInfo({});
            setIsDeveloper(false);
            // delete from local storage
            localStorage.removeItem('refreshToken');
            navigate("/");
            }
        } catch(e) {
            console.log(e);
        }
    }



  return (
    <AppBar sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
    }}> 
        <Toolbar sx={{ justifyContent: "space-between"}}>
            {/* Left block */}
            <FlexBetween>
             
                {/* Logo if not login */}
                {!isLogin &&(
                <FlexBetween >
                    <Box display="flex" alignItems="center" gap="0.5rem">
                        <Typography variant="h4" fontWeight="bold" color={theme.palette.secondary.main} onClick={()=>{ navigate("/")}}>
                            Fine Dashboard
                        </Typography>
                    </Box>
                </FlexBetween>
                )}
     
        
                {/* Logo if no side bar */}
                {!isSidebarOpen &&(
                <FlexBetween >
                    <Box display="flex" alignItems="center" gap="0.5rem">
                        <Typography variant="h4" fontWeight="bold" color={theme.palette.secondary.main} onClick={()=>{ navigate("/")}}>
                            FD
                        </Typography>
                    </Box>
                </FlexBetween>
                )}
                {isLogin && (
                <IconButton onClick={()=>{setIsSidebarOpen(!isSidebarOpen)}}>
                    <MenuOpenOutlinedIcon />
                </IconButton>
                )}

                {/* is Login */}
                {false && (
                        <Button  variant="h4" sx={{ my: 2, display: 'block' }} component={Link} to='/developer' > 
                            Developer
                        </Button>
                    )}  
                  {/* settings icon */}
                  {isLogin && (
                <IconButton>
                    <DashboardOutlinedIcon sx={{ fontSize: "25px" }} onClick={()=>{navigate("/dashboard")}}/>
                </IconButton>
                )}            
            </FlexBetween>
         {/* Right block */}
            <FlexBetween>
                
                {/* Search */}
                {false && (
                <FlexBetween
                        backgroundColor={theme.palette.background.alt}
                        borderRadius="9px"
                        gap="3rem"
                        p="0.1rem 1.5rem"
                    >
                    <InputBase placeholder="Search..." />
                    <IconButton>
                        <Search />
                    </IconButton>
                </FlexBetween>
                )}
                <IconButton onClick={()=>dispatch(setMode())}>
                    {theme.palette.mode === 'dark' ? (
                        <DarkModeOutlined sx={{ fontSize: "25px" }}/>
                    ): (
                        <LightModeOutlined sx={{ fontSize: "25px" }}/> 
                    )}
                </IconButton>
              
            {/* user info box */}
                <FlexBetween>
               
                    <Button
                    onClick={handleClick}
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        textTransform: "none",
                        gap: "1rem",
                    }}
                    >
                    {isLogin && (
                        <Box textAlign="left">
                            <Typography
                                fontWeight="bold"
                                fontSize="0.85rem"
                                sx={{ color: theme.palette.secondary[100] }}
                            >
                                { user }
                            </Typography>
                            <Typography
                                fontSize="0.75rem"
                                sx={{ color: theme.palette.secondary[200] }}
                            >
                                {userinfo.isdeveloper? "developer" : "user"}
                            </Typography>
                        </Box>
                        )}
                        {isLogin && (
                        <Box
                            component="img"
                            alt="profile"
                            src={imageLink}
                            height="32px"
                            width="32px"
                            borderRadius="50%"
                            sx={{ objectFit: "cover",   backgroundColor: theme.palette.secondary[200] }}
                            />
                        )}
                        <ArrowDropDownOutlined
                            sx={{ color: theme.palette.secondary[300], fontSize: "25px" }}
                        />
                        
                    </Button>
                    <Menu
                    anchorEl={anchorEl}
                    open={isOpen}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    >
                        <MenuItem onClick={()=>{handleClose(); logout()}}>Log Out</MenuItem>
                        {isLogin && <MenuItem onClick={()=>{handleClose(); navigate("/profile")}}>Profile</MenuItem>}
                    </Menu>
                </FlexBetween>
                {/* end user info box */}
            </FlexBetween>
        </Toolbar>
    </AppBar>
  )
}

export default Navbar;