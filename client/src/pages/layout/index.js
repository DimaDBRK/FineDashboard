import React from 'react';
import { useState, useContext, useEffect } from 'react';
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "components/Navbar";
import Sidebar from "components/Sidebar"
import { AppContext } from "App";
import jwt_token from 'jwt-decode';
import { refreshToken } from 'helpers/newRefreshToken';
import axios from "axios";

const Layout = () => {
    const [msg, setMsg] = useState('');
    // media query desktop - true
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    // side bar open-close boolean
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    //for test User info
    // const user = {name: "Albert", isDeveloper: true }
    const { isLogin, setIsLogin } = useContext(AppContext);
    const { token, setToken } = useContext(AppContext);
    const { refreshToken, setRefreshToken } = useContext(AppContext);
    const { userinfo, setUserInfo, reports, setReports  } = useContext(AppContext);
    const { isDeveloper, setIsDeveloper } = useContext(AppContext);
    // const [name, setUsername] = useState("");

    useEffect(()=>{
         
        if (token) {
            const payload = jwt_token(token);
            const info = payload.userinfo;
            setUserInfo(info);
            setIsDeveloper(info.isdeveloper);
            console.log("userinfo from token=>", info);
        }  else if (refreshToken) {
            const payload = jwt_token(refreshToken);
            const info = payload.userinfo;
            setIsLogin(true);
            setUserInfo(info);
            setIsDeveloper(info.isdeveloper);
            getReportsNew(info.user_id);
            console.log("userinfo from ref token=>", info);
            setMsg("");
           
        }
            

        //     const payload = jwt_token(refreshToken);
        //     const info = payload.userinfo;
        //     setUserInfo(info);
        //     setIsDeveloper(info.isdeveloper);
        //     console.log("userinfo from refreshToken=>", info);
        // }
    },[token, refreshToken]);


    // useEffect(()=>{
    //     getReports();
    //     console.log('res=>',reports);
    //   }, [])
      
      const getReportsNew = async (id) =>{
        console.log("user_id in get=>", userinfo.user_id)
      
        try {
          const res = await axios.get(`/wbapi/alluserreportsisdispaly/${id}`);
          
          console.log('res=>',res.data);
          setReports(res.data);
          setMsg("");
           
        }catch (err) {
          setMsg(err.response.data.msg);
          console.log(err.response.data.msg);
        }
   
      }
      
  return (
    <Box display={isNonMobile ? "flex": "block"} width="100%" height="100%">
    
        {isLogin && (<Sidebar
            // user={user || {}} // empty object if problem with getting info
            isNonMobile={isNonMobile}
            drawerWidth="250px"
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
        />)}
        <Box flexGrow={1}>
            <Navbar
                user={userinfo.name|| ""}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
            <Outlet/>
        </Box>
    </Box>
  )
}

export default Layout;