import CartOverview from "../features/cart/CartOverview";

function Footer() {
  return (
    <footer className="ml-6 rounded-tl-2xl border-l-2 border-t-2 border-stone-700 bg-stone-600 px-5 py-3 text-stone-300">
      <CartOverview />
    </footer>
  );
}

export default Footer;
