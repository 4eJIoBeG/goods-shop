const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/", orderController.createOrder);
router.get("/orders", orderController.getAllOrderDetails);
router.get("/:id", orderController.getOrderDetails);

module.exports = router;
