import axios from 'axios';

export const fetchProducts = async () => {
  const result = await axios.get('/api/products');
  return result;
};
