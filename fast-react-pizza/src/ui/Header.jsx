import { Link } from "react-router-dom";
import SearchOrder from "../features/order/SearchOrder";
import UserName from "../features/user/UserName";

function Header() {
  return (
    <header className="mr-6 flex items-baseline justify-between rounded-br-3xl border-b-2 border-r-2 border-stone-600 bg-amber-600 px-5 py-3 text-amber-200">
      {/* IN tailwind you can set a value by using [], eg equivalent to tracking-widest would be tracking-[0.1em] ps tracking is letter-spacing */}
      <Link to="/" className="text-2xl tracking-widest sm:text-3xl md:text-4xl">
        Fast React Pizza Co
      </Link>
      <SearchOrder />
      <UserName />
    </header>
  );
}

export default Header;
