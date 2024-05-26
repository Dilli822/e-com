import React, { useState, useEffect } from "react";
import { TextField, Button, Snackbar } from "@material-ui/core";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Grid,
  Typography
} from "@material-ui/core";
import { Container } from "@mui/material";
import { useLocation, useNavigate, Link } from "react-router-dom";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discount: "",
    price: "",
    category: "", // Instead of storing category name, store category ID
    seller: "",
    stock: "", // New field for stock input
    image: null, // Image file
  });

  const [message, setMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(""); // State variable for image URL
  const [userId, setUserId] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [error, setError] = useState(null);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category ID

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      image: e.target.files[0], // Update image file
    }));

    // Set image URL for rendering
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setImageUrl(fileReader.result);
    };
    fileReader.readAsDataURL(e.target.files[0]);
  };

  const fetchUserId = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/account/user/details/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUserId(data.id);
        setBuyerName(data.username);
        setBuyerEmail(data.email);
      } else {
        setError("Failed to fetch user ID");
      }
    } catch (error) {
      setError("Error fetching user ID");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("product_name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("discount", formData.discount);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category", selectedCategory); // Use selectedCategory instead of formData.category
      formDataToSend.append("seller", userId);
      formDataToSend.append("stock", formData.stock); // Include stock in form data

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      } // Append image file)

      const token = localStorage.getItem("accessToken"); // Retrieve token from localStorage
      const response = await fetch(
        "http://127.0.0.1:8000/e-com/api/products/upload/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the Authorization header
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        // If response not okay, throw an error
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // If response is successful
      const data = await response.json();
      console.log(data); // Handle success response
      setMessage("Product added successfully!");
      setFormData({
        product_name: "",
        description: "",
        discount: "",
        price: "",
        category: "",
        seller: "",
        stock: "", // Clear stock field
        image: null,
      }); // Clear form input fields
      setImageUrl(""); // Clear image URL
      setSnackbarOpen(true); // Open success snackbar
    } catch (error) {
      // Handle error
      console.error("An error occurred:", error);
      setMessage("An error occurred. Please try again."); // Set error message
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchUserId();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/e-com/api/categories/list/"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      localStorage.setItem("categories", JSON.stringify(data)); // Save data to local storage
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value); // Update selectedCategory with the selected category ID
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
                <span>Please Login as Admin / Seller</span>
              </Button>
            </Link>
          </Typography>
        </Container>
      </>
    ); // Don't render form if there's no access token
  }


  return (
    <Container>
      <h2>Add Products</h2>
      <Grid container spacing={2} xs={12}>
        <form onSubmit={handleSubmit}>
          <TextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleFormChange}
            error={errorMessages.name !== undefined}
            helperText={errorMessages.name}
            required
            fullWidth
          />
          <br />
          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleFormChange}
            error={errorMessages.description !== undefined}
            helperText={errorMessages.description}
            required
            fullWidth
          />
          <br />
          <TextField
            name="discount"
            label="Discount"
            type="number"
            value={formData.discount}
            onChange={handleFormChange}
            error={errorMessages.discount !== undefined}
            helperText={errorMessages.discount}
            required
            fullWidth
          />
          <br />
          <TextField
            name="price"
            label="Price"
            type="number"
            value={formData.price}
            onChange={handleFormChange}
            error={errorMessages.price !== undefined}
            helperText={errorMessages.price}
            required
            fullWidth
          />
          <br />
          <InputLabel id="category-select-label">Select Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
            fullWidth
            input={<OutlinedInput label="Select Category" />}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          <br />
          <TextField
            name="stock"
            label="Stock"
            type="number"
            value={formData.stock}
            onChange={handleFormChange}
            fullWidth
          />
          <br />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            fullWidth
            style={{ margin: "10px 0" }}
          />
          <br />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Product"
              style={{ maxWidth: "100px", maxHeight: "100px" }}
            />
          )}{" "}
          {/* Render uploaded image */}
          <br />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
          <Snackbar
            fullWidth
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            message={message}
          />
        </form>
      </Grid>
    </Container>
  );
};

export default ProductForm;
