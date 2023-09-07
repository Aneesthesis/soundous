import { Helmet } from "react-helmet-async";
import { Form, Link, useLocation } from "react-router-dom";

export const SigninPage = () => {
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  return (
    <div className="mt-8">
      <Helmet>
        <title>Sign In</title>
      </Helmet>

      <form className="flex flex-col mx-4 md:mx-auto bg-stone-600 gap-y-4 border-2 sm:max-w-[75%] md:max-w-[23%] rounded-md py-5 px-6  items-center">
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
          />
        </label>
        <label htmlFor="password">
          <input
            required="true"
            className="border-2 outline-none h-8 rounded-md"
            name="password"
            placeholder="Password"
            type="password"
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
