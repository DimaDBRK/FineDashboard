import React from 'react';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Header from "components/Header";
import { useContext, useEffect, useState }  from "react";
import { AppContext } from "App";
import axios from "axios";
import FlexBetween from 'components/FlexBetween';
import { useNavigate } from "react-router-dom";
import {newRefreshToken} from "helpers/newRefreshToken.js";

const Report = ({
  report_id,
  report,
  title,
  short,
  description,
  link,
  isdisplay,
  // reports,  
  // setReports,
  msg, 
  setMsg

}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { isLogin, setIsLogin, isDeveloper, setIsDeveloper, userinfo, setUserInfo, reports, setReports } = useContext(AppContext);
  
  const  deleteReportFromList = async () =>{
     
    try {
        const res = await axios.post(`/wbapi/deleteuserreport`, { "user_id": userinfo.user_id, report_id });
        if (res.status === 200) {
          console.log('res=>', res.data);
          setReports(res.data);
          setMsg("");
      }
    }catch (err) {
        setMsg(err.response.data.msg);
        console.log(err.response.data.msg);
    }
  }

  const  addReportToList = async () =>{
     
    try {
        const res = await axios.post(`/wbapi/allusersreports`, { "user_id": userinfo.user_id, report_id });
        if (res.status === 200) {
          console.log('res=>',res.data);
          setReports(res.data);
          setMsg("");
      }
    } catch (err) {
      if  (err.response.status && [401, 403].includes(err.response.status)) {
        console.log("error:", err.response.status, "try refresh");
        // try to refresh token

        newRefreshToken()
       .then(result => {
        console.log("result refreshToken=>", result);
        if (result) { 
            console.log("token updated");
            return addReportToList();
        } else {
          setMsg(err.response.data.msg);
          console.log(err.response.data.msg);
        }
      })
        setMsg(err.response.data.msg);
        console.log(err.response.data.msg);
    }
  }
  }
  return (
    <Card 
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }}
    >
      <CardContent>
        <FlexBetween>
          <Button
            variant="contained" 
            // color="success"
            color="secondary"
            size="large" 
            onClick={()=>{console.log(link); navigate(link)}}       
          >
            {report}
          </Button>
          { !isdisplay && (
          <Button
            variant="contained" 
            // color="success"
            // color="secondary"
            size="large" 
            onClick={()=>{console.log("add", userinfo.user_id, report_id); addReportToList((userinfo.user_id, report_id)) }}       
          >
            Add
          </Button>
          )}
           { isdisplay && (
          <Button
            variant="contained" 
            // color="success"
            // color="secondary"
            size="large" 
            onClick={()=>{console.log("remove", userinfo.user_id, report_id); deleteReportFromList(userinfo.user_id, report_id)}}       
          >
            Remove
          </Button>
          )}
        </FlexBetween>
       
        <Typography variant="h5" component="div">
          {title}
        </Typography>
      
        <Typography variant="body2">{short}</Typography>
      
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          Details
        </Button>
      </CardActions>
      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
        sx={{
          color: theme.palette.neutral[300],
        }}
      >
        <CardContent>
          <Typography>
            report_id: {report_id}
          </Typography>
          <Typography>
            Description: {description}
          </Typography>
          <Typography>
            Link: {link}
          </Typography>
          
        </CardContent>
      </Collapse>
    </Card>
  );
};



const Reports = () => {
  const theme = useTheme();
  const [msg, setMsg] = useState('');
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  // const [reports, setReports] = useState([]);
  // const [usersReports, setusersReports] = useState([]);
  const navigate = useNavigate();
  // const { isLogin, setIsLogin, isDeveloper, setIsDeveloper, userinfo, setUserInfo } = useContext(AppContext);
  const { isLogin, setIsLogin, isDeveloper, setIsDeveloper, userinfo, setUserInfo, reports, setReports } = useContext(AppContext);
  // get info


useEffect(()=>{
  getReports();
  console.log('res=>',reports);
}, [])

const getReports = async () =>{
 if (userinfo.user_id) {
    console.log("user_id in get", userinfo.user_id)
    try {
      const res = await axios.get(`/wbapi/alluserreportsisdispaly/${userinfo.user_id}`);
      
      console.log('res=>',res.data);
      setReports(res.data);
      setMsg("")
      
    } catch (err) {
      setMsg(err.response.data.msg);
      console.log(err.response.data.msg);
    }
  }
}

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="ALL REPORTS" subtitle="List of reports." />
      <Typography component="p" variant="h6">
            {msg}
      </Typography>
      {reports.length > 1 ? (
        <Box>
           <FlexBetween gap="0.5rem" mt="20px">
            <Typography variant="h4" fontWeight="bold">
               Available reports
            </Typography>
        </FlexBetween>
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(3, minmax(0, 1fr))"
          justifyContent="space-between"
          rowGap="20px"
          columnGap="1.33%"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          {reports.map(
            ({
              report_id,
              report,
              title,
              short,
              description,
              link,
              isdisplay,
              
            }) => { if (!isdisplay) return (
              <Report
                key={report_id}
                report_id={report_id}
                report={report}
                title={title}
                short={short}
                description={description}
                link={link}
                isdisplay={isdisplay}
                // reports={reports}
                // setReports={setReports}
                msg={msg}
                setMsg={setMsg}
              />
            )}
          )}
        </Box>
          <FlexBetween gap="0.5rem" mt="20px">
            <Typography variant="h4" fontWeight="bold">
                My reports
            </Typography>
          </FlexBetween>
       
          <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(3, minmax(0, 1fr))"
          justifyContent="space-between"
          rowGap="20px"
          columnGap="1.33%"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          {reports.map(
            ({
              report_id,
              report,
              title,
              short,
              description,
              link,
              isdisplay,
              
            }) => { if (isdisplay) return (
              <Report
                key={report_id}
                report_id={report_id}
                report={report}
                title={title}
                short={short}
                description={description}
                link={link}
                isdisplay={isdisplay}
                // reports={reports}
                // setReports={setReports}
                msg={msg}
                setMsg={setMsg}
              />
            )}
          )}
          </Box>
       
        </Box>
      ) : (
        <>Loading...</>
      )}
    </Box>
  );
};

export default Reports;