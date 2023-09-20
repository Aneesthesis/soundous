import React, { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import { Cart } from "./components/UI/Cart";
import { useContext } from "react";
import { Store } from "./Store";
import { CartPage } from "./pages/CartPage";
import { SigninPage } from "./pages/SigninPage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShippingAddressPage from "./pages/ShippingAddressPage";
import { SignupPage } from "./pages/SignupPage";
import { PaymentMethodPage } from "./pages/PaymentMethodPage";
import { PlaceOrderPage } from "./pages/PlaceOrderPage";
import OrderPage from "./pages/OrderPage";
import { OrderHistoryPage } from "./pages/OrderHistoryPage";
import { ProfileScreen } from "./pages/ProfileScreen";
import { DownArrowIcon } from "./components/UI/DownArrow";
import { getError } from "./utils/getError";
import axios from "axios";
import { SearchBox } from "./components/SearchBox";
import { SearchPage } from "./pages/SearchPage";
import { Footer } from "./components/Footer";

// import { useEffect, useState } from 'react';
// import axios from 'axios';

function App() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  // Function to toggle the dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  function signoutHandler() {
    ctxDispatch({ type: "USER_SIGNOUT" });
    setSidebarIsOpen(false);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    localStorage.removeItem("cartItems");
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
        console.log(data);
      } catch (error) {
        toast.error(getError(error));
      }
    };
    fetchCategories();
  }, []);

  return (
    <BrowserRouter>
      <div className="flex flex-col ">
        <ToastContainer
          className="fixed top-0 left-[37%] transform -translate-x-1/2 z-50 w-full max-w-screen-md px-4"
          limit={1}
        />
        <nav className="flex py-3 px-4 md:py-4 md:px-8 lg:py-4 lg:px-10 bg-stone-600 justify-between items-center h-16">
          <button className="w-10">
            <i
              className="w-full fas fa-bars text-amber-400 mr-4"
              onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
            ></i>
          </button>
          <Link
            className="hidden md:block -ml-80 text-amber-400 text-2xl"
            to="/"
          >
            Soundous
          </Link>

          <SearchBox />
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative group">
              <span className="text-white font-semibold absolute -top-1">
                {cart.cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
              </span>
              <Cart />
            </Link>
          </div>
        </nav>

        <div
          className={`top-[72px] max-h-screen ${
            sidebarIsOpen ? "left-0" : "-left-[300px] "
          } w-[300px] h-full border-r border-gray-200 bg-white text-gray-700 absolute top-0 transition-all duration-500 ease-in-out`}
        >
          <div className="p-4">
            <h1 className="text-2xl mb-4 block md:hidden">Soundous</h1>
            {userInfo ? (
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Hi, {userInfo.name}</h2>
              </div>
            ) : (
              <Link
                onClick={() => setSidebarIsOpen(false)}
                to="/signin"
                className="block px-2 py-1 mb-2 text-sm font-semibold text-blue-500 hover:text-blue-700"
              >
                Sign In
              </Link>
            )}

            <ul className="space-y-2">
              {userInfo && (
                <li>
                  {" "}
                  <Link
                    onClick={() => setSidebarIsOpen(false)}
                    to="/profile"
                    className="block px-2 py-1 text-sm hover:text-blue-500"
                  >
                    My Profile
                  </Link>
                </li>
              )}
              {userInfo && (
                <li>
                  <Link
                    onClick={() => setSidebarIsOpen(false)}
                    to="/orderhistory"
                    className="block px-2 py-1 text-sm hover:text-blue-500"
                  >
                    My Orders
                  </Link>
                </li>
              )}
              <li>
                <Link
                  onClick={() => setSidebarIsOpen(false)}
                  to="/search"
                  className="block px-2 py-1 text-sm hover:text-blue-500"
                >
                  Filter
                </Link>
              </li>
              {userInfo && (
                <li>
                  <Link
                    to="/#signout"
                    onClick={signoutHandler}
                    className="block px-2 py-1 text-sm text-red-500 hover:text-red-700"
                  >
                    Sign Out
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        <main>
          <section className="main ">
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
              <Route path="/search" element={<SearchPage />}></Route>
            </Routes>
          </section>
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
