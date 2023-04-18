import { Box } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const UserBatchItem = ({ user, handleFunction }) => {
  return (
    <Box
      p={1}
      pl={2}
      borderRadius="25px"
      mb={2}
      mr={1}
      fontSize="14px"
      onClick={handleFunction}
      color="white"
      bgcolor="purple"
      display="flex"
      flexWrap="wrap"
      sx={{cursor:"pointer"}}
    >
      {user.name}
      <CloseIcon sx={{ fontSize:"20px", paddingLeft:"5px", }}/>
    </Box>
  );
};

export default UserBatchItem;
