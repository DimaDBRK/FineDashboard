import { useEffect, useState, useContext } from "react";
import axios from "axios";
// import { verify } from "jsonwebtoken";
import { useNavigate,  useLocation, Navigate} from "react-router-dom";
import { AppContext } from "../App";


const Auth = (props) => {
    const { token, setToken } = useContext(AppContext);
    const { isLogin, setIsLogin } = useContext(AppContext);

    const [redirect, setRedirect] = useState(null);
    const location = useLocation();
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
            if (res.status === 200) {
                return setRedirect(true);
            }
            console.log("check Token false");
            setRedirect(false);
       
            setIsLogin(false);
            setToken(null);
            // navigate("/fine/login"); //to dashboard
        } catch(e) {
            setRedirect(false);
            console.log("check Token false");
            setIsLogin(false);
            setToken(null);
            navigate("/login", { state: { from: location }, replace: true }); //to dashboard
           

        }
    }
    console.log("redirect auth res:", redirect)
    return redirect ? props.children : <p>Problem with Auth</p>;
};

export default Auth;