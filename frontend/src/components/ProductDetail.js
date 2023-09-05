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
    <div className="product-detail my-5 mx-10 flex gap-x-10">
      <div className="image w-[35%]">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info flex flex-col gap-y-1 w-fit">
        <div className="font-bold text-2xl">{product.name}</div>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <div>Price: {product.price}</div>
        <div>Description: {product.description}</div>
        <div>
          Status:{" "}
          {product.countInStock > 0 ? (
            <span className="bg-green-500 w-fit px-2 py-1 text-white rounded-md">
              Available
            </span>
          ) : (
            <span className="bg-gray-500 w-fit px-2 py-1 text-white rounded-md">
              Out of Stock
            </span>
          )}
        </div>
        {product.countInStock > 0 && (
          <button
            onClick={addToCartHandler}
            className="w-fit px-4 py-1 bg-yellow-400 font-semibold my-4 cursor-pointer rounded-md"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};
