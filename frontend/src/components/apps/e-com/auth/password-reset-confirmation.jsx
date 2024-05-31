import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppHeader from "../header/headerPublic";
import AppFooter from "../footer/footer";
import Box from '@mui/material/Box';
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";

const ResetPasswordConfirm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    // Fetch additional data or perform any other side effects related to the token if needed
  }, [token]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setShowErrorMessage(true);
      setErrorMessage("Passwords do not match");
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8000/account/update-password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, new_password: password }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      setShowErrorMessage(false);
      setShowSuccessMessage(true);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setShowErrorMessage(true);
      setShowSuccessMessage(false);
      setErrorMessage(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppHeader />
      <Container maxWidth="sm">
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
              id="password"
              label="New Password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <TextField
              margin="normal"
              required
              fullWidth
              id="confirmPassword"
              label="Confirm New Password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
            <br></br>
            {showSuccessMessage && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Password updated successfully!
              </Alert>
            )}
            <br />
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

export default ResetPasswordConfirm;
