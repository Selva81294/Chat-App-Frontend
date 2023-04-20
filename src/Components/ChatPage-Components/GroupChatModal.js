import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { ChatState } from "../Context/ChatProvider";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import UserListItem from "./UserListItem";
import UserBatchItem from "./UserBatchItem";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const GroupChatModal = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { users, chats, setChats, token } = ChatState();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = { headers: { "x-auth-token": token } };
      const { data } = await axios.get(
        `https://chat-app-backend-zcfs.onrender.com/api/usersquery?search=${search}`,
        config
      );
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      alert("Failed to Load the Search Results");
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      alert("Please fill all the fields");
    }
    try {
      const config = { headers: { "x-auth-token": token } };
      const { data } = await axios.post(
        "https://chat-app-backend-zcfs.onrender.com/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setOpen(false)
    } catch (error) {
      console.log(error)
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== delUser._id));
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      alert("User already added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  return (
    <div>
      <span onClick={handleOpen}>{children}</span>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            sx={{
              fontSize: "35px",
              fontFamily: "Work sans",
              display: "flex",
              justifyContent: "center",
            }}
          >
            Create Group chat
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Typography
              id="modal-modal-description"
              sx={{
                mt: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <TextField
                color="success"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                fullWidth
                label="Chat Name"
                id="fullWidth"
              />
              <TextField
                color="success"
                onChange={(e) => handleSearch(e.target.value)}
                sx={{ margin: "20px 0" }}
                fullWidth
                label="Add Users eg: Selva, Kumaran"
                id="fullWidth"
              />
              <Box width="100%" display="flex" flexWrap="wrap">
                {selectedUsers.map((user) => (
                  <UserBatchItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleDelete(user)}
                  />
                ))}
              </Box>
              {loading ? (
                <CircularProgress size={20} color="success" />
              ) : (
                searchResult
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))
              )}
              <Button
                sx={{ marginTop: "20px" }}
                variant="contained"
                color="success"
                type="submit"
                disabled={loading}
              >
                Create Chat
              </Button>
            </Typography>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default GroupChatModal;
