import { Link, useNavigate } from "react-router-dom";
import { CheckoutProgress } from "../components/checkoutStage";
import { Helmet } from "react-helmet-async";
import { useContext, useEffect, useReducer } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils/getError";
import axios from "axios";
import { LoadingBox } from "../components/UI/LoadingBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_ORDER_REQ":
      return { ...state, loading: true };
    case "ORDER_SUCCESS":
      return { ...state, loading: false };
    case "ORDER_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};
export const PlaceOrderPage = () => {
  const navigate = useNavigate();

  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: {
      paymentMethod,
      shippingAddress: { fullName, address, city, PINCode, country },
    },
  } = state;

  state.cart.itemsPrice = state.cart.cartItems.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
    0
  );
  state.cart.shippingPrice = state.cart.cartItems.price > 2000 ? 100 : 0;
  state.cart.taxes = Math.ceil(state.cart.itemsPrice * 0.12);
  state.cart.finalAmount = Math.round(
    state.cart.itemsPrice + state.cart.shippingPrice + state.cart.taxes,
    2
  );

  useEffect(() => {
    if (state.cart.cartItems.length === 0) {
      navigate("/cart");
    }
    if (!state.cart.paymentMethod) {
      navigate("/payment");
    }
  }, [navigate, state.cart.paymentMethod]);

  const PlaceOrderHandler = async () => {
    try {
      dispatch({ type: "CREATE_ORDER_REQ" });
      const { data } = await axios.post(
        "https://soundous-api.onrender.com/api/orders",
        {
          orderItems: state.cart.cartItems,
          shippingAddress: state.cart.shippingAddress,
          paymentMethod: state.cart.paymentMethod,
          itemsPrice: state.cart.itemsPrice,
          shippingPrice: state.cart.shippingPrice,
          taxes: state.cart.taxes,
          finalAmount: state.cart.finalAmount,
        },
        {
          headers: {
            authorization: `Bearer ${state.userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: "CLEAR_CART" });
      dispatch({ type: "ORDER_SUCCESS" });
      localStorage.removeItem("cartItems");
      navigate(`/order/${data.order._id}`);
    } catch (error) {
      dispatch({ type: "ORDER_FAIL" });
      toast.error(getError(error));
    }
  };

  return (
    <div className="mx-4 my-4 mb-4 flex flex-col md:flex-row justify-evenly">
      <div className="flex flex-col gap-y-5">
        <CheckoutProgress step1 step2 step3 step4></CheckoutProgress>
        <Helmet>
          <title>Order Preview</title>
        </Helmet>
        <h1 className="text-xl md:text-2xl mb-4">Order Preview</h1>
        <section className=" border max-w-2xl">
          <h2 className="text-base font-semibold my-2">Shipping Info</h2>
          <span className="font-bold">Name: </span> <span>{fullName}</span>{" "}
          <br />
          <span className="font-bold">Address: </span>
          <span>{address + city + PINCode + country}</span>
          <br />
          <Link
            className="underline text-blue-700 active:text-blue-500"
            to="/shipping"
          >
            Edit
          </Link>
        </section>
        <section className=" border max-w-2xl">
          <h2 className="text-base font-semibold my-2">Payment Info</h2>
          <span className="font-bold">Method: </span>{" "}
          <span>{paymentMethod}</span> <br />
          <Link
            className="underline text-blue-700 active:text-blue-500"
            to="/payment"
          >
            Edit
          </Link>
        </section>
        <section className="border max-w-2xl">
          <h2 className="text-base font-semibold my-2">Items</h2>
          {state.cart.cartItems.map((item) => (
            <li className="flex items-center justify-between border border-b-2 ">
              <div className="flex flex-row gap-x-6">
                <img className="w-[60px]" src={item.image} />

                <Link
                  className="underline text-blue-700 text-center my-auto"
                  to={`/products/${item.slug}`}
                >
                  {item.name}
                </Link>

                <div className="my-auto">×{item.quantity}</div>
              </div>
              <div className="flex flex-row justify-around gap-x-16 mr-8">
                <div>${item.price * item.quantity}</div>
              </div>
            </li>
          ))}
          <br />
          <Link
            className="underline text-blue-700 active:text-blue-500"
            to="/cart"
          >
            Edit
          </Link>
        </section>
      </div>
      <div>
        <section className="border mt-6 md:mt-28 px-4">
          <h2 className="text-medium text-center font-semibold my-2">
            Order Summary
          </h2>
          <ol>
            <li className="mx-6 flex justify-between gap-x-4">
              <span>Items</span>
              <span className="mr-8">${state.cart.itemsPrice}</span>
            </li>
            <div className="h-[1px]  bg-gray-200 w-[80%] mx-auto my-2"></div>
            <li className="mx-6 flex justify-between gap-x-4">
              <span>Shipping Charges</span>
              <span className="mr-8">${state.cart.shippingPrice}</span>
            </li>
            <div className="h-[1px]  bg-gray-200 w-[80%] mx-auto my-2"></div>
            <li className="mx-6 flex justify-between gap-x-4">
              <span>GST(12%)</span>
              <span className="mr-8">${state.cart.taxes}</span>
            </li>
            <div className="h-[1px]  bg-gray-200 w-[80%] mx-auto my-2"></div>
            <li className="mx-6 flex justify-between gap-x-4">
              <span>Final Amount </span>
              <span className="mr-8">${state.cart.finalAmount}</span>
            </li>
            <div className="h-[1px]  bg-gray-200 w-[80%] mx-auto my-2"></div>
            <button
              onClick={PlaceOrderHandler}
              className="text-white font-semibold ml-[32%] md:ml-[25%] bg-yellow-400 active:bg-yellow-400 my-2 py-1 px-6 border-[1px] border-slate-500 rounded-md "
            >
              Place Order
            </button>
            <div>{loading && <LoadingBox></LoadingBox>}</div>
          </ol>
        </section>
      </div>
    </div>
  );
};
