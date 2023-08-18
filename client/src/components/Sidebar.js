import React from 'react';
import {
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    useTheme
} from "@mui/material";
import {
   
    ChevronLeft,
    ChevronRightOutlined,
  
    Groups2Outlined,
 
    PublicOutlined,
 

 
    
} from "@mui/icons-material"
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import TableViewOutlinedIcon from '@mui/icons-material/TableViewOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import DonutSmallOutlinedIcon from '@mui/icons-material/DonutSmallOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import MiscellaneousServicesOutlinedIcon from '@mui/icons-material/MiscellaneousServicesOutlined';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';

import { useEffect, useState, useContext} from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from 'components/FlexBetween';
import { AppContext } from "App";
import axios from "axios";

// import profileImage from "assets/profile.jpeg";

//Items of Left side Menu

const sideIcons ={
    "Data": <TableViewOutlinedIcon />,
    "Geography": <PublicOutlined />,
    "Population": <InsightsOutlinedIcon />,
    "Yearly": <InsightsOutlinedIcon />,
    "Birth": <DonutSmallOutlinedIcon />,
    "Education": <InsightsOutlinedIcon />,
    "Live": <UpdateOutlinedIcon />,

}




const navDeveloper = [
    {
        text: "Users",
        icon: <Groups2Outlined />,
        link: ""
    },
    {
        text: "Developer",
        icon: <MiscellaneousServicesOutlinedIcon/>,
        link: ""
    },
]

const navSettings = [
    {
        text: "Reports",
        icon: <TuneOutlinedIcon />,
        link: ""
    },
    {
        text: "Profile",
        icon: <ManageAccountsOutlinedIcon/>,
        link: ""
    },
]

const Sidebar = ({
    
    drawerWidth,
    isSidebarOpen,
    setIsSidebarOpen,
    isNonMobile,
}) => {
    const { pathname } = useLocation();
    const [active, setActive] = useState("");
    const navigate = useNavigate();
    const theme = useTheme();
    // status
    const { isLogin, setIsLogin, isDeveloper, setIsDeveloper, userinfo, setUserInfo, reports, setReports } = useContext(AppContext);
    const [msg, setMsg] = useState('');
    const [navReports, setNavReports] = useState([]);

    useEffect(()=>{
        setActive(pathname.substring(1));
    }, [pathname]);

    useEffect(()=>{
        console.log('reports on navbar =>');
        // setNavReports([]);
        const temp = [];
        reports.map(item=> {
            if (item.isdisplay) {
                temp.push(item.report)
            console.log("temp", temp)
            }
        })
        setNavReports(temp);
        console.log("navReports", navReports)
      }, [reports])

  return (
    <Box component="nav">
        {isSidebarOpen && (
            <Drawer
                open={isSidebarOpen}
                onClose={()=>setIsSidebarOpen(false)}
                variant="persistent"
                anchor="left"
                // MUI customization
                sx={{
                    width: drawerWidth,
                    "& .MuiDrawer-paper":{
                        color: theme.palette.secondary[200],
                        backgroundColor: theme.palette.background.alt,
                        boxSizing: "border-box",
                        borderWidth: isNonMobile ? 0 : "2px",
                        width: drawerWidth,
                    }
                }}
            >
                <Box width="100%">
                    <Box m="1.5rem 2rem 2rem 3rem">
                        <FlexBetween color={theme.palette.secondary.main}>
                            <Box display="flex" alignItems="center" gap="0.5rem">
                                <Typography variant="h4" fontWeight="bold">
                                    Fine Dashboard
                                </Typography>
                            </Box>
                            {!isNonMobile && (
                                <IconButton onClick={()=> setIsSidebarOpen(!isSidebarOpen)}>
                                    <ChevronLeft/>
                                </IconButton>
                            )} 
                        </FlexBetween>
                    </Box>
                    <List>
                        {/* Dashboard */}
                        <ListItem key={"Dashboard"} disablePadding>
                            <ListItemButton
                                onClick={()=>{ 
                                    navigate(`/dashboard`);
                                    setActive("dashboard");
                                }}
                                sx={{
                                    backgroundColor: active === "dashboard"? theme.palette.secondary[300] : "transparent",
                                    color: active === "dashboard" ? theme.palette.primary[600] : theme.palette.secondary[100]
                                }}
                                >
                                    <ListItemIcon
                                        sx={{ml: "0.5rem",
                                        color: active === "dashboard" ? theme.palette.primary[600] : theme.palette.secondary[200]
                                    }}
                                    >
                                        <DashboardOutlinedIcon/>
                                    </ListItemIcon>
                                    <ListItemText primary={"Dashboard"}/>
                                        {active === "dashboard" && (
                                            <ChevronRightOutlined sx={{ ml:"auto" }} />
                                        )}
                            </ListItemButton>
                        </ListItem>
                        {/* My Reports */}
                        <Typography key={"Reports"} fontWeight="bold" sx={{ m: "1rem 0 1rem 2rem"}}>
                            My reports
                        </Typography> 

                        { navReports.length > 0 && (
                            navReports.map((text)=>{
                             
                                
                                const lcText = text.toLowerCase();
                                return (
                                    <ListItem key={text} disablePadding>
                                        <ListItemButton
                                            onClick={()=>{ 
                                                navigate(`/${lcText}`);
                                                setActive(lcText);
                                            }}
                                            sx={{
                                                backgroundColor: active === lcText ? theme.palette.secondary[300] : "transparent",
                                                color: active === lcText ? theme.palette.primary[600] : theme.palette.secondary[100]
                                            }}
                                            >
                                                <ListItemIcon
                                                    sx={{ml: "0.5rem",
                                                    color: active === lcText ? theme.palette.primary[600] : theme.palette.secondary[200]
                                                }}
                                                >
                                                    {sideIcons[text]}
                                                </ListItemIcon>
                                                <ListItemText primary={text}/>
                                                    {active === lcText && (
                                                        <ChevronRightOutlined sx={{ ml:"auto" }} />
                                                    )}

                                         
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })
                        )}

                         {/* Settings */}
                         <Typography key={"Settings"} fontWeight="bold" sx={{ m: "1rem 0 1rem 2rem"}}>
                            Settings
                        </Typography> 
                        { isLogin && (
                            navSettings.map(({text, icon, link})=>{
                                if (!icon) {
                                    return (
                                    <Typography key={text} fontWeight="bold" sx={{ m: "1rem 0 1rem 2rem"}}>
                                        {text}
                                    </Typography> 
                                    ) 
                                }
                                
                                const lcText = text.toLowerCase();
                                return (
                                    <ListItem key={text} disablePadding>
                                        <ListItemButton
                                            onClick={()=>{ 
                                                navigate(`/${lcText}`);
                                                setActive(lcText);
                                            }}
                                            sx={{
                                                backgroundColor: active === lcText ? theme.palette.secondary[300] : "transparent",
                                                color: active === lcText ? theme.palette.primary[600] : theme.palette.secondary[100]
                                            }}
                                            >
                                                <ListItemIcon
                                                    sx={{ml: "0.5rem",
                                                    color: active === lcText ? theme.palette.primary[600] : theme.palette.secondary[200]
                                                }}
                                                >
                                                    {icon}
                                                </ListItemIcon>
                                                <ListItemText primary={text}/>
                                                    {active === lcText && (
                                                        <ChevronRightOutlined sx={{ ml:"auto" }} />
                                                    )}

                                         
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })
                        )}
                        {/* Developer */}
                        { isDeveloper && (
                        <Typography key={"Developer settings"} fontWeight="bold" sx={{ m: "1rem 0 1rem 2rem"}}>
                            Developer settings
                        </Typography> 
                        )
                        }
                        {/* list of settings */}
                        { isDeveloper && (
                            navDeveloper.map(({text, icon, link})=>{
                                if (!icon) {
                                    return (
                                    <Typography key={text} fontWeight="bold" sx={{ m: "1rem 0 1rem 2rem"}}>
                                        {text}
                                    </Typography> 
                                    ) 
                                }
                                
                                const lcText = text.toLowerCase();
                                return (
                                    <ListItem key={text} disablePadding>
                                        <ListItemButton
                                            onClick={()=>{ 
                                                navigate(`/${lcText}`);
                                                setActive(lcText);
                                            }}
                                            sx={{
                                                backgroundColor: active === lcText ? theme.palette.secondary[300] : "transparent",
                                                color: active === lcText ? theme.palette.primary[600] : theme.palette.secondary[100]
                                            }}
                                            >
                                                <ListItemIcon
                                                    sx={{ml: "0.5rem",
                                                    color: active === lcText ? theme.palette.primary[600] : theme.palette.secondary[200]
                                                }}
                                                >
                                                    {icon}
                                                </ListItemIcon>
                                                <ListItemText primary={text}/>
                                                    {active === lcText && (
                                                        <ChevronRightOutlined sx={{ ml:"auto" }} />
                                                    )}

                                         
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })
                        )}


                    </List>
                </Box>
             
            </Drawer>
        )}
    </Box>
  )
};

export default Sidebar;