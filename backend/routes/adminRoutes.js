import { isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";

import express from "express";
import { Order } from "../models/orderModel.js";
import { User } from "../models/userModel.js";
import { Product } from "../models/productModel.js";

export const adminRouter = express.Router();

adminRouter.get(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
      return res
        .status(401)
        .send({ message: "Signin as an Admin to continue" });
    }
    const ordersCount = await Order.countDocuments();
    const productsCount = await Product.countDocuments();
    const usersCount = await User.countDocuments();

    const totalSalesGroup = await Order.aggregate([
      {
        $group: { _id: null, sales: { $sum: "$finalAmount" } },
      },
    ]);

    const monthlySalesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $exists: true, $type: "date" },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" },
          },
          totalMonthlySales: { $sum: "$finalAmount" },
        },
      },
    ]);

    console.log(monthlySalesData);

    const totalSales =
      totalSalesGroup.length > 0 ? totalSalesGroup[0].sales : 0;

    res.send({
      ordersCount,
      productsCount,
      usersCount,
      totalSales,
      monthlySalesData,
    });
  })
);

adminRouter.get(
  "/orders",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
      return res
        .status(401)
        .send({ message: "Sign in as an Admin to continue" });
    }

    if (req.method === "GET") {
      try {
        const orders = await Order.find({}).populate("user", "name");
        res.send(orders);
      } catch (error) {
        return res.status(500).send({ message: "Internal Server Error" });
      }
    } else {
      return res.status(400).send({ message: "Method not allowed" });
    }
  })
);

adminRouter.put(
  "/orders/:orderid/deliver",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
      return res
        .status(401)
        .send({ message: "Sign in as an Admin to continue" });
    }
    try {
      const order = await Order.findById(req.query.orderid);
      if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const deliveredOrder = await order.save();
        res.send({
          order: deliveredOrder,
          message: "Order Delivered Successfully",
        });
      } else {
        res.status(404).send({ message: "Error: Order not found in system" });
      }
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  })
);
