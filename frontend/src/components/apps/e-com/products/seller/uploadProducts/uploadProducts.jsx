import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Grid,
  Typography,
  Container,
} from "@material-ui/core";
import { Link } from "react-router-dom";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discount: "",
    price: "",
    category: "",
    seller: "",
    stock: "",
    image: null,
  });

  const [message, setMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState(null);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    // Replace multiple consecutive spaces with a single space
    const formattedValue = value.replace(/\s+/g, ' ');
    setFormData({
      ...formData,
      [name]: formattedValue,
    });
  };
  
  const handleImageChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      image: e.target.files[0],
    }));

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
      formDataToSend.append("category", selectedCategory);
      formDataToSend.append("seller", userId);
      formDataToSend.append("stock", formData.stock);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        "http://127.0.0.1:8000/e-com/api/products/upload/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setMessage("Product added successfully!");
      setFormData({
        name: "",
        description: "",
        discount: "",
        price: "",
        category: "",
        seller: "",
        stock: "",
        image: null,
      });
      setImageUrl("");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("An error occurred:", error);
      setMessage("An error occurred. Please try again.");
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
      localStorage.setItem("categories", JSON.stringify(data));
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return (
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
    );
  }

  return (
    <>
      <Typography variant="h5" gutterBottom>
        <br />
        Add Product
      </Typography>
      <Grid
        container
        direction="column"
        // justify="center"
        // alignItems="center"
        // style={{ minHeight: "100vh" }}
      >
        <Grid item md={12}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item md={5}>
                <TextField
                  name="name"
                  label="Name"
                  value={formData.name}
                  onChange={handleFormChange}
                  error={errorMessages.name !== undefined}
                  helperText={errorMessages.name}
                  required
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item md={3}>
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
                  margin="normal"
                  variant="outlined"
                />
              </Grid>

              <Grid item md={3}>
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
                  margin="normal"
                  variant="outlined"
                />
              </Grid>

              <Grid item md={4}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="category-select-label">
                    Select Category
                  </InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    input={<OutlinedInput label="Select Category" />}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item md={3}>
                <TextField
                  name="stock"
                  label="Stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Grid item md={11}>
              <TextField
                name="description"
                label="Description"
                placeholder={`Introducing the Safety Always 240 mm 8 Pads by Safety, designed for light flow days. With wings for added protection, these straight fluffy pads come in a multi-pack of 8, offering odor neutralizing scent feature and a shelf life of 24 months. The white color and 300g weight make them convenient for on-the-go use. Ideal for feminine hygiene, these sanitary pads cater to women’s health needs.`}
                value={formData.description}
                onChange={handleFormChange}
                error={errorMessages.description !== undefined}
                helperText={errorMessages.description}
                required
                fullWidth
                variant="outlined"
                margin="normal"
                multiline
                rows={7} // You can adjust the number of rows as needed
              />
            </Grid>
            <Grid item md={11}>
              <TextField
                name="specifications"
                label="Specifications"
                placeholder={`Maintain a clean and organized layout for easy readability for your business.
Brand Name: \n
Package Included:\n
1 x Hair Clipper(Built in 1 Li ion Battey)\n
4 x Limit Comb\n
1 x USB Charging Socket\n
1 x Cleaning Brush\n
1 x User Manual\n
Specifications:\n
Color: As shown in the picture\n
Material: ABS\n
Power: 5 (W)\n
Charging Time: About 2 hours\n
Use Time: About 2 hours\n
Charging Type: USB Charging Socket\n
Battery: Built in 18500 Li ion Battery\n
Features:\n
Stainless steel blade can be washed.\n
Four limit combs(1.5/2/3/4mm) for different length of hair.\n
Low noise design,low decibels, no serious noise during work.\n
USB Charging Socket,can be charged by mobile power / laptop / car, convenient and fast.\n
                  `}
                value={formData.specifications}
                onChange={handleFormChange}
                error={errorMessages.specifications !== undefined}
                helperText={errorMessages.specifications}
                required
                fullWidth
                variant="outlined"
                margin="normal"
                multiline
                rows={20} // You can adjust the number of rows as needed
              />
            </Grid>
            <Typography variant="body2" gutterBottom>
              Upload Product Images:
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              fullWidth
              style={{ marginBottom: "10px" }}
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Product"
                style={{
                  maxWidth: "100px",
                  maxHeight: "100px",
                  marginBottom: "10px",
                }}
              />
            )}
            <br /> <br />
            <Grid item md={2}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
              >
                Submit
              </Button>
            </Grid>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              message={message}
            />
          </form>
        </Grid>
      </Grid>
    </>
  );
};

export default ProductForm;
