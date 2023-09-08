import express from "express";
import { Product } from "../models/productModel.js";

export const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

productRouter.get("/:slug", async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) {
    res.status(400).send({ message: "Product Not Found" });
  }
  res.send(product);
  next();
});

productRouter.get("/x/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(400).send({ message: "Product Not Found" });
  }
  res.send(product);
});
