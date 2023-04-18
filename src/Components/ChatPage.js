import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import ChatBox from "./ChatPage-Components/ChatBox.js";
import MyChats from "./ChatPage-Components/MyChats.js";
import SideDrawer from "./ChatPage-Components/SideDrawer.js";
import { ChatState } from "./Context/ChatProvider";
import { useHistory } from "react-router-dom";

const ChatPage = () => {

  const {user} = ChatState()
  const [fetchAgain, setFetchAgain] = useState(false)

  const history = useHistory()

  useEffect(() => {
    const token = localStorage.getItem("token")
      if (!token) {
          history.push("/")
      } 
  }, [history])

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          height: "87vh",
        }}
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  );
};

export default ChatPage;
