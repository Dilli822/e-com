// import React from "react";
// import { makeStyles } from "@mui/styles";
// import AppFooter from "../../footer/footer";
// import AppHeader from "../../header/header";
// import HeaderPublic from "../../header/headerPublic";
// import { useNavigate } from "react-router-dom";
// import {
//   Grid,
//   Card,
//   CardActionArea,
//   CardMedia,
//   CardContent,
//   Typography,
//   Container,
// } from "@mui/material";
// import { useLocation } from "react-router-dom";

// const useStyles = makeStyles((theme) => ({
//   title: {
//     flexGrow: 1,
//   },
// }));

// const CategoryFilterProducts = () => {
//   const classes = useStyles();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { category, products } = location.state || {
//     category: ""
//   };

//   console.log("category", category)
//   console.log("products", products)

//   console.log("products are ", products)

//   const handleCardClick = (product) => {
//     navigate(
//       `/product/${product.product_name}/${product.id}/${product.category_name}`,
//       { state: { product } }
//     ); // Pass product details as state
//   };

//   const accessToeken = localStorage.getItem("accessToken");
//   return (
//     <div>
//       {accessToeken ? <AppHeader /> : <HeaderPublic />}
//       <br /> <br />
//       <Container>
//         <Grid container spacing={2}>
//           <Grid
//             item
//             md={3}
//             style={{ borderRight: "1px solid #f4f4f4", padding: "10px" }}
//           >
//             <Grid item md={12}>
//               <Typography variant="h6">
//                 {/* {products.length}{" "}
//                 {products.length === 1 ? "item found" : "items found"} */}
//               </Typography>
//             </Grid>
//             <Typography variant="h6" gutterBottom>
//               Category: {category} <br />
//             </Typography>

//             <Typography variant="body1" gutterBottom>
//               Filter <br />
//             </Typography>
//             <Typography variant="body1" gutterBottom>
//               Promotions & Services <br />
//               <div className="service-item--PR9FA">
//                 Delivery Free ~{" "}
//                 <img
//                   src="https://img.alicdn.com/imgextra/i4/O1CN01Tp04IC1x3IWhZt8RK_!!6000000006387-2-tps-72-72.png"
//                   loading="lazy"
//                   style={{ width: "20px" }}
//                   alt=""
//                 ></img>
//                 | Best Price ~{" "}
//                 <img
//                   id="id-img"
//                   className="image--WOyuZ "
//                   src="https://img.alicdn.com/imgextra/i4/O1CN01pr1AG92A8sM4YKlmy_!!6000000008159-2-tps-72-72.png"
//                   loading="lazy"
//                   style={{ width: "20px " }}
//                   alt=""
//                 ></img>
//               </div>
//               <div className="service-item--PR9FA">
//                 Cash On Delivery{" "}
//                 <img
//                   className="image--WOyuZ "
//                   src="https://img.alicdn.com/imgextra/i2/O1CN01sEvCqG1M7ICGGpTXv_!!6000000001387-2-tps-72-72.png"
//                   loading="lazy"
//                   style={{ width: "20px " }}
//                   alt=""
//                 />
//               </div>
//             </Typography>
//           </Grid>

//           <Grid item md={9}>
//             <Grid container spacing={2}>
//               {products.map((product) => (
//                 <Grid item md={2} key={product.id}>
//                   <Card
//                     style={{
//                       height: "100%",
//                       display: "flex",
//                       flexDirection: "column",
//                     }}
//                     onClick={() => handleCardClick(product)}
//                   >
//                     <CardActionArea style={{ flex: 1 }}>
//                       <CardMedia
//                         component="div"
//                         style={{ padding: "8px", overflow: "hidden" }}
//                       >
//                         <img
//                           alt={product.description}
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                             objectFit: "contain",
//                           }}
//                           src={product.image}
//                           title={product.description}
//                         />
//                       </CardMedia>
//                       <CardContent>
//                         <Typography
//                           gutterBottom
//                           variant="body1"
//                           component="body1"
//                         >
//                           {product.product_name}
//                         </Typography>
//                         <Typography
//                           variant="body2"
//                           color="textSecondary"
//                           component="p"
//                         >
//                           Price: ${product.price}
//                         </Typography>
//                         <Typography
//                           variant="body2"
//                           color="textSecondary"
//                           component="p"
//                         >
//                           Stock: {product.stock}
//                         </Typography>
//                       </CardContent>
//                     </CardActionArea>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           </Grid>
//         </Grid>
//       </Container>
//       <br /> <br />
//       <br />
//       <AppFooter />
//     </div>
//   );
// };

// export default CategoryFilterProducts;


import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import AppFooter from "../../footer/footer";
import AppHeader from "../../header/header";
import HeaderPublic from "../../header/headerPublic";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Container,
} from "@mui/material";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
}));

const CategoryFilterProducts = () => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const { category } = location.state || { category: "" };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/e-com/api/products/public/list/?category=${category}`
        );
        setProducts(response.data[category] || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (category) {
      fetchData();
    }
  }, [category]);

  const handleCardClick = (product) => {
    navigate(
      `/product/${product.product_name}/${product.id}/${product.category_name}`,
      { state: { product } }
    ); // Pass product details as state
  };

  const accessToken = localStorage.getItem("accessToken");

  return (
    <div>
      {accessToken ? <AppHeader /> : <HeaderPublic />}
      <br /> <br />
      <Container>
        <Grid container spacing={2}>
          <Grid
            item
            md={3}
            style={{ borderRight: "1px solid #f4f4f4", padding: "10px" }}
          >
            <Grid item md={12}>
              <Typography variant="h6">
                {products.length}{" "}
                {products.length === 1 ? "item found" : "items found"}
              </Typography>
            </Grid>
            <Typography variant="h6" gutterBottom>
              Category: {category} <br />
            </Typography>

            <Typography variant="body1" gutterBottom>
              Filter <br />
            </Typography>
            <Typography variant="body1" gutterBottom>
              Promotions & Services <br />
              <div className="service-item--PR9FA">
                Delivery Free ~{" "}
                <img
                  src="https://img.alicdn.com/imgextra/i4/O1CN01Tp04IC1x3IWhZt8RK_!!6000000006387-2-tps-72-72.png"
                  loading="lazy"
                  style={{ width: "20px" }}
                  alt=""
                ></img>
                | Best Price ~{" "}
                <img
                  id="id-img"
                  className="image--WOyuZ "
                  src="https://img.alicdn.com/imgextra/i4/O1CN01pr1AG92A8sM4YKlmy_!!6000000008159-2-tps-72-72.png"
                  loading="lazy"
                  style={{ width: "20px " }}
                  alt=""
                ></img>
              </div>
              <div className="service-item--PR9FA">
                Cash On Delivery{" "}
                <img
                  className="image--WOyuZ "
                  src="https://img.alicdn.com/imgextra/i2/O1CN01sEvCqG1M7ICGGpTXv_!!6000000001387-2-tps-72-72.png"
                  loading="lazy"
                  style={{ width: "20px " }}
                  alt=""
                />
              </div>
            </Typography>
          </Grid>

          <Grid item md={9}>
            <Grid container spacing={2}>
              {products.map((product) => (
                <Grid item md={2} key={product.id}>
                  <Card
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    onClick={() => handleCardClick(product)}
                  >
                    <CardActionArea style={{ flex: 1 }}>
                      <CardMedia
                        component="div"
                        style={{ padding: "8px", overflow: "hidden" }}
                      >
                        <img
                          alt={product.description}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                          src={product.image}
                          title={product.description}
                        />
                      </CardMedia>
                      <CardContent>
                        <Typography
                          gutterBottom
                          variant="body1"
                          component="body1"
                        >
                          {product.product_name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          Price: ${product.price}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          Stock: {product.stock}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <br /> <br />
      <br />
      <AppFooter />
    </div>
  );
};

export default CategoryFilterProducts;
