import React, { useState } from "react";
import Header from "../../header/header";
import SellerProfileUpdate from "./update_seller_profile";
import ProductForm from "../../products/seller/uploadProducts/uploadProducts";
import AppFooter from "../../footer/footer";
import { makeStyles } from "@mui/styles";
import { Container, Card, Button, Grid } from "@mui/material";
import EditProductForm from "../../products/seller/editProducts/editProducts";

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

  const handleAddProductClick = () => {
    setShowProductForm(true);
    setShowProfileUpdate(false);
    setShowProductEditForm(false);
  };

  const handleAddProductEditClick = () => {
    setShowProductForm(false);
    setShowProfileUpdate(false);
    setShowProductEditForm(true);
  };

  const handleBackButtonClick = () => {
    setShowProductForm(false);
    setShowProductEditForm(false);
    setShowProfileUpdate(true);
  };

  return (
    <>
      <Header />
      <Container className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={5}>
            {showProfileUpdate && <SellerProfileUpdate />}
          </Grid>

          {showProfileUpdate && (
            
          <Grid item xs={7}>
            
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
                </>
            
            </Card>
          </Grid>
            )}

          <Grid item xs={12}>
          {(showProductForm || showProductEditForm) && (
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={handleBackButtonClick}
              >
                Back
              </Button>
            )}

            {showProductForm && <ProductForm />}
            {showProductEditForm && <EditProductForm />}
      
          </Grid>
        </Grid>
      </Container>
      <AppFooter />
    </>
  );
}
