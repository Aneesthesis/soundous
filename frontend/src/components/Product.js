import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Button from "./UI/Button";
import { Rating } from "./Rating";

export default function Product({ products }) {
  return (
    <div className="flex flex-wrap md:flex-nowrap gap-2 content-center justify-center text-center p-4">
      {products.map((prod) => (
        <div key={prod.slug}>
          <Link to={`/products/${prod.slug}`}>
            <img
              className="w-full w-max-[400px]"
              src={prod.image}
              alt={prod.name}
            />
          </Link>
          <div className="prod-info flex-col gap-y-2 mt-4">
            <Link to={`/products/${prod.slug}`}>
              <p>{prod.name}</p>
            </Link>
            <Rating rating={prod.rating} numReviews={prod.numReviews} />
            <p>
              <strong>{prod.price}</strong>
            </p>
          </div>
          <Button>
            {" "}
            <Link to={`/products/${prod.slug}`}>View Details</Link>
          </Button>
        </div>
      ))}
    </div>
  );
}
