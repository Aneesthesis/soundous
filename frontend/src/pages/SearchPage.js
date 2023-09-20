// import axios from "axios";
// import { useEffect, useReducer, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { getError } from "../utils/getError";
// import { toast } from "react-toastify";
// import { Helmet } from "react-helmet-async";
// import { Rating } from "../components/Rating";
// import { LoadingBox } from "../components/UI/LoadingBox";
// import { MessageBox } from "../components/UI/MessageBox";
// import Product from "../components/Product";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "FETCH_REQ":
//       return { ...state, loading: true };
//     case "FETCH_SUCCESS":
//       return {
//         ...state,
//         products: action.payload.products,
//         page: action.payload.page,
//         pages: action.payload.pages,
//         countProducts: action.payload.countProducts,
//         loading: false,
//       };
//     case "FETCH_FAIL":
//       return { ...state, loading: false, error: action.payload };

//     default:
//       return state;
//   }
// };

// export const prices = [
//   { name: `$1 to $50`, value: `1-50` },
//   { name: `$51 to $200`, value: `51-200` },
//   { name: `$201 to $1000`, value: `1-50` },
// ];

// export const ratings = [
//   { name: `4stars & above`, rating: 4 },
//   { name: `3stars & above`, rating: 3 },
//   { name: `2stars & above`, rating: 2 },
//   { name: `1stars & above`, rating: 1 },
// ];

// export const SearchPage = () => {
//   const navigate = useNavigate();
//   const { search } = useLocation();

//   const searchParams = new URLSearchParams(search);
//   const category = searchParams.get("category") || "all";
//   const query = searchParams.get("query") || "all";
//   const price = searchParams.get("price") || "all";
//   const rating = searchParams.get("rating") || "all";
//   const order = searchParams.get("order") || "newest";
//   const page = searchParams.get("page") || 1;

//   const [{ loading, error, products, pages, countProducts }, dispatch] =
//     useReducer(reducer, { loading: true, error: "" });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data } = await axios.get(
//           `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
//         );
//         dispatch({ type: "FETCH_SUCCESS", payload: data });
//       } catch (error) {
//         dispatch({ type: "FETCH_FAIL", payload: getError(error) });
//       }
//     };
//     fetchData();
//   }, [category, error, order, page, query, rating]);

//   const [categories, setCategories] = useState([]);
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const { data } = await axios.get(`/api/products/categories`);
//         setCategories(data);
//       } catch (error) {
//         toast.error(getError(error));
//       }
//     };
//     fetchCategories();
//   }, [dispatch]);

//   const getFilterUrl = (filter) => {
//     const filterPage = filter.page || page;
//     const filterCategory = filter.category || category;
//     const filterQuery = filter.query || query;
//     const filterRating = filter.rating || rating;
//     const filterPrice = filter.price || price;
//     const sortOrder = filter.order || order;
//     return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&orders=${filterRating}&order=${sortOrder}&page=${filterPage}`;
//   };

//   return (
//     products && (
//       <div>
//         <Helmet>
//           <title>Search Products</title>
//         </Helmet>
//         <section className="filters">
//           <div>
//             <h3>Category</h3>
//             <ul>
//               <li>
//                 <Link to={getFilterUrl({ category: "all" })}>Any</Link>
//               </li>
//               {categories.map((c) => (
//                 <li key={c}>
//                   <Link to={getFilterUrl({ category: c })}>{c}</Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//           <div>
//             <h3>Price</h3>
//             <ul>
//               <li>
//                 <Link
//                   className={"all" === price ? "text-bold" : ""}
//                   to={getFilterUrl({ price: "all" })}
//                 >
//                   Any
//                 </Link>
//               </li>
//               {prices.map((p) => (
//                 <li key={p.value}>
//                   <Link
//                     to={getFilterUrl({ price: p.value })}
//                     className={p.value === price ? "text-bold" : ""}
//                   >
//                     {p.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div>
//             <h3>Avg. Customer Review</h3>
//             <ul>
//               {ratings.map((r) => (
//                 <li key={r.name}>
//                   <Link to={getFilterUrl({ rating: r.rating })}>{r.name}</Link>
//                   <Rating caption={" & up"} rating={r.rating}></Rating>
//                 </li>
//               ))}
//               <li>
//                 <Link to={getFilterUrl({ rating: "all" })}>
//                   <Rating caption={` & up`} rating={0}></Rating>
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </section>
//         <section className="results">
//           {loading ? (
//             <LoadingBox />
//           ) : error ? (
//             <MessageBox>{error}</MessageBox>
//           ) : (
//             <div className="justify-between mb-3">
//               <div>
//                 {countProducts === 0 ? "No" : countProducts} Results
//                 {query !== "all" && ":" + query}
//                 {category !== "all" && ":" + category}
//                 {price !== "all" && ": Price " + price}
//                 {query !== "all" || rating !== "all" || price !== "all" ? (
//                   <button onClick={() => navigate("/search")}>
//                     <i className="fas fa-times-circle"></i>
//                   </button>
//                 ) : null}
//               </div>
//             </div>
//           )}
//         </section>
//         <section className="sortBy">
//           Sort by{" "}
//           <select
//             value={order}
//             onChange={(e) => navigate(getFilterUrl({ order: e.target.value }))}
//           >
//             <option value="newest">Newest Arrivals</option>
//             <option value="lowest">Price: Low to High</option>
//             <option value="highest">Newest High to Low</option>
//             <option value="toprated">Avg. Customer Reviews</option>
//           </select>
//         </section>
//         <section className="products">
//           {products.length === 0 ? (
//             <MessageBox>No Product Found</MessageBox>
//           ) : (
//             <Product products={products} />
//           )}
//         </section>
//         <div>
//           {[...Array(pages).keys()].map((x) => (
//             <Link
//               key={x + 1}
//               className="mx-1"
//               to={getFilterUrl({ page: x + 1 })}
//             >
//               <button>{x + 1}</button>
//             </Link>
//           ))}
//         </div>
//       </div>
//     )
//   );
// };

import React, { useEffect, useReducer, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getError } from "../utils/getError";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { Rating } from "../components/Rating";
import { LoadingBox } from "../components/UI/LoadingBox";
import { MessageBox } from "../components/UI/MessageBox";
import Product from "../components/Product";

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
  { name: "$1 to $50", value: "1-50" },
  { name: "$51 to $200", value: "51-200" },
  { name: "$201 to $1000", value: "1-50" },
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
          `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchData();
  }, [category, error, order, page, query, rating, price]);

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

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };

  return (
    <div className="z-50 mx-auto px-4 py-8">
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-xl font-semibold mb-4">Category</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to={getFilterUrl({ category: "all" })}
                  className={`hover:underline ${
                    category === "all" ? "font-bold" : ""
                  }`}
                >
                  Any
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    to={getFilterUrl({ category: c })}
                    className={`hover:underline ${
                      c === category ? "font-bold" : ""
                    }`}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-4 mt-4 rounded shadow-md">
            <h3 className="text-xl font-semibold mb-4">Price</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to={getFilterUrl({ price: "all" })}
                  className={`hover:underline ${
                    price === "all" ? "font-bold" : ""
                  }`}
                >
                  Any
                </Link>
              </li>
              {prices.map((p) => (
                <li key={p.value}>
                  <Link
                    to={getFilterUrl({ price: p.value })}
                    className={`hover:underline ${
                      p.value === price ? "font-bold" : ""
                    }`}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-4 mt-4 rounded shadow-md">
            <h3 className="text-xl font-semibold mb-4">Avg. Customer Review</h3>
            <ul className="space-y-2">
              {ratings.map((r) => (
                <li key={r.name}>
                  <Link
                    to={getFilterUrl({ rating: r.rating })}
                    className={`hover:underline`}
                  >
                    {r.name}
                  </Link>
                  <Rating caption={" & up"} rating={r.rating}></Rating>
                </li>
              ))}
              <li>
                <Link
                  to={getFilterUrl({ rating: "all" })}
                  className={`hover:underline`}
                >
                  <Rating caption={` & up`} rating={0}></Rating>
                </Link>
              </li>
            </ul>
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
