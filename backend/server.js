import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import { seedRouter } from "./routes/seedRoutes.js";
import { productRouter } from "./routes/productRoutes.js";
import { userRouter } from "./routes/userRoutes.js";
import { orderRouter } from "./routes/orderRoutes.js";
import { adminRouter } from "./routes/adminRoutes.js";

config();

const app = express();

app.use(
  cors({
    origin: ["http://soundous-api.vercel.app"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/admin", adminRouter);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

app.get(`/api/keys/paypal`, (req, res) => {
  res.send(
    "AR9-BbrlxDB9lTnyfUI2WgO4M63beOkhhWxIYiJ_lWPGrULg1d6AECNLQPkTzC34D32dahc04obE-873" ||
      "sb"
  );
});
// Catch-all route for unknown queries
app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

mongoose
  .connect(
    "mongodb+srv://crunchysambusa:AlrUNvu8j24PcAiX@cluster0.6l6nxek.mongodb.net/?retryWrites=true&w=majority",
    { dbName: "soundous" }
  )
  .then(() => {
    console.log("MONGO JUMBO");
  })
  .catch((err) => console.log(err.message));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`serving at http://127.0.0.1:${port}`);
});
