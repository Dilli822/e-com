import React, { useState, useEffect } from "react";
import { Typography, Grid, Card, CardContent } from "@mui/material";
import Main from "../../main/main";
import PeopleProductView from "../../products/productViews/peopleProductViews";

export default function ReviewCRUD({ productId }) {
  const [reviews, setReviews] = useState([]);


  useEffect(() => {
    fetch("http://127.0.0.1:8000/e-com/api/reviews/")
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error("Error fetching reviews:", error));
      window.scrollTo(0, 0);
  }, []);
    // Log the received product ID
    console.log("Received Product ID:", productId);
   // Filter reviews to include only the ones matching the received product ID
   const filteredReviews = reviews.filter((review) => review.product === productId).slice(0, 8);


  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={10}>
        <br />
        <Typography variant="h5">Reviews</Typography>
        <hr />
        <br />
        <Card>
          <CardContent>
          {filteredReviews.length > 0 ? (
              <ul style={{ margin: 0, padding: 0 }}>
                {filteredReviews.map((review, index) => (
                  <ReviewItem key={index} review={review} />
                ))}
              </ul>
            ) : (
              <Typography variant="h6" color="error">
                No reviews found for this product.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={2}>
        <br />
        {/* Add content for people who have viewed the reviews */}
        <Typography variant="h6">Peoples Also View</Typography>
    
      </Grid>
    </Grid>
  );
}

function ReviewItem({ review }) {
  return (
    <li style={{ listStyle: "none", marginBottom: 20 }}>

      <Typography variant="body1">Rating: {review.rating}/5</Typography>
      <Typography variant="body1"> {[...Array(5)].map((_, index) => <span key={index} style={{color: index < review.rating ? 'gold' : 'gray'}}>&#9733;</span>)}</Typography>
      <Typography variant="body1">By: {review.user}</Typography>
      <Typography variant="body1">Review: {review.comment}</Typography>
      <Typography variant="body1">Added at: {new Date(review.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</Typography>

      <hr />
    </li>
  );
}
