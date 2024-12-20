import { Link } from "react-router-dom";
import SearchOrder from "../features/order/SearchOrder";
import UserName from "../features/user/UserName";

function Header() {
  return (
    <header className="mr-6 flex items-end justify-between rounded-br-3xl border-b-2 border-r-2 border-amber-700 bg-amber-600 px-5 py-3 text-amber-200">
      {/* IN tailwind you can set a value by using [], eg equivalent to tracking-widest would be tracking-[0.1em] ps tracking is letter-spacing */}
      <Link
        to="/"
        className="text-pretty text-2xl tracking-wider hover:animate-pulse sm:flex-none sm:text-3xl lg:text-5xl"
      >
        Fast React Pizza Co
      </Link>
      <section className="flex items-end justify-end gap-x-3">
        <UserName />
        <SearchOrder />
      </section>
    </header>
  );
}

export default Header;
