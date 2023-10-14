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
      return { ...state, loadingUpdate: true, errorUpdate: "" };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, errorUpdate: "" };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case "UPLOAD_REQ":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return { ...state, loadingUpload: false, errorUpload: "" };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };
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

  const [
    {
      loading,
      error,
      data,
      loadingUpdate,
      loadingUpload,
      errorUpdate,
      errorUpload,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
    data: {},
    loadingUpdate: false,
    loadingUpload: false,
    errorUpdate: "",
    errorUpload: "",
  });

  const [formData, setFormData] = useState({
    name: data.name || "",
    price: data.price || "",
    image: data.image || "",
    featuredImage: data.featuredImage || "",
    category: data.category || "",
    brand: data.brand || "",
    countInStock: data.countInStock || "",
    description: data.description || "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQ" });
        const { data } = await axios.get(`/api/admin/products/${productId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        setFormData(data);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
        console.log(data);
      } catch (error) {
        dispatch({ type: "FETCH_FAILURE", payload: getError(error) });
      }
    };
    fetchData();
  }, [productId, setFormData]);

  // Handle changes to form fields and update the state
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const uploadHandler = async (e) => {
    const url = `https://api.cloudinary.com/v1_1/dbenvvfuy/upload`;
    try {
      dispatch({ type: "UPLOAD_REQ" });
      const {
        data: { signature, timestamp },
      } = await axios(`/api/admin/cloudinary-sign`);

      const file = e.target.files[0];
      const imageFormData = new FormData();
      imageFormData.append("file", file);
      imageFormData.append("signature", signature);
      imageFormData.append("api_key", 877411815619814);
      imageFormData.append("timestamp", timestamp);
      const { data } = await axios.post(url, imageFormData);

      dispatch({ type: "UPLOAD_SUCCESS" });
      setFormData({ ...formData, image: data.secure_url });
      toast.success("File uploaded!");
    } catch (error) {
      dispatch({ type: "UPLOAD_FAIL", payload: getError(error) });
      toast.error(getError(error));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, price, image, category, brand, countInStock, description } =
      formData;
    try {
      dispatch({ type: "UPDATE_REQ" });
      await axios.put(
        `/api/admin/products/${productId}`,
        {
          name,
          price,
          image,
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

  return (
    <div className="dashboard flex">
      <section className=" hidden md:block left w-1/4 p-4">
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
        <LoadingBox />
      ) : error ? (
        <MessageBox>{error.message}</MessageBox>
      ) : (
        <form
          className="mx-auto max-w-screen-md flex-1"
          onSubmit={handleSubmit}
        >
          <h1 className="mb-4 text-2xl">{`Edit Product ${productId}`}</h1>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md outline-none"
              id="name"
              autoFocus
              value={formData.name}
              required
              onChange={handleChange}
            />
            {error.name && (
              <div className="text-red-500">{error.name.message}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium">
              Price
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md outline-none"
              id="price"
              value={formData.price}
              required
              onChange={handleChange}
            />
            {error.price && (
              <div className="text-red-500">{error.price.message}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium">
              Image
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md outline-none"
              id="image"
              value={formData.image}
              required
              onChange={handleChange}
            />
            {error.image && (
              <div className="text-red-500">{error.image.message}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="imageFile">Upload Image</label>
            <input
              type="file"
              className="w-full"
              id="imageFile"
              onChange={uploadHandler}
            />
            {loadingUpload && <div>Uploading...</div>}
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium">
              Category
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md outline-none"
              id="category"
              value={formData.category}
              required
              onChange={handleChange}
            />

            {error.category && (
              <div className="text-red-500">{error.category.message}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="brand" className="block text-sm font-medium">
              Brand
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md outline-none"
              id="brand"
              value={formData.brand}
              required
              onChange={handleChange}
            />
            {error.brand && (
              <div className="text-red-500">{error.brand.message}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="countInStock" className="block text-sm font-medium">
              Count in Stock
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md outline-none"
              id="countInStock"
              value={formData.countInStock}
              required
              onChange={handleChange}
            />
            {error.countInStock && (
              <div className="text-red-500">{error.countInStock.message}</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md outline-none"
              id="description"
              value={formData.description}
              required
              onChange={handleChange}
            />
            {error.description && (
              <div className="text-red-500">{error.description.message}</div>
            )}
          </div>
          <div className="mb-4">
            <button
              disabled={loadingUpdate}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {loadingUpdate ? "Processing" : "Click to Update"}
            </button>
          </div>
          <div className="mb-4">
            <Link
              to="/admin-productlist"
              className="text-blue-500 hover:underline"
            >
              Back
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default AdminProductEdit;
