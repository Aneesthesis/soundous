import express from "express";
import data from "./data.js";
import { config } from "dotenv";
import mongoose from "mongoose";
import { seedRouter } from "./routes/seedRoutes.js";
import { productRouter } from "./routes/productRoutes.js";

config();

const app = express();

app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);

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
