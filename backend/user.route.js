const { setUser, getUserById, getAllUsers } = require("./database_service");

const router = require("express").Router();

router.post("/create", async (req, res) => {
  console.log("getting here");

  //TODO: we can check if body is valid;
  try {
    res.json(
      setUser({
        name: "name",
        stocks: 0,
        fiat: 0,
      })
    );
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
    });
  }
});

router.post("/update", async (req, res) => {
  const user = req.body;
  console.log("update", req.body);
  if (user.id === null) {
    res.json({
      status: "error",
      reason: "no id",
    });
    return;
  }
  //TODO: we can check if body is valid
  try {
    res.json(setUser(user, user.id));
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

/// Get all
router.get("/", async (req, res) => {
  try {
    const users = await getAllUsers();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Users not found" });
    }
    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});
module.exports = router;
