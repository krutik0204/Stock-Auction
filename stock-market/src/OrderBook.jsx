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
import { getOrdersData, getTradesData } from "./features/trade";
import { Box } from "@mui/system";
import { collection, getDocs } from "firebase/firestore";
import { query, where, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export default function OrderBook() {
  const [orders, setOrders] = useState({});
  useEffect(() => {
    const q = query(collection(db, "orderBook"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const _orders = [];

      const _book = {};
      querySnapshot.forEach((doc) => {
        const _price = doc.data()?.price ?? null;
        const _q = doc.data()?.quantity ?? 0;
        const _t = doc.data()?.action;
        _orders.push(doc.data());
        console.log(_price, _q, _t, _book[_price]);
        if (_price !== null && _price !== undefined) {
          if (_book[_price] !== undefined) {
            if (_t === "B") _book[_price][0] += _q;
            if (_t === "S") _book[_price][1] += _q;
          } else {
            if (_t === "B") _book[_price] = [_q, 0];
            if (_t === "S") _book[_price] = [0, _q];
          }
        }
      });
      console.log(_book);
      setOrders(_book);

      // console.log("Current cities in CA: ", cities.join(", "));
    });
  }, []);

  return (
    // <Box w="100%" bgcolor={"red"} h="100%">
    <Table aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell style={{ fontWeight: "bold", color: "#45CE79" }}>
            Buy Volume
          </TableCell>
          <TableCell
            align="center"
            style={{ fontWeight: "bold", color: "#B0CE45" }}
          >
            Price $
          </TableCell>

          <TableCell
            align="right"
            style={{ fontWeight: "bold", color: "#DF3B22" }}
          >
            Sell Volume
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.keys(orders).map((row) => (
          <TableRow
            key={row}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell>{orders[row][0]}</TableCell>
            <TableCell align="center">{row}</TableCell>

            <TableCell align="right">{orders[row][1]}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    // </Box>
  );
}
