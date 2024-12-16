import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchOrder() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleQuery(e) {
    e.preventDefault();
    if (!query) return;
    navigate(`/order/${query}`);
    setQuery("");
  }
  return (
    <form onSubmit={handleQuery} className="space-x-3">
      <input
        placeholder="Search for order by id"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-2"
      />
      <button
        type="submit"
        className="rounded-md border-2 border-amber-700 px-2"
      >
        Find Order
      </button>
    </form>
  );
}

export default SearchOrder;
