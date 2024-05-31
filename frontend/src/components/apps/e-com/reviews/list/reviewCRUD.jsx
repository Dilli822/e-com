// import React, { useState, useEffect } from "react";
// import { Typography, Grid, Card, CardContent, Button } from "@mui/material";

// export default function ReviewCRUD({ productId }) {
//   const [reviews, setReviews] = useState([]);
//   const [token, setToken] = useState(localStorage.getItem("accessToken"));
//   const [editingReview, setEditingReview] = useState(null);
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");

//   useEffect(() => {
//     fetchReviews();
//     window.scrollTo(0, 0);
//   }, []);

//   const fetchReviews = async () => {
//     try {
//       const response = await fetch(
//         `http://127.0.0.1:8000/e-com/api/reviews/create/`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       const data = await response.json();
//       const filteredReviews = data.filter(
//         (review) => review.product_id === productId
//       );
//       setReviews(filteredReviews);
//     } catch (error) {
//       console.error("Error fetching reviews:", error);
//     }
//   };

//   const createReview = async () => {
//     try {
//       const response = await fetch(
//         `http://127.0.0.1:8000/e-com/api/reviews/create/`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ rating, comment, product_id: productId }),
//         }
//       );
//       if (response.ok) {
//         fetchReviews(); // Refresh reviews after creation
//         setRating(0);
//         setComment("");
//       }
//     } catch (error) {
//       console.error("Error creating review:", error);
//     }
//   };

//   const editReview = (review) => {
//     setEditingReview(review);
//     setRating(review.rating);
//     setComment(review.comment);
//   };

//   const saveReview = async () => {
//     try {
//       const response = await fetch(
//         `http://127.0.0.1:8000/e-com/api/reviews/${editingReview.id}/`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ ...editingReview, rating, comment }),
//         }
//       );
//       if (response.ok) {
//         setEditingReview(null);
//         fetchReviews(); // Refresh reviews after saving
//         setRating(0);
//         setComment("");
//       }
//     } catch (error) {
//       console.error("Error saving review:", error);
//     }
//   };

//   return (
//     <Grid container spacing={4}>
//       {/* <Typography variant="h5">Reviews</Typography> */}

//  <Grid item xs={12} md={12} >
//   <Card style={{ margin: "1rem 0 0 1rem"}}>
//           <CardContent>
//             {reviews.length > 0 ? (
//               <ul style={{ margin: 0, padding: 0 }}>
//                 {reviews.map((review, index) => (
//                   <ReviewItem key={index} review={review} onEdit={editReview} />
//                 ))}
//               </ul>
//             ) : (
//               <Typography variant="h6" color="error">
//                 No reviews found for this product.
//               </Typography>
//             )}
//           </CardContent>
//         </Card>
//         {editingReview && (
//           <div>
//             <Typography variant="h6">
//               {editingReview.id ? "Edit Review" : "Add Review"}
//             </Typography>
//             <form noValidate autoComplete="off">
//               <div>
//                 <Typography variant="body1">Rating:</Typography>
//                 <input
//                   type="number"
//                   value={rating}
//                   onChange={(e) => setRating(Number(e.target.value))}
//                   min="1"
//                   max="5"
//                 />
//               </div>
//               <div>
//                 <Typography variant="body1">Comment:</Typography>
//                 <textarea
//                   value={comment}
//                   onChange={(e) => setComment(e.target.value)}
//                   rows="4"
//                   cols="50"
//                 />
//               </div>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={editingReview.id ? saveReview : createReview}
//               >
//                 {editingReview.id ? "Save" : "Add"}
//               </Button>
//               <Button
//                 variant="contained"
//                 color="secondary"
//                 onClick={() => setEditingReview(null)}
//               >
//                 Cancel
//               </Button>
//             </form>
//           </div>
//         )}
//       </Grid>
//     </Grid>
//   );
// }

// function ReviewItem({ review, onEdit }) {
//   return (
//     <li style={{ listStyle: "none", marginBottom: 20 , padding: 0}}>
//       <Typography variant="body1">Rating: {review.rating}/5</Typography>
//       <Typography variant="body1">
//         {[...Array(5)].map((_, index) => (
//           <span
//             key={index}
//             style={{ color: index < review.rating ? "gold" : "gray" }}
//           >
//             &#9733;
//           </span>
//         ))}
//       </Typography>
//       <Typography variant="body1"> Comment: {review.comment}</Typography>
//       <Typography variant="body1">
//         Added at:{" "}
//         {new Date(review.created_at).toLocaleDateString("en-US", {
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//         })}
//       </Typography>
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={() => onEdit(review)}
//       >
//         Edit
//       </Button>
//       <hr />
//     </li>
//   );
// }

import React, { useState, useEffect } from "react";
import { Typography, Grid, Card, CardContent, Button } from "@mui/material";

export default function ReviewCRUD({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [editingReview, setEditingReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchReviews();
    window.scrollTo(0, 0);
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/e-com/api/reviews/create/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      const filteredReviews = data.filter(
        (review) => review.product_id === productId
      );
      setReviews(filteredReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const createReview = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/e-com/api/reviews/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating, comment, product_id: productId }),
        }
      );
      if (response.ok) {
        fetchReviews(); // Refresh reviews after creation
        setRating(0);
        setComment("");
      }
    } catch (error) {
      console.error("Error creating review:", error);
    }
  };

  const editReview = (review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment);
  };

  const saveReview = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/e-com/api/reviews/edit/${editingReview.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...editingReview, rating, comment }),
        }
      );
      if (response.ok) {
        setEditingReview(null);
        fetchReviews(); // Refresh reviews after saving
        setRating(0);
        setComment("");
      }
    } catch (error) {
      console.error("Error saving review:", error);
    }
  };

  return (
    <Grid container spacing={4}>
                 
      <Grid item xs={12} md={6}>
      <br />
        <Card>
          <CardContent>
            {reviews.length > 0 ? (
              <ul style={{ margin: 0, padding: 0 }}>
                {reviews.map((review, index) => (
                  <ReviewItem key={index} review={review} onEdit={editReview} />
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
      <Grid item xs={12} md={6}>
        {editingReview && (
          <div  style={{ position: "fixed"}}>
            <Typography variant="h6">
              {editingReview.id ? "Edit Review" : "Add Review"}
            </Typography>
            <form noValidate autoComplete="off">
              <div>
                <Typography variant="body1">Rating:</Typography>
                <input
                  type="number"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  min="1"
                  max="5"
                />
              </div>
              <div>
                <Typography variant="body1">Comment:</Typography>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="4"
                  cols="50"
                />
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={editingReview.id ? saveReview : createReview}
              >
                {editingReview.id ? "Save" : "Add"}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setEditingReview(null)}
              >
                Cancel
              </Button>
            </form>
          </div>
        )}
      </Grid>
    </Grid>
  );
}

function ReviewItem({ review, onEdit }) {
  return (
    <li style={{ listStyle: "none", marginBottom: 20 , padding: 0}}>
      <Typography variant="body1">Rating: {review.rating}/5</Typography>
      <Typography variant="body1">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            style={{ color: index < review.rating ? "gold" : "gray" }}
          >
            &#9733;
          </span>
        ))}
      </Typography>
      <Typography variant="body1"> Comment: {review.comment}</Typography>
      <Typography variant="body1">
        Added at:{" "}
        {new Date(review.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => onEdit(review)}
      >
        Edit
      </Button>
      <hr />
    </li>
  );
}
