var admin = require("firebase-admin");
var serviceAccount = require("./service_key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const express = require("express");
const app = express();
const Cors = require("cors");
const userRoute = require("./user.route");
const stockRoute = require("./stock.route");
const PORT = process.env.PORT || 8000;

app.use(
  Cors({
    origin: "*",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/user/", userRoute);
app.use("/stock/", stockRoute);

// const {
//   setUser,
//   addNewOrder,
//   checkMarketOrderalidity,
//   exchangeFiats,
// } = require("./database_service");

// // setUser({ name: "Adam", stocks: "50", fiat: "1000" });
// // setUser({ name: "Bob", stocks: "10", fiat: "5000" });
// // setUser({ name: "Carl", stocks: "0", fiat: "7000" });

// const sampleOrderLimitSell = {
//   userId: "zU7Vgyqcjb42oB7GtLLH",
//   action: "S",
//   type: "L",
//   quantity: 25,
//   price: 1,
// };

// const sampleOrder = {
//   userId: "U22nGDByXJOz5g67is03",
//   action: "B",
//   type: "L",
//   quantity: 10,
//   price: 1.5,
// };

// // addNewOrderInOrderBook(sampleOrder);
// // addNewOrderInOrderBook(sampleOrderLimitSell);

// // checkMarketOrderalidity(sampleOrder);

// exchangeFiats(sampleOrderLimitSell, sampleOrder);
app.listen(PORT, () => {
  console.log("listening on port 8000");
});
