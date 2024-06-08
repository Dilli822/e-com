import React, { useState } from "react";
import AppFooter from "../../footer/footer";
import Header from "../../header/header";
import BuyerProfileUpdate from "./update_profile";
import { makeStyles } from "@mui/styles";
import { useLocation, useNavigate, Link } from "react-router-dom";
import BuyersOrdersList from "../../orders/buyers/list/buyerOrder_list";
import ReviewCRUD from "../../reviews/list/reviewCRUD";
import { Container, Card, Typography, Button, Grid } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  card: {
    padding: theme.spacing(2),
  },
  hidden: {
    display: "none",
  },
}));

export default function BuyerProfile() {
  const classes = useStyles();
  const [showReviews, setShowReviews] = useState(false);
  const [showOrders, setShowOrders] = useState(false); // State to manage visibility of BuyersOrdersList
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return (
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
    ); // Don't render form if there's no access token
  }

  return (
    <>
      <Header />
      <Container className={classes.root}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            md={showOrders ? 0 : 4}
            className={showOrders ? classes.hidden : ""}
          >
            <BuyerProfileUpdate />
          </Grid>

          <Grid item xs={12} md={showOrders ? 12 : 8}>
            <Card className={classes.card}>
              {!showReviews && (
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    setShowOrders(!showOrders);
                    setShowReviews(false); // Hide reviews when showing orders
                  }}
                >
                  {showOrders ? "Hide Orders List" : "Show Orders History"}
                </Button>
              )}
              <span> &nbsp;&nbsp;&nbsp;</span>
              {!showOrders && (
                <>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => setShowReviews(!showReviews)}
                  >
                    {showReviews ? "Hide Reviews" : "Show Reviews"}
                  </Button>
                </>
              )}

              {showOrders && <BuyersOrdersList />}
              {showReviews && <ReviewCRUD />}
            </Card>
          </Grid>
        </Grid>
      </Container>
      <AppFooter />
    </>
  );
}
