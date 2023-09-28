import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { toast } from "react-toastify";
import { getError } from "../../utils/getError";
import { LoadingBox } from "../../components/UI/LoadingBox";
import { MessageBox } from "../../components/UI/MessageBox";
import { Link } from "react-router-dom";
import { Store } from "../../Store";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQ":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, products: action.payload, error: "" };
    case "FETCH_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function AdminProducts() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    products: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQ" });
        const { data } = await axios.get(`/api/admin/products`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchData();
  }, []);
  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox>{error.message}</MessageBox>
  ) : (
    products && (
      <div className="dashboard flex">
        <section className="left w-1/4 p-4">
          <div className="menu-card bg-white rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4">Dashboard Menu</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/admin/orders"
                  className="text-blue-500 hover:underline"
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/products"
                  className="text-blue-500 hover:underline"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/users"
                  className="text-blue-500 hover:underline"
                >
                  Users
                </Link>
              </li>
            </ul>
          </div>
        </section>
        <section className="overflow-x-auto w-3/4 p-4">
          <h1 className="mb-4 text-xl">Admin Products</h1>
          {loading ? (
            <div>loading products...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left"> ID</th>
                    <th className="px-5 text-left"> NAME</th>
                    <th className="px-5 text-left"> PRICE</th>
                    <th className="px-5 text-left"> CATEGORY</th>
                    <th className="px-5 text-left"> COUNT</th>
                    <th className="px-5 text-left"> RATING</th>
                    <th className="px-5 text-left"> ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b">
                      <td className="p-5">{product._id}</td>
                      <td className="p-5">{product.name}</td>
                      <td className="p-5">{product.price}</td>
                      <td className="p-5">{product.category}</td>
                      <td className="p-5">{product.countInStock}</td>
                      <td className="p-5">{product.rating}</td>
                      <Link
                        className="text-blue-500 underline"
                        to={`/admin/products/${product._id}`}
                      >
                        Edit
                      </Link>
                      &nbsp;
                      <button>Delete</button>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    )
  );
}

export default AdminProducts;
