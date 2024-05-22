import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Grid,
  Card,
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
  Modal,
  Backdrop,
  CardContent,
  FormControl,
  Fade,
} from "@material-ui/core";
import UserProfileMaster from "../../apiFetcher/fetchUserApi";
import { useNavigate } from "react-router-dom";
import Header from "../header/header";
import HeaderPublic from "../header/headerPublic";
import AppFooter from "../footer/footer";

export default function CheckOut() {
  const location = useLocation();
  const [checkOutItems, setCheckOutItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cashOnDelivery");
  const [openModal, setOpenModal] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [cartTotalItems, setCartTotalItems] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/");
      return;
    }

    if (location.state && Array.isArray(location.state.checkOutItems)) {
      setCheckOutItems(location.state.checkOutItems);

      if (location.state.checkOutItems.length === 0) {
        setCartTotalItems("No Items in the Cart");
      }
    }
  }, [location.state]);

  const subtotal = checkOutItems.reduce(
    (acc, item) => acc + parseFloat(item.product.price) * item.quantity,
    0
  );
  const deliveryFee = 110; // Example delivery fee
  const totalPrice = subtotal + deliveryFee;

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    handleConfirmation();
  };

  const handleConfirmation = () => {
    setOpenModal(true);
  };

  const handleConfirm = () => {
    setConfirmation(true);
    setOpenModal(false);
  };

  console.log(checkOutItems);

  const uniqueSellers = checkOutItems.reduce((acc, item) => {
    const seller = item.product.seller;
    if (seller && !acc[seller]) {
      acc[seller] = item.product;
    }
    return acc;
  }, {});

  console.log(uniqueSellers);
  const accessToken = localStorage.getItem("accessToken");
  return (
    <>
      {accessToken ? <Header /> : <HeaderPublic />}
      <Container>
        <br />

    
        <Grid container spacing={3} className="hide-print">
          <Grid item md={9} xs={12}>
            <Typography variant="h5">Order Details</Typography>
            <Typography variant="body1" color="secondary">
          Click on the Mode of Payment & Place Your Final Order{" "}
        </Typography>
            <br />
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {checkOutItems.map((item, index) => {
                    // Debugging: Log item.product.price and item.quantity
                    // console.log(
                    //   "Price:",
                    //   item.product.price,
                    //   "Quantity:",
                    //   item.quantity
                    // );

                    // Convert price and quantity to numbers
                    const price = parseFloat(item.product.price);
                    const quantity = parseInt(item.quantity);

                    // Check if price and quantity are valid numbers
                    if (!isNaN(price) && !isNaN(quantity)) {
                      // Calculate the total price for the item
                      const itemTotal = price * quantity;
                      return (
                        <TableRow key={index}>
                          <TableCell>{item.product.product_name}</TableCell>
                          <TableCell>
                            <img src={item.product.image} alt="" width={60} />
                          </TableCell>
                          <TableCell>{item.product.description}</TableCell>
                          <TableCell>${price.toFixed(2)}</TableCell>
                          <TableCell>{quantity}</TableCell>
                          <TableCell>${itemTotal.toFixed(2)}</TableCell>
                        </TableRow>
                      );
                    } else {
                      // Handle case where price or quantity is not a valid number
                      return <></>;
                    }
                  })}
                  <TableRow>
                    <TableCell colSpan={5}>Delivery Fee</TableCell>
                    <TableCell>${deliveryFee.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5}>Total Price</TableCell>
                    <TableCell style={{ fontSize: "18px" }}>
                      <b>
                        $
                        {checkOutItems
                          .reduce((acc, item) => {
                            const price = parseFloat(item.product.price);
                            const quantity = parseInt(item.quantity);
                            // Add valid item totals to the accumulator
                            if (!isNaN(price) && !isNaN(quantity)) {
                              return acc + price * quantity;
                            } else {
                              return acc; // Ignore invalid items
                            }
                          }, 0)
                          .toFixed(2)}
                      </b>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item md={3}>
            <FormControl component="fieldset">
              <Typography variant="h5">Select Mode of Payment</Typography>
              <Button
                variant="contained"
                color={
                  paymentMethod === "cashOnDelivery" ? "primary" : "default"
                }
                disabled={paymentMethod !== "cashOnDelivery"}
                onClick={() => handlePaymentMethodChange("cashOnDelivery")}
              >
                Cash on Delivery
              </Button>
              <Button
                variant="contained"
                color={paymentMethod === "creditCard" ? "primary" : "default"}
                disabled={paymentMethod !== "creditCard"}
                onClick={() => handlePaymentMethodChange("creditCard")}
              >
                Credit Card
              </Button>
              <Button
                variant="contained"
                color={paymentMethod === "Khalti" ? "primary" : "default"}
                disabled={paymentMethod !== "Khalti"}
                onClick={() => handlePaymentMethodChange("Khalti")}
              >
                Khalti
              </Button>
              <Button
                variant="contained"
                color={paymentMethod === "e-sewa" ? "primary" : "default"}
                disabled={paymentMethod !== "e-sewa"}
                onClick={() => handlePaymentMethodChange("e-sewa")}
              >
                e-sewa
              </Button>
            </FormControl>
          </Grid>
        </Grid>
        {cartTotalItems && <div>{cartTotalItems}</div>}
        {/* Confirmation Modal */}
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
              }}
            >
              <div style={{ backgroundColor: "white", padding: 20 }}>
                <Typography variant="h5">Confirm Payment</Typography>
                <Typography variant="body1">
                  Are you sure you want to proceed with the payment?
                </Typography>
                <br />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleConfirm}
                >
                  Confirm
                </Button>
                &nbsp;&nbsp;
                <Button variant="contained" onClick={() => setOpenModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Fade>
        </Modal>

        {/* Invoice */}
        {confirmation && (
          <div>
            <Grid item md={12}>
              <br />
              <Card>
                <CardContent>
                  <Typography variant="h4">Invoice</Typography>
                  {checkOutItems.length > 0 && (
                    <Grid container style={{ marginTop: "5px" }}>
                      <Grid item xs={6}>
                        <Typography variant="h4">
                          <Typography variant="body1">
                            <b> Customer Details/Shipped to:</b>
                            <UserProfileMaster />
                          </Typography>
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="h4">
                          <Typography variant="body1">
                            <b>Seller Details/Shipped By:</b>
                        
                            {Object.keys(uniqueSellers).map((key) => {
                              const seller = uniqueSellers[key];
                              return (
                                <Typography variant="body1" key={key}>
                                  Id: #{seller.seller}
                                  &nbsp; | Seller Name: {seller.seller_name}
                                  <br />
                                  Company Name:{" "}
                                  {seller.seller_company_name || "N/A"}
                                  <br />
                                  Address: {seller.seller_address}
                                  &nbsp; | Contact: +
                                  {seller.seller_phone_number}
                                  <br />
                                  <hr />
                                </Typography>
                              );
                            })}
                          </Typography>
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                  <hr />
                  <Grid>
                    <Typography variant="body1">
                      <b>Shipping Details</b>
                    </Typography>
                    <p>
                      Ordered Date:
                      <b>
                        {" "}
                        {new Date(
                          new Date().setDate(new Date().getDate())
                        ).toDateString()}{" "}
                      </b>
                    </p>

                    <p>
                      Expected Delivery Date:
                      <b>
                        {" "}
                        {new Date(
                          new Date().setDate(new Date().getDate() + 4)
                        ).toDateString()}
                      </b>
                    </p>

                    <p>
                      Mode of Payment:
                      <b> {paymentMethod}</b>
                    </p>

                    <p>
                      OrderID:
                      <b> {}</b>
                    </p>
                  </Grid>
                  <hr />
                  <Grid>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Product Name</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {checkOutItems.map((item, index) => {
                            // Debugging: Log item.product.price and item.quantity

                            // Convert price and quantity to numbers
                            const price = parseFloat(item.product.price);
                            const quantity = parseInt(item.quantity);

                            // Check if price and quantity are valid numbers
                            if (!isNaN(price) && !isNaN(quantity)) {
                              // Calculate the total price for the item
                              const itemTotal = price * quantity;
                              return (
                                <TableRow key={index}>
                                  <TableCell>
                                    {item.product.product_name}
                                  </TableCell>
                                  <TableCell>
                                    <img
                                      src={item.product.image}
                                      alt=""
                                      width={60}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    {item.product.description.length > 50
                                      ? item.product.description.substring(
                                          0,
                                          50
                                        ) + "..."
                                      : item.product.description}
                                  </TableCell>
                                  <TableCell>${price.toFixed(2)}</TableCell>
                                  <TableCell>{quantity}</TableCell>
                                  <TableCell>${itemTotal.toFixed(2)}</TableCell>
                                </TableRow>
                              );
                            } else {
                              // Handle case where price or quantity is not a valid number
                              return <></>;
                            }
                          })}
                          <TableRow>
                            <TableCell colSpan={5}>Delivery Fee</TableCell>
                            <TableCell>${deliveryFee.toFixed(2)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell colSpan={5}>Total Price</TableCell>
                            <TableCell style={{ fontSize: "18px" }}>
                              <b>
                                $
                                {checkOutItems
                                  .reduce((acc, item) => {
                                    const price = parseFloat(
                                      item.product.price
                                    );
                                    const quantity = parseInt(item.quantity);
                                    // Add valid item totals to the accumulator
                                    if (!isNaN(price) && !isNaN(quantity)) {
                                      return acc + price * quantity;
                                    } else {
                                      return acc; // Ignore invalid items
                                    }
                                  }, 0)
                                  .toFixed(2)}
                              </b>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <br />
                  e-com | ©CopyRight | Online Receipt Generated | Date:{" "}
                  {new Date(
                    new Date().setDate(new Date().getDate())
                  ).toDateString()}{" "}
                </CardContent>
              </Card>
              <br />
              <Button
                variant="outlined"
                color="secondary"
                className="hide-print"
              >
                Confirm Order
              </Button>
            </Grid>
          </div>
        )}
      </Container>
      <br />
      <br />
      <AppFooter />
    </>
  );
}
