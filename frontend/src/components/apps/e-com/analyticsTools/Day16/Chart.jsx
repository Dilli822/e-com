import {
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Line } from "react-chartjs-2";
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

function Chart() {
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
        <Typography variant="h6" component="div" gutterBottom>
          Sales Growth
        </Typography>
        <Grid item>
          <FormControl variant="outlined" sx={{ width: "100px" }}>
            <InputLabel>Year</InputLabel>
            <Select
              label="Year"
              defaultValue=""
              sx={{
                height: "50px",
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="2021">2021</MenuItem>
              <MenuItem value="2022">2022</MenuItem>
              <MenuItem value="2023">2023</MenuItem>
              <MenuItem value="2024">2023</MenuItem>
            </Select>
          </FormControl>

          <Line data={data} options={options} height={70} />
        </Grid>
      </Grid>
      <Grid item md={6}></Grid>
    </Grid>
  );
}

export default Chart;
