import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../Config/Chatlogics";
import { ChatState } from "../Context/ChatProvider";
import { Avatar, Tooltip } from "@mui/material";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <div>
      <ScrollableFeed>
        {messages &&
          messages.map((m, i) => (
            <div style={{ display: "flex" }} key={m._id}>
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Tooltip title={m.sender.name} placement="bottom-start" arrow>
                  <Avatar
                    src={m.sender.pic}
                    sx={{
                      marginTop: "9px",
                      marginRight: "5px",
                      cursor: "pointer",
                      width: 30,
                      height: 28,
                    }}
                  >
                    {m.sender.name}
                  </Avatar>
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor: `${
                    m.sender._id === user._id ? "#FA7A35" : "#C3447A"
                  }`,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 8 : 10,
                  color: "whitesmoke"
                }}
              >
                {m.content}
              </span>
            </div>
          ))}
      </ScrollableFeed>
    </div>
  );
};

export default ScrollableChat;
