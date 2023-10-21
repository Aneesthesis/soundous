import React, { useContext, useEffect, useReducer } from "react";
import { LoadingBox } from "../../components/UI/LoadingBox";
import axios from "axios";
import { Store } from "../../Store";
import { toast } from "react-toastify";
import { getError } from "../../utils/getError";
import { MessageBox } from "../../components/UI/MessageBox";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

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

        const { data } = await axios.get(
          `https://soundous-api.onrender.com/api/admin/`,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
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
    dashboardData &&
    dashboardData.monthlySalesData && (
      <div className="dashboard flex">
        <Helmet>
          <title>Dashboard</title>
        </Helmet>
        <section className="left w-1/4 p-4">
          <div className="hidden md:block menu-card rounded-lg p-4">
            <h3 className="text-lg md:text-xl font-semibold mb-4">
              Dashboard Menu
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/admin-orderlist"
                  className="text-indigo-600 hover:underline"
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/admin-productlist"
                  className="text-indigo-600 hover:underline"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/admin-userlist"
                  className="text-indigo-600 hover:underline"
                >
                  Users
                </Link>
              </li>
            </ul>
          </div>
        </section>
        <section className="right flex flex-col md:flex-row gap-8 w-screen -ml-24 md:ml-0 md:w-3/4 p-4">
          <div className="data-card bg-indigo-100 rounded-lg p-4">
            <h1 className="text-xl md:text-2xl font-semibold text-indigo-800 mb-4">
              Dashboard
            </h1>
            <ul className="space-y-4">
              <li>
                <div className="card-item flex items-center">
                  <span className="count text-2xl md:text-4xl font-bold text-indigo-800">
                    ${dashboardData.totalSales}
                  </span>
                  <span className="label ml-2 text-gray-600">Sales</span>
                </div>
              </li>
              <li>
                <div className="card-item flex items-center">
                  <span className="count text-2xl md:text-4xl font-bold text-indigo-800">
                    {dashboardData.usersCount}
                  </span>
                  <span className="label ml-2 text-gray-600">Users</span>
                </div>
              </li>
              <li>
                <div className="card-item flex items-center">
                  <span className="count text-2xl md:text-4xl font-bold text-indigo-800">
                    {dashboardData.productsCount}
                  </span>
                  <span className="label ml-2 text-gray-600">Products</span>
                </div>
              </li>
              <li>
                <div className="card-item flex items-center">
                  <span className="count text-2xl md:text-4xl font-bold text-indigo-800">
                    {dashboardData.ordersCount}
                  </span>
                  <span className="label ml-2 text-gray-600">Orders</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="card-item flex flex-col text-indigo-800 bg-indigo-100 rounded-lg p-4">
            <div className="text-xl md:text-2xl font-semibold text-indigo-800 mb-4">
              Monthly Sales Chart
            </div>
            <div>
              <ul className="count text-base md:text-2xl font-bold">
                {dashboardData.monthlySalesData.map((monthlySale) => (
                  <li key={monthlySale._id}>
                    {monthlySale._id}: ${monthlySale.totalMonthlySales}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    )
  ) : (
    <div>No dashboard data available.</div>
  );
}

export default AdminDashboard;
