import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FormControl, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";

import HeaderPublic from "../header/headerPublic";
import AppFooter from "../footer/footer";

const theme = createTheme();

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userType, setUserType] = useState("buyer");
  const navigate = useNavigate();

  
  const onFinish = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);

      // Fetch values from input fields
      const username = event.target.username.value;
      const email = event.target.email.value;
      const password = event.target.password.value;
      const confirmPassword = event.target.confirmPassword.value;

      // Check if passwords match
      if (password !== confirmPassword) {
        setShowErrorMessage(true);
        setErrorMessage("Passwords do not match.");
        return; // Exit function if passwords don't match
      }

      // Construct the data object
      const values = {
        username: username,
        email: email,
        password: password,
        is_seller: userType === "seller",
        is_buyer: userType === "buyer",
      };

      // Use the register API endpoint
      const response = await fetch(
        "http://127.0.0.1:8000/account/auth/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        setShowSuccessMessage(true);
        // Clear input fields
        event.target.reset();
        setTimeout(() => {
          navigate("/login");
        }, 5000); // 1000 milliseconds = 1 second
      } else {
        const errorData = await response.json();
        setShowErrorMessage(true);
        let errorMessage =
          errorData.message ||
          "Error during registration. Please try again later.";

        // Check if specific error messages are received
        if (errorData.email) {
          errorMessage = errorData.email[0];
        } else if (errorData.username) {
          errorMessage = errorData.username[0];
        }

        setErrorMessage(errorMessage);
      }
    } catch (error) {
      setShowErrorMessage(true);
      console.error(error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      navigate("/feed");
    }
  }, [navigate]);


  return (
    <ThemeProvider theme={theme}>
      <HeaderPublic />

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" onSubmit={onFinish} noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="given-name"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="confirmPassword"
                  type="password"
                  id="confirmPassword"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="user-type-label">User Type</InputLabel>
                  <Select
                    labelId="user-type-label"
                    id="userType"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    label="User Type"
                  >
                    <MenuItem value="buyer">Buyer</MenuItem>
                    <MenuItem value="seller">Seller</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I agree to the terms and conditions."
                />
              </Grid>
            </Grid>
            {showErrorMessage && (
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                <h3>{errorMessage.toUpperCase()}</h3>
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? "Loading..." : "Sign Up"}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
          {showSuccessMessage && (
            <div
              style={{
                textAlign: "center",
                marginTop: "20px",
                animation: "fadeInOut 2s ease-in-out",
              }}
            >
              <Typography variant="h3" color="success">
                Registration successful!
              </Typography>
              <Typography variant="body2" color="success" sx={{ mt: 1 }}>
                Redirecting to login...
              </Typography>
            </div>
          )}
        </Box>
      </Container>
      <br />
      <br />
      <AppFooter />
    </ThemeProvider>
  );
}
