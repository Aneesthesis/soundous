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
        className="h-4"
        onChange={(e) => setQuery(e.target.value)}
        placeholder="search products..."
      />
      <button type="submit">
        <i className="fas fa-search"></i>
      </button>
    </form>
  );
}
