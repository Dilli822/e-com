import {
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  Card,
  MenuItem,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import { makeStyles } from "@mui/styles";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  CategoryScale,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  CategoryScale
);
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

function Chart() {
  const classes = useStyles();

  const data = {
    labels: [
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
    ],
    datasets: [
      {
        label: "Sales Growth",
        data: [
          3000, 4000, 3200, 4500, 5000, 5300, 6000, 5800, 6500, 6200, 7000,
          7500,
          // 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
        borderColor: "#3f51b5",
        backgroundColor: "rgba(63, 81, 181, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        title: {
          display: true,
          text: "Sales (Rs.)",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <Grid container>
      <Grid item md={12}>
        <Card className={classes.card}>
          <Typography variant="h6" component="div" gutterBottom>
            Sales Growth
          </Typography>

          <Grid item>
            <FormControl variant="outlined" sx={{ width: "100%" }}>
              <InputLabel>Year</InputLabel>
              <Grid container>
                <Grid item md={2}>
                  <Select label="Year" defaultValue="" fullWidth>
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="2021">2021</MenuItem>
                    <MenuItem value="2022">2022</MenuItem>
                    <MenuItem value="2023">2023</MenuItem>
                    <MenuItem value="2024">2023</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </FormControl>
            <br /> <br />
            <Line data={data} options={options} height={70} />
          </Grid>
        </Card>
      </Grid>
      <Grid item md={6}></Grid>
    </Grid>
  );
}

export default Chart;
