const Order = require('../models/order.model.js');
const { errorHandler } = require('../helpers/error_handler.js');
const mongoose = require('mongoose');

const getAllOrders = async(req, res) => {
  try {
    const orders = await Order.find({});
    if (!orders) {
      return res.status(404).send({"message": "Order not found!"});
    }
    if(orders.length === 0){
      return res.status(200).send({"message": "Order is empty"});
    }

    res.json({ data: orders });
  } catch (error) {
    error(res, error)
  }
}

const getOrderById = async(req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({"message": "Incorrect ID!"})
    }

    const order = await Order.findOne({"_id": req.params.id});
    if (!order) {
      return res.status(404).send({"message": "There is no order with such ID!"});
    }

    res.json(order);
  } catch (error) {
    errorHandler(res, error);
  }
};

const addOrder = async(req, res) => {
  try {
    const {
      client_id,
      cinema_id,
      comment,
      price,
      film_time
    } = req.body
    if (!client_id || !cinema_id || !price || !film_time) {
      return res.status(400).send({"message": "You should enter all required data!"});
    }

    const newOrder = await Order({
      client_id,
      cinema_id,
      comment,
      price,
      film_time
    })

    await newOrder.save();
    return res.status(201).sand({"message": "Order succesfully added!"})
  } catch (error) {
    errorHandler(res, error);
  }
}

const updateOrderById = async(req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({"message": "Incorrect ID!"});
    }

    const {
      client_id,
      cinema_id,
      comment,
      price,
      film_time
    } = req.body

    const updateOrder = await Order.updateOne(
      {
        "_id": req.params.id
      },
      {
        $set:{
          client_id,
          cinema_id,
          comment,
          price,
          film_time
        }
      }
    )

    if (updateOrder.modifiedCount > 0){
      return res.status(400).send({"message": "Order data's successfully changed!"});
    } else if (updateOrder.matchedCount === 0){
      return res.status(404).send({"message": "There is no order with such ID!"});
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

const deleteOrderById = async(req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({"message": "Incorrect ID!"});
    }

    const deleteOrder = await Order.deleteOne({ "_id": req.params.id })

    if (deleteOrder.deletedCount > 0) {
      return res.status(400).send({"message": "Order data's successfully deleted!"});
    } else if (deleteOrder.deletedCount === 0) {
      return res.status(404).send({"message": "There is no order with such ID!"});
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

module.exports = {
  getAllOrders,
  getOrderById,
  addOrder,
  updateOrderById,
  deleteOrderById
}