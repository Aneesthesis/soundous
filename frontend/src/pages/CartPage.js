import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Store } from "../Store";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const CartPage = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();

  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/x/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product out of Stock");
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
    <div className="m-10">
      <h1 className="text-2xl font-semibold mb-5">Shopping Cart</h1>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      {cartItems.length === 0 ? (
        <div className="bg-blue-100 text-indigo-500 mx-auto w-fit px-10 py-2">
          Cart is empty.{" "}
          <Link className="underline" to="/">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="flex sm:flex-col lg:flex-row relative lg:justify-between">
          <ol className="absolute lg:w-[60%] sm:w-[80%] flex-1">
            {cartItems.map((item) => (
              <li className="flex items-center justify-between  border border-b-2 font-bold">
                <img className="w-[60px]" src={item.image} />
                <Link to={`/products/${item.slug}`}>{item.name}</Link>
                <div className="flex gap-x-2">
                  <button
                    onClick={() => updateCartHandler(item, item.quantity - 1)}
                    disabled={item.quantity === 1}
                  >
                    <i className="fas fa-minus-circle"></i>
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateCartHandler(item, item.quantity + 1)}
                    disabled={item.quantity === item.countInStock}
                  >
                    <i className="fas fa-plus-circle"></i>
                  </button>
                </div>
                <div>{item.price * item.quantity}</div>
                <button onClick={() => removeItemHandler(item)}>
                  <i className="fas fa-trash mr-4"></i>
                </button>
              </li>
            ))}
          </ol>
          <div className="text-2xl border border-b-2 absolute w-[25%] right-[10%]">
            Subtotal ({cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}{" "}
            items):
            {cartItems.reduce(
              (acc, curr) => acc + curr.price * curr.quantity,
              0
            )}
            <button
              onClick={checkoutHandler}
              disabled={cartItems.length === 0}
              className="bg-yellow-400 rounded-md mx-3 my-2 py-2 px-5 text-base border-x-yellow-950"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
