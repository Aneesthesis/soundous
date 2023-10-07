import express, { query } from "express";
import { Product } from "../models/productModel.js";
import expressAsyncHandler from "express-async-handler";

export const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

productRouter.get(
  "/search",
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const PAGE_SIZE = 3;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || "";
    const brand = query.brand || "";
    const price = query.price || "";
    const rating = query.rating || "";
    const order = query.order || "";
    const searchQuery = query.query || "";
    const skipCount = pageSize * (page - 1);

    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            name: {
              $regex: searchQuery,
              $options: "i",
            },
          }
        : {};

    const categoryFilter = category && category !== "all" ? { category } : {};

    const brandFilter = brand && brand !== "all" ? { brand } : {};

    const ratingFilter =
      rating && rating !== "all"
        ? {
            rating: {
              $gte: +rating,
            },
          }
        : {};

    const priceFilter =
      price && price !== "all"
        ? { price: { $gte: +price.split("-")[0], $lte: +price.split("-")[1] } }
        : {};

    const sortOrder =
      order === "featured"
        ? { featured: -1 }
        : order === "lowest"
        ? { price: 1 }
        : order === "highest"
        ? { price: -1 }
        : order === "toprated"
        ? { rating: -1 }
        : order === "newest"
        ? { createdAt: -1, _id: -1 } // Sort by createdAt and then by _id
        : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...brandFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(skipCount)
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...brandFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.get(
  "/categories",
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct("category");
    res.send(categories);
  })
);

productRouter.get(
  "/brands",
  expressAsyncHandler(async (req, res) => {
    const brands = await Product.find().distinct("brand");
    res.send(brands);
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
