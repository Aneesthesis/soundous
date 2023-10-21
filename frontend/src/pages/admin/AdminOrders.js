import React, { useContext, useEffect, useReducer } from "react";
import { getError } from "../../utils/getError";
import axios from "axios";
import { Link } from "react-router-dom";
import { LoadingBox } from "../../components/UI/LoadingBox";
import { MessageBox } from "../../components/UI/MessageBox";
import { Store } from "../../Store";
import { Helmet } from "react-helmet-async";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQ":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function AdminOrderPage() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQ" });
        const { data } = await axios.get(
          `https://soundous-api.onrender.com/api/admin/orders`,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchData();
  }, []);

  console.log(orders);
  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox>{error.message}</MessageBox>
  ) : (
    orders && (
      <div className="dashboard flex">
        <Helmet>
          <title>Admin View Orders</title>
        </Helmet>
        <section className=" hidden md:block left w-1/4 p-4">
          <div className="menu-card bg-white rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4">Dashboard Menu</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/admin-orderlist"
                  className="text-blue-500 hover:underline"
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/admin-productlist"
                  className="text-blue-500 hover:underline"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/admin-userlist"
                  className="text-blue-500 hover:underline"
                >
                  Users
                </Link>
              </li>
            </ul>
          </div>
        </section>
        <section className="overflow-x-auto w-full md:w-3/4 p-4">
          <h1 className="mb-4 text-xl">Admin Orders</h1>
          {loading ? (
            <div>loading orders...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left"> ID</th>
                    <th className="px-5 text-left"> USER</th>
                    <th className="px-5 text-left"> DATE</th>
                    <th className="px-5 text-left"> TOTAL</th>
                    <th className="px-5 text-left"> PAID</th>
                    <th className="px-5 text-left"> DELIVERED</th>
                    <th className="px-5 text-left"> ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b">
                      <td className="p-5">{order._id.substring(20, 24)}</td>
                      <td className="p-5">
                        {order.user ? order.user.name : "USER DELETED"}
                      </td>
                      <td className="p-5">
                        {order.createdAt.substring(0, 10)}
                      </td>
                      <td className="p-5">{order.finalAmount}</td>
                      <td className="p-5">
                        {order.isPaid
                          ? `${order.paidAt.substring(0, 10)}`
                          : "pay pending"}
                      </td>
                      <td className="p-5">
                        {order.isDelivered
                          ? `${order.deliveredAt.substring(0, 10)}`
                          : "delivery pending"}
                      </td>
                      <td className="p-5">
                        <Link
                          className="text-blue-500 underline"
                          to={`/order/${order._id}`}
                        >
                          Details
                        </Link>
                      </td>
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
