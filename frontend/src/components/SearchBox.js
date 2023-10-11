import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState();

  function submitHandler(e) {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : "/search");
  }

  return (
    <form onSubmit={submitHandler}>
      <input
        type="text"
        className="px-4 h-8 w-[65%] outline-none rounded-md text-black"
        onChange={(e) => setQuery(e.target.value)}
        placeholder="search products..."
      />
      <button type="submit">
        <i className="fas fa-search text-amber-400 mx-2"></i>
      </button>
    </form>
  );
}
