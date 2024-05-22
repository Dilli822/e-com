import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Header from "../../../header/header";
import AppFooter from "../../../footer/footer";
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
import SellerProductsList from "./listProducts";

const API_URL = "http://127.0.0.1:8000/e-com/api/seller/products/list/";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
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

const SellerProductsEdit = () => {
  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState({});

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

  const handleSaveChanges = () => {
    // Handle save action, e.g., update product data
    console.log("Updated product:", editedProduct);
    // Close the modal
    setEditModalOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleDelete = () => {};

  const handleCancel = () => {
    setEditModalOpen(false);
  };

  return (
    <>
      <SellerProductsList
        products={products}
        loading={loading}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default SellerProductsEdit;
