import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Close as CloseIcon } from "@material-ui/icons";

import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  IconButton,
  Drawer,
  List,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  ListItem,
  ListItemText,
  TextField,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";

import { ShoppingCart, Search, Notifications } from "@material-ui/icons";
import HeadLogo from "../assets/logo/e-com logo.jpg";

import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  cartLink: {
    textDecoration: "none",
    color: "red",
    display: "flex",
    alignItems: "center",
  },
  cartIcon: {
    marginRight: theme.spacing(1),
    color: "red", // Change color to red
    border: "1px solid red", // Add border for outline effect
    borderRadius: "5%", // Optional: To make it circular
    padding: theme.spacing(0.35), // Optional: Adjust padding for spacing
  },
  cartText: {
    fontWeight: "bold",
    color: "red", // Change text color to red
  },
  largeIcon: {
    fontSize: "2.15rem!important", // Adjust the size as needed
    color: theme.palette.primary.secondary, // Change color to match your theme
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  searchInput: {
    width: "100%",
    background: "#fff!important",
    border: "2px solid #ccc",
    borderRadius: "5px",
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    transition: "border-color 0.3s ease!important",
    "&:hover, &:focus": {
      borderColor: theme.palette.primary.main,
    },
  },

  searchResults: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
    overflowY: "auto",
  },
  searchResultItem: {
    padding: theme.spacing(1, 2),
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const Header = () => {
  const classes = useStyles();

  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setDrawerOpen(false); // Close drawer on menu item click
  };

  const handleSearchChange = async (event) => {
    const { value } = event.target;
    setSearchText(value);

    if (value.trim() === "") {
      // Close search results if input is empty
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/e-com/api/products/public/list/?search=${value}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data = await response.json();

      // Filter the data based on the search input
      const filteredResults = Object.keys(data).reduce((acc, category) => {
        const filteredCategory = data[category].filter((product) =>
          product.product_name.toLowerCase().includes(value.toLowerCase())
        );
        if (filteredCategory.length > 0) {
          acc[category] = filteredCategory;
        }
        return acc;
      }, {});

      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const closeSearch = () => {
    setSearchText("");
    setSearchResults([]);
  };

  const isSeller = localStorage.getItem("IsSeller") === "true";
  const isBuyer = localStorage.getItem("IsBuyer") === "true";
  const [products, setProducts] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);

  const profileLink = isSeller ? "/profile/seller" : "/profile/buyer";

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    navigate(
      `/product/${product.product_name}/${product.id}/${product.category_name}`,
      { state: { product } }
    ); // Pass product details as state
  };

  const menuItems = (
    <List>
      <ListItem button onClick={handleClose}>
        <Link
          to="/cart/details/"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItemText primary="Cart" />
        </Link>
      </ListItem>
      <ListItem button onClick={handleClose}>
        <Link
          to={profileLink}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItemText primary="Profile" />
        </Link>
      </ListItem>
      <ListItem button onClick={handleClose}>
        <Link to="/order" style={{ textDecoration: "none", color: "inherit" }}>
          <ListItemText primary="Orders" />
        </Link>
      </ListItem>
    </List>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: "#FFFFFF", color: "#000" }}>
        <Container>
          <Grid
            container
            style={{ display: "flex", alignItems: "center", padding: "5px 0" }}
          >
            <Grid item xs={3} md={3}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link
                  to="/feed"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                   <img src={HeadLogo} alt="" style={{ width: "60px", borderRadius: "15%"}}/>
                </Link>
              </Typography>
            </Grid>

            <Grid item xs={6} md={4}>
              <div className={classes.searchContainer}>
                <TextField
                  className={classes.searchInput}
                  placeholder="Search..."
                  variant="outlined"
                  value={searchText}
                  onChange={handleSearchChange}
                  id="masterSearchInput"
                />
                &nbsp;

                {searchText && (
                  <IconButton
                    className={classes.closeIcon}
                    onClick={closeSearch}
                  >
                    <CloseIcon color="secondary" />
                  </IconButton>
                )}
              </div>
            </Grid>

            <Grid item xs={3} md={5}>
              <div
                style={{
                  float: "right",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Link to="/cart/details" className={classes.cartLink}>
                  <ShoppingCart className={classes.cartIcon} />
                  <span className={classes.cartText}></span>
                </Link>
                <Notifications />
                &nbsp;
                {!isMobile && (
                  <IconButton onClick={handleMenuClick}>
                    <AccountCircleIcon className={classes.largeIcon} />
                  </IconButton>
                )}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  keepMounted
                  sx={{ width: "250px" }}
                  MenuListProps={{
                    sx: {
                      width: "250px",
                    },
                  }}
                >
                  <MenuItem onClick={handleClose}>
                    <Link
                      to={profileLink}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Profile
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Link
                      to="/order"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Orders
                    </Link>
                  </MenuItem>
                </Menu>
                {isMobile && (
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={toggleDrawer}
                  >
                    <MenuIcon />
                  </IconButton>
                )}
              </div>
            </Grid>
          </Grid>
        </Container>
      </AppBar>
      <Container>
        <Grid container>
          <Grid
            item
            xs={10}
            style={{ zIndex: 999, width: "100%", position: "fixed" }}
          >
            {Object.keys(searchResults).map((category) => (
              <div key={category}>
                <div
                  className={classes.searchResultContainer}
                  style={{
                    background: "#efefef",

                    boxShadow: "1px 5px 0px -4px rgba(38,38,38,0.56)",
                  }}
                >
                  {searchResults[category].length > 0 ? (
                    searchResults[category].map((product) => (
                      <div
                        className={classes.searchResultItem}
                        key={product.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                        onClick={() => handleCardClick(product)}
                      >
                        <img
                          width="30"
                          src={product.image}
                          alt={product.product_name}
                        />
                        &nbsp;&nbsp;
                        <Typography variant="body1" gutterBottom>
                          {product.product_name}
                        </Typography>
                      </div>
                    ))
                  ) : (
                    <Typography variant="body1" gutterBottom>
                      No items found
                    </Typography>
                  )}
                </div>
              </div>
            ))}
          </Grid>
        </Grid>
      </Container>

      {isMobile && (
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
          <div
            role="presentation"
            onClick={toggleDrawer}
            onKeyDown={toggleDrawer}
          >
            {menuItems}
          </div>
        </Drawer>
      )}
    </>
  );
};

export default Header;
