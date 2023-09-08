import express from "express";
import { Product } from "../models/productModel.js";
import data from "../data.js";

export const seedRouter = express.Router();

seedRouter.get("/", async (req, res) => {
  try {
    await Product.deleteMany({});
    const createdProducts = await Product.insertMany(data.products);
    res.send({ createdProducts });
  } catch (error) {
    res.send({
      status: "fail",
      message: error.message,
    });
  }
});
