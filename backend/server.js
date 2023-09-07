import express from "express";
import data from "./data.js";
import { config } from "dotenv";
import mongoose from "mongoose";

config();

const app = express();

app.get("/api/products", (req, res) => {
  res.send(data.products);
});

app.get("/api/products/:slug", (req, res, next) => {
  const product = data.products.find((prod) => prod.slug === req.params.slug);
  if (!product) {
    res.status(400).send({ message: "Product Not Found" });
  }
  res.send(product);
  next();
});

app.get("/api/products/x/:id", (req, res) => {
  console.log("slug");
  const product = data.products.find((prod) => prod._id === req.params.id);
  if (!product) {
    res.status(400).send({ message: "Product Not Found" });
  }
  res.send(product);
});

mongoose
  .connect(process.env.CONNECTION_URI, { dbName: "soundous" })
  .then(() => {
    console.log("MONGO JUMBO");
  })
  .catch((err) => console.log(err.message));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`serving at http://127.0.0.1:${port}`);
});
