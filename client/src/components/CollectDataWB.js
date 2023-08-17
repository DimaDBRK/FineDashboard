import { useContext, useEffect, useState }  from "react";
import { AppContext } from "App";
import Auth from "auth/Auth";
import FlexBetween from 'components/FlexBetween';
import jwt_token from 'jwt-decode';
import { IconButton, useTheme, InputBase, Button, Box, Typography, Menu, MenuItem} from '@mui/material';
import { testData } from "helpers/testWbApi";
import LoginIcon from '@mui/icons-material/Login';

const CollectDataWB = (props) => {
    
  const { token } = useContext(AppContext);

 

return(
  <Box component="div">
    <FlexBetween gap="0.5rem">
      <Typography variant="h4" fontWeight="bold">
        Collect data from the World Bank Open APIs and prepare
      </Typography>
    </FlexBetween>
    <FlexBetween  gap="0.5rem">
      <Typography variant="h5" align="center"  paragraph>
          1. Data Identification
      </Typography>
    </FlexBetween>
    <FlexBetween  gap="0.5rem">
      <Typography variant="h5" align="center"  paragraph>
          2. Data Collection 
      </Typography>
    </FlexBetween>
    <Button variant="contained" size="large" endIcon={<LoginIcon />} onClick={()=>{testData()}}>Test Data</Button>
  </Box>
)
}

export default CollectDataWB;