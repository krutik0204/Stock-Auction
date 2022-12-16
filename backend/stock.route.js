const { setUser, addNewOrder, getOrderBook } = require("./database_service");

const router = require("express").Router();

router.post("/createOrder", async (req, res) => {
  const order = req.body;
  //TODO: we can check if body is valid;
  try {
    res.json(addNewOrder(order));
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
    });
  }
});

router.get("/orderBook", async (req, res) => {
  try {
    const book = await getOrderBook();

    if (book === null) {
      return res.status(404).json({ message: "book error" });
    }
    res.status(200).json(book);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

// router.post("/update", async (req, res) => {
//   const order = req.body;
//   if (order.id === null) {
//     res.json({
//       status: "error",
//       reason: "no id",
//     });
//     return;
//   }
//   //TODO: we can check if body is valid
//   try {
//     res.json(setUser(order, order.id));
//   } catch (error) {
//     console.log(error);
//     res.json({
//       status: "error",
//     });
//   }
// });

module.exports = router;
