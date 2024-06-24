import {
  Grid,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Card,
} from "@mui/material";
import { LineChart, lineElementClasses } from "@mui/x-charts";
import { makeStyles } from "@mui/styles";
const data = [
  900, 3000, 2140, 1999, 4500, 3490, 2333, 1500, 3650, 2222, 4622, 6331,
  // 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

const xLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(2),
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
  },
}));

function AreaLineChart() {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item md={12}>
        <Card className={classes.card}>
          <Typography variant="h5" gutterBottom>
            Customers Growth
          </Typography>

          <FormControl variant="outlined" sx={{ width: "100%" }}>
            <InputLabel>Year</InputLabel>
            <Grid container>
              <Grid item md={2}>
                <Select label="Year" defaultValue="" fullWidth>
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="2024">2023</MenuItem>

                  <MenuItem value="2022">2022</MenuItem>
                  <MenuItem value="2021">2021</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </FormControl>
          <LineChart
            height={400}
            series={[{ data: data, area: true, showMark: false }]}
            xAxis={[{ scaleType: "point", data: xLabels }]}
            sx={{ [`&.${lineElementClasses.root}`]: { display: "none" } }}
          ></LineChart>
        </Card>
      </Grid>
    </Grid>
  );
}
export default AreaLineChart;
