import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { CheckoutProgress } from "../components/checkoutStage";

export default function ShippingAddressPage() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();

  useEffect(() => {
    if (state.cart.cartItems.length === 0) {
      navigate("/cart");
    }
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
    <div className="flex flex-col items-center justify-center h-screen">
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>
      <CheckoutProgress step1 step2></CheckoutProgress>
      <h1 className="text-3xl my-4">Shipping Address</h1>
      <form
        className="w-[80%] md:max-w-md mx-auto p-4 border rounded-md shadow-lg"
        onSubmit={SubmitAddressHandler}
      >
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            placeholder="Edit Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="border rounded-md px-4 py-2 w-full focus:outline-none focus:border-yellow-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700">
            Address
          </label>
          <input
            type="text"
            id="address"
            placeholder="Edit Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="border rounded-md px-4 py-2 w-full focus:outline-none focus:border-yellow-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="city" className="block text-gray-700">
            City
          </label>
          <input
            type="text"
            id="city"
            placeholder="Edit City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="border rounded-md px-4 py-2 w-full focus:outline-none focus:border-yellow-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="PINCode" className="block text-gray-700">
            PIN CODE
          </label>
          <input
            type="text"
            id="PINCode"
            placeholder="Edit PIN CODE"
            value={PINCode}
            onChange={(e) => setPINCode(e.target.value)}
            required
            className="border rounded-md px-4 py-2 w-full focus:outline-none focus:border-yellow-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="country" className="block text-gray-700">
            Country
          </label>
          <input
            type="text"
            id="country"
            placeholder="Edit Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            className="border rounded-md px-4 py-2 w-full focus:outline-none focus:border-yellow-500"
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-yellow-500 border-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
