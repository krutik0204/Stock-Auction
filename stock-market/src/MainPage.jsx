import { Box, Container } from "@mui/system";
import React, { useContext, useEffect } from "react";
import { firebaseInit } from "./features/users/user_service";
import BasicTable from "./UsersTable";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import PlaceOrderForm from "./PlaceOrderForm";
import TradeTable from "./TradeTable";
import { Button, Divider } from "@mui/material";
import StockUsersContext from "./context/UserContext";
import OrderBook from "./OrderBook";
const MainPage = () => {
  const _users = useContext(StockUsersContext);
  const [loading, setLoading] = React.useState(false);

  const createUser = () => {
    setLoading(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    fetch("https://stock-auction.herokuapp.com/user/create", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        _users.update();
        setLoading(false);
      });
  };

  return (
    <Box
      display={"flex"}
      flexDirection={{ xs: "column", md: "row" }}
      maxHeight={"100vh"}
      height="100vh"
      width="100vw"
      bgcolor={"rgb(23, 23, 23)"}
    >
      <Box
        flex={3}
        bgcolor={"rgb(28, 28, 29)"}
        marginX={1.5}
        marginY={4}
        borderRadius={4}
        display="flex"
        justifyContent={"space-between"}
        flexDirection="column"
      >
        <Box overflow={"scroll"}>
          <h2 style={{ paddingLeft: "10px" }}> Users </h2>
          <Divider />
          <BasicTable />
        </Box>
        <Button
          style={{
            margin: "20px",
          }}
          disabled={loading}
          onClick={createUser}
          variant="contained"
        >
          {loading ? "Creating..." : "Create Random User"}
        </Button>
      </Box>

      <Box
        display={"flex"}
        flexDirection="column"
        flex={6}
        width="100%"
        marginX={1.5}
        marginY={4}
        borderRadius={4}
        alignItems="start"
        justifyContent="start"
      >
        <TradeTable />
      </Box>
      <Box
        flex={3}
        marginX={1.5}
        marginY={4}
        borderRadius={4}
        display="flex"
        justifyContent={"space-between"}
        flexDirection="column"
      >
        <Box
          display={"flex"}
          bgcolor={"rgb(28, 28, 29)"}
          borderRadius={4}
          width="100%"
          mt={"20px"}
        >
          {" "}
          <PlaceOrderForm />
        </Box>

        <Box
          display={"flex"}
          bgcolor={"rgb(28, 28, 29)"}
          borderRadius={4}
          width="100%"
          height="100%"
          mt={"20px"}
          style={{ padding: "10px" }}
        >
          <Box overflow={"scroll"} width="100%">
            <OrderBook />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MainPage;
