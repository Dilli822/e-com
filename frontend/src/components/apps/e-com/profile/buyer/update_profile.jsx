import React, { useState, useEffect } from "react";
import Header from "../../header/header";
import AppFooter from "../../footer/footer";
import { makeStyles } from "@mui/styles";
import { Modal, Box } from "@mui/material";
import {
  Container,
  Card,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Grid,
} from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  card: {
    padding: theme.spacing(4),
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
  },
}));

function BuyerProfileUpdate() {
  const classes = useStyles();
  const [profileData, setProfileData] = useState({});
  const [userId, setUserId] = useState("");
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [initialProfileData, setInitialProfileData] = useState({});
  const [buyerEmail, setBuyerEmail] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchProfileData();
    }
  }, [userId]);

  const fetchUserId = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/account/user/details/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUserId(data.id);
        setBuyerName(data.username);
        setBuyerEmail(data.email);
      } else {
        setError("Failed to fetch user ID");
      }
    } catch (error) {
      setError("Error fetching user ID");
    }
  };

  const fetchProfileData = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/account/buyer-profile/${userId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        setInitialProfileData(data);
      } else {
        setError("Failed to fetch profile data");
      }
    } catch (error) {
      setError("Error fetching profile data");
    }
  };

  const handleLogout = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogoutConfirm = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleEditProfile = () => {
    setProfileEditMode(true);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append("image", imageFile);
      }
      formData.append("address", profileData.address);
      formData.append("phone_number", profileData.phone_number);
      formData.append("bio", profileData.bio);
      formData.append("user", userId);
      const response = await fetch(
        `http://127.0.0.1:8000/account/buyer-profile/${userId}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: formData,
        }
      );
      if (response.ok) {
        setProfileEditMode(false);
        setMessage("Profile data updated successfully");
      } else {
        setMessage("Failed to update profile data");
      }
    } catch (error) {
      setMessage("Error updating profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setProfileData(initialProfileData);
    setProfileEditMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditButtonClick = () => {
    setProfileEditMode(true);
  };

  const handleSaveButtonClick = () => {
    handleSaveProfile();
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);

    // Update the image preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileData((prevData) => ({
        ...prevData,
        image: e.target.result,
      }));
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div>
      <Card className={classes.card}>
        <img
          key={profileData.image} // Add key prop here
          src={
            imageFile
              ? URL.createObjectURL(imageFile)
              : `http://127.0.0.1:8000${profileData.image}`
          }
          alt="Profile Image"
          style={{ maxWidth: "100%", width: "300px" }}
        />

        {profileEditMode && (
          <div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
        )}
        <hr />

        <Typography variant="h6" gutterBottom>
          username: {buyerName}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Email: {buyerEmail}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Id: # {profileData.buyer_id}
        </Typography>

        <Typography variant="h6" gutterBottom>
          address:{" "}
          {profileEditMode ? (
            <TextField
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
            />
          ) : (
            profileData.address
          )}
        </Typography>

        <Typography variant="h6" gutterBottom>
          Phone Number:{" "}
          {profileEditMode ? (
            <TextField
              name="phone_number"
              value={profileData.phone_number}
              onChange={handleInputChange}
            />
          ) : (
            profileData.phone_number
          )}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Bio:{" "}
          {profileEditMode ? (
            <TextField
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
            />
          ) : (
            profileData.bio
          )}
        </Typography>

        {profileEditMode ? (
          <div className={classes.buttonGroup}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveButtonClick}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Save"}
            </Button>
            &nbsp;
            <Button variant="contained" onClick={handleCancelEdit}>
              Cancel
            </Button>
          </div>
        ) : (
          <div className={classes.buttonGroup}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditButtonClick}
            >
              Edit
            </Button>
            &nbsp; &nbsp; 
            <Button variant="contained" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        )}

        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Are you sure you want to logout?
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 4 }}>
              <Button variant="contained" onClick={handleClose}>
                Cancel
              </Button>
              &nbsp;
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogoutConfirm}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Modal>
      </Card>
    </div>
  );
}

export default BuyerProfileUpdate;
