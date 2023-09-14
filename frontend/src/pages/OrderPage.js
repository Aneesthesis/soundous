import React, { useContext, useEffect, useReducer } from "react";
import { LoadingBox } from "../components/UI/LoadingBox";
import { MessageBox } from "../components/UI/MessageBox";
import { Store } from "../Store";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getError } from "../utils/getError";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQ":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
export default function OrderPage() {
  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
    order: {},
  });

  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const params = useParams();
  const { id: orderId } = params;

  useEffect(() => {
    if (!userInfo) {
      navigate("/signin");
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQ" });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [navigate, userInfo, order, orderId]);

  console.log(order);
  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox>{error}</MessageBox>
  ) : (
    order &&
    order.shippingAddress && (
      <div className="max-w-6xl mx-20 flex flex-col md:flex-row md:gap-x-8">
        <div>
          <section className="text-2xl font-bold my-6">
            Order #{order._id} <br />
            Ordered On: {order.orderedOn.split("T").join("___")}
          </section>

          <section className="border my-4 px-4">
            <h3 className="text-xl font-semibold mb-2">Shipping</h3>
            <span className="font-bold">Name</span>:{" "}
            <span className="font-bold">Address</span>:
            {order.shippingAddress.address} {order.shippingAddress.city}
            {order.shippingAddress.PINCode}
            {order.shippingAddress.country}
            <div
              className={`${
                order.isDelivered
                  ? "bg-green-100 text-black"
                  : "bg-red-100 text-red-700"
              } mb-6 rounded-md py-3 pl-2 mt-2`}
            >
              {order.isDelivered
                ? `Delivered on ${order.deliveredAt}`
                : "Not yet Delivered"}
            </div>
          </section>

          <section className="border my-4 px-4">
            <h3 className="text-xl font-semibold mb-2">Payment</h3>
            <span className="font-bold">Method</span>: {order.paymentMethod}{" "}
            <br />{" "}
            <div
              className={`${
                order.isPaid
                  ? "bg-green-100 text-black"
                  : "bg-red-100 text-red-700"
              } mb-6 rounded-md py-3 pl-2 mt-2`}
            >
              {order.isPaid ? `Paid` : "Payment Pending"}
            </div>
          </section>

          <section className="border my-4 px-4 pb-6">
            <h3 className="text-xl font-semibold mb-2">Items</h3>
            <div>
              {order.orderItems.map((item) => (
                <li className="flex items-center justify-between  border border-b-2">
                  <img className="w-[60px]" src={item.image} />
                  <Link
                    className="underline text-blue-700"
                    to={`/products/${item.slug}`}
                  >
                    {item.name}
                  </Link>
                  <div>{item.quantity}</div>
                  <div>&#8377;{item.price * item.quantity}</div>
                </li>
              ))}
            </div>
          </section>
        </div>

        <div>
          <section className="border mt-6 md:mt-28 px-8">
            <h2 className="text-xl font-semibold my-2">Order Summary</h2>
            <ol>
              <li className="mx-6 flex justify-between">
                <span>Items</span>
                <span className="mr-8">
                  &#8377;
                  {order.itemsPrice}
                </span>
              </li>
              <div className="h-[1px]  bg-gray-200 w-[80%] mx-auto my-2"></div>
              <li className="mx-6 flex justify-between">
                <span>Shipping Charges</span>
                <span className="mr-8">&#8377;{order.shippingPrice}</span>
              </li>
              <div className="h-[1px]  bg-gray-200 w-[80%] mx-auto my-2"></div>
              <li className="mx-6 flex justify-between">
                <span>GST</span>
                <span className="mr-8">&#8377;{order.taxes}</span>
              </li>
              <div className="h-[1px]  bg-gray-200 w-[80%] mx-auto my-2"></div>
              <li className="mx-6 flex justify-between">
                <span>Order Total</span>
                <span className="mr-8">&#8377;{order.finalAmount}</span>
              </li>
              <div className="h-[1px]  bg-gray-200 w-[80%] mx-auto my-2"></div>
            </ol>
          </section>
        </div>
      </div>
    )
  );
}
