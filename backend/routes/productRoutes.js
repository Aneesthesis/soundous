import express from "express";
import { Product } from "../models/productModel.js";
import expressAsyncHandler from "express-async-handler";

export const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

productRouter.get(
  "/categories",
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct("category");
    res.send(categories);
  })
);

productRouter.get("/:slug", async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) {
    res.status(400).send({ message: "Product Not Found" });
  } else res.send(product);
  next();
});

productRouter.get("/x/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(400).send({ message: "Product Not Found" });
  }
  res.send(product);
});
