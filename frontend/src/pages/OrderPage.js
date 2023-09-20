import React, { useContext, useEffect, useReducer } from "react";
import { LoadingBox } from "../components/UI/LoadingBox";
import { MessageBox } from "../components/UI/MessageBox";
import { Store } from "../Store";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getError } from "../utils/getError";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQ":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQ":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS": {
      return { ...state, loadingPay: false, successPay: true };
    }
    case "PAY_FAILURE": {
      return { ...state, loadingPay: false };
    }
    case "PAY_RESET": {
      return { ...state, loadingPay: false, successPay: false };
    }

    default:
      return state;
  }
}
export default function OrderPage() {
  const [{ loading, error, order, loadingPay, successPay }, dispatch] =
    useReducer(reducer, {
      loading: false,
      error: "",
      order: {},
      successPay: false,
      loadingPay: false,
    });

  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const params = useParams();
  const { id: orderId } = params;

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.finalAmount },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAY_REQ" });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          { headers: { authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("Payment Successful");
      } catch (error) {
        dispatch({ type: "PAY_FAILURE", payload: getError(error) });
        toast.error(getError(error));
      }
    });
  }

  function onError(err) {
    toast.error(getError(err));
  }

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
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get("/api/keys/paypal", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      loadPaypalScript();
    }
  }, [navigate, userInfo, order, orderId, paypalDispatch, successPay]);

  console.log(order);
  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox>{error}</MessageBox>
  ) : (
    order &&
    order.shippingAddress && (
      <div className="max-w-6xl mx:5 md:mx-20 flex flex-col md:flex-row md:gap-x-8">
        <div>
          <section className="text-2xl font-bold my-6">
            Order #{order._id} <br />
            Ordered On: {order.orderedOn.split("T").join("___")}
          </section>

          <section className="border my-4 px-4">
            <h3 className="text-xl font-semibold mb-2">Shipping</h3>
            <span className="font-bold">Name</span>:{" "}
            {order.shippingAddress.fullName} <br />
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
                  <div>${item.price * item.quantity}</div>
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
                <span className="mr-8">${order.itemsPrice}</span>
              </li>
              <div className="h-[1px]  bg-gray-200 w-[80%] mx-auto my-2"></div>
              <li className="mx-6 flex justify-between">
                <span>Shipping Charges</span>
                <span className="mr-8">${order.shippingPrice}</span>
              </li>
              <div className="h-[1px]  bg-gray-200 w-[80%] mx-auto my-2"></div>
              <li className="mx-6 flex justify-between">
                <span>GST</span>
                <span className="mr-8">${order.taxes}</span>
              </li>
              <div className="h-[1px]  bg-gray-200 w-[80%] mx-auto my-2"></div>
              <li className="mx-6 flex justify-between">
                <span>Order Total</span>
                <span className="mr-8">${order.finalAmount}</span>
              </li>
              {!order.isPaid && (
                <li>
                  {isPending ? (
                    <LoadingBox />
                  ) : (
                    <div>
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      ></PayPalButtons>
                    </div>
                  )}
                  {loadingPay && <LoadingBox></LoadingBox>}
                </li>
              )}

              <div className="h-[1px]  bg-gray-200 w-[80%] mx-auto my-2"></div>
            </ol>
          </section>
        </div>
      </div>
    )
  );
}
