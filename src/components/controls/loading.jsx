import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function CircularIndeterminate(props) {
  return (
    <Box
      sx={{
        display: `${props.loading}`,
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: "rgb(124 124 124 / 33%)",
        padding: "0px !important",
        zIndex: "9999",
      }}
    >
      <CircularProgress
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </Box>
  );
}
