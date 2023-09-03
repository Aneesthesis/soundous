import axios from 'axios';
import React, { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { ProductDetails } from '../components/ProductDetail';


const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, product: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};



export default function ProductPage() {
  const params = useParams();
  const { slug } = params;
  const [{ loading, product, error }, dispatch] = useReducer(reducer, {
    loading: true,
    product: [],
    error: '',
  });
  //const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const response = await axios.get(`/api/products/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
      }
    };
    fetchData();
  }, [slug]);


  return (
    loading? <div>Loading...</div>: error? <div>{error}</div>:
    <ProductDetails product={product}/>
  );
}
