import React, { useEffect, useReducer, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getError } from "../utils/getError";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { LoadingBox } from "../components/UI/LoadingBox";
import { MessageBox } from "../components/UI/MessageBox";
import Product from "../components/Product";
import CustomDropdown from "../components/UI/CustomDropdown";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQ":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const prices = [
  { name: "$1 to $100", value: "1-100" },
  { name: "$101 to $300", value: "101-300" },
  { name: "$301 to $1000", value: "301-1000" },
  { name: "$1001 to $5000", value: "1001-5000" },
];

export const ratings = [
  { name: "4 stars & above", rating: 4 },
  { name: "3 stars & above", rating: 3 },
  { name: "2 stars & above", rating: 2 },
  { name: "1 star & above", rating: 1 },
];

export const SearchPage = () => {
  const navigate = useNavigate();
  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);
  const category = searchParams.get("category") || "all";
  const brand = searchParams.get("brand") || "all";
  const query = searchParams.get("query") || "all";
  const price = searchParams.get("price") || "all";
  const rating = searchParams.get("rating") || "all";
  const order = searchParams.get("order") || "newest";
  const page = searchParams.get("page") || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, { loading: true, error: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/search?page=${page}&query=${query}&category=${category}&brand=${brand}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchData();
  }, [category, brand, error, order, page, query, rating, price]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (error) {
        toast.error(getError(error));
      }
    };
    fetchCategories();
  }, []);

  const [brands, setBrands] = useState([]);
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data } = await axios.get(`/api/products/brands`);
        setBrands(data);
      } catch (error) {
        toast.error(getError(error));
      }
    };
    fetchBrands();
  }, []);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterBrand = filter.brand || brand;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `/search?category=${filterCategory}&brand=${filterBrand}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };

  return (
    <div className="z-50 mx-auto px-4 py-8">
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-xl font-semibold mb-4">Category</h3>
            <CustomDropdown
              options={[
                { name: "Any", value: "all" },
                ...categories.map((c) => ({ name: c, value: c })),
              ]}
              value={category}
              onChange={(e) =>
                navigate(getFilterUrl({ category: e.target.value }))
              }
            />
          </div>
          <div className="bg-white p-4 mt-4 rounded shadow-md">
            <h3 className="text-xl font-semibold mb-4">Brand</h3>
            <CustomDropdown
              options={[
                { name: "Any", value: "all" },
                ...brands.map((b) => ({ name: b, value: b })),
              ]}
              value={brand}
              onChange={(e) =>
                navigate(getFilterUrl({ brand: e.target.value }))
              }
            />
          </div>
          <div className="bg-white p-4 mt-4 rounded shadow-md">
            <h3 className="text-xl font-semibold mb-4">Price</h3>
            <CustomDropdown
              options={[{ name: "Any", value: "all" }, ...prices]}
              value={price}
              onChange={(e) =>
                navigate(getFilterUrl({ price: e.target.value }))
              }
            />
          </div>
          <div className="bg-white p-4 mt-4 rounded shadow-md">
            <h3 className="text-xl font-semibold mb-4">Avg. Customer Review</h3>
            <CustomDropdown
              options={[{ name: "Any", value: "all" }, ...ratings]}
              value={rating}
              onChange={(e) =>
                navigate(getFilterUrl({ rating: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <section className="flex justify-between mb-4">
            <div>
              <p className="text-lg font-semibold">
                {countProducts === 0 ? "No" : countProducts} Results
                {query !== "all" && `: ${query}`}
                {category !== "all" && `: ${category}`}
                {price !== "all" && `: Price ${price}`}
              </p>
            </div>
            {(query !== "all" || rating !== "all" || price !== "all") && (
              <button
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={() => navigate("/search")}
              >
                <i className="fas fa-times-circle"></i>
              </button>
            )}
          </section>
          <section className="mb-4">
            <label className="font-semibold">Sort by</label>
            <select
              className="ml-2 border rounded px-2 py-1"
              value={order}
              onChange={(e) =>
                navigate(getFilterUrl({ order: e.target.value }))
              }
            >
              <option value="newest">Newest Arrivals</option>
              <option value="lowest">Price: Low to High</option>
              <option value="highest">Price: High to Low</option>
              <option value="toprated">Avg. Customer Reviews</option>
            </select>
          </section>
          <section className="mb-4">
            {loading ? (
              <LoadingBox />
            ) : error ? (
              <MessageBox>{error}</MessageBox>
            ) : products.length === 0 ? (
              <MessageBox>No Product Found</MessageBox>
            ) : (
              <Product products={products} />
            )}
          </section>
          <div className="flex justify-center">
            {[...Array(pages).keys()].map((x) => (
              <Link
                key={x + 1}
                className={`mx-2 px-2 py-1 rounded ${
                  x + 1 === +page
                    ? "bg-amber-500 text-white"
                    : "bg-white border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white"
                }`}
                to={getFilterUrl({ page: x + 1 })}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SearchPage;
