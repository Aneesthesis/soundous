import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getError } from "./utils/getError";
import { Store } from "./Store";
import { useContext } from "react";
import { Cart } from "./components/UI/Cart";
import { SearchBox } from "./components/SearchBox";
import { ProtectedRoute } from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import { CartPage } from "./pages/CartPage";
import { SigninPage } from "./pages/SigninPage";
import ShippingAddressPage from "./pages/ShippingAddressPage";
import { SignupPage } from "./pages/SignupPage";
import { PaymentMethodPage } from "./pages/PaymentMethodPage";
import { PlaceOrderPage } from "./pages/PlaceOrderPage";
import OrderPage from "./pages/OrderPage";
import { OrderHistoryPage } from "./pages/OrderHistoryPage";
import { ProfileScreen } from "./pages/ProfileScreen";
import { SearchPage } from "./pages/SearchPage";
import { Footer } from "./components/Footer";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrderPage from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductEdit from "./pages/admin/AdminProductEdit";
import AdminUsers from "./pages/admin/AdminUsers";
import CreateProductForm from "./pages/admin/AdminCreateProduct";
import NotFound from "./pages/NotFound";

function App() {
  const [isSideBarOpen, setSideBarOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const sidebarRef = useRef(null);

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
        const { data } = await axios.get(
          `https://soundous-api.onrender.com/api/products/categories`
        );
        setCategories(data);
      } catch (error) {
        toast.error(getError(error));
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // Function to handle clicks outside of the sidebar
    const handleClickOutside = (e) => {
      if (e.target.classList.contains("hamburger-icon")) {
        setSideBarOpen(!isSideBarOpen);
        return;
      }
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSideBarOpen(false);
      }
    };

    // Add the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSideBarOpen]);

  return (
    <BrowserRouter>
      <div className="flex flex-col ">
        <ToastContainer
          className="fixed top-0 left-[37%] transform -translate-x-1/2 z-50 w-full max-w-screen-md px-4"
          limit={1}
        />
        <nav className="navbar flex py-3 px-4 md:py-4 md:px-8 lg:py-4 lg:px-10 bg-gray-800 text-white justify-between items-center h-16">
          <i className="cursor-pointer hamburger-icon w-fit fas fa-bars text-amber-400 mr-4"></i>

          <Link
            className="hidden lg:block -ml-80 text-amber-400 text-2xl"
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
          className={`sidebar z-50 ${
            isSideBarOpen ? "left-0" : "-left-[300px]"
          } w-[200px] h-full border-r border-gray-200 bg-white text-gray-700 absolute top-0 transition-all duration-500 ease-in-out`}
          ref={sidebarRef}
          style={{
            position: "fixed",
            top: ["65px"], // Stick it to the top of the viewport
          }}
        >
          <div className="p-4">
            <h1 className="text-2xl mb-4 block lg:hidden">
              <Link to={"/"} className="text-amber-400 font-bold">
                Soundous
              </Link>
            </h1>

            {userInfo ? (
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Hi, {userInfo.name}</h2>
              </div>
            ) : (
              <Link
                onClick={() => setSideBarOpen(false)}
                to="/signin"
                className="block px-2 py-1 mb-2 text-sm font-semibold text-blue-500 hover:text-blue-700"
              >
                Sign In
              </Link>
            )}

            <ul className="space-y-2">
              {userInfo && userInfo.isAdmin && (
                <div
                  className="space-y-2"
                  title="Admin"
                  id="admin-nav-dropdown"
                >
                  <h2 className="text-base font-semibold">Admin Menu</h2>
                  <Link
                    className="block px-2 py-1 text-sm hover:text-blue-500"
                    to="/admin-dashboard"
                  >
                    Dashboard
                  </Link>
                  <Link
                    className="block px-2 py-1 text-sm hover:text-blue-500"
                    to="/admin-productlist"
                  >
                    Products
                  </Link>
                  <Link
                    className="block px-2 py-1 text-sm hover:text-blue-500"
                    to="/admin-orderlist"
                  >
                    Orders
                  </Link>
                  <Link
                    className="block px-2 py-1 text-sm hover:text-blue-500"
                    to="/admin-userlist"
                  >
                    Users
                  </Link>
                  <h2 className="text-base font-semibold mt-4">User Menu</h2>
                </div>
              )}
              {userInfo && (
                <li>
                  {" "}
                  <Link
                    onClick={() => setSideBarOpen(false)}
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
                    onClick={() => setSideBarOpen(false)}
                    to="/orderhistory"
                    className="block px-2 py-1 text-sm hover:text-blue-500"
                  >
                    My Orders
                  </Link>
                </li>
              )}
              <li>
                <Link
                  onClick={() => setSideBarOpen(false)}
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

        <main className="pt-16">
          <section className="main min-h-screen text-sm md:text-base ">
            <Routes>
              <Route path="/" element={<HomePage />}></Route>
              <Route path="/products/:slug" element={<ProductPage />}></Route>
              <Route path="/cart" element={<CartPage />}></Route>
              <Route path="/signin" element={<SigninPage />}></Route>
              <Route path="/signup" element={<SignupPage />}></Route>
              <Route path="/shipping" element={<ShippingAddressPage />}></Route>
              <Route path="/payment" element={<PaymentMethodPage />}></Route>
              <Route path="/placeorder" element={<PlaceOrderPage />}></Route>
              <Route path="/search" element={<SearchPage />}></Route>
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin-orderlist"
                element={
                  <ProtectedRoute>
                    <AdminOrderPage />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin-productlist"
                element={
                  <ProtectedRoute>
                    <AdminProducts />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin-userlist"
                element={
                  <ProtectedRoute>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/products/:id"
                element={
                  <ProtectedRoute>
                    <AdminProductEdit />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderPage />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryPage />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin-create-product"
                element={
                  <ProtectedRoute>
                    <CreateProductForm />
                  </ProtectedRoute>
                }
              ></Route>
              <Route path="*" element={<NotFound />}></Route>
            </Routes>
          </section>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
