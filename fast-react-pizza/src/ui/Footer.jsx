import { useSelector } from "react-redux";
import CartOverview from "../features/cart/CartOverview";
import { getNumberOfPizzas } from "../features/cart/cartSlice";

function Footer() {
  const emptyCart = !useSelector(getNumberOfPizzas);

  if (emptyCart) return null;

  return (
    <footer className="ml-6 rounded-tl-2xl border-l-2 border-t-2 border-stone-700 bg-stone-600 px-5 py-3 text-stone-300">
      <CartOverview />
    </footer>
  );
}

export default Footer;
