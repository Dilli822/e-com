import React, { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Container,
  Button,
  TextField,
} from "@material-ui/core";
import AppFooter from "../../footer/footer";
import PublicHeader from "../../header/headerPublic";
import AppHeader from "../../header/header";
import PeopleProductView from "../productViews/peopleProductViews";
import ReviewList from "../../reviews/list/reviewList";
import CartDetails from "../../cart/cartDetails";
import { BorderAllRounded } from "@material-ui/icons";

export default function ProductDetails() {
  const location = useLocation();
  const product = location.state ? location.state.product : null; // Check if state is available
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page on component mount
  }, []);
  const handleAddToCart = () => {
    if (product) {
      // Navigate to CartDetails and pass the selected product as state
      navigate("/cart/details", { state: { product } });
    }
  };

  if (!product) {
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
          <span>No Product Selected! Something went wrong!!</span>
          <Link to={`/`} style={{ color: "inherit", marginTop: "8px" }}>
            <Button color="secondary" variant="contained">
              <span>Please Go Back</span>
            </Button>
          </Link>
        </Typography>
      </Container>
    );
  }
  const accessToeken = localStorage.getItem("accessToken");
  return (
    <>
      {accessToeken ? <AppHeader /> : <PublicHeader />}
      <br />
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={3} style={{ display: "flex" }}>
            <CardMedia
              component="img"
              alt={product.product_name}
              image={product.image}
              title={product.product_name}
              style = {{ borderRadius: "5px"}}
            />
          </Grid>
          <Grid item xs={12} md={5} style={{ display: "flex" }}>
            <Card style={{ width: "100%" }}>
              <CardContent>
                <Typography variant="h5">{product.product_name}</Typography>
                <Typography variant="body1">
                  Product Id: #{product.id}
                </Typography>
                <Typography variant="body1">
                  {product.description.length > 266
                    ? `${product.description.slice(0, 266)}...`
                    : product.description}
                </Typography>
                <br />
                <Typography variant="body1">Stock: {product.stock}</Typography>
                <Typography variant="body1">
                  Category: {product.category_name}
                </Typography>
                <Typography variant="h5">Price: ${product.price}</Typography>
                <br />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} style={{ display: "flex" }}>
            <Card style={{ width: "100%" }}>
              <CardContent>
                <Typography variant="h5">Sold By</Typography>
                <Typography variant="body1">
                  <img
                    src={product.seller_image}
                    alt="Seller Image"
                    width="80"
                  />
                  <br />
                  Supplier's Name:{" "}
                  {product.seller_name ? product.seller_name : "N/A"} | Company:{" "}
                  {product.seller_company_name
                    ? product.seller_company_name
                    : "N/A"}
                </Typography>
                <Typography variant="body1">
                  Supplier's ID: #{product.seller}
                </Typography>
                <Typography variant="body1">
                  Supplier's Address: {product.seller_address}
                </Typography>
                <Typography variant="body1">
                  Supplier's Contact: {product.seller_phone_number}
                </Typography>
                <Typography variant="body1">
                  Discount Offer: {product.discount}
                </Typography>
                <Typography variant="body1">
                  Seller Bio: {product.seller_bio}
                </Typography>
                <Typography variant="body1">Delivery Fee: $110 </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* <Grid item xs={12} md={2} style={{ display: "flex" }}>
            <Card style={{ width: "100%" }}>
              <CardContent>
                <Typography variant="h5"></Typography>
                <Typography variant="body1">
                  <img
                    src={product.seller_image}
                    alt="Seller Image"
                    width="80"
                  />
                </Typography>
                <br />
                <Typography variant="h6">
                  Supplier's Name:{" "}
                  {product.seller_name ? product.seller_name : "N/A"} |
                </Typography>
                <br />
                <Typography variant="h6">
                  Company:{" "}
                  {product.seller_company_name
                    ? product.seller_company_name
                    : "N/A"}
                </Typography>

                <Typography variant="h6">Rating: {product.rating}</Typography>
              </CardContent>
            </Card>
          </Grid> */}

          <div style={{ display: "none" }}>
            <CartDetails product={product} />
          </div>

          <Grid item xs={12} md={10}>
            <br />
            <Typography variant="h5">Ratings</Typography>
            <hr />
            <Typography variant="h6"> Specifications </Typography>
            <Card>
              <CardContent>
                <Typography
                  variant="body1"
                  style={{ height: "50vh", overflow: "auto" }}
                >
                  {/* {product.specifications.length > 115
                ? `${product.specifications}`
                : product.specifications} */}

                  {product.specifications.split("\r\n").map((line, index) => (
                    <div key={index}>
                      {line.split("\t").map((item, itemIndex) => (
                        <span key={itemIndex}>
                          {item}
                          {itemIndex < line.split("\t").length - 1 && "\u00A0"}
                        </span>
                      ))}
                      {index <
                        product.specifications.split("\r\n").length - 1 && (
                        <br />
                      )}
                    </div>
                  ))}
                </Typography>
              </CardContent>
            </Card>

            <Grid>
              <br />
              <Typography variant="h6"> Reviews</Typography>

              <ReviewList productId={product.id} />
            </Grid>
          </Grid>
          <Grid item xs={12} md={2}>
            <br />
            {/* Add content for people who have viewed the reviews */}
            <Typography variant="h6">Peoples Also View</Typography>

            <hr />
            <PeopleProductView />
          </Grid>
        </Grid>
      </Container>
      <br />
      <AppFooter />
    </>
  );
}
