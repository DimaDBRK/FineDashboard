import { useContext, useEffect, useState }  from "react";
import { AppContext } from "../App";
import Users from "./Users";
import Auth from "../auth/Auth";

import jwt_token from 'jwt-decode';
import { Button, Container } from "@mui/material";
     
    const Developer = (props) => {
    
        const { token } = useContext(AppContext);
      
        useEffect(()=>{
            if (token) {
                const payload = jwt_token(token);
                console.log("payload=>", payload);
                setEmail(payload.userinfo.email);
                setId(payload.userinfo.user_id);
            }
        },[token]);



    return(
    <Container maxWidth="md">
        <h2>Developer</h2>
        <div>
            <h3>User info:</h3>
            <p>My token: {token}</p>
        </div>
        
        <Users/>
    </Container>
    )
}

export default Developer;