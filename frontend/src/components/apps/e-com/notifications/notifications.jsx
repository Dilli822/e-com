import React from "react";
import {
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";

const Notifications = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifications, setNotifications] = React.useState([
    {
      id: 1,
      text: "You have a new message",
    },
    {
      id: 2,
      text: "Your order has been shipped",
    },
    // Add more notifications as needed
  ]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "notifications-popover" : undefined;

  return (
    <div>
      <IconButton
        aria-describedby={id}
        aria-label="show notifications"
        onClick={handleClick}
        color="inherit"
      >
        <Badge badgeContent={notifications.length} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <List>
          {notifications.map((notification) => (
            <ListItem key={notification.id} button onClick={handleClose}>
              <ListItemText primary={notification.text} />
            </ListItem>
          ))}
        </List>
      </Popover>
    </div>
  );
};

export default Notifications;
