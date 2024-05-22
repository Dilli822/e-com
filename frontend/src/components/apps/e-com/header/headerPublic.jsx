import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeadLogo from "../assets/logo/e-com logo.jpg";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  IconButton,
  useMediaQuery,
  Drawer,
  List,
  Menu,
  MenuItem,
  ListItem,
  ListItemText,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "#F7F6F6 !important",
    color: "#000 !important",
    padding: "0 !important",
    margin: "0 !important",
    boxShadow: "none !important",
  },
  toolbar: {
    justifyContent: "space-between",
  },
}));

const HeaderPublic = () => {
  const classes = useStyles();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setDrawerOpen(false); // Close drawer on menu item click
  };

  const navigate = useNavigate();

  const menuItems = (
    <List sx={isLargeScreen ? { display: "flex" } : null}>
      <ListItem
        button
        component={Link}
        to="/buyer/cart-details/"
        onClick={handleClose}
      >
        <ListItemText primary="Cart" />
      </ListItem>
      <ListItem button component={Link} to="/login" onClick={handleClose}>
        <ListItemText primary="Login" />
      </ListItem>
      <ListItem
        button
        component={Link}
        to="/cart/details"
        onClick={handleClose}
      >
        <ListItemText primary="Login" />
      </ListItem>

      <ListItem button component={Link} to="/signup" onClick={handleClose}>
        <ListItemText primary="Signup" />
      </ListItem>
      {/* Add more menu items as needed */}
    </List>
  );

  return (
    <>
      <AppBar position="sticky" className={classes.appBar}>
        <Container>
          <Toolbar className={classes.toolbar}>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <Typography variant="h6" style={{ cursor: "pointer" }}>
              <img src={HeadLogo} alt="" style={{ width: "60px", borderRadius: "15%"}}/>
              </Typography>
            </Link>
            {isMobile ? (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={toggleDrawer}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <>{menuItems}</>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        <div
          role="presentation"
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
        >
          {menuItems}
        </div>
      </Drawer>

      {/* Nested dropdown menu for Profile */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>Order</MenuItem>
        {/* Add more submenu items as needed */}
      </Menu>
    </>
  );
};

export default HeaderPublic;
