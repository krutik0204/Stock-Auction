import { collection, getDocs } from "firebase/firestore";
import { query, where, onSnapshot } from "firebase/firestore";

import { db } from "../firebase";

async function getTradesData() {
  console.log("running trades fetch");
  const querySnapshot = await getDocs(collection(db, "tradeBook"));
  const trades = [];
  querySnapshot.forEach((doc) => {
    console.log(doc.data());
    trades.push(doc.data());
  });
  return trades;
}

async function getOrdersData() {
  const q = query(collection(db, "orderBook"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const orders = [];
      orders.push(doc.data());
    });
    // console.log("Current cities in CA: ", cities.join(", "));
  });
  //   console.log("running orders fetch");
  //   const querySnapshot = await getDocs(collection(db, "orderBook"));
  //   const orders = [];

  //   querySnapshot.forEach((doc) => {
  //     console.log(doc.data());
  //     const _price = doc.data()?.price ?? null;
  //     const _q = doc.data()?.quantity ?? 0;
  //     if (_price !== null) {
  //       orders.push({
  //         _price: {
  //           buy: _q,
  //         },
  //       });
  //     }
  //   });
  return [];
}

export { getTradesData, getOrdersData };
