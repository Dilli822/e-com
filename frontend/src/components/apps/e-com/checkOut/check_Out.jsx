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
import { Alert, AlertTitle } from "@mui/material";

export default function CheckOut() {
  const location = useLocation();
  const [checkOutItems, setCheckOutItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cashOnDelivery");
  const [openModal, setOpenModal] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [cartTotalItems, setCartTotalItems] = useState("");
  const [finalOrderDetails, setfinalOrderDetails] = useState({});
  const [openOrderModal, setOpenOrderModal] = useState(false);
  const [buyerValidation, setBuyerValidation] = useState("");
  const [tagAddress, setTagAddress] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSeller, setIsSeller] = useState(null);
  const [isBuyer, setIsBuyer] = useState(null);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  let sellerElement;
  // let buyerElement;

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

  let convertedOrderDetails;

  const uniqueSellers = checkOutItems.reduce((acc, item) => {
    const seller = item.product.seller;
    if (seller && item.quantity !== null && item.quantity > 0 && !acc[seller]) {
      acc[seller] = item.product;
    }
    return acc;
  }, {});

  console.log("UNIQUE SELLERS ", uniqueSellers);
  const accessToken = localStorage.getItem("accessToken");

  const placeFinalOrder = () => {
    const isBuyerElement = document.getElementById("isBuyer");
    if (isBuyerElement) {
      const isBuyer = isBuyerElement.textContent;
      console.log("Buyer", isBuyer);
      if (isBuyer === "Yes") {
        setOpenConfirmationModal(true);
        return; // Exit the function early if the user is a buyer
      }
    }
  
    // If the element is not found or the user is not a buyer
    setOpenConfirmationModal(false);
    setIsBuyer(null);
    setErrorMessage("Failed to place order: Buyers only can place orders");

    // Hide the error message after 6 seconds (6000 milliseconds)
    setTimeout(() => {
      setErrorMessage("");
    }, 6000);

       // Set the order placed state to true
       setIsOrderPlaced(true);
  };
  
  
  
  



  const handleConfirmOrder = () => {



    // Filter out items with null quantities
    const filteredCheckOutItems = checkOutItems.filter(
      (item) => item.quantity !== null
    );

    // Seller information
    const sellerInfo = `Seller Details/Shipped By:\n`;
    const sellerDetails = Object.keys(uniqueSellers)
      .map((key) => {
        const seller = uniqueSellers[key];
        return `Id: #${seller.seller}\nSeller Name: ${
          seller.seller_name
        }\nCompany Name: ${seller.seller_company_name || "N/A"}\nAddress: ${
          seller.seller_address
        }\nContact: +${seller.seller_phone_number}\n`;
      })
      .join("\n");

    // Shipping details
    const shippingDetails = `Shipping Details:\nOrdered Date: ${new Date(
      new Date().setDate(new Date().getDate())
    ).toDateString()}\nExpected Delivery Date: ${new Date(
      new Date().setDate(new Date().getDate() + 4)
    ).toDateString()}\nMode of Payment: ${paymentMethod}`;

    // Items details
    const itemsDetails = `Items Details:\n`;
    const items = filteredCheckOutItems
      .map((item, index) => {
        return `${index + 1}. Product Name: ${
          item.product.product_name
        }, Description: ${item.product.description}, Price: $${
          item.product.price
        }, Quantity: ${item.quantity}, Total: $${(
          parseFloat(item.product.price) * parseInt(item.quantity)
        ).toFixed(2)}`;
      })
      .join("\n");

    // Total price
    const totalPriceInfo = `Total Price: ${totalPrice.toFixed(
      2
    )}, Delivery Fee: $${deliveryFee.toFixed(2)}, Total Amount: $${(
      totalPrice + deliveryFee
    ).toFixed(2)}`;

    const orderDetailsJSONFormatter = {
      seller: {
        info: "Seller Details/Shipped By:",
        details: Object.keys(uniqueSellers).map((key) => {
          const seller = uniqueSellers[key];
          return {
            id: seller.seller,
            name: seller.seller_name,
            companyName: seller.seller_company_name || "N/A",
            address: seller.seller_address,
            contact: seller.seller_phone_number,
          };
        }),
      },
      shipping: {
        details: {
          orderedDate: new Date(
            new Date().setDate(new Date().getDate())
          ).toDateString(),
          expectedDeliveryDate: new Date(
            new Date().setDate(new Date().getDate() + 4)
          ).toDateString(),
          modeOfPayment: paymentMethod,
        },
      },
      items: filteredCheckOutItems.map((item, index) => {
        return {
          productName: item.product.product_name,
          description: item.product.description,
          price: parseFloat(item.product.price),
          quantity: parseInt(item.quantity),
          total: (
            parseFloat(item.product.price) * parseInt(item.quantity)
          ).toFixed(2),
          // Add category information here
          product_category: item.product.category,
          product_category_name: item.product.category_name,
        };
      }),
      totalPrice: {
        subtotal: subtotal.toFixed(2),
        deliveryFee: deliveryFee.toFixed(2),
        totalAmount: (totalPrice + deliveryFee).toFixed(2),
      },
    };

    // Convert orderDetails to JSON format
    const orderDetailsJSON = JSON.stringify(orderDetailsJSONFormatter);
    console.log(orderDetailsJSON);
    setfinalOrderDetails(orderDetailsJSON);
    const tagAddressText = document.getElementById("tagAddress")?.textContent;
    setTagAddress(tagAddressText);

    // Extracted information
    const {
      seller,
      shipping,
      items: extractedItems,
    } = orderDetailsJSONFormatter;
    const buyer_ID = document.getElementById("buyerID").textContent;
    let buyer_delivery_address;

    buyer_delivery_address =
      document.getElementById("buyerDefaultAdress").textContent;
    console.log(buyer_delivery_address);

    // }
    const buyer_contact = document.getElementById("buyerContact").textContent;
    const buyer_email = document.getElementById("buyerEmail").textContent;
    const buyer_username = document.getElementById("buyerUserName").textContent;


    const product_total_price =
      document.getElementById("totalPrice").textContent;

    if (
      !buyer_ID.trim() ||
      !buyer_delivery_address.trim() ||
      !buyer_contact.trim() ||
      !buyer_email.trim() ||
      !buyer_username.trim()
    ) {
      // If any of the buyer details are missing, show an error message
      setBuyerValidation("Please provide all buyer details.");
      setErrorMessage(
        `Failed to place order. Please provide all Your details}`
      );
      return;
    }

    // Construct the desired JSON format
    convertedOrderDetails = {
      buyer_id: buyer_ID,
      buyer_delivery_address: buyer_delivery_address,
      buyer_contact: buyer_contact,
      buyer_full_name: buyer_username, // Assuming the buyer's username is their full name
      buyer_email: buyer_email,

      product_name: extractedItems
        .filter((item) => item.productName)
        .map((item) => item.productName)
        .join(", "),
      product_description: extractedItems
        .filter((item) => item.description)
        .map((item) => item.description)
        .join(", "),
      product_price: extractedItems
        .filter((item) => item.price)
        .map((item) => item.price.toFixed(2))
        .join(", "),
      product_units: extractedItems
        .filter((item) => item.quantity)
        .map((item) => item.quantity)
        .join(", "),
      product_total_price: product_total_price,

      product_total_units: extractedItems.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      ),

      product_category_name: filteredCheckOutItems
        .map((item) => item.product.category_name)
        .join(", "),
      // product_category: checkOutItems
      //   .map((item) => item.product.category)
      //   .join(", "),
      product_category: filteredCheckOutItems
        .map((item) => item.product.category)
        .filter(Boolean)
        .join(", ")
        .replace(/, $/, ""),
      delivery_fee: deliveryFee,
      mode_of_payment: shipping.details.modeOfPayment,

      seller_id:
        seller.details.length === 1
          ? Array.from(
              { length: filteredCheckOutItems.length },
              () => seller.details[0].id
            ).join(", ")
          : seller.details.map((seller) => seller.id).join(", "),
      order_placed_by_buyer: true,
    };

    console.log("convered details ", convertedOrderDetails);

    // Make API request to post the order details
    fetch("http://127.0.0.1:8000/e-com/api/orders/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        //   Include any required headers, such as authentication token
      },
      body: JSON.stringify(convertedOrderDetails),
    })
      .then((response) => {
        if (response.ok) {
          // Handle successful response

          console.log("Order placed successfully!");

          setSuccessMessage("Order placed successfully!");

          // Hide the success message after 1 minute (60 seconds)
          setTimeout(() => {
            setSuccessMessage("");
            navigate("/feed");
          }, 5000);

          setOpenConfirmationModal(false); // Close the modal or perform any other action
              // Set the order placed state to true
        setIsOrderPlaced(true);
        } else {
          // Handle error response
          console.error("Failed to place order:", response.status);
          setErrorMessage(`Failed to place order: ${response}`);
          // You can display an error message to the user or retry the request
        }
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        setErrorMessage(`Failed to place order: ${error}`);

        // Hide the success message after 1 minute (60 seconds)
        setTimeout(() => {
          setErrorMessage("");
        }, 6000);

        // Handle network errors or other exceptions
      });
  };

  console.log("tagaddress ", tagAddress);





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
                          <TableCell>
                          {item.product.description.length > 115 ? `${item.product.description.slice(0, 115)}...` : item.product.description}
                          </TableCell>
                          <TableCell>${price.toFixed(2)}</TableCell>
                          <TableCell>{quantity}</TableCell>
                          <TableCell>
                            ${" "}
                            <span id="totalPrice">{itemTotal.toFixed(2)}</span>{" "}
                          </TableCell>
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
             
                onClick={() => handlePaymentMethodChange("cashOnDelivery")}
                disabled={isOrderPlaced || paymentMethod !== 'cashOnDelivery'} // Disable if the order is placed or payment method is not cash on delivery
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
                      {" "}
                      Final Shipping Address:{" "}
                      <b>
                        {" "}
                        <span id="">
                          {" "}
                          {
                            document.getElementById("buyerDefaultAdress")
                              ?.textContent
                          }{" "}
                        </span>
                      </b>{" "}
                    </p>

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
                      OrderID: <b>{"" || `To be filled by system`}</b>
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
                            <TableCell>Category ID</TableCell>
                            <TableCell>Category Name</TableCell>
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
                                  <TableCell>{item.product.category}</TableCell>
                                  <TableCell>
                                    {item.product.category_name}
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
                            <TableCell colSpan={7}>Delivery Fee</TableCell>
                            <TableCell>${deliveryFee.toFixed(2)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell colSpan={7}>Total Price</TableCell>
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
                onClick={placeFinalOrder}
                disabled={isOrderPlaced} // Disable if the order is placed
              >
                Confirm Order
              </Button>
             
            </Grid>
            <br />
            {errorMessage && (
                  <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                  </Alert>
                )}
          </div>
        )}

        <Modal
          open={openConfirmationModal}
          onClose={() => setOpenConfirmationModal(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openConfirmationModal}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
              }}
            >
              <div style={{ backgroundColor: "white", padding: 20 }}>
                <Typography variant="h5">Confirm Order</Typography>
                <Typography variant="body1">
                  Are you sure you want to proceed with the Order?
                </Typography>
                <br />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleConfirmOrder} // Call the new function to handle order confirmation
                >
                  Confirm
                </Button>
                &nbsp;&nbsp;
                <Button
                  variant="contained"
                  onClick={() => setOpenConfirmationModal(false)}
                >
                  Cancel
                </Button>
                {errorMessage && (
                  <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                  </Alert>
                )}
              </div>
            </div>
          </Fade>
        </Modal>

        <br />

        {successMessage && (
          <Alert severity="success">
            <AlertTitle>
              <b>Success</b>
            </AlertTitle>
            {successMessage}
          </Alert>
        )}
      </Container>

      <br />
      <br />
      <AppFooter />
    </>
  );
}
