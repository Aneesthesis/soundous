import { useContext, useEffect, useState } from "react";
import { Rating } from "./Rating";
import { Store } from "../Store";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export const ProductDetails = ({ product }) => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;

  const [available, setIsAvailable] = useState(true);

  useEffect(() => {
    const existingItem = cart.cartItems.find((x) => x._id === product._id);

    if (existingItem && existingItem.quantity) {
      if (existingItem.quantity === existingItem.countInStock) {
        setIsAvailable(false);
      } else {
        setIsAvailable(true);
      }
    }
  }, [cart.cartItems]);

  const addToCartHandler = async () => {
    const existingItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existingItem ? existingItem.quantity + 1 : 1;

    const { data } = await axios.get(`/api/products/x/${product._id}`);
    if (data.countInStock < quantity) {
      toast.warning("Sorry, this product is out of stock!");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
  };

  return (
    <div className="container mx-auto px-4">
      <div className="product-detail mx-auto my-5 flex flex-col md:flex-row gap-x-10">
        <div className="image sm:w-60 lg:w-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto"
          />
        </div>
        <div className="product-info flex gap-y-2 flex-col w-full">
          <div className="font-semibold text-3xl lg:text-4xl mb-2 text-gray-800">
            {product.name}
          </div>
          <Rating rating={product.rating} numReviews={product.numReviews} />
          <div className="text-gray-700 text-base lg:text-lg">
            <span className="font-medium">Price:</span> ${product.price}
          </div>
          <div className="text-gray-700 text-base lg:text-lg">
            <span className="font-medium"> Description:</span>{" "}
            {product.description}
          </div>
          <div className="text-gray-700 text-base lg:text-lg py-4">
            <span
              className={
                available
                  ? "bg-green-500 px-2 py-1 text-white rounded-md text-sm lg:text-base"
                  : "bg-gray-500 px-2 py-1 text-white rounded-md text-sm lg:text-base"
              }
            >
              {available ? "Available" : "Out of Stock"}
            </span>
          </div>
          <div className="flex flex-col mt-4">
            {available && (
              <button
                onClick={addToCartHandler}
                className="w-full md:w-56 px-2 py-1 bg-yellow-400 font-semibold cursor-pointer rounded-md text-white text-sm lg:text-base hover:bg-yellow-500 focus:outline-none focus:ring focus:ring-blue-300"
              >
                Add to Cart
              </button>
            )}
            <Link
              className="w-full md:w-56 text-center mt-2 px-2 py-1 bg-yellow-400 font-semibold cursor-pointer rounded-md text-white text-sm lg:text-base hover:bg-yellow-500 focus:outline-none focus:ring focus:ring-blue-300"
              to={"/"}
            >
              Back
            </Link>
            {state.cart.cartItems.length > 0 && (
              <Link
                to={"/cart"}
                className="w-full md:w-56 mt-2 text-center px-2 py-1 bg-yellow-400 font-semibold cursor-pointer rounded-md text-white text-sm lg:text-base hover:bg-yellow-500 focus:outline-none focus:ring focus:ring-blue-300"
              >
                Go to Cart
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
