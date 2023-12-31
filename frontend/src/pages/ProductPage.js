import axios from "axios";
import React, { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import { ProductDetails } from "../components/ProductDetail";
import { Helmet } from "react-helmet-async";
import { getError } from "../utils/getError";
import { LoadingBox } from "../components/UI/LoadingBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, product: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function ProductPage() {
  const params = useParams();
  const { slug } = params;
  const [{ loading, product, error }, dispatch] = useReducer(reducer, {
    loading: true,
    product: [],
    error: "",
  });
  //const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const response = await axios.get(
          `https://soundous-api.onrender.com/api/products/${slug}`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: response.data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchData();
  }, [slug]);

  return (
    <div>
      <Helmet>
        <title>Soundous</title>
      </Helmet>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <ProductDetails product={product} />
      )}
    </div>
  );
}
