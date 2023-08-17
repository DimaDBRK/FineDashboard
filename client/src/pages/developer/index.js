import { useContext, useEffect, useState }  from "react";
import { AppContext } from "App";
import Users from "components/Users";
import CollectDataWB from "components/CollectDataWB";
import TestChartTotalPopulation from "components/TestChartTotalPopulation"
import Auth from "auth/Auth";
import Container from '@mui/material/Container';
import jwt_token from 'jwt-decode';
import { Button } from "@mui/material";

import { testData } from "helpers/testWbApi";
    
    const Developer = (props) => {
        const [email, setEmail] = useState("");
        const [id, setId] = useState("");
        const { token } = useContext(AppContext);
        
        //web page title for browser
        const title = props.title;
        useEffect(() => {
        document.title = title;
        },[]);
        // get info


        useEffect(()=>{
            if (token) {
                const payload = jwt_token(token);
                console.log("payload=>", payload);
                setEmail(payload.userinfo.email);
                setId(payload.userinfo.user_id);
            }
        },[token]);



    return(
        <Container maxWidth="lg">
            <TestChartTotalPopulation/>
            <CollectDataWB/>
          
            <h2>Test data:</h2>
                <div>
                    <p>My first token: {token}</p>
                </div>
        
            {/* <Users/> */}
        </Container>
    
        
    )
}

export default Developer;