import React from "react";
import Snackbar from "@material-ui/core/Snackbar";

//component used to act as a template for notifications
export default function SnackBar(props) {
  return (
    <Snackbar
      autoHideDuration={props.autoHideDuration ? props.autoHideDuration : null }
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      key={{ vertical: "bottom", horizontal: "center" }}
      open={props.OpenNoti}
      onClose={() => props.CloseNoti()}
      ContentProps={{
        "aria-describedby": "message-id"
      }}
      message={<span id="message-id">{props.message}</span>}
    />
  );
}
