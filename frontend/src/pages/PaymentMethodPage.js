import { Helmet } from "react-helmet-async";
import { CheckoutProgress } from "../components/checkoutStage";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const PaymentMethodPage = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  useEffect(() => {
    if (state.cart.cartItems.length === 0) {
      navigate("/cart");
    }
    if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const [paymentMethodName, setPaymentMethod] = useState(paymentMethod || null);

  const confirmPaymentHandler = (e) => {
    e.preventDefault();
    if (paymentMethodName === null) {
      toast.warning("Please select a mode of payment!");
      return;
    }
    ctxDispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethodName });
    localStorage.setItem("paymentMethod", paymentMethodName);
    navigate("/placeorder");
  };
  return (
    <div className="flex flex-col justify-center items-center gap-y-5 mt-24">
      <CheckoutProgress step1 step2 step3 />
      <div className="bg-white p-6 rounded-md shadow-lg max-w-md">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className=" text-base md:text-xl mb-4">Select a Payment Method</h1>
        <form
          className="flex flex-col gap-y-4"
          onSubmit={confirmPaymentHandler}
        >
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              id="paypal"
              value="PayPal"
              checked={paymentMethodName === "PayPal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-amber-500"
            />
            <span className="text-sm md:text-base">PayPal</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              id="cod"
              value="Cash on Delivery"
              checked={paymentMethodName === "Cash on Delivery"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-amber-500"
            />
            <span className="text-sm md:text-base ">Cash on Delivery</span>
          </label>
          <button
            className="w-fit font-semibold mx-auto bg-yellow-400 border-yellow-400 hover:bg-yellow-500 text-white  px-6 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            type="submit"
          >
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
};
