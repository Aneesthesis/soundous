import { useContext, useEffect, useReducer } from "react";
import { LoadingBox } from "../components/UI/LoadingBox";
import { MessageBox } from "../components/UI/MessageBox";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";
import { getError } from "../utils/getError";
import axios from "axios";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQ":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload };
    case "ORDER_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const OrderHistoryPage = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    orders: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQ" });
      try {
        const { data } = await axios.get(
          `https://soundous-api.onrender.com/api/orders/history`,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: `FETCH_FAIL`, payload: getError(error) });
        toast.error(getError(error));
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div className="mx-6 my-3">
      <Helmet>
        <title>Order History</title>
      </Helmet>
      <h1 className="text-3xl">Order History</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox>{error}</MessageBox>
      ) : (
        orders && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DATE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TOTAL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PAID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DELIVERED
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{order._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.orderedOn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.finalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.isPaid ? order.paidAt.substring(0, 10) : "NO"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.isDelivered
                        ? order.deliveredAt.substring(0, 10)
                        : "NO"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          navigate(`/order/${order._id}`);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};
