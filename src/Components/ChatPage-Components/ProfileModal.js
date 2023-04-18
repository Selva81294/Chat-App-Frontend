import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

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

const ProfileModal = ({ user, children }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {children ? (
        <span
          style={{ fontSize: "14px", justifyContent: "center", color: "green" }}
          onClick={handleOpen}
        >
          {children}
        </span>
      ) : (
        <IconButton color="success" onClick={handleOpen}>
          <VisibilityIcon />
        </IconButton>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography  style={{fontSize:"40px", fontFamily:"Work sans", display:"flex", justifyContent:"center"}}>
            {user.name}
          </Typography>
          <Typography style={{textAlign:"center"}} id="modal-modal-description" sx={{ mt: 2 }}>
            <img style={{borderRadius:"50%", height:"80px"}} src={user.pic} alt={user.name}/>
          </Typography>
          <Typography style={{fontSize:"25px", fontFamily:"Work sans", display:"flex", justifyContent:"center"}}>
            {user.email}
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default ProfileModal;
