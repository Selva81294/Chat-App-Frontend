import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import { Box, Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ChatLoading from "./ChatLoading";
import { getSender } from "../Config/Chatlogics";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({fetchAgain}) => {  

  const { user, token, selectedChat, setSelectedChat, chats, setChats } =
    ChatState();
  const [loggedUser, setLoggedUser] = useState();

  const fetchChats = async () => {
    const config = { headers: { "x-auth-token": token } };
    try {
      const { data } = await axios.get(
        "https://chat-app-backend-zcfs.onrender.com/api/chat",
        config
      );
      setChats(data);
    } catch (error) {
      alert("Failed to load the chat");
      console.log(error);
    }
  };

  useEffect(() => {
    setLoggedUser(user);
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      style={{ paddingLeft: "10px" }}
      sx={{
        display: { xs: selectedChat ? "none" : "flex", sm: "flex" },
        flexDirection: "column",
        alignItems: "center",
        padding: 3,
        backgroundColor: "#B9EDDD",
        width: { xs: "100%", sm: "40%", md: "28%" },
        color: "green",
      }}
    >
      <Box
        sx={{
          fontSize: { xs: "22px", sm: "18px", md: "21px" },
          fontFamily: "Work sans",
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        My Chats
        <GroupChatModal> 
        <Button variant="contained" color="success" 
          sx={{
            display: "flex",
            paddingTop: "5px",
            fontSize: { sm: "12px", md: "15px" },
          }}
          endIcon={<AddIcon />}
        >
          New Group
        </Button>
        </GroupChatModal>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 3,
          backgroundColor: "#B9EDDD",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {
          chats ? (
            <Stack className="hideBar" style={{overflowY:"scroll"}}>
              {
                chats.map((chat)=>(
                  <Box key={chat._id} onClick={()=>setSelectedChat(chat)}
                  sx={{cursor:"pointer", backgroundColor:selectedChat === chat ? "#38b2ac" : "#B9EDDD", 
                  color: selectedChat=== chat ? "white": "green", margin:"10px"}}>
                    <Typography>
                      {
                        !chat.isGroupChat ? (
                          getSender(loggedUser,chat.users)
                        ) : chat.chatName
                      }
                    </Typography>
                  </Box>
                 
                ))
                
              }
            </Stack>
          ) : (
            <ChatLoading/>
          )
        }
      </Box>
    </Box>
  );
};

export default MyChats;
