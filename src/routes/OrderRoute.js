const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");

router.get("/getAllOrders", orderController.getAllOrders);

router.post("/addOrder", orderController.addOrder);

router.put("/updateOrderById/:orderId", orderController.updateOrderById);

router.patch("/updateOrder/:id", orderController.updateOrder);

module.exports = router;
