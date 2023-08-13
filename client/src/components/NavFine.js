import { useState, useContext, useEffect,  } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import jwt_token from 'jwt-decode';
import axios from "axios";

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile settings', 'Logout'];

function NavFine() {
    //  App logic
    const { token, setToken } = useContext(AppContext);
    const { isLogin, setIsLogin } = useContext(AppContext);
    const navigate = useNavigate();

    const logout = async () => {
        try {
            const res = await axios.delete(`/users/logout`);
            if (res.status === 200) {
            setToken(null);
            setIsLogin(false);
            navigate("/")
            }
        } catch(e) {
            console.log(e);
        }
    }

    // get info from token
    
  
    const [username, setUsername] = useState("");


    useEffect(()=>{
        if (token) {
            const payload = jwt_token(token);
            
            setUsername(payload.userinfo['name']);
            console.log("name=>",payload.userinfo['name'], "det" ,username   );
        }
    },[token]);


    // menu logic UI management
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
  
    const handleOpenNavMenu = (event) => {
      setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
    };
  
    const handleCloseNavMenu = () => {
      setAnchorElNav(null);
    };
  
    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };

    return (
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
        {/* Icon and name */}
              <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component={Link} to='/'
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                //   fontFamily: 'monospace',
                  fontWeight: 700,
                //   letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                FD
              </Typography>
        {/*  XS device */}
              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  {pages.map((page) => (
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">{page}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
           
              </Box>
               {/* Normal screen */}
              <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href=""
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                LOGO
              </Typography>

              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {/* Auth -> side menu */}
             
               
            
                {isLogin && (
                    <Button  color="inherit" sx={{ my: 2, display: 'block' }} component={Link} to='/dashboard' > 
                        Dashboard
                    </Button>
                )}

                {isLogin && (
                    <Button color="inherit"  sx={{ my: 2, display: 'block' }} component={Link} to='/developer' > 
                        Profile
                    </Button>
                )}  

                {isLogin && (
                    <Button color="inherit" sx={{ my: 2, display: 'block' }} component={Link} to='/developer' > 
                        Developer
                    </Button>
                )}

              </Box>

              <Box sx={{ flexGrow: 0 }}>
                {/* Avatar */}
                {isLogin ? <Box  sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', textAlign: 'center', gap: '20px' }}>
                
                <Button variant="text" disableElevation  sx={{ display:{xs: 'none', md: 'flex'}, my: 0, color: 'white'}} >
                    {username} 
                </Button> 
             
                
                <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={username} src="" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
             
                    <MenuItem  onClick={()=> {handleCloseUserMenu(); logout()}}>
                      <Typography textAlign="center"> Logout</Typography>
                    </MenuItem>
                    <MenuItem  onClick={()=> {handleCloseUserMenu()}}>
                      <Typography textAlign="center"> Settings </Typography>
                    </MenuItem>
            
                </Menu>
                </Box>
                :
                <Button sx={{ my: 2, color: 'white', display: 'block' }} component={Link} to='/fine/login' >
                    Login
                </Button>
                }
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      );
    }
export default NavFine;