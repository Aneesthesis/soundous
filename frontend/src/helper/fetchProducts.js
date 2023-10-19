import axios from "axios";

export const fetchProducts = async () => {
  const result = await axios.get(
    "https://soundous-api.onrender.com/api/products"
  );
  return result;
};
