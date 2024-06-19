import { Grid, Typography } from "@mui/material";
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

const data = {
  labels: [1, 2, 3, 4, 5, 6, 7, 8],
  datasets: [
    {
      label: "Sparkline Data",
      data: [1, 6, 8, 3, 5, 7, 5, 2],
      borderColor: "#8884d8",
      fill: false,
      pointRadius: 0,
      tension: 0.4,
    },
  ],
};

const options = {
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: "X Axis",
      },
      ticks: {
        display: true,
      },
    },
    y: {
      display: true,
      title: {
        display: true,
        text: "Y Axis",
      },
      ticks: {
        display: true,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
    },
  },
};

function SparklineChart() {
  return (
    <Grid container>
      <Grid md={4}>
        <Typography variant="h6" component="div" gutterBottom>
          My Sparkline Chart
        </Typography>
        <Line data={data} options={options} height={100} />
      </Grid>
    </Grid>
  );
}

export default SparklineChart;
