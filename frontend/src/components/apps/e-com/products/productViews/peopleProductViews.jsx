
import React, { useState, useEffect } from "react";
import { Typography, Card, CardContent, Grid } from "@material-ui/core";
import { useNavigate } from "react-router-dom";

const PeopleProductView = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/e-com/api/products/public/list/"
        );
        const data = await response.json();
        const allProducts = Object.values(data).flat(); // Combine all products into one array
        setProducts(allProducts);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    window.scrollTo(0, 0); 
    navigate(
      `/product/${product.product_name}/${product.id}/${product.category_name}`,
      { state: { product } }
    ); // Pass product details as state
  };

  const renderRandomProducts = () => {
    const randomProducts = products
      .sort(() => 0.3 - Math.random())
      .slice(0, 3); // Shuffle and limit to 4 items

    return (
      <Grid container spacing={2}>
        {randomProducts.map((product) => (
          <Grid
            item
            sm={6}
            md={12}
            onClick={() => handleCardClick(product)}
            style={{ cursor: "pointer" }}
            key={product.id}
          >
            <Card>
              <CardContent style={{ padding: "10px" }}>
                <img src={product.image} alt="Product Image" width="100%" />
                <Typography variant="subtitle1">
                  {product.product_name}
                </Typography>
                <Typography variant="body2">Price: ${product.price}</Typography>
                <Typography variant="body2">Stock: {product.stock}</Typography>
                <Typography variant="body2">Ratings: {product.ratings}</Typography>
                <br />
                <hr />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  if (loading) return <Typography variant="body1">Loading...</Typography>;
  if (error) return <Typography variant="body1">Error: {error.message}</Typography>;

  return <div>{renderRandomProducts()}</div>;
};

export default PeopleProductView;
