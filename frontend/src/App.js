import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
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

  return (
    <BrowserRouter>
      <div className="flex-col">
        <nav className="bg-stone-600 py-4">
          <section className="navbar">
            <Link className="ml-2 text-amber-400 text-2xl" to="/">
              Soundous
            </Link>
          </section>
        </nav>

        <main>
          <section className="products-list min-h-screen">
            <Routes>
              <Route path="/" element={<HomePage />}></Route>
              <Route path="/products/:slug" element={<ProductPage />}></Route>
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
