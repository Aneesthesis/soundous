import React, { useContext, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getError } from "../../utils/getError";
import axios from "axios";
import { Store } from "../../Store";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQ":
      return { ...state, loading: true, error: "" };
    case "CREATE_SUCCESS":
      return { ...state, loading: false, error: "" };
    case "CREATE_FAIL":
      return { ...state, loading: false, error: action.payload };
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

const CreateProductForm = () => {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, loadingUpload, errorUpload }, dispatch] = useReducer(
    reducer,
    {
      loading: false,
      error: "",
      loadingUpload: false,
      errorUpload: "",
    }
  );

  const [productData, setProductData] = useState({
    name: "",
    slug: "",
    price: 0,
    category: "",
    image: "",
    brand: "",
    countInStock: 0,
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the onCreate function with the productData
    onCreate(productData);
  };

  const onCreate = async (productData) => {
    if (!window.confirm("Are you sure?")) {
      return;
    }
    dispatch({ type: "CREATE_REQ" });
    try {
      const { data } = await axios.post(
        `https://soundous-api.onrender.com/api/admin/products`,
        {
          name: productData.name,
          slug: productData.slug,
          price: productData.price,
          image: productData.image,
          category: productData.category,
          brand: productData.brand,
          countInStock: productData.countInStock,
          description: productData.description,
        },

        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({ type: "CREATE_SUCCESS" });
      toast.success("Product created successfully");
      console.log(data);
      navigate(`/admin-productlist`);
    } catch (error) {
      dispatch({ type: "CREATE_FAILURE", payload: getError(error) });
      toast.error(getError(error));
    }
  };

  const uploadHandler = async (e) => {
    const url = `https://api.cloudinary.com/v1_1/dbenvvfuy/upload`;
    try {
      dispatch({ type: "UPLOAD_REQ" });
      const {
        data: { signature, timestamp },
      } = await axios(
        `https://soundous-api.onrender.com/api/admin/cloudinary-sign`
      );

      const file = e.target.files[0];
      const imageFormData = new FormData();
      imageFormData.append("file", file);
      imageFormData.append("signature", signature);
      imageFormData.append("api_key", 877411815619814);
      imageFormData.append("timestamp", timestamp);
      const { data } = await axios.post(url, imageFormData);

      dispatch({ type: "UPLOAD_SUCCESS" });
      setProductData({ ...productData, image: data.secure_url });
      toast.success("File uploaded!");
    } catch (error) {
      dispatch({ type: "UPLOAD_FAIL", payload: getError(error) });
      toast.error(getError(error));
    }
  };

  function onCancel() {
    navigate("/admin-productlist");
  }

  return (
    <div className="max-w-md mx-auto mt-4 p-4 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Create New Product</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 font-bold">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 font-bold">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={productData.category}
            onChange={handleChange}
            className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700 font-bold">
            Image URL
          </label>
          <input
            type="text"
            id="image"
            name="image"
            value={productData.image}
            onChange={handleChange}
            className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="imageFile">Upload Image</label>
          <input
            type="file"
            className="w-full"
            id="imageFile"
            onChange={uploadHandler}
          />
          {loadingUpload ? (
            <div>Uploading...</div>
          ) : errorUpload ? (
            <div>{errorUpload}</div>
          ) : (
            ""
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="brand" className="block text-gray-700 font-bold">
            Brand
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={productData.brand}
            onChange={handleChange}
            className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="countInStock"
            className="block text-gray-700 font-bold"
          >
            Count In Stock
          </label>
          <input
            type="number"
            id="countInStock"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-bold"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md mr-2"
          >
            {loading ? "Creating..." : "Create"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
export default CreateProductForm;
