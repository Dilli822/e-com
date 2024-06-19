import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Stack, Button } from "@mui/material";
export const MuiToolTip = () => {
  return (
    <Stack direction="row" spacing={2}>
      <Tooltip title="Delete">
        <IconButton>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Add" arrow>
        <Button>Arrow</Button>
      </Tooltip>
    </Stack>
  );
};
