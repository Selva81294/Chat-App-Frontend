import React, { useEffect } from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useHistory } from "react-router-dom";
import bgImg from "../Images/bgImg.jpg";
import "./style.css";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Alert, AlertTitle } from "@mui/material";

const HomePage = () => {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userinfo"));
    if (user) {
      history.push("/chats");
    }
  }, [history]);

  const [register, setRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        "https://chat-app-backend-zcfs.onrender.com/api/signup",
        {
          method: "POST",
          body: JSON.stringify({
            name,
            email,
            password,
            pic,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      setLoading(false);
      setMessage(data.message);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        "https://chat-app-backend-zcfs.onrender.com/api/login",
        {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      const userData = JSON.stringify(data.user);
      localStorage.setItem("userinfo", userData);
      localStorage.setItem("token", data.token);
      setMessage(data.message);
      if (userData) {
        setLoading(false);
        history.push("/chats");
      } else {
        setLoading(false);
        setMessage(data.message);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      return (
        <Alert severity="warning">
          <AlertTitle>Warning</AlertTitle>
          This is a warning alert — <strong>Please select an image!</strong>
        </Alert>
      );
    }

    if (
      pics.type === "image/jpeg" ||
      pics.type === "image.png" ||
      pics.type === "image.jpg"
    ) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "Fun-Chaters");
      data.append("cloud_name", "selva-app");
      fetch("https://api.cloudinary.com/v1_1/selva-app/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      return (
        <Alert severity="warning">
          <AlertTitle>Warning</AlertTitle>
          This is a warning alert — <strong>Please select an image!</strong>
        </Alert>
      );
    }
  };

  return (
    <Container
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      maxWidth="xl"
    >
      <Container
        style={{ backgroundColor: "inherit" }}
        component="main"
        maxWidth="xs"
      >
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography className="title">Fun Chaters</Typography>
          {register ? (
            <Container>
              <Typography
                style={{ textAlign: "center" }}
                component="h1"
                variant="h5"
              >
                Signup
              </Typography>
              <Box
                component="form"
                onSubmit={handleSignUp}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="User Name"
                  name="username"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  autoComplete="username"
                  autoFocus
                />
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

                <OutlinedInput
                  required
                  fullWidth
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  name="password"
                  placeholder="Password *"
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="pic"
                  name="pic"
                  type="file"
                  onChange={(e) => {
                    postDetails(e.target.files[0]);
                  }}
                  autoFocus
                />

                {message !== "" && (
                  <p
                    style={{
                      color: "red",
                      fontSize: "14px",
                      textAlign: "center",
                    }}
                  >
                    {message}
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={loading}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading ? "Loading..." : "Signup"}
                </Button>
              </Box>
            </Container>
          ) : (
            <Container>
              <Typography
                style={{ textAlign: "center" }}
                component="h1"
                variant="h5"
              >
                Log in
              </Typography>
              <Box
                component="form"
                onSubmit={handleLogin}
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
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  autoFocus
                />
                <OutlinedInput
                  required
                  fullWidth
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  name="password"
                  placeholder="Password *"
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                {message !== "" && (
                  <p
                    style={{
                      color: "red",
                      fontSize: "14px",
                      textAlign: "center",
                    }}
                  >
                    {message}
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={loading}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  style={{ height: "50px" }}
                >
                  {loading ? "Loading..." : "Login"}
                </Button>{" "}
              </Box>{" "}
            </Container>
          )}

          <Grid container>
            <Grid item xs>
              <small
                style={{ cursor: "pointer" }}
                onClick={() => history.push("/reset")}
                variant="body2"
              >
                Forgot password?
              </small>
            </Grid>
            <Grid item>
              {register ? (
                <small
                  onClick={() => setRegister(!register)}
                  style={{ cursor: "pointer" }}
                  variant="body2"
                >
                  {"Already Login?"}
                </small>
              ) : (
                <small
                  onClick={() => setRegister(!register)}
                  style={{ cursor: "pointer" }}
                  variant="body2"
                >
                  {"Don't have an account? Sign Up"}
                </small>
              )}
            </Grid>
          </Grid>
          {register ?  "" : (
          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
              border: "1px solid red",
              padding: "10px",
            }}
          >
            <h3>Sample logins</h3>
            <p>
              Email: selva@gmail.com{" "}
              <span style={{ marginLeft: "10px" }}>PW: Selva123</span>
            </p>
            <p>
              Email: abcd@gmail.com{" "}
              <span style={{ marginLeft: "10px" }}>PW: Selva123</span>
            </p>
          </div>
          )}
        </Box>
      </Container>
    </Container>
  );
};

export default HomePage;
