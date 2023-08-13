import { AppBar, IconButton, Toolbar, useTheme, InputBase, Button, Box, Typography, Menu, MenuItem} from '@mui/material';
import { useScrollTrigger } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";


const Users = (props) => {
    
    const [users, setUsers] = useState([]);
    const [msg,setMsg] = useState('');
  
    useEffect(()=>{
        getUsers();
    }, [])

    const getUsers = async () =>{
       
        try {
            const res = await axios.get(`/users/users`);
            console.log('res=>',res.data);
            setUsers(res.data);
        }catch (err) {
            setMsg(err.response.data.msg);
            console.log(err.response.data.msg);
        }
    }


 return (
    <Box>
    <h1>My Users</h1>
    
    {
        users ? users.map(item => {
            return(
                <div key={item.user_id}>
                    <p>{item.user_id} & {item.username}</p>
                    <p></p>
                </div>
            )
        })
        : null

    }
    <div>
        {msg}
    </div>
           
    </Box>
 )
}

export default Users;