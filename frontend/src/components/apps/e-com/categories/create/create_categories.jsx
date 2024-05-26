import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Snackbar,
  Grid,
  Container,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
const CRUDCategoryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setMessage("No access token found. Please log in.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessages({});
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        "http://127.0.0.1:8000/e-com/api/categories/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          setErrorMessages(errorData.errors || {});
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setMessage("Category created successfully!");
      setSnackbarSeverity("success");
      setFormData({ name: "", description: "" });
      setSnackbarOpen(true);
    } catch (error) {
      console.error("An error occurred:", error);
      setMessage("An error occurred. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return (
      <>
        <Container>
          <Typography
            variant="h6"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
            }}
          >
            <span>You are not authorized to access this!</span>
            <Link to={`/login`} style={{ color: "inherit", marginTop: "8px" }}>
              <Button color="secondary" variant="contained">
                <span>Please Login as Admin</span>
              </Button>
            </Link>
          </Typography>
        </Container>
      </>
    ); // Don't render form if there's no access token
  }

  return (
    <Grid container justify="center">
      <form onSubmit={handleSubmit}>
        <TextField
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
          error={!!errorMessages.name}
          helperText={errorMessages.name}
          required
        />
        <br />
        <TextField
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          error={!!errorMessages.description}
          helperText={errorMessages.description}
          required
        />
        <br />
        <br />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={message}
          severity={snackbarSeverity}
        />
      </form>
    </Grid>
  );
};

export default CRUDCategoryForm;
