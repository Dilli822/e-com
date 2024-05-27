import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Checkbox,
  IconButton,
} from "@material-ui/core";
import { Delete, Remove, Add } from "@material-ui/icons";
import Header from "../header/header";
import HeaderPublic from "../header/headerPublic";
import AppFooter from "../footer/footer";

export default function CartDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [mustLoginMessage, setMustLoginMessage] = useState(false);

  useEffect(() => {
    if (location.state) {
      const savedCartItems =
        JSON.parse(localStorage.getItem("cartItems")) || [];
      const newCartItems = Array.isArray(location.state)
        ? location.state
        : [location.state];
      const updatedCartItems = newCartItems.reduceRight((acc, newItem) => {
        const existingItemIndex = acc.findIndex(
          (item) => item.product.id === newItem.product.id
        );
        if (existingItemIndex === -1) {
          acc.unshift(newItem); // Add new item to the beginning of the array
        } else {
          acc[existingItemIndex].quantity += newItem.quantity;
        }
        return acc;
      }, savedCartItems); // Concatenate new items with existing items in reverse order

      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      setCartItems(updatedCartItems);
    } else {
      const savedCartItems =
        JSON.parse(localStorage.getItem("cartItems")) || [];
      setCartItems(savedCartItems);
    }
  }, [location.state]);

  const handleOpenDeleteDialog = (index) => {
    setItemToDelete(index);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setItemToDelete(null);
  };

  const handleDeleteItem = () => {
    if (itemToDelete !== null) {
      const updatedCartItems = cartItems.filter(
        (_, index) => index !== itemToDelete
      );
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      setCartItems(updatedCartItems);
      handleCloseDeleteDialog();
    }
  };

  const handleIncrementQuantity = (index) => {
    const updatedCartItems = [...cartItems];
    const currentQuantity = updatedCartItems[index].quantity || 0;
    const stockLimit = updatedCartItems[index].product.stock;

    if (currentQuantity < stockLimit) {
      updatedCartItems[index].quantity = currentQuantity + 1;
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      setCartItems(updatedCartItems);
    } else {
      console.log("Cannot increase quantity, stock limit reached.");
    }
  };

  const handleDecrementQuantity = (index) => {
    const updatedCartItems = [...cartItems];
    if (updatedCartItems[index].quantity > 1) {
      updatedCartItems[index].quantity -= 1;
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      setCartItems(updatedCartItems);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedItems(cartItems.map((_, index) => index));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (index) => {
    if (selectedItems.includes(index)) {
      setSelectedItems(selectedItems.filter((item) => item !== index));
    } else {
      setSelectedItems([...selectedItems, index]);
    }
  };

  const handlePlaceOrder = () => {
    if (selectedItems.length > 0) {
      setOpenOrderDialog(true);
    } else {
      alert("Please select at least one item to place an order.");
    }
  };

  const handleConfirmOrder = () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken || isSeller) {
      setMustLoginMessage(true);
      return;
    }

    const checkOutItems = selectedItems.map((index) => cartItems[index]);
    setOpenOrderDialog(false);
    navigate("/checkout", { state: { checkOutItems } });
  };

  const getTotalPrice = () => {
    const totalPrice = cartItems.reduce((total, item, index) => {
      if (selectedItems.includes(index)) {
        total += item.product.price * item.quantity;
      }
      return total;
    }, 0);
    return totalPrice.toFixed(2);
  };

  const accessToken = localStorage.getItem("accessToken");
  const isSeller = document.getElementById("isSellerI");
  console.log(isSeller);

  return (
    <>
      {accessToken ? <Header /> : <HeaderPublic />}
      <Container>
        {/* Render cart details based on userType */}
        <br /> <br />
        <Typography variant="h5">Cart Items</Typography>
        <br />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={selectedItems.length === cartItems.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price/Item</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems
                .filter((item) => {
                  // Check if any value in the product object is not null
                  for (const key in item.product) {
                    if (item.product[key] !== null) {
                      return true; // Keep the item if any value is not null
                    }
                  }
                  return false; // Remove the item if all values are null
                })
                .map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(index)}
                        onChange={() => handleSelectItem(index)}
                      />
                    </TableCell>
                    <TableCell>{item.product.product_name}</TableCell>
                    <TableCell>
                      <img src={item.product.image} alt="Product" width="70" />
                    </TableCell>
                    <TableCell>{item.product.description}</TableCell>
                    <TableCell>
                      <b> ${item.product.price}</b>
                    </TableCell>
                    <TableCell>
                      <b>{item.product.stock}</b>
                    </TableCell>
                    <TableCell>
                      <span style={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                          color="secondary"
                          onClick={() => handleDecrementQuantity(index)}
                        >
                          <Remove />
                        </IconButton>

                        <b> {!isNaN(item.quantity) ? item.quantity : "0"} </b>
                        <IconButton
                          onClick={() => handleIncrementQuantity(index)}
                          style={{ color: "green" }}
                        >
                          <Add />
                        </IconButton>
                      </span>
                    </TableCell>
                    <TableCell>
                      <b>
                        {" "}
                        {!isNaN(item.product.price * item.quantity)
                          ? `$${(item.product.price * item.quantity).toFixed(
                              2
                            )}`
                          : "$0.00"}
                      </b>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDeleteDialog(index)}>
                        <Delete color="secondary" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <br />
        <Typography variant="h6">
          Total Price: ${!isNaN(getTotalPrice()) ? getTotalPrice() : "0"}
        </Typography>
        <br />
        <Button
          variant="outlined"
          color="secondary"
          onClick={handlePlaceOrder}
          disabled={selectedItems.length === 0}
        >
          Place Order
        </Button>
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>{"Delete Item"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this item from the cart?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteItem} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openOrderDialog}
          onClose={() => setOpenOrderDialog(false)}
        >
          <DialogTitle>{"Place Order"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to place the order for the selected items?
            </DialogContentText>
            {mustLoginMessage && (
              <Typography variant="body2" color="error">
                You must have an account to place an order. Please{" "}
                <Link to="/login">Login</Link> or{" "}
                <Link to="/signup">Sign up</Link>.
              </Typography>
            )}

            {/* {isSeller && (
              <Typography variant="body2" color="error">
                You are not authorized to Buy the product from the third party.{" "}
         
              </Typography>
            )} */}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenOrderDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmOrder} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      <br />
      <br />
      <AppFooter />
    </>
  );
}
