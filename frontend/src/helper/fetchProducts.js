import axios from "axios";
import { useState } from "react";

export const fetchProducts = async () => {
  const result = await axios.get(
    "https://soundous-api.onrender.com/api/products"
  );
  return result;
};

// export const useManipulateArray = ({ initialArray, task, element }) => {
//   const [array, setArray] = useState(initialArray);

//   if (task === "push") {
//     setArray((prevArray) => [...prevArray, element]);
//   }

//   if (task === "pop") {
//     setArray((prevArray) => prevArray.pop());
//   }

//   return array;
// };

export const useManipulateArray = ({ initialArray, task, element }) => {
  const [array, setArray] = useState(initialArray);

  if (task === "push") {
    setArray((prevArray) => [...prevArray, element]);
  }

  if (task === "pop") {
    setArray((prevArray) => {
      const newArray = [...prevArray];
      newArray.pop();
      return newArray;
    });
  }

  return array;
};
