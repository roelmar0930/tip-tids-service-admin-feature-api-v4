const Order = require("../models/Order");
const OrderService = require("../services/OrderService");

const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const addOrder = async (req, res) => {
  try {
    const order = await OrderService.addOrder(req.body);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

const updateOrderById = async (req, res) => {
  try {
    console.log(req.params.orderId);
    const order = await OrderService.updateOrderById(
      req.params.orderId,
      req.body
    );
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const orderData = req.body;
    const updatedOrder = await OrderService.updateOrder(orderId, orderData);
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order" });
  }
};

module.exports = { getAllOrders, addOrder, updateOrderById, updateOrder };
