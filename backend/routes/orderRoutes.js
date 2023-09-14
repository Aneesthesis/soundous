import { isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";

import express from "express";
import { Order } from "../models/orderModel.js";

export const orderRouter = express.Router();
orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxes: req.body.taxes,
      finalAmount: req.body.finalAmount,
      user: req.user._id,
      // isPaid: { type: Boolean, default: false },
      // paidAt: { type: Date },
      // isDelivered: { type: Boolean, default: false },
      // deliveredAt: { type: Date },
    });

    const order = await newOrder.save();
    res
      .status(201)
      .send({ message: "New Order Generated Successsfully", order });
  })
);

orderRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);
