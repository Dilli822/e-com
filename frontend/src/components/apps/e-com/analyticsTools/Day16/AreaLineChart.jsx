import {
  Grid,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { LineChart, lineElementClasses } from "@mui/x-charts";
const data = [
  400, 3000, 2140, 1999, 4500, 3490, 2333, 1500, 3650, 2222, 4622, 6331,
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
function AreaLineChart() {
  return (
    <Grid container>
      <Grid item md={12}>
        <Typography variant="h5" gutterBottom>
          Sales Growth
        </Typography>
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
        <LineChart
          width={500}
          height={300}
          series={[{ data: data, area: true, showMark: false }]}
          xAxis={[{ scaleType: "point", data: xLabels }]}
          sx={{ [`&.${lineElementClasses.root}`]: { display: "none" } }}
        ></LineChart>
      </Grid>
    </Grid>
  );
}
export default AreaLineChart;
