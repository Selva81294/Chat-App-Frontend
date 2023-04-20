import * as React from "react";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import bgImg from "../Images/bgImg.jpg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async (event ) =>{
    event.preventDefault();
    try {
      const res = await fetch("https://chat-app-backend-zcfs.onrender.com/api/forgotpassword", {
        method: "POST", crossDomain: true,
        body: JSON.stringify({
          email,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept : "application/json",
          "Access-Control-Allow-Origin": "*"
        },
      });
      const data = await res.json();
      // console.log(data) 
      setMessage(data.message)

    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <Container
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        minHeight: "100vh",
      }}
      maxWidth="xl"
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            paddingTop: 15,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.dark" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Container>
            <Typography
              style={{ textAlign: "center" }}
              component="h1"
              variant="h5"
            >
              Forgot Password
            </Typography>
            <Box
              component="form"
              onSubmit={ handleForgotPassword}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                autoComplete="email"
                autoFocus
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                submit
              </Button>
              {message === "User not exits" ? (
                <h4 style={{ color: "red", textAlign: "center" }}>{message}</h4>
              ) : (
                <h4 style={{ color: "green", textAlign: "center" }}>
                  {message}
                </h4>
              )}
            </Box>
          </Container>
        </Box>
      </Container>
    </Container>
  );
};

export default ForgotPassword;
