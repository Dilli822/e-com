import React, { useState } from "react";
import Header from "../../header/header";
import SellerProfileUpdate from "./update_seller_profile";
import ProductForm from "../../products/seller/uploadProducts/uploadProducts";
import AppFooter from "../../footer/footer";
import { makeStyles } from "@mui/styles";
import { Container, Card, Button, Grid, Typography } from "@mui/material";
import EditProductForm from "../../products/seller/editProducts/editProducts";
import ManageSellersOrders from "../../orders/seller/sellerOrdersList";
import { useLocation, useNavigate, Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  card: {
    padding: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
}));

export default function SellerProfile() {
  const classes = useStyles();
  const [showProductForm, setShowProductForm] = useState(false);
  const [showProfileUpdate, setShowProfileUpdate] = useState(true);
  const [showProductEditForm, setShowProductEditForm] = useState(false);
  const [showManageOrders, setShowManageOrders] = useState(false);

  const handleAddProductClick = () => {
    setShowProductForm(true);
    setShowProfileUpdate(false);
    setShowProductEditForm(false);
    setShowManageOrders(false);
  };

  const handleAddProductEditClick = () => {
    setShowProductForm(false);
    setShowProfileUpdate(false);
    setShowProductEditForm(true);
    setShowManageOrders(false);
  };

  const handleBackButtonClick = () => {
    setShowProductForm(false);
    setShowProductEditForm(false);
    setShowManageOrders(false);
    setShowProfileUpdate(true);
  };


  const handleOrdersEditClick = () =>{
    setShowProductForm(false);
    setShowProductEditForm(false);
    setShowProfileUpdate(false);
    setShowManageOrders(true);
  }

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return (
      <>
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
                <span>Please Login </span>
              </Button>
            </Link>
          </Typography>
        </Container>
      </>
    ); // Don't render form if there's no access token
  }
  

  return (
    <>
      <Header />
      <Container className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            {showProfileUpdate && <SellerProfileUpdate />}
          </Grid>

          {showProfileUpdate && (
            
          <Grid item xs={8}>
            
            <Card className={classes.card}>
    
                <>
                  <Button
                    type="button"
                    variant="outlined"
                    color="primary"
                    onClick={handleAddProductClick}
                  >
                    Add Products/Stocks
                  </Button>
                  <span>&nbsp;&nbsp;</span>
                  <Button
                    type="button"
                    variant="outlined"
                    color="primary"
                    onClick={handleAddProductEditClick}
                  >
                    Edit Products/Stocks
                  </Button>
                  <span>&nbsp;&nbsp;</span>
                  <Button
                    type="button"
                    variant="contained"
                    color="secondary"
                    onClick={handleOrdersEditClick}
                  >
                    Manage Orders
                  </Button>
                </>
            
            </Card>

            
          </Grid>
            )}

          <Grid item xs={12}>

          {(showProductForm || showProductEditForm || showManageOrders) && (
          
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={handleBackButtonClick}
              >
                Go Back
              </Button>
            )}

            {showProductForm && <ProductForm />}
            {showProductEditForm && <EditProductForm />}
            {showManageOrders && <ManageSellersOrders />}
          </Grid>



        </Grid>
      </Container>
      <AppFooter />
    </>
  );
}
