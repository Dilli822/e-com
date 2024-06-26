import React, { useState, useEffect } from "react";
import { Grid, Paper, List, ListItem, ListItemText, Container } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate and useLocation
import h from "../assets/banner/b10.jpg";
import shopBag from "../assets/banner/b16.jpg";
import modelLook from "../assets/banner/b18.jpg";
import CategoryFilterProducts from "../products/filters/categoryFilters";

export default function Banner() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation(); // Get the current location

  // Assuming category is part of the URL, e.g., /banner/:category
  const category = location.pathname.split("/")[2]; // Extract the category from the URL

  const categories = [
    "Mobile Phones",
    "Musical Instruments",
    "Men's Fashion",
    "Electronics",
    "Women's Fashion",
    "Electronics",
    "Clothing",
    "Books",
    "Home & Kitchen",
    "Beauty & Personal Care",
    "Sports & Outdoors",
  ];

  const imageUrls = [
    "https://icms-image.slatic.net/images/ims-web/7984cebf-8a00-475d-bd27-7ef2d3207679.jpg_1200x1200.jpg",
    "https://icms-image.slatic.net/images/ims-web/59a047d8-76f2-41b2-9fd8-ae810cbc4536.jpg",
    "https://icms-image.slatic.net/images/ims-web/1776b263-6917-48cf-898f-3f132f9e3973.jpg",
    h,
    shopBag,
    modelLook,
  ];

  useEffect(() => {
    const setBackgroundImage = () => {
      const col8 = document.getElementById("backgroundPoster");
      if (col8) {
        col8.style.backgroundImage = `url('${imageUrls[currentImageIndex]}')`;
        col8.style.backgroundSize = "cover";
        col8.style.backgroundRepeat = "no-repeat";
        col8.style.backgroundPosition = "center";
        col8.style.height = "300px";
        col8.style.borderRadius = "5px";
      }
    };

    setBackgroundImage();

    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
      );
    }, 1200);

    return () => clearInterval(intervalId);
  }, [currentImageIndex, imageUrls]);
  const handleCategoryClick = (category) => {
    navigate(`/filter-products/${category}/`, {
      state: { category }, // Pass category and an empty products array as state
    });
  };
  

  return (
    <>
      <br />
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={9} md={8} order={{ xs: 2, md: 2 }}>
            <Paper id="backgroundPoster" sx={{ height: 300, borderRadius: 5 }} />
          </Grid>
          <Grid item xs={12} lg={3} md={4} order={{ xs: 1, md: 1 }}>
            <Paper sx={{ height: 300, overflow: "auto" }}>
              <List>
                {categories.map((category, index) => (
                  <ListItem button key={index} onClick={() => handleCategoryClick(category)}> {/* Add onClick handler */}
                    <ListItemText primary={category} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {category && <CategoryFilterProducts category={category} />} {/* Render CategoryFilterProducts only if category is defined */}
    </>
  );
}
