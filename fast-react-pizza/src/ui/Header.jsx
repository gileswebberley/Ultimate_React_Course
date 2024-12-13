import { Link } from "react-router-dom";
import SearchOrder from "../features/order/SearchOrder";

function Header() {
  return (
    <header className="bg-amber-600 text-amber-200">
      {/* IN tailwind you can set a value by using [], eg equivalent to tracking-widest would be tracking-[0.1em] ps tracking is letter-spacing */}
      <Link to="/" className="tracking-widest">
        Fast React Pizza Co
      </Link>
      <SearchOrder />
      <p>User Name</p>
    </header>
  );
}

export default Header;
