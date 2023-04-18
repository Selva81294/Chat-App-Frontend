import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getSender, getSenderFull } from "../Config/Chatlogics";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModel from "./UpdateGroupChatModel";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import { io } from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../../typing graphic/107605-typing.json"

const ENDPOINT = "http://localhost:8000";

let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { user, selectedChat, setSelectedChat, token, notification, setNotification } = ChatState();

  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = { headers: { "x-auth-token": token } };
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8000/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      alert("Failed to load the message!");
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // give notification logic
        if(!notification.includes(newMessageReceived)){
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain)
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const sendMessage = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "x-auth-token": token,
            "Content-type": "application/json",
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "http://localhost:8000/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        alert("Failed to send the message!");
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // typing indicator logic
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Typography
            fontSize={{ xs: "28px", sm: "30px" }}
            color="green"
            pb={1}
            width="100%"
            fontFamily="work sans"
            display="flex"
            justifyContent={{ xs: "space-between" }}
            alignItems="center"
          >
            <IconButton
              onClick={() => setSelectedChat("")}
              color="success"
              aria-label="Go back"
              sx={{ display: { xs: "flex", sm: "none" } }}
            >
              <ArrowBackIcon />
            </IconButton>
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            pr={1}
            pl={1}
            mr={2}
            mb={1}
            width="100%"
            bgcolor="#95DEE3"
            height="100%"
            sx={{ overflowY: "hidden" }}
          >
            {loading ? (
              <CircularProgress
                color="success"
                size={40}
                sx={{ alignSelf: "center", margin: "auto" }}
              />
            ) : (
              <div
                className="hideBar"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                }}
              >
                <ScrollableChat messages={messages} />
              </div>
            )}
            <Box component="form" onKeyDown={sendMessage} mt={3}>
              {isTyping ? (
                <div>
                  <Lottie options={defaultOptions} width={70} height={30} style={{marginLeft:0,marginTop:0}} />
                </div> 
              ) : (
                <></>
              )}
              <TextField
                color="success"
                fullWidth
                label="Enter a message..."
                id="fullWidth"
                onChange={typingHandler}
                value={newMessage}
                sx={{ boxShadow: " 0 0 10px grey" }}
              />
            </Box>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Typography variant="h4" fontFamily="Work sans">
            Click on a user to start chatting
          </Typography>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
