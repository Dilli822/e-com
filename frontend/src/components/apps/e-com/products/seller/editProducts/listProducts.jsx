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
  IconButton,
  TextField,
} from "@material-ui/core";
import { Snackbar, Alert } from "@material-ui/core";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
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

export default function SellerProductsList() {
  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState({});
  const [userId, setUserId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);


  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
  };
  

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
      let data = await response.json();
      // Sort products by date in ascending order
      data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      // Reverse the order to make the last item first
      data.reverse();
      setProducts(data);
      const sellerId = data[0]?.seller;
      setUserId(sellerId);
    } catch (error) {
      console.error("Error fetching seller products:", error);
    } finally {
      setLoading(false);
    }
  };

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
      const requestData = {
        product_name: editedProduct.product_name,
        description: editedProduct.description,
        category: editedProduct.category,
        price: editedProduct.price,
        discount: editedProduct.discount,
        seller: userId,
      };

   if (imageFile) {
      requestData.image = imageFile;
    }

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

      const updatedProducts = products.map((product) =>
        product.id === selectedProduct.id
          ? { ...product, ...requestData }
          : product
      );
      setProducts(updatedProducts);
      setSuccessMessage("Product updated successfully");
      setEditedProduct({});
      setTimeout(() => {
        setEditModalOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Error updating product:", error);
      setErrorMessage("Failed to update product. Please try again later.");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "category_name") {
      const category = products.find(
        (product) => product.category_name === value
      );
      if (category) {
        setEditedProduct((prevProduct) => ({
          ...prevProduct,
          category: category.category,
          [name]: value,
        }));
      }
    } else {
      setEditedProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    }
  };

  const handleDeleteConfirmation = (productId) => {
    setDeleteProductId(productId);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/e-com/api/seller/products/edit/${deleteProductId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      const updatedProducts = products.filter(
        (product) => product.id !== deleteProductId
      );
      setProducts(updatedProducts);
      setDeleteSuccessMessage("Product deleted successfully");
      setTimeout(() => {
        setDeleteSuccessMessage("");
      }, 3000); // 3 seconds timeout
    } catch (error) {
      console.error("Error deleting product:", error);
      setDeleteErrorMessage(
        "Failed to delete product. Please try again later."
      );
      setTimeout(() => {
        setDeleteErrorMessage("");
      }, 3000); // 3 seconds timeout
    } finally {
      setDeleteConfirmationOpen(false);
    }
  };

  const handleCancel = () => {
    setEditModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteProductId(null);
    setDeleteConfirmationOpen(false);
  };


  const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Render the buttons dynamically
  const renderPageButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <IconButton
        key={i}
        onClick={() => setCurrentPage(i)}
        color={currentPage === i ? "primary" : "default"}
      >
        {i}
      </IconButton>
      );
    }
    return buttons;
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
            style={{ maxHeight: "100%" }}
          >
            {/* Display total number of items */}
            <Typography variant="h6">
              Total Number of Items: {products.length}
            </Typography>
            <Table stickyHeader aria-label="seller products table">
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Specifications</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Discount</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.product_name}</TableCell>
                    <TableCell>
                      <img
                        src={product.image}
                        alt=""
                        style={{ width: "150px" }}
                      />
                    </TableCell>
                    <TableCell>
                      {product.description.length > 115
                        ? `${product.description.slice(0, 115)}...`
                        : product.description}
                    </TableCell>

                    <TableCell>
                      {product.specifications.length > 115
                        ? `${product.specifications.slice(0, 115)}...`
                        : product.specifications}
                    </TableCell>

                    <TableCell>{product.category_name}</TableCell>
                    <TableCell>{product.discount}%</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>
                      <div style={{ display: "flex" }}>
                        <Button
                          onClick={() => handleEdit(product)}
                          variant="contained"
                          color="primary"
                          style={{ marginRight: "8px" }}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteConfirmation(product.id)}
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

        {/* Error Message */}
        {deleteErrorMessage && (
          <Typography variant="body1" color="error">
            <br />
            {deleteErrorMessage}
          </Typography>
        )}
        {/* Success Message */}
        {deleteSuccessMessage && (
          <Typography variant="body1" color="primary">
            <br />
            {deleteSuccessMessage}
          </Typography>
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
  type="file"
  onChange={handleImageChange}
  fullWidth
  margin="normal"
  inputProps={{ accept: "image/*" }}
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

        <Modal
          open={deleteConfirmationOpen}
          onClose={handleDeleteCancel}
          className={classes.modal}
        >
          <div className={classes.modalContent}>
            <Typography variant="h6">Confirm Deletion</Typography>
            <Typography variant="body1">
              Are you sure you want to delete this product?
            </Typography>
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={handleDeleteConfirm}
            >
              Confirm
            </Button>
            &nbsp; &nbsp;
            <Button
              variant="contained"
              color="primary"
              onClick={handleDeleteCancel}
            >
              Cancel
            </Button>
          </div>
        </Modal>
      </Grid>

      <div style={{ display: "flex", alignItems: "center"}}>
        <ArrowBackIosIcon/>{renderPageButtons()} <ArrowForwardIosIcon/>
        </div>
    </Grid>
  );
}
