import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import Tooltip from "@mui/material/Tooltip";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Avatar,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  ListItemButton,
  MenuList
} from "@mui/material";
import { ChatState } from "../Context/ChatProvider";
import { useHistory } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import Paper from "@mui/material/Paper";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { getSender } from "../Config/Chatlogics";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const [open, setOpen] = useState(false);

  const { user, token, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();

  const history = useHistory();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const [anchorNotification, setAnchorNotification] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isNotifiOpen = Boolean(anchorNotification);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

//Notification bell handle functions
  const handleNotificationMenuOpen = (event) => {
    setAnchorNotification(event.currentTarget);
  }

  const handleNotifiClose = () =>{
    setAnchorNotification(null);
  }


//Avatar handle functions
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const LogOut = () => {
    localStorage.clear();
    history.push("/");
  };

//Notification bell Menu:

const notifiId = "notification-bell-menu"
const renderNotify = (
  <Menu 
    anchorEl={anchorNotification}
    anchorOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    id={notifiId}
    keepMounted
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    open={isNotifiOpen}
    onClose={handleNotifiClose} >
      <MenuList style={{padding:"5px"}} onClick={handleNotifiClose}>
          {!notification.length && "No New Messages"}
          {notification.map(notify => (
            <MenuItem key={notify._id} onClick={()=>{
              setSelectedChat(notify.chat);
              setNotification(notification.filter((n)=>n !== notify))}}>
              {notify.chat.isGroupChat? `New Message in ${notify.chat.chatName}`: `New Message from ${getSender(user, notify.chat.users)}`}
            </MenuItem>
          ))}
      </MenuList>
  </Menu>
)


//Avatar renderMenu:
  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <ProfileModal user={user}>
        <MenuItem onClick={handleMenuClose}>My Profile</MenuItem>
      </ProfileModal>
      <Divider />
      <MenuItem
        style={{ fontSize: "17px", justifyContent: "center", color: "green" }}
        onClick={() => {
          handleMenuClose();
          LogOut();
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );
  
//Avatar Mobile View Render
  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleNotificationMenuOpen}>
      <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit" 
                >
                  <Badge badgeContent={notification.length} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const styleTheme = createTheme({
    palette: {
      primary: {
        main: "#2e7d32",
      },
    },
  });

  //getting user for chat
  const handleSearch = async () => {
    if (!search) {
      return alert("Please enter name for search!");
    }
    try {
      setLoading(true);
      const config = { headers: { "x-auth-token": token } };

      const { data } = await axios.get(
        `http://localhost:8000/api/usersquery?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.log(error);
    }
  };

  //for 1 to 1 chat with searched user
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: { "x-auth-token": token, "Content-type": "application/json" },
      };

      const { data } = await axios.post(
        "http://localhost:8000/api/chat",
        { userId },
        config
      );

      if(!chats.find((msg)=>msg._id === data._id))
      setChats([data, ...chats])
      setSelectedChat(data);
      setLoadingChat(false);
      setOpen(false);
    } catch (error) {
      alert("Error in fetching the chat");
      console.log(error);
    }
  };

  //search sidebar
  const getList = () => (
    <div
      style={{
        width: "auto",
        padding: "0 10px",
        backgroundColor: "#B9EDDD",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ marginBottom: "20px", color: "green" }}>Search Users</h2>
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: 200,
          border: "1px solid green",
          backgroundColor: "#B9EDDD",
          marginBottom: "10px",
        }}
      >
        <InputBase
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ ml: 1, flex: 1 }}
          placeholder="User name"
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton
          onClick={handleSearch}
          type="button"
          sx={{ p: "10px" }}
          aria-label="search"
        >
          <SearchIcon style={{ color: "green" }} />
        </IconButton>
      </Paper>
      {loading ? (
        <ChatLoading />
      ) : (
        searchResult?.map((userData) => (
          <UserListItem
            key={userData._id}
            user={userData}
            handleFunction={() => accessChat(userData._id)}
          />
        ))
      )}
       <p style={{textAlign:"center"}}>{loadingChat && <CircularProgress color="success" />}</p>  
    </div>
  );

  return (
    <div>
      <ThemeProvider theme={styleTheme}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Tooltip title="Search User for Chat">
                <Button
                  onClick={() => setOpen(true)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: { xs: 30, sm: 180 },
                    color: "white",
                    border: "1px solid white",
                    height: 40,
                  }}
                >
                  <SearchIcon style={{ paddingRight: "6px" }} />
                  <Typography
                    noWrap
                    sx={{
                      display: { xs: "none", sm: "block" },
                    }}
                  >
                    Search User
                  </Typography>
                </Button>
              </Tooltip>

              <Box sx={{ flexGrow: 1 }} />
              <Typography
                variant="h4"
                noWrap
                component="div"
                sx={{
                  fontSize: { xs: "20px", sm: "35px" },
                  fontFamily: "fantasy",
                }}
              >
                FUN CHATERS
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                  onClick={handleNotificationMenuOpen}
                >
                  <Badge badgeContent={notification.length} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Avatar src={user?.pic} />
                </IconButton>
              </Box>
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="show more"
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>
          {renderMobileMenu}
          {renderMenu}
          {renderNotify}
        </Box>
        <Drawer open={open} anchor="left" onClose={() => setOpen(false)}>
          {getList()}
        </Drawer>
      </ThemeProvider>
    </div>
  );
};

export default SideDrawer;
