import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

export const EditProfileInfoForm = (props) => {
  const {
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    isValid,
    setFieldTouched,
    setFieldValue,
    OpenNoti,
    SetMessage,
  } = props;

  //updates state and tracks what fields were touched
  const change = (name, e) => {
    e.persist();
    handleChange(e);
    setFieldTouched(name, true, false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Paper
        classes={{
          root: "EditProfileModalForm",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Personal Information
        </Typography>

        <TextField
          id="FullName"
          name="FullName"
          label="Full Name"
          value={values.FullName}
          fullWidth
          onChange={change.bind(null, "FullName")}
          helperText={touched.FullName ? errors.FullName : ""}
          error={touched.FullName && Boolean(errors.FullName)}
        />
        <TextField
          fullWidth
          id="Tagline"
          label="Tagline"
          value={values.Tagline}
          onChange={change.bind(null, "Tagline")}
        />
        <TextField
          fullWidth
          id="CompanyName"
          label="Company Name"
          value={values.CompanyName}
          onChange={change.bind(null, "CompanyName")}
        />
        <TextField
          fullWidth
          id="Twitter"
          label="Twitter"
          value={values.Twitter}
          onChange={change.bind(null, "Twitter")}
        />
        <TextField
          fullWidth
          id="Facebook"
          label="Facebook"
          value={values.Facebook}
          onChange={change.bind(null, "Facebook")}
        />
        <TextField
          fullWidth
          id="WebAddress"
          label="Web Address"
          value={values.WebAddress}
          onChange={change.bind(null, "WebAddress")}
        />
      </Paper>
      <DialogActions>
        <Button onClick={props.CloseDialog}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary" autoFocus>
          Update Info
        </Button>
      </DialogActions>
    </form>
  );
};
