import React, { useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../helper/fetchProducts';
import logger from 'use-reducer-logger';
import Product from '../components/Product';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function HomePage() {
  const [{ loading, products, error }, dispatch] = useReducer(logger(reducer), {
    loading: true,
    products: [],
    error: '',
  });
  //const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const response = await fetchProducts();
        dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="font-bold text-3xl p-5">Featured Fashion</h1>
      {loading ? (
        <div>loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <Product products={products} />
      )}
    </div>
  );
}
