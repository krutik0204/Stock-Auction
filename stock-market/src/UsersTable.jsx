import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect } from "react";
import { getUsersData } from "./features/users/user_service";
import { useState } from "react";
import { UsersContext } from "./App";
import { useContext } from "react";
import StockUsersContext from "./context/UserContext";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Button } from "@mui/material";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function BasicTable() {
  const _users = useContext(StockUsersContext);
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const updateUser = (userData) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    };

    fetch("https://stock-auction.herokuapp.com/user/update", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        handleClick();
      });
  };

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          User updated!
        </Alert>
      </Snackbar>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>User Name</TableCell>
            <TableCell align="right" style={{ fontWeight: "bold" }}>
              Stocks
            </TableCell>
            <TableCell align="right" style={{ fontWeight: "bold" }}>
              fiat&nbsp;($)
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {_users.users.map((row) => {
            var editedValues = {};
            return (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  key={row.id + "N"}
                  contentEditable
                  onInput={(e) => {
                    editedValues["name"] = e.target.textContent;
                  }}
                >
                  {row.name}
                </TableCell>
                <TableCell
                  align="right"
                  contentEditable
                  key={row.id + "s"}
                  onInput={(e) => {
                    editedValues["stocks"] = e.target.textContent;
                  }}
                >
                  {row.stocks}
                </TableCell>
                <TableCell
                  align="right"
                  contentEditable
                  key={row.id + "f"}
                  onInput={(e) => {
                    editedValues["fiat"] = e.target.textContent;
                  }}
                >
                  {row.fiat}
                </TableCell>
                <TableCell
                  align="right"
                  onClick={() => {
                    updateUser({
                      id: row.id,
                      name: editedValues.name ?? row.name,
                      stocks: parseFloat(editedValues.stocks ?? row.stocks),
                      fiat: parseFloat(editedValues.fiat ?? row.fiat),
                    });
                  }}
                >
                  <Button>Update</Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
