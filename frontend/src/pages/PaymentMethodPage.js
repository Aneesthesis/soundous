import { Helmet } from "react-helmet-async";
import { CheckoutProgress } from "../components/checkoutStage";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";

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

  const [paymentMethodName, setPaymentMethod] = useState(paymentMethod || "");

  const confirmPaymentHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethodName });
    localStorage.setItem("paymentMethod", paymentMethodName);
    navigate("/placeorder");
  };
  return (
    <div className="flex flex-col items-center gap-y-5 mt-10">
      {" "}
      <CheckoutProgress step1 step2 step3></CheckoutProgress>
      <div>
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className="text-3xl mb-4">Payment Method</h1>
        <form
          className="flex flex-col gap-y-3"
          onSubmit={confirmPaymentHandler}
        >
          <label>
            <input
              type="radio"
              value="PayPal"
              checked={paymentMethodName === "PayPal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            PayPal
          </label>
          <label>
            <input
              type="radio"
              value="Stripe"
              checked={paymentMethodName === "Stripe"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Stripe
          </label>
          <button className="bg-yellow-400 active:bg-yellow-500 w-fit py-1 px-2 rounded-md mx-auto">
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
};
