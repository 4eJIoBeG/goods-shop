const express = require("express");
const router = express.Router();
const userRouter = require("./userRouter");
const itemRouter = require("./itemRouter");
const categoryRouter = require("./categoryRouter");

router.use("/user", userRouter);
router.use("/item", itemRouter);
router.use("/category", categoryRouter);

module.exports = router;
