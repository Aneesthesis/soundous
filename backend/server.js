import express from "express";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import mongoose from "mongoose";
import { productRouter } from "./routes/productRoutes.js";
import { userRouter } from "./routes/userRoutes.js";
import { orderRouter } from "./routes/orderRoutes.js";
import { adminRouter } from "./routes/adminRoutes.js";
import cors from "cors";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(
  cors({
    origin: "*", // Allow requests from this origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (e.g., your built React app)
app.use(express.static(path.join(__dirname, "build")));

// Define a catch-all route
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

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
