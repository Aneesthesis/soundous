import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import { Cart } from "./components/UI/Cart";
import { useContext } from "react";
import { Store } from "./Store";
import { CartPage } from "./pages/CartPage";
// import { useEffect, useState } from 'react';
// import axios from 'axios';

function App() {
  // const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const result = await axios.get('/api/prpducts');
  //     setProducts(result.data);
  //   };
  //   fetchProducts()
  // }, []);

  const { state } = useContext(Store);
  const { cart } = state;

  return (
    <BrowserRouter>
      <div className="flex-col">
        <nav className="flex bg-stone-600 py-4 justify-between">
          <section className="navbar">
            <Link className="ml-2 text-amber-400 text-2xl" to="/">
              Soundous
            </Link>
          </section>
          <div className="flex">
            <Link to="/cart">
              <span className="bg-red-600 text-white font-semibold rounded-[50px] w-4 h-4 text-center">
                {cart.cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
              </span>
              <Cart />
            </Link>
          </div>
        </nav>

        <main>
          <section className="products-list min-h-screen">
            <Routes>
              <Route path="/" element={<HomePage />}></Route>
              <Route path="/products/:slug" element={<ProductPage />}></Route>
              <Route path="/cart" element={<CartPage />}></Route>
            </Routes>
          </section>
        </main>
        <footer className="bg-stone-600 text-white text-center mt-2 p-1">
          🍄 made in Asansol
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
