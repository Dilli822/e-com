import React, { useState, useEffect } from "react";
import Main from "../main/main"
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  InputBase,
  IconButton,
  useMediaQuery,
  Drawer,
  List,
  Menu,
  MenuItem,
  ListItem,
  ListItemText,
} from "@mui/material";

import AppFooter from "../footer/footer";
import Header from "../header/header";
import Banner from "../banner/banner"
import { useNavigate } from "react-router-dom";
export default function Feed() {

  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [IsBuyer, setIsBuyer] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [IsSeller, setIsSeller] = useState("");




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
        setIsBuyer(data.is_buyer);
        setIsSeller(data.is_seller);
      } else {
        setError("Failed to fetch user ID");
      }
    } catch (error) {
      setError("Error fetching user ID");
    }
  };

  if(IsBuyer){
    console.log("buyer", IsBuyer);
    localStorage.setItem("IsBuyer", IsBuyer);
  }else{
    console.log("seller ", IsSeller);
    localStorage.setItem("IsSeller", IsSeller);
  }

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/");
    }
  }, [navigate]);
  
  useEffect(()=>{

    fetchUserId();
  }, [])



  return (
    <>
    <Header></Header>
    <br />
    <Banner/>
    <Container>

      <Main/>
      </Container>
      <br />
      <br />
      <AppFooter />
    </>
  );
}
