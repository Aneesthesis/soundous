import { useContext } from "react";
import { Rating } from "./Rating";
import { Store } from "../Store";
import axios from "axios";

export const ProductDetails = ({ product }) => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async () => {
    const existingItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existingItem ? existingItem.quantity + 1 : 1;

    const { data } = await axios.get(`/api/products/x/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry, this product is out of stock!");
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
        <div className="image sm:w-60 lg:w-1/3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto"
          />
        </div>
        <div className="product-info flex flex-col w-full">
          <div className="font-semibold text-3xl mb-2 text-gray-800">
            {product.name}
          </div>
          <Rating rating={product.rating} numReviews={product.numReviews} />
          <div className="text-gray-700 text-lg">Price: $;{product.price}</div>
          <div className="text-gray-700 text-lg">
            Description: {product.description}
          </div>
          <div className="text-gray-700 text-lg">
            Status:{" "}
            {product.countInStock > 0 ? (
              <span className="bg-green-500 px-2 py-1 text-white rounded-md">
                Available
              </span>
            ) : (
              <span className="bg-gray-500 px-2 py-1 text-white rounded-md">
                Out of Stock
              </span>
            )}
          </div>
          {product.countInStock > 0 && (
            <button
              onClick={addToCartHandler}
              className="w-auto px-4 py-2 bg-yellow-500 font-semibold my-4 cursor-pointer rounded-md text-white hover:bg-yellow-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
