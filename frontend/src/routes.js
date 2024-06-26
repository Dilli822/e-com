// Routes.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PublicMain from "./components/apps/e-com/main/publicMain";

import Feed from "./components/apps/e-com/home/feed";
import Home from "./components/apps/e-com/home/home";
import SignUp from "./components/apps/e-com/auth/signup";
import Login from "./components/apps/e-com/auth/login";
import BuyerProfile from "./components/apps/e-com/profile/buyer/buyer_profile";
import ForgotPassword from "./components/apps/e-com/auth/forgot-password";
import ResetPasswordConfirm from "./components/apps/e-com/auth/password-reset-confirmation";
import SellerProfile from "./components/apps/e-com/profile/seller/seller_profile";
import CRUDCategoryForm from "./components/apps/e-com/categories/create/create_categories";
import UploadProductForm from "./components/apps/e-com/products/seller/uploadProducts/uploadProducts";
import CategoryOptions from "./components/apps/e-com/categories/read/listAllCategories";
import PageNotFound from "./components/apps/e-com/error/error404";
import SellerProductEdit from "./components/apps/e-com/products/seller/editProducts/editProducts";
import ProductDetails from "./components/apps/e-com/products/details/public_product_details";
import AddReview from "./components/apps/e-com/reviews/upload/addReview";
import PeopleProductView from "./components/apps/e-com/products/productViews/peopleProductViews";
import CartDetails from "./components/apps/e-com/cart/cartDetails";
import CheckOut from "./components/apps/e-com/checkOut/check_Out";
import UserProfileMaster from "./components/apps/apiFetcher/fetchUserApi";
import AutoLocationInput from "./components/apps/e-com/location/autoComplete_Location";
import BuyersOrdersList from "./components/apps/e-com/orders/buyers/list/buyerOrder_list";
import ReviewList from "./components/apps/e-com/reviews/list/reviewList";
import ReviewCRUD from "./components/apps/e-com/reviews/list/reviewCRUD";
import FilterProducts from "./components/apps/e-com/products/filters/filterProducts";
import CategoryFilterProducts from "./components/apps/e-com/products/filters/categoryFilters";
import EsewaPayment from "./components/apps/e-com/payment/e-sewa/e-sewa";
import KhaltiPayment from "./components/apps/e-com/payment/khalti/khalti";

const MainRouter = () => {
  return (
    <>
      <Routes>
       <Route path="*" element={<PageNotFound />} /> 
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/buyer" element={<BuyerProfile/>} />
        <Route path="/profile/seller" element={<SellerProfile/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/e-com/reset-password/:token" element={<ResetPasswordConfirm />} />
        <Route path="/edit/category" element={<CRUDCategoryForm />} />
        <Route path="/product/upload" element={<UploadProductForm />} />
        {/* <Route path="/product/category/list" element={<CategoryOptions />} /> */}
        <Route path="/product/:str/:id/:str" element={<ProductDetails />} />
        <Route path="/product/review/add/" element={<AddReview />} />
        <Route path="/product/review/crud/" element={<ReviewCRUD />} />
        {/* <Route path="/product/people-view/" element={<PeopleProductView />} /> */}
        <Route path="/cart/details/" element={<CartDetails />} />
        <Route path="/product/filter/" element={<FilterProducts />} />
        <Route path="/checkout/" element={<CheckOut />} />
        <Route path="/user/apiFetch/" element={<UserProfileMaster />} />
        <Route path="/filter-products/:str/" element={<CategoryFilterProducts />} />
        <Route path="/payment/e-sewa/" element={<EsewaPayment />} />
        <Route path="/payment/khalti/" element={<KhaltiPayment />} />
        {/* <Route path="/auto-location/" element={<AutoLocationInput />} /> */}
        {/* <Route path="/buyer/order/list/" element={<BuyersOrdersList/>}/> */}
        {/* <Route path="/product/review/edit?:id/" element={<EditReview />} /> */}
        {/* <Route path="/seller/product/edit" element={<SellerProductEdit />} /> */}
    
      </Routes>
    </>
  );
};

export default MainRouter;
