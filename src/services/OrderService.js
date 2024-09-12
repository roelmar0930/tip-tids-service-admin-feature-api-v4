const Order = require("../models/Order");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

class OrderService {
  async getAllOrders() {
    const orders = await Order.find();
    return orders;
  }

  async addOrder(orderBody) {
    const order = await Order.create(orderBody);
    return order;
  }

  async updateOrderById(orderId, orderBody) {
    const order = await Order.findOneAndUpdate(
      { orderId: orderId },
      orderBody,
      { new: true, useFindAndModify: false }
    );
    return order;
  }

  async updateOrder(orderId, orderData) {
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { $set: orderData },
      { new: true }
    );
    return updatedOrder;
  }
}

module.exports = new OrderService();
