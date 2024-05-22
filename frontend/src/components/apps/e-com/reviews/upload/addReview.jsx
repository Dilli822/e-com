// import React, { useState } from 'react';
// import { Slider, Button, Grid, TextField, Box, Typography } from '@mui/material';

// export default function AddReview() {
//     const [formData, setFormData] = useState({
//         rating: 4, // Default rating value
//         comment: 'Very Good Product!',
//         product: 3, // Replace with the actual product ID
//         user: 3 // Replace with the actual user ID
//     });

//     const handleChange = (event, newValue) => {
//         setFormData({
//             ...formData,
//             rating: newValue
//         });
//     };

//     const handleSubmit = async () => {
//         try {
//             const token = localStorage.getItem('accessToken'); // Retrieve token from local storage (replace with actual method)

//             // Convert rating to integer
//             const ratingInt = Math.round(formData.rating); // Convert the rating to the nearest integer

//             const response = await fetch('http://127.0.0.1:8000/e-com/api/reviews/create/', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}` // Include the token in the headers
//                 },
//                 body: JSON.stringify({ ...formData, rating: ratingInt }) // Send the integer rating to the backend
//             });

//             if (response.ok) {
//                 console.log('Review created successfully!');
//             } else {
//                 const data = await response.json();
//                 console.error('Failed to create review:', data);
//             }
//         } catch (error) {
//             console.error('Error creating review:', error);
//         }
//     };

//     return (
//         <Box
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//             minHeight="100vh"
//         >
//             <Grid container spacing={2} component="form" item xs={12} sm={6} md={4}>
//                 <Grid item xs={12}>
//                     <Typography variant="h5">
//                         Add Review
//                     </Typography>
//                     <Slider
//                         value={formData.rating}
//                         onChange={handleChange}
//                         aria-labelledby="discrete-slider"
//                         valueLabelDisplay="auto"
//                         step={0.5}
//                         marks
//                         min={1}
//                         max={6}
//                     />
//                 </Grid>
//                 <Grid item xs={12}>
//                     <TextField
//                         name="comment"
//                         label="Comment"
//                         value={formData.comment}
//                         onChange={handleChange}
//                         required
//                         multiline
//                         fullWidth
//                     />
//                 </Grid>
//                 {/* Add input fields for product and user if needed */}
//                 <Grid item xs={12} sm={6}>
//                     <Button onClick={handleSubmit} variant="contained" color="primary" fullWidth>
//                         Submit Review
//                     </Button>
//                 </Grid>
//             </Grid>
//         </Box>
//     );
// }

import React, { useState } from "react";
import {
  Slider,
  Button,
  Grid,
  TextField,
  Box,
  Typography,
} from "@mui/material";

export default function AddReview() {
  const [formData, setFormData] = useState({
    rating: 4,
    comment: "",
    product: "",
    user: "",
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (event, newValue) => {
    setFormData({
      ...formData,
      [event.target.name]: newValue,
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        "http://127.0.0.1:8000/e-com/api/reviews/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setSuccessMsg("Review created successfully!");
        setErrorMsg("");
      } else {
        const data = await response.json();
        setErrorMsg("Failed to create review: " + JSON.stringify(data));
        setSuccessMsg("");
      }
    } catch (error) {
      console.error("Error creating review:", error);
      setErrorMsg("Error creating review: " + error.message);
      setSuccessMsg("");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Grid container spacing={2} component="form" item xs={12} sm={6} md={4}>
        <Grid item xs={12}>
          <Typography variant="h5">Add Review</Typography>
          <Slider
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={0.5}
            marks
            min={1}
            max={6}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="comment"
            label="Comment"
            value={formData.comment}
            onChange={handleChange}
            required
            multiline
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="product"
            label="Product ID"
            value={formData.product}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="user"
            label="User ID"
            value={formData.user}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            fullWidth
          >
            Submit Review
          </Button>
        </Grid>
        {successMsg && (
          <Grid item xs={12}>
            <Typography variant="body1" color="primary">
              {successMsg}
            </Typography>
          </Grid>
        )}
        {errorMsg && (
          <Grid item xs={12}>
            <Typography variant="body1" color="error">
              {errorMsg}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
