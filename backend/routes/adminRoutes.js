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
      res.status(401).send({ message: "Signin as an Admin to continue" });
    }
    const ordersCount = await Order.countDocuments();
    const productsCount = await Product.countDocuments();
    const usersCount = await User.countDocuments();

    const totalSalesGroup = await Order.aggregate([
      {
        $group: { _id: null, sales: { $sum: "$finalAmount" } },
      },
    ]);

    console.log(totalSalesGroup);
    const totalSales =
      totalSalesGroup.length > 0 ? totalSalesGroup[0].sales : 0;

    res.send({ ordersCount, productsCount, usersCount, totalSales });
  })
);
