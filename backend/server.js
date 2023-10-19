import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import { seedRouter } from "./routes/seedRoutes.js";
import { productRouter } from "./routes/productRoutes.js";
import { userRouter } from "./routes/userRoutes.js";
import { orderRouter } from "./routes/orderRoutes.js";
import { adminRouter } from "./routes/adminRoutes.js";
import cors from "cors";

config();

const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:3000", // Allow requests from this origin
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     preflightContinue: false,
//     optionsSuccessStatus: 204,
//   })
// );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/admin", adminRouter);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

app.get(`/api/keys/paypal`, (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});
// Catch-all route for unknown queries
app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
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
