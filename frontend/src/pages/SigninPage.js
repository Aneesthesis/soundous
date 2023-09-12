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
      const { data } = await axios.post("/api/users/signin", {
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
    <div className="mt-8">
      <Helmet>
        <title>Sign In</title>
      </Helmet>

      <form
        onSubmit={signinHandler}
        className="flex flex-col mx-4 md:mx-auto bg-stone-600 gap-y-4 border-2 sm:max-w-[75%] md:max-w-[23%] rounded-md py-5 px-6  items-center"
      >
        <h1 className="my-3 text-lg text-white font-semibold">
          Sign In to Continue
        </h1>
        <label htmlFor="email">
          <input
            required="true"
            className="border-2 outline-none h-8  rounded-md"
            name="email"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label htmlFor="password">
          <input
            required="true"
            className="border-2 outline-none h-8 rounded-md"
            name="password"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button
          className="text-white bg-amber-400 py-1 px-4 rounded-md  border-[1px] active:bg-amber-500 mb-8 mt-3"
          type="submit"
        >
          Sign In
        </button>
        <div className="text-white pb-4">
          <strong>New Customer?</strong>

          <Link className="underline" to={`/signup?redirect=${redirect}`}>
            {" "}
            Create a new Account
          </Link>
        </div>
      </form>
    </div>
  );
};
