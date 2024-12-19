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
    <form onSubmit={handleQuery} className="space-y-2">
      <input
        placeholder="Search order #"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-28 rounded-lg bg-amber-200 px-2 py-1 text-amber-900 transition-all duration-300 placeholder:text-xs placeholder:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-900 sm:w-32 sm:focus:w-36"
      />
      {/* <button
        type="submit"
        className="rounded-md border-2 border-amber-700 px-2"
      >
        Find Order
      </button> */}
    </form>
  );
}

export default SearchOrder;
