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
  Button,
  Modal,
  Snackbar,
  Alert,
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
  flexGrow: 2, // Ensure the table container takes up remaining space
  maxWidth: "100%", // Ensure the table stretches out
});

const StyledTableCellContent = styled(TableCell)({
  wordBreak: "break-word",
});

function ManageSellersOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [orderToShip, setOrderToShip] = useState(null); // State to store the order to be shipped
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null); // State to store the order to be cancelled
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success", "error", "warning", "info"

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
    const order = orders.find((order) => order.id === orderId);

    // Check if the order has already been canceled
    if (order.order_cancelled_by_seller) {
      setSnackbarMessage(
        "This order has already been canceled and cannot be shipped."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return; // Exit the function to prevent further execution
    }

    // If the order is not canceled, proceed to open the confirmation modal
    setConfirmModalOpen(true);
    setOrderToShip(order);
  };

  const handleConfirmShipOrder = async () => {
    if (orderToShip) {
      const updatedOrder = {
        ...orderToShip,
        order_shipped: true,
        order_pending: false,
      };

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/e-com/api/sellers/orders/edit/bulk/",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify([updatedOrder]),
          }
        );

        if (response.ok) {
          const updatedOrders = orders.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          );
          setOrders(updatedOrders);
          setConfirmModalOpen(false);
          setSnackbarMessage("Order shipped successfully");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        } else {
          setError("Failed to update order");
          setSnackbarMessage("Failed to update order");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error) {
        setError("Error updating order");
        setSnackbarMessage("Error updating order");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } else {
      console.error("Order not found");
    }
  };

  const handleCancelOrder = async (orderId) => {
    setCancelModalOpen(true);
    const order = orders.find((order) => order.id === orderId);
    setOrderToCancel(order);
  };

  const handleConfirmCancelOrder = async () => {
    if (orderToCancel) {
      const updatedOrder = {
        ...orderToCancel,
        order_shipped: false,
        order_pending: true,
        order_delivered: false,
        order_placed_by_buyer: true,
        order_cancelled_by_seller: true,
      };

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/e-com/api/sellers/orders/edit/bulk/",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify([updatedOrder]),
          }
        );

        if (response.ok) {
          const updatedOrders = orders.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          );
          setOrders(updatedOrders);
          setCancelModalOpen(false);
          setSnackbarMessage("Order cancelled successfully");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        } else {
          setError("Failed to cancel the order");
          setSnackbarMessage("Failed to cancel the order");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error) {
        setError("Error canceling the order");
        setSnackbarMessage("Error canceling the order");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } else {
      console.error("Order not found");
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
                <StyledTableCell>Ordered At</StyledTableCell>
                <StyledTableCell>Order Shipped</StyledTableCell>
                <StyledTableCell>Order Delivered</StyledTableCell>
                <StyledTableCell>Order Received</StyledTableCell>
                <StyledTableCell>Order Cancelled</StyledTableCell>
                <StyledTableCell style={{ minWidth: "10em" }}>
                  Actions
                </StyledTableCell>
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
                          <LocalShippingIcon style={{ color: "green", fontSize: "2em" }} />
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
                    {order.order_received ? (
                      <Tooltip title="Not Received">
                        <IconButton>
                          <CancelIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Received">
                        <IconButton>
                          <CheckCircleIcon style={{ color: "green" }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </StyledTableCellContent>
                  <StyledTableCellContent>
                    {order.order_cancelled_by_seller ? (
                      <Tooltip title="Not Cancelled">
                        <IconButton>
                          <CheckCircleIcon color="success" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Cancelled">
                        <IconButton>
                          <CancelIcon style={{ color: "red" }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </StyledTableCellContent>

                  <StyledTableCellContent>
                    <Grid container spacing={1}>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleShipOrder(order.id)}
                          disabled={
                            order.order_shipped ||
                            order.order_cancelled_by_seller
                          }
                        >
                          Ship
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={order.order_cancelled_by_seller}
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  </StyledTableCellContent>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>

        <Modal
          open={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
        >
          {/* Shipment Confirmation Modal */}
          <Paper
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              padding: "2em",
              width: "300px",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Confirm Shipment
            </Typography>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to mark this order as shipped?
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleConfirmShipOrder}
                >
                  Yes
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setConfirmModalOpen(false)}
                >
                  No
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Modal>
        <Modal open={cancelModalOpen} onClose={() => setCancelModalOpen(false)}>
          {/* Cancellation Confirmation Modal */}
          <Paper
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              padding: "2em",
              width: "300px",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Confirm Cancellation
            </Typography>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to cancel this order?
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleConfirmCancelOrder}
                >
                  Yes
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setCancelModalOpen(false)}
                >
                  No
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Modal>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </>
    </GlobalStyles>
  );
}

export default ManageSellersOrders;
