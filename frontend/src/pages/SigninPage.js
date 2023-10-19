import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Store } from "../Store.js";
import { toast } from "react-toastify";
import { getError } from "../utils/getError.js";

export const SigninPage = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);

  //redirect to homepage if user already logged in
  useEffect(() => {
    if (state.userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, state.userInfo]);

  const signinHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "https://soundous-api.onrender.com/api/users/signin",
        {
          email,
          password,
        }
      );
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (error) {
      toast.error(getError(error));
    }
  };

  return (
    <div className="flex flex-col items-center gap-y-5 mt-10">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <form
        onSubmit={signinHandler}
        className="max-w-xs mx-auto p-4 border rounded-md shadow-lg"
      >
        <h1 className="text-3xl my-3">Sign In to Continue</h1>
        <label htmlFor="email" className="text-gray-700">
          Email
        </label>
        <input
          required
          className="border rounded-md h-8 outline-none px-4 py-2 w-full mb-4"
          name="email"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password" className="text-gray-700">
          Password
        </label>
        <input
          required
          className="border rounded-md h-8 outline-none px-4 py-2 w-full mb-4"
          name="password"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-center">
          {" "}
          {/* Center the button */}
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            type="submit"
          >
            Sign In
          </button>
        </div>
        <div className="py-4">
          <strong>New Customer? </strong>
          <Link
            className="underline text-yellow-400 hover:text-yellow-700"
            to={`/signup?redirect=${redirect}`}
          >
            Create a new Account
          </Link>
        </div>
      </form>
    </div>
  );
};
