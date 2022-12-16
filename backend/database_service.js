const { getFirestore, Query, FieldValue } = require("firebase-admin/firestore");

const db = getFirestore();

async function setUser(user, id = null) {
  const collectionRef = db.collection("users");
  const docRef = id ? collectionRef.doc(id) : collectionRef.doc();
  await docRef.set({ ...user, id: docRef.id });
  return { status: "success" };
}

async function getUserById(id) {
  const collectionRef = db.collection("users");
  return (await collectionRef.doc(id).get()).data();
}

async function getAllUsers() {
  const snapshot = await db.collection("users").get();

  const users = [];
  snapshot.forEach((doc) => {
    const _data = doc.data();
    users.push(_data);
  });
  return users;
}

/*
order = {
    userId: <name>,
    action: "B", "S",
    type: "M", "L"
    quantity: 100,
    price: 12398.38, // if M it will be null
    id: _id
}
*/
async function addNewOrder(order, id = null) {
  const collectionRef = db.collection("orderBook");
  const docRef = id ? collectionRef.doc(id) : collectionRef.doc();
  await docRef.set({
    ...order,
    id: docRef.id,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  // can any new transactions exceute
  canTranscationBeExecuted(order, docRef.id);
}

async function canTranscationBeExecuted(order, orderId) {
  const ordertype = order.type;
  if (ordertype == "M") {
    await checkMarketOrderalidity(order, orderId);
  } else {
    await checkLimitOrderValidity(order, orderId);
  }
}

/*
Since this is a merket order, the marketOrder will not have price.
And he will accept the first lowest price sellers bid, until is quantity is satisfied, 

// TODO:
and if we dont have enough sellers for the quantity then what should we do???

*/
async function checkMarketOrderalidity(marketOrder, morderId) {
  const action = marketOrder.action;
  if (action == "B") {
    var quantityToBuy = marketOrder.quantity;
    const snapshot = await db
      .collection("orderBook")
      .orderBy("createdAt", "asc")
      .get();

    const sellOrder = [];
    snapshot.forEach((doc) => {
      const _data = doc.data();
      if (_data?.action == "S" && _data?.quantity > 0 && _data?.price !== null)
        sellOrder.push(_data);
    });

    sellOrder.sort((a, b) => {
      if (a.price < b.price) return -1;
      if (a.price == b.price) {
        if (a.createdAt.toMillis() < b.createdAt.toMillis()) return -1;
        else return 0;
      }
      if (a.price < b.price) return 1;
    });

    var index = 0;

    while (quantityToBuy > 0) {
      await exchangeFiats(
        sellOrder[index].userId,
        marketOrder.userId,
        Math.min(sellOrder[index].quantity, quantityToBuy),
        sellOrder[index].price,
        sellOrder[index].id,
        morderId
      );
      quantityToBuy -= Math.min(sellOrder[index].quantity, quantityToBuy);
      index++;
    }
  } else {
    var quantityToBuy = marketOrder.quantity;
    const snapshot = await db
      .collection("orderBook")
      .orderBy("createdAt", "asc")
      .get();

    const buyOrders = [];
    snapshot.forEach((doc) => {
      const _data = doc.data();
      if (_data?.action == "B" && _data?.quantity > 0 && _data?.price !== null)
        buyOrders.push(_data);
    });

    buyOrders.sort((a, b) => {
      if (a.price < b.price) return 1;
      if (a.price == b.price) {
        if (a.createdAt.toMillis() < b.createdAt.toMillis()) return -1;
        else return 0;
      }
      if (a.price < b.price) return -1;
    });

    var index = 0;

    while (quantityToBuy > 0) {
      await exchangeFiats(
        marketOrder.userId,
        buyOrders[index].userId,
        Math.min(buyOrders[index].quantity, quantityToBuy),
        buyOrders[index].price,
        morderId,
        buyOrders[index].id
      );
      quantityToBuy -= Math.min(buyOrders[index].quantity, quantityToBuy);
      index++;
    }
  }
}

async function checkLimitOrderValidity(limitOrder, lorderId) {
  const action = limitOrder.action;
  const _price = limitOrder.price;
  if (action == "B") {
    var quantityToBuy = limitOrder.quantity;
    const snapshot = await db
      .collection("orderBook")
      .orderBy("createdAt", "asc")
      .get();

    const sellOrder = [];
    snapshot.forEach((doc) => {
      const _data = doc.data();
      if (_data?.action == "S" && _data?.quantity > 0) sellOrder.push(_data);
    });

    // sellOrder.sort((a, b) => {
    //   if (a.price < b.price) return -1;
    //   if (a.price == b.price) {
    //     if (a.createdAt.toMillis() < b.createdAt.toMillis()) return -1;
    //     else return 0;
    //   }
    //   if (a.price < b.price) return 1;
    // });

    sellOrder.forEach(async (or) => {
      if (or.price === _price && quantityToBuy > 0) {
        await exchangeFiats(
          or.userId,
          limitOrder.userId,
          Math.min(or.quantity, quantityToBuy),
          _price,
          or.id,
          lorderId
        );
        quantityToBuy -= Math.min(or.quantity, quantityToBuy);
      }
    });
  } else {
    var quantityToBuy = limitOrder.quantity;
    const snapshot = await db
      .collection("orderBook")
      .orderBy("createdAt", "asc")
      .get();

    const buyOrders = [];
    snapshot.forEach((doc) => {
      const _data = doc.data();
      if (_data?.action == "B" && _data?.quantity > 0) buyOrders.push(_data);
    });

    buyOrders.forEach(async (or) => {
      if (or.price === _price && quantityToBuy > 0) {
        await exchangeFiats(
          limitOrder.userId,
          or.userId,
          Math.min(or.quantity, quantityToBuy),
          _price,
          lorderId,
          or.id
        );
        quantityToBuy -= Math.min(or.quantity, quantityToBuy);
      }
    });
  }
}

async function exchangeFiats(
  sellerId,
  buyerId,
  quantity,
  price,
  sellerOrderId,
  buyerOrderId
) {
  if (price === null || price === undefined) {
    return;
  }
  // so buyer will buy stocks from seller
  // fiat -> from buyer to seller
  // stocks -> from seller to buyer
  // order book -> decrease sell quantity for the price
  //TODO transaction book ->

  // GET USERS
  const collectionRef = db.collection("users");
  const seller = (await collectionRef.doc(sellerId).get()).data();
  const buyer = (await collectionRef.doc(buyerId).get()).data();

  console.log(seller, buyer);

  const _q = quantity;

  seller.fiat += _q * price;
  seller.stocks -= _q;

  buyer.fiat -= _q * price;
  buyer.stocks += _q;

  console.log(seller, buyer);

  // this means the sell order is completed it can be deleted from order book
  //TODO: this should be added transcation history

  await db
    .collection("orderBook")
    .doc(sellerOrderId)
    .update({
      quantity: FieldValue.increment(-_q),
    });
  await db
    .collection("orderBook")
    .doc(buyerOrderId)
    .update({
      quantity: FieldValue.increment(-_q),
    });

  await createTradeRow(_q, seller, buyer, price);

  await setUser(seller, sellerId);
  await setUser(buyer, buyerId);
}

async function createTradeRow(quantity, from, to, price) {
  const collectionRef = db.collection("tradeBook");
  const docRef = collectionRef.doc();
  await docRef.set({
    quantity,
    from,
    to,
    price,
    id: docRef.id,
    createdAt: FieldValue.serverTimestamp(),
  });
  return { status: "success" };
}

async function getOrderBook() {
  const snapshot = await db
    .collection("orderBook")
    .orderBy("createdAt", "asc")
    .get();

  const book = [];
  snapshot.forEach((doc) => {
    const _data = doc.data();
    if (_data?.quantity !== null && _data.quantity > 0) book.push(_data);
  });
  return book;
}

module.exports = {
  setUser,
  addNewOrder,
  canTranscationBeExecuted,
  checkMarketOrderalidity,
  exchangeFiats,
  getUserById,
  getAllUsers,
  getOrderBook,
};
