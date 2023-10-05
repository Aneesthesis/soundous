import { isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dbenvvfuy",
  api_key: "877411815619814",
  api_secret: process.env.CLOUDINARY_SECRET,
});

import express from "express";
import { Order } from "../models/orderModel.js";
import { User } from "../models/userModel.js";
import { Product } from "../models/productModel.js";

export const adminRouter = express.Router();

adminRouter.get("/cloudinary-sign", (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
    },

    process.env.CLOUDINARY_SECRET
  );

  res.statusCode = 200;
  res.json({ signature, timestamp });
});

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

    try {
      const orders = await Order.find({}).populate("user", "name");
      res.send(orders);
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

adminRouter.get(
  "/users",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
      return res
        .status(401)
        .send({ message: "Sign in as an Admin to continue" });
    }

    try {
      const users = await User.find({});
      res.send(users);
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
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
      const order = await Order.findById(req.params.orderid);
      if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        if (order.paymentMethod === "Cash on Delivery") {
          order.isPaid = true;
          order.paidAt = Date.now();
        }

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

adminRouter.get(
  "/products",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
      return res
        .status(401)
        .send({ message: "Sign in as an Admin to continue" });
    }

    try {
      const products = await Product.find({});
      res.send(products);
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  })
);
// GET a product by ID
adminRouter.get(
  "/products/:productId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
      return res
        .status(401)
        .send({ message: "Sign in as an Admin to continue" });
    }

    try {
      const product = await Product.findById(req.params["productId"]);
      if (!product) {
        return res.status(404).send({ message: "Product not found" });
      }
      res.send(product);
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

// Update a product by ID
adminRouter.put(
  "/products/:productId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
      return res
        .status(401)
        .send({ message: "Sign in as an Admin to continue" });
    }

    try {
      const product = await Product.findById(req.params["productId"]);
      console.log(product);
      if (!product) {
        return res.status(404).send({ message: "Product not found" });
      }

      // Update product fields based on request data
      product.name = req.body.name;
      product.slug = req.body.slug;
      product.price = req.body.price;
      product.category = req.body.category;
      console.log(product);
      product.image = req.body.image;
      console.log(product);
      product.brand = req.body.brand;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      console.log(product);

      // Save the updated product
      await product.save();
      console.log(product);
      res.send({ message: "Product updated!" });
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

adminRouter.post(
  `/products`,
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
      return res
        .status(401)
        .send({ message: "Sign in as an Admin to continue" });
    }

    const newProduct = new Product({
      name: "new-product",
      slug: "new-slug-" + Math.random(),
      image: "/images/sample.jpg",
      price: 999,
      category: "Default",
      brand: "Sample",
      countInStock: 100,
      description: "This a sample description",
      rating: 0,
      numReviews: 0,
    });
    const product = await newProduct.save();
    res.send({ message: "Product created successfully", product });
  })
);

// Update a product by ID
adminRouter.put(
  "/users/:userId/toggle-admin",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
      return res
        .status(401)
        .send({ message: "Sign in as an Admin to continue" });
    }

    try {
      const user = await User.findById(req.params["userId"]);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // Update user fields based on request data
      user.isAdmin = !user.isAdmin;

      // Save
      await user.save();

      res.send({ user, message: "User updated!" });
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

// delete user by ID
adminRouter.delete(
  "/users/:userId/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
      return res
        .status(401)
        .send({ message: "Sign in as an Admin to continue" });
    }

    try {
      const user = await User.findByIdAndDelete(req.params["userId"]);

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      res.send({ user, message: "User Deleted!" });
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

// delete product by ID
adminRouter.delete(
  `/products/:productId`,
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
      return res
        .status(401)
        .send({ message: "Sign in as an Admin to continue" });
    }

    try {
      console.log(req.params["productId"]);
      const product = await Product.findByIdAndDelete(req.params["productId"]);

      if (!product) {
        return res.status(404).send({ message: "Product not found" });
      }

      res.send(product);
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  })
);
