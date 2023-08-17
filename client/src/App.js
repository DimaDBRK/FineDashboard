
import { CssBaseline, ThemeProvider } from "@mui/material"; 
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "theme";
import { useState, useContext, useMemo, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import jwt_token from 'jwt-decode';

//components
import Dashboard from 'pages/dashboard';
import Profile from 'pages/profile';
import Reports from 'pages/reports';
import Layout from 'pages/layout';
import Developer from 'pages/developer';
import Users from 'pages/users'
import Geography from "pages/geography";
import Population from "pages/population";
import Yearly from "pages/yearly";
import Birth from "pages/birth";
import Income from "pages/education";
import Education from "pages/education";
import Data from "pages/data";
//old

import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';


import Auth from './auth/Auth';
// elements for test
import LoginFine from './registerlogin/LoginFine';
import RegisterFine from './registerlogin/RegisterFine';
import { createContext } from 'react';





export const AppContext = createContext(null);

function App() {
  // theme 
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(()=> createTheme(themeSettings(mode), [mode]))

  //user

  const [token, setToken] =  useState(null);
  const [refreshToken, setRefreshToken] =  useState(localStorage.getItem("refreshToken"));
  const [isLogin, setIsLogin] =  useState(false);
  const [isDeveloper, setIsDeveloper] =  useState(false);
 //userinfo
  const [userinfo, setUserInfo] = useState({});
  // for my reports
  const [reports, setReports] = useState([]);
  

  return (

    <div className="app">
      <AppContext.Provider value ={{ token, setToken, isLogin, setIsLogin, isDeveloper, setIsDeveloper, userinfo, setUserInfo, reports, setReports, refreshToken, setRefreshToken}}>
   
        {/* theme - mode */}
        <ThemeProvider theme = {theme}>
          <CssBaseline /> 
          <Routes>
            <Route element={<Layout/>}>
              {isLogin ? (<Route path='/' element={<Navigate to="/dashboard" replace/>}/>)
              :(<Route path='/' element={<Home/>}/>)
              }
              <Route path='/dashboard' element={<Dashboard />}/>
              <Route path='/login' element={<LoginFine title='Login'/>}/>
              <Route path='/register' element={<RegisterFine title='Register'/>}/>
              <Route path='/developer' element={
                <Auth>
                  <Developer title='Developer'/>
                </Auth>
              }/>
              <Route path='/reports' element={<Reports />}/>
              {/* Protected route */}
              <Route path='/users' element={
                <Auth>
                  <Users title='Users'/>
                </Auth>
                }/>
                 <Route path='/profile' element={
                <Auth>
                  <Profile title='Profile'/>
                </Auth>
                }/>
              <Route path='/geography' element={<Geography title='Geography'/>}/>
              <Route path='/population' element={<Population title='Population'/>}/>
              <Route path='/yearly' element={<Yearly title='Yearly'/>}/>
              <Route path='/birth' element={<Birth title='Birth'/>}/>
              <Route path='/education' element={<Education title='Education'/>}/>
              <Route path='/data' element={<Data title='Data'/>}/>

         
            </Route>
            {/* <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<Login title='Login'/>}/>
            <Route path='fine/login' element={<LoginFine title='Login'/>}/>
            <Route path='/register' element={<Register title='Register'/>}/>
            <Route path='/developer' element={
              <Auth>
                <Developer/>
              </Auth>
            }/>
            <Route path='/dashboard' element={
              <Auth>
                <Dashboard/>
              </Auth>
            }/> */}
          </Routes>
        </ThemeProvider>
  
      </AppContext.Provider>
    </div>
    
  );
}

export default App;
