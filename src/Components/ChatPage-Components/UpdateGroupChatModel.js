import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Button, CircularProgress, IconButton, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ChatState } from "../Context/ChatProvider";
import UserBatchItem from "./UserBatchItem";
import axios from "axios";
import UserListItem from "./UserListItem";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {xs:"200px", sm:"400px"},
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain , fetchMessages}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { user, selectedChat, setSelectedChat, token } = ChatState();

  const handleRemove = async (removeuser) => {
    if(selectedChat.groupAdmin._id !== user._id && removeuser._id !== user._id){
      alert("Only user can remove someone!")
      return;
    }
    try {
      setLoading(true)
      const config = { headers: { "x-auth-token": token } };
      const {data} = await axios.put("https://chat-app-backend-zcfs.onrender.com/api/chat/groupremove",{
        chatId: selectedChat._id,
        userId: removeuser._id
      },config);
      removeuser._id === user.id ? setSelectedChat() :setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      fetchMessages();
      setLoading(false)
    } catch (error) {
      console.log(error)
      alert("Error Occured")
      setLoading(false)
    }
  }

  const handleAddUser = async (adduser) => {
    if (selectedChat.users.find((u)=>u._id === adduser._id)){
      alert("User already in group")
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      alert("Only admin can add someone!")
      return;
    }

    try {
      setLoading(true)
      const config = { headers: { "x-auth-token": token } };
      const {data} = await axios.put("https://chat-app-backend-zcfs.onrender.com/api/chat/groupadd",{
        chatId: selectedChat._id,
        userId: adduser._id
      },config);
      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setLoading(false)
    } catch (error) {
      console.log(error)
      alert("Error Occured")
      setLoading(false)
    }
  }

  const handleRename = async () => {
    if(!groupChatName) return;

    try {
      setRenameLoading(true)
      const config = { headers: { "x-auth-token": token } };
      const {data} = await axios.put("https://chat-app-backend-zcfs.onrender.com/api/chat/rename",{
        chatId: selectedChat._id,
        chatName: groupChatName,
      },config);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      console.log(error)
      alert("Error Occured")
      setRenameLoading(false)
      setRenameLoading(false)
    }

    setGroupChatName("")
  }

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
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      alert("Failed to Load the Search Results");
      console.log(error);
    }
  };

  return (
    <div>
      <IconButton sx={{ display: { xs: "flex" } }} onClick={handleOpen}>
        <VisibilityIcon />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            sx={{fontSize:{xs:"25px",sm:"35px"}}}
            fontFamily="work sans"
            display="flex"
            justifyContent="center"
            color="green"
            fontWeight='bold'
          >
            {selectedChat.chatName}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Box  display="flex" flexWrap="wrap" width="100%">
              {selectedChat.users.map((u) => (
                <UserBatchItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <Box component="form" display="flex"  onSubmit={handleRename}>
            <TextField
                color="success"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                sx={{width:{xs:"60%", sm:"76%"}}}
                label="Chat Name"
                id="fullWidth"
                size="small"
              />
            <Button
                sx={{ marginLeft:"10px", width:'23%' }}
                variant="contained"
                color="success"
                type="submit"
                disabled={renameLoading}
                size="small"
              >Update</Button>
            </Box>
            <Box component="form">
            <TextField
                color="success"
                onChange={(e) => handleSearch(e.target.value)}
                fullWidth
                label="Add User to Group"
                id="fullWidth"
                size="small"
                sx={{margin:"20px 0"}}
              />
            </Box>
            {loading ? (
                <CircularProgress size={20} color="success" />
              ) : (
                searchResult?.map((usersearch) => (
                    <UserListItem
                      key={usersearch._id}
                      user={usersearch}
                      handleFunction={() => handleAddUser(usersearch)}
                    />
                  ))
              )}
          </Typography>
          <Typography display="flex" justifyContent="right">
          <Button onClick={()=>handleRemove(user)} size="medium" variant="contained" color="error">
             Leave Group
          </Button>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default UpdateGroupChatModel;
