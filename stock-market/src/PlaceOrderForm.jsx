import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Box } from "@mui/system";
import { Button, Snackbar, TextField } from "@mui/material";
import { async } from "@firebase/util";
import { useEffect } from "react";
import { getUsersData } from "./features/users/user_service";
import { useContext } from "react";
import MuiAlert from "@mui/material/Alert";

import StockUsersContext from "./context/UserContext";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function PlaceOrderForm() {
  const [loading, setLoading] = React.useState(false);
  const _users = useContext(StockUsersContext);

  const [action, setAction] = React.useState(null);
  const [orderType, setOrderType] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [price, setPrice] = React.useState(null);
  const [amount, setAmount] = React.useState(0);

  const handleActionChange = (event) => {
    setAction(event.target.value);
  };

  const handleOrderTypeChange = (event) => {
    setOrderType(event.target.value);
  };
  const handleUserChange = (event) => {
    setUser(event.target.value);
  };
  const handleNumberPriceChange = (event) => {
    setPrice(parseInt(event.target.value) ?? 0);
  };
  const handleNumberOfStockChange = (event) => {
    setAmount(parseInt(event.target.value) ?? 0);
  };

  function getFomrFilledBoolean() {
    if (action === null || user === null || amount === 0 || orderType === null)
      return false;

    if (orderType === "L" && price === null) return false;
    return true;
  }
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

  const handlePlaceOrder = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        action: action,
        type: orderType,
        quantity: amount,
        price: price,
      }),
    };

    fetch(
      "https://stock-auction.herokuapp.com/stock/createOrder",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setLoading(false);
        handleClick();
        setAction(null);
        setAmount(0);
        setPrice(null);
        setUser(null);
      });
  };

  return (
    <Box p={3}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Order Placed!!
        </Alert>
      </Snackbar>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="type">Type</InputLabel>
        <Select
          labelId="type"
          id="demo-simple-select-helper"
          value={action}
          label="Type"
          style={{
            color: action === "B" ? "#45CE79" : "#DF3B22",
          }}
          onChange={handleActionChange}
        >
          <MenuItem value={"B"} style={{ color: "#45CE79" }}>
            Buy
          </MenuItem>
          <MenuItem value={"S"} style={{ color: "#DF3B22" }}>
            Sell
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 180 }}>
        <InputLabel id="orderType">OrderType</InputLabel>
        <Select
          labelId="orderType"
          value={orderType}
          label="OrderType"
          onChange={handleOrderTypeChange}
        >
          <MenuItem value={"M"}>Market</MenuItem>
          <MenuItem value={"L"}>Limit</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: "100%" }}>
        <InputLabel id="user">Select User</InputLabel>
        <Select
          labelId="user"
          value={user}
          label="user"
          onChange={handleUserChange}
        >
          {_users.users.map((v) => {
            return <MenuItem value={v}>{v.name}</MenuItem>;
          })}
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: "100%" }}>
        <TextField
          id="amount"
          label="Stock Amount"
          type="Number"
          value={amount}
          InputProps={{ inputProps: { min: 0 } }}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleNumberOfStockChange}
        />
      </FormControl>
      {orderType === "L" ? (
        <FormControl sx={{ m: 1, minWidth: "100%" }}>
          <TextField
            id="price"
            label="Price"
            type="Number"
            InputProps={{ inputProps: { min: 0 } }}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleNumberPriceChange}
          />
        </FormControl>
      ) : (
        <></>
      )}
      <FormControl sx={{ m: 1, minWidth: "100%" }}>
        <Button
          disabled={loading || !getFomrFilledBoolean()}
          variant="contained"
          disableElevation
          style={{
            // backgroundColor: "#8884d8",s
            color: "white",
            fontWeight: "bold",
          }}
          onClick={async () => {
            setLoading(true);
            handlePlaceOrder();
          }}
        >
          {loading ? "Placing..." : "Place Order"}
        </Button>
      </FormControl>
    </Box>
  );
}
