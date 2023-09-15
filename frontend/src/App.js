import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import { Cart } from "./components/UI/Cart";
import { useContext } from "react";
import { Store } from "./Store";
import { CartPage } from "./pages/CartPage";
import { SigninPage } from "./pages/SigninPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShippingAddressPage from "./pages/ShippingAddressPage";
import { SignupPage } from "./pages/SignupPage";
import { PaymentMethodPage } from "./pages/PaymentMethodPage";
import { PlaceOrderPage } from "./pages/PlaceOrderPage";
import OrderPage from "./pages/OrderPage";
import { OrderHistoryPage } from "./pages/OrderHistoryPage";
import { ProfileScreen } from "./pages/ProfileScreen";

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

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  function signoutHandler() {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
  }

  return (
    <BrowserRouter>
      <div className="flex-col max-h-screen">
        <ToastContainer className="bottom-2" limit={1} />
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
            {userInfo ? (
              // <div>
              //   <select className="">
              //     <option>{userInfo.name}</option>
              //     <optgroup label="Navigation">
              //       <option>
              //         <Link to="/profile">User Profile</Link>
              //       </option>
              //       <option>
              //         <Link to="/orderhistory">Order History</Link>
              //       </option>
              //     </optgroup>
              //     <optgroup label="Actions">
              //       <option>
              //         <Link to="#signout" onClick={signoutHandler}>
              //           Sign Out
              //         </Link>
              //       </option>
              //     </optgroup>
              //   </select>
              // </div>
              <div className="dropdown text-amber-300">
                <button className="dropdown-button">Dropdown</button>
                <div className="dropdown-content">
                  <Link to="/profile">Link 1</Link>
                  <Link to="/link2">Link 2</Link>
                  <Link to="/#signout" onClick={signoutHandler}>
                    Sign Out
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <Link to="/signin">Sign In</Link>
              </div>
            )}
          </div>
        </nav>

        <main>
          <section className="products-list">
            <Routes>
              <Route path="/" element={<HomePage />}></Route>
              <Route path="/products/:slug" element={<ProductPage />}></Route>
              <Route path="/cart" element={<CartPage />}></Route>
              <Route path="/signin" element={<SigninPage />}></Route>
              <Route path="/signup" element={<SignupPage />}></Route>
              <Route path="/profile" element={<ProfileScreen />}></Route>
              <Route path="/shipping" element={<ShippingAddressPage />}></Route>
              <Route path="/payment" element={<PaymentMethodPage />}></Route>
              <Route path="/placeorder" element={<PlaceOrderPage />}></Route>
              <Route path="/order/:id" element={<OrderPage />}></Route>
              <Route
                path="/orderhistory"
                element={<OrderHistoryPage />}
              ></Route>
            </Routes>
          </section>
        </main>
        <footer></footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
