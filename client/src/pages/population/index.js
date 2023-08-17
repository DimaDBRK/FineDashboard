import React from "react";
import { useTheme } from "@mui/material";
import Header from "components/Header";

import { useContext, useEffect, useState }  from "react";
import { AppContext } from "App";
import { FormControl, MenuItem, InputLabel, Box, Select } from "@mui/material";
import axios from "axios";
import FlexBetween from 'components/FlexBetween';
import PopulationChart from "components/PopulationChart";



const Population = (props) => {
  const [view, setView] = useState("total_population");
  //web page title for browser
  const title = props.title;
  useEffect(() => {
    document.title = title;
  },[]);
  
  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Population & GDP"
        subtitle="Requests to server"
      />
      <Box height="75vh">
        <FormControl sx={{ mt: "1rem" }}>
          <InputLabel>View</InputLabel>
          <Select
            value={view}
            label="View"
            onChange={(e) => setView(e.target.value)}
          >
            <MenuItem value="total_population">Total population</MenuItem>
            <MenuItem value="gdp_usd">GDP</MenuItem>
          </Select>
        </FormControl>
        <PopulationChart view={view} />
      </Box>
    </Box>
  );
};


export default Population;