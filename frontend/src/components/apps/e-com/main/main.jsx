import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Container,
  Button,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import ProductDetails from "../products/details/public_product_details";
import PeopleProductView from "../products/productViews/peopleProductViews";
import CategoryFilterProducts from "../products/filters/categoryFilters";

const Main = () => {
  const [products, setProducts] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [Peopleproducts, setPeopleProducts] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/e-com/api/products/public/list/"
        );
        const data = await response.json();
        setProducts(data);
        setPeopleProducts(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    navigate(
      `/product/${product.product_name}/${product.id}/${product.category_name}`,
      { state: { product } }
    ); // Pass product details as state
  };

  const handleViewMoreClick = (category) => {
    navigate(`/product/filter/`, {
      state: { category, products: products[category] },
    });
  };

  return (
    <Grid container spacing={3}>
      {Object.keys(products).map((category) => (
        <Grid item xs={12} key={category}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h5" gutterBottom>
              {category}
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleViewMoreClick(category)}
            >
              View More
            </Button>
          </div>
          <br /><br />

          <Grid container spacing={2}>
            {products[category].slice(0, 6).map((product) => (
              <Grid item xs={6} sm={6} md={2} lg={2} key={product.id}>
                <Card
                  onClick={() => handleCardClick(product)}
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardActionArea style={{ flex: 1 }}>
                    <CardMedia
                      component="div" // Use a div wrapper
                      style={{
                        padding: "8px", // Adjust padding as needed
                        overflow: "hidden", // Hide overflow content
                      }}
                    >
                      <img
                        alt={product.description}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                        src={product.image}
                        title={product.description}
                      />
                    </CardMedia>

                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="body1"
                        component="body1"
                      >
                        {product.product_name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Price: ${product.price}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Stock: {product.stock}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      ))}

      <div  style={{ display: "none" }}>
      <CategoryFilterProducts products={products}/> {/* Pass products as prop */}
      </div>


    </Grid>
  );
};

export default Main;
