import React from "react";
import { Avatar, Box, Typography } from "@mui/material";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      sx={{
        "&:hover": {
          backgroundColor: "#38B2AC",
          color: "white",
        },
        cursor: "pointer",
        backgroundColor: "#B9EDDD",
        width: "100%",
        display: "flex",
        alignItems: "center",
        color: "black",
        marginBottom: "10px"
      }}
    >
      <Avatar
        style={{ cursor: "pointer", margin:"0 5px" }}
        sx={{ width: 35, height: 35 }}
        src={user.pic}
      >
        {user.name}
      </Avatar>
      <Box>
        <Typography style={{fontWeight:"bold"}}>{user.name}</Typography>
        <Typography style={{ fontSize: "15px" }}>
          <Typography variant="p" style={{ marginRight: "3px", fontWeight:"bold" }}>
            Email:
          </Typography>
          {user.email}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserListItem;
