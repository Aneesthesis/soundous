import { Link, useNavigate } from "react-router-dom";
import { CheckoutProgress } from "../components/checkoutStage";
import { Helmet } from "react-helmet-async";
import { useContext } from "react";
import { Store } from "../Store";

export const PlaceOrderPage = () => {
  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: {
      paymentMethod,
      shippingAddress: { fullName, address, city, PINCode, country },
    },
  } = state;

  return (
    <div className="flex flex-col ml-8 gap-y-5 mt-10">
      <CheckoutProgress step1 step2 step3 step4></CheckoutProgress>
      <Helmet>
        <title>Order Preview</title>
      </Helmet>
      <h1 className="text-3xl mb-4">Order Preview</h1>
      <section className=" border max-w-2xl">
        <h2 className="text-xl font-semibold my-2">Shipping</h2>
        <span className="font-bold">Name: </span> <span>{fullName}</span> <br />
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
        <h2 className="text-xl font-semibold my-2">Payment</h2>
        <span className="font-bold">Method: </span> <span>{paymentMethod}</span>{" "}
        <br />
        <Link
          className="underline text-blue-700 active:text-blue-500"
          to="/payment"
        >
          Edit
        </Link>
      </section>
    </div>
  );
};
