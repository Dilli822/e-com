import AppFooter from "../../footer/footer";
import Header from "../../header/header";
import BuyerProfileUpdate from "./update_profile";
import { makeStyles } from "@mui/styles";
import {
  Container,
  Card,
  Typography,
  Button,
  TextField,
  Grid,
  CircularProgress,
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
    display: "flex",
    justifyContent: "space-between",
  },
}));

export default function BuyerProfile() {
  const classes = useStyles();

  return (
    <>
      <Header />
      <Container className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <BuyerProfileUpdate />
          </Grid>

          <Grid item xs={12} md={8}>
          <Card className={classes.card}>
            <h2>Buyer Order & Order History</h2>
            </Card>
          </Grid>


        </Grid>
      </Container>
      <AppFooter />
    </>
  );
}
