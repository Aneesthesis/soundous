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
  // function sidebarClasses() {
  //   console.log(sidebarIsOpen);
  //   return sidebarIsOpen ? "ml-0" : "-ml-300px";
  // }
  return (
    <BrowserRouter>
      <div className=" flex-col max-h-screen">
        <ToastContainer
          className="fixed top-0 left-[37%] transform -translate-x-1/2 z-50 w-full max-w-screen-md px-4"
          limit={1}
        />
        <nav className="flex py-3 px-4 md:py-4 md:px-8 lg:py-4 lg:px-10 bg-stone-600 justify-between items-center">
          <section className="navbar">
            <button>
              <i
                className="fas fa-bars text-amber-400 mr-4"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              ></i>
            </button>
            <Link className="ml-2  text-amber-400 text-2xl" to="/">
              Soundous
            </Link>
          </section>
          <SearchBox />
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative group">
              <span className="text-white font-semibold absolute -top-1">
                {cart.cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
              </span>
              <Cart />
            </Link>

            {userInfo ? (
              <div className="user-options relative">
                <button
                  className="text-yellow-300 flex items-center"
                  onClick={toggleDropdown}
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                >
                  {userInfo.name} <DownArrowIcon />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-md">
                    <Link
                      to="/profile"
                      className="block py-2 px-4 text-gray-800 hover:bg-blue-100 hover:text-blue-700"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orderhistory"
                      className="block py-2 px-4 text-gray-800 hover:bg-blue-100 hover:text-blue-700"
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/#signout"
                      onClick={signoutHandler}
                      className="block py-2 px-4 text-gray-800 hover:bg-blue-100 hover:text-blue-700"
                    >
                      Sign Out
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Link
                  className="text-amber-300 font-medium hover:font-bold"
                  to="/signin"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </nav>
        <div
          className={`${
            sidebarIsOpen ? "left-0" : "-left-[300px]"
          }  border-t-[1px] border-amber-500 absolute px-9 z-10 bg-stone-600 text-amber-400 md:max-w-[200px] transition-all duration-[500ms] ease-in-out`}
        >
          <ol className="flex flex-col gap-y-4 items-center justify-center py-4">
            <h2 className="text-lg font-semibold text-white">Categories</h2>
            {categories.map((category) => (
              <Link
                key={category}
                className="text-white hover:text-yellow-400 transition-colors duration-300"
                to={`/search?category=${category}`}
                onClick={() => setSidebarIsOpen(false)}
              >
                {category}
              </Link>
            ))}
          </ol>
        </div>

        <main>
          <section className="main mr-5">
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
