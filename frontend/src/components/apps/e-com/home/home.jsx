import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderPublic from "../header/headerPublic";
import Main from "../main/main";
import Banner from "../banner/banner";
import AppFooter from "../footer/footer";
import {
  Container,
} from "@mui/material";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      navigate("/feed");
    }
  }, [navigate]);

  return (
    <>
      <HeaderPublic />
      <br />
      <Banner />
      <Container>
        <Main />
      </Container>
      <br />
      <br />
      <AppFooter />
    </>
  );
}
