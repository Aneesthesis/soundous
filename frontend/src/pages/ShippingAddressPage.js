import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { CheckoutProgress } from "../components/checkoutStage";

export default function ShippingAddressPage() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.userInfo) {
      navigate("/signin?redirect=/shipping");
    }
  }, [state.userInfo]);

  const [fullName, setFullName] = useState(
    state.cart.shippingAddress.fullName || ""
  );
  const [address, setAddress] = useState(
    state.cart.shippingAddress.address || ""
  );
  const [city, setCity] = useState(state.cart.shippingAddress.city || "");
  const [PINCode, setPINCode] = useState(
    state.cart.shippingAddress.PINCode || ""
  );
  const [country, setCountry] = useState(
    state.cart.shippingAddress.country || ""
  );

  function SubmitAddressHandler(e) {
    e.preventDefault();
    ctxDispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: {
        fullName,
        address,
        city,
        PINCode,
        country,
      },
    });

    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({
        fullName,
        address,
        city,
        PINCode,
        country,
      })
    );
    navigate("/payment");
  }
  return (
    <div className="flex flex-col items-center gap-y-5 mt-10">
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>
      <CheckoutProgress step1 step2></CheckoutProgress>
      <h1 className="text-3xl">Shipping Address</h1>
      <form className="flex flex-col gap-y-3" onSubmit={SubmitAddressHandler}>
        <input
          className="border rounded-md h-8 outline-none border-amber-500"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
        ></input>
        <label></label>
        <input
          className="border rounded-md h-8 outline-none border-amber-500"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
        ></input>
        <label></label>
        <input
          className="border rounded-md h-8 outline-none border-amber-500"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
        ></input>
        <label></label>
        <input
          className="border rounded-md h-8 outline-none border-amber-500"
          value={PINCode}
          onChange={(e) => setPINCode(e.target.value)}
          placeholder="PIN CODE"
        ></input>
        <label></label>
        <input
          className="border rounded-md h-8 outline-none border-amber-500"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country"
        ></input>
        <button className="bg-yellow-400 active:bg-yellow-500 w-fit py-1 px-2 rounded-md mx-auto">
          Continue
        </button>
      </form>
    </div>
  );
}
