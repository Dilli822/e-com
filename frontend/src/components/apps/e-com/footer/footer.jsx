import React from 'react';
import { Container, Grid, Typography, Link } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: '#212121',
    color: '#fff',
    padding: theme.spacing(6, 0),
    
  },
  listItem: {
    marginBottom: theme.spacing(2),
    paddingLeft: "0!important",
  },
  listItemLink: {
    color: '#fff!important',
    listStyleType: 'none!important',
    textDecoration: 'none!important',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  borderTop: {
    borderTop: '1px solid #fff',
    margin: theme.spacing(3, 0),
  },
}));

const AppFooter = () => {
  const classes = useStyles();
  const hardcodedArray = [
    {
      product: {
        id: null,
        category_name: null,
        category_description: null,
        product_name: null,
        description: null,
        discount: null,
        stock: null,
        price: null,
        image: null,
        seller_name: null,
        seller_bio: null,
        seller_image: null,
        seller_company_name: null,
        seller_address: null,
        seller_phone_number: null,
        created_at: null,
        updated_at: null,
        category: null,
        seller: null,
      },
      quantity: null,
    },
  ];

  let carty = localStorage.getItem("cartItems");
  if(!carty){
    console.log("does not exist need to add");
    localStorage.setItem("cartItems", JSON.stringify(hardcodedArray));
  }

  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              e-com
            </Typography>
            <ul className={classes.listItem}>
              <li>
                <Typography variant="body1">123 Consectetur at ligula 10660</Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <Link href="tel:010-020-0340" className={classes.listItemLink}>
                    010-020-0340
                  </Link>
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <Link href="mailto:info@company.com" className={classes.listItemLink}>
                    info@company.com
                  </Link>
                </Typography>
              </li>
            </ul>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Products
            </Typography>
            <ul className={classes.listItem}>
              <li>
                <Link href="#" className={classes.listItemLink}>Clothes</Link>
              </li>
              <li>
                <Link href="#" className={classes.listItemLink}>Shoes</Link>
              </li>
              <li>
                <Link href="#" className={classes.listItemLink}>Sports</Link>
              </li>
              <li>
                <Link href="#" className={classes.listItemLink}>Grocery</Link>
              </li>
              <li>
                <Link href="#" className={classes.listItemLink}>Home Appliances</Link>
              </li>
              <li>
                <Link href="#" className={classes.listItemLink}>Electronics</Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Further Info
            </Typography>
            <ul className={classes.listItem}>
              <li>
                <Link href="#" className={classes.listItemLink}>Home</Link>
              </li>
              <li>
                <Link href="#" className={classes.listItemLink}>About Us</Link>
              </li>
              <li>
                <Link href="#" className={classes.listItemLink}>Shop Locations</Link>
              </li>
              <li>
                <Link href="#" className={classes.listItemLink}>FAQs</Link>
              </li>
              <li>
                <Link href="#" className={classes.listItemLink}>Contact</Link>
              </li>
            </ul>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Payment Partner
            </Typography>
            <Typography variant="body1">
              <Link href="https://esewa.com.np" className={classes.listItemLink} target="_blank" rel="noopener">
                Coming Soon
              </Link>
            </Typography>
          </Grid>
        </Grid>
        <div className={classes.borderTop}></div>
        <Typography variant="body2" align="center" gutterBottom>
          &copy; {new Date().getFullYear()} E-commerce Website. All rights reserved.
        </Typography>
        <Typography variant="body2" align="center">
          Designed Powered By Material-UI
        </Typography>
      </Container>
    </footer>
  );
};

export default AppFooter;
