import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { toast } from "react-toastify";
import { getError } from "../../utils/getError";
import { LoadingBox } from "../../components/UI/LoadingBox";
import { MessageBox } from "../../components/UI/MessageBox";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../../Store";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQ":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, products: action.payload, error: "" };
    case "FETCH_FAILURE":
      return { ...state, loading: false, error: action.payload };
    case "CREATE_REQ":
      return { ...state, loadingCreate: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreate: false };
    case "CREATE_FAILURE":
      return { ...state, loadingCreate: false };
    case "DELETE_SUCCESS":
      return {
        ...state,
        products: state.products.filter(
          (product) => product._id !== action.payload._id
        ),
      };
    default:
      return state;
  }
};

function AdminProducts() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, products, loadingCreate, loadingDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
      products: [],
    });

  const deleteHandler = async (product) => {
    if (
      !window.confirm(`You are about to delete ${product.name}. Are you sure?`)
    ) {
      return;
    }
    try {
      const { data } = await axios.delete(
        `/api/admin/products/${product._id}`,
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({ type: "DELETE_SUCCESS", payload: data });
      toast.success("Product deleted");
    } catch (error) {
      toast.error(getError(error));
    }
  };

  const createHandler = () => {
    navigate("/admin-create-product");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQ" });
        const { data } = await axios.get(`/api/admin/products`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchData();
  }, []);
  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox>{error.message}</MessageBox>
  ) : (
    products && (
      <div className="dashboard flex">
        <section className="hidden md:block left w-1/4 p-4">
          <div className="menu-card bg-white rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4">Dashboard Menu</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/admin-orderlist"
                  className="text-blue-500 hover:underline"
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/admin-productlist"
                  className="text-blue-500 hover:underline"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/admin-userlist"
                  className="text-blue-500 hover:underline"
                >
                  Users
                </Link>
              </li>
            </ul>
          </div>
        </section>

        <section className="overflow-x-auto w-full md:w-3/4 p-4">
          <div className="flex flex-col justify-between sticky top-1">
            <h1 className="mb-4 text-2xl">Admin Products</h1>
            {loadingDelete && <div>Deleting Product</div>}
            <button
              disabled={loadingCreate}
              onClick={createHandler}
              className="bg-yellow-400 text-white rounded-md py-2 px-5 mb-4 text-lg hover:bg-yellow-500"
            >
              {loadingCreate ? "Loading" : "Create"}
            </button>
          </div>

          {loading ? (
            <div>loading products...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left"> ID</th>
                    <th className="px-5 text-left"> NAME</th>
                    <th className="px-5 text-left"> PRICE</th>
                    <th className="px-5 text-left"> CATEGORY</th>
                    <th className="px-5 text-left"> COUNT</th>
                    <th className="px-5 text-left"> RATING</th>
                    <th className="px-5 text-left"> ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b">
                      <td className="p-5">{product._id}</td>

                      <td className="p-5 hover:text-blue-400">
                        <Link to={`/products/${product.slug}`}>
                          {product.name}
                        </Link>
                      </td>
                      <td className="p-5">${product.price}</td>
                      <td className="p-5">{product.category}</td>
                      <td className="p-5 ">{product.countInStock}</td>
                      <td className="p-5">{product.rating}</td>
                      <td className="p-5 flex gap-2">
                        {" "}
                        <Link
                          className="text-blue-500 underline"
                          to={`/admin/products/${product._id}`}
                        >
                          Edit
                        </Link>
                        &nbsp;
                        <button onClick={() => deleteHandler(product)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    )
  );
}

export default AdminProducts;
