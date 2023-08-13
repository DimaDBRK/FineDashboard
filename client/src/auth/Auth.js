import { useEffect, useState, useContext } from "react";
import axios from "axios";
// import { verify } from "jsonwebtoken";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";


const Auth = (props) => {
    const { token, setToken } = useContext(AppContext);
    const { isLogin, setIsLogin } = useContext(AppContext);

    const [redirect, setRedirect] = useState(null);

    const navigate = useNavigate();


    useEffect(()=> {
        verifyMyToken()
    }, []);

    const verifyMyToken = async() => {
        try {
            const res = await axios.get(`/users/verify`);
            //test
            console.log("check Token in Auth");
            console.log("res Status", res.status);
            if (res.status === 200) return setRedirect(true);
            setRedirect(false);
            // setIsLogin(false);
            // setToken(null);
            navigate("/fine/login"); //to dashboard
        } catch(e) {
            setRedirect(false);
            // setIsLogin(false);
            navigate("/fine/login"); //to dashboard
           

        }
    }

    return redirect ? props.children : <p>Auth problem. Please Login</p>;
};

export default Auth;