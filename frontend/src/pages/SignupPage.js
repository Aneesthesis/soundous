import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Store } from "../Store.js";
import { toast } from "react-toastify";
import { getError } from "../utils/getError.js";

export const SignupPage = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);

  //redirect to homepage if user already logged in
  useEffect(() => {
    if (state.userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, state.userInfo]);

  const signupHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("passwords do not match");
      return;
    }
    try {
      const { data } = await axios.post("/api/users/signup", {
        name,
        email,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (error) {
      toast.error(getError(error));
    }
  };

  return (
    <div className="flex flex-col items-center gap-y-5 my-5">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <form
        onSubmit={signupHandler}
        className="max-w-xs mx-auto p-4 border rounded-md shadow-lg"
      >
        <h1 className="text-3xl mb-3">Sign Up to Continue</h1>
        <label htmlFor="name" className="text-gray-700">
          Name
        </label>
        <input
          required
          className="border rounded-md h-8 outline-none px-4 py-2 w-full mb-4 focus:border-amber-400"
          name="name"
          placeholder="Name"
          type="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="email" className="text-gray-700">
          Email
        </label>
        <input
          required
          className="border rounded-md h-8 outline-none px-4 py-2 w-full mb-4 focus:border-amber-400"
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
          className="border rounded-md h-8 outline-none px-4 py-2 w-full mb-4 focus:border-amber-400"
          name="password"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="confirmPassword" className="text-gray-700">
          Confirm Password
        </label>
        <input
          required
          className="border rounded-md h-8 outline-none px-4 py-2 w-full mb-4 focus:border-amber-400"
          name="confirmPassword"
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div className="flex justify-center">
          <button
            className="bg-amber-400 hover:bg-amber-500 focus:bg-amber-400 text-white font-semibold px-6 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            type="submit"
          >
            Sign Up
          </button>
        </div>
        <div className="py-4">
          <strong>Already have an Account? </strong>
          <Link
            className="underline text-amber-500 hover:text-amber-700"
            to={`/signin?redirect=${redirect}`}
          >
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};
