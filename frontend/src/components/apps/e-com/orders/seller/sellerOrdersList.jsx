
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Grid,
  Button,Modal
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { styled } from "@mui/system";

const GlobalStyles = styled("div")({
  html: {
    margin: 0,
    padding: 0,
    width: "100%",
  },
  body: {
    margin: 0,
    padding: 0,
    width: "100%",
  },
  "#root": {
    width: "100%",
  },
});

const FullPageContainer = styled(Container)({
  paddingTop: 0,
  paddingBottom: 0,
  margin: 0,
  width: "100%!important",
  display: "flex",
  flexDirection: "column",
  maxWidth: "100% !important", // Override any default maxWidth
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.grey[200],
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

const StyledTableContainer = styled(TableContainer)({
  flexGrow: 1, // Ensure the table container takes up remaining space
  maxWidth: "100%", // Ensure the table stretches out
});

const StyledTableCellContent = styled(TableCell)({
  wordBreak: "break-word",
});

function ManageSellersOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [confirmModalOpen,setConfirmModalOpen] = useState(false);
  const [orderToShip, setOrderToShip] = useState(null); // State to store the order to be shipped

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/e-com/api/sellers/orders/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        // console.log(data);
      } else {
        setError("Failed to fetch orders");
      }
    } catch (error) {
      setError("Error fetching orders");
    }
  };


  const handleShipOrder = async (orderId) => {
    setConfirmModalOpen(true)
    const order = orders.find((order) => order.id === orderId);
       console.log("Order Details:", order); 

       setOrderToShip(order);
 
  };

  const handleConfirmShipOrder = async () => {
    if (orderToShip) {
      // Clone the order object and update the required properties
      const updatedOrder = {
        ...orderToShip,
        order_shipped: true,
        order_pending: false,
      };
  
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/e-com/api/sellers/orders/edit/bulk/",
          {
            method: "PUT", // Use POST method for updating data
            headers: {
              "Content-Type": "application/json", // Specify content type as JSON
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify([updatedOrder]), // Convert the object to JSON string
          }
        );
  
        if (response.ok) {
          // Update the orders state with the modified order
          alert("Order Shipped Successfully")
          const updatedOrders = orders.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          );
          setOrders(updatedOrders);
          // Close the confirmation modal
          setConfirmModalOpen(false);
        } else {
          // Handle error response here
          setError("Failed to update order");
        }
      } catch (error) {
        // Handle network or other errors
        setError("Error updating order");
      }
    } else {
      console.error("Order not found");
    }
  };
  


  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/e-com/api/sellers/orders/${orderId}/cancel/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        fetchOrders(); // Refresh orders list after updating
      } else {
        setError("Failed to cancel the order");
      }
    } catch (error) {
      setError("Error canceling the order");
    }
  };




  

  return (
    <GlobalStyles>
      <br />
      <>
        <Typography variant="h4" gutterBottom>
          Sellers Orders Catalog
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <StyledTableContainer component={Paper} elevation={3}>
          <Table aria-label="Orders table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Order ID</StyledTableCell>
                <StyledTableCell>Delivery Address</StyledTableCell>
                <StyledTableCell>Product Name</StyledTableCell>
                <StyledTableCell>Product Price</StyledTableCell>
                <StyledTableCell>Units</StyledTableCell>
                <StyledTableCell>Delivery Fee</StyledTableCell>
                <StyledTableCell>Mode of Payment</StyledTableCell>
                <StyledTableCell style={{ minWidth: "10rem" }}>
                  Ordered At
                </StyledTableCell>
                <StyledTableCell>Order Shipped</StyledTableCell>
                <StyledTableCell>Order Delivered</StyledTableCell>
                <StyledTableCell>Order Received</StyledTableCell>
                <StyledTableCell>Order Cancelled</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <StyledTableRow key={order.id}>
                  <StyledTableCellContent>
                    {order.order_id}
                  </StyledTableCellContent>
                  <StyledTableCellContent>
                    {order.buyer_delivery_address}
                  </StyledTableCellContent>
                  <StyledTableCellContent>
                    {order.product_name}
                  </StyledTableCellContent>
                  <StyledTableCellContent>
                    {order.product_price}
                  </StyledTableCellContent>
                  <StyledTableCellContent>
                    {order.product_units}
                  </StyledTableCellContent>
                  <StyledTableCellContent>
                    {order.delivery_fee}
                  </StyledTableCellContent>
                  <StyledTableCellContent>
                    {order.mode_of_payment}
                  </StyledTableCellContent>
                  <StyledTableCellContent>
                    {new Date(order.created_at).toLocaleString()}
                  </StyledTableCellContent>
                  <StyledTableCellContent>
                    {order.order_shipped ? (
                      <Tooltip title="Shipped">
                        <IconButton>
                          <LocalShippingIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Not Shipped">
                        <IconButton>
                          <CancelIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </StyledTableCellContent>
                  <StyledTableCellContent>
                    {order.order_delivered ? (
                      <Tooltip title="Delivered">
                        <IconButton>
                          <CheckCircleIcon style={{ color: "green" }} />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Not Delivered">
                        <IconButton>
                          <CancelIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </StyledTableCellContent>
                  <StyledTableCellContent>
                    {order.order_placed_by_buyer ? (
                      <Tooltip title="Placed by Buyer">
                        <IconButton>
                          <CheckCircleIcon style={{ color: "green" }} />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Not Placed by Buyer">
                        <IconButton>
                          <CancelIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </StyledTableCellContent>
                  <StyledTableCellContent>
                    {order.order_cancelled_by_seller ? (
                      <Tooltip title="Cancelled by Seller">
                        <IconButton>
                          <CancelIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Blocked">
                        <IconButton>
                          <CancelIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </StyledTableCellContent>
                  <StyledTableCellContent>
                    {!order.order_shipped && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleShipOrder(order.id)}
                      >
                        Ship Order
                      </Button>
                    )}
                    {!order.order_cancelled_by_seller && (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Cancel Order
                      </Button>
                    )}
                  </StyledTableCellContent>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </>
      <br /> <br /> <br />

    {/* Confirmation Modal */}
    <Modal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        aria-labelledby="confirmation-modal"
        aria-describedby="confirm-ship-order"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper style={{ padding: "30px", minWidth: "700px" }}>
          <Typography variant="h6" gutterBottom>
            Confirm Shipping
          </Typography>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to ship this order?
          </Typography>
          <br />
          <Grid container spacing={1}>
  
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmShipOrder}
              >
                Confirm
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setConfirmModalOpen(false)}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
      
    </GlobalStyles>
  );
}

export default ManageSellersOrders;
