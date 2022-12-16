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
import { getTradesData } from "./features/trade";
import { Box } from "@mui/system";
import { collection, getDocs, orderBy } from "firebase/firestore";
import { query, where, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
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
import { Divider, Typography } from "@mui/material";

function createData(name, calories, protein) {
  return { name, calories, protein };
}

export default function TradeTable() {
  const [trades, setTrades] = useState([]);
  const [data, setData] = useState([]);
  const [_width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const q = query(collection(db, "tradeBook"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const _t = [];
      const _d = [];

      querySnapshot.forEach((doc) => {
        _t.push(doc.data());
        _d.push({
          price: doc.data().price,
          time: new Date(doc.data().createdAt.seconds * 1000).toISOString(),
        });
      });

      setTrades(_t);
      console.log(_d);
      setData(_d);

      // console.log("Current cities in CA: ", cities.join(", "));
    });
  }, []);
  //   useEffect(() => {
  //     getTradesData().then((res) => {
  //       setTrades(res);
  //       //   _appuser.push
  //     });
  //   }, []);

  return (
    <>
      <Box
        display={"flex"}
        flexDirection="column"
        bgcolor={"rgb(28, 28, 29)"}
        borderRadius={4}
        width="100%"
        paddingLeft={{ xs: "9px", md: "25px", lg: "50px" }}
        paddingRight={{ xs: "9px", md: "25px", lg: "50px" }}
        paddingTop={{ xs: "4px", md: "9px", lg: "20px" }}
        paddingBottom={{ xs: "4px", md: "9px", lg: "20px" }}
      >
        <h2 style={{ paddingLeft: "10px" }}>
          {" "}
          Current Market Price - ${trades[trades.length - 1].price}{" "}
        </h2>
        <Divider />
        <AreaChart
          width={800}
          height={350}
          data={data}
          margin={{ top: 30, right: 0, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" color="white" style={{ color: "white" }} />
          <YAxis />

          <Area
            type="monotone"
            dataKey="price"
            stroke="#ffffff"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </Box>
      <Box
        display={"flex"}
        bgcolor={"rgb(28, 28, 29)"}
        borderRadius={4}
        width="100%"
        height={"100%"}
        mt={"20px"}
        style={{
          paddingLeft: "30px",
          paddingTop: "20px",
          paddingRight: "30px",
          paddingbottom: "20px",
        }}
      >
        <Box overflow={"scroll"} width="100%">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bold" }}>Volume</TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  From
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  To
                </TableCell>
                <TableCell align="right" style={{ fontWeight: "bold" }}>
                  Amount&nbsp;($)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trades.map((row, i) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell align="center">{row.from.name}</TableCell>
                  <TableCell align="center">{row.to.name}</TableCell>
                  <TableCell align="right">{row.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </>
  );
}
