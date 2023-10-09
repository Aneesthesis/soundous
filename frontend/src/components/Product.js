import React from "react";
import { Link } from "react-router-dom";
import Button from "./UI/Button";
import { Rating } from "./Rating";

export default function Product({ products }) {
  return (
    <div className="flex flex-wrap justify-center md:gap-x-4 px-2 my-4 md:px-0 md:my-14 ">
      {products.map((prod) => (
        <div
          className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mb-12 md:hover:w-[25%] duration-300"
          key={prod.slug}
        >
          <Link to={`/products/${prod.slug}`}>
            <img
              src={prod.image}
              alt={prod.name}
              className="w-full max-h-[400px] md:max-h-[310px] object-cover object-center"
            />
          </Link>
          <div className="prod-info mt-4 text-center">
            <Link
              to={`/products/${prod.slug}`}
              className="text-lg font-semibold"
            >
              {prod.name}
            </Link>
            <Rating rating={prod.rating} numReviews={prod.numReviews} />
            <p className="text-xl font-semibold">
              <strong>${prod.price}</strong>
            </p>
            <Button>
              <Link to={`/products/${prod.slug}`}>View Details</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
