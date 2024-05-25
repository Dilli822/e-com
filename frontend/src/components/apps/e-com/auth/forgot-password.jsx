import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppHeader from "../header/headerPublic";
import AppFooter from "../footer/footer";
import Box from "@mui/material/Box";
import { Container, Typography, TextField, Button, Alert } from "@mui/material";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/account/password-reset-email/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message === "Email not found in the database.") {
          throw new Error(
            "Email not found. Please check your email address and try again."
          );
        } else {
          throw new Error("Failed to send reset password email");
        }
      }

      setShowErrorMessage(false);
      setShowSuccessMessage(true);
    } catch (error) {
      setShowErrorMessage(true);
      setShowSuccessMessage(false);
      setErrorMessage(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (localStorage.getItem("accessToken")) {
    navigate("/feed");
    return null;
  }

  return (
    <>
      <AppHeader />
      <Container maxWidth="sm" style={{ minHeight: "35vh"}}>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Reset Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? "Sending..." : "Submit"}
            </Button>
            <br /> <br />
            <Button
              component={Link}
              to="/login"
              fullWidth
              variant="outlined"
              color="primary"
            >
              Back to login
            </Button>
            {showSuccessMessage && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Reset password link in your email sent successfully! <br />
                Please check your email inbox/spam to reset the password. Thanks
              </Alert>
            )}
            {showErrorMessage && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errorMessage}
              </Alert>
            )}
          </Box>
        </Box>
      </Container>

      <br />
      <br />
      <AppFooter />
    </>
  );
};

export default ForgotPassword;
