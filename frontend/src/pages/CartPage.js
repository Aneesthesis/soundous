import React, { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Store } from "../Store";
import { toast } from "react-toastify";

export const CartPage = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();

  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(
      `https://soundous-api.onrender.com/api/products/x/${item._id}`
    );
    if (data.countInStock < quantity) {
      toast.warning("Sorry. Product out of Stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  const removeItemHandler = (item) => {
    ctxDispatch({
      type: "CART_REMOVE_ITEM",
      payload: item,
    });
  };

  const checkoutHandler = () => {
    navigate("/signin?redirect=/shipping");
  };

  return (
    <div className="m-8 md:mx-48">
      <h1 className="text-2xl font-semibold mb-5">Shopping Cart</h1>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      {cartItems.length === 0 ? (
        <div className="bg-blue-100 text-indigo-500 mx-auto w-fit px-10 py-2 rounded-md">
          Cart is empty.{" "}
          <Link className="underline text-blue-700" to="/">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-y-4 md:flex-row md:gap-x-4 justify-between">
          <ol className="cart-items w-full lg:w-3/4 space-y-4">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between border-b-2 pb-2"
              >
                <div className="flex items-center">
                  <img
                    className="w-16 h-16 object-cover mr-4"
                    src={item.image}
                    alt={item.name}
                  />
                  <div>
                    <Link
                      to={`/products/${item.slug}`}
                      className="text-blue-700 hover:underline"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        disabled={item.quantity === 1}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <i className="fas fa-minus-circle"></i>
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <i className="fas fa-plus-circle"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="price font-semibold text-lg">
                  ${item.price * item.quantity}
                </div>
                <button
                  onClick={() => removeItemHandler(item)}
                  className="text-red-600 hover:text-red-800"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </li>
            ))}
          </ol>
          <div className="subtotal text-xl font-semibold bg-gray-100 w-full lg:w-1/4 p-4 flex flex-col justify-between">
            <span>
              Subtotal (
              {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)} items):
            </span>
            <span className="text-blue-700">
              $
              {cartItems.reduce(
                (acc, curr) => acc + curr.price * curr.quantity,
                0
              )}
            </span>
            <button
              onClick={checkoutHandler}
              disabled={cartItems.length === 0}
              className="bg-yellow-400 text-white rounded-md py-2 px-5 my-4 text-lg hover:bg-yellow-500 self-start"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
