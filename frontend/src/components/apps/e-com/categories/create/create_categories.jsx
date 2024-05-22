import React, { useState } from "react";
import { TextField, Button, Snackbar, Grid } from "@material-ui/core";

const CRUDCategoryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken"); // Retrieve token from localStorage
      const response = await fetch(
        "http://127.0.0.1:8000/e-com/api/categories/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token in the Authorization header
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        // If response not okay, throw an error
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

   // If response is successful
   const data = await response.json();
   console.log(data); // Handle success response
   setMessage("Category updated successfully!");
   setFormData({ name: "", description: "" }); // Clear form input fields
   setSnackbarOpen(true); // Open success snackbar
   
    } catch (error) {
      // Handle error
      console.error("An error occurred:", error);
      setMessage("An error occurred. Please try again."); // Set error message
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Grid container justify="center">
      <form onSubmit={handleSubmit}>
        <TextField
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
          error={errorMessages.name !== undefined}
          helperText={errorMessages.name}
          required
        />
        <br />
        <TextField
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          error={errorMessages.description !== undefined}
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
        />
      </form>
    </Grid>
  );
};

export default CRUDCategoryForm;
