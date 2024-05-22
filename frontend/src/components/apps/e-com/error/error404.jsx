import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid, Typography, Link } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  page404: {
    padding: "40px 0",
    background: "#fff",
    fontFamily: "'Arvo', serif",
    textAlign: "center"
  },
  fourZeroFourBg: {
    backgroundImage:
      "url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)",
    height: "70vh",
    width: "100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  },
  fourZeroFourHeading: {
    fontSize: "80px",
  },
  contentBox404: {},
  link404: {
    color: "#fff",
    padding: "10px 20px",
    background: "#39ac31",
    display: "inline-block",
    textDecoration: "none",
    fontFamily: "sans-serif"
  },
}));

function PageNotFound() {
  const classes = useStyles();

  return (
    <section className={classes.page404}>
      <Container>
        <Grid container justify="center">
          <Grid item xs={12}>
            <Grid container justify="center">
              <div className={classes.fourZeroFourBg}>
                <Typography variant="h1" className={classes.fourZeroFourHeading}>
                  404
                </Typography>
              </div>
            </Grid>
            <div className={classes.contentBox404}>
              <Typography variant="h3" className={classes.fourZeroFourHeading}>
                Look like you're lost
              </Typography>
              <Typography variant="body1">
                The page you are looking for is not available!
              </Typography>
              <Link href="/" className={classes.link404}>
                Go to Home
              </Link>
            </div>
          </Grid>
        </Grid>
      </Container>
    </section>
  );
}

export default PageNotFound;
