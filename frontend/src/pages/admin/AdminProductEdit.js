import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getError } from "../../utils/getError";
import axios from "axios";
import { LoadingBox } from "../../components/UI/LoadingBox";
import { MessageBox } from "../../components/UI/MessageBox";
import { toast } from "react-toastify";
import { Store } from "../../Store";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQ":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, error: "", data: action.payload };
    case "FETCH_FAILURE":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQ":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

function AdminProductEdit() {
  //   const { search } = useLocation();
  //   const queryParams = new URLSearchParams(search);
  //   const productId = queryParams.get("product-id");
  const { state } = useContext(Store);
  const { userInfo } = state;
  const params = useParams();
  const productId = params["id"];

  const navigate = useNavigate();

  const [{ loading, error, data, loadingUpdate }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
      data: {},
      loadingUpdate: false,
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQ" });
        const { data } = await axios.get(`/api/admin/products/${productId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
        console.log(data);
      } catch (error) {
        dispatch({ type: "FETCH_FAILURE", payload: getError(error) });
      }
    };
    fetchData();
  }, [productId]);

  // Handle changes to form fields and update the state
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Handle form submission (you can replace this with your own logic)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      slug,
      price,
      image,
      featuredImage,
      category,
      brand,
      countInStock,
      description,
    } = formData;
    try {
      dispatch({ type: "UPDATE_REQ" });
      await axios.put(
        `/api/admin/products/${productId}`,
        {
          name,
          slug,
          price,
          image,
          featuredImage,
          category,
          brand,
          countInStock,
          description,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Product Updated");
      navigate("/admin-productlist");
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(getError(error));
    }
    // Access the form data in 'formData' state
    console.log("Form Data:", formData);
  };

  const [formData, setFormData] = useState({
    name: data.name || "",
    slug: data.slug || "",
    price: data.price || "",
    image: data.image || "",
    featuredImage: data.featuredImage || "",
    category: data.category || "",
    brand: data.brand || "",
    countInStock: data.countInStock || "",
    description: data.description || "",
  });

  console.log(formData);

  return (
    <div className="dashboard flex">
      <section className="left w-1/4 p-4">
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

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox>{error.message}</MessageBox>
      ) : (
        <form className="mx-auto max-w-screen-md" onSubmit={handleSubmit}>
          <h1 className="mb-4 text-xl">{`Edit product ${productId}`}</h1>
          <div className="mb-4">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="w-full"
              id="name"
              autoFocus
              value={formData.name}
              required
              onChange={handleChange}
            />
            {error.name && (
              <div className="text-red-400">{error.name.message}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="slug">Slug</label>
            <input
              type="text"
              className="w-full"
              id="slug"
              value={formData.slug}
              required
              onChange={handleChange}
            />
            {error.slug && (
              <div className="text-red-400">{error.slug.message}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              className="w-full"
              id="price"
              value={formData.price}
              required
              onChange={handleChange}
            />
            {error.price && (
              <div className="text-red-400">{error.price.message}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="image">Image</label>
            <input
              type="text"
              className="w-full"
              id="image"
              value={formData.image}
              required
              onChange={handleChange}
            />
            {error.image && (
              <div className="text-red-400">{error.image.message}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="featuredImage">Image</label>
            <input
              type="text"
              className="w-full"
              id="featuredImage"
              value={formData.featuredImage}
              required
              onChange={handleChange}
            />
            {error.category && (
              <div className="text-red-400">{error.featuredImage.message}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              className="w-full"
              id="category"
              value={formData.category}
              required
              onChange={handleChange}
            />
            {error.category && (
              <div className="text-red-400">{error.category.message}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="brand">Brand</label>
            <input
              type="text"
              className="w-full"
              id="brand"
              value={formData.brand}
              required
              onChange={handleChange}
            />
            {error.brand && (
              <div className="text-red-400">{error.brand.message}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="countInStock">Brand</label>
            <input
              type="text"
              className="w-full"
              id="countInStock"
              value={formData.countInStock}
              required
              onChange={handleChange}
            />
            {error.countInStock && (
              <div className="text-red-400">{error.countInStock.message}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              className="w-full"
              id="description"
              value={formData.description}
              required
              onChange={handleChange}
            />
            {error.description && (
              <div className="text-red-400">{error.description.message}</div>
            )}
          </div>
          <div className="mb-4">
            <button disabled={loadingUpdate}>
              {loadingUpdate ? "Processing" : "Click to Update"}
            </button>
          </div>
          <div className="mb-4">
            <Link to={"/admin/products"}>Back</Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default AdminProductEdit;
