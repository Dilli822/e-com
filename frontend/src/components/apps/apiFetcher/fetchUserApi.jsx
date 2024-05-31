import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Container,
  Button,
  TextField,
  Collapse,
} from "@material-ui/core";
import AutoLocationInput from "../e-com/location/autoComplete_Location"; // Import the AutoLocationInput component
import CartDetails from "../e-com/cart/cartDetails";

const UserProfileMaster = () => {
  const [userData, setUserData] = useState({});
  const [error, setError] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null); // State to hold selected address
  const [newAddress, setNewAddress] = useState(null); // State to hold new address
  const [tagAddress, setTagAddress] = useState(null); // State to hold the final address tag
  const [collapsed, setCollapsed] = useState(false); // State for collapse
  const navigate = useNavigate();
  const [isBuyer, setIsBuyer] = useState(false);
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // console.log(userData)

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setQuery(inputValue);

    // Trigger search when the query is not empty
    if (inputValue.trim() !== "") {
      searchLocation(inputValue);
    } else {
      // Clear the results if the input is empty
      setResults([]);
    }
  };

  const searchLocation = (inputValue) => {
    const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      inputValue
    )}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setResults(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleLiClick = (displayName) => {
    // Create a new address object
    const newAddress = {
      address: displayName,
      // Add latitude and longitude if available from the API response
      // Otherwise, you can fetch them separately using another API
      lat: null,
      lng: null,
    };

    // Set the selected address state with the new address
    setSelectedAddress(newAddress);
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/account/user/profile/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setIsBuyer(data.user.is_buyer);
        setIsSeller(data.user.is_seller);
      } else {
        setError("Failed to fetch user profile");
      }
    } catch (error) {
      setError("Error fetching user profile");
    }
  };

  const handleSetAddress = () => {
    // Set the new address state with the selected address
    setNewAddress(selectedAddress);
    // Clear the input field
    setQuery("");
    // Create a new tag with the updated final address
    setTagAddress(selectedAddress.address);
    // Reset the selected address state
    setSelectedAddress(null);
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  // console.log(isBuyer)
  let isFinalBuyer = isBuyer;


  return (
    <>
      {error && <p>Error: {error}</p>}
      <br />
      {isSeller ? (
        <>
          Seller: <span id="isSeller"> Yes </span> {/* If true, display "Yes" */}, a seller
          <br />
        </>
      ) : (
        <>
          {/* Seller: No ,If false, display "No" */}
          {/* Not a seller <br /> */}
        </>
      )}


{isBuyer ? (
        <>
          Buyer: <span id="isBuyer">Yes</span> {/* If true, display "Yes" */}, a Buyer
          <br />
        </>
      ) : (
        <>
          {/* Seller: No ,If false, display "No" */}
          {/* Not a seller <br /> */}
        </>
      )}

      {userData && (
        <>
          {isSeller && userData.sellers ? (
            <>
              ID: #{userData.sellers[0].seller_id}
              <br />
              Company Name: {userData.sellers[0].company_name}
              <br />
              Address: {userData.sellers[0].address}
              <br />
              <br />
              Phone Number: {userData.sellers[0].phone_number}
              <br />
              Username: {userData.user.username} <br />
              Email: {userData.user.email}
              <br />
            </>
          ) : isBuyer ? (
            <>
              Buyer ID: # <span id="buyerID"> {userData.buyer.buyer_id} </span>
              <br />
              Name: <span id="buyerUserName">{userData.user.username} </span>
              <br />
              Email: <span id="buyerEmail">{userData.user.email} </span> <br />
              Phone Number:{" "}
              <span id="buyerContact">{userData.buyer.phone_number} </span>
              <br />
              <span id="isSellerI">{userData.user.is_buyer}</span>
              {tagAddress ? (
                <span variant="h6">
                  Final Shipping Address:{" "}
                  <b>
                    {" "}
                    <span id="tagAddress"> {tagAddress} </span>{" "}
                  </b>
                  <br />
                  <Button
                    onClick={() => {
                      // Reset the selected address state
                      setSelectedAddress(null);
                      // Reset the new address state
                      setNewAddress(null);
                      // Reset the tag address state
                      setTagAddress(null);
                      // Clear the input field
                      setQuery("");
                    }}
                    variant="contained"
                    color="secondary"
                  >
                    Reset Updated Address
                  </Button>
                </span>
              ) : (
                <>
                  Shipping Address:{" "}
                  <span id="buyerDefaultAdress">{userData.buyer.address}</span>
                </>
              )}
            </>
          ) : null}

          {/* <Typography variant="body1">
            <b>Update Shipping Address</b>
          </Typography>

          <Button
            onClick={toggleCollapse}
            variant="contained"
            color="secondary"
            style={{ marginTop: "7px" }}
          >
            {collapsed ? "Hide" : "Update Address"}
          </Button>
          <Collapse in={collapsed}>
            <div>
              <TextField
                type="text"
                placeholder="Update Your location..."
                value={query}
                onChange={handleInputChange}
                label="Update Your Delivery Address"
                variant="filled"
                fullWidth
              />

              <div style={{ height: "auto", overflow: "auto" }}>
                {results.map((result, index) => (
                  <p
                    key={index}
                    onClick={() => handleLiClick(result.display_name)}
                  >
                    {result.display_name}
                  </p>
                ))}
              </div>
            </div> */}

          {/* {selectedAddress && !newAddress && (
              <div>
                <Typography variant="body2">
                  <b>

                    Selected Final Customer Delivery Address:{" "}
                   <span id="finalTagAddress"> {selectedAddress.address} </span> 
                  </b>
                </Typography>

        

                <br />
                <Button
                  onClick={handleSetAddress}
                  variant="contained"
                  color="secondary"
                >
                  Set New Address
                </Button>
              </div>
            )} */}
          {/* </Collapse> */}
        </>
      )}
    </>
  );
};

export default UserProfileMaster;
