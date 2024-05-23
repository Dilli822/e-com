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
        console.log(data)
      } else {
        setError("Failed to fetch orders");
      }
    } catch (error) {
      setError("Error fetching orders");
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
            <TableHead >
              <TableRow>
                <StyledTableCell>Order ID</StyledTableCell>
                <StyledTableCell>Delivery Address</StyledTableCell>
                <StyledTableCell>Product Name</StyledTableCell>
                <StyledTableCell>Products Price</StyledTableCell>
                <StyledTableCell>Total Price</StyledTableCell>
                <StyledTableCell>Total Units</StyledTableCell>

                <StyledTableCell>Delivery Fee</StyledTableCell>
                <StyledTableCell>Mode of Payment</StyledTableCell>
                <StyledTableCell style={{ minWidth: "10rem"}}>Ordered At</StyledTableCell>
              
                <StyledTableCell>Order Shipped</StyledTableCell>

                <StyledTableCell >Order Delivered</StyledTableCell>
                <StyledTableCell>Order Received</StyledTableCell>
                <StyledTableCell>Order Cancelled </StyledTableCell>
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
                    {order.product_total_price}
                  </StyledTableCellContent>
                  <StyledTableCellContent>
                    {order.product_total_unit}
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
                      <Tooltip title="Blocked">
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
                      <Tooltip title="Blocked">
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
                      <Tooltip title="Blocked">
                        <IconButton>
                          <CancelIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </StyledTableCellContent>

                  <StyledTableCellContent>
                    {order.order_cancelled ? (
                      <Tooltip title="Placed by Buyer">
                        <IconButton>
                          <CheckCircleIcon style={{ color: "green" }} />
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

                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </>
      <br />      <br />      <br />
    </GlobalStyles>
  );
}

export default ManageSellersOrders;
