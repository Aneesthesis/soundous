import React, { useContext, useEffect, useReducer } from "react";
import { LoadingBox } from "../../components/UI/LoadingBox";
import axios from "axios";
import { Store } from "../../Store";
import { toast } from "react-toastify";
import { getError } from "../../utils/getError";
import { MessageBox } from "../../components/UI/MessageBox";
import { Link } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQ":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, dashboardData: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

function AdminDashboard() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ error, loading, dashboardData }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
    dashboardData: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQ" });

        const { data } = await axios.get(`/api/admin/`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err });
        toast.error(getError(err));
      }
    };
    fetchData();
  }, [dispatch]);

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox>{error.message}</MessageBox>
  ) : dashboardData ? (
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
              <Link to="/admin/users" className="text-blue-500 hover:underline">
                Users
              </Link>
            </li>
          </ul>
        </div>
      </section>
      <section className="right w-3/4 p-4">
        <div className="data-card bg-white rounded-lg p-4">
          <h1 className="text-3xl font-semibold mb-4">Dashboard</h1>
          <ul className="space-y-4">
            <li>
              <div className="card-item flex items-center">
                <span className="count text-4xl font-bold">
                  {dashboardData.totalSales}
                </span>
                <span className="label ml-2">Sales</span>
              </div>
            </li>
            <li>
              <div className="card-item flex items-center">
                <span className="count text-4xl font-bold">
                  {dashboardData.usersCount}
                </span>
                <span className="label ml-2">Users</span>
              </div>
            </li>
            <li>
              <div className="card-item flex items-center">
                <span className="count text-4xl font-bold">
                  {dashboardData.productsCount}
                </span>
                <span className="label ml-2">Products</span>
              </div>
            </li>
            <li>
              <div className="card-item flex items-center">
                <span className="count text-4xl font-bold">
                  {dashboardData.ordersCount}
                </span>
                <span className="label ml-2">Orders</span>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  ) : (
    // Render something for the case when dashboardData is falsy
    <div>No dashboard data available.</div>
  );
}

export default AdminDashboard;
