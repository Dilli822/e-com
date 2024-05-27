import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Modal,
  TextField,
} from "@material-ui/core";

const API_URL = "http://127.0.0.1:8000/e-com/api/seller/products/list/";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: theme.spacing(2),
  },
  tableContainer: {
    maxHeight: 440,
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const SellerProductsList = () => {
  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState({});
  const [userId, setUserId] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch seller products");
      }
      const data = await response.json();
      setProducts(data);
      // Accessing the seller key value from the first object
      const sellerId = data[0]?.seller;
      console.log("Seller ID:", sellerId);
      setUserId(sellerId);
    } catch (error) {
      console.error("Error fetching seller products:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log(userId);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditedProduct({ ...product });
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const handleSaveChanges = async () => {
    try {
      // Prepare the data to be sent to the backend
      const requestData = {
        product_name: editedProduct.product_name,
        description: editedProduct.description,
        category: editedProduct.category,
        price: editedProduct.price,
        discount: editedProduct.discount,
        seller: userId,
      };

      const response = await fetch(
        `http://127.0.0.1:8000/e-com/api/seller/products/edit/${selectedProduct.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      // Update local state with the edited product
      const updatedProducts = products.map((product) => {
        if (product.id === selectedProduct.id) {
          return { ...product, ...requestData };
        }
        return product;
      });
      setProducts(updatedProducts);

      // Show success message
      setSuccessMessage("Product updated successfully");
      // Clear the edit form
      setEditedProduct({});
      // Close the modal after a short delay
      setTimeout(() => {
        setEditModalOpen(false);
      }, 2000); // Close modal after 2 seconds (2000 milliseconds)
    } catch (error) {
      console.error("Error updating product:", error);
      // Set error message
      setErrorMessage("Failed to update product. Please try again later.");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "category_name") {
      // Find the category object with the matching name
      const category = products.find(
        (product) => product.category_name === value
      );
      // If the category is found, set its id as the value
      if (category) {
        setEditedProduct((prevProduct) => ({
          ...prevProduct,
          category: category.category, // Set the category ID
          [name]: value,
        }));

        console.log(name);
      }
    } else {
      // For other fields, update as usual
      setEditedProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    }
  };

  const handleDelete = (productId) => {
    // Implement the delete functionality here
  };

  const handleCancel = () => {
    setEditModalOpen(false);
  };

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Seller Products
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer
            component={Paper}
            className={classes.tableContainer}
            style={{ maxHeight: "100%"}}
          >
            <Table stickyHeader aria-label="seller products table">
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Discount</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.product_name}</TableCell>
                    <TableCell>
                      <img
                        src={product.image}
                        alt=""
                        style={{ width: "150px" }}
                      />
                    </TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>{product.category_name}</TableCell>
                    <TableCell>{product.discount}%</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>
                      <div style={{ display: "flex" }}>
                        <Button
                          onClick={() => handleEdit(product)}
                          variant="contained"
                          color="primary"
                          style={{ marginRight: "8px" }} // Adjust spacing between buttons if needed
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(product.id)}
                          variant="outlined"
                          color="secondary"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Modal
          open={editModalOpen}
          onClose={handleCloseEditModal}
          className={classes.modal}
        >
          <div className={classes.modalContent}>
            <Typography variant="h6">Edit Product</Typography>
            <TextField
              label="Product Name"
              name="product_name"
              value={editedProduct.product_name || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              value={editedProduct.description || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Category"
              name="category_name"
              value={editedProduct.category_name || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Price"
              name="price"
              value={editedProduct.price || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Discount (%)"
              name="discount"
              value={editedProduct.discount || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <br />
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveChanges}
            >
              Save
            </Button>
            &nbsp; &nbsp;
            <Button variant="contained" color="primary" onClick={handleCancel}>
              Cancel
            </Button>
            {/* Error Message */}
            {errorMessage && (
              <Typography variant="body1" color="error">
                <br />
                {errorMessage}
              </Typography>
            )}
            {/* Success Message */}
            {successMessage && (
              <Typography variant="body1" color="primary">
                <br />
                {successMessage}
              </Typography>
            )}
          </div>
        </Modal>
      </Grid>
    </Grid>
  );
};

export default SellerProductsList;
